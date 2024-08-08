import React from 'react'
import ComparePage from './ComparePage'
import { Provider as ReduxProvider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  
} from "react-router-dom";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { store } from '@/common/store';

const mock = new MockAdapter(axios);
const url = '/api/v1/compare/files/by_file_ids'
const payload = {"id1":"63b1053b86641d563fa04249edb8786209823e7621a966a49d6e6d1d9efcb6fc","id2":"3056dbc9b5f92f8dac3604cfa5c25646959f22917a34ee8ecb1b2e957d568399","method":"genes_v1_3_1.jaccard_distance_w","output_detail":"simple"};

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<ComparePage />', () => {
  const state: any = store.getState();

  state.history.history = [{"id":"5f4438f11880421a9ffe591ca78ea78b94a051c4af52fba8d14288daec9bd293","filename":"auditd","subid":"2929567880","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1699311368402,"fileid":"5f4438f11880421a9ffe591ca78ea78b94a051c4af52fba8d14288daec9bd293","filehash":"5f4438f11880421a9ffe591ca78ea78b94a051c4af52fba8d14288daec9bd293"},{"id":"63b1053b86641d563fa04249edb8786209823e7621a966a49d6e6d1d9efcb6fc","filename":"cupsctl","subid":"4072681993","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1695760680050,"fileid":"63b1053b86641d563fa04249edb8786209823e7621a966a49d6e6d1d9efcb6fc","filehash":"63b1053b86641d563fa04249edb8786209823e7621a966a49d6e6d1d9efcb6fc"},{"id":"3056dbc9b5f92f8dac3604cfa5c25646959f22917a34ee8ecb1b2e957d568399","filename":"cupsaccept","subid":"3245989088","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1695760667692,"fileid":"3056dbc9b5f92f8dac3604cfa5c25646959f22917a34ee8ecb1b2e957d568399","filehash":"3056dbc9b5f92f8dac3604cfa5c25646959f22917a34ee8ecb1b2e957d568399"},{"id":"fd1a3fa3013a9b0fe99da38513a02b3d38e2852978d736ed3e74c1140d4b4c4c","filename":"sed-4.5_gcc-8.2.0_x86_64_O1_sed.elf","subid":"3617685784","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1695407132813,"fileid":"fd1a3fa3013a9b0fe99da38513a02b3d38e2852978d736ed3e74c1140d4b4c4c","filehash":"fd1a3fa3013a9b0fe99da38513a02b3d38e2852978d736ed3e74c1140d4b4c4c"},{"id":"42c46254a926a2f81a08cf66d800a0fc79eb2bdaba9a176dc7ba73bc706e4193","filename":"sed-4.5_gcc-8.2.0_arm_32_O2_sed.elf","subid":"","status":200,"statusText":"OK","submitted_time":1695406902624,"fileid":"42c46254a926a2f81a08cf66d800a0fc79eb2bdaba9a176dc7ba73bc706e4193","filehash":"42c46254a926a2f81a08cf66d800a0fc79eb2bdaba9a176dc7ba73bc706e4193"},{"id":"f3246f49c6cde6b9a2ebdde5901e42508338fe3295e950e1831c48e224efe340","filename":"sed-4.5_gcc-8.2.0_x86_32_O2_sed.elf","subid":"","status":200,"statusText":"OK","submitted_time":1695406893488,"fileid":"f3246f49c6cde6b9a2ebdde5901e42508338fe3295e950e1831c48e224efe340","filehash":"f3246f49c6cde6b9a2ebdde5901e42508338fe3295e950e1831c48e224efe340"},{"id":"9391e4376953629c88706d0a8c8d21f7b3198048414de058e271a4262a8b5ae6","filename":"BTLEServerAgent","subid":"4208970860","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694709557183,"fileid":"9391e4376953629c88706d0a8c8d21f7b3198048414de058e271a4262a8b5ae6","filehash":"9391e4376953629c88706d0a8c8d21f7b3198048414de058e271a4262a8b5ae6"},{"id":"dac6c94a5ae466521a662430ff1308549429d1e55d5cd8a36dfc3d6e6589242e","filename":"accton","subid":"2377547889","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694709462400,"fileid":"dac6c94a5ae466521a662430ff1308549429d1e55d5cd8a36dfc3d6e6589242e","filehash":"dac6c94a5ae466521a662430ff1308549429d1e55d5cd8a36dfc3d6e6589242e"},{"id":"befdea5bbf93e090c23c40ce420fdda93dc08a2b7ebc831b22428e2b2886260c","filename":"checkgid","subid":"470248269","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694641520987,"fileid":"befdea5bbf93e090c23c40ce420fdda93dc08a2b7ebc831b22428e2b2886260c","filehash":"befdea5bbf93e090c23c40ce420fdda93dc08a2b7ebc831b22428e2b2886260c"},{"id":"a945b95e7008f86ae6d33ed0c5195cccbec23ea61229683da36d54f923ad0209","filename":"chat","subid":"1366815912","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694641512029,"fileid":"a945b95e7008f86ae6d33ed0c5195cccbec23ea61229683da36d54f923ad0209","filehash":"a945b95e7008f86ae6d33ed0c5195cccbec23ea61229683da36d54f923ad0209"},{"id":"1d80723cb1bfd53061f94f264fb4f69bc19e8aac9c09f7925c526522d3f2b005","filename":"diskutil","subid":"3580357459","status":200,"statusText":"OK","submitted_time":1694638770154,"fileid":"1d80723cb1bfd53061f94f264fb4f69bc19e8aac9c09f7925c526522d3f2b005","filehash":"1d80723cb1bfd53061f94f264fb4f69bc19e8aac9c09f7925c526522d3f2b005","jobstatus":"Success"},{"id":"8e755a68168403948b5ed8535dcd807d4fbe90fd1f8efc9e6c958dc499b919bd","filename":"ddns-confgen","subid":"1965984109","status":200,"statusText":"OK","submitted_time":1694638750236,"fileid":"8e755a68168403948b5ed8535dcd807d4fbe90fd1f8efc9e6c958dc499b919bd","filehash":"8e755a68168403948b5ed8535dcd807d4fbe90fd1f8efc9e6c958dc499b919bd","jobstatus":"Success"},{"id":"681453c879f26d0f1c16afb4c103d511c50619283c82943677a0f241800b5735","filename":"arp","subid":"","status":200,"statusText":"OK","submitted_time":1694638689177,"fileid":"681453c879f26d0f1c16afb4c103d511c50619283c82943677a0f241800b5735","filehash":"681453c879f26d0f1c16afb4c103d511c50619283c82943677a0f241800b5735"},{"id":"495255bbddd38c24f675d8c282779864471fae8734942ee2c1c977356dd2652b","filename":"BTLEServer","subid":"56634655","status":200,"statusText":"OK","submitted_time":1694638412684,"fileid":"495255bbddd38c24f675d8c282779864471fae8734942ee2c1c977356dd2652b","filehash":"495255bbddd38c24f675d8c282779864471fae8734942ee2c1c977356dd2652b","jobstatus":"Success"},{"id":"092f2740e0609f35bb0044814a9cee97c80f215a8f8108de1148c4760234ea5f","filename":"automount","subid":"3351997765","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694638293543,"fileid":"092f2740e0609f35bb0044814a9cee97c80f215a8f8108de1148c4760234ea5f","filehash":"092f2740e0609f35bb0044814a9cee97c80f215a8f8108de1148c4760234ea5f"},{"id":"b1e47897b1b7303b1e3268db64cce08ef0687580d4e861f321654cbb4193a511","filename":"auditreduce","status":200,"statusText":"OK","submitted_time":1694637746059,"fileid":"b1e47897b1b7303b1e3268db64cce08ef0687580d4e861f321654cbb4193a511","filehash":"b1e47897b1b7303b1e3268db64cce08ef0687580d4e861f321654cbb4193a511","subid":"4221786814"},{"id":"4881f52163e419099e73a7495e2150c7aabdcebd54f04d90769da3c23b8ed839","filename":"auditd","subid":"2043754431","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694637055927,"fileid":"4881f52163e419099e73a7495e2150c7aabdcebd54f04d90769da3c23b8ed839","filehash":"4881f52163e419099e73a7495e2150c7aabdcebd54f04d90769da3c23b8ed839"},{"id":"e4061972261f63068d59b898e27c43abb90b56d3fff0ed8fcfe845ecca3e68bb","filename":"audit","subid":"921116268","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694635598575,"fileid":"e4061972261f63068d59b898e27c43abb90b56d3fff0ed8fcfe845ecca3e68bb","filehash":"e4061972261f63068d59b898e27c43abb90b56d3fff0ed8fcfe845ecca3e68bb"},{"id":"afe9ac34d6f1bbd93f27c99ef94418c23fecd1e9b60fa6fec58dd52f2bda58cc","filename":"asr","status":200,"statusText":"OK","submitted_time":1694635042768,"fileid":"afe9ac34d6f1bbd93f27c99ef94418c23fecd1e9b60fa6fec58dd52f2bda58cc","filehash":"afe9ac34d6f1bbd93f27c99ef94418c23fecd1e9b60fa6fec58dd52f2bda58cc","subid":"774626728"},{"id":"ed3e91082ad1f09403ed69f77e26af97fe52dc4c9101eb08fc6f5c9d0771068c","filename":"aslmanager","status":200,"statusText":"OK","submitted_time":1694634885482,"fileid":"ed3e91082ad1f09403ed69f77e26af97fe52dc4c9101eb08fc6f5c9d0771068c","filehash":"ed3e91082ad1f09403ed69f77e26af97fe52dc4c9101eb08fc6f5c9d0771068c"},{"id":"10f13cad48be436a4c7b31187920ff1eb19dadfa958a1fd58cf5a761acb4a610","filename":"appleh13camerad","subid":"2088984046","jobstatus":"unknown","status":500,"statusText":"","submitted_time":1694633790971,"fileid":"10f13cad48be436a4c7b31187920ff1eb19dadfa958a1fd58cf5a761acb4a610"},{"id":"9545144d909ac4dfff48eb070ca1c362e2cef3ecd12a01232b376cecd0e70a8d","filename":"appsleepd","subid":"3107319911","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694633437318,"fileid":"9545144d909ac4dfff48eb070ca1c362e2cef3ecd12a01232b376cecd0e70a8d","filehash":"9545144d909ac4dfff48eb070ca1c362e2cef3ecd12a01232b376cecd0e70a8d"},{"id":"2f6ad4380b83fdd0e552bf89392029844b0a788effc8e702db917d3375ddb30e","filename":"apachectl","subid":"","jobstatus":"unknown","status":500,"statusText":"","submitted_time":1694633342584,"fileid":"2f6ad4380b83fdd0e552bf89392029844b0a788effc8e702db917d3375ddb30e"},{"id":"1a41f112b20b584be4ce3c07a7aecb2744ed7c2c6eb2c9443d370d89baeee96a","filename":"ac","subid":"3514349609","status":200,"statusText":"OK","submitted_time":1694633209643,"fileid":"1a41f112b20b584be4ce3c07a7aecb2744ed7c2c6eb2c9443d370d89baeee96a","filehash":"1a41f112b20b584be4ce3c07a7aecb2744ed7c2c6eb2c9443d370d89baeee96a"},{"id":"458310c896f81d827613f5590f750e9cf5f1677ad34b6cfc418c26280c77615d","filename":"ab","subid":"424585129","status":200,"statusText":"OK","submitted_time":1694632652780,"fileid":"458310c896f81d827613f5590f750e9cf5f1677ad34b6cfc418c26280c77615d","filehash":"458310c896f81d827613f5590f750e9cf5f1677ad34b6cfc418c26280c77615d"},{"id":"135fefe606a10532b84d630bf979a7d5c34016125ef4e4b491da304f3f059530","filename":"BootCacheControl","subid":"830827117","jobstatus":"Success","status":200,"statusText":"OK","submitted_time":1694465028963,"fileid":"135fefe606a10532b84d630bf979a7d5c34016125ef4e4b491da304f3f059530","filehash":"135fefe606a10532b84d630bf979a7d5c34016125ef4e4b491da304f3f059530"},{"id":"53717ad5a139a6011dc1d76668cf8e293f6add95591d831d81bcd2a24847b6f3","filename":"bluetoothd","subid":"611561516","status":200,"statusText":"OK","submitted_time":1694459084019,"fileid":"53717ad5a139a6011dc1d76668cf8e293f6add95591d831d81bcd2a24847b6f3","filehash":"53717ad5a139a6011dc1d76668cf8e293f6add95591d831d81bcd2a24847b6f3"},{"id":"0b82d383c515c89ecfd3b04ca26b84b5fc2635fcbac64cd6995bba5c2e0cb94f","jobstatus":"Success","status":200,"statusText":"OK","subid":"899788063","submitted_time":-1,"filehash":"0b82d383c515c89ecfd3b04ca26b84b5fc2635fcbac64cd6995bba5c2e0cb94f"}];
  state.history.paging.totalItems = state.history.history.length;
  

  it('renders', () => {
    cy.intercept('GET', '/static/DiffWorker.js', { fixture: 'DiffWorker.txt' })
    cy.intercept('GET', '/static/UploadWorker.js', { fixture: 'UploadWorker.txt' })
  
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <ReduxProvider store={store}>
        <BrowserRouter>
          <ComparePage />
        </BrowserRouter>
      </ReduxProvider>

    )
  })
  it('renders - an actual compare ...', () => {
    cy.intercept('GET', '/static/DiffWorker.js', { fixture: 'DiffWorker.txt' })
    cy.intercept('GET', '/static/UploadWorker.js', { fixture: 'UploadWorker.txt' })
  
    // see: https://on.cypress.io/mounting-react
    // for this to work, a history entry for both hashes must be present with 200 rc.
    mock.onPost(url).reply(200,
      {
        "query": [
            {
                "id": "63b1053b86641d563fa04249edb8786209823e7621a966a49d6e6d1d9efcb6fc",
                "sha256": "63b1053b86641d563fa04249edb8786209823e7621a966a49d6e6d1d9efcb6fc",
                "type": "file",
                "metadata.filesize": 134752,
                "metadata.name": "cupsctl",
                "gene_count.genes_v1_3_2": 25,
                "last_updated": 1695760680,
                "filetypes": []
            },
            {
                "id": "3056dbc9b5f92f8dac3604cfa5c25646959f22917a34ee8ecb1b2e957d568399",
                "sha256": "3056dbc9b5f92f8dac3604cfa5c25646959f22917a34ee8ecb1b2e957d568399",
                "type": "file",
                "metadata.filesize": 134640,
                "metadata.name": "cupsaccept",
                "gene_count.genes_v1_3_2": 23,
                "last_updated": 1695760668,
                "filetypes": []
            }
        ],
        "results": {
            "similarity": 36,
            "jaccard_distance": 0.64,
            "matches": {
                "match_count": 13,
                "match_ratio": "13/33",
                "gene_counts": [
                    25,
                    23
                ],
                "total_matched_gene_size": 12472,
                "total_query_gene_size": 34288
            },
            "diff_details": [
                {
                    "op": "~",
                    "f1": "function_10000393a",
                    "f2": "function_100003b46",
                    "score": 99,
                    "g1": "d7ac5e119ab1a8272537115098fc083682adb55c8ae88903b1d110529196f3f9",
                    "g2": "0a77a657d9ba234976362318b1d9f20ef714e0ef44dbb5ccd866017578ead971"
                },
                {
                    "op": "=",
                    "f1": "function_100003940",
                    "f2": "function_100003b4c",
                    "score": 100,
                    "g1": "033a34d97ff80670826bfcab96df8691bf3b35694f4467f3bba202e3228a2599",
                    "g2": "033a34d97ff80670826bfcab96df8691bf3b35694f4467f3bba202e3228a2599"
                },
                {
                    "op": "=",
                    "f1": "function_100003946",
                    "f2": "function_100003b52",
                    "score": 100,
                    "g1": "a4ac872662406140cfa7ba6df128ad635ad9ba44cf58d9e38d46b523d1afdc5c",
                    "g2": "a4ac872662406140cfa7ba6df128ad635ad9ba44cf58d9e38d46b523d1afdc5c"
                },
                {
                    "op": "~",
                    "f1": "function_100003964",
                    "f2": "function_100003b5e",
                    "score": 99,
                    "g1": "98c362a4be85ff3387191fdce4bc2355102e062f18d39ea455d90887ae2c9694",
                    "g2": "d6ceb39a88132115b90fd2731ce7e20863dc39a1abf4e28b400ba41d56221466"
                },
                {
                    "op": "=",
                    "f1": "function_100003970",
                    "f2": "function_100003b64",
                    "score": 100,
                    "g1": "2725f1dd601d1ec2792a72fa2fe4672dd369a48db41bcfd871ae81a3f4fc0d09",
                    "g2": "2725f1dd601d1ec2792a72fa2fe4672dd369a48db41bcfd871ae81a3f4fc0d09"
                },
                {
                    "op": "=",
                    "f1": "function_100003982",
                    "f2": "function_100003b6a",
                    "score": 100,
                    "g1": "0b0afb1eb8f74f64594b4ebce9d2cfc71287facba55ee01f0ab5ff1dc48c3260",
                    "g2": "0b0afb1eb8f74f64594b4ebce9d2cfc71287facba55ee01f0ab5ff1dc48c3260"
                },
                {
                    "op": "=",
                    "f1": "function_100003988",
                    "f2": "function_100003b70",
                    "score": 100,
                    "g1": "5128564af9dd90c8649fc1bcb48046e727f3dbd2486a91041f3bc3b486c10b90",
                    "g2": "5128564af9dd90c8649fc1bcb48046e727f3dbd2486a91041f3bc3b486c10b90"
                },
                {
                    "op": "=",
                    "f1": "function_10000398e",
                    "f2": "function_100003b76",
                    "score": 100,
                    "g1": "e350246119214711bee5583a45cb5c7b4b29af0d9f8bfa62cf5b4a9e009df409",
                    "g2": "e350246119214711bee5583a45cb5c7b4b29af0d9f8bfa62cf5b4a9e009df409"
                },
                {
                    "op": "=",
                    "f1": "function_100003994",
                    "f2": "function_100003b82",
                    "score": 100,
                    "g1": "df653d27a55c0215fb5ffa525ba3adb312938976d23fadeb51bd1e08ee8cc3fb",
                    "g2": "df653d27a55c0215fb5ffa525ba3adb312938976d23fadeb51bd1e08ee8cc3fb"
                },
                {
                    "op": "~",
                    "f1": "function_1000039a0",
                    "f2": "function_100003b7c",
                    "score": 99,
                    "g1": "0e7ae3e2e72089bb12d0a747a16ea0387dc99e35a296554613dfe539ead155e9",
                    "g2": "4a234154a095dc1666e0023ea7de4ceec2b9331f26261645367c3e1c08e531dd"
                },
                {
                    "op": "=",
                    "f1": "function_1000039ac",
                    "f2": "function_100003ba6",
                    "score": 100,
                    "g1": "609ba9cdccc33f848db9a7004689cd172dc10eee9fbd6dcca5574883ac102982",
                    "g2": "609ba9cdccc33f848db9a7004689cd172dc10eee9fbd6dcca5574883ac102982"
                },
                {
                    "op": "~",
                    "f1": "function_1000039b2",
                    "f2": "function_100003bac",
                    "score": 99,
                    "g1": "686507f17a086cb2c137df10b8e083bee049b857adc51d0023af38757f4a82ea",
                    "g2": "6f93d57cc15f24b0f0a21dee63497ff84d2155414c4da757da36c9e10a7f7f3c"
                },
                {
                    "op": "=",
                    "f1": "function_1000039b8",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_1000039c8",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_1000039d2",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_1000039dc",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_1000039e6",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_1000039f0",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_1000039fa",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a04",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a0e",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a18",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a22",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a2c",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a36",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a40",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a4a",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a54",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a5e",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a68",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a72",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a7c",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a86",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a90",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "=",
                    "f1": "function_100003a9a",
                    "f2": "function_100003c5e",
                    "score": 100,
                    "g1": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6",
                    "g2": "f01201d5869199d1c77b7e305bda09fe204dab125d4bb25c68fda97877f1a2c6"
                },
                {
                    "op": "!",
                    "f1": "entry_point",
                    "f2": "entry_point",
                    "score": 98,
                    "g1": "29b7acc70c7a912778e804206a3ab6a6689688804f50decd30594253ad87e6cb",
                    "g2": "276cfd58c8a38f742ff3797974a8103d00fdbc76d85e22e2ceda3e3f4eeaf445"
                },
                {
                    "op": "-",
                    "f1": "function_10000399a",
                    "f2": "",
                    "score": 98,
                    "g1": "1db21edc843e0a8e911cb5ab458c806e84f3366c5499fed2770988d3e5b0fe6f",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_100003976",
                    "f2": "",
                    "score": 98,
                    "g1": "64c6fdd0a414a1742e12d05e3414ed650022bdc6f666990400b5e2c2611b6faf",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_1000039a6",
                    "f2": "",
                    "score": 98,
                    "g1": "725fd72c0ba915a5fd463d406838131be73f0f49b99b562ae1631f001014d041",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_10000394c",
                    "f2": "",
                    "score": 98,
                    "g1": "f1e0d6316b7032c6ec6240458a4cdd9aeaf21a03c503c448adc53584ba5a5d4e",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_10000396a",
                    "f2": "",
                    "score": 98,
                    "g1": "a806d7a8e879ee0b6cb7bcf41ca0fc861e840f4c1df016bb771fff65817e2117",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_100003958",
                    "f2": "",
                    "score": 98,
                    "g1": "8922d03028a7a3da57d60453d1a259a475baa368f126a9af182d85ed67683b35",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_10000395e",
                    "f2": "",
                    "score": 98,
                    "g1": "4f4a55bc43c6aa45f0152be9546af8be75156b4293400b7b3b82cdecfc28c4d4",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_100003952",
                    "f2": "",
                    "score": 98,
                    "g1": "00c52d2fad0fe5b7b14ff26bcaf4b5193318e143c9b5d42b0305c17ea8b08d79",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_100003934",
                    "f2": "",
                    "score": 98,
                    "g1": "2fa3aa0f44ec33cfe5c26f2ef746e5bd887f45e491a3a6daff98a871256cdf06",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_100003842",
                    "f2": "",
                    "score": 97,
                    "g1": "34175610bf86afa4565711ad34922d6150652aa52af1d3dacff610631fc99f24",
                    "g2": ""
                },
                {
                    "op": "-",
                    "f1": "function_10000397c",
                    "f2": "",
                    "score": 98,
                    "g1": "44c60bfc6413d67f2b1c495084f68be011fc1a14d2ac29a4022dc5434e8dfbc9",
                    "g2": ""
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003b9a",
                    "score": 0,
                    "g1": "",
                    "g2": "b4120e351ba793847be16123289c71f61866c438a4a73cc58831dedb8d3aa46b"
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003b40",
                    "score": 0,
                    "g1": "",
                    "g2": "c64f4adc49343132d3fde541f67c6e2549a517080def55647a4b5da4c7e512a6"
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003ba0",
                    "score": 0,
                    "g1": "",
                    "g2": "17f59d88df9f0634fc4d7b1b5f5b640f2741565f1120d913e7b84097c2abb518"
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003b8e",
                    "score": 0,
                    "g1": "",
                    "g2": "43689f5b6596f910f28a9c6cc8eeb1d36b0ae1526883a6ba039ee98d14b12fab"
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003bb2",
                    "score": 0,
                    "g1": "",
                    "g2": "87d87bc30aa441c5c9e16ca7c69b66d40f65bbe8b6978e271d9f15575709668f"
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003b88",
                    "score": 0,
                    "g1": "",
                    "g2": "4e6051784e8222f829f41759e54544246742efac6f8d291b71ffb11fed4e7645"
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003b58",
                    "score": 0,
                    "g1": "",
                    "g2": "6304c1b6dcd2da7f1538f7f7f3c8e2d5cd620c3a8397dc8b8619c84142ac3338"
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003a82",
                    "score": 0,
                    "g1": "",
                    "g2": "0f5b22a8bdbbb4b1d10bc3c9746befbca6be918302eb2309c35c61c22608475e"
                },
                {
                    "op": "+",
                    "f1": "",
                    "f2": "function_100003b94",
                    "score": 0,
                    "g1": "",
                    "g2": "70f08d9f8e4a5d85e45312f0d582a92827eb1d9f86912b6f381de53d201ea231"
                }
            ]
        },
        "stats": {
            "main_query_time": 0.0003314018249511719,
            "dist_compute_time": 0.007702827453613281,
            "result_prep_time": 0.0008094310760498047,
            "init_prep_time": 0.0003337860107421875
        },
        "status": "Success"
    }
    );
    const hash1 = '63b1053b86641d563fa04249edb8786209823e7621a966a49d6e6d1d9efcb6fc';
    const hash2 = '3056dbc9b5f92f8dac3604cfa5c25646959f22917a34ee8ecb1b2e957d568399';

    const geneURL = '/api/v1/search/gene';
    mock.onPost(geneURL).replyOnce(200,
        {
            "status": "Success",
            "data": {
                "id": "d7ac5e119ab1a8272537115098fc083682adb55c8ae88903b1d110529196f3f9",
                "type": "gene",
                "subtype": "func_gene",
                "version": "genes_v1_3_2",
                "canon_bc_size": 976,
                "file_offset": 0,
                "llvm_ir": "source_filename = \"<string>\"\n\ndeclare i64 @__cupsLangPrintf(i64, i64, i64, i64) local_unnamed_addr\n\ndefine i64 @_F(i64 %a1, i64 %a2, i64 %a3, i64 %a4) local_unnamed_addr {\nb1:\n  %v1 = tail call i64 @__cupsLangPrintf(i64 %a1, i64 %a2, i64 %a3, i64 %a4)\n  ret i64 %v1\n}\n",
                "asm": {
                    "metadata": {
                        "name": "f1",
                        "start_addr": "0x4011a0",
                        "end_addr": "0x4011b5"
                    },
                    "asms": [ 
                        ["0x4011a0","55","push rbp"],
                        ["0x4011a1","48 89 e5","mov rbp, rsp"],
                        ["0x4011a4","89 7d fc","mov dword ptr [rbp - 4], edi"],
                        ["0x4011a7","8b 45 fc","mov eax, dword ptr [rbp - 4]"],
                        ["0x4011aa","83 c0 20","add eax, 0x20"],
                        ["0x4011ad","89 45 f8","mov dword ptr [rbp - 8], eax"],
                        ["0x4011b0","8b 45 f8","mov eax, dword ptr [rbp - 8]"],
                        ["0x4011b3","5d","pop rbp"],
                        ["0x4011b4","c3","ret"]
                    ]
                }
            }
        }
        );
    mock.onPost(geneURL).replyOnce(200,{
        "status": "Success",
        "data": {
            "id": "0a77a657d9ba234976362318b1d9f20ef714e0ef44dbb5ccd866017578ead971",
            "type": "gene",
            "subtype": "func_gene",
            "version": "genes_v1_3_2",
            "canon_bc_size": 980,
            "file_offset": 0,
            "llvm_ir": "source_filename = \"<string>\"\n\ndeclare i64 @__cupsLangPrintf(i64, i8*, i64, i64) local_unnamed_addr\n\ndefine i64 @_F(i64 %a1, i8* %a2, i64 %a3, i64 %a4) local_unnamed_addr {\nb1:\n  %v1 = tail call i64 @__cupsLangPrintf(i64 %a1, i8* %a2, i64 %a3, i64 %a4)\n  ret i64 %v1\n}\n",
            "asm": {
                "metadata": {
                    "name": "f2",
                    "start_addr": "0x4011c0",
                    "end_addr": "0x4011e5"
                },
                "asms": [
                    ["0x4011c0","55","push rbp"],
                    ["0x4011c1","48 89 e5","mov rbp, rsp"],
                    ["0x4011c4","89 7d fc","mov dword ptr [rbp - 4], edi"],
                    ["0x4011c7","c7 45 f8 1f 00 00 00","mov dword ptr [rbp - 8], 0x1f"],
                    ["0x4011ce","8b 45 f8","mov eax, dword ptr [rbp - 8]"],
                    ["0x4011d1","83 c0 01","add eax, 1"],
                    ["0x4011d4","89 45 f8","mov dword ptr [rbp - 8], eax"],
                    ["0x4011d7","8b 45 fc","mov eax, dword ptr [rbp - 4]"],
                    ["0x4011da","03 45 f8","add eax, dword ptr [rbp - 8]"],
                    ["0x4011dd","89 45 f8","mov dword ptr [rbp - 8], eax"],
                    ["0x4011e0","8b 45 f8","mov eax, dword ptr [rbp - 8]"],
                    ["0x4011e3","5d","pop rbp"],
                    ["0x4011e4","c3","ret"]
                ]
            }
        }
    })
    mock.onPost(geneURL).replyOnce(200,
        {
            "status": "Success",
            "data": {
                "id": "d7ac5e119ab1a8272537115098fc083682adb55c8ae88903b1d110529196f3f9",
                "type": "gene",
                "subtype": "func_gene",
                "version": "genes_v1_3_2",
                "canon_bc_size": 976,
                "file_offset": 0,
                "llvm_ir": "source_filename = \"<string>\"\n\ndeclare i64 @__cupsLangPrintf(i64, i64, i64, i64) local_unnamed_addr\n\ndefine i64 @_F(i64 %a1, i64 %a2, i64 %a3, i64 %a4) local_unnamed_addr {\nb1:\n  %v1 = tail call i64 @__cupsLangPrintf(i64 %a1, i64 %a2, i64 %a3, i64 %a4)\n  ret i64 %v1\n}\n"
            }
        }
        );
    mock.onPost(geneURL).replyOnce(200,{
        "status": "Success",
        "data": {
            "id": "0a77a657d9ba234976362318b1d9f20ef714e0ef44dbb5ccd866017578ead971",
            "type": "gene",
            "subtype": "func_gene",
            "version": "genes_v1_3_2",
            "canon_bc_size": 980,
            "file_offset": 0,
            "llvm_ir": "source_filename = \"<string>\"\n\ndeclare i64 @__cupsLangPrintf(i64, i8*, i64, i64) local_unnamed_addr\n\ndefine i64 @_F(i64 %a1, i8* %a2, i64 %a3, i64 %a4) local_unnamed_addr {\nb1:\n  %v1 = tail call i64 @__cupsLangPrintf(i64 %a1, i8* %a2, i64 %a3, i64 %a4)\n  ret i64 %v1\n}\n"
        }
    })

    // const diffWorker = cy.fixture('DiffWorker.js').as(di)

    cy.mount(
      <ReduxProvider store={store}>
        <MemoryRouter initialEntries={[`/compare/${hash1}/${hash2}`]}>
          <Routes>
            <Route path={'/compare/:sha256_p1/:sha256_p2'} element={<ComparePage />}></Route>
          </Routes>
        </MemoryRouter>
      </ReduxProvider>

    )
    // Now compare two file hashes
    cy.contains('cupsctl');
    cy.contains('cupsaccept');
    // Launch the compare function tearsheet
    cy.get('input[id="2"]').click();
    cy.get('input[id="2"]').type('~');
    cy.get('[data-cy=om-ofm-1]').first().click({force: true});
    cy.get('[data-cy=om-show-diff]').first().click({force: true});
    cy.get('[data-cy=llvm-tab]').click({force: true});
    cy.get('[data-cy=machine-code-tab').click({force: true});
    cy.wait(5000);
    cy.get('[data-cy=id-cft-close]').click({force:true});
    // scroll 3 pages forward
    cy.get('[data-cy=crt-pagination-1]').find('button').last().click({force:true});
    cy.get('[data-cy=crt-pagination-1]').find('button').last().click({force:true});
    cy.get('[data-cy=crt-pagination-1]').find('button').last().click({force:true});

  })

})