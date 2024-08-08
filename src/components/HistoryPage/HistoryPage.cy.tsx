import React from 'react'
import HistoryPage from './HistoryPage'
import { Provider as ReduxProvider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initialState } from '@/store/reducers/searchReducer';
import { initialState as historyInitialState } from '@/store/reducers/historyReducer';
import { initialState as uploadInitialState} from '@/store/reducers/uploadReducer';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const middlewares = [];
const mockStore = configureStore(middlewares);

const historyData = [
  {
    "id": "5ae3a854cbfda93811c9e0a9cfbe0e8ae788d47e8e788790e1dfb7024adf47a4",
    "filename": "cupsfilter",
    "subid": "450972195",
    "jobstatus": "Success",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1722283863154,
    "fileid": "5ae3a854cbfda93811c9e0a9cfbe0e8ae788d47e8e788790e1dfb7024adf47a4",
    "filehash": "5ae3a854cbfda93811c9e0a9cfbe0e8ae788d47e8e788790e1dfb7024adf47a4"
  },
  {
    "id": "0d713d1e7342cfdfc61adc877275e7203a64e1651c57597b28bd8a347d698c33",
    "filename": "cupsctl",
    "subid": "",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1722283772025,
    "fileid": "0d713d1e7342cfdfc61adc877275e7203a64e1651c57597b28bd8a347d698c33",
    "filehash": "0d713d1e7342cfdfc61adc877275e7203a64e1651c57597b28bd8a347d698c33"
  },
  {
    "id": "f4ce9d29866568e87c86aa42c2ddc01f55b698c9c080799bacc547f3cf47606e",
    "filename": "ckksctl",
    "subid": "1669429915",
    "jobstatus": "Success",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1722283648556,
    "fileid": "f4ce9d29866568e87c86aa42c2ddc01f55b698c9c080799bacc547f3cf47606e",
    "filehash": "f4ce9d29866568e87c86aa42c2ddc01f55b698c9c080799bacc547f3cf47606e"
  },
  {
    "id": "49af2ea7507a83174a9c3f4049b729d38d94abce54662f78176c721321e07135",
    "filename": "chown",
    "subid": "1937528535",
    "jobstatus": "Success",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1722283631298,
    "fileid": "49af2ea7507a83174a9c3f4049b729d38d94abce54662f78176c721321e07135",
    "filehash": "49af2ea7507a83174a9c3f4049b729d38d94abce54662f78176c721321e07135"
  },
  {
    "id": "aeb4b50afee8146167c35b177f139dc1fa97169042563344cc324fcf2273c949",
    "filename": "asr",
    "subid": "1237499688",
    "jobstatus": "Success",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1710372249837,
    "fileid": "aeb4b50afee8146167c35b177f139dc1fa97169042563344cc324fcf2273c949",
    "filehash": "aeb4b50afee8146167c35b177f139dc1fa97169042563344cc324fcf2273c949"
  },
  {
    "id": "5f9f88982ac05fd4cfad31c89a201c80aee3ed6e06fecd860950372267e7f40b",
    "filename": "arp",
    "subid": "4157071663",
    "jobstatus": "Success",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1710372198608,
    "fileid": "5f9f88982ac05fd4cfad31c89a201c80aee3ed6e06fecd860950372267e7f40b",
    "filehash": "5f9f88982ac05fd4cfad31c89a201c80aee3ed6e06fecd860950372267e7f40b"
  },
  {
    "id": "2f6ad4380b83fdd0e552bf89392029844b0a788effc8e702db917d3375ddb30e",
    "filename": "apachectl",
    "subid": "3469896359",
    "jobstatus": "Error",
    "status": 500,
    "statusText": "Job 3469896359 not found",
    "submitted_time": 1710372177841,
    "fileid": "2f6ad4380b83fdd0e552bf89392029844b0a788effc8e702db917d3375ddb30e",
    "filehash": "2f6ad4380b83fdd0e552bf89392029844b0a788effc8e702db917d3375ddb30e"
  },
  {
    "id": "319c751ce4bfa6e49c2bd9a038c1bde9fd06931120160a2df7f88696173dbd93",
    "filename": "actool",
    "subid": "2512875044",
    "jobstatus": "Success",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1710371596161,
    "fileid": "319c751ce4bfa6e49c2bd9a038c1bde9fd06931120160a2df7f88696173dbd93",
    "filehash": "319c751ce4bfa6e49c2bd9a038c1bde9fd06931120160a2df7f88696173dbd93"
  },
  {
    "id": "c95cc738f870582288625b67af38c7300036b3284d2c09740308e2a1b190b268",
    "filename": "aa",
    "subid": "3031880779",
    "jobstatus": "Success",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1710371460613,
    "fileid": "c95cc738f870582288625b67af38c7300036b3284d2c09740308e2a1b190b268",
    "filehash": "c95cc738f870582288625b67af38c7300036b3284d2c09740308e2a1b190b268"
  },
  {
    "id": "3e2f131d5fdc65fbc18ec37c21a576f68b17cf6b6609950e02afe39927de2cd0",
    "filename": "ac",
    "subid": "595068558",
    "jobstatus": "Success",
    "status": 200,
    "statusText": "OK",
    "submitted_time": 1710350837740,
    "fileid": "3e2f131d5fdc65fbc18ec37c21a576f68b17cf6b6609950e02afe39927de2cd0",
    "filehash": "3e2f131d5fdc65fbc18ec37c21a576f68b17cf6b6609950e02afe39927de2cd0"
  },
  {
    "id": "f0e98ad64693acf2c92fc869e845ec6fe0b9c91980b09be6c9edadd58aa6b9b6",
    "filename": "ab",
    "subid": "548138097",
    "jobstatus": "pending",
    "status": 202,
    "statusText": "pending",
    "submitted_time": 1710350816599,
    "fileid": "f0e98ad64693acf2c92fc869e845ec6fe0b9c91980b09be6c9edadd58aa6b9b6",
    "filehash": "f0e98ad64693acf2c92fc869e845ec6fe0b9c91980b09be6c9edadd58aa6b9b6"
  }
]

