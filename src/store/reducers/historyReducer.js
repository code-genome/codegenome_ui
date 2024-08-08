import { 
    UPDATE_HISTORY, 
    UPDATE_HISTORY_ITEM, 
    UPDATE_HISTORY_STATS,
    UPDATE_HISTORY_PAGING, 
    UPDATE_HISTORY_SEARCH_STRING, 
    UPDATE_HISTORY_SORT_ORDER, 
    STORE_HISTORY_CUSTOMIZED_COLUMNS, 
    UPDATE_HISTORY_CUSTOMIZE_COLUMNS_TEARSHEET_SHOW, 
    ADD_HISTORY_ITEM, 
    CLEAR_HISTORY_ERROR, 
    SET_HISTORY_ERROR, 
    SET_HISTORY_LOADING,
    SET_HISTORY_STATUS } from '../actions/history.actions'
import {
    historySortingStateKey,
    historyPageKey,
    historyCustomColumnsKey,
    historySearchString,
    getItem,
    setItem,
    historyData
} from '../localStorage'
import clone from 'clone';
export const sortStates = {
    NONE: 'NONE',
    DESC: 'DESC',
    ASC: 'ASC',
};

export const DEFAULT_COLUMNS = [
    'submitted_time',
    'filename',
    'status',
    'fileid'
]

export const ALL_COLUMNS = [
    'subid',
    'internal_jobid',
    'submitted_time',
    'filename',
    'status',
    'fileid'
];


export const DEFAULT_SORT_KEY = 'submitted_time';
export const historyDefaultSortKey = 'submitted_time';

export const initialState = {
    history: [],
    customColumns: {
        selectedColumns: DEFAULT_COLUMNS,
        tearsheetIsOpen: false
    },
    paging: {
        page: 1,
        totalItems: 0,
        pageSize: 20,
        pageSizes: [10, 20, 50],
    },
    sorting: {
        key: historyDefaultSortKey,
        order: sortStates.DESC,
    },
    loading: false,
    searchString: '',
    error: '',
    errorCode: 200,
    status: '',
    jobStats: {},
    jobData: {},
    start_ts: -1,
    end_ts: -1,
    error_ts: -1,
};

function resortHistory(state, key, order) {
    if (state.history && state.history.length >0) {
        state.history.sort( (a,b) => {
            if (key === "submitted_time") {
                if (order === sortStates.ASC) {
                    return a.submitted_time-b.submitted_time;
                } else if (order === sortStates.DESC) {
                    return b.submitted_time-a.submitted_time;
                } else {
                    return 0
                }
            } else {
                if (order === sortStates.ASC) {
                    return (a[key] < (b[key]) ? -1: (a[key] > b[key]) ?  1 : 0 )
                } else if (order === sortStates.DESC) {
                    return (b[key] < a[key] ? -1: b[key] > a[key] ? 1 : 0);
                } else {
                    return 0;
                }            
            }
        })
    }
}

const loadState = (iState = initialState) => {
    const searchString = getItem(historySearchString, '');
    const historySorting = getItem(historySortingStateKey);
    const historyPaging = getItem(historyPageKey);
    const historyStoredColumns = getItem(historyCustomColumnsKey, DEFAULT_COLUMNS);
    const selectedColumns = historyStoredColumns.filter((column) => ALL_COLUMNS.includes(column));
    const historyData1 = getItem(historyData,[]);
    // historyData1.sort((a, b) => {
    //     return b.submitted_time - a.submitted_time;
    //   });
    // remove any columns that are not in the defined list
    if (historyStoredColumns.length !== selectedColumns.length) {
        setItem(historyCustomColumnsKey, selectedColumns);
    }
    if (historySorting?.key && !selectedColumns.includes(historySorting.key)) {
        historySorting.key = historyDefaultSortKey;
    }
    resortHistory( { history: historyData1}, historySorting.key, historySorting.order);

    return {
        ...iState,
        sorting: { ...iState.sorting, ...historySorting },
        paging: { ...iState.paging, ...historyPaging },
        searchString: searchString,
        history: historyData1,
        customColumns: {
            selectedColumns
        }
    }
}

const persistedState = loadState(initialState);

function getNextSortOrder(action, state) {
    // let sorting = yield select(_getSortingState);
    let sorting = state?.sorting;
    const nextState = (nextKey, currentKey, currentOrder) => {
      const matchKey = nextKey === currentKey;
  
      if (!matchKey) return [nextKey, sortStates.DESC];
      const nextOrder =
        currentOrder === sortStates.NONE
          ? sortStates.DESC
          : currentOrder === sortStates.DESC
          ? sortStates.ASC
          : sortStates.NONE;
      return [nextOrder === sortStates.NONE ? historyDefaultSortKey : nextKey, nextOrder];
    };
    const next = nextState(action.key, sorting.key, sorting.order);
    return next;
}



