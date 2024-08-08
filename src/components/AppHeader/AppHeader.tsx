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

import React from 'react';
import { UserAvatar } from '@carbon/react/icons';
import {
    Header,
    HeaderContainer,
    HeaderName,
    HeaderMenuButton,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
    SideNav,
    SideNavItems,
    SideNavLink,
    OverflowMenu,
    OverflowMenuItem,
} from '@carbon/react';
import { SearchLocate, RecentlyViewed, Compare } from '@carbon/icons-react';
import styles from './AppHeader.module.scss';


/**
 * 
 * @param props - The component properties
 * @returns The application header with side navigation items.
 */
const AppHeader = (props) => {
    function getBoldWord(phrase) {
        const elements = phrase.split(' ')
        return (<><span><b>{elements[0]}</b>&nbsp;</span><span className="cds--header__name--prefix">{elements[1]}</span></>);
    }

    return (
        <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
                <Header className={styles.myHeader} aria-label={props.t('appHeader.appName')}>
                    <SkipToContent />
                    <HeaderMenuButton
                        aria-label="Open menu"
                        onClick={onClickSideNavExpand}
                        isActive={isSideNavExpanded}
                        style={{display: 'flex'}}
                    />
                    <HeaderName href="#" prefix="">
                        {getBoldWord(props.t('appHeader.appName'))}
                    </HeaderName>
                    <HeaderGlobalBar>
                        <HeaderGlobalAction aria-label="User Avatar" tooltipAlignment="right">
                            <OverflowMenu flipped={true} renderIcon={UserAvatar}>
                                <OverflowMenuItem itemText={'Sign out'} onClick={() => { props.signOut(); }} />
                            </OverflowMenu>
                        </HeaderGlobalAction>
                    </HeaderGlobalBar>
                    <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} onOverlayClick={onClickSideNavExpand} isRail>
                        <SideNavItems>
                            <SideNavLink
                                renderIcon={React.forwardRef((props, ref) => (
                                    <RecentlyViewed ref={ref} size={32} {...props} />
                                  ))}
                                href="/history">
                                History
                            </SideNavLink>
                            <SideNavLink
                                renderIcon=
                                    {React.forwardRef((props, ref) => (
                                        <SearchLocate ref={ref} size={32} {...props} />
                                      ))
                                }
                                href="/search">
                                Search
                            </SideNavLink>
                            <SideNavLink
                                renderIcon={React.forwardRef((props, ref) => (
                                    <Compare ref={ref} size={32} {...props} />
                                  ))
                                }
                                href="/compare">
                                {props.t('appHeader.compareLabel')}
                            </SideNavLink>
                        </SideNavItems>
                    </SideNav>
                </Header>
            )}
        />
    );
}

export default AppHeader;