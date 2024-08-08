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
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Theme, Grid, Row, Column, Search, ToastNotification,
  Table, TableRow, TableBody, TableCell
} from '@carbon/react';
import { PageHeader } from '@carbon/ibm-products';
import { clearSearchError, setSearchLoading, setSearchStartTS, setSearchString } from '../../store/actions/search.actions';
import SearchForSha256 from '@/common/SearchForSha256';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SearchPage.module.scss';
import { useTranslation } from 'react-i18next';
import { ElapsedTimeLoader } from "@/components/ElapsedTimeLoader/ElapsedTimeLoader";

export interface SearchPageProps {
  accessToken?: string;
}


/**
 * 
 * @param props 
 * @returns A JSX Element
 */
export default function SearchPage(props) {

  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);  
  const { t } = useTranslation();
  const { sha256 } = useParams();
  const searchData = useSelector((state: any) => state.search.data);
  const searchError = useSelector((state: any) => state.search.searchError.message);
  const searchFailed = useSelector((state: any) => state.search.searchFailed);
  const loading = useSelector((state: any) => state.search.loading);
  const start_ts = useSelector((state: any) => state.search.start_ts);
  const end_ts = useSelector((state: any) => state.search.end_ts);
  const error_ts = useSelector((state: any) => state.search.error_ts);
  const history = useSelector((state: any) => state.history.history);
  const navigate = useNavigate();

  let filteredRows: any[] = [];

  function onSearchChanged(e, rescan: boolean = false, isNewSubmission = false) {
    const sha256: string = e.target.value;
    if (sha256 !== '' && sha256 !== undefined && sha256.length === 64) {
      navigate(('/search/' + sha256));
      let keepGoing = true;
      let ins = isNewSubmission;
      filteredRows = (history.filter((row) => (row.fileid === sha256)))
      if (filteredRows.length > 0) {
        const row = filteredRows[0];
        // if the row exists in the history, consider it a new submission and use polling on 206.
        ins = true;
      }
      if (keepGoing) {
        dispatch(setSearchLoading(true))
        dispatch(clearSearchError());
        dispatch(setSearchString(sha256));
        const now = new Date().getTime();
        dispatch(setSearchStartTS(now));
        SearchForSha256(props, sha256, dispatch, new Date().getTime(), rescan, ins);
      }
    }
  }


  async function clearErrorState() {
    dispatch(clearSearchError());
  }



  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      if (sha256 && sha256 !== '') {
        const elem: any = document.getElementById('app-tsx-search');
        if (elem) {
          elem.value = sha256;
        }
        const e = {
          target: {
            value: sha256
          }
        }
        onSearchChanged(e, false);
      }
    }
  }, [sha256]);

  return (
    <>
      <PageHeader className={styles.searchPage} title={{ text: t('appHeader.searchLabel') }} />
      <Grid fullWidth style={{ paddingLeft: '40px', paddingRight: '0px' }}>
        <Row style={{ display: 'contents' }}>
          <Column span={16} style={{ marginLeft: '0px', marginRight: '0px' }}>
            <Theme theme="g100">
              <Search
                closeButtonLabelText="Clear search input"
                // defaultValue="A default value"
                placeholder="Enter a file hash to begin your search..."
                id="app-tsx-search"
                labelText="Search"
                onChange={onSearchChanged}
                onKeyDown={function noRefCheck() { }}
                size="lg"
                style={{ marginLeft: '0px' }}
              />
            </Theme>
          </Column>
        </Row>
        <Row style={{ display: 'contents' }}>
          <Column span={4}>
            {searchFailed ? (
              <ToastNotification
                aria-label="closes notification"
                caption={new Date().toLocaleTimeString()}
                onClose={clearErrorState}
                onCloseButtonClick={function noRefCheck() { }}
                statusIconDescription="notification"
                subtitle={searchError}
                title={t('SearchPage.searchError')}
              />) : ('')
            }
          </Column>
        </Row>
      </Grid>
      <Grid fullWidth style={{ paddingLeft: '40px', paddingRight: '0px', paddingTop: '16px' }}>
        <Row style={{ display: 'contents' }}>
          <Column span={14}>
          <Table style={{ minWidth: '1400px', width: 'calc(100%)' }}>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {t('SearchPage.filenameLabel')}
                  </TableCell>
                  <TableCell>
                    {mounted && !loading ?  searchData?.["metadata.name"]  ||'': ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    {t('SearchPage.sha256')}
                  </TableCell>
                  <TableCell>
                    {mounted && !loading ? searchData?.sha256 || ''  : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    {t('SearchPage.filetypeLabel')}
                  </TableCell>
                  <TableCell>
                    {mounted && !loading ? searchData?.type || '' : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    {t('SearchPage.filesizeLabel')}
                  </TableCell>
                  <TableCell>
                    {mounted && !loading ? searchData?.["metadata.filesize"]||'': ''}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Column>
          <Column span={2}>
              <div className={styles.searchET}>
              <ElapsedTimeLoader label={'Elapsed Time'} start_ts={start_ts} end_ts={end_ts} error_ts={error_ts} />
              </div>
          </Column>
        </Row>
      </Grid>
    </>
  )
}