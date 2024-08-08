/**
  * ## This code is part of the Code Genome Framework.
  * ##
  * ## (C) Copyright IBM 2022-2023.
  * ## This code is licensed under the Apache License, Version 2.0. You may
  * ## obtain a copy of this license in the LICENSE.txt file in the root directory
  * ## of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
  * ##
  * ## Any modifications or derivative works of this code must retain this
  * ## copyright notice, and modified files need to carry a notice indicating
  * ## that they have been altered from the originals.
  * ##
  */
import React, { useEffect, useRef, useState } from 'react';
import { Theme, Grid, Row, Column } from '@carbon/react';
import { useDispatch, useSelector } from 'react-redux';
import JobHistoryTable from '../JobHistoryTable/';
import { PageHeader } from '@carbon/ibm-products';
import styles from './HistoryPage.module.scss';
import UploadPage from '../UploadPage';
import { updateHistoryItem } from '@/store/actions/history.actions';
import { ElapsedTimeLoader } from "@/components/ElapsedTimeLoader/ElapsedTimeLoader";
import { useTranslation } from 'react-i18next';
import { JobStatusResult, WorkerMonitorResult } from '@/common/types';
import { JobHistoryUtils } from '@/common/JobHistoryUtils';

/**
 * (Optional) accessToken - A JWT token
 * (Optional) session - Used in AWS deployments
 */
export interface HistoryPageProps {
  accessToken?: string;
  session?: any;
}

/**
 * @description Presents the job submission history, upload control, and elapsed
 * time clock indicating how long the last submitted upload took.  If no uploads
 * have been performed the clock is shown at 00:00:00 seconds.
 * @param props - An instance of HistoryPageProps.
 * @returns A JSX Element
 */
export default function HistoryPage(props: HistoryPageProps) {
  const dispatch = useDispatch();
  const f1_start_ts = useRef(-1);
  const f1_end_ts = useRef(-1);
  const f1_error_ts = useRef(-1);
  const [f1Done, setF1Done] = useState(false); // used to trigger re-render on file processing completion
  const history = useSelector((state: any) => state.history.history);
  const historyWorker = useRef({} as Worker);
  const { t } = useTranslation();
  const monitorHistoryRef = useRef(monitorHistory);
  const jobHistoryRef = useRef(getJobHistory);
  const [jobDetails, setJobDetails] = useState({ job_id: '', status: 201, done: false, statusText: '', sha256: '' });
  let g_interval_timer;

  /**
     * @description Retrieves the full history for the specified job details.
     * @param jobDetails - The job attributes whose full history is to be retrieved.
     * @param out - In/out - Upon return, out will contain the hash of the submitted job.
     */
  async function getJobHistory(jobDetails: { job_id: string, status: number, done: boolean, statusText: string, sha256: string }) {
    const jsr: JobStatusResult | undefined  = await JobHistoryUtils.getJobHistory(jobDetails, props);
    return jsr;
  }

  /**
     * When the dom is ready, set a reference to the getJobHistory function.
     */
  useEffect(() => {
    jobHistoryRef.current = getJobHistory;
  })


  /**
   * Monitor history once per minute.
   */
  async function monitorHistory() {
    for (const row of history) {
      // only check status on files that have a submisison id.
      if ((row['status'] === 202 || row['status'] === 500) && row['subid'] !== '') {
        const jobDetails = {
          job_id: row.subid,
          sha256: row.id,
          status: row.status,
          statusText: '',
          done: false
        };
        historyWorker.current.postMessage({ jobDetails });
      }
    }
  }

  useEffect(() => {
    monitorHistoryRef.current = monitorHistory;
  })

  /**
   * When the dom is ready, start up the history worker and setup
   * an interval timer to queue jobs whose status needs to be updated.
   */
  useEffect(() => {
    let timerId;
    historyWorker.current = new Worker('/static/HistoryMonitor.js');
    historyWorker.current.onmessage = function (e: MessageEvent) {
      const result: WorkerMonitorResult = e.data;
      if (result.status !== 202 && result.storableJob) {
        dispatch(updateHistoryItem(result.storableJob));
      }
    }
    monitorHistoryRef.current();
    timerId = setInterval(() => {
      monitorHistoryRef.current();
    }, 60000);

  }, [])

  async function monitorJobDetails() {
    console.log(`should be monitoring job details for job: ${jobDetails.job_id}  `);
    const jsr: JobStatusResult | undefined  = await jobHistoryRef.current(jobDetails);
    if (jobDetails.status !== 202) {
      console.log(`interval timer cleared for job ${jobDetails.job_id}`);
      clearInterval(g_interval_timer);
      if (jsr?.storableJob) {
        if (jsr.storableJob.subid === undefined)
        {
          const subid = JobHistoryUtils.findExisingJobByJobHash(jsr.storableJob.id, history);
          jsr.storableJob.subid = subid ?? '';
        }
        dispatch(updateHistoryItem(jsr.storableJob));
      }
      // trigger render()
      setJobDetails({ job_id: jobDetails.job_id, status: jobDetails.status, done: true, statusText: jobDetails.statusText, sha256: jobDetails.sha256 });
  }
  }


  useEffect(() => {
    if (jobDetails.status === 202) {
      g_interval_timer = setInterval(monitorJobDetails, 5000);
      // monitor jobs  loop until job status is 200 for both files.
    }
    if (jobDetails.status === 200 && jobDetails.done === true) {
      f1_end_ts.current = new Date().getTime();
      setF1Done(true);
    }
    if (jobDetails.status === 500 && jobDetails.done === true) {
      f1_error_ts.current = new Date().getTime();
      setF1Done(true);
    }
  }, [jobDetails]);

  return (
    <Theme theme="g100" style={{ "--cds-focus": '#00000000', backgroundColor: '#16161600' }}>
      <PageHeader className={styles.historyPageHeader} title={{ text: t('appHeader.historyLabel') }} />
      <Grid fullWidth className={styles.compareP32x16} id={'job-history-page'}>
        <Row style={{ display: 'contents' }}>
          <Column span={3} className={styles.compareSearchColumn}>
            <ElapsedTimeLoader label={''} start_ts={f1_start_ts.current} end_ts={f1_end_ts.current} error_ts={f1_error_ts.current}  />
          </Column>
        </Row>
        <Row style={{ display: 'contents' }}>
          <Column span={3} className={styles.compareSearchColumn}>
            <UploadPage setJobDetails={setJobDetails} start_ts={f1_start_ts} end_ts={f1_end_ts} error_ts={f1_error_ts} setFDone={setF1Done} use2={false} />
          </Column>
        </Row>
      </Grid>
      <Grid fullWidth style={{ paddingLeft: '32px', paddingRight: '0px' }}>
        <Row style={{ display: 'contents' }}>
          <Column span={16}>
            <Theme theme="g100" style={{ backgroundColor: '#16161600' }}>
              <JobHistoryTable isAdminHistory={false} />
            </Theme>
          </Column>
        </Row>
      </Grid>
    </Theme>

  );

}