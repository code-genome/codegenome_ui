export const SEARCH_BY_SHA256 = 'SEARCH_BY_SHA256';
export const SEARCH_SET_STRING = 'SEARCH_SET_STRING';
export const SET_SEARCH_LOADING = 'SET_SEARCH_LOADING';
export const SEARCH_STORE_CUSTOMIZED_COLUMNS = 'STORE_SARCH_CUSTOMIZED_COLUMNS';
export const SEARCH_UPDATE_PAGING = 'SEARCH_UPDATE_PAGING';
export const SEARCH_UPDATE_SORT_ORDER = 'SEARCH_UPDATE_SORT_ORDER';
export const SEARCH_TOGGLE_SORT_ORDER = 'SEARCH_TOGGLE_SORT_ORDER';
export const SEARCH_TOGGLE_TEARSHEET_OPEN = 'SEARCH_TOGGLE_TEARSHEET_OPEN';
export const SEARCH_BY_SHA256_FAILED = 'SEARCH_BY_SHA256_FAILED';
export const SEARCH_CLEAR_SEARCH_BY_SHA256_FAILED = 'SEARCH_CLEAR_SEARCH_BY_SHA256_FAILED';
export const SEARCH_SET_START_TS = 'SEARCH_SET_START_TS';

export function setSearchLoading(data) {
    return { type: SET_SEARCH_LOADING, data};
}

export function setSearchStartTS(data) {
    return { type: SEARCH_SET_START_TS, data};
}
export function setSearchResults(data) {
    return { type: SEARCH_BY_SHA256, data};
}
export function clearSearchError() {
    return { type: SEARCH_CLEAR_SEARCH_BY_SHA256_FAILED};
}

export function setSearchToast(data) {
    return { type: SEARCH_BY_SHA256_FAILED, data}
}

export function setSearchString(data) {
    return { type: SEARCH_SET_STRING, data};
}

export function storeSearchResultsCustomizedColumns(columns) {
    return { type: SEARCH_STORE_CUSTOMIZED_COLUMNS, columns };
}

export function updateSearchResultsPaging(data) {
    return { type: SEARCH_UPDATE_PAGING, data };
}

export function updateSearchResultsSortOrder(key, order) {
    return { type: SEARCH_UPDATE_SORT_ORDER, data: { key, order } };
}

export function toggleSearchResultsSortOrder(key) {
    return { type: SEARCH_UPDATE_SORT_ORDER, key };
}

export function updateSearchResultsCustomizeColumnsTearsheetShow(isOpen) {
    return { type: SEARCH_TOGGLE_TEARSHEET_OPEN, isOpen };
}
