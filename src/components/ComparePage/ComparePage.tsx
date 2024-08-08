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
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '@carbon/ibm-products';
import { ElapsedTimeLoader } from "@/components/ElapsedTimeLoader/ElapsedTimeLoader";
import { useTranslation } from 'react-i18next';
import styles from './ComparePage.module.scss';
import { Theme, Grid, Row, Column, Search, ToastNotification } from '@carbon/react';
import { compareClearFailed, compareSetLoading, compareSetSearchHashes, compareSetStartTS } from '@/store/actions/compare.actions';
import { updateHistoryItem } from '@/store/actions/history.actions';
import { compareFileHashes } from '@/common/CompareFileHashes';
import CompareResultsTable from '../CompareResultsTable/CompareResultsTable';
import { useParams, useNavigate } from 'react-router-dom';
import UploadPage from '../UploadPage/UploadPage';
import { PercentBoxesV2 as PercentBoxes } from '@/components/PercentBoxesV2';
import { Button } from '@carbon/react';
import { JobHistoryUtils } from '@/common/JobHistoryUtils';
import { JobStatusResult } from '@/common/types';
import { Repeat } from '@carbon/icons-react';


/**
 * @description - A React ComparePage function to render the binary file comparision page.
 * Redux holds the state information for the comparision.
 * @param props - function properties object
 * @returns A JSX page for binary comparision of two files
 */
