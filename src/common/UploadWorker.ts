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
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { StorableJob, WorkerUploadFileRequest, WorkerUploadFileResult } from '@/common/types';

onmessage = function (e: MessageEvent) {
    function getStorableJob(jobStatus: { data: { job: string, job_id: string, file_id?: string }, status: number, statusText: string }, file, sha256) {
        const storableJob: StorableJob = {
            id: jobStatus.data.file_id || '',
            filename: file.name,
            subid: jobStatus.data.job_id,
            jobstatus: jobStatus.data.job,
            status: jobStatus.status,
            statusText: jobStatus.statusText,
            submitted_time: new Date().getTime(),
            fileid: jobStatus.data.file_id,
            filehash: jobStatus.data.file_id
        }
        // special case.  If the internal job status is "Error", set the status to be 500
        if (storableJob['jobstatus'] === 'Error') {
            storableJob['status'] = 500;
            storableJob['statusText'] = jobStatus['data']['status_msg'];
        }
        return storableJob;
    }


    async function uploadFile(file: File, accessToken: string, sha256: string) {
        let url = `/api/v1/add/file`;
        const formData = new FormData();
        formData.append('file', file, file.name);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
            const jobStatus: { data: { job: string, job_id: string, file_id?: string }, status: number, statusText: string } = await axios.post(url, formData, config);
            if (jobStatus.data?.job_id) {
                const storableJob = getStorableJob(jobStatus, file, sha256);
                if (storableJob.status === 500) {
                    const result: WorkerUploadFileResult = {
                        storableJob,
                        status: 500,
                        statusText: storableJob.statusText,
                        existingFile: false
                    };
                    postMessage(result)
                    return
                } else {
                    const result: WorkerUploadFileResult = {
                        storableJob,
                        status: storableJob.status,
                        statusText: storableJob.statusText,
                        existingFile: false
                    };
                    postMessage(result)

                }
            } else {
                const storableJob = getStorableJob(jobStatus, file, sha256);
                storableJob['id'] = jobStatus.data.file_id || sha256;
                const result: WorkerUploadFileResult = {
                    storableJob,
                    status: storableJob.status,
                    statusText: storableJob.statusText,
                    existingFile: true
                };
                postMessage(result)
            }
        } catch (err: any) {
            console.error(`Error: ${JSON.stringify(err)}`);
            const storableJob: StorableJob = {
                id: sha256,
                jobstatus: 'unknown',
                status: 500,
                statusText: '',
                subid: '',
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
            postMessage(result);
        }
    }


    function getSha256(file: File, accessToken: string,) {
        console.log('Upload worker computing SHA256...')
        const fr = new FileReader();
        let sha256 = '';
        fr.onloadend = function (evt: any) {
            if (evt.target.readyState === FileReader.DONE) {
                const base64data = evt.target.result.slice(evt.target.result.indexOf(',') + 1);
                const decoded = CryptoJS.enc.Base64.parse(base64data);
                const words = CryptoJS.SHA256(decoded);
                sha256 = CryptoJS.enc.Hex.stringify(words);
                console.log('Upload worker attempting upload...')
                uploadFile(file, accessToken, sha256);

            }
        }
        fr.readAsDataURL(file);
    }
    console.log('Upload worker received an upload request')
    const wufr: WorkerUploadFileRequest = e.data;
    getSha256(wufr.file, wufr.accessToken);
}