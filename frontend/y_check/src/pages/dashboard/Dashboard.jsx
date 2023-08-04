import React from 'react'
import Card from '../../components/card/Card'
import Chart from '../../components/chart/Chart'
import './dashboard.scss'
import CustomizedTables from '../../components/table/Table'
function Dashboard() {
  return (
    <section>
      <div className='grid'>
        <div className="row_one">
          <Card/>
          <Chart/>
        </div>
        <div className="row_two">
          <CustomizedTables/>
        </div>
        
      </div>
    </section>
  )
}

export default Dashboard
