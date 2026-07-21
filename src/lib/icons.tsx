import {
  Boxes,
  Users2,
  Mail,
  FileText,
  FileSignature,
  CalendarClock,
  Search,
  Building2,
  Coffee,
  PhoneCall,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { IconKey } from '@core/content/home'

/**
 * Web-side mapping of portable content `iconKey`s to lucide icons. React Native
 * will keep its own equivalent map — the shared content data stays icon-free.
 */
export const iconMap: Record<IconKey, LucideIcon> = {
  erp: Boxes,
  hr: Users2,
  email: Mail,
  documents: FileText,
  leave: FileSignature,
  'meeting-room': CalendarClock,
  'employee-lookup': Search,
  'meeting-rooms': Building2,
  pantry: Coffee,
  contacts: PhoneCall,
}
