import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { BenchmarkComparison } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Props {
  data: BenchmarkComparison;
}

export function BenchmarkSection({ data }: Props) {
  const barChartData = {
    labels: ['行业平均', '头部水平', '您的分数'],
    datasets: [
      {
        label: '综合评分',
        data: [data.industryAverage, data.topPerformers, data.yourScore],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutData = {
    labels: ['超过用户', '未超过用户'],
    datasets: [
      {
        data: [data.percentile, 100 - data.percentile],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(229, 231, 235, 0.8)'],
        borderColor: ['rgb(16, 185, 129)', 'rgb(229, 231, 235)'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">📊</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">行业对比分析</h3>
          <p className="text-sm text-gray-500">与行业基准的对比评估</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-4">评分对比</h4>
          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{data.percentile}%</span>
              <span className="text-xs text-gray-500">超越同行</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">差距分析</h4>
        <div className="space-y-3">
          {data.gapAnalysis.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-24 text-sm text-gray-600">{item.metric}</span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${item.yourScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-green-600 w-12 text-right">
                  {Math.round(item.yourScore)}
                </span>
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{ width: `${item.benchmarkScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-blue-600 w-12 text-right">
                  {Math.round(item.benchmarkScore)}
                </span>
              </div>
              <span className={`text-sm font-medium w-16 text-right ${
                item.gap > 10 ? 'text-red-500' : item.gap > 5 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {item.gap > 0 ? `+${item.gap}` : item.gap}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
