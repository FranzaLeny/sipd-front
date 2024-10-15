import Image, { type ImageProps } from 'next/legacy/image'

const LogoDaerah: React.FC<Omit<Omit<ImageProps, 'alt'>, 'src'>> = (props) => {
   return (
      <Image
         src='/images/logo_kab_lembata.png'
         alt='Logo Daerah'
         {...props}
         priority={false}
         loading='eager'
      />
   )
}
export default LogoDaerah
