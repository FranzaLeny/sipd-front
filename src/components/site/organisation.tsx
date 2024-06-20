import { Card, CardBody } from '@nextui-org/card'
import { Input, Textarea } from '@nextui-org/input'
import { User } from '@nextui-org/user'

const items = [
   {
      nama: 'Nama Kepala Dinas Lingkungan Hidup',
      jabatan: 'Kepala Dinas Lingkungan Hidup',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      contact: 'No Contact',
   },
   {
      nama: 'Nama Sekretaris Dinas Lingkungan Hidup',
      jabatan: 'Sekretaris Dinas Lingkungan Hidup',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      contact: 'No Contact',
   },
   {
      nama: 'Nama Kepala Bidang I',
      jabatan: 'Kepala Bidang Penataan Perlindungan dan Pengelolahan Lingkungan Hidup',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      contact: 'No Contact',
   },
   {
      nama: 'Nama Kepala Bidang II',
      jabatan:
         'Kepala Bidang Pengelolahan Limbah B3, Sampah dan Peningkatan Kapasitas Lingkungan Hidup',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      contact: 'No Contact',
   },
   {
      nama: 'Nama Kepala Bidang Pengendalian ',
      jabatan: 'Kabid Pengendalian Pencemaran dan Kerusakan Lingkungan Hidup',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      contact: 'No Contact',
   },
]

export const CardContacts = () => {
   return (
      <Card className='w-full rounded-xl px-3 shadow-md'>
         <CardBody className='flex w-full flex-col-reverse gap-4 space-y-4 py-5 md:grid md:grid-cols-2 md:space-y-0'>
            <form>
               <div className='border-divider flex rounded-xl border-2 border-dashed px-6 py-2'>
                  <span className='text-default-900 text-xl font-semibold'>Kesan / Pesan</span>
               </div>
               <Input
                  labelPlacement='outside'
                  className='pt-4'
                  name='nama'
                  label='Nama'
                  placeholder='Nama pengirim'
               />
               <Input
                  name='alamat'
                  className='pt-4'
                  labelPlacement='outside'
                  label='Alamat'
                  placeholder='Alamat pengirim'
               />
               <Input
                  className='pt-4'
                  name='email'
                  labelPlacement='outside'
                  label='Email'
                  placeholder='Email pengirim'
               />
               <Input
                  className='pt-4'
                  name='no_hp'
                  labelPlacement='outside'
                  label='Nomor Telp.'
                  placeholder='Nomor kontak pengirim'
               />
               <Textarea
                  className='pt-4'
                  name='message'
                  labelPlacement='outside'
                  placeholder='Masuka pesan/kesan'
                  label='Pesan'
               />
            </form>
            <div className='space-y-4'>
               <div className='border-divider flex rounded-xl border-2 border-dashed px-6 py-2'>
                  <span className='text-default-900 text-xl font-semibold'>Kontak User</span>
               </div>
               <div className='flex max-w-full flex-col  items-start justify-start gap-6 pt-4 '>
                  {items.map((item, i) => (
                     <User
                        key={i}
                        name={item.nama}
                        description={item.jabatan}
                        classNames={{
                           description: 'truncate whitespace-normal max-w-full line-clamp-2',
                           name: 'truncate max-w-full',
                           wrapper: 'max-w-full flex-1 overflow-hidden',
                           base: ' max-w-full overflow-hidden',
                        }}
                        about={item.contact}
                        avatarProps={{
                           src: item?.picture,
                        }}
                     />
                  ))}
               </div>
            </div>
         </CardBody>
      </Card>
   )
}
