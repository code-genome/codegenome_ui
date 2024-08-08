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

/**
 * @description Property attributes for a compare query entry
 */
export interface CompareQueryEntry {
    "id": string;
    "sha256": string;
    "type": string;
    "metadata.filesize": number;
    "metadata.name": string;
    "gene_count.genes_v1_3_2"?: number;
    "last_updated": number;
    "filetypes"?: string[];
}
/**
 * Stats for the compare results
 */
export interface MatchInfo {
    "match_count": number;
    "match_ratio": string; // e.g. "30/139"
    "gene_counts": number[];
    "total_matched_gene_size": number;
    "total_query_gene_size": number;
}
/**
 * Each diff entry shares these attributes.
 */
export interface DiffEntry {
    "op": string; // One of ["~","!","=","-","+"
    "f1": string; // name of the function
    "f2": string; // name of the compared function
    "score": number;
    "g1": string; // The gene id of the first function
    "g2": string; // The gene id of the second function
}

/**
 * A submitted job has these properties
 */
export interface StatsEntry {
    "main_query_time": number;
    "dist_compute_time": number;
    "result_prep_time": number;
    "init_prep_time": number;
}

/**
 * The similarity analysis results
 */
export interface CompareResults {
    similarity: number;
    jaccard_distance: number;
    matches: MatchInfo;
    diff_details: DiffEntry[];
}

/**
 * Data returned by Similarity analysis
 */
export interface JobStatusData {
    query: CompareQueryEntry[];
    results: CompareResults;
    stats: StatsEntry;
    status: string; // Success or Failure
}

// Response from axios POST to '/api/v1/compare/files/by_file_ids'
export interface JobStatus {
    config: any;
    data: JobStatusData;
    headers: any; // http headers
    request: any; // http request object
    status: number; // http status code
    statusText: string; // e.g. OK
}
/**
 * Query status result for a previously submitted analysis 
 */
export interface SearchJobStatus {
    config: any;
    data: {
        data: {
            id: string;
            last_updated: number;
            "metadata.filesize": number;
            "metadata.name": string;
            sha256: string;
            type: string;
            "gene_count.genes_v1_3_2"?: number;
        },
        status: string;
        status_msg?: string;
        error_msg?: string;
    }
    headers: any; // http headers
    request: any; // http request object
    status: number; // http status code
    statusText: string; // e.g. OK
}

export interface ProcessedAsmData {
        addrLeft: string,
        addrRight: string,
        mcodeLeft: string,
        mcodeRight: string,
        asmLeft: string,
        asmRight: string
}

export interface LLVMIR_query_result {
    data: {
        data: {
            id: string,
            type: string,
            subtype: string,
            version: string,
            canon_bc_size: string,
            file_offset: number,
            llvm_ir?: string
            asm?: {
                metadata: {
                    name: string,
                    start_addr: string,
                    end_addr: string
                },
                asms: string[][]
                    // addr, mcode, asm
            }
        },
    },
    status: number,
    statusText: string
}

/**
 * If using diffChars then counts are of blocks of characters changed.
 */
export interface DiffStats {
    added: number;
    deleted: number;
    unchanged: number;
    total: number;
}

/**
  @field leftFile - The llvmir source to be compared for changes
  @field rightFile - The llvmir source to be compared with leftFile
 */
export interface WorkerCompareRequest {
    leftFile: string,
    rightFile: string,
    leftAsm?: {
        metadata: {
            name: string,
            start_addr: string,
            end_addr: string
        },
        asms: string[][]
            // addr, mcode, asm
    },
    rightAsm?: {
        metadata: {
            name: string,
            start_addr: string,
            end_addr: string
        },
        asms: string[][]
            // addr, mcode, asm
    }
}


/**
 * @field status: http status code
 * @field statusText: A textual representation of the supplied status code.
 * @field fdiff: an array of arrays in the general form [(-1, "A"), (1, "B"), (0, "ahh!")]
 */
export interface WorkerCompareResult {
    status: number,
    statusText: string,
    diffs: any[],
    addrDiffs: any[],
    mcodeDiffs: any[],
    asmDiffs: any[]
    rowData: { left: DiffMachineCodeDataRow[], right: DiffMachineCodeDataRow[]}
}

export interface WorkerMonitorFileRequest {
    jobDetails: {
        job_id: string,
        status: number,
        done: boolean,
        statusText: string,
        sha256: string
    }
}

export interface WorkerMonitorResult {
    status: number,
    statusText: string,
    storableJob?: StorableJob,
    statusCode?: number,
    message?: string
}

/**
 * @description The interface for the persisted job in redux (i.e. local storage)
 */
export interface StorableJob {
    id: string;
    jobstatus: string;
    status: number;
    statusText: string;
    started?: number;
    subid: string;
    submitted_time: number;
    start_ts?: number;
    end_ts?: number;
    fileid?: string; // holds sha256
    filehash?: string; // holds shaw256
    filename?: string;
}
export interface JobStatusResult {
    data?: { status: string, file_id: string, ret_status: string },
    status?: number,
    statusText?: string,
    storableJob?: StorableJob,
    message?: string, statusCode?: number
}

export interface WorkerUploadFileRequest {
    accessToken: string;
    file: File,
}

export interface WorkerUploadFileResult {
    status: number,
    statusText: string,
    storableJob?: StorableJob,
    statusCode?: number,
    message?: string
    existingFile: boolean
}

export interface DiffMachineCodeDataRow {
    id: number,
    addr: DiffDataFragment[]; // column
    mcode: DiffDataFragment[]; // column
    asm: DiffDataFragment[]; // column
}

/**
 * type - 1 === add, -1 === delete 0 === unchanged/common
 * data - the raw source text
 */
export interface DiffDataFragment {
    type: number;
    data: string;
}