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
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, useStore } from 'react-redux';
import clone from 'clone';
import { COMPARE_DEFAULT_COLUMNS, sortStates } from '@/store/reducers/compareReducer';
import { ExpressiveCard, NoDataEmptyState } from '@carbon/ibm-products';
import styles from './CompareResultsTable.module.scss'
import {
    Grid,
    Column,
    DataTableSkeleton,
    DataTable,
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
    TableToolbarSearch,
} from '@carbon/react';
import {PercentBoxesV2 as PercentBoxes} from '@/components/PercentBoxesV2';

import { compareSetResultsPaging, compareSetSearchFilter, toggleCompareResultsSortOrder } from '@/store/actions/compare.actions';
import { CompareFunctionTearsheet } from './CompareFunctionTearsheet/CompareFunctionTearsheet';
/**
 * Interface used for pagination
 */
export interface PageType {
    page: number;
    totalItems: number;
    pageSize: number;
    pageSizes: number[];
}
/**
 * Interface used for sorting
 */
export interface SortType {
    key: string;
    order: string;
}
/**
 * Interfoace used for selecting columns in a table, and determining if the 
 * selection tearsheet is open or not.
 */
export interface SelectedColumnsType {
    selectedColumns: any[];
    tearsheetIsOpen: boolean;
}

/**
 * rows contains what is presently rendered (i.e. with applied filters)
 * allRows contains all data presently fetched into the user interface.
 * This can be reduced via filters to show less.
 * The paging is pretty straight forward, i.e. How many items/page from the 
 * currently set rows item.
 * Sorting is again, pretty obvious. order by an particular column.
 * searchString is used for highlighting consitently across any component.
 */
export interface CompareResultsTableState {
    rows: any[],
    allRows: any[],
    loaded: false,
    mounted: boolean;
    paging: PageType;
    sorting: SortType;
    customColumns: SelectedColumnsType;
    searchString: string;
}

/**
 * On initial pre-fetch, this is what the state will be.
 */
const initialState: CompareResultsTableState = {
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
        selectedColumns: COMPARE_DEFAULT_COLUMNS,
        tearsheetIsOpen: false,
    },
    sorting: {
        key: 'dist',
        order: sortStates.NONE,
    },
    searchString: ''
};

/**
 * 
 * @param props - Completely not referenced, but if you want to pass miscelaneous items, they too will be ignored ;-)
 * @returns  A JSX Elemnt.
 */
