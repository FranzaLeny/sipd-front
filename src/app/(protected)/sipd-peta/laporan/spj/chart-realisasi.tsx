'use client'

import { SpjFungsional } from '@actions/penatausahaan/pengeluaran/spj'
import { StatistikBelanjaSkpdSipd } from '@actions/penatausahaan/pengeluaran/statistik'
import { sortBy } from 'lodash-es'
import Chart, { Props } from 'react-apexcharts'

const ChartRealisasi = ({
   items,
   tahun,
   bulan,
   apbd,
   skpd,
}: {
   items?: SpjFungsional['pembukuan1']
   tahun: number
   bulan: string
   skpd: string
   apbd?: StatistikBelanjaSkpdSipd[]
}) => {
   const data = sortBy(items, 'kode_unik')
   const belanja = data[0]
   const realisasiBl: Props['options'] = {
      series: [
         {
            name: 'SPJ - LS Gaji',
            data: data?.map((d) => d.realisasi_gaji_sd_saat_ini),
         },
         {
            name: 'SPJ - LS Barang & Jasa	',
            data: data?.map((d) => d.realisasi_ls_selain_gaji_sd_saat_ini),
         },
         {
            name: 'SPJ - UP/GU/TU',
            data: data?.map((d) => d.realisasi_up_gu_tu_sd_saat_ini),
         },
         {
            name: 'Sisa',
            data: data?.map((d) => d.sisa_pagu_anggaran),
         },
      ],
      chart: {
         type: 'bar',
         height: 350,
         stacked: true,
         stackType: '100%',
      },
      plotOptions: {
         bar: {
            horizontal: true,
         },
      },
      stroke: {
         width: 0,
      },
      title: {
         text: `Realisasi Anggaran bulan ${bulan} tahun ${tahun}`,
         align: 'center',
      },
      xaxis: {
         categories: data?.map((d) => d.nama_akun),
         labels: {
            show: false,
         },
         axisBorder: {
            show: false,
         },
         axisTicks: {
            show: false,
         },
      },
      yaxis: { show: false },
      tooltip: {
         y: {
            formatter: function (val: number) {
               return val?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
            },
         },
      },
      theme: { palette: 'palette8' },
      fill: {
         opacity: 1,
         // type: 'gradient',
         // gradient: {
         //    shade: 'dark',
         //    type: 'vertical',
         //    shadeIntensity: 0.35,
         //    gradientToColors: undefined,
         //    inverseColors: false,
         //    opacityFrom: 0.85,
         //    opacityTo: 0.85,
         //    stops: [90, 0, 100],
         // },
      },
      legend: {
         position: 'top',
         horizontalAlign: 'left',
         offsetX: 40,
      },
   }

   const realiasi: Props['options'] = {
      series: [belanja?.sisa_pagu_anggaran, belanja?.jumlah_sd_saat_ini],
      chart: {
         width: 200,
         type: 'pie',
      },
      theme: { palette: 'palette7' },
      labels: ['Sisa Pagu', 'Realisasi'],
      legend: { show: false },
      title: {
         text: `Anggaran tahun ${tahun} sd ${bulan}`,
         align: 'center',
      },
      subtitle: {
         text: skpd,
         align: 'center',
      },
      tooltip: {
         y: {
            formatter: function (val: number) {
               return val?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
            },
         },
      },
   }

   return (
      <div className='flex flex-col gap-4'>
         <div className='flex flex-wrap justify-center'>
            <Chart
               options={realiasi}
               type='pie'
               series={realiasi.series}
            />
            {apbd?.map((data) => (
               <ChartApbd
                  key={data?.id_skpd}
                  data={data}
               />
            ))}
         </div>
         <Chart
            options={realisasiBl}
            type='bar'
            height={250}
            series={realisasiBl.series}
         />
      </div>
   )
}
const ChartApbd = ({ data }: { data: StatistikBelanjaSkpdSipd }) => {
   const date = new Date()

   const realiasi: Props['options'] = {
      series: [data?.realisasi_rencana - data?.realisasi_rill, data?.realisasi_rill],
      chart: {
         width: 200,
         type: 'pie',
      },
      theme: { palette: 'palette7' },
      labels: ['Non SKPJ', 'SPJ'],
      legend: { show: false },
      title: {
         text: `SPJ ${data?.tahun} sd ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(date)}`,
         align: 'center',
      },
      subtitle: {
         text: data?.nama_skpd,
         align: 'center',
      },
      tooltip: {
         y: {
            formatter: function (val: number) {
               return val?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
            },
         },
      },
   }

   return (
      <div className='flex flex-col gap-4'>
         <Chart
            options={realiasi}
            type='pie'
            series={realiasi.series}
         />
      </div>
   )
}

export default ChartRealisasi
