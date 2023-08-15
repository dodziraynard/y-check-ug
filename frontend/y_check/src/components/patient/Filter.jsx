import React from 'react'
import Icon from '@mdi/react';
import './filter.scss'
import { mdiFilter } from '@mdi/js';
const Filter = () => {
  return (
        <div className='patient'>
            <div className="filter">
                <div className="fit-icons">
                <Icon className='filter-icon' path={mdiFilter} size={1} />
                <span>FILTER</span>
                </div>
                <div className="filter-items">
                    <div className="filter-item">
                        <span>All Patients</span>
                    </div>
                    <div className="filter-item">
                        <span>Primary</span>
                    </div>
                    <div className="filter-item">
                        <span>Secondary</span>
                    </div>
                    <div className="filter-item">
                        <span>Community</span>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Filter
