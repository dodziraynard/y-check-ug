import React,{useState} from 'react'
import Icon from '@mdi/react';
import { SidebarData } from '../../Data/Data';
import { mdiLogout,mdiCog,mdiViewHeadline } from '@mdi/js';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/userActions';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import './sidebar.scss'
function Sidebar({ active, onMenuItemClick }) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarVisible(!isSidebarVisible);
    };
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const logoutHandler = () => {
      dispatch(logout())
      navigate('/')
    }
  return (
    <>
      <div className='bars'>
      <Icon className='' path={mdiViewHeadline} size={1} onClick={toggleSidebar} />
      </div>
      <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`} >
        <div className='menu'>
        {SidebarData.map((item, index) => {
      return (
        <div
          className={active === index ? 'menu-item active' : 'menu-item'}
          key={index}
          onClick={() => {
            onMenuItemClick(index); // Notify the parent component of the click
          }}
        >
          <div className='items'>
          <Link to={item.url} style={{ textDecoration: 'none', color: 'black' }}><Icon className='icon' path={item.icon} size={1} /></Link>
          <Link to={item.url} style={{ textDecoration: 'none', color: 'black' }}><span>{item.heading}</span></Link> 
          </div>
       </div>
            )
          })}
        
          <div className='menu-item-down'>
              <div className='down-items'>
                  <Icon className='' path={mdiCog} size={1} />
                  <span>Setting</span>
              </div>
              <div className='down-items'>
                  <Icon  path={mdiLogout} size={1} />
                  <span onClick={logoutHandler}>Logout</span>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
