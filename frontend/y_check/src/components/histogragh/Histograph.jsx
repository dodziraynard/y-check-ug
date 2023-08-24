import React from 'react'
import './histograph.scss'
import {Chart as ChartJs,LinearScale,CategoryScale,BarElement,Legend,Title} from 'chart.js'
import { Bar } from 'react-chartjs-2';
ChartJs.register(
    LinearScale,CategoryScale,BarElement,Legend,Title
)

const labels = ['Jan','Feb','Mar','April','May','Jun']
const Options = {
    plugins: {
        legend:{
            position:'top'
        },
      title: {
        display:true,
        text: 'Adolescent Analytics', // Place the legend on the left
      },
    },
  };

const data = {
    labels,
    datasets:[
        {
            label: 'Primary',
            data: [300, 100, 50,200,150,400],
            backgroundColor: 'rgb(54,162,235)'
        },
        {
            label: 'Secondary',
            data: [200, 300, 100,50,250,350],
            backgroundColor: 'rgb(255, 99, 132)'
        },
        {
            label: 'Community',
            data: [100, 200, 150,250,50,300],
            backgroundColor: 'rgb(255, 205, 86)'
        }
    ]
  };
const Histogragh = () => {
  return (
    <div className='histograph'>
      <Bar options={Options} data={data} />
    </div>
  )
}

export default Histogragh
