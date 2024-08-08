import React from 'react'
import ElapsedTimeLoader from './ElapsedTimeLoader'

describe('<ElapsedTimeLoader />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ElapsedTimeLoader  start_ts={new Date().getTime()} label={'Normal, running'}/>);
    cy.wait(3000); // give the clock time to tick and invoke the callback.
  })
  it('renders as error', () => {
    cy.mount(<ElapsedTimeLoader  start_ts={new Date().getTime()} error_ts={new Date().getTime()} label={'Error demo'}/>);
    cy.wait(3000); // give the clock time to tick and invoke the callback.
  })

  it('renders as completed', () => {
    cy.mount(<ElapsedTimeLoader  start_ts={new Date().getTime()} end_ts={new Date().getTime()} label={'completed demo'}/>);
    cy.wait(3000); // give the clock time to tick and invoke the callback.
  })
})