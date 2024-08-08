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
import axios from 'axios';
import { JobStatusResult, StorableJob } from '@/common/types';
/**
 * @description Query the status of an existing job.
 * @param accessToken The access token for the currently logged in user.
 * @param dispatch The redux dispatch function
 * @param jobid - The job id whose status is to be updated.
 */
export async function GetJobStatus(
     accessToken: string,
     jobDetails: { job_id: string, status: number, done: boolean, statusText: string, sha256: string }
     ) : Promise< JobStatusResult> {
    const url = `/api/v1/status/job/${jobDetails.job_id}`;
    try {
        const config = {
            headers : {
                'Authorization': `Bearer ${accessToken}`
            }}    
        const jobStatus: {data: {  status: string, file_id: string, ret_status: string}, status: number, statusText: string, storableJob: StorableJob } = await axios.get(url,config);
        const storableJob: StorableJob = {
          id: '',
          jobstatus: '',
          status: 50,
          statusText: '',
          subid: '',
          submitted_time: 0
        }
        storableJob.subid = jobDetails.job_id;
        storableJob.id = jobDetails.sha256;
        storableJob.jobstatus = jobStatus.data.status;
        // special case.  If the internal job status is "Error", set the status to be 500
        if (storableJob.jobstatus === 'Error') {
          storableJob.status = 500;
          storableJob.statusText = jobStatus['data']['status_msg'];
          // Now step on the return value
          jobStatus.status = 500;
          jobStatus.statusText = jobStatus['data']['status_msg'];
        } else {
          storableJob.status = jobStatus.status;
          storableJob['statusText'] = jobStatus.statusText;
        }
        storableJob['filehash'] = jobDetails.sha256;
        jobStatus.storableJob = storableJob
        return jobStatus;
    } catch (err: any) {
                // Need to maintain the details of the requested job in the response
                const storableJob: StorableJob = {
                  id: jobDetails.sha256,
                  jobstatus: 'unknown',
                  status: 500,
                  statusText: jobDetails.statusText,
                  subid: jobDetails.job_id,
                  submitted_time: -1
                }
      
          if (!err['response']) {
            if (err['name'] === 'AxiosError') {
              const moreDetails = err.toJSON();
              moreDetails['storableJob'] = storableJob;
              return moreDetails;
            }
          }
          const result = {
            message: err.message,
            statusCode: err['response'] ? err['response'].status : err['code'] === 'ERR_NETWORK' ? 403 : 500,
            storableJob
          }
          return result;
        }
}
