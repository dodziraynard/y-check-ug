
import React from 'react'
import Card from '../../components/card/Card'
import Chart from '../../components/chart/Chart'
import './dashboard.scss'
import BasicTable from '../../components/table/Table'

function Main() {
  return (
    <section>
      <div className='grid'>
        <div className="row_one">
          <Card/>
          <Chart/>
        </div>
        <div className="row_two">
          <BasicTable/>
        </div>
        
      </div>
    </section>
  )
}

export default Main