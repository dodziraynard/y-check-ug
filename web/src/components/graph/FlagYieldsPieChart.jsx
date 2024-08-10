import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import { useLazyGetFlagColourDistributionQuery } from '../../features/resources/resources-api-slice';
import { useSelector } from 'react-redux';

ChartJs.register(
  Tooltip, Title, ArcElement, Legend
)

function FlagYieldsPieChart() {
  const startDate = useSelector((state) => state.global.dashboardDataStartDate);
  const endDate = useSelector((state) => state.global.dashboardDataEndDate);
  const [getFlagColourDistribution, { data: response = [], isFetching }] = useLazyGetFlagColourDistributionQuery();

  const [chartLabels, setChartLabels] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    getFlagColourDistribution({
      start_date: startDate,
      end_date: endDate
    }
    )
  }, [getFlagColourDistribution, startDate, endDate])

  useEffect(() => {
    if (response?.flag_distribution) {
      const labels = []
      const data = []
      for (const item in response.flag_distribution) {
        labels.push(item.toString());
        data.push(response.flag_distribution[item]);
      }
      setChartLabels(labels);
      setChartData(data);
    }
  }, [response, isFetching])

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Number of adolescents for each condition per colour.',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'RED',
        data: chartData.map((item) => item["RED"]),
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'GREEN',
        data: chartData.map((item) => item["GREEN"]),
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'ORANGE',
        data: chartData.map((item) => item["ORANGE"]),
        backgroundColor: 'rgb(228, 154, 79)',
      },
    ],
  };

  return (
    <div className="section" style={{ maxHeight: "500px" }}>
      <div className="d-flex justify-content-between">
        <h4>Yields</h4>
        <button className="btn btn-sm btn-outline-primary d-flex align-items-center">
          <i className='bi bi-file-spreadsheet me-2'></i>
          Export
        </button>
      </div>
      <div className="chart-container" style={{ maxHeight: "500px" }}>
        <Bar options={options} data={data} />
      </div>
    </div>

  );
}

export default FlagYieldsPieChart;
