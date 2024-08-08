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
import { setSearchResults, setSearchStartTS, setSearchToast } from '../store/actions/search.actions';
import { SearchJobStatus } from './types';

/**
 * @description - Retrieve file information for the supplied sha256.
 * @param props - A property object containing the users accessToken.
 * @param sha256 - The SHA256 string of the file to search for
 * @param dispatch - The redux dispatch function
 * @param start_ts - The time in milliseconds when the search was initiated.
 * @param rescan - (Optional) if we're reascanning a submission set to true.
 * @param isNewSubmission - (Optional) if the file being searched for is a new submission set to true.
 * @returns 
 */
export async function SearchForSha256(props, sha256, dispatch, start_ts: number,  rescan = false, isNewSubmission = false) {
    let url = `/api/v1/search/by_id`;
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }
        const payload = {
            obj_id: sha256,
            output_detail: 'simple'
        }
        const jobStatus: SearchJobStatus = await axios.post(url,payload, config);
        if (jobStatus?.status === 202 ) {
            dispatch(setSearchStartTS((start_ts)));
            // Retry the operation every 5 seconds
                setTimeout(() => {
                    SearchForSha256(props, sha256,dispatch, start_ts, rescan, isNewSubmission);
                }, 5000);
        } else if (jobStatus?.status === 206  && isNewSubmission) {
            // only retry on a 206 if it is a new submisison (i.e. Just uploaded)
            setTimeout(() => {
                SearchForSha256(props, sha256, dispatch, start_ts, rescan, isNewSubmission);
            }, 5000);
        } else {
            if (jobStatus?.data?.data) {
                dispatch(setSearchResults(jobStatus.data.data));
                return jobStatus;
            } else {
                if (jobStatus.data?.status === 'Error' ) {
                    handleSearchError(jobStatus, dispatch);
                } else {
                    dispatch(setSearchToast(jobStatus.data));
                }
            }
        }
    } catch (err: any) {
        handleError(err, dispatch);
    }
}

/**
 * @description - Handle processing errors which are not thrown.
 * @param jobStatus - The SearchJobStatus result object
 * @param dispatch - The redux dispatch function
 */
function handleSearchError(jobStatus: SearchJobStatus, dispatch: any) {
    let data;
    if (jobStatus.data.status_msg) {
        data = { message: jobStatus.data.status_msg };
        dispatch(setSearchToast(data));
    } else if (jobStatus.data.error_msg) {
        data = { message: jobStatus.data.error_msg };
        dispatch(setSearchToast(data));
    } else {
        data = { message: 'An unkown error occurred' };
        dispatch(setSearchToast(data));
    }
}

/**
 * @description - Create an error message from the thrown error to be displayed in a ToastNotification 
 * @param err - The error thrown 
 * @param dispatch - The redux dispatch function
 */
function handleError(err: any, dispatch: any) {
    let data;
    if (err.response) {
        if (err.response.data && err.response.status === 404) {
            data = {
                message: `${err.response.status} ${err.response.data.status_msg}`
            }
        } else {
            data = {
                message: err.response.status + JSON.stringify(err.response.data)
            };
        }
    } else if (err.request) {
        data = { message: 'No response received.' };
    } else {
        data = { message: err.message };
    }
    dispatch(setSearchToast(data));
}

export default SearchForSha256;
