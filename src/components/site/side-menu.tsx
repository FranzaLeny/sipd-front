'use client'

import { useMemo, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import manifest from '@constants/routes.json'
import { BaseItem } from '@nextui-org/aria-utils'
import { cn, dataFocusVisibleClasses, Spacer, SpacerProps } from '@nextui-org/react'
import { useFocusRing } from '@react-aria/focus'
import { usePress } from '@react-aria/interactions'
import { TreeState, useTreeState } from '@react-stately/tree'
import { CollectionBase, Expandable, ItemProps, MultipleSelection, Node } from '@react-types/shared'
import { dataAttr } from '@utils/assertion'
import { isEmpty, sortBy } from 'lodash-es'
import { ChevronRight } from 'lucide-react'
import { useSession } from '@shared/hooks/use-session'

interface Props<T> extends Omit<ItemProps<T>, 'title'>, Route {
   slug?: string
   tag?: string
}
export type BaseItemProps<T extends object> = Props<T>

let Item = BaseItem as <T extends object>(props: Props<T>) => JSX.Element

const spacesByLevel: Record<number, SpacerProps['x']> = {
   0: 0,
   1: 3,
   2: 6,
   3: 9,
   4: 12,
   5: 14,
}

/**
 * @internal
 */
interface TreeItemProps<T> {
   item: Node<T>
   keys: Array<React.Key>
   state: TreeState<T>
   level?: number
   spaceLeft?: SpacerProps['x']
}

const TreeItem = <T extends object>(props: TreeItemProps<T>) => {
   const { item, state, level = 0, spaceLeft = 0, keys } = props
   const { key, rendered, childNodes } = item
   const hasChildNodes = !isEmpty([...childNodes])
   const path = item.props.path
   const isNew = item.props?.newPost
   const isComingSoon = item.props?.comingSoon
   const isExpanded = state.expandedKeys.has(key)
   const isSelected = state.selectionManager.isSelected(key)
   const isDisabled = state.selectionManager.isDisabled(key)
   const ref = useRef<any>(null)
   const Component = hasChildNodes ? 'ul' : 'li'
   const { pressProps } = usePress({
      onPress: () => {
         if (hasChildNodes) {
            // state.toggleKey(key)
            if (!isExpanded) {
               state.setExpandedKeys(new Set(keys as any[]))
               // state.toggleKey(key) //Hanya untuk lihat tinggi sidebar
            } else {
               state.toggleKey(key)
            }
         }
      },
   })
   const { focusProps, isFocused, isFocusVisible } = useFocusRing()
   if (isDisabled) {
      return null
   }
   return (
      <Component
         {...focusProps}
         ref={ref}
         aria-expanded={dataAttr(hasChildNodes ? isExpanded : undefined)}
         aria-selected={dataAttr(isSelected)}
         aria-disabled={dataAttr(isComingSoon)}
         data-focus-visible={isFocusVisible}
         data-focused={isFocused}
         className={cn('tap-highlight-transparent flex flex-col', ...dataFocusVisibleClasses)}
         role='treeitem'>
         <div
            aria-disabled={dataAttr(isComingSoon)}
            className='aria-disabled:opacity-disabled  flex w-full cursor-pointer items-center gap-3 aria-disabled:pointer-events-none'
            {...pressProps}>
            {!!level && <Spacer x={spaceLeft} />}
            {hasChildNodes ? (
               <span className='nav-title'>
                  {rendered}
                  <ChevronRight
                     aria-expanded={dataAttr(isExpanded)}
                     className={`w-5 transition-transform ${isExpanded && 'rotate-90'}`}
                     strokeWidth={1.25}
                  />
               </span>
            ) : (
               <Link
                  scroll={false}
                  role='tab'
                  prefetch={false}
                  aria-selected={dataAttr(isSelected)}
                  aria-disabled={dataAttr(isComingSoon)}
                  className='border-l-divider hover:border-x-foreground aria-selected:border-l-primary rounded-r-small from-primary/20 via-primary/5 w-full border-l px-2 py-1 hover:border-x aria-disabled:pointer-events-none aria-selected:bg-gradient-to-l'
                  href={path ?? ''}>
                  {rendered}
                  <span
                     className={`${isNew ? 'bg-success' : isComingSoon ? 'bg-danger' : 'hidden'} -mt-3 ml-1 size-1.5 animate-pulse rounded-full`}
                  />
               </Link>
            )}
         </div>
         {isExpanded && hasChildNodes && (
            <div role='group'>
               {[...childNodes].map((item) => {
                  return (
                     <TreeItem
                        key={item.key}
                        keys={[item.key, ...keys]}
                        item={item}
                        level={level + 1}
                        spaceLeft={spacesByLevel[level] ?? 0}
                        state={state}
                        {...item.props}
                     />
                  )
               })}
            </div>
         )}
      </Component>
   )
}

const TreeHeading = ({ item }: { item: any }) => {
   return <div>{item.rendered}</div>
}

const Tree = <T extends object>(props: CollectionBase<T> & Expandable & MultipleSelection) => {
   let state = useTreeState(props)
   return (
      <>
         {[...state.collection].map((item) => {
            if (item.type === 'section') {
               return (
                  <TreeHeading
                     key={item.key}
                     item={item}
                  />
               )
            }
            return (
               <TreeItem
                  key={item.key}
                  keys={[item.key]}
                  item={item}
                  state={state}
               />
            )
         })}
      </>
   )
}

export interface Route {
   key: string
   title?: string
   subtitle?: string
   section?: string
   heading?: boolean
   keywords?: string
   iconSrc?: string
   defaultOpen?: boolean
   path?: string
   routes?: Route[]
   updated?: boolean
   newPost?: boolean
   comingSoon?: boolean
   access: string[]
}
export interface SidebarProps {
   className?: string
}

const chekActiveKeys = (routes: Route[], pathname: string): string[] => {
   return routes.reduce((prev: string[], item) => {
      if (!!item.path && pathname.startsWith(item.path)) {
         prev.push(item.key)
      }
      if (item.routes) {
         const c = chekActiveKeys(item.routes, pathname)
         prev = [...c, ...prev]
      }
      return prev
   }, [])
}
const getKeys = (
   routes: Route[],
   roles: (RoleUser | 'auth')[],
   path: { pathname: string; activeKeys?: never } | { activeKeys: string[] }
): { disabledKeys: string[]; expandedKeys: string[]; activeKeys: string[] } => {
   const activeKeys = path?.activeKeys ?? chekActiveKeys(routes, path.pathname)
   const initialResult: { disabledKeys: string[]; expandedKeys: string[]; activeKeys: string[] } = {
      disabledKeys: [],
      expandedKeys: [],
      activeKeys,
   }

   if (!routes.length) {
      return initialResult
   }

   return routes.reduce((result, route) => {
      const hasAccess = route?.access?.some((accessRole: any) => roles?.includes(accessRole))
      const isDisabled = (!hasAccess && !roles?.includes('super_admin')) || route?.comingSoon

      if (isDisabled) {
         result.disabledKeys.push(route.key)
      }

      if (route?.routes?.length) {
         activeKeys?.forEach((activeKey) => {
            if (activeKey?.startsWith(route.key)) {
               result?.expandedKeys?.push(route.key)
            }
         })
         const childKeys = getKeys(route.routes, roles, { activeKeys })
         result.expandedKeys = [...result.expandedKeys, ...childKeys.expandedKeys]
         result.disabledKeys = [...result.disabledKeys, ...childKeys.disabledKeys]
      }

      return result
   }, initialResult)
}

export const SideMenu: React.FC<SidebarProps> = () => {
   const { data, status } = useSession()
   const pathname = usePathname()
   const routes: Route[] = sortBy(manifest.routes, [(obj) => (obj?.comingSoon ? 1 : 0)])
   const roles = useMemo(() => {
      let access: (RoleUser | 'auth')[] = []
      if (data?.user) {
         access.push('auth')
         if (data.user.roles?.length) {
            access = [...access, ...data.user.roles]
         }
      }
      return access
   }, [data?.user])

   const keys = useMemo(() => getKeys(routes, roles, { pathname }), [routes, roles, pathname])

   if (status === 'loading') {
      return (
         <div className='rounded-small size-full space-y-4 px-2'>
            <div className='bg-divider rounded-large h-4 w-2/4 animate-pulse' />
            <div className='bg-divider rounded-large h-4 w-10/12 animate-pulse' />
            <div className='bg-divider rounded-large h-4 w-2/5 animate-pulse' />
            <div className='bg-divider rounded-large h-4 w-4/5 animate-pulse' />
            <div className='bg-divider rounded-large h-4 w-3/5 animate-pulse' />
            <div className='bg-divider rounded-large h-4 w-4/6 animate-pulse' />
         </div>
      )
   }

   return (
      <Tree
         defaultExpandedKeys={keys.expandedKeys}
         disabledKeys={keys.disabledKeys}
         selectedKeys={[...keys.activeKeys]}
         selectionMode='single'
         items={routes || []}>
         {(route) => (
            <Item
               childItems={sortBy(route.routes, [(obj) => (obj?.comingSoon ? 1 : 0)])}
               {...route}
               key={route.key}>
               {route.title}
            </Item>
         )}
      </Tree>
   )
}
export default SideMenu
