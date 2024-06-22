'use client'

import Chart, { Props } from 'react-apexcharts'

export const RealisasiChart = () => {
   return (
      <Chart
         options={options}
         series={state}
         // width={400}
         type='line'
         height={400}
      />
   )
}

export default RealisasiChart

const rencana = {
   start: 0,
   januari: 233532572,
   februari: 260965508,
   maret: 320974525,
   april: 220251504,
   mei: 376425158,
   juni: 581838420,
   juli: 277220205,
   agustus: 306614696,
   september: 293501631,
   oktober: 504938464,
   november: 183541560,
   desember: 178647567,
}

const data_total = Object.values(rencana).reduce((acc, curr) => acc + curr, 0)
const cakarData = (data: { [x: string]: number }) => {
   const arrayAngka = Object.values(data)
   const arrayAkumulasi = arrayAngka.reduce((acc: number[], curr, index) => {
      if (index === 0) {
         const val = curr
         const persent = (val / data_total) * 100
         acc.push(Math.round(persent))
      } else {
         const val = acc[index - 1] + curr

         const persent = (curr / data_total) * 100
         acc.push(acc[index - 1] + Math.round(persent))
      }
      return acc
   }, [])
   return arrayAkumulasi
}
const realisasi = {
   start: 0,
   januari: 246234476,
   februari: 0,
   maret: 0,
   april: 0,
   mei: 0,
   juni: 0,
   juli: 0,
   agustus: 0,
   september: 0,
   oktober: 0,
   november: 0,
   desember: 0,
}

const state: Props['series'] = [
   {
      name: 'Rencana',
      data: cakarData(rencana),
   },
   {
      name: 'Realisasi',
      data: cakarData(realisasi),
   },
]

const options: Props['options'] = {
   chart: {
      type: 'line',
      animations: {
         easing: 'linear',
         speed: 300,
      },
      sparkline: {
         enabled: false,
      },
      brush: {
         enabled: false,
      },
      id: 'basic-bar',
      foreColor: 'hsl(var(--ui-default-800))',

      stacked: false,
      toolbar: {
         show: false,
      },
   },
   xaxis: {
      categories: [
         '',
         'Jan',
         'Feb',
         'Mar',
         'Apr',
         'Mei',
         'Jun',
         'Jul',
         'Ags',
         'Spt',
         'Okt',
         'Nov',
         'Des',
      ],
      labels: {
         // show: false,
         style: {
            colors: 'hsl(var(--ui-default-800))',
         },
      },
      axisBorder: {
         color: 'hsl(var(--ui-nextui-default-200))',
      },
      axisTicks: {
         color: 'hsl(var(--ui-nextui-default-200))',
      },
   },
   yaxis: {
      labels: {
         style: {
            // hsl(var(--ui-content1-foreground))
            colors: 'hsl(var(--ui-foreground))',
            // colors: 'hsl(var(--ui-default-800))',
         },
      },
      title: {
         text: 'Persetase',
      },
   },
   tooltip: {
      enabled: false,
   },
   grid: {
      show: true,
      borderColor: 'hsl(var(--ui-default-200))',
      strokeDashArray: 0,
      position: 'back',
      xaxis: { lines: { show: true } },
   },
   stroke: {
      curve: 'smooth',
      fill: {
         colors: ['red'],
      },
   },
   // @ts-ignore
   markers: false,
}
