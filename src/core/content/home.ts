/**
 * Static front-page content. Portable: no icon components here — items carry a
 * string `iconKey` that each platform maps to its own icon set (web = lucide,
 * React Native = its own). Text/labels are shared across web and mobile.
 */

export type IconKey =
  | 'erp'
  | 'hr'
  | 'email'
  | 'documents'
  | 'leave'
  | 'meeting-room'
  | 'employee-lookup'
  | 'meeting-rooms'
  | 'pantry'
  | 'contacts'

export const currentUser = {
  name: 'Anam Amjad',
  role: 'Project Manager',
  initials: 'AA',
}

export type ActionTile = {
  label: string
  desc: string
  iconKey: IconKey
  variant: 'primary' | 'mint'
}

export const quickActions: ActionTile[] = [
  { label: 'ERP System', desc: 'Core business management', iconKey: 'erp', variant: 'primary' },
  { label: 'HR Portal', desc: 'Employee management', iconKey: 'hr', variant: 'primary' },
  { label: 'Email', desc: 'Corporate email', iconKey: 'email', variant: 'mint' },
  { label: 'Documents', desc: 'Document management', iconKey: 'documents', variant: 'primary' },
]

export const mostUsedServices: Omit<ActionTile, 'variant'>[] = [
  { label: 'Leave Request', desc: 'Submit vacation requests', iconKey: 'leave' },
  { label: 'Meeting Room Booking', desc: 'Book conference rooms', iconKey: 'meeting-room' },
]

export const extensions: ActionTile[] = [
  { label: 'Employee Lookup', desc: '', iconKey: 'employee-lookup', variant: 'mint' },
  { label: 'Meeting Rooms', desc: '', iconKey: 'meeting-rooms', variant: 'mint' },
  { label: 'Pantry Requests', desc: '', iconKey: 'pantry', variant: 'primary' },
  { label: 'Quick Contacts', desc: '', iconKey: 'contacts', variant: 'mint' },
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
