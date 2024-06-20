import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
   width: 32,
   height: 32,
}
export const contentType = 'image/png'

// Image generation
const Icon = () => {
   return new ImageResponse(
      (
         <div
            style={{
               fontSize: 30,
               background: 'black',
               borderRadius: 999,
               width: '100%',
               height: '100%',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               color: 'cyan',
            }}>
            D
         </div>
      ),
      {
         ...size,
      }
   )
}

export default Icon
