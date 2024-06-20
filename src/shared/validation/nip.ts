export const validateNip = (nip: string) => {
   const regex =
      /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])(19|20)\d{2}(0[1-9]|1[012])\d{1,2}\d{3}$/
   if (regex.test(nip)) {
      return true
   } else {
      return false
   }
}
