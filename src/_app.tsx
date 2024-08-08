/**
##
## This code is part of the Code Genome Framework.
##
## (C) Copyright IBM 2023.
##
## This code is licensed under the Apache License, Version 2.0. You may
## obtain a copy of this license in the LICENSE.txt file in the root directory
## of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
##
## Any modifications or derivative works of this code must retain this
## copyright notice, and modified files need to carry a notice indicating
## that they have been altered from the originals.
##
*/
import React from 'react';
import './App.scss';
import { Theme } from '@carbon/react';
import AppHeader from '@/components/AppHeader';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SearchPage from '@/components/SearchPage';
import HistoryPage from '@/components/HistoryPage';
import ComparePage from '@/components/ComparePage/ComparePage';
import { useTranslation } from 'react-i18next';

export default function App (props)  {
  const { t } =  useTranslation();

  const uat = props?.user?.signInUserSession?.accessToken?.jwtToken
    return (
      <BrowserRouter>
        <div className="App">
          <Theme theme="g100">
            <AppHeader signOut={props.signOut} accessToken={uat} t={t} />
          </Theme>
            <div className="darkTheme1" style={{ position: 'relative', top: '32px', width: 'calc(100%)', height: 'calc(100%)', zIndex: 0 }}>
              <Routes>
                <Route path="/history" element={<Theme theme="g100"><HistoryPage session={props.session} accessToken={uat} /></Theme>}>
                </Route>
                <Route path="/" element={<Theme theme="g100"><HistoryPage session={props.session} accessToken={uat} /></Theme>} />
                <Route path="/search/:sha256" element={<Theme theme="g100"><SearchPage session={props.session}  accessToken={uat}  /></Theme>} />
                <Route path="/search" element={<Theme theme="g100"><SearchPage session={props.session}  accessToken={uat}  /></Theme>} />
                <Route path="/compare/:sha256_p1/:sha256_p2" element={<Theme theme="g100"><ComparePage session={props.session}  accessToken={uat}  /></Theme>} />
                <Route path="/compare" element={<Theme theme="g100"><ComparePage session={props.session}  accessToken={uat} /></Theme>} />
              </Routes>
            </div>
        </div>
      </BrowserRouter>
    );
  }

