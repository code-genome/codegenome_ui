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

import { DiffDataFragment, DiffMachineCodeDataRow, ProcessedAsmData } from "@/common/types";


/**
 * @description - Given a left/right compare result build left & right row data.
 * Each row is an array of DiffDataFragments.  The intent being to provide
 * a mapable array to a data table which can return an JSX element for each 
 * column's data based on it's type attribute.
 * @param dmp A diff-match-patch array
 */
function getDMPDiffs(dmp: any[]): { left: DiffDataFragment[], right: DiffDataFragment[] }[] {
    const result: { left: DiffDataFragment[], right: DiffDataFragment[] }[] = [];
    let left: DiffDataFragment[] = [];
    let right: DiffDataFragment[] = [];
    for (const part of dmp) {
        const cmpts = part[1].split('\n');
        let added = 1;
        if (part[0] === 1) {
            // add (right fragment)
            // part[1] contains the text to be added
            // determine how many empty rows need to be added to the left file
            for (const element of cmpts) {
                if (added > 1) {
                    // now add the row to the result (i.e. we've hit a newline)
                    result.push({ left, right });
                    left = [];
                    right = [];
                }
                left.push({ type: 0, data: '' });
                right.push({ type: 1, data: element })
                added+=1;
            }
        } else if (part[0] === -1) {
            for (const element of cmpts) {
                if (added > 1) {
                    // now add the row to the result (i.e. we've hit a newline)
                    result.push({ left, right });
                    left = [];
                    right = [];
                }
                right.push({ type: 0, data: '' });
                left.push({ type: -1, data: element })
                added+=1;
            }
        } else {
            for (const element of cmpts) {
                // common fragment.
                if (added > 1) {
                    // now add the row to the result (i.e. we've hit a newline)
                    result.push({ left, right });
                    left = [];
                    right = [];
                }
                left.push({ type: 0, data: element })
                right.push({ type: 0, data: element })
                added+=1;
            }
        }
    }
    return result;
}

function isRowEmpty(ddf: DiffDataFragment[]): boolean {
    let isEmpty = true;
    for (const ddfe of ddf) {
        if (ddfe.data !=='') {
            return false;
        }
    }
    return isEmpty;
}

function getAddrRows(asmRows: {
    left: DiffDataFragment[];
    right: DiffDataFragment[];
}[], pad: ProcessedAsmData) {
  const addrRows: { left: DiffDataFragment[], right: DiffDataFragment[] }[] = [];
  const srcLeft = pad.addrLeft.split('\n');
  const srcRight = pad.addrRight.split('\n');
  let leftIndex = 0;
  let rightIndex = 0;
  for (const row of asmRows) {
    let left: DiffDataFragment[] = [];
    let right: DiffDataFragment[] = [];  
    const leftIsEmpty = isRowEmpty(row.left);
    const rightIsEmpty = isRowEmpty(row.right);
    if (leftIsEmpty) {
      left.push( { data: '', type: 0})
    } else {
      left.push( { data: srcLeft[leftIndex], type: 0 })
      leftIndex+=1;
    }
    if (rightIsEmpty) {
        right.push( { data: '', type: 0})
    } else {
        right.push( { data: srcRight[rightIndex], type: 0})
        rightIndex+=1;
    }
    addrRows.push( { left, right } );
  }
  return addrRows;
}

function getMcodeRows(asmRows: {
    left: DiffDataFragment[];
    right: DiffDataFragment[];
}[], pad: ProcessedAsmData) {
    const mcodeRows: { left: DiffDataFragment[], right: DiffDataFragment[] }[] = [];
    const srcLeft = pad.mcodeLeft.split('\n');
    const srcRight = pad.mcodeRight.split('\n');
    let leftIndex = 0;
    let rightIndex = 0;
  
    for (const row of asmRows) {
        let left: DiffDataFragment[] = [];
        let right: DiffDataFragment[] = [];
        const leftIsEmpty = isRowEmpty(row.left);
        const rightIsEmpty = isRowEmpty(row.right);
        if (leftIsEmpty) {
          left.push( { data: '', type: 0})
        } else {
          left.push( { data: srcLeft[leftIndex], type: 0 })
          leftIndex+=1;
        }
        if (rightIsEmpty) {
            right.push( { data: '', type: 0})
        } else {
            right.push( { data: srcRight[rightIndex], type: 0})
            rightIndex+=1;
        }
        mcodeRows.push( { left, right } );
    }
    return mcodeRows;
  }
