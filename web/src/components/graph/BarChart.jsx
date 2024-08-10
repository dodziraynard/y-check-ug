import React, { useEffect, useState } from 'react';
import { Chart as ChartJs, LinearScale, CategoryScale, BarElement, Legend, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLazyGetAllAdolescentTypesQuery } from '../../features/resources/resources-api-slice';
import { useSelector } from 'react-redux';

ChartJs.register(
  LinearScale, CategoryScale, BarElement, Legend, Title
);


const BarChart = () => {
  const startDate = useSelector((state) => state.global.dashboardDataStartDate);
  const endDate = useSelector((state) => state.global.dashboardDataEndDate);
  const [getAdolescentTypes, { data: response = [], isFetching }] = useLazyGetAllAdolescentTypesQuery();

  const [users, setUsers] = useState(0)
  const [adolescents, setAdolescents] = useState(0)
  const [referrals, setReferrals] = useState(0)
  const [treatments, setTreatments] = useState(0)
  const [services, setServices] = useState(0)
  const [facilities, setFacilities] = useState(0)

  useEffect(() => {
    getAdolescentTypes({
      start_date: startDate,
      end_date: endDate,
    });
  }, [getAdolescentTypes, startDate, endDate]);

  useEffect(() => {
    setUsers(response?.total_user || 0)
    setAdolescents(response?.total_adolescent || 0)
    setReferrals(response?.total_referal || 0)
    setTreatments(response?.total_treatment || 0)
    setServices(response?.total_service || 0)
    setFacilities(response?.total_facility || 0)
  }, [response])

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
      'Users',
      'Adolescents',
      'Referrals',
      'Treatments',
      'Services',
      'Facilities'
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