describe('<HistoryPage />', () => {
  const state = {
    search: {
      ...initialState
    },
    history: {
      ...historyInitialState
    },
    upload: {
      ...uploadInitialState
    }
  };
  state.history.history = historyData;
  const store = mockStore(state);

  it('renders', () => {
    cy.intercept('GET', '/static/HistoryMonitor.js', { fixture: 'HistoryMonitor.txt' })
    cy.intercept('GET', '/static/UploadWorker.js', { fixture: 'UploadWorker.txt' })
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <ReduxProvider store={store}>
        <BrowserRouter>
          <HistoryPage />
        </BrowserRouter>
      </ReduxProvider>
    )
    cy.get('[data-cy=jht-pagination-1]').find('select').first().select("10",{ force: true });
    cy.get('.cds--overflow-menu').first().click({ force: true});
    cy.wait(1000);
    cy.contains('.cds--overflow-menu-options__option-content', 'Select for compare').click({ force: true })
    cy.get('.cds--overflow-menu').eq(1).click({ force: true});
    cy.wait(1000);
    cy.contains('.cds--overflow-menu-options__option-content', 'Compare with selected').click({ force: true })
    cy.get('[data-cy=jht-pagination-1]').find('button').last().click({force:true});
    cy.get('[data-cy=jht-pagination-1]').find('button').last().click({force:true});
    cy.get('[data-cy=jht-pagination-1]').find('button').last().click({force:true});
    cy.wait(8000);
    // The history timer runs once every 60s, so for full coverage, take a 1 minute nap
    cy.wait(60000)
    // Then wait an additional 5s for a job query to kickoff
    cy.wait(8000)
  })
})