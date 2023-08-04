import React from 'react'
import Card from '../../components/card/Card'
import Chart from '../../components/chart/Chart'
import './dashboard.scss'
function Dashboard() {
  return (
    <section>
      <div className='grid'>
        <div className="row_one">
          <Card/>
          <Chart/>
        </div>
        <div className="row_two"></div>
        
      </div>
    </section>
  )
}

export default Dashboard
