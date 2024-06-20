export function generateUniqueId() {
   const timestamp = new Date().getTime().toString(16) // Mendapatkan timestamp dan mengonversinya menjadi string heksadesimal
   const randomValue = Math.floor(Math.random() * 10000).toString(16) // Menghasilkan nilai acak dan mengonversinya menjadi string heksadesimal
   const paddingLength = Math.max(0, 8 - timestamp.length) // Menghitung panjang padding yang diperlukan
   const padding = paddingLength > 0 ? '0'.repeat(paddingLength) : '' // Menyiapkan padding jika diperlukan
   const objectId = timestamp + padding + randomValue // Menggabungkan timestamp, padding, dan nilai acak

   return objectId
}
