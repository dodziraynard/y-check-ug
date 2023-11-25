import React from 'react';
import { Chart as ChartJs, LinearScale, CategoryScale, BarElement, Legend, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJs.register(
  LinearScale, CategoryScale, BarElement, Legend, Title
);

const Options = {
  plugins: {
    title: {
      display: true,
      text: 'Adolescent Analytics', // Place the legend on the left
    },
  },
  maintainAspectRatio: false, // Set to false to allow height adjustments
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const data = {
  labels: [
    'Primary',
    'Secondary',
    'Community',
    'Others',
    'Others',
    'Others'
  ],
  datasets: [
    {
      label: 'Y-Check-Ghana',
      data: [300, 100, 50, 200, 150, 400],
      backgroundColor: [
        'rgb(54,162,235)',
        'rgb(65,136,255)',
        'rgb(100,158,255)',
        'rgb(120,170,255)',
        'rgb(146,187,255)',
        'rgb(172,203,255)'
      ],
    },
  ]
};

const BarChart = () => {
  return (
    <div className='section' >
      <Bar options={Options} data={data} />
    </div>
  )
}

export default BarChart;
