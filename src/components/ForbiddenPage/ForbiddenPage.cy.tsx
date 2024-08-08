import React from 'react'
import ForbiddenPage from './ForbiddenPage'

describe('<ForbiddenPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ForbiddenPage />)
  })
})