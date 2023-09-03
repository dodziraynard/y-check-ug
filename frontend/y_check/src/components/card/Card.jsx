import React from 'react'
import './card.scss'
import Icon from '@mdi/react';
import { mdiAccountInjuryOutline,mdiDoctor,mdiAccountSupervisor,mdiCalendarAlertOutline } from '@mdi/js';
function Card() {
  return (
    <section>
        <div className='card'>
            <div className="logo">
            <Icon path={mdiAccountInjuryOutline} size={3} />
            </div>
            <div className="content">
                <h2>250</h2>
                <h5>Total Patients</h5>
            </div>
        </div>
        <div className='card'>
            <div className="logo">
            <Icon path={mdiCalendarAlertOutline} size={3} />
            </div>
            <div className="content">
                <h2>90</h2>
                <h5>Appointment</h5>
            </div>
        </div>
        <div className='card move'>
            <div className="logo">
            <Icon path={mdiDoctor} size={3} />
            </div>
            <div className="content">
                <h2>167</h2>
                <h5>Total Users</h5>
            </div>
        </div>
        <div className='card move'>
            <div className="logo">
            <Icon path={mdiAccountSupervisor} size={3} />
            </div>
            <div className="content">
                <h2>13</h2>
                <h5>Groups</h5>
            </div>
            
        </div>
    </section>
  )
}

export default Card