function mergeDMPs(addrRows: { left: DiffDataFragment[]; right: DiffDataFragment[]; }[], mcodeRows: { left: DiffDataFragment[]; right: DiffDataFragment[]; }[], asmRows: { left: DiffDataFragment[]; right: DiffDataFragment[]; }[], result: { left: DiffMachineCodeDataRow[]; right: DiffMachineCodeDataRow[]; }) {
    const left: DiffMachineCodeDataRow[] = [];
    const right: DiffMachineCodeDataRow[] = [];
    for (let i=0;i<addrRows.length;i++) {
            left.push( {
                id: i+1,
                addr: addrRows[i].left,
                mcode: mcodeRows[i].left,
                asm: asmRows[i].left
            });
            right.push( {
                id: i+1,
                addr: addrRows[i].right,
                mcode: mcodeRows[i].right,
                asm: asmRows[i].right
            });
    }
    result.left = left;
    result.right = right;
    return result;
}


export function convertAsmDiffToArrays(asmDiffs: any[], pad: ProcessedAsmData): { left: DiffMachineCodeDataRow[], right: DiffMachineCodeDataRow[]} {
    const result: { left: DiffMachineCodeDataRow[], right:  DiffMachineCodeDataRow[] } = { left: [], right: []};
    const asmRows = getDMPDiffs(asmDiffs);
    const addrRows = getAddrRows(asmRows, pad);
    const mcodeRows = getMcodeRows(asmRows, pad);
    // need to assert some things here.... the expectation is that:
    // -  the size of each of these arrays is equal.
    // -  the size of the left is equal to the size of the right.
    if (addrRows.length !== mcodeRows.length) {
        throw new Error(' WE ARE DOA!!!! row lengths of addrRows and mcodeRows DO NOT MATCH!');
    }
    if (mcodeRows.length !== asmRows.length) {
        throw new Error(' WE ARE DOA!!!! row lengths of mcodeRows and asmRows DO NOT MATCH!');
    }

    mergeDMPs(addrRows, mcodeRows, asmRows, result);
    return result;
}


/**
 * 
 * @param addrDiffs in - the differences in addresses between the two sources
 * @param mcodeDiffs in - the differences in machine code between the two sources
 * @param asmDiffs in - the differences in assembly language between the two sources
 */
export function convertDiffsToArrays(addrDiffs, mcodeDiffs, asmDiffs): { left: DiffMachineCodeDataRow[], right: DiffMachineCodeDataRow[]} {
    const result: { left: DiffMachineCodeDataRow[], right:  DiffMachineCodeDataRow[] } = { left: [], right: []};
    let deletedLinesSinceLastCommon = 0;
    let addedLinesSinceLastCommon = 0;
    const addrRows = getDMPDiffs(addrDiffs);
    const mcodeRows = getDMPDiffs(mcodeDiffs);
    const asmRows = getDMPDiffs(asmDiffs);
    // need to assert some things here.... the expectation is that:
    // -  the size of each of these arrays is equal.
    // -  the size of the left is equal to the size of the right.
    if (addrRows.length !== mcodeRows.length) {
        throw new Error(' WE ARE DOA!!!! row lengths of addrRows and mcodeRows DO NOT MATCH!');
    }
    if (mcodeRows.length !== asmRows.length) {
        throw new Error(' WE ARE DOA!!!! row lengths of mcodeRows and asmRows DO NOT MATCH!');
    }
    // now merge the results into an array of DiffMachineCodeDataRows ...
    mergeDMPs(addrRows, mcodeRows, asmRows, result);
    return result;
}


