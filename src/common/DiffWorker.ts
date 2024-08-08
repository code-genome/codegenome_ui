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
import DiffMatchPatch from 'diff-match-patch';
import { DiffMachineCodeDataRow, ProcessedAsmData, WorkerCompareRequest, WorkerCompareResult } from "@/common/types";
import { convertAsmDiffToArrays } from '@/common/MachineCodeUtil';


function processAsmData(wcr: WorkerCompareRequest) : ProcessedAsmData {
    const result: ProcessedAsmData = {
        addrLeft: '',
        addrRight: '',
        mcodeLeft: '',
        mcodeRight: '',
        asmLeft: '',
        asmRight: ''
    }
    if (wcr.leftAsm?.asms && wcr.leftAsm.asms.length > 0)
    {
        for(const entry of wcr.leftAsm.asms) {
            result.addrLeft += (entry[0] + '\n'); 
            result.mcodeLeft += (entry[1] + '\n'); 
            result.asmLeft += (entry[2] + '\n');
        }
    }
    if (wcr.rightAsm?.asms && wcr.rightAsm.asms.length > 0) {
        for(const entry of wcr.rightAsm.asms) {
            result.addrRight += entry[0] + '\n'; 
            result.mcodeRight += entry[1] + '\n'; 
            result.asmRight += entry[2] + '\n';
        }
    }
    return result;
}

onmessage = function (e: MessageEvent) {
    try {
        console.log('received a message...');
        // Step 1 LLVM IR diff.
        const wcr: WorkerCompareRequest = e.data;
        const converter = new DiffMatchPatch();
        converter.Diff_Timeout = 10.0
        const diffs: any[] = converter.diff_main(wcr.leftFile, wcr.rightFile, false);
        converter.diff_cleanupEfficiency(diffs);
        
        // Step 2 assembly diff
        /**
         * accumulate 3 strings each for left and right by concatenating
         * array elements with newline characters.
         * addrLeft, mcodeLeft, asmLeft
         * addrRight, mcodeRight, and asmRight
         * 
         * addrDiffs = converter.diff_main(addrLeft, addrRight, false)
         * converter.diff_cleanupEfficiency(addrDiffs)
         * mcodeDiffs = converter.diff_main(mcodeLeft, mcodeRight, false)
         * converter.diff_cleanupEfficiency(mcodeDiffs)
         * asmDiffs = converter.diff_main(asmLeft, asmRight, false)
         * converter.diff_cleanupEfficiency(asmDiffs);
         */
        const asmStrings = processAsmData(wcr);
        const converterAddr = new DiffMatchPatch();
        converterAddr.Diff_Timeout = 10.0

        const addrDiffs = converterAddr.diff_main(asmStrings.addrLeft, asmStrings.addrRight, false);
        converterAddr.diff_cleanupEfficiency(addrDiffs);

        const converterMcode = new DiffMatchPatch();
        converterMcode.Diff_Timeout = 10.0
        const mcodeDiffs = converterMcode.diff_main(asmStrings.mcodeLeft, asmStrings.mcodeRight, false);
        converterMcode.diff_cleanupEfficiency(mcodeDiffs);

        const converterAsm = new DiffMatchPatch();
        converterAsm.Diff_Timeout = 10.0
        const asmDiffs = converterAsm.diff_main(asmStrings.asmLeft, asmStrings.asmRight, false);
        converterAsm.diff_cleanupSemantic(asmDiffs);

        const rowData: { left: DiffMachineCodeDataRow[], right: DiffMachineCodeDataRow[]} = convertAsmDiffToArrays(asmDiffs, asmStrings);

        // Now send the result back to the requestor
        const result: WorkerCompareResult = {
            status: 200,
            statusText: 'Success',
            diffs,
            addrDiffs,
            mcodeDiffs,
            asmDiffs,
            rowData
        }
        postMessage(result);
    } catch (err) {
        console.log('DiffWorker caught an error :facepalm: !');
        console.error(`Error: ${JSON.stringify(err)}`)
        const result: WorkerCompareResult = {
            status: 500,
            statusText: JSON.stringify(err),
            diffs: [],
            addrDiffs: [],
            mcodeDiffs: [],
            asmDiffs:[],
            rowData: { left:[], right:[]}
        }
        postMessage(result);
    }
}

export default onmessage;