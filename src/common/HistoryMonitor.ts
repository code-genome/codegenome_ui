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
import { WorkerMonitorResult, WorkerMonitorFileRequest, JobStatusResult } from '@/common/types';
import { JobHistoryUtils } from '@/common/JobHistoryUtils';

/**
 * @description  A worker thread to retrieve the status of a given job submission.
 */
onmessage = function (e: MessageEvent) {
    /**
     * @description - Retrieves job history for the specified submission and posts the status back to the HistoryPage
     * @param wmfr The worker monitor file request
     */
    async function pollStatus(wmfr: WorkerMonitorFileRequest) {
        const props = { accessToken: ''};
        const jobResult: JobStatusResult  | undefined =  await JobHistoryUtils.getJobHistory( wmfr.jobDetails,  props  );
        if (jobResult) {
            const result: WorkerMonitorResult = {
                status: 200,
                statusText: 'OK',
                message: jobResult.message ,
                statusCode: jobResult.statusCode,
                storableJob: jobResult.storableJob 
            };
           postMessage(result);
        }
    }

    try {
        console.log('Received a message...');
        const wmfr: WorkerMonitorFileRequest=  e.data;
        pollStatus(wmfr);
    } catch( err ) {
        console.log('MonitorHistory caugnt an error :facepalm: !');
        const result: WorkerMonitorResult = {
            status: 500,
            statusText: JSON.stringify(err),
        }
        this.postMessage(result);
    }
}