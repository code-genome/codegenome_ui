import React from 'react'
import AppHeader from './AppHeader'
import i18n from './../../i18n';
import { I18nextProvider } from 'react-i18next';

const t = i18n.t;
describe('<AppHeader />', () => {
  it('renders', () => {
    cy.mount(
      <I18nextProvider i18n={i18n}>
        <AppHeader t={t}/>
      </I18nextProvider>
    );
  })
});