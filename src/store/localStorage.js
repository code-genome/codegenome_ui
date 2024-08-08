export const historySortingStateKey = 'history-sorting_state';
export const historyCustomColumnsKey = 'history-custom_columns';
export const historyPageKey = 'history-current_page';
export const historySearchString = 'history-search-string';
export const historyData = 'history-data';
export const chartModeStateKey = 'chart-mode-state';
export const searchResultsCustomColumnsKey = 'search-custom_columns';
export const searchResultsPageKey = 'search-current_page';
export const searchSortingStateKey = 'search-sorting_state';
export const compareSortingStateKey = 'compare-sorting_state';
export const compareResultsPageKey = 'compare-current_page';
export const searchResultsSearchString = 'search-search-string';
export const sbomViewerCustomColumnsKey = 'sbom-viewer-custom_columns'
export const sbomViewerPageKey = 'sbom-viewer-current_page';

export const getItem = (key, defaultValue = {}) => {
    try {
      const serializedItem = localStorage.getItem(key);
      if (serializedItem === null) {
        return defaultValue;
      }
      return JSON.parse(serializedItem);
    } catch (err) {
      return defaultValue;
    }
  };
  
  export const setItem = (key, value) => {
    try {
      const serializedItem = JSON.stringify(value);
      localStorage.setItem(key, serializedItem);
    } catch (err) {
    }
  };
  