import React, { useEffect } from 'react'
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader } from '@components/ui/sheet'
import { Button, Checkbox, Divider, Radio, RadioGroup } from '@nextui-org/react'
import { Settings } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { COLORS, SELECTIONS, type IFormTable, type TableUiProps } from './table-function'

type TableSettingsProps = {
   isOpen: boolean
   onOpenChange: () => void
   tableProps: TableUiProps
   setTableProps: (params: TableUiProps) => void
}

type TableSettingToggleProps = { onOpen: () => void }

const TableSettings: React.FC<TableSettingsProps> = ({
   isOpen,
   onOpenChange,
   setTableProps,
   tableProps,
}) => {
   const {
      control,
      formState: { isDirty },
   } = useForm<IFormTable>({
      defaultValues: { ...tableProps },
      values: { ...tableProps },
   })
   const data = useWatch({ control })

   useEffect(() => {
      if (data && isDirty) {
         setTableProps(data)
      }
   }, [data, isDirty, setTableProps])

   return (
      <Sheet
         isOpen={isOpen}
         size='xs'
         placement='right'
         onOpenChange={onOpenChange}>
         <SheetContent>
            {(onClose) => (
               <>
                  <SheetHeader className='flex flex-col gap-1'>Pengaturan Tabel</SheetHeader>
                  <SheetBody>
                     <div className='gap-3 space-y-3 py-5'>
                        <Divider />
                        <div className='flex flex-col gap-3'>
                           <Controller
                              name='isStriped'
                              control={control}
                              render={({ field: { name, onChange, value, ref } }) => (
                                 <Checkbox
                                    radius='full'
                                    name={name}
                                    ref={ref}
                                    onValueChange={onChange}
                                    isSelected={value}>
                                    Tabel Zebra
                                 </Checkbox>
                              )}
                           />
                           <Controller
                              name='isCompact'
                              control={control}
                              render={({ field: { name, onChange, value, ref } }) => (
                                 <Checkbox
                                    name={name}
                                    radius='full'
                                    ref={ref}
                                    onValueChange={onChange}
                                    isSelected={value}>
                                    Tabel Minimalis
                                 </Checkbox>
                              )}
                           />
                           <Controller
                              name='isHeaderSticky'
                              control={control}
                              render={({ field: { name, onChange, value, ref } }) => (
                                 <Checkbox
                                    radius='full'
                                    name={name}
                                    ref={ref}
                                    onValueChange={onChange}
                                    isSelected={value}>
                                    Kunci Header
                                 </Checkbox>
                              )}
                           />
                        </div>
                        <Divider />
                        <Controller
                           name='color'
                           control={control}
                           render={({ field: { name, onChange, value, ref } }) => (
                              <RadioGroup
                                 orientation='horizontal'
                                 label='Warna Tabel'
                                 name={name}
                                 ref={ref}
                                 onValueChange={onChange}
                                 value={value}>
                                 {COLORS.map(
                                    (item) =>
                                       !!item && (
                                          <Radio
                                             key={item}
                                             color={item}
                                             value={item}>
                                             {item}
                                          </Radio>
                                       )
                                 )}
                              </RadioGroup>
                           )}
                        />
                        <Divider />
                        <Controller
                           name='selectionMode'
                           control={control}
                           render={({ field: { name, onChange, value, ref } }) => (
                              <RadioGroup
                                 label='Pilihan'
                                 orientation='horizontal'
                                 name={name}
                                 ref={ref}
                                 onValueChange={onChange}
                                 value={value}>
                                 {SELECTIONS.map(
                                    (item) =>
                                       !!item && (
                                          <Radio
                                             key={item}
                                             value={item}>
                                             {item}
                                          </Radio>
                                       )
                                 )}
                              </RadioGroup>
                           )}
                        />
                     </div>
                     <Divider />
                  </SheetBody>
                  <SheetFooter>
                     <Button
                        fullWidth
                        color='danger'
                        variant='shadow'
                        onPress={onClose}>
                        Tutup
                     </Button>
                  </SheetFooter>
               </>
            )}
         </SheetContent>
      </Sheet>
   )
}

export const TableSettingToggle: React.FC<TableSettingToggleProps> = ({ onOpen }) => {
   return (
      <Button
         aria-label='Pengaturan Tabel'
         isIconOnly
         variant='light'
         title='Pengaturan Tabel'
         onPress={onOpen}>
         <Settings />
      </Button>
   )
}
export default TableSettings
