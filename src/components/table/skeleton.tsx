export const TableSettingToggleLoading: ComponentLoader = () => (
   <div className='h-unit-10 bg-default-500/30 w-10 animate-pulse rounded-full' />
)
export const BottomTableLoading: ComponentLoader = () => (
   <div className='sticky inset-x-0 bottom-0 flex w-full items-center justify-center gap-2  px-3 py-1'>
      <div className='h-unit-10 rounded-medium bg-default-500/30 w-1/3 animate-pulse' />
   </div>
)
export const GlobalSearchLoading: ComponentLoader = () => (
   <div className='h-unit-10 rounded-medium bg-default-500/30 w-full flex-1 animate-pulse sm:max-w-lg' />
)
