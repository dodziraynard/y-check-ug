import React, {useEffect}from 'react'
import './chart.scss'
import {Chart as ChartJs,Tooltip,Title,ArcElement,Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
import { useSelector,useDispatch } from 'react-redux'
import { get_total_adolescent_type } from '../../actions/AddAdolescentAction';
ChartJs.register(
    Tooltip,Title,ArcElement,Legend
)
function Chart() {
  const dispatch = useDispatch()
  const get_all_adolescent_type = useSelector(state => state.get_all_adolescent_type);
  const { adolescent_type } = get_all_adolescent_type;

  useEffect(() => {
    dispatch(get_total_adolescent_type());
  }, [dispatch]);

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
      data: [adolescent_type?.primary, adolescent_type?.secondary, adolescent_type?.community],
      backgroundColor: [
        'rgb(54,162,235)',
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };
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
