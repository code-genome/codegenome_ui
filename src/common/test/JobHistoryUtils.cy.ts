import { JobHistoryUtils } from "@/common/JobHistoryUtils";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('JobHistoryUtils', () => {
    describe('getJobHistory', () => {
        const url = `/api/v1/status/job/${'123'}`
        it('should return a JobStatusResult 202', async () => {
            mock.onGet(url).reply(202,{
                "status": "ResultNotReady",
                "start_ts": 1699311368,
                "job_id": "2929567880"
            }
            )
                const jobDetails = {
                job_id: '123',
                status: 202,
                done: false,
                statusText: 'pending',
                sha256: '1234567890'
            }
            const props = {
                accessToken: '1234567890'
            }
            const result = await JobHistoryUtils.getJobHistory(jobDetails, props)
            expect(result).to.be.an('object')
        })
        it('should return a JobStatusResult 200', async () => {
            mock.onGet(url).reply(200,{
                "status": "Success",
                "file_id": "5f4438f11880421a9ffe591ca78ea78b94a051c4af52fba8d14288daec9bd293",
                "ret_status": "new_file"
            }            
            )
                const jobDetails = {
                job_id: '123',
                status: 202,
                done: false,
                statusText: 'pending',
                sha256: '1234567890'
            }
            const props = {
                accessToken: '1234567890'
            }
            const result = await JobHistoryUtils.getJobHistory(jobDetails, props)
            expect(result).to.be.an('object')
        })
        it('should return a JobStatusResult 500', async () => {
            mock.onGet(url).reply(200,{
                "status": "Error",
                "file_id": "10f13cad48be436a4c7b31187920ff1eb19dadfa958a1fd58cf5a761acb4a610",
                "status_msg": "File processing failed."
            }           
            )
                const jobDetails = {
                job_id: '123',
                status: 500,
                done: false,
                statusText: 'pending',
                sha256: '1234567890'
            }
            const props = {
                accessToken: '1234567890'
            }
            const result = await JobHistoryUtils.getJobHistory(jobDetails, props)
            expect(result).to.be.an('object')
        })

    })
    describe('findExisingJobByJobHash', () => {
        it('should return a subid', () => {
            const jobHash = '1234567890'
            const history = [
                {
                    fileid: '1234567890',
                    subid: '123',
                    id: '124', 
                    jobstatus: 'Complete', 
                    status: 200, 
                    statusText: '', 
                    submitted_time: new Date().getTime()
                }
            ]
            const result = JobHistoryUtils.findExisingJobByJobHash(jobHash, history)
            expect(result).to.equal('123')
        })
    })
})