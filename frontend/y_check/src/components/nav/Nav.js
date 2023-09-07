import React from 'react'
import ug_logo from '../../images/UoG_CoA_2017.svg.png' ;
import person from '../../images/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg'
import './nav.scss'
import Icon from '@mdi/react';
import { mdiMagnify,mdiBellOutline} from '@mdi/js';

function Nav() {
    return (
        <div className="navbar">
          {/* Logo */}
          <div className="logo">
            <img src={ug_logo} alt="Logo" />
            <span>Y-CHECK-GHANA</span>
          </div>
    
          {/* Search Bar */}
          <div className="search-bar">
            <Icon path={mdiMagnify} size={1} className="search-icon" />
            <input type="text" placeholder="Search users..." className="search-input" />
          </div>
    
          {/* Person Picture with Dropdown */}
          <div className="person">
            <Icon className='notification' path={mdiBellOutline} size={1} />
    
            <span>louis seyram</span>
            <img src={person} alt="Logo" />
          </div>
        </div>
      );
    }

export default Nav
