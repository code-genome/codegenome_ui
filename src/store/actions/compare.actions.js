export const COMPARE_SET_SEARCH_HASHES = 'COMPARE_SET_SEARCH_HASHES';
export const COMPARE_SET_START_TS = 'COMPARE_SET_START_TS';
export const COMPARE_SET_LOADING = 'COMPARE_SET_LOADING';
export const COMPARE_SET_FAILED = 'COMPARE_SET_FAILED';
export const COMPARE_CLEAR_FAILED = 'COMPARE_CLEAR_FAILED';
export const COMPARE_SET_RESULTS = 'COMPARE_SET_RESULTS';
export const COMPARE_SET_RESULTS_PAGEING = 'COMPARE_SET_RESULTS_PAGEING';
export const COMPARE_TOGGLE_SORT_ORDER = 'COMPARE_TOGGLE_SORT_ORDER';
export const COMPARE_SET_SEARCH_FILTER = 'COMPARE_SET_SEARCH_FILTER';


// data.hash1, data.hash2
export function compareSetSearchHashes(data) {
    return { type: COMPARE_SET_SEARCH_HASHES, data};
}

export function compareSetStartTS(data) {
    return { type: COMPARE_SET_START_TS, data};
}

export function compareSetLoading(data) {
    return { type: COMPARE_SET_LOADING, data};
}

export function compareSetFailed(data) {
    return { type: COMPARE_SET_FAILED, data};
}

export function compareClearFailed() {
    return { type: COMPARE_CLEAR_FAILED};
}

export function compareSetResults(data) {
    return { type: COMPARE_SET_RESULTS, data};
}

export function compareSetResultsPaging(data) {
    return { type: COMPARE_SET_RESULTS_PAGEING, data};
}

export function toggleCompareResultsSortOrder(key) {
    return { type: COMPARE_TOGGLE_SORT_ORDER, key}
}

export function compareSetSearchFilter(data) {
    return { type: COMPARE_SET_SEARCH_FILTER, data};
}