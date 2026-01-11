
"use client";

import Chart from 'react-apexcharts';
import { DynamicBarChart } from '../components/dashboard/DynamicBarChart';

const salesData = [
  { name: 'Zack', revenue: 1200, grossMargin: 400 },
  { name: 'John', revenue: 900, grossMargin: 300 },
  { name: 'Mike', revenue: 1400, grossMargin: 600 },
  { name: 'Alex', revenue: 700, grossMargin: 200 },
  { name: 'Ryan', revenue: 1100, grossMargin: 350 },
];

const operationsData = [
  { name: 'Zack', loadCount: 42 },
  { name: 'John', loadCount: 35 },
  { name: 'Mike', loadCount: 55 },
  { name: 'Alex', loadCount: 28 },
  { name: 'Ryan', loadCount: 48 },
];
const oficesData = [
  { name: 'Zack', revenue: 1200, grossMargin: 400 },
  { name: 'John', revenue: 900, grossMargin: 300 },
];


// const RevenueChart = () => {
//   const options: ApexCharts.ApexOptions = {
//     chart: {
//       type: 'bar',
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: '80%',
//         borderRadius: 0,
//       },
//     },
//     colors: ['#14b8a6', '#d1d5db'], // teal & gray
//     dataLabels: {
//       enabled: false,
//     },
//     grid: {
//       strokeDashArray: 1,
      
//     },
//     xaxis: {
//       categories: salesData.map(x => x.name),
//     },
//     yaxis: {
//       tickAmount: 5,
//     },
//     legend: {
//       position: 'top',
//     },
//   };

//   const series = [
//     {
//       name: 'Revenue',
//       data: salesData.map(x => x.revenue),
//     },
//     {
//       name: 'Gross Margin',
//       data: salesData.map(x => x.grossMargin),
//     },
//   ];

//   return (
//     <div className="bg-white p-4 rounded-lg">
//       <h2 className="text-xl text-center font-semibold mb-2">
//         Sales Leaderboard
//       </h2>

//       <Chart
//         options={options}
//         series={series}
//         type="bar"
//         height={260}
//       />
//     </div>
//   );
// };

// const OperationsChart = () => {
//   const options: ApexCharts.ApexOptions = {
//     chart: {
//       type: 'bar',
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: '60%',
//         borderRadius: 0,
//       },
//     },
//     colors: ['#14b8a6'],
//     dataLabels: {
//       enabled: false,
//     },
//     grid: {
//       strokeDashArray: 1,
//     },
//     states: {
//       hover: {
//         filter: {
//           type: 'darken',
//         },
//       },
//     },
//     xaxis: {
//       categories: operationsData.map(x => x.name),
//       axisBorder: {
//         show: true,
//         color: '#e5e7eb',
//       },
//       crosshairs: {
//         show: false, // ✅ removes gray vertical highlight
//       },
//     },
//     yaxis: {
//       min: 0,
//       tickAmount: 5,
//       axisBorder: {
//         show: true,
//         color: '#e5e7eb',
//       },
//     },
//     legend: {
//       position: 'top',
//       showForSingleSeries: true,
//     },
//   };

//   const series = [
//     {
//       name: 'Load Count',
//       data: operationsData.map(x => x.loadCount),
//     },
//   ];

//   return (
//     <div className="bg-white p-4 rounded-lg">
//       <h2 className="text-xl text-center font-semibold mb-2">
//         Operations Leaderboard
//       </h2>

//       <Chart
//         options={options}
//         series={series}
//         type="bar"
//         height={260}
//       />
//     </div>
//   );
// };

export default function DashboardPage() {
  
  return (
    
      <div className=" mt-10 bg-white p-6  rounded-xl">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-3 gap-3">
          {/* <RevenueChart />
          <OperationsChart />
          <RevenueChart />  */}
          <DynamicBarChart
            title="Sales Leaderboard"
            data={salesData}
            nameKey="name"
            bars={[
              { key: "revenue", label: "Revenue", color: "#0891b2" },
              { key: "grossMargin", label: "Gross Margin ($)", color: "#d1d5db" },
            ]}
          />

          <DynamicBarChart
            title="Operations Leaderboard"
            data={operationsData}
            nameKey="name"
            bars={[
              { key: "loadCount", label: "Load ct.", color: "#0891b2" },
            ]}
          />

          <DynamicBarChart
            title="Office  Leaderboard"
            data={oficesData}
            nameKey="name"
            bars={[
              { key: "revenue", label: "Revenue", color: "#0891b2" },
              { key: "grossMargin", label: "Gross Margin ($)", color: "#d1d5db" },
            ]}
          />
        </div>

      </div>
  
  );
}
