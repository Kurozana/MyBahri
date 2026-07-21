import {
  Boxes,
  Users2,
  Mail,
  FileText,
  Search,
  Building2,
  Coffee,
  PhoneCall,
  FileSignature,
  CalendarClock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const currentUser = {
  name: 'Anam Amjad',
  role: 'Project Manager',
  initials: 'AA',
}

export type QuickAction = {
  label: string
  desc: string
  icon: LucideIcon
  variant: 'primary' | 'mint'
}

export const quickActions: QuickAction[] = [
  { label: 'ERP System', desc: 'Core business management', icon: Boxes, variant: 'primary' },
  { label: 'HR Portal', desc: 'Employee management', icon: Users2, variant: 'primary' },
  { label: 'Email', desc: 'Corporate email', icon: Mail, variant: 'mint' },
  { label: 'Documents', desc: 'Document management', icon: FileText, variant: 'primary' },
]

export const mostUsedServices = [
  { label: 'Leave Request', desc: 'Submit vacation requests', icon: FileSignature },
  { label: 'Meeting Room Booking', desc: 'Book conference rooms', icon: CalendarClock },
]

export type Extension = {
  label: string
  icon: LucideIcon
  variant: 'primary' | 'mint'
}

export const extensions: Extension[] = [
  { label: 'Employee Lookup', icon: Search, variant: 'mint' },
  { label: 'Meeting Rooms', icon: Building2, variant: 'mint' },
  { label: 'Pantry Requests', icon: Coffee, variant: 'primary' },
  { label: 'Quick Contacts', icon: PhoneCall, variant: 'mint' },
]

export const events = [
  {
    date: 'June 15, 2026',
    time: '9:00 AM - 5:00 PM',
    location: 'Bahri HQ Auditorium',
    attending: 145,
  },
  {
    date: 'June 22, 2026',
    time: '2:00 PM - 6:00 PM',
    location: 'Outdoor Recreation Center',
    attending: 89,
  },
]

export const employeeOfMonth = {
  name: 'Mohammed Al-Rashid',
  title: 'Fleet Optimization Specialist',
  initials: 'MR',
  impactScore: 94.6,
  month: 'May 2026 Recognition',
}

export const birthdayPeople = [
  { name: 'Sarah Al-Mansour', department: 'Human Resources' },
  { name: 'Omar Nasser', department: 'Product Development' },
  { name: 'Layla Hassan', department: 'Engineering' },
  { name: 'Khalid Al-Otaibi', department: 'Operations' },
]

export const birthdayWishes = [
  'Happy Birthday! 🎉',
  'Cheers to your special day!',
  'Wishing joy & success! 🎊',
  'Have a good one!',
  'Happy Birthday! Make it amazing! 🎂',
]

