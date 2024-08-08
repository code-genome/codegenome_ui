import React from 'react'
import PercentBoxesV2 from './PercentBoxesV2'

describe('<PercentBoxesV2 />', () => {
  it('renders at 30% with orange fill', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PercentBoxesV2 fillColor={'#B75304'} percentage={30} boxCount={0} />);
  })
  it('renders an indeterminent fill', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PercentBoxesV2 fillColor={'#B75304'} percentage={30} boxCount={0} type={'indeterminate'}/>);
    cy.wait(2000);
  })
  it('renders at 20% with blue fill', () => {
    // see: https://on.cypress.io/mounting-react    
    cy.mount(
      <div style={{ backgroundColor: '#252525' }}>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline' }}>
          50% fill
          <PercentBoxesV2 percentage={50} boxCount={5} fillColor={'#ffffff'} width={'50%'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline' }}>
          Critical
          <PercentBoxesV2 percentage={100} boxCount={3} fillColor={'#FF0000'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline' }}>
          High
          <PercentBoxesV2 percentage={89} boxCount={3} fillColor={'#FF4308'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline' }}>
          Medium
          <PercentBoxesV2 percentage={50} boxCount={3} fillColor={'#EE5A04'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline' }}>
          Low
          <PercentBoxesV2 percentage={50} boxCount={3} fillColor={'#F9DF21'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline' }}>
          Indeterminate
          <PercentBoxesV2 type="indeterminate" fillColor={'#0f62fe'} boxCount={10} percentage={10} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
          Deletions
          <PercentBoxesV2 percentage={65} boxCount={5} fillColor={'#e800004d'} width={'200'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
          Mismatch
          <PercentBoxesV2 percentage={50} boxCount={5} fillColor={'#af7201e3'} width={'200'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
          Additions
          <PercentBoxesV2 percentage={45} boxCount={5} fillColor={'#0fe80055'} width={'200'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
          Similar
          <PercentBoxesV2 percentage={35} boxCount={5} fillColor={'#0031857a'} width={'200'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
          Identical
          <PercentBoxesV2 percentage={25} boxCount={5} fillColor={'#2626267a'} width={'200'} />
        </div>
        <div style={{ color: 'white', width: '100px', height: '15px', display: 'inline', maxWidth: '100px' }}>
          Identical
          <PercentBoxesV2 percentage={25} boxCount={5} fillColor={'#2626267a'} width={'100%'} />
        </div>

      </div>    );
  })

})