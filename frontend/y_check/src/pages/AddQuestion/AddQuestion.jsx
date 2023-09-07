import React, { useState } from 'react';
import Nav from '../../components/nav/Nav'
import Sidebar from '../../components/sidebar/Sidebar'
import Index from './Index'

const AddQuestion = () => {
  const [active, setActive] = useState(5);

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

export default AddQuestion
