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
  *
  */
import axios from 'axios';
import { compareSetFailed, compareSetResults, compareSetStartTS } from '@/store/actions/compare.actions';
import { JobStatus } from './types';


/**
 * @description Adds id fields to each result details entry.  This is necessary for uniqely 
 * identifying each row in a table.
 * @param jobStatus 
 */
function addIdsToData(jobStatus: JobStatus) {
    if (jobStatus.data.results) {
        if (jobStatus.data.results.diff_details && jobStatus.data.results.diff_details.length> 0 ) {
            let i=0;
            for (const entry of  jobStatus.data.results.diff_details) {
                entry['id'] = ''+i;
                i+=1;
            }
        } 
    }
}

/**
 * @description Converts the query filetypes array into a CSV string
 * @param jobStatus 
 */
function createFileTypesString(jobStatus: JobStatus) {
    if (jobStatus.data.query && jobStatus.data.query.length > 0) {
        for (const entry of jobStatus.data.query) {
            entry['filetypesAsCsv']=(entry.filetypes?.toString()||[]);
        }
    }
}

/**
 * @description  Adds the gene_counts value to the query result
 * @param jobStatus 
 */
function moveGeneCounts(jobStatus: JobStatus) {
    if ( jobStatus?.data?.results?.matches) {
        let index=0;
        if (jobStatus.data.query && jobStatus.data.query.length > 0) {
            for (const entry of jobStatus.data.query) {
                entry['gene_counts']=jobStatus.data.results.matches.gene_counts[index];
                index+=1;
            }
        }
    }
}

/**
 * @description Given a jobStatus
 * @param jobStatus 
 */
function computeAndSetStats(jobStatus: JobStatus) {
    if (jobStatus.data?.results?.diff_details) {
        let deletions =0, mismatches =0, additions=0, similar=0, identical = 0
        const total = jobStatus.data.results.diff_details.length;
        for (const entry of jobStatus.data.results.diff_details) {
            switch (entry.op) {
                case '=':
                    identical+=1;
                    break;
                case '~':
                    similar+=1;
                    break;
                case '!':
                    mismatches+=1;
                    break;
                case '+':
                    additions+=1;
                    break;
                case '-':
                    deletions+=1;
                    break;
                default:
                    console.warn(`unexpected operator: ${entry.op} `);
            }
        }

        jobStatus.data.results['stats'] = {
            deletions,
            additions,
            similar,
            identical,
            mismatches,
            deletionsp: Math.ceil((deletions / total)*100),
            additionsp: Math.ceil((additions / total)*100),
            similarp: Math.ceil((similar / total)*100),
            identicalp: Math.ceil((identical / total)*100),
            mismatchesp: Math.ceil((mismatches/total) * 100),
            total
        }
    }
}

/**
 * @description - The method makes the initial post to the compare files by id interface
 * and on 202 result code, continues to poll until an error, or 200 response is received.
 * IFF a 200 response is received, the routine aggregates statistics for render in the
 * ComparePage.
 * @param accessToken - The bearer token to pass to the REST interface
 * @param dispatch - The redux dispatch function
 * @param hash1 - The file hash of the first file to compare
 * @param hash2 - The file hash of the second file to compare
 */
export async function compareFileHashes(accessToken, dispatch, hash1, hash2, start_ts: number) {
    const url = '/api/v1/compare/files/by_file_ids';
    try {
        const config = {
            headers : {
                'Authorization': `Bearer ${accessToken}`,
                'content-type': 'application/json'
            }}    
        const payload = {
            id1: hash1,
            id2: hash2,
            method: "genes_v1_3_1.jaccard_distance_w",
            output_detail: "simple"
        };
        const jobStatus: JobStatus = await axios.post(url,payload,config);
        if (jobStatus && (jobStatus['status'] === 202 ))
        {
            dispatch(compareSetStartTS(start_ts));
            // Retry the operation every 10 seconds?
            setTimeout( () => {
                compareFileHashes(accessToken,dispatch,hash1, hash2, start_ts);
            }, 5000);
        } else {
            addIdsToData(jobStatus);
            createFileTypesString(jobStatus);
            moveGeneCounts(jobStatus);
            computeAndSetStats(jobStatus);
            dispatch(compareSetResults(jobStatus.data));
        }
    } catch (err: any) {
        handleError(err, dispatch);
    }
}

/**
 * @description - Set the error to be displayed in a ToastNotification
 * @param err - Most likely axios error
 * @param dispatch - The redux dispatch function
 */
function handleError(err: any, dispatch: any) {
    let data;
    if (err.response) {
        data = {
            message: err.response.status + JSON.stringify(err.response.data)
        };
    } else if (err.request) {
        data = { message: 'No response received.' };
    } else {
        data = { message: err.message };
    }
    dispatch(compareSetFailed(data));
}
