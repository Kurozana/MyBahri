import {
  Home,
  Briefcase,
  BookOpen,
  MapPin,
  Image,
  ListTodo,
  MessageSquare,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
  /** Dynamic import used for both the route chunk and hover-prefetch. */
  load: () => Promise<unknown>
}

/**
 * Single source of truth for the sidebar, the router, and prefetching.
 * Each `load` is a code-split chunk — only the visited page ships to the browser.
 */
export const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: Home, load: () => import('@/pages/HomePage') },
  {
    label: 'Workspace',
    path: '/workspace',
    icon: Briefcase,
    load: () => import('@/pages/StubPage'),
  },
  {
    label: 'Knowledge',
    path: '/knowledge',
    icon: BookOpen,
    load: () => import('@/pages/StubPage'),
  },
  {
    label: 'Locations',
    path: '/locations',
    icon: MapPin,
    load: () => import('@/pages/StubPage'),
  },
  { label: 'Media', path: '/media', icon: Image, load: () => import('@/pages/StubPage') },
  { label: 'Tasks', path: '/tasks', icon: ListTodo, load: () => import('@/pages/StubPage') },
  {
    label: 'Messages',
    path: '/messages',
    icon: MessageSquare,
    load: () => import('@/pages/StubPage'),
  },
]