export default function CompareResultsTable(props) {
    const [state, setState] = useState(initialState);
    const curState = useSelector((state: any) => state);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const store = useStore();
    const noSortHeaders = ['om'];
    const [functionCompareLeftFilename, setFunctionCompareLeftFileName] = useState('');
    const [functionCompareRightFilename, setFunctionCompareRightFileName] = useState('');
    const [showTearsheet, setShowTearsheet] = useState(false);

    /**
     * @description  - This method listens in on changes to the state store (i.e. Redux) and can trigger a 
     * re-render if the redux store has been nudged.
     * @param mounted - If true, the dome is ready.
     */
    function stateStoreSubscriber(mounted = false) {
        log('-->stateStoreSubscriber()');
        // force a render by tweaking state.
        try {
            const newState: CompareResultsTableState = clone(state);
            let doUpdate = false;
            if (mounted) {
                newState.mounted = true;
                doUpdate = true;
            }
            if (
                curState.compare.customColumns.tearsheetIsOpen !== state.customColumns.tearsheetIsOpen
            ) {
                newState.customColumns.tearsheetIsOpen = curState.compare.customColumns.tearsheetIsOpen;
                doUpdate = true;
            }
            if (
                curState.compare.customColumns.selectedColumns !== state.customColumns.selectedColumns
            ) {
                newState.customColumns.selectedColumns = curState.compare.customColumns.selectedColumns;
                doUpdate = true;
            }
            if (curState.compare.results?.diff_details) {
                if (newState.allRows !== curState.compare.results.diff_details || newState.allRows.length !== curState.compare.results.length) {
                    newState.allRows = clone(curState.compare.results.diff_details);
                    if (curState.compare.searchString && curState.compare.searchString !== '' && newState.searchString !== curState.compare.searchString) {
                        newState.searchString = curState.compare.searchString;
                        // apply filter
                        newState.allRows = newState.allRows.filter((row) => row['op'].indexOf(newState.searchString) > -1 || row['f1'].indexOf(newState.searchString) > -1 || row['f2'].indexOf(newState.searchString) > -1 || ('' + row['score']).indexOf(newState.searchString) > -1)
                    }
                    if (curState.compare.paging !== newState.paging) {
                        newState.paging = clone(curState.compare.paging);
                    }
                    if (newState.allRows.length > newState.paging.pageSize) {
                        newState.rows = newState.allRows.slice((newState.paging.page - 1) * newState.paging.pageSize, (newState.paging.page * newState.paging.pageSize))
                    } else {
                        newState.rows = newState.allRows;
                    }
                    newState.paging.totalItems = newState.allRows.length;
                    doUpdate = true;
                }
            } else if (curState.compare.results && !curState.compare.results.diff_details) {
                if (curState.compare.compareLoading) {
                    if (newState.allRows && newState.allRows.length > 0) {
                        newState.allRows = [];
                        newState.rows = [];
                        doUpdate = true;
                    }
                }
            }
            if (curState.compare.searchString && curState.compare.searchString !== '') {
                newState.searchString = curState.compare.searchString;
                // apply filter
                newState.allRows = newState.allRows.filter((row) => row['op'].indexOf(newState.searchString) > -1 || row['f1'].indexOf(newState.searchString) > -1 || row['f2'].indexOf(newState.searchString) > -1 || ('' + row['score']).indexOf(newState.searchString) > -1)
                doUpdate = true;
            }

            if (curState.compare.paging !== newState.paging) {
                newState.paging = clone(curState.compare.paging);
                if (newState.allRows.length > newState.paging.pageSize) {
                    newState.rows = newState.allRows.slice((newState.paging.page - 1) * newState.paging.pageSize, (newState.paging.page * newState.paging.pageSize))
                } else {
                    newState.rows = newState.allRows;
                }
                newState.paging.totalItems = newState.allRows.length;
                doUpdate = true;
            }
            // Check to see if the alerts have reloaded
            if (curState.compare.compareLoading !== newState.loaded) {
                doUpdate = true;
            }
            newState.sorting = curState.compare.sorting;
            newState.customColumns = curState.compare.customColumns;
            if (curState.compare.searchString !== state.searchString) {
                newState.searchString = curState.compare.searchString;
                doUpdate = true;
                log('stateStoreSubscriber: Updated searchString...');
            }
            if (doUpdate) {
                log('updating...');
                setState(newState);
            }
        } catch (err) {
            console.error(err);
        }
        log('<--stateStoreSubscriber()');
    }

    /**
     * 
     * @param evt - The event whose value string represents the search filter to apply
     */
    function filterRows(evt) {
        const inputValue = evt.target.value;
        onChange({ page: 1 });
        dispatch(compareSetSearchFilter(inputValue));
    }

    function log(content) {
        if (content) {
            console.log('CompareResultsTable: ' + content);
        }
    }

    function diffFunctions(row) {
        // Need to set left & right filename from the row value
        const f1 = row.cells.filter((cell) => cell.info.header === 'f1')[0];
        const f2 = row.cells.filter((cell) => cell.info.header === 'f2')[0];
        setFunctionCompareLeftFileName(f1.value);
        setFunctionCompareRightFileName(f2.value);
        setShowTearsheet(true);
    }

    /**
     * @description A boolean function whose retun value indicates if a header can be sorted.
     * @param key - The column headder name whose searchability is to be determined
     * @returns (boolean) True of the sort headers includes the supplied key, otherwise false
     */
    function canSortHeader(key) { return !noSortHeaders.includes(key) };


    /**
     * 
     * @param key - The header name whose sorting cabibilities are to be assesed
     * @returns An object with two properties indicating sortability, and direction
     */
    function getSortHeaderProps(key) {
        return ({
            isSortHeader: key === state.sorting.key,
            sortDirection: key === state.sorting.key ? state.sorting.order : sortStates.NONE,
        })
    };


    function getDecoratedCell(cell, row) {
        const cv = row.cells[3].value;
        let theClassName = ''
        switch (cv) {
            case '-':
                theClassName = styles.deletion;
                break;
            case '+':
                theClassName = styles.addition;
                break;
            case '~':
                theClassName = styles.tilde;
                break;
            case '!':
                theClassName = styles.exclamation;
                break;
            default:
                break;
        }
        if (cell.info.header === 'om' ) {
            return (                                                
                <TableCell className={theClassName}>
                <OverflowMenu size="sm" flipped data-cy={'om-ofm-1'}>
                    <OverflowMenuItem data-cy={'om-show-diff'} itemText={t('compareResultsTable.overflow_menu.show_diff')} onClick={() => diffFunctions(row)} />
                </OverflowMenu>
                </TableCell>
            )
        }

        return (
            <TableCell
                key={cell.id}
                className={theClassName}
            >
                <span className={theClassName}>{cell.value}</span>
            </TableCell>
        );
    }

    function clickHandler(key) {
        dispatch(toggleCompareResultsSortOrder(key));
    }


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
        dispatch(
            compareSetResultsPaging(cleanData)
        );
    }

    /**
     * @description - renders a percent box using the supplied percentage value. If undefined or null is supplied as the
     * percentage value, it will use 0.
     * @param percentage - The percent full [0..100]
     * @param fillColor - The fill rgba | hex css color
     * @returns A JSX component
     */
    function getPercentBox(percentage: number | undefined | null, fillColor: string) {
        let pct: number;
        if (percentage === undefined || percentage === null) {
            return ('')
        } else {
            pct = percentage;
        }
        return (
            <PercentBoxes percentage={pct} boxCount={1} fillColor={fillColor}/>
        );
    }

    /**
     * 
     * @returns A JSX fragment and children
     */
    function renderTableTitle() {
        let statsObj = curState.compare.results.stats || {}; 
        let results = curState.compare.results || {};
        return (
            <>
                <Grid>
                    <Column lg={4} sm={4} md={4}>
                        <div className={styles.similarityValue}>
                            {t('compareResultsTable.description', { similarityValue: results.similarity || '' })}
                        </div>
                    </Column>
                    <Column lg={2} sm={2} md={2}>
                        {/* TODO: Ian would like to click on any content in this div and filter the list by the associated statistic */}
                        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
                            Identical: {statsObj.identical ? statsObj.identical : ''}
                            { getPercentBox(statsObj.identicalp,'#101010a' )}
                        </div>
                    </Column>
                    <Column lg={2} sm={2} md={2}>
                        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
                            Similar: { statsObj.similar ? statsObj.similar : ''}
                            { getPercentBox(statsObj.similarp,'#0031857a' ) } 
                        </div>
                    </Column>
                    <Column lg={2} sm={2} md={2}>
                        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
                            Mismatch: { statsObj.mismatches ? statsObj.mismatches : ''}
                            { getPercentBox(statsObj.mismatchesp, '#af7201e3')}
                        </div>
                    </Column>
                    <Column lg={2} sm={2} md={2}>
                        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
                            Deletions: {statsObj.deletions ? statsObj.deletions : ''}
                            { getPercentBox(statsObj.deletionsp, '#e800004d')}
                        </div>
                    </Column>
                    <Column lg={2} sm={2} md={2}>
                        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
                            Additions: {statsObj?.additions ? statsObj.additions : ''}
                            { getPercentBox(statsObj.additionsp, '#0fe80055')}
                        </div>
                    </Column>
                </Grid>
                <Grid>
                    <Column lg={8} sm={8} md={8}>
                        {/* <ExpressiveCard label={'left'} title={curState.compare.query[0]['metadata.name']}> */}
                        {/* label={'right'} title={curState.compare.query[1]['metadata.name']} */}
                        {curState.compare.query && (curState.compare.query.length > 1) ?
                            <ExpressiveCard >
                                <Table size={'sm'} className={styles.crtHeaderTable}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell style={{ minWidth: '100px' }}>File Name:</TableCell>
                                            <TableCell>{curState.compare.query[0]['metadata.name']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>File Hash</TableCell>
                                            <TableCell>{curState.compare.query[0].sha256}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>File Type</TableCell>
                                            <TableCell>{curState.compare.query[0].filetypesAsCsv}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Last updated:</TableCell>
                                            <TableCell>{new Date(curState.compare.query[0].last_updated * 1000).toISOString()}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>File size:</TableCell>
                                            <TableCell>{curState.compare.query[0]['metadata.filesize']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Gene count:</TableCell>
                                            <TableCell>{curState.compare.query[0]['gene_counts']}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </ExpressiveCard> : ('')
                        }
                    </Column>
                    <Column lg={8} sm={8} md={8}>
                        {curState.compare.query && (curState.compare.query.length > 1) ?
                            <ExpressiveCard >
                                <Table size={'sm'} className={styles.crtHeaderTable}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell style={{ minWidth: '100px' }}>File Name:</TableCell>
                                            <TableCell>{curState.compare.query[1]['metadata.name']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>File Hash</TableCell>
                                            <TableCell>{curState.compare.query[1].sha256}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>File Type</TableCell>
                                            <TableCell>{curState.compare.query[1].filetypesAsCsv}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Last Updated:</TableCell>
                                            <TableCell>{new Date(curState.compare.query[1].last_updated * 1000).toISOString()}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>File size:</TableCell>
                                            <TableCell>{curState.compare.query[1]['metadata.filesize']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Gene count:</TableCell>
                                            <TableCell>{curState.compare.query[1]['gene_counts']}</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>

                            </ExpressiveCard> : ''
                        }
                    </Column>

                </Grid>
            </>
        )
    }

    function renderDataTable(local_headers) {
        return (
            <div>
                <DataTable rows={state.rows} headers={local_headers} isSortable stickyHeader={true} size={'md'} >
                    {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                        // <TableContainer title={`${trimmedFileName}`}
                        <TableContainer title={ renderTableTitle()}
                            description={''}
                            stickyHeader={true} style={{ textAlign: 'left' }}
                        >
                            <TableToolbar>
                                <TableToolbarContent>
                                    {/* pass in `onInputChange` change here to make filtering work */}
                                    <TableToolbarSearch onChange={filterRows} />
                                </TableToolbarContent>
                            </TableToolbar>
                            <Table className="bx--data-table--compact">
                                <TableHead>
                                    <TableRow>
                                        {headers.map((header) => (
                                            <TableHeader
                                                {...getHeaderProps({ header, isSortable: canSortHeader(header.key) })}
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
                                                    getDecoratedCell(cell, row)
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={headers.length}>
                                                <NoDataEmptyState
                                                    title={'No results yet'}
                                                    subtitle={''}
                                                    illustrationTheme="dark"
                                                // title={t('emptyState.alerts.no_alerts_yet')}
                                                // description={t('emptyState.investigations.configured')}
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
                    pageSizes={state.paging.totalItems > 100 ? [10, 20, 50, 100, state.paging.totalItems] : [10, 20, 50, 100]}
                    totalItems={state.paging.totalItems}
                    itemRangeText={(min, max, total) => {
                        return `${min} - ${max} of ${total} items`;
                    }}
                    size="md"
                    data-cy={'crt-pagination-1'}
                    onChange={onChange}
                />
            </div>
        );

    }

    /**
     * Re-execute  the state stoer subcriber when the DOM is ready, state has been pdated, or store is updated
     */
    useEffect(() => {
        stateStoreSubscriber(true);
    }, [state.mounted, curState, store]);


    /**
     * load the i18n (internationalization) strings for the colum headers
     */
    let local_headers = curState.compare.customColumns.selectedColumns.map((column) => {
        if (column === 'f1') {
            if (curState.compare.query && curState.compare.query.length > 1) {
                const namep = curState.compare.query[0]['metadata.name']
                const hash1 = curState.compare.query[0]['sha256'].substr(0, 8)
                const name1 = namep + ' (' + hash1 + ') ';
                return { header: t(`compareResultsTable.headers.${column}`, { name1: name1 }), key: column };
            } else {
                return { header: t(`compareResultsTable.headers.${column}`, { name1: '' }), key: column };
            }
        }
        if (column === 'f2') {
            if (curState.compare.query && curState.compare.query.length > 1) {
                const namep = curState.compare.query[1]['metadata.name']
                const hash2 = curState.compare.query[1]['sha256'].substr(0, 8)
                const name2 = namep + ' (' + hash2 + ') ';
                return { header: t(`compareResultsTable.headers.${column}`, { name2: name2 }), key: column };
            } else {
                return { header: t(`compareResultsTable.headers.${column}`, { name2: '' }), key: column };
            }
        }

        return { header: t(`compareResultsTable.headers.${column}`), key: column };
    });
    // Append the actions column
    local_headers.push({ header: t('compareResultsTable.headers.om'), key: 'om'});

    /**
     * Render the component
     */
    return (
        <div>
            { showTearsheet && <CompareFunctionTearsheet isOpen={showTearsheet} setOpen={setShowTearsheet} f1={functionCompareLeftFilename} f2={functionCompareRightFilename}  />}
            {state.mounted ? (
                renderDataTable(local_headers)
            ) : (
                <DataTableSkeleton headers={local_headers} key={'dts1'} rowCount={undefined} columnCount={undefined} zebra={undefined} compact={undefined} className={undefined} showHeader={undefined} showToolbar={undefined} />
            )}
        </div>
    );
}