const HistoryReducer = (state = persistedState, action) => {
    switch (action.type) {
        case ADD_HISTORY_ITEM:
            {
                const newHistory = clone(state.history);
                newHistory.push(action.storableJob);
                newHistory.sort((a, b) => {
                    return b.submitted_time - a.submitted_time;
                });
                setItem(historyData,newHistory);
                setItem(historyPageKey,{
                        ...state.paging,
                        totalItems: newHistory.length,
                });
                return {
                    ...state,
                    history: newHistory,
                    paging: {
                        ...state.paging,
                        totalItems: newHistory.length,
                    },
                }
            }
        case UPDATE_HISTORY_ITEM:
            {
                let count=0;
                let matchingEntryIndex = -1;
                const newHistory = clone(state.history);
                newHistory.filter((entry) => {
                    let addEntry = false;
                    if (entry.id === action.storableJob.id) {
                        if (entry.id !== undefined) {
                            matchingEntryIndex=count;
                            addEntry = true;
                        }
                    } 
                    if (entry.filehash === action.storableJob.fileid ) {
                        if (entry.filehash !== undefined) {
                          matchingEntryIndex=count;
                          addEntry = true;
                        }
                    }
                    count +=1;
                    return addEntry;
                })
                if (matchingEntryIndex > -1) {
                    newHistory[matchingEntryIndex]['id'] = action.storableJob.id;
                    newHistory[matchingEntryIndex]['subid'] = action.storableJob.subid;
                    newHistory[matchingEntryIndex]['jobstatus'] = action.storableJob.jobstatus;
                    newHistory[matchingEntryIndex]['status'] = action.storableJob.status;
                    newHistory[matchingEntryIndex]['statusText'] = action.storableJob.statusText;
                    newHistory[matchingEntryIndex]['filehash'] = action.storableJob.filehash;
                    setItem(historyData,newHistory);
                } else {
                    newHistory.push(action.storableJob)
                    newHistory.sort((a, b) => {
                        return b.submitted_time - a.submitted_time;
                    });    
                    setItem(historyData,newHistory);
                    setItem(historyPageKey,{
                            ...state.paging,
                            totalItems: newHistory.length,
                    });
                    }
                return {
                    ...state,
                    history: newHistory,
                    paging: {
                        ...state.paging,
                        totalItems: state.history.length,
                    },
                }
            }

        case UPDATE_HISTORY_PAGING:
            // the action.data is coming in with a backbutton ref.
            setItem(historyPageKey, {
                    ...state.paging,
                    ...action.data,
            });
            return {
                ...state,
                paging: {
                    ...state.paging,
                    ...action.data,
                },
            };
        case STORE_HISTORY_CUSTOMIZED_COLUMNS: {
            setItem(historyCustomColumnsKey,  action.columns)
            return {
                ...state,
                customColumns: {
                    selectedColumns: action.columns,
                },
            };
        }
        case UPDATE_HISTORY_SORT_ORDER:
            const next = getNextSortOrder(action,state);
            setItem(historySortingStateKey,{ key: next[0], order: next[1] })
            // resort the history results based on the current key and order
            resortHistory(state,next[0],next[1]);
            setItem(historyData,state.history);
            let newData = { key: next[0], order: next[1] }
            return {
                ...state,
                sorting: {
                    ...newData,
                },
            };
        case UPDATE_HISTORY_CUSTOMIZE_COLUMNS_TEARSHEET_SHOW: {
            return {
                ...state,
                customColumns: {
                    ...state.customColumns,
                    tearsheetIsOpen: action.isOpen,
                },
            };
        }
        case UPDATE_HISTORY_SEARCH_STRING:
            setItem(historySearchString, {searchString: {...action.data}})
            return {
                ...state,
                searchString: action.data,
            };
        case CLEAR_HISTORY_ERROR:
            return {
                ...state,
                status: '',
                error: '',
                errorCode: 200,
                start_ts: -1,
                end_ts: -1,
                error_ts: -1,
                loading: false
            }
        case SET_HISTORY_ERROR: 
            return {
            ...state,
            error: action.data.message,
            errorCode: action.data.response ? action.data.response.status : action.data.code === 'ERR_NETWORK' ? 403 : 500,
            end_ts: new Date().getTime(),
            loading: false
            }
        case SET_HISTORY_LOADING: 
            return {
                ...state,
                loading: action.data,
                start_ts: new Date().getTime(),
                eror_ts: -1
            }

        case SET_HISTORY_STATUS:
            return {
                ...state,
                status: action.data
            }    
        default:
            return state;
    }
}

export default HistoryReducer;