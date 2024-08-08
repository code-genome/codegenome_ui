export const FUNCTION_COMPARE_SET_LEFT_LOADING = 'FUNCTION_COMPARE_SET_LEFT_LOADING';
export const FUNCTION_COMPARE_SET_LEFT_ERROR = 'FUNCTION_COMPARE_SET_LEFT_ERROR';
export const FUNCTION_COMPARE_SET_LEFT_FAILED = 'FUNCTION_COMPARE_SET_LEFT_FAILED';
export const FUNCTION_COMPARE_SET_LEFT_START_TS = 'FUNCTION_COMPARE_SET_LEFT_START_TS';
export const FUNCTION_COMPARE_SET_LEFT_END_TS = 'FUNCTION_COMPARE_SET_LEFT_END_TS';
export const FUNCTION_COMPARE_SET_LEFT_ERROR_TS = 'FUNCTION_COMPARE_SET_LEFT_ERROR_TS';
export const FUNCTION_COMPARE_SET_LEFT_HASH = 'FUNCTION_COMPARE_SET_LEFT_HASH';
export const FUNCTION_COMPARE_SET_LEFT_LLVMIR = 'FUNCTION_COMPARE_SET_LEFT_LLVMIR';
export const FUNCTION_COMPARE_CLEAR_LEFT_FAILED = 'FUNCTION_COMPARE_CLEAR_LEFT_FAILED';

export const FUNCTION_COMPARE_SET_RIGHT_LOADING = 'FUNCTION_COMPARE_SET_RIGHT_LOADING';
export const FUNCTION_COMPARE_SET_RIGHT_ERROR = 'FUNCTION_COMPARE_SET_RIGHT_ERROR';
export const FUNCTION_COMPARE_SET_RIGHT_FAILED = 'FUNCTION_COMPARE_SET_RIGHT_FAILED';
export const FUNCTION_COMPARE_SET_RIGHT_START_TS = 'FUNCTION_COMPARE_SET_RIGHT_START_TS';
export const FUNCTION_COMPARE_SET_RIGHT_END_TS = 'FUNCTION_COMPARE_SET_RIGHT_END_TS';
export const FUNCTION_COMPARE_SET_RIGHT_ERROR_TS = 'FUNCTION_COMPARE_SET_RIGHT_ERROR_TS';
export const FUNCTION_COMPARE_SET_RIGHT_HASH = 'FUNCTION_COMPARE_SET_RIGHT_HASH';
export const FUNCTION_COMPARE_SET_RIGHT_LLVMIR = 'FUNCTION_COMPARE_SET_RIGHT_LLVMIR';
export const FUNCTION_COMPARE_CLEAR_RIGHT_FAILED = 'FUNCTION_COMPARE_CLEAR_RIGHT_FAILED';

/**
 * @param {*} data : boolean ( true| false)
 */
export function functionCompareSetLeftLoading(data) {
    return { type: FUNCTION_COMPARE_SET_LEFT_LOADING, data}
}

/**
 * @param {*} data : { message: string }
 */
export function functionCompareSetLeftError(data) {
    return { type: FUNCTION_COMPARE_SET_LEFT_ERROR, data}
}

/**
 * @param {*} data : { message: string }
 */
export function functionCompareSetLeftFailed(data) {
    return { type: FUNCTION_COMPARE_SET_LEFT_FAILED, data}
}

/**
 * @param {*} data : time in milliseconds
 */
export function functionCompareSetLeftStartTS(data) {
    return { type: FUNCTION_COMPARE_SET_LEFT_START_TS, data}
}

/**
 * @param {*} data : time in milliseconds or -1 to reset
 */
export function functionCompareSetLeftEndTS(data) {
    return { type: FUNCTION_COMPARE_SET_LEFT_END_TS, data}
}

/**
 * @param {*} data : time in milliseconds or -1 to reset
 */
export function functionCompareSetLeftErrorTS(data) {
    return { type: FUNCTION_COMPARE_SET_LEFT_ERROR_TS, data}
}

/**
 * @param {*} data : string - the hash of file containing the left function
 */
export function functionCompareSetLeftHash(data) {
    return { type: FUNCTION_COMPARE_SET_LEFT_HASH, data}
}

/**
 * @param {*} data the JSON returned by the /api/v1/search/gene rest interface
 */
export function functionCompareSetLeftLLVMIR(data) {
    return { type: FUNCTION_COMPARE_SET_LEFT_LLVMIR, data}
}

export function functionCompareClearLeftFailed() {
    return { type: FUNCTION_COMPARE_CLEAR_LEFT_FAILED }
}

/**
 * @param {*} data : boolean ( true| false)
 */
export function functionCompareSetRightLoading(data) {
    return { type: FUNCTION_COMPARE_SET_RIGHT_LOADING, data}
}

/**
 * @param {*} data : { message: string }
 */
export function functionCompareSetRightError(data) {
    return { type: FUNCTION_COMPARE_SET_RIGHT_ERROR, data}
}

/**
 * @param {*} data : { message: string }
 */
export function functionCompareSetRightFailed(data) {
    return { type: FUNCTION_COMPARE_SET_RIGHT_FAILED, data}
}

/**
 * @param {*} data : time in milliseconds
 */
export function functionCompareSetRightStartTS(data) {
    return { type: FUNCTION_COMPARE_SET_RIGHT_START_TS, data}
}

/**
 * @param {*} data : time in milliseconds or -1 to reset
 */
export function functionCompareSetRightEndTS(data) {
    return { type: FUNCTION_COMPARE_SET_RIGHT_END_TS, data}
}

/**
 * @param {*} data : time in milliseconds or -1 to reset
 */
export function functionCompareSetRightErrorTS(data) {
    return { type: FUNCTION_COMPARE_SET_RIGHT_ERROR_TS, data}
}

/**
 * @param {*} data : string - the hash of file containing the left function
 */
export function functionCompareSetRightHash(data) {
    return { type: FUNCTION_COMPARE_SET_RIGHT_HASH, data}
}

/**
 * @param {*} data the JSON returned by the /api/v1/search/gene rest interface
 */
export function functionCompareSetRightLLVMIR(data) {
    return { type: FUNCTION_COMPARE_SET_RIGHT_LLVMIR, data}
}

export function functionCompareClearRightFailed() {
    return { type: FUNCTION_COMPARE_CLEAR_RIGHT_FAILED }
}