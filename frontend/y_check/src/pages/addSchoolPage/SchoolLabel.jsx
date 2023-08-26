import React from 'react'
import { Link } from 'react-router-dom'
const SchoolLabel = () => {
    return (
        <div className='patient'>
            <div className="filter">
                <div className="filter-items">
                    <div className="filter-item">
                      <Link><span>Basic School</span></Link>  
                    </div>
                    <div className="filter-item">
                       <Link><span>Snr High School</span></Link> 
                    </div>
                    <div className="filter-item">
                    <Link><span>Community</span></Link> 
                    </div>
                </div>
            </div>
        </div>
  )
}


export default SchoolLabel
