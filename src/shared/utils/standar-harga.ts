export const kelompokToTipe = (val?: number) => {
   switch (val) {
      case 1:
         return 'SSH'
      case 2:
         return 'HSPK'
      case 3:
         return 'ASB'
      case 4:
         return 'SBU'
      default:
         return 'SSH'
   }
}
export const tipeToKelompok = (val?: string) => {
   switch (val?.toUpperCase()) {
      case 'SSH':
         return 1
      case 'HSPK':
         return 2
      case 'ASB':
         return 3
      case 'SBU':
         return 4
      default:
         return 1
   }
}
