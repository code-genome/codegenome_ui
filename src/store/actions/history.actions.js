export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const ADD_HISTORY_ITEM = 'ADD_HISTORY_ITEM';
export const UPDATE_HISTORY_ITEM = 'UPDATE_HISTORY_ITEM';
export const UPDATE_HISTORY_STATS = 'UPDATE_HISTORY_STATS';
export const UPDATE_HISTORY_PAGING = 'UPDATE_HISTORY_PAGING';
export const UPDATE_HISTORY_SEARCH_STRING = 'UPDATE_HISTORY_SEARCH_STRING';
export const UPDATE_HISTORY_SORT_ORDER = 'UPDATE_HISTORY_SORT_ORDER';
export const STORE_HISTORY_CUSTOMIZED_COLUMNS = 'STORE_HISTORY_CUSTOMIZED_COLUMNS'
export const UPDATE_HISTORY_CUSTOMIZE_COLUMNS_TEARSHEET_SHOW = 'UPDATE_HISTORY_CUSTOMIZE_COLUMNS_TEARSHEET_SHOW';
export const SET_HISTORY_ERROR = 'SET_HISTORY_ERROR';
export const CLEAR_HISTORY_ERROR = 'CLEAR_HISTORY_ERROR';
export const SET_HISTORY_STATUS = 'SET_HISTORY_STATUS';
export const SET_HISTORY_LOADING = 'SET_HISTORY_LOADING';

export function setHistoryError(data) {
    return { type: SET_HISTORY_ERROR, data};
}

export function clearHistoryError() {
    return { type:CLEAR_HISTORY_ERROR };
}

export function setHistoryLoading() {
    return { type: SET_HISTORY_LOADING};
}

export function setHistoryStatus(data) {
    return { type: SET_HISTORY_STATUS , data};
}

export function addHistory(storableJob) {
    return { type: ADD_HISTORY_ITEM, storableJob};
}

export function updateHistoryItem(storableJob) {
    return { type: UPDATE_HISTORY_ITEM, storableJob };
}

export function updatePaging(data) {
    return { type: UPDATE_HISTORY_PAGING, data };
}

export function updateHistorySearchString(data) {
    return { type: UPDATE_HISTORY_SEARCH_STRING, data };
}

export function updateHistorySortOrder(key, order) {
    return { type: UPDATE_HISTORY_SORT_ORDER, data: { key, order } };
}

export function storeHistoryCustomizedColumns(columns) {
    return { type: STORE_HISTORY_CUSTOMIZED_COLUMNS, columns };
}

export function updateHistoryCustomizeColumnsTearsheetShow(isOpen) {
    return { type: UPDATE_HISTORY_CUSTOMIZE_COLUMNS_TEARSHEET_SHOW, isOpen };
}

export function toggleSortOrder(key) {
    return { type: UPDATE_HISTORY_SORT_ORDER, key };
}
  
