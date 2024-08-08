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
import React, { FC, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tearsheet, Toolbar, ToolbarButton, ToolbarGroup, } from '@carbon/ibm-products';
import { ArrowsVertical } from '@carbon/icons-react';
import {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Grid,
    Column,
    Table,
    TableBody,
    TableCell,
    TableRow,
    ToastNotification,
    Theme
} from '@carbon/react';
import { useDispatch, useSelector } from 'react-redux';
import { getLLVMIR } from '@/common/GetLLVMIR';
import { ElapsedTimeLoader } from "@/components/ElapsedTimeLoader/ElapsedTimeLoader";
import { PercentBoxesV2 as PercentBoxes } from '@/components/PercentBoxesV2';
import {
    functionCompareClearLeftFailed,
    functionCompareClearRightFailed,
    functionCompareSetLeftLLVMIR,
    functionCompareSetRightLLVMIR
} from '@/store/actions/functionCompare.actions';
import styles from './CompareFunctionTearsheet.module.scss'
import { DiffMachineCodeDataRow, DiffStats, WorkerCompareResult } from '@/common/types';
import CompareMachineCodeTable, { PageType } from '@/components/CompareMachineCodeTable/CompareMachineCodeTable';
import './config'
export interface CompareFunctionTearsheetProps {
    isOpen: boolean;
    setOpen(isOpen: boolean): void;
    f1: string;
    f2: string;
}

/**
 * @description On open, this funciton will request the content of the props.f1 and props.f2 files from the 
 * code genome backend.  Once received the contents are sent to a worker thread for processing.  Once the
 * diffs have been computed by the worker thread the document will be re-rendered to display the results via
 * method getDiffs().
 * @param props An instance of CompareFunctionTearsheetProps
 * @returns A React Function component.
 */
