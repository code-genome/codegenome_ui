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
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Row, Column, ToastNotification, FileUploaderDropContainer } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './UploadPage.module.scss';
import { WorkerUploadFileRequest, WorkerUploadFileResult } from '@/common/types';
import { updateHistoryItem } from '@/store/actions/history.actions';
import { 
  clearUploadError, 
  setUploadError, 
  setUploadSha256, 
  setUploadStatus, 
  clearUploadError2, 
  setUploadError2, 
  setUploadSha2562, 
  setUploadStatus2,
} from '@/store/actions/upload.actions';
import { JobHistoryUtils } from '@/common/JobHistoryUtils';


export interface UploadPageProps {
  setJobDetails({ job_id, status, done, statusText, sha256 }): void;
  setFDone(val: boolean) : void;
  start_ts: React.MutableRefObject<number>;
  end_ts: React.MutableRefObject<number>;
  error_ts: React.MutableRefObject<number>;
  use2: boolean;
};

export const UploadPage: FC<UploadPageProps> = (props) => {
  const dispatch = useDispatch();
  const upload = useSelector((state: any) => state.upload);
  const history = useSelector((state: any) => state.history.history);
  // const navigate = useNavigate()
  const { t } = useTranslation();
  function lcl_clearUploadError() {
    dispatch(props.use2 ? clearUploadError2(): clearUploadError());
  }

  const uploadWorker = useRef({} as Worker);
  


  /**
   * @description Run this event once when the DOM becomes ready.
   * This function sets up the UploadWoker web worker.
   */
  useEffect(() => {
    uploadWorker.current = new Worker('/static/UploadWorker.js');
    uploadWorker.current.onmessage = function (e: MessageEvent) {
      const result: WorkerUploadFileResult = e.data;
      if (result.storableJob) {
        if (result.storableJob.status === 500) {
          dispatch(props.use2 ? setUploadError2(result.storableJob.statusText) : setUploadError(result.storableJob.statusText));
        } 
        if (
          result.existingFile
        ) {
          const subid = JobHistoryUtils.findExisingJobByJobHash(result.storableJob.id, history);
          const rc = {
            job_id: subid,
            done: true,
            status: result.storableJob.status,
            statusText: result.storableJob.statusText,
            sha256: result.storableJob.id
          }
          result.storableJob.subid = subid || '';
          dispatch(updateHistoryItem(result.storableJob));
          props.setJobDetails(rc);
        } else {
          dispatch(props.use2? setUploadStatus2('complete') : setUploadStatus('complete'));
          dispatch(updateHistoryItem(result.storableJob));
          dispatch(props.use2 ? setUploadSha2562(result.storableJob.id)  :setUploadSha256(result.storableJob.id));
          const rc = {
            job_id: result.storableJob.subid,
            done: true,
            status: result.storableJob.status,
            statusText: result.storableJob.statusText,
            sha256: result.storableJob.id
          }
          props.setJobDetails(rc);
        }
        if (result.message && result.statusCode) {
          props.error_ts.current = new Date().getTime();
          props.end_ts.current = new Date().getTime();
        }
      }
    }
  }
  , [])

  async function onChanged(evt, { addedFiles }) {
    console.log(`file added: ${evt.target.value}`);
    let defIter = evt.target.files;
    if (addedFiles) {
      defIter = addedFiles;
    }
    props.start_ts.current = new Date().getTime();
    props.end_ts.current = -1;
    props.error_ts.current = -1;
    // This is subtle, but in order to trigger the render, it's necessary for the value
    // to toggle from it's initial false value to true and back.
    props.setFDone(true);
    props.setFDone(false);
    dispatch(props.use2 ? clearUploadError2(): clearUploadError());
    dispatch(props.use2 ? setUploadStatus2('uploading') : setUploadStatus('uploading'));

    // send a post using files[0]
    for (const element of defIter) {
      console.log(`Attempting to upload ${element.name}`);
      const wufr: WorkerUploadFileRequest = {
        file: element,
        accessToken: ''
      }
      uploadWorker.current.postMessage(wufr);
    }
  }

  const tgtCode = props.use2 ? upload.errorCode2 : upload.errorCode;
  return (
    <Grid fullWidth style={{ minHeight: 'calc(50%)', height: 'calc(50%)', position: 'relative' , backgroundColor: '#25252500', paddingLeft: '16px', paddingRight: '0px'}}>
      <Row style={{ display: 'contents' }}>
        <Column span={16}>
          {tgtCode !== 200 ?
            <ToastNotification
              aria-label="closes notification"
              caption={new Date().toLocaleTimeString()}
              onClose={lcl_clearUploadError}
              onCloseButtonClick={function noRefCheck() { }}
              statusIconDescription="notification"
              subtitle={upload.error}
              title={t('UploadPage.upload_error')}
            /> : ''
          }
          <FileUploaderDropContainer
            className={styles.fudc}
            accept={['*.*']}
            labelText={t('UploadPage.drag_and_drop')}
            name=""
            onAddFiles={onChanged}
            onChange={function noRefCheck() {}}
            tabIndex={0}/>
        </Column>
      </Row>
    </Grid>
  )
}
export default UploadPage;