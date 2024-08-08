import { 
    SEARCH_BY_SHA256, 
    SEARCH_SET_STRING, 
    SEARCH_UPDATE_SORT_ORDER,
    SEARCH_STORE_CUSTOMIZED_COLUMNS,
    SEARCH_UPDATE_PAGING,
    SEARCH_BY_SHA256_FAILED,
    SEARCH_CLEAR_SEARCH_BY_SHA256_FAILED,
    SET_SEARCH_LOADING,
    SEARCH_SET_START_TS
 } from '../actions/search.actions';
import { 
    getItem,
    setItem,
    searchResultsCustomColumnsKey, 
    searchSortingStateKey, 
    searchResultsSearchString,
    searchResultsPageKey 
} from '../localStorage';

export const sortStates = {
    NONE: 'NONE',
    DESC: 'DESC',
    ASC: 'ASC',
};


export const SEARCH_RESULTS_DEFAULT_COLUMNS = [
    'dist',
    'package_name',
    'filename',
]

export const SEARCH_RESULTS_ALL_COLUMNS = [
    'id',
    'filename',
    'package_name',
    'dist',
    'match_count',
    'match_ratio',
    'gene_counts',
    'sha256'
]

const searchDefaultSortingKey = 'dist';

export const initialState = {
    data: {},
    searchString: '',
    customColumns: {
        selectedColumns: SEARCH_RESULTS_DEFAULT_COLUMNS,
        tearsheetIsOpen: false
    },
    paging: {
        page: 1,
        totalItems: 0,
        pageSize: 20,
        pageSizes: [10, 20, 50],
    },
    sorting: {
        key: searchDefaultSortingKey,
        order: sortStates.DESC,
    },
    searchFailed: false,
    searchError: {
        message: ''
    },
    loading: false,
    start_ts: -1,
    end_ts: -1,
    error_ts: -1,
}


const loadState = (iState = initialState) => {
    const searchString = getItem(searchResultsSearchString,'');
    const searchStoredColumns = getItem(searchResultsCustomColumnsKey, SEARCH_RESULTS_DEFAULT_COLUMNS);
    const searchPaging = getItem(searchResultsPageKey);
    const selectedColumns = searchStoredColumns.filter((column) => SEARCH_RESULTS_ALL_COLUMNS.includes(column));
    const searchSorting = getItem(searchSortingStateKey);
    if (searchSorting && searchSorting.key && !selectedColumns.includes(searchSorting.key)) {
        searchSorting.key = searchDefaultSortingKey;
    }
    return {
        ...iState,
        sorting: { ...iState.sorting, ...searchSorting },
        paging: { ...iState.paging, ...searchPaging },
        customColumns: { 
            selectedColumns,
        },
        searchString: searchString,
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
      return [nextOrder === sortStates.NONE ? searchDefaultSortingKey : nextKey, nextOrder];
    };
    const next = nextState(action.key, sorting.key, sorting.order);
    return next;
}


const SearchReducer = (state = persistedState, action) => {
    switch (action.type) {
        case SEARCH_BY_SHA256:
            return {
                ...state,
                data: action.data,
                searchFailed: false,
                searchError: {
                    message: ''
                },
                loading: false,
                end_ts: new Date().getTime(),
                error_ts: -1
            }
        case SEARCH_SET_STRING:
            return {
               ...state,
               searchString: action.data
            }

        case SEARCH_BY_SHA256_FAILED: {
            return {
                ...state,
                data: {},
                searchFailed: true,
                searchError: {
                    message: action.data.message ? action.data.message : action.data.stats?.message ? action.data.stats.message  : `Unexpected response: ${JSON.stringify(action.data.stats)}`
                },
                paging: {
                    page: 1,
                    totalItems: 0,
                },
                loading: false,
                error_ts: new Date().getTime()
            }
        }
        case SEARCH_SET_START_TS: {
            return {
                ...state,
                start_ts: action.data
            }
        }
        case SEARCH_CLEAR_SEARCH_BY_SHA256_FAILED: {
            return {
                ...state,
                data: {},
                searchFailed: false,
                searchError: {
                    message: ''
                },
                paging: {
                    page: 1,
                    totalItems: 0,
                },
                error_ts: -1,
                start_ts: -1
            }
        }
        case SEARCH_STORE_CUSTOMIZED_COLUMNS: {
            setItem(searchResultsCustomColumnsKey, 
                action.columns
            )
            return {
                ...state,
                customColumns: {
                    selectedColumns: action.columns,
                },
            };
        }
        case SEARCH_UPDATE_PAGING: {
            setItem(searchResultsPageKey, {
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
        }
        case SEARCH_UPDATE_SORT_ORDER: {
            const next = getNextSortOrder(action,state);
            setItem(searchSortingStateKey,{ key: next[0], order: next[1] })
            let newData = { key: next[0], order: next[1] }
            return {
                ...state,
                sorting: {
                    ...newData,
                },
            };

        }
        case SET_SEARCH_LOADING:
            return {
                ...state,
                loading: action.data,
                start_ts: new Date().getTime(),
                end_ts: -1,
                error_ts: -1
            }
        default:
            return state;
    }    
}

export default SearchReducer;