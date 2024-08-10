import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
import { useLazyGetAllAdolescentTypesQuery } from '../../features/resources/resources-api-slice';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

ChartJs.register(
  Tooltip, Title, ArcElement, Legend
)

function PieChart() {
  const startDate = useSelector((state) => state.global.dashboardDataStartDate);
  const endDate = useSelector((state) => state.global.dashboardDataEndDate);
  const [getAdolescentTypes, { data: response = [], isFetching }] = useLazyGetAllAdolescentTypesQuery();

  const [basicCount, setBasicCount] = useState(0)
  const [secondaryCount, setSecondaryCount] = useState(0)
  const [communityCount, setCommunityCount] = useState(0)

  useEffect(() => {
    getAdolescentTypes({
      start_date: startDate,
      end_date: endDate,
    });
  }, [getAdolescentTypes, startDate, endDate]);

  useEffect(() => {
    setBasicCount(response?.basic || 0)
    setSecondaryCount(response?.secondary || 0)
    setCommunityCount(response?.community || 0)
  }, [response])

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right', // Place the legend on the left
      },

    },
  };
  const data = {
    labels: [
      'Basic',
      'secondary',
      'community'
    ],
    datasets: [{
      label: 'Y-Check',
      data: [basicCount, secondaryCount, communityCount],
      backgroundColor: [
        'rgb(54,162,235)',
        'rgb(100,158,255)',
        'rgb(146,187,255)'
      ],
      hoverOffset: 4
    }]
  };

  return (
    <div className="section">
      <div className="d-flex justify-content-between">
        <h4>Adolescent Type</h4>
        <button className="btn btn-sm btn-outline-primary d-flex align-items-center">
          <i className='bi bi-file-spreadsheet me-2'></i>
          Export
        </button>
      </div>
      <div className="chart-container">
        <Doughnut data={data} options={chartOptions} />
      </div>
    </div>

  );
}

export default PieChart;
