import Image from 'next/image'
import Link from 'next/link'
import { CardContacts } from '@components/site/organisation'
import { Button } from '@nextui-org/button'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { getServerSession } from '@shared/server-actions/auth'

export const metadata = {
   title: 'DLH',
}
const Page = async () => {
   const { isAuthenticated } = await getServerSession()

   return (
      <div className='-mt-navbar size-full'>
         <section
            id='home'
            className='pt-navbar max-w-fulll flex min-h-[90%] flex-col gap-4 sm:flex-row-reverse'>
            <div className='bg-hero mx-auto flex w-full items-center justify-center bg-cover bg-left-top bg-no-repeat sm:w-1/2'>
               <Image
                  alt=''
                  src='/images/logo_kab_lembata.png'
                  className='size-auto'
                  height={100}
                  width={80}
                  priority={false}
                  loading='eager'
               />
            </div>
            <div className='mx-auto flex flex-col justify-center px-4 text-center sm:px-6'>
               <h1
                  className='leading-tighter pb-4 text-2xl font-extrabold tracking-tighter md:text-6xl'
                  data-aos='zoom-y-out'>
                  Website{' '}
                  <span className='bg-gradient-to-r from-green-500 to-teal-400 bg-clip-text text-transparent'>
                     DLH-Lembata
                  </span>
               </h1>
               <h5
                  className='text-foreground-600 mb-8 text-xl'
                  data-aos='zoom-y-out'
                  data-aos-delay='150'>
                  Website ini masih dalam proses pengembangan dan link ini masih sebatas uji coba.
               </h5>
               <h5
                  className='text-foreground-600 mb-8 text-xl'
                  data-aos='zoom-y-out'
                  data-aos-delay='150'>
                  Selamat datang di halaman Dinas Lingkungan Hidup Kabupaten Lembata!
               </h5>
               <div className='mx-auto max-w-[90%] space-y-8'>
                  <p>
                     Dinas Lingkungan Hidup kabupaten Lembata berfokus pada bidang urusan Lingkungan
                     hidup urusan Pemerintahan yang tidak berkaitan dengan pelayanan dasar
                     Permrintahan Kabupaten Lembata. Kami berupaya untuk menciptakan lingkungan yang
                     bersih, sehat, dan berkelanjutan untuk generasi saat ini dan masa depan.
                  </p>

                  {!isAuthenticated ? (
                     <Button
                        size='lg'
                        radius='full'
                        variant='shadow'
                        as={Link}
                        prefetch={false}
                        scroll={false}
                        className='bg-gradient-to-r from-green-600 to-teal-600 text-white '
                        href='/login'>
                        Masuk Sebagai Pegawai
                     </Button>
                  ) : null}
               </div>
            </div>
         </section>
         <section
            id='about'
            className='max-w-fulll pt-navbar mx-auto flex flex-col px-4 text-center sm:px-6'>
            <h1 className='leading-tighter pb-4 text-xl font-extrabold tracking-tighter md:text-2xl'>
               Tentang Dinas Lingkungan Hidup
            </h1>
            <p className='p-4'>
               Dinas Lingkungan Hidup bertujuan untuk melindungi, melestarikan, dan meningkatkan
               kualitas lingkungan hidup di wilayah pemerintahan Kabupaten Lembata. Dengan komitmen
               untuk keberlanjutan dan keseimbangan ekologi, kami mempersembahkan berbagai layanan
               dan program untuk masyarakat kami.
            </p>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
               <Card shadow='lg'>
                  <CardHeader>Bidang I</CardHeader>
                  <CardBody>
                     <p>
                        Kami mengundang Anda untuk menjelajahi keindahan alam yang dimiliki wilayah
                        kami. Dari hutan yang rimbun hingga pantai yang memesona, tersedia berbagai
                        destinasi wisata alam yang menakjubkan untuk dinikmati bersama keluarga dan
                        teman.
                     </p>
                     <Button>Lihat Destinasi Wisata</Button>
                  </CardBody>
               </Card>
               <Card shadow='lg'>
                  <CardHeader>Bidang II</CardHeader>
                  <CardBody>
                     <p>
                        Kami berkomitmen untuk menjaga kelestarian lingkungan hidup kami melalui
                        berbagai program perlindungan. Dari pengelolaan limbah hingga konservasi
                        habitat, kami bekerja sama dengan masyarakat dan mitra untuk menciptakan
                        lingkungan yang lebih bersih, sehat, dan berkelanjutan.
                     </p>
                     <Button>Pelajari Lebih Lanjut</Button>
                  </CardBody>
               </Card>
               <Card shadow='lg'>
                  <CardHeader>Bidang 3</CardHeader>
                  <CardBody>
                     <p>
                        Kami mengundang Anda untuk berpartisipasi dalam upaya perlindungan
                        lingkungan hidup. Dengan bergabung dalam kegiatan sosial, kampanye, atau
                        program sukarela, setiap individu dapat memberikan kontribusi positif bagi
                        lingkungan dan keberlanjutan masa depan.
                     </p>
                     <Button>Ikut Berpartisipasi</Button>
                  </CardBody>
               </Card>
            </div>
         </section>
         <section
            id='contacts'
            className='max-w-fulll sm:mih-h-full pt-navbar mx-auto flex flex-col px-4 text-center sm:px-6'>
            <div>
               <CardContacts />
            </div>
         </section>
      </div>
   )
}

export default Page
