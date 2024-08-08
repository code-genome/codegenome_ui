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
import React, { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clone from 'clone';
import { Settings } from '@carbon/react/icons';
import styles from './JobHistoryTable.module.scss'
import {
  Link,
  DataTableSkeleton,
  DataTable,
  IconButton,
  InlineLoading,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
} from '@carbon/react';

import { getHighlightedText } from '@/common/Highlighter.util';
import { DEFAULT_COLUMNS, sortStates } from '@/store/reducers/historyReducer';
import { NoDataEmptyState } from '@carbon/ibm-products';
import { toggleSortOrder, updateHistoryCustomizeColumnsTearsheetShow, updatePaging } from '@/store/actions/history.actions';
import CustomizeHistoryColumnsTearsheet from './CustomizeHistoryColumnsTearsheet';
import { useNavigate } from "react-router-dom";

export interface PageType {
  page: number;
  totalItems: number;
  pageSize: number;
  pageSizes: number[];
}
export interface SortType {
  key: string;
  order: string;
}

export interface SelectedColumnsType {
  selectedColumns: any[];
  tearsheetIsOpen: boolean;
}

export interface JobHistoryTableState {
  rows: any[],
  allRows: any[],
  loaded: false,
  mounted: boolean;
  paging: PageType;
  sorting: SortType;
  customColumns: SelectedColumnsType;
  searchString: string;
  selectedHash: string;
  compareHash: string;
  selectedRow: any;
  compareRow: any;
}

const initialState: JobHistoryTableState = {
  rows: [],
  allRows: [],
  loaded: false,
  mounted: false,
  paging: {
    page: 1,
    totalItems: 0,
    pageSize: 20,
    pageSizes: [20, 50, 100],
  },
  customColumns: {
    selectedColumns: DEFAULT_COLUMNS,
    tearsheetIsOpen: false,
  },
  sorting: {
    key: 'create_time',
    order: sortStates.DESC,
  },
  searchString: '',
  selectedHash: '',
  compareHash: '',
  selectedRow: '',
  compareRow: ''

};

export interface JobHistoryTableProps {
  isAdminHistory: boolean;
}

/**
 * 
 * @param props - An instance of JohHistoryTableProps
 * @returns A JSX Element
 */
export function JobHistoryTable(props: JobHistoryTableProps) {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let curState = useSelector((state: any) => state);
  const navigate = useNavigate();

  // None of the headers are sortable due to no-sql backend of history
  const noSortHeaders = ['om',
    'id',
    'subid',
    'status',
    'internal_jobid',
    'httpstatus',
    'statusText',
    'fileid',
    'filename'
  ];

  function stateStoreSubscriber(mounted = false) {
    // force a render by tweaking state.
    const newState: JobHistoryTableState = clone(state);
    let history_ref = curState.history;
    if (props.isAdminHistory) {
      history_ref = curState.admin;
    }

    let doUpdate = false;
    if (mounted) {
      newState.mounted = true;
      doUpdate = true;
    }
    if (
      history_ref.customColumns.tearsheetIsOpen !== state.customColumns.tearsheetIsOpen
    ) {
      newState.customColumns.tearsheetIsOpen = history_ref.customColumns.tearsheetIsOpen;
      doUpdate = true;
    }
    if (
      history_ref.customColumns.selectedColumns !== state.customColumns.selectedColumns
    ) {
      newState.customColumns.selectedColumns = history_ref.customColumns.selectedColumns;
      doUpdate = true;
    }
    if (newState.allRows !== history_ref.history || newState.allRows.length !== history_ref.history.length) {
      newState.allRows = history_ref.history;
      if (history_ref.paging !== newState.paging) {
        newState.paging = history_ref.paging;
      }
      if (newState.allRows.length > newState.paging.pageSize) {
        newState.rows = newState.allRows.slice((newState.paging.page - 1) * newState.paging.pageSize, (newState.paging.page * newState.paging.pageSize))
      } else {
        newState.rows = newState.allRows;
      }
      doUpdate = true;
    }
    if (history_ref.paging !== newState.paging) {
      newState.paging = history_ref.paging;
      newState.allRows = history_ref.history;
      if (newState.allRows.length > newState.paging.pageSize) {
        newState.rows = newState.allRows.slice((newState.paging.page - 1) * newState.paging.pageSize, (newState.paging.page * newState.paging.pageSize))
      } else {
        newState.rows = newState.allRows;
      }
      doUpdate = true;
    }
    // Check to see if the alerts have reloaded
    if (history_ref.historyLoading !== newState.loaded) {
      doUpdate = true;
    }
    newState.sorting = history_ref.sorting;
    newState.customColumns = history_ref.customColumns;
    if (history_ref.searchString !== state.searchString) {
      newState.searchString = history_ref.searchString;
      doUpdate = true;
    }
    if (doUpdate) {
      console.log('updating...');
      setState(newState);
    }
  }

  function canSortHeader(key) { return !noSortHeaders.includes(key) };

  function getSortHeaderProps(key) {
    return ({
      isSortHeader: key === state.sorting.key,
      sortDirection: key === state.sorting.key ? state.sorting.order : sortStates.NONE,
    });
  }

  function clickHandler(key) {
    dispatch(toggleSortOrder(key));
  }

  /**
   * 
   * @param data 
   * 
   */
  function onChange(data) {
    const cleanData = {
      page: data.page ? data.page : 1,
    }
    if (data.pageSize) {
      cleanData['pageSize'] = data.pageSize;
    }
    if (data.pageSizes) {
      cleanData['pageSizes'] = data.pageSizes;
    }
    if (data.totalItems) {
      cleanData['totalItems'] = data.totalItems;
    }

    dispatch(updatePaging(cleanData));
  }

  function getDecoratedCell(cell, row_id, sha256, row, internal_jobid) {
    let lStatus = 'inactive';
    if (cell.info.header === 'om') {
      return(
        <TableCell className="cds--table-column-menu">
        <OverflowMenu size="sm" flipped>
          <OverflowMenuItem itemText={t('historyTable.overflow_menu.select_for_compare')} onClick={() => selectRow(row)} />
          {state.selectedHash === '' ? <OverflowMenuItem itemText={t('historyTable.overflow_menu.compare_with_selected')} onClick={() => compareRow(row)} disabled /> :
            <OverflowMenuItem itemText={t('historyTable.overflow_menu.compare_with_selected')} onClick={() => compareRow(row)} />
          }
        </OverflowMenu>
      </TableCell>
      )
    }
    if (cell.info.header === 'status') {
      if (cell.value <202) {
        lStatus = 'finished';
      } else if (cell.value < 300) {
        lStatus = 'active';
      } else {
        lStatus = 'error';
      }
    }
    return (
      <TableCell
        key={cell.id}
        className={row_id === state.selectedRow || row_id === state.compareRow ? styles.jhSelection : styles[`history_table_${cell.info.header}`]}
      >
        {cell.info.header === 'fileid' ? (
          <Link
            key={cell.id}
            href={`/search/${sha256}`}
            as={React.node}
          >
            {cell.value}
          </Link>
        ) : cell.info.header === 'status' ? (
          <InlineLoading status={lStatus} description={getHighlightedText(cell.value, state.searchString)} />
        ) : (
              cell.info.header === 'submitted_time' ? (
                getHighlightedText(new Date((+cell.value)).toLocaleString(), state.searchString)
              ) : getHighlightedText(cell.value, state.searchString)
        )
        }
      </TableCell>
    );
  }

  /**
   * 
   * @param row - The row whose file id is to be returned.
   * @returns The fileid of the row or an empty string if not found.
   */
  function getFileIDForRow(row) {
    const filtered = state.rows.filter((sRow) => (sRow.id === row.id));
    if (filtered.length > 0) {
      return filtered[0].fileid;
    }
    return '';
  }

  /**
   * 
   * @param row The row whose internal job id is to be retrieved
   * @returns The internal_jobid of the supplied row, or an empty string if not found.
   */
  function getInternalJobIDForRow(row) {
    const filtered = state.rows.filter((sRow) => (sRow.id === row.id));
    if (filtered.length > 0) {
      return filtered[0].internal_jobid;
    }
    return '';
  }

  /**
   * @description - sets up the first of two parameters necessary to invoke the
   * compare by file hash operation from the history page.
   * @param row - The row in the table which has been selected for comparison
   */
  function selectRow(row) {
    const newState: JobHistoryTableState = clone(state);
    const filtered = state.rows.filter((sRow) => (sRow.id === row.id));
    if (filtered.length > 0) {
      newState.selectedHash = filtered[0].fileid;
      newState.selectedRow = row.id;
      setState(newState);
    }
  }

  /**
   * 
   * @description - sets up the second of two parameters necessary to invoke the
   * compare by file hash operation from the history page.   If both hashes are set,
   * the ui will auto-navigate to the compare page.
   * @param row - The row in the table which has been selected for comparison
   */
  function compareRow(row) {
    const newState: JobHistoryTableState = clone(state);
    const filtered = state.rows.filter((sRow) => (sRow.id === row.id));
    if (filtered.length > 0) {
      newState.compareHash = filtered[0].fileid;
      newState.compareRow = row.id;
      if (newState.selectedHash !== '' && newState.compareHash !== '') {
        // now redirect to the compare by filehash url with two parameters newState.
        navigate(`/compare/${state.selectedHash}/${newState.compareHash}`);
      }
    }

  }

  function renderDataTable(local_headers) {
    return (
      <div>
        <DataTable rows={state.rows} headers={local_headers} isSortable stickyHeader size={'md'} >
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
            <TableContainer title={''}>
              <TableToolbar>
                <TableToolbarContent>
                  <IconButton
                    className={styles.investigations_table__customize_cols_button}
                    renderIcon={Settings}
                    iconDescription={'Settings'}
                    label={t('historyTable.custom_columns.customize_columns')}
                    tooltipDirection="left"
                    onClick={() =>
                      dispatch(updateHistoryCustomizeColumnsTearsheetShow(true))
                    }
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table className="bx--data-table--compact">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        {...getHeaderProps({ header, isSortable: canSortHeader(header.key), 'data-cy': header.key })}
                        {...getSortHeaderProps(header.key)}
                        onClick={() => clickHandler(header.key)}
                        key={header.key}
                        >
                        
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className={styles.tc}>
                  {rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map((cell) => (
                          getDecoratedCell(cell, row.id, getFileIDForRow(row),row, getInternalJobIDForRow(row))
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={headers.length}>
                        <NoDataEmptyState
                          title={t('historyTable.NoDataEmptyState.no_results')}
                          subtitle={''}
                          illustrationTheme="dark"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
        <Pagination
          backwardText="Backward"
          page={state.paging.page}
          pageSize={state.paging.pageSize}
          pageSizes={[10, 20, 50]}
          totalItems={state.paging.totalItems}
          itemRangeText={(min, max, total) => {
            return `${min} - ${max} of ${total} items`;
          }}
          size="md"
          onChange={onChange}
          data-cy={'jht-pagination-1'}
        />
      </div>
    );

  }

  /**
   * This effect runs whenever there are changes to the redux store, or 
   * the dom has become ready.
   */
  useEffect(() => {
    stateStoreSubscriber(true);
  }, [state.mounted, curState]);

  /**
   * Retrieve the internationalized strings for the column headers.
   */
  let local_headers = state.customColumns.selectedColumns.map((column) => {
    return { header: t(`historyTable.headers.${column}`), key: column };
  });
  // Append the actions column
  local_headers.push({ header: t('historyTable.headers.om'), key: 'om'});


  return (
    <div>
      {state.customColumns.tearsheetIsOpen && <CustomizeHistoryColumnsTearsheet />}
      {state.mounted ? (
        renderDataTable(local_headers)
      ) : (
        <DataTableSkeleton headers={local_headers} rowCount={undefined} columnCount={undefined} zebra={undefined} compact={undefined} className={undefined} showHeader={undefined} showToolbar={undefined} />
      )}
    </div>
  );
}

export default JobHistoryTable;
