import React, { useState } from 'react';
import Index from './Index'
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
const PatientDetailPage = () => {
  const [active, setActive] = useState(1);
  const handleMenuItemClick = (index) => {
    setActive(index);
  }
  return (
    <div>
        <Nav />
        <div className='main'>
            <Sidebar active={active} onMenuItemClick={handleMenuItemClick} />
            <Index />
        </div>
    </div>
  )
}

export default PatientDetailPage
