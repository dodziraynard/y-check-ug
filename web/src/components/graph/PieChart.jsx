import {Chart as ChartJs,Tooltip,Title,ArcElement,Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
ChartJs.register(
    Tooltip,Title,ArcElement,Legend
)
function PieChart() {

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
          label: 'Y-Check',
          data: [300, 200, 400],
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
