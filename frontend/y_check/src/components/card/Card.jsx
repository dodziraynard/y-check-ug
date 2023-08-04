import React from 'react'
import './card.scss'
import Icon from '@mdi/react';
import { mdiAccountInjuryOutline } from '@mdi/js';
function Card() {
  return (
    <section>
        <div className='analytic'>
            <div className="content">
                <h2>147</h2>
                <h5>patients</h5>
            </div>
            <div className="logo">
            <Icon path={mdiAccountInjuryOutline} size={1} />
            </div>
        </div>
        <div className='analytic'>
            <div className="content">
                <h2>147</h2>
                <h5>patients</h5>
            </div>
            <div className="logo">
            <Icon path={mdiAccountInjuryOutline} size={1} />
            </div>
        </div>
        <div className='analytic'>
            <div className="content">
                <h2>147</h2>
                <h5>patients</h5>
            </div>
            <div className="logo">
            <Icon path={mdiAccountInjuryOutline} size={1} />
            </div>
        </div>
        <div className='analytic'>
            <div className="content">
                <h2>147</h2>
                <h5>patients</h5>
            </div>
            <div className="logo">
            <Icon path={mdiAccountInjuryOutline} size={1} />
            </div>
        </div>
    </section>
  )
}

export default Card
