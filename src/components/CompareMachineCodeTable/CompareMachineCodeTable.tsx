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
import { DiffDataFragment, DiffMachineCodeDataRow } from "@/common/types";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { NoDataEmptyState } from '@carbon/ibm-products';
import styles from './CompareMachineCodeTable.module.scss';
export interface PageType {
    page: number;
    totalItems: number;
    pageSize: number;
    pageSizes: number[];
}

export interface CompareMachineCodeTableProps {
    rowData: DiffMachineCodeDataRow[];
    setPaging: React.Dispatch<React.SetStateAction<PageType>>;
    paging: PageType;
    usePaging: boolean;
}


export const CompareMachineCodeTable: FC<CompareMachineCodeTableProps> = (props) => {
    const { t } = useTranslation();
    const addrHeader = t('CompareMachineCodeTable.addr');
    const mcodeHeader = t('CompareMachineCodeTable.mcode');
    const asmHeader = t('CompareMachineCodeTable.asm');
    const local_headers = [
        { header: '#', key: 'id' }, // artificial
        { header: addrHeader, key: 'addr' },
        { header: mcodeHeader, key: 'mcode' },
        { header: asmHeader, key: 'asm' }
    ];



    const [activeRows, setActiveRows] = useState(props.usePaging && (props.rowData.length > props.paging.pageSize) ?
        props.rowData.slice((props.paging.page - 1) * props.paging.pageSize, props.paging.page * props.paging.pageSize) :
        props.rowData
    )

    function getSpansForCell(ddfType: number, ddfData: string) {
        let theClassName = '';
        switch (ddfType) {
            case -1:
                theClassName = styles.deletion;
                break;
            case 1:
                theClassName = styles.addition;
                break;
            default:
                theClassName = styles.common;
                break;
        }
        return (
            <span className={theClassName}>{ddfData}</span>
        )
    }



    function getDecoratedCell(cell, row) {
        if (cell.info.header === 'id') {
            return (
                <TableCell>{cell.value}</TableCell>
            );
        }
        const c: DiffDataFragment[] = cell.value;
        return (
            <TableCell>
                {c.map((ddf: DiffDataFragment) => {
                    return getSpansForCell(ddf.type, ddf.data)
                })}
            </TableCell>
        );
    }

    function onChange(data) {
        const cleanData: PageType = {
            page: data.page ? data.page : 1,
            pageSize: data.pageSize ? data.pageSize : 8,
            pageSizes: props.paging.pageSizes,
            totalItems: data.totalItems ? data.totalItems : props.paging.totalItems
        }
        props.setPaging(cleanData);
    }
    useEffect(()=> {
        setActiveRows(props.usePaging && (props.rowData.length > props.paging.pageSize) ?
            props.rowData.slice((props.paging.page - 1) * props.paging.pageSize, (props.paging.page * props.paging.pageSize)) :
            props.rowData);
    }, [props.paging, props.usePaging])

    return (
        <div>
            <DataTable rows={activeRows} headers={local_headers} isSortable stickyHeader={true} size={'md'} >
                {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                    // <TableContainer title={`${trimmedFileName}`}
                    <TableContainer title={''}
                        stickyHeader={true} style={{ textAlign: 'left' }}>
                        <Table className="bx--data-table--compact">
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader
                                            {...getHeaderProps({ header, isSortable: false })}
                                            key={header.key}
                                        >
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody >
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
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DataTable>
            { props.usePaging && 
                <Pagination
                    backwardText="Backward"
                    page={props.paging.page}
                    pageSize={props.paging.pageSize}
                    pageSizes={props.paging.pageSizes}
                    totalItems={props.paging.totalItems}
                    itemRangeText={(min, max, total) => {
                        return `${min} - ${max} of ${total} items`;
                    }}
                    size="md"
                    data-cy={'crt-pagination-1'}
                    onChange={onChange}
                />
            }
        </div>
    )
}

export default CompareMachineCodeTable;