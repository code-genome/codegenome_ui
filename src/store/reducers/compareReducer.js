
import { 
    COMPARE_CLEAR_FAILED,
    COMPARE_SET_FAILED,
    COMPARE_SET_LOADING,
    COMPARE_SET_SEARCH_HASHES,
    COMPARE_SET_START_TS,
    COMPARE_SET_RESULTS,
    COMPARE_SET_RESULTS_PAGEING,
    COMPARE_TOGGLE_SORT_ORDER,
    COMPARE_SET_SEARCH_FILTER
} from '../actions/compare.actions';
import {
    getItem,
    setItem,
    compareSortingStateKey,
    compareResultsPageKey
} from '@/store/localStorage';
import clone from 'clone';
export const sortStates = {
    NONE: 'NONE',
    DESC: 'DESC',
    ASC: 'ASC',
};



export const COMPARE_DEFAULT_COLUMNS = [
    'f1','f2','score','op'
]

function resortCompareResults(diff_details, key, order) {
    if (diff_details && diff_details.length > 0) {
        const new_diff_details = clone(diff_details);
        new_diff_details.sort( (a,b) => {
            const aRef = a[key];
            const bRef = b[key];                    
            if (order === sortStates.ASC) {
                return (aRef < bRef ? -1: (aRef > bRef) ?  1 : 0 )
            } else if (order === sortStates.DESC) {
                return (bRef < aRef ? -1: bRef > aRef ? 1 : 0);
            } else {
                return 0;
            }            

        });
        return new_diff_details;
    }
    return [];
}


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
      return [nextOrder === sortStates.NONE ? compareSortingStateKey : nextKey, nextOrder];
    };
    const next = nextState(action.key, sorting.key, sorting.order);
    return next;
}


export const initialState = {
    compareLoading: false,
    compareFailed: false,
    compareError: {
        message: ''
    },
    start_ts: new Date().getTime(),
    end_ts: -1,
    error_ts: -1,
    hash1: '',
    hash2: '',
    query: [],
    results: {},
    paging: {
        page: 1,
        totalItems: 0,
        pageSize: 20,
        pageSizes: [10, 20, 50, 100],
    },
    sorting: {
        key: 'f1',
        order: sortStates.NONE,
    },
    customColumns: {
        selectedColumns: COMPARE_DEFAULT_COLUMNS,
        tearsheetIsOpen: false
    },
    searchString: '',
};

const loadState = (iState = initialState) => {
    const comparePaging = getItem(compareResultsPageKey);
    const compareSorting = getItem(compareSortingStateKey);
    if (compareSorting && compareSorting.key && !COMPARE_DEFAULT_COLUMNS.includes(compareSorting.key)) {
        compareSorting.key = 'f1';
    }
    return {
        ...iState,
        sorting: { ...iState.sorting, ...compareSorting },
        paging: { ...iState.paging, ...comparePaging },
    }
}

const persistedState = loadState(initialState);

const CompareReducer = (state = persistedState, action) => {
    switch (action.type) {
        case COMPARE_SET_SEARCH_HASHES:
            return {
                ...state,
                hash1: action.data.hash1,
                hash2: action.data.hash2
            }
        case COMPARE_SET_START_TS:
            return {
                ...state,
                start_ts: action.data
            }
        case COMPARE_SET_LOADING:
            return {
                ...state,
                compareLoading: action.data,
                start_ts: new Date().getTime(),
                end_ts: -1,
                error_ts: -1
            }
        case COMPARE_SET_SEARCH_FILTER: {
            return {
                ...state,
                searchString: action.data,
            }
        }
        case COMPARE_SET_RESULTS: {
            let new_diff_details = [];
            if (action.data.results && action.data.results.diff_details && action.data.results.diff_details.length >0 ) {
               new_diff_details = resortCompareResults(action.data.results.diff_details,state.sorting.key,state.sorting.order);
               action.data.results.diff_details = new_diff_details;
            }
            return {
                ...state,
                query: action.data.query ,
                results: action.data.results,
                compareFailed: false,
                compareError: {
                    message: ''
                },
                paging: {
                    ...state.paging,
                    page: 1,
                },
                compareLoading: false,
                end_ts: new Date().getTime(),
                error_ts: -1
            }
        }
        case COMPARE_SET_FAILED:
            return {
            ...state,
            compareLoading: false,
            compareFailed: true,
            compareError: {
                message: action.data.message ? action.data.message : action.data.stats?.message ? action.data.stats.message  : `Unexpected response: ${JSON.stringify(action.data.stats)}`
            },
            paging: {
                ...state.paging,
                page: 1,
                totalItems: 0,
            },
            error_ts: new Date().getTime()
        }

        case COMPARE_CLEAR_FAILED: {
           let newPaging = clone(state.paging);
            if (newPaging.pageSize && newPaging.pageSize > 100) {
                newPaging.pageSize = 100;
            } else {
                if (!newPaging.pageSize) {
                  newPaging.pageSize = 20;
                }
            }
            setItem(compareResultsPageKey, {
                ...newPaging,
            });

            return {
                ...state,
                compareFailed: false,
                compareError: {
                    message: ''
                },
                query: [],
                results: {},
                paging: newPaging,
                error_ts: -1,
                start_ts: -1
            }
        }
        case COMPARE_SET_RESULTS_PAGEING: 
            setItem(compareResultsPageKey, {
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
        case COMPARE_TOGGLE_SORT_ORDER:  {
            const next = getNextSortOrder(action,state);
            setItem(compareSortingStateKey,{ key: next[0], order: next[1] })
            // resort the history results based on the current key and order
            const new_diff_details = resortCompareResults(state.results.diff_details,next[0],next[1]);
            let newData = { key: next[0], order: next[1] }
            return {
                ...state,
                sorting: {
                    ...newData,
                },
                results: {
                    ...state.results,
                    diff_details: new_diff_details
                }
            };
        }
        default:
            return state;
        
    }
}
export default CompareReducer;