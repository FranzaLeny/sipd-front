export const generatePangkatKepala = (namaSkpd = '') => {
   return namaSkpd
      ?.replace('DINAS', 'KEPALA DINAS')
      ?.replace('BADAN', 'KEPALA BADAN')
      ?.replace('KECAMATAN', 'CAMAT')
      ?.replace('KELURAHAN', 'LURAH')
      ?.replace('SEKRETARIAT', 'SEKRETARIS')
      ?.replace('INSPEKTORAT', 'INSPEKTUR')
      ?.replace('KANTOR', 'KEPALA KANTOR')
}
