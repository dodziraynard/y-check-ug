import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
import { useLazyGetAllAdolescentTypesQuery } from '../../features/resources/resources-api-slice';
import React, { useEffect } from 'react';

ChartJs.register(
  Tooltip, Title, ArcElement, Legend
)

function PieChart() {
  const [getAdolescentTypes, { data: response = [], isFetching }] = useLazyGetAllAdolescentTypesQuery();

  useEffect(() => {
    getAdolescentTypes();
  }, [getAdolescentTypes]);

  const basicCount = response?.basic || 0;
  const secondaryCount = response?.secondary || 0;
  const communityCount = response?.community || 0;

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
    <div className="section" style={{ maxHeight: "400px" }}>
      <div className="d-flex justify-content-between">
        <h4>Yields</h4>
        <button className="btn btn-sm btn-outline-primary d-flex align-items-center">
          <i className='bi bi-file-spreadsheet me-2'></i>
          Export
        </button>
      </div>
      <div className="chart-container" style={{ maxHeight: "400px" }}>
        <Doughnut data={data} options={chartOptions} />
      </div>
    </div>

  );
}

export default PieChart;
