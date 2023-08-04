import React from 'react'
import './chart.scss'
import {Chart as ChartJs,Tooltip,Title,ArcElement,Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
ChartJs.register(
    Tooltip,Title,ArcElement,Legend
)

const chartOptions = {
    plugins: {
      legend: {
        position: 'right', // Place the legend on the left
      },
    },
  };

const data = {
    labels: [
      'Primary',
      'secondary',
      'community'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 100, 50],
      backgroundColor: [
        'rgb(54,162,235)',
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };
function Chart() {
  return (
    <section className='section'>
    <div className='chart-container'>
      <div className='chart'>
        <Doughnut data={data}  options={chartOptions}/>
      </div>
    </div>
  </section>
  )
}

export default Chart
