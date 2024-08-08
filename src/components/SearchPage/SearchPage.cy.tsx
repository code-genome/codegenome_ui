import React from 'react'
import SearchPage from './SearchPage'
import { Provider as ReduxProvider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initialState } from '@/store/reducers/searchReducer';
import { initialState as historyInitialState} from '@/store/reducers/historyReducer';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const middlewares = [];
const mockStore = configureStore(middlewares);


describe('<SearchPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    const state = {
      search: {
        ...initialState
      },
      history: {
        ...historyInitialState
      }
    };
    const store = mockStore(state);
    cy.mount(
      <ReduxProvider store={store}>
        <BrowserRouter>
          <SearchPage />
        </BrowserRouter>
      </ReduxProvider>
    )
    cy.get('input[id="app-tsx-search"]').type('d81e6ad3a689839ef620ae3e5c932a9d0f5ef9bcd3f88d2e10f029ceb30a4f23');
  })
})