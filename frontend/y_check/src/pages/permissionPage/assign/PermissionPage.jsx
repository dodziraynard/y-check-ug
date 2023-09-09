import React, { useState } from 'react';
import Index from './Index'
import Sidebar from '../../../components/sidebar/Sidebar';
import Nav from '../../../components/nav/Nav';
const PermissionPage = () => {
  const [active, setActive] = useState(3);

  const handleMenuItemClick = (index) => {
    setActive(index);
  }
  return (
    <div>
        <Nav />
        <div className='main'>
            <Sidebar active={active} onMenuItemClick={handleMenuItemClick}/>
            <Index />
        </div>
  </div>
  )
}

export default PermissionPage
