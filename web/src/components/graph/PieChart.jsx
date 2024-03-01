import {Chart as ChartJs,Tooltip,Title,ArcElement,Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
ChartJs.register(
    Tooltip,Title,ArcElement,Legend
)
import { useLazyGetAllAdolescentTypesQuery } from '../../features/resources/resources-api-slice';
import React, { useEffect } from 'react';

function PieChart() {
  const [getAdolescentTypes, { data: response = [], isFetching }] = useLazyGetAllAdolescentTypesQuery();

  useEffect(() => {
    getAdolescentTypes(); 
  }, [getAdolescentTypes]);

  console.log(response)
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
        <div className="section">
            <div className="chart-container">
                <Doughnut data={data}  options={chartOptions}/>
            </div>
        </div>

    );
}

export default PieChart;
