import React, { useEffect } from 'react';
import { Chart as ChartJs, LinearScale, CategoryScale, BarElement, Legend, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLazyGetAllAdolescentTypesQuery } from '../../features/resources/resources-api-slice';

ChartJs.register(
  LinearScale, CategoryScale, BarElement, Legend, Title
);


const BarChart = () => {

  const [getAdolescentTypes, { data: response = [], isFetching }] = useLazyGetAllAdolescentTypesQuery();

  useEffect(() => {
    getAdolescentTypes(); 
  }, [getAdolescentTypes]);

  const users = response?.total_user || 0;
  const adolescents = response?.total_adolescent || 0;
  const referrals = response?.total_referal || 0;
  const treatments = response?.total_treatment || 0;
  const services = response?.total_service || 0;
  const facilities = response?.total_facility || 0;


  const Options = {
    plugins: {
      title: {
        display: true,
        text: 'Analytics', // Place the legend on the left
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
      'Total Users',
      'Total Adolescents',
      'Total Referrals',
      'Total Treatments',
      'Total Services',
      'Total Facilities'
    ],
    datasets: [
      {
        label: 'Y-Check-Ghana',
        data: [users, adolescents, referrals, treatments, services, facilities],
        backgroundColor: [
          'rgb(54,162,235)',
          'rgb(65,136,255)',
          'rgb(177,26,177)',
          'rgb(228, 154, 79)',
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)'
        ],
      },
    ]
  };
  
  return (
    <div className='section' >
      <Bar options={Options} data={data} />
    </div>
  )
}

export default BarChart;