export const CompareFunctionTearsheet: FC<CompareFunctionTearsheetProps> = (props: CompareFunctionTearsheetProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const curState = useSelector((state: any) => state);
    const [mounted, setMounted] = useState(false);
    const [ready, setReady] = useState(false);
    const [fdiff, setFdiff] = useState(null as any);
    const [addrDiffs, setAddrDiffs] = useState(null as any);
    const [mcodeDiffs, setMcodeDiffs] = useState(null as any);
    const [asmDiffs, setAsmDiffs] = useState(null as any);
    const [fdiff_start_ts, set_fdiff_start_ts] = useState(-1);
    const [fdiff_end_ts, set_fdiff_end_ts] = useState(-1);
    const [fdiff_error_ts, set_fdiff_error_ts] = useState(-1);
    const [fdiff_error, set_fdiff_error] = useState('');
    const [usePaging, setUsePaging] = useState(true);
    const [rowData, setRowData] = useState({ left: [] as DiffMachineCodeDataRow[], right: [] as DiffMachineCodeDataRow[]})
    const fdiff_stats = useRef({
        added: 0,
        deleted: 0,
        unchanged: 0,
        total: 0
    } as DiffStats);
    const asm_diff_stats = useRef({
        added: 0,
        deleted: 0,
        unchanged: 0,
        total: 0
    } as DiffStats);
    let diffWorker = useRef({} as Worker);

    const [paging, setPaging] = useState({
        page: 1,
        totalItems: rowData.left.length,
        pageSize: 8,
        pageSizes: [8, 16, 32]
    } as PageType)

    async function getLLVMIrForFile() {
        // Query the llvmir for both files
        await getLLVMIR('', dispatch, curState.compare.query[0].sha256, props.f1, true);
        await getLLVMIR('', dispatch, curState.compare.query[1].sha256, props.f2, false);
    }
    /**
     * @description update the redux error state for the compare utility.
     * @returns false
     */
    function clearLeftError() {
        dispatch(functionCompareClearLeftFailed());
        return false;
    }

    /**
     * @description update the redux error state for the compare utility.
     * @returns false
     */
    function clearRightError() {
        dispatch(functionCompareClearRightFailed());
        return false;
    }

    /**
     * @description - Add a span to the targetFragment containing the string value of the supplied part and 
     * color it using the supplied CSS color value from the color parameter.
     * @param part - The diff part whose string value will be added to the target fragment with
     * foreground color specified by the color parameter.
     * @param color - The forground CSS color for the span
     * @param targetFragment - The document fragment to add the new span to.
     */
    function addSpan(part: [number, string], color: string, targetFragment: DocumentFragment) {
        const span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document
            .createTextNode(part[1]));
        targetFragment.appendChild(span);
    }

    /**
     * @description - Adds a string in a span with the supplied forground CSS attribute.
     * @param value - The content to embed in the span
     * @param color - The forground CSS color for the span
     * @param targetFragment - The document fragment to add the new span to.
     */
    function addSpanEx(value: string, color: string, targetFragment: DocumentFragment) {
        const span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document
            .createTextNode(value));
        targetFragment.appendChild(span);
    }

    /**
     * @description - Count the number of newlines in the supplied diff entry.
     * @param part - The current difference entry whose newlines are to be counted
     * @returns The number of newlines detected
     */
    function countLinesInText(part:[number, string]) {
        const regexp = /\n/g;
        return ([...part[1].matchAll(regexp)].length)

    }

    /**
     * @description - Adds newLineCount new lines to the document fragment specified by tragetFragment
     * @param newLineCount - the number of newlines to add to the supplied targetFragment
     * @param targetFragment - The document fragment to add the newlines to
     * @param backgroundColor - The CSS background color for the newline
     */
    function addNewLineEx(newLineCount, targetFragment: DocumentFragment, backgroundColor: string) {
        for (let i = 0; i < newLineCount; i++) {
            const span = document.createElement('span');
            span.style.color = 'grey';
            span.style.backgroundColor = backgroundColor;
            span.style.display = 'inline';
            span.appendChild(document
                .createTextNode("\n"));
            targetFragment.appendChild(span);
        }
    }

    /**
     * 
     * @param deletedLinesSinceLastCommon - How many deleted lines since the last common part was encountered
     * @param rightFragment - The right file (new) fragment container
     * @param addedLinesSinceLastCommon - How many added lines since the last common part was encountered
     * @param leftFragment - The left file (original) fragment container
     * @returns The updated number of deletedLinesSinceLastCommon and addedLinesSinceLastCommon values.
     */
    function addNewlineDeltas(deletedLinesSinceLastCommon: number, rightFragment: DocumentFragment, addedLinesSinceLastCommon: number, leftFragment: DocumentFragment) {
        if (deletedLinesSinceLastCommon > 0) {
            addNewLineEx(deletedLinesSinceLastCommon, rightFragment, '#323232');
            deletedLinesSinceLastCommon = 0;
        }
        if (addedLinesSinceLastCommon > 0) {
            addNewLineEx(addedLinesSinceLastCommon, leftFragment, '#323232');
            addedLinesSinceLastCommon = 0;
        }
        return { deletedLinesSinceLastCommon, addedLinesSinceLastCommon };
    }


    /**
     * @description  DOM cleanup - remove any children from the attach points for the 
     * file comparison.
     */
    function cleanupOldColumns() {
        const oldLeftColumn = document.getElementById('cf-ts-left');
        if (oldLeftColumn) {
            for (const child of oldLeftColumn.children) {
                oldLeftColumn.removeChild(child);
            }
            oldLeftColumn.innerHTML = '';
            oldLeftColumn.innerText = '';
        }
        const oldRightColumn = document.getElementById('cf-ts-right');
        if (oldRightColumn) {
            for (const child of oldRightColumn.children) {
                oldRightColumn.removeChild(child);
            }
            oldRightColumn.innerHTML = '';
            oldRightColumn.innerText = '';
        }

    }

    /**
     * @description - Pass the llvm_ir for the left and right file 
     * to the worker for processing.
     */
    async function computeDiffsInWorker() {
        const leftFile = curState.functionCompare.left_llvm_ir.data.data.llvm_ir;
        const rightFile = curState.functionCompare.right_llvm_ir.data.data.llvm_ir;
        const leftAsm = curState.functionCompare.left_llvm_ir.data.data.asm;
        const rightAsm = curState.functionCompare.right_llvm_ir.data.data.asm;
        const message = {
            leftFile,
            rightFile,
            leftAsm,
            rightAsm
        }
        if (diffWorker.current) {
            // The worker onMessage processing funciton will deal with the result.
            diffWorker.current.postMessage(message);
            console.log(`posted messsage to DiffWorker instance...`)
        }
    }

    /**
     * 
     * @param curPart - The current string value of the sub part being processed
     * @param leftFragment - The left file (original) fragment container
     * @param rightFragment - The right file (new) fragment container
     * @param color - A CSS color stirng
     * @param parts - The array of strings from which curPart was derrived
     * @param i - The index of curPart in the parts array
     */
    function processCommonNonZeroPart(
        curPart: string, 
        leftFragment: DocumentFragment, 
        rightFragment: DocumentFragment, 
        color, 
        parts: string[],
        i: number) {
        if (curPart !== "") {
            // Do not bother adding an empty span for the newline case
            addSpanEx(curPart, color, leftFragment);
            addSpanEx(curPart, color, rightFragment);
        }
        if (curPart === "" && i < parts.length - 1) {
            addNewLineEx(1, leftFragment, '#171717');
            addNewLineEx(1, rightFragment, '#171717');
        }
    }


    /**
     * @description This routine breaks the current common part (to both files i.e. original and new) on newlines.
     * If either the previous part ended in a newline, or the current part contains newlines then add the newline
     * deltas to the left and right fragments after the previous line or after the first newline in the current part
     * respectively.
     * @param part - A diff part
     * @param prevPart - The last processed diff part
     * @param deletedLinesSinceLastCommon - How many deleted lines since the last common part was encountered
     * @param addedLinesSinceLastCommon - How many added lines since the last common part was encountered
     * @param leftFragment - The left file (original) fragment container
     * @param rightFragment - The right file (new) fragment container
     * @returns The updated number of deletedLinesSinceLastCommon and addedLinesSinceLastCommon values.
     */
    function processCommonPart(
        part: [number, string],
        prevPart: [number, string],
        deletedLinesSinceLastCommon: number,
        addedLinesSinceLastCommon: number,
        leftFragment: DocumentFragment,
        rightFragment: DocumentFragment) {
        const color = 'grey'; // common code color
        let parts = part[1].split('\n');
        // add it to both sides 
        for (let i = 0; i < parts.length; i++) {
            let curPart = parts[i];
            if (i == 0) {
                let caughtUp = false;
                // do not insert newlines in the middle of a sentence.
                if (prevPart[1].endsWith('\n')) {
                    ({ deletedLinesSinceLastCommon, addedLinesSinceLastCommon } = addNewlineDeltas(deletedLinesSinceLastCommon, rightFragment, addedLinesSinceLastCommon, leftFragment));
                    caughtUp = true;
                }
                if (parts.length > 1) {
                    addSpanEx(curPart, color, rightFragment);
                    addSpanEx(curPart, color, leftFragment);
                    // If there's a linesplit inject columns after the first newlime
                    if (!caughtUp) {
                        ({ deletedLinesSinceLastCommon, addedLinesSinceLastCommon } = addNewlineDeltas(deletedLinesSinceLastCommon, rightFragment, addedLinesSinceLastCommon, leftFragment));
                    }
                    addNewLineEx(1, leftFragment, '#171717');
                    addNewLineEx(1, rightFragment, '#171717');
                } else { // No newlines found
                    addSpanEx(curPart, color, leftFragment);
                    addSpanEx(curPart, color, rightFragment);
                }
            } else {
                processCommonNonZeroPart(curPart, leftFragment, rightFragment, color, parts, i);
            }
        }
        return { deletedLinesSinceLastCommon, addedLinesSinceLastCommon };
    };


    /**
     * 
     * @param part The diff part whose CSS color is to be returned.
     * @returns a CSS color stirng
     */
    function getColorForPart(part: [number, string]) {
        let color = 'grey';
        if (part[0] === 1) {
            color = 'green';
        } else if (part[0] === -1) {
            color = 'red';
        }
        return color;
    }

    /**
     * @description Construct two document fragments representing changes to the origional file in the leftFragment
     * and changes to the new file in the rightFragment.  When fully constructed, add the left & right fragments to the
     * document at 'cf-ts-left' and 'cf-ts-right' document elements respectively.
     */
    function getDiffs() {
        /**
         * Cleanup any previous runs
         */
        cleanupOldColumns();
        const leftFragment = document.createDocumentFragment();
        const rightFragment = document.createDocumentFragment();
        let deletedLinesSinceLastCommon = 0;
        let addedLinesSinceLastCommon = 0;
        if (fdiff) {
            let prevPart = [2, ''] as any;
            for (const part of fdiff) {
                const color = getColorForPart(part);
                if (part[0] === 1) {
                    addSpan(part, color, rightFragment);
                    addedLinesSinceLastCommon += countLinesInText(part);
                    fdiff_stats.current.added += 1;
                } else if (part[0] === -1) {
                    addSpan(part, color, leftFragment);
                    deletedLinesSinceLastCommon += countLinesInText(part);
                    fdiff_stats.current.deleted += 1;
                } else {
                    ({ deletedLinesSinceLastCommon, addedLinesSinceLastCommon } = processCommonPart(part, prevPart, deletedLinesSinceLastCommon, addedLinesSinceLastCommon, leftFragment, rightFragment));
                    fdiff_stats.current.unchanged += 1;
                }
                fdiff_stats.current.total += 1;
                prevPart = part;
            }
        }
        // Now add the fragments to the 
        const leftColumn = document.getElementById('cf-ts-left');
        leftColumn?.appendChild(leftFragment);
        const rightColumn = document.getElementById('cf-ts-right');
        rightColumn?.appendChild(rightFragment);
    }

    useEffect(() => {

        if (curState.functionCompare.left_llvm_ir?.status === 200 &&
            curState.functionCompare.right_llvm_ir?.status === 200) {
            if (!ready) {
                set_fdiff_start_ts(new Date().getTime());
                // give the UI time to re-render before invoking diff api which 
                // will block the GUI.  It *never* yields cpu.
                // computeDiffs();
                computeDiffsInWorker(); // dispatch msg to the worker thread
            }
        }
    }, [curState.functionCompare.right_llvm_ir]);

    /**
     * When the DOM is ready, load the LLVMs and setup the 
     * Worker thread and onmessage event for the Worker
     * so that the results can be rendered.
     */
    useEffect(() => {
        setMounted(true);
        // Setup the diff worker thread.
        if (window.Worker) {
            diffWorker.current = new Worker('/static/DiffWorker.js');
            diffWorker.current.onmessage = function (e: MessageEvent) {
                // need a better event structure to handle errors etc.
                const result: WorkerCompareResult = e.data;
                if (result.status === 200) {
                    set_fdiff_end_ts(new Date().getTime());
                    setFdiff(result.diffs);
                    setAddrDiffs(result.addrDiffs)
                    setAsmDiffs(result.asmDiffs);
                    setMcodeDiffs(result.mcodeDiffs);
                    setRowData(result.rowData);
                    setReady(true); // trigger a re-render.
                } else {
                    set_fdiff_error(result.statusText);
                    set_fdiff_error_ts(new Date().getTime());
                }
            }
            diffWorker.current.onerror = function (e: ErrorEvent) {
                console.error(e.message);
            }
        }
        getLLVMIrForFile();
    }, []);

    useEffect(()=>{
        setPaging({
            page: 1,
            totalItems: rowData.left.length,
            pageSize: 8,
            pageSizes: [8, 16, 32]    
        })
    },[rowData])


    function renderMain() {
        return (
            <>
                <Grid fullWidth>
                    <Column lg={8} sm={8} md={8}>
                        <Table size={'sm'} className={styles.crtHeaderTable}>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{ minWidth: '100px' }}>Source file hash </TableCell>
                                    <TableCell> {curState.compare.query[0].sha256} </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ minWidth: '100px'}}> Source file name: </TableCell>
                                    <TableCell>{curState.compare.query[0]['metadata.name']}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ minWidth: '100px' }}>function name </TableCell>
                                    <TableCell> {props.f1} </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Column>
                    <Column lg={8} sm={8} md={8}>
                        <Table size={'sm'} className={styles.crtHeaderTable}>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{ minWidth: '100px' }}>Source file hash </TableCell>
                                    <TableCell> {curState.compare.query[1].sha256} </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ minWidth: '100px'}}> Source file name: </TableCell>
                                    <TableCell>{curState.compare.query[1]['metadata.name']}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ minWidth: '100px' }}>function name </TableCell>
                                    <TableCell> {props.f2} </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Column>
                    <Column lg={8} sm={8} md={8}>
                        {mounted &&
                            <ElapsedTimeLoader label={''} start_ts={curState.functionCompare.left_start_ts} end_ts={curState.functionCompare.left_end_ts} error_ts={curState.functionCompare.left_error_ts} />
                        }
                        {curState.functionCompare.leftFunctionFailed &&
                            <ToastNotification
                                aria-label="closes notification"
                                caption={new Date().toLocaleTimeString()}
                                onClose={clearLeftError}
                                onCloseButtonClick={function noRefCheck() { }}
                                statusIconDescription="notification"
                                subtitle={curState.functionCompare.leftFunctionError.message}
                                title={t('SearchPage.searchError')} />
                        }
                    </Column>
                    <Column lg={8} sm={8} md={8}>
                        {mounted &&
                            <ElapsedTimeLoader label={''} start_ts={curState.functionCompare.right_start_ts} end_ts={curState.functionCompare.right_end_ts} error_ts={curState.functionCompare.right_error_ts} />
                        }
                        {curState.functionCompare.rightFunctionFailed &&
                            <ToastNotification
                                aria-label="closes notification"
                                caption={new Date().toLocaleTimeString()}
                                onClose={clearRightError}
                                onCloseButtonClick={function noRefCheck() { }}
                                statusIconDescription="notification"
                                subtitle={curState.functionCompare.rightFunctionError.message}
                                title={t('SearchPage.searchError')} />
                        }
                    </Column>
                </Grid>
                {/* Tabs go here */}
                <Tabs>
                    <TabList aria-label="List of tabs">
                        <Tab data-cy="machine-code-tab">{'Machine Code'}</Tab>
                        <Tab data-cy="llvm-tab">{t('compareFunctionTearsheet.llvmir')}</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Toolbar className={styles.toolbarConfig}>
                                <ToolbarGroup>
                                <ToolbarButton 
                                            iconDescription={t('compareFunctionTearsheet.toggle_paging')}
                                            data-cy={'review-document-categories'}
                                            renderIcon={ArrowsVertical}
                                            onClick={ () => {setUsePaging(!usePaging)}}
                                        />
                                </ToolbarGroup>
                            </Toolbar>
                            <Grid fullWidth id="cf-tearsheet-assembler-main">
                                <Column lg={8} md={4} sm={2}>
                                    <pre id="cf-ts-asm-left" style={{ textAlign: 'left', overflowX: 'scroll', border: '1px solid #444444' }}>
                                    { ready  && (
                                        <CompareMachineCodeTable rowData={rowData.left} setPaging={setPaging} paging={paging} usePaging={usePaging}/>
                                    )}
                                    </pre>
                                </Column>
                                <Column lg={8} md={4} sm={2}>
                                    <pre id="cf-ts-asm-right" style={{ textAlign: 'left', overflowX: 'scroll', border: '1px solid #444444' }}>
                                    { ready  && (
                                        <CompareMachineCodeTable rowData={rowData.right} setPaging={setPaging} paging={paging} usePaging={usePaging}/>
                                    )}
                                    </pre>
                                </Column>
                                
                            </Grid>
                        </TabPanel>
                        <TabPanel>
                            <Grid fullWidth id="cf-tearsheet-main">
                                {ready && getDiffs()}
                                <Column lg={8} sm={8} md={8}>
                                    <Table size={'sm'} className={styles.crtHeaderTable}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{ minWidth: '100px' }}>Added blocks</TableCell>
                                                <TableCell>
                                                    <PercentBoxes boxCount={5} fillColor='#00ff00' percentage={fdiff_stats.current.total > 0 ? (fdiff_stats.current.added / fdiff_stats.current.total) * 100 : 0} />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ minWidth: '100px' }}>Deleted blocks</TableCell>
                                                <TableCell>
                                                    <PercentBoxes boxCount={5} fillColor='#ff0000' percentage={fdiff_stats.current.total > 0 ? (fdiff_stats.current.deleted / fdiff_stats.current.total) * 100 : 0} />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ minWidth: '100px' }}>Unchanged blocks</TableCell>
                                                <TableCell>
                                                    <PercentBoxes boxCount={5} fillColor='#555555' percentage={fdiff_stats.current.total > 0 ? (fdiff_stats.current.unchanged / fdiff_stats.current.total) * 100 : 0} />
                                                </TableCell>
                                            </TableRow>

                                        </TableBody>
                                    </Table>

                                </Column>
                                <Column lg={8} sm={8} md={8}>
                                    <ElapsedTimeLoader label="diff time" start_ts={fdiff_start_ts} end_ts={fdiff_end_ts} error_ts={fdiff_error_ts} />
                                    {fdiff_error !== '' &&
                                        <ToastNotification
                                            aria-label="closes notification"
                                            caption={new Date().toLocaleTimeString()}
                                            onClose={clearLeftError}
                                            onCloseButtonClick={function noRefCheck() { }}
                                            statusIconDescription="notification"
                                            subtitle={fdiff_error}
                                            title={t('SearchPage.searchError')} />
                                    }
                                </Column>
                                <Column lg={8} sm={8} md={8} >
                                    <pre id="cf-ts-left" style={{ textAlign: 'left', overflowX: 'scroll', border: '1px solid #444444' }}>
                                    </pre>
                                </Column>
                                <Column lg={8} sm={8} md={8}>
                                    <pre id="cf-ts-right" style={{ textAlign: 'left', overflowX: 'scroll', border: '1px solid #444444' }}>
                                    </pre>
                                </Column>
                            </Grid>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </>
        )
    }

    return (
        <Theme theme="g100">
            <Tearsheet
                open={props.isOpen}
                actions={[
                    {
                        key: 1,
                        kind: 'primary',
                        label: t('cancel'),
                        "data-cy": 'id-cft-close',
                        onClick: () => {
                            dispatch(functionCompareSetLeftLLVMIR({}))
                            dispatch(functionCompareSetRightLLVMIR({}))
                            props.setOpen(false)
                        }
                    }
                ]}
                title={t('compareFunctionTearsheet.title')}
                portalTarget={document.getElementById('compare-page')}
                onClose={() => {
                    dispatch(functionCompareSetLeftLLVMIR({}))
                    dispatch(functionCompareSetRightLLVMIR({}))
                    props.setOpen(false)
                }}
            >
                {renderMain()}
            </Tearsheet>
        </Theme>
    );
}

