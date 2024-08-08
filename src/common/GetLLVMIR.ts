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
import { 
    functionCompareSetLeftStartTS, 
    functionCompareSetRightStartTS,
    functionCompareSetLeftEndTS,
    functionCompareSetRightEndTS,
    functionCompareSetLeftFailed,
    functionCompareSetRightFailed,
    functionCompareSetLeftLLVMIR,
    functionCompareSetRightLLVMIR
} from '@/store/actions/functionCompare.actions';
import { LLVMIR_query_result } from './types';

/**
 * 
 * @param accessToken The access token for the currently logged in user.
 * @param dispatch The redux dispatch function
 * @param file_sha256 - The file's SHA256 value.
 * @param function_name - The name of the function within the file identified by the file_sha256 parameter.
 * @param isLeft - An indicator used specificaly to determine which state variables to update with progres.
 * (i.e. IFF isLeft is true, then the compareFunctionReducer leftXXX variables are updated.  Otherwise the
 * rightXXX variables are updated.
 * @returns 
 */
export async function getLLVMIR(accessToken: string | undefined, dispatch, file_sha256: string, function_name: string, isLeft: boolean ) {
    const url = '/api/v1/search/gene'
    const include_llvm_ir = true;
    const include_gene_value = false;
    const include_function_names = false;
    const include_asm = true;
    const functionCompareSetStartTs = isLeft ? functionCompareSetLeftStartTS : functionCompareSetRightStartTS;
    const functionCompareSetEndTs = isLeft ? functionCompareSetLeftEndTS : functionCompareSetRightEndTS;
    const functionCompareSetResult = isLeft ? functionCompareSetLeftLLVMIR : functionCompareSetRightLLVMIR;
    const functionCompareSetFailed = isLeft ? functionCompareSetLeftFailed : functionCompareSetRightFailed;
    try {
        // Special case for addition and deletion support.  Return an empty string when funciton_name is undefined or an empty string.
        if (function_name === undefined || function_name === '') {
            const queryStatus: LLVMIR_query_result = {
                data: {
                    data: {
                        id: '',
                        subtype: '',
                        type: 'empty',
                        version: 'n/a',
                        file_offset: 0,
                        canon_bc_size: '0',
                        llvm_ir: '',
                        asm: {
                            metadata: {
                                name: '',
                                start_addr: '',
                                end_addr: ''
                            },
                            asms: [['','','']]
                        }
                    }
                },
                status: 200,
                statusText: 'No function name supplied'
            }
            dispatch(functionCompareSetStartTs(new Date().getTime()));
            dispatch(functionCompareSetEndTs(new Date().getTime()));
            dispatch(functionCompareSetResult(queryStatus));
            return;
        }
        dispatch(functionCompareSetStartTs(new Date().getTime()));
        const config = {
            headers : {
                'Authorization': `Bearer ${accessToken}`,
                'content-type': 'application/json'
            }}    
        // TODO: when @dirkat is ready, uncomment the include_asm
        const payload = {
            gene_id: '',
            file_id: file_sha256,
            function_name,
            include_llvm_ir,
            include_gene_value,
            include_function_names,
            include_asm
        };
        const queryStatus : LLVMIR_query_result = await axios.post(url, payload, config);
        dispatch(functionCompareSetEndTs(new Date().getTime()));
        if (queryStatus.status === 200) {
            dispatch(functionCompareSetResult(queryStatus));
        }
        // return queryStatus;
    } catch (err: any) {
        let data;
        if (err.response) {
            data = {
                message: `${err.response.status} ${err.response.statusText}`
            }
        } else if (err.request) {
            data = { message: err.message }
        }
        dispatch(functionCompareSetFailed(data));
    }
}