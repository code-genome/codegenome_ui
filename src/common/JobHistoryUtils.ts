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

import { GetJobStatus } from "./GetJobStatus";
import { JobStatusResult, StorableJob } from "@/common/types";

export class JobHistoryUtils {
    static async getJobHistory(jobDetails: { job_id: string, status: number, done: boolean, statusText: string, sha256: string }, props) : Promise<JobStatusResult | undefined> {
        if (jobDetails.status === 202 || jobDetails.status === 500) {
            const jobStatus:JobStatusResult  = await GetJobStatus(props.accessToken, jobDetails);
            if (jobStatus?.status) {
              jobDetails.status = jobStatus.status;
              jobDetails.statusText = jobStatus.statusText ||'';
            }
            return jobStatus;
        } else {
          // special case.  Job history has resolved from 202 to 200. Need to trigger re-invocation of useEffect hook by setting done
          jobDetails.done = true;
        }
      }

    static  findExisingJobByJobHash(jobHash: string, history: StorableJob[]) {
        const foundList = history.filter( (row) => (row.fileid === jobHash))
        if (foundList.length > 0) {
         return foundList[0].subid;
        }
        return undefined;
      }
    
}