import React,{useState} from 'react'
import Icon from '@mdi/react';
import { SidebarData } from '../../Data/Data';
import { mdiLogout,mdiCog,mdiViewHeadline } from '@mdi/js';
import { Link } from 'react-router-dom';

import './sidebar.scss'
function Sidebar() {
    const [seleted,setSeleted] = useState(0)
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const toggleSidebar = () => {
      setIsSidebarVisible(!isSidebarVisible);
    };
  
  return (
    <>
      <div className='bars'>
      <Icon className='' path={mdiViewHeadline} size={1} onClick={toggleSidebar} />
      </div>
      <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`} >
        <div className='menu'>
          {SidebarData.map((item,index)=>{
              return (
                  <div className={seleted===index?'menu-item active':'menu-item'}
                  key={index}
                  onClick={()=>setSeleted(index)}>
                      <div className='items'>
                      <Icon className='icon' path={item.icon} size={1} />
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
                  <span>Logout</span>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
