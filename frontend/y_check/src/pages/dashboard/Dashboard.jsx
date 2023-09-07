import React, {useState} from 'react'
import Nav from "../../components/nav/Nav"
import Sidebar from "../../components/sidebar/Sidebar"
import Main from "./Main"
function Dashboard() {
  const [active, setActive] = useState(0);

  const handleMenuItemClick = (index) => {
    setActive(index);
  }
  return (
    <div>
      <Nav />
      <div className='main'>
          <Sidebar active={active} onMenuItemClick={handleMenuItemClick} />
          <Main />
      </div>
    </div>
  )
}

export default Dashboard
