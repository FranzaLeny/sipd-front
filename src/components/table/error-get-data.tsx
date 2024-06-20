import { Fragment } from 'react'
import { XCircle } from 'lucide-react'

const ErrorGetData: React.FC<{ message?: string }> = ({ message = 'Gagal mengambil data' }) => {
   const lines = message.split(';')
   return (
      <div className='flex w-full flex-col items-center justify-center gap-2 sm:flex-row'>
         <XCircle className='text-danger' />
         <p>
            {lines.map((line, index) => (
               <Fragment key={index}>
                  {line}
                  {index !== lines.length - 1 && <br />}
               </Fragment>
            ))}
         </p>
      </div>
   )
}

export default ErrorGetData
