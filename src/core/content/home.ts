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

export const ceoMessage = {
  author: 'Ahmed Alsubaey',
  role: 'Chief Executive Officer',
  date: '16 Sep, 2025',
  excerpt:
    'I am proud to share that our Q1 performance has exceeded expectations, with a 23% increase in operational efficiency and outstanding safety records across all our fleet operations. This achievement is a testament to your dedication and commitment to excellence.',
  full: [
    'Dear colleagues,',
    'I am proud to share that our Q1 performance has exceeded expectations, with a 23% increase in operational efficiency and outstanding safety records across all our fleet operations. This achievement is a testament to your dedication and commitment to excellence.',
    'Across every business unit, our teams have shown what it means to operate with discipline, care, and ambition. Our on-time performance reached record levels, our safety indicators improved for the fourth consecutive quarter, and our customers continue to place their trust in Bahri to move what matters most.',
    'As we look ahead, our focus remains clear: invest in our people, modernize our fleet, and strengthen the digital backbone that connects us — this very portal being one step in that journey. The months to come will bring new challenges, but I have no doubt that, together, we will meet them.',
    'Thank you for everything you do. Your commitment is the reason Bahri continues to lead.',
    'With appreciation,',
  ],
}

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