export default function ComparePage(props) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const loading = useSelector((state: any) => state.compare.compareLoading);
  const start_ts = useSelector((state: any) => state.compare.start_ts);
  const end_ts = useSelector((state: any) => state.compare.end_ts);
  const error_ts = useSelector((state: any) => state.compare.error_ts);
  const compareFailed = useSelector((state: any) => state.compare.compareFailed);
  const compareError = useSelector((state: any) => state.compare.compareError.message);
  const history = useSelector((state: any) => state.history.history);
  const [jobDetails1, setJobDetails1] = useState({ job_id: '', status: 201, done: false, statusText: '', sha256: '' });
  const [jobDetails2, setJobDetails2] = useState({ job_id: '', status: 201, done: false, statusText: '', sha256: '' });
  const navigate = useNavigate();
  const { sha256_p1, sha256_p2 } = useParams();
  const jobHistoryRef = useRef(getJobHistory);
  const f1_start_ts = useRef(-1);
  const f1_end_ts = useRef(-1);
  const f1_error_ts = useRef(-1);
  const f2_start_ts = useRef(-1);
  const f2_end_ts = useRef(-1);
  const f2_error_ts = useRef(-1);
  const [f1Done, setF1Done] = useState(false); // used to trigger re-render on file processing completion
  const [f2Done, setF2Done] = useState(false); // used to trigger re-render on file processing completion

  /**
   * This hook is invoked whenver the value of sha256_p1 or shaw256_p2 is changed.
   * If both values are not empty strings and non null, then the onSearchChanged 
   * method is invoked.
   */
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      if (sha256_p1 && sha256_p1 !== '') {
        const elem: any = document.getElementById('app-tsx-compare1');
        if (elem) {
          elem.value = sha256_p1;
        }
      }
      if (sha256_p2 && sha256_p2 !== '') {
        const elem: any = document.getElementById('app-tsx-compare2');
        if (elem) {
          elem.value = sha256_p2;
        }
      }
      if (sha256_p1 && sha256_p1 !== '' && sha256_p2 && sha256_p2 !== '') {
        const e = {
          target: {
            value: sha256_p1
          }
        }
        onSearchChanged(e);
      }
    }
  }, [sha256_p1, sha256_p2]);


  /**
   * Reset the error state of the comparsion
   */
  function clearCompareError() {
    dispatch(compareClearFailed());
  }

  /**
   * @description When either of the hash string input field values are changed,
   * this method is invoked.  If both hashes are of valid length, then a comparison
   * of the two hashes is executed.
   * @param e The event which triggerd the change
   */
  function onSearchChanged(e) {
    // const sha256: string = e.target.value;
    // Pull the value(s) from both imput fields and only invoke search if both are specified.
    let sha256_1: any;
    const elem1: any = document.getElementById('app-tsx-compare1');
    if (e.target.id === 'app-tsx-compare1') {
      sha256_1 = e.target.value;
    } else {
      sha256_1 = elem1.value;
    }
    const elem2: any = document.getElementById('app-tsx-compare2');
    let sha256_2: any;
    if (e.target.id === 'app-tsx-compare2') {
      sha256_2 = e.target.value;
    } else {
      sha256_2 = elem2.value;
    }

    const sha256_1_isOK = (sha256_1 !== '' && sha256_1 !== undefined && sha256_1.length === 64);
    const sha256_2_isOK = (sha256_2 !== '' && sha256_2 !== undefined && sha256_2.length === 64);

    if (sha256_1_isOK && sha256_2_isOK) {
      navigate((`/compare/${sha256_1}/${sha256_2}`));
      dispatch(compareSetLoading(true))
      dispatch(compareClearFailed());
      dispatch(compareSetSearchHashes({ hash1: sha256_1, hash2: sha256_2 }));
      const now = new Date().getTime();
      dispatch(compareSetStartTS(now));
      compareFileHashes(props.accessToken, dispatch, sha256_1, sha256_2, now);
    }
  }

  async function getJobHistory(jobDetails: { job_id: string, status: number, done: boolean, statusText: string, sha256 }) {
    const jsr: JobStatusResult | undefined  = await JobHistoryUtils.getJobHistory(jobDetails, props);
    return jsr;
  }


  /**
   * @description Find an existing hash for the supplied job id in the redux history.
   * @param job_id - The job id of the job whose hash is to be retrieved from redux history
   * @returns The hash if found, otherwise null.
   */
  function findExisingHashByJobId(job_id: string): string | null {
    const foundList = history.filter((row) => (row.subid === job_id))
    if (foundList.length > 0) {
      return foundList[0].fileid;
    }
    return null
  }

  function findExistingHistoryEntryByJobIdOrHash(wdk: string) : string | null {
    const existingJobId = findExisingHashByJobId(wdk);
    if (existingJobId && existingJobId.length === 64) {
      return existingJobId;
    }
    // ok wdc may not be a job id.  more likely, it's a hash
    const foundList = history.filter((row) => (row.id === wdk));
    if (foundList.length > 0) {
      return foundList[0].fileid; // essentially return wdk
    }
    return null;
  }


  useEffect(() => {
    jobHistoryRef.current = getJobHistory;
  })

  /**
   * When an upload status has been updated, execute this method.
   */
  useEffect(() => {
    // check the status of both jobs.  If the status is 202 for either files, then
    // poll for status until 200 is received for both. 
    if (jobDetails1.status === 200 && jobDetails2.status === 200) {
      // inject the hashes into the url & go!
      const sha256_1_isOK = (jobDetails1.sha256 !== '' && jobDetails1.sha256 !== undefined && jobDetails1.sha256.length === 64);
      const sha256_2_isOK = (jobDetails2.sha256 !== '' && jobDetails2.sha256 !== undefined && jobDetails2.sha256.length === 64);
      if (sha256_1_isOK && sha256_2_isOK) {
        navigate((`/compare/${jobDetails1.sha256}/${jobDetails2.sha256}`));
        dispatch(compareSetLoading(true))
        dispatch(compareClearFailed());
        dispatch(compareSetSearchHashes({ hash1: jobDetails1.sha256, hash2: jobDetails2.sha256 }));
        const now = new Date().getTime();
        dispatch(compareSetStartTS(now));
        const elem1: any = document.getElementById('app-tsx-compare1');
        elem1.value = jobDetails1.sha256
        const elem2: any = document.getElementById('app-tsx-compare2');
        elem2.value = jobDetails2.sha256
        compareFileHashes(props.accessToken, dispatch, jobDetails1.sha256, jobDetails2.sha256, now);
      } else {
        console.log(`hashes are NOT OK :-/`)
      }
    } else {
      console.log(`Job 1: ${jobDetails1.status} Job 2: ${jobDetails2.status}`);
    }

  }, [jobDetails1, jobDetails2]);


  /**
   * Only execute when jobDetails1 has been updated.
   */
  useEffect(() => {
    let timerId;
    if (jobDetails1.status === 202) {
      timerId = setInterval(async () => {
        console.log(`should be monitoring job details for job: ${jobDetails1.job_id}  `);
        // pull the sha256 values from history.
        const jsr: JobStatusResult | undefined  = await jobHistoryRef.current(jobDetails1);
        if (jobDetails1.status !== 202) {
          console.log(`interval timer cleared for job ${jobDetails1.job_id}`);
          clearInterval(timerId);
          if (jsr && jsr.storableJob) {
            if (jsr.storableJob.subid === undefined)
            {
              const subid = JobHistoryUtils.findExisingJobByJobHash(jsr.storableJob.id, history);
              jsr.storableJob.subid = subid || '';
            }
            dispatch(updateHistoryItem(jsr.storableJob));
          }
          // trigger render()
          setJobDetails1({ job_id: jobDetails1.job_id, status: jobDetails1.status, done: true, statusText: jobDetails1.statusText, sha256: jobDetails1.sha256 });
        }
      }, 5000)
      // monitor jobs  loop until job status is 200 for both files.
    }
    if (jobDetails1.status === 200 && jobDetails1.done === true) {
      f1_end_ts.current = new Date().getTime();
      setF1Done(true);
    }
    if (jobDetails1.status === 500 && jobDetails1.done === true) {
      f1_error_ts.current = new Date().getTime();
      setF1Done(true);
    }
  }, [jobDetails1]);

  /**
   * Only execute when jobDetails2 has been updated.
   */
  useEffect(() => {
    let timer2;
    if (jobDetails2.status === 202) {
      timer2 = setInterval(async () => {
        console.log(`should be monitoring job details for job: ${jobDetails2.job_id}  `);
        const jsr: JobStatusResult | undefined  = await jobHistoryRef.current(jobDetails2);
        if (jobDetails2.status !== 202) {
          console.log(`interval timer cleared for job ${jobDetails2.job_id}`);
          clearInterval(timer2);
          if (jsr && jsr.storableJob) {
            if (jsr.storableJob.subid === undefined)
            {
              const subid = JobHistoryUtils.findExisingJobByJobHash(jsr.storableJob.id, history);
              jsr.storableJob.subid = subid || '';
            }
            dispatch(updateHistoryItem(jsr.storableJob));
          }
          setJobDetails2({ job_id: jobDetails2.job_id, status: jobDetails2.status, done: true, statusText: jobDetails2.statusText, sha256: jobDetails2.sha256});
        }
      }, 5000);
    }
    if (jobDetails2.status === 200 && jobDetails2.done === true) {
      f2_end_ts.current = new Date().getTime();
      setF2Done(true);
    }
    if (jobDetails2.status === 500 && jobDetails2.done === true) {
      f2_error_ts.current = new Date().getTime();
      setF2Done(true);
    }

  }, [jobDetails2]);

  function getPercentBox(percentage: number, boxCount: number, fillColor: string, type?: string) {
    if (type) {
      return (
        <PercentBoxes fillColor={fillColor} percentage={percentage} boxCount={boxCount} width={'280'} type='indeterminate' />
      )
    } else {
      return (
        <PercentBoxes fillColor={fillColor} percentage={percentage} boxCount={boxCount} width={'280'} />
      )
    }
  }


  return (
    <>
      <PageHeader className={styles.comparePageHeader} title={{ text: t('appHeader.compareLabel') }} />
      <Grid fullWidth className={styles.compareP32x16}  id={'compare-page'}>
          <Column span={2} className={styles.compareETFile}>
              <ElapsedTimeLoader label={''} start_ts={f1_start_ts.current} end_ts={f1_end_ts.current} error_ts={f1_error_ts.current} />
          </Column>
          <Column span={5} className={styles.compareUploadColumn}>
            <UploadPage setJobDetails={setJobDetails1} start_ts={f1_start_ts} end_ts={f1_end_ts} error_ts={f1_error_ts} setFDone={setF1Done} use2={false} />
            <div className={styles.progressBoxDiv}>
              {jobDetails1.done === false && jobDetails1.job_id !== '' ?
                getPercentBox(100, 5, '#0f62fe', 'indeterminate') : jobDetails1.done === true ?
                  getPercentBox(100, 5, '#0fe80055') : ('')
              }
            </div>
          </Column>
          <Column span={3} className={styles.compareResetColumn}>
            <Button
              className={styles.resetButton}
              kind={'primary'}
              onClick={function () {
                navigate('/compare')
                navigate(0);
              }}
            >Reset</Button>
            <Button
              className={styles.swapButton}
              kind={'secondary'}
              renderIcon={React.forwardRef((props, ref) => (
                <Repeat ref={ref} size={32} {...props} />
              ))}
              onClick={ function () {
                navigate((`/compare/${sha256_p2}/${sha256_p1}`))
                navigate(0);
                dispatch(compareSetLoading(true))
                dispatch(compareClearFailed());
                dispatch(compareSetSearchHashes({ hash2: jobDetails1.sha256, hash1: jobDetails2.sha256 }));
                const now = new Date().getTime();
                dispatch(compareSetStartTS(now));
                const elem1: any = document.getElementById('app-tsx-compare1');
                elem1.value = jobDetails2.sha256
                const elem2: any = document.getElementById('app-tsx-compare2');
                elem2.value = jobDetails1.sha256
                compareFileHashes(props.accessToken, dispatch, jobDetails2.sha256, jobDetails1.sha256, now);
        
              }}
              > {t('ComparePage.swap')}
              </Button>
          </Column>
          <Column span={4}  className={styles.compareUploadColumn}>
            <UploadPage setJobDetails={setJobDetails2} start_ts={f2_start_ts} end_ts={f2_end_ts} error_ts={f2_error_ts} setFDone={setF2Done} use2={true} />
            <div className={styles.progressBoxDiv}>
              {jobDetails2.done === false && jobDetails2.job_id !== '' ?
                getPercentBox(100, 5, '#0f62fe', 'indeterminate')
                : jobDetails2.done === true ?
                  getPercentBox(100, 5, '#0fe80055')
                  : ('')
              }
            </div>
          </Column>
          <Column span={2} className={styles.compareETFile}>
            <ElapsedTimeLoader label={''} start_ts={f2_start_ts.current} end_ts={f2_end_ts.current} error_ts={f2_error_ts.current} />
          </Column>
          <Column span={8}>
          {
               jobDetails1.status > 299 && (
              <ToastNotification
                aria-label="closes notification"
                caption={new Date().toLocaleTimeString()}
                onClose={() => { 
                  setJobDetails1({ job_id: jobDetails1.job_id, done: true, status: 201, statusText: '', sha256: jobDetails1.sha256})
                  f1_error_ts.current = -1; 
                  f1_end_ts.current = -1;
                  f1_start_ts.current = -1;
                }}
                onCloseButtonClick={function noRefCheck() { }}
                statusIconDescription="notification"
                subtitle={jobDetails1.statusText}
                title={t('SearchPage.searchError')}
              />)
              }
          </Column>
          <Column span={8}>
          {
               jobDetails2.status > 299 && (
              <ToastNotification
                aria-label="closes notification"
                caption={new Date().toLocaleTimeString()}
                onClose={() => { 
                  setJobDetails2({ job_id: jobDetails2.job_id, done: true, status: 201, statusText: '', sha256: jobDetails2.sha256})
                  f2_error_ts.current = -1; 
                  f2_end_ts.current = -1;
                  f2_start_ts.current = -1;
                }}
                onCloseButtonClick={function noRefCheck() { }}
                statusIconDescription="notification"
                subtitle={jobDetails2.statusText}
                title={t('SearchPage.searchError')}
              />)
              }
          </Column>
          <Column span={8} className={styles.compareSearchColumn}>
            <Theme theme="g100">
              <Search
                closeButtonLabelText="Clear search input"
                // defaultValue="A default value"
                placeholder="Enter a file hash ..."
                id="app-tsx-compare1"
                data-cy={'app-tsx-compare1'}
                labelText="Hash 1"
                onChange={onSearchChanged}
                onKeyDown={function noRefCheck() { }}
                size="lg"
                className={styles.compareSearchButton}
              />
            </Theme>
          </Column>
        <Row style={{ display: 'contents' }}>
          <Column span={8} className={styles.compareSearchColumn}>
            <Theme theme="g100">
              <Search
                closeButtonLabelText="Clear search input"
                // defaultValue="A default value"
                placeholder="Enter a file hash compare..."
                id="app-tsx-compare2"
                data-cy={'app-tsx-compare2'}
                labelText="Hash 2"
                onChange={onSearchChanged} // not sure I need two different functions here...
                onKeyDown={function noRefCheck() { }}
                size="lg"
                className={styles.compareSearchButton}
              />
            </Theme>
          </Column>
        </Row>
        <Row>
          <Column span={4} className={styles.compareETSpan}>
            {compareFailed || loading ? (
              <ElapsedTimeLoader label={'Hash Compare'} start_ts={start_ts} end_ts={end_ts} error_ts={error_ts} />
            )
              : ('')
            }
          </Column>
        </Row>
        <Row style={{ display: 'contents' }}>
          <Column span={4}>
            {compareFailed && (
              <ToastNotification
                aria-label="closes notification"
                caption={new Date().toLocaleTimeString()}
                onClose={clearCompareError}
                onCloseButtonClick={function noRefCheck() { }}
                statusIconDescription="notification"
                subtitle={compareError}
                title={t('SearchPage.searchError')}
              />)
            }
          </Column>
        </Row>
      </Grid>
      <Grid fullWidth style={{ paddingLeft: '16px', paddingRight: '0px', paddingTop: '16px' }}>
        <Row style={{ display: 'contents' }}>
          <Column span={16}>
            {
              mounted ? (
                <CompareResultsTable />
              ) : ('')
            }
          </Column>
        </Row>

      </Grid>
    </>
  );
}