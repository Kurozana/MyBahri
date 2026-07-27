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

export interface PortalEvent {
  title: string
  /** ISO date (yyyy-mm-dd) used for calendar marking/highlighting */
  dateISO: string
  date: string
  time: string
  location: string
  attending: number
}

export const events: PortalEvent[] = [
  {
    title: 'Annual Town Hall',
    dateISO: '2026-06-15',
    date: 'June 15, 2026',
    time: '9:00 AM - 5:00 PM',
    location: 'Bahri HQ Auditorium',
    attending: 145,
  },
  {
    title: 'Summer Family Day',
    dateISO: '2026-06-22',
    date: 'June 22, 2026',
    time: '2:00 PM - 6:00 PM',
    location: 'Outdoor Recreation Center',
    attending: 89,
  },
  {
    title: 'Safety Awareness Day',
    dateISO: '2026-08-10',
    date: 'August 10, 2026',
    time: '10:00 AM - 1:00 PM',
    location: 'Bahri HQ Auditorium',
    attending: 60,
  },
]

export const newsItems = [
  {
    title: 'Bahri reports record Q1 fleet efficiency',
    date: 'Sep 16, 2025',
    summary:
      'Operational efficiency up 23% year-on-year with outstanding safety records across all fleets.',
  },
  {
    title: 'New crew welfare program launched',
    date: 'Sep 2, 2025',
    summary: 'Expanded health, family and learning benefits now available to all seafaring staff.',
  },
  {
    title: 'Bahri signs new logistics partnership',
    date: 'Aug 20, 2025',
    summary: 'A strategic agreement expanding our reach across key regional trade routes.',
  },
]

export interface ReleaseNote {
  version: string
  date: string
  items: string[]
}

/** Newest first. Drives the release-notes header icon + modal. */
export const releaseNotes: ReleaseNote[] = [
  {
    version: '0.2.3',
    date: 'Jul 27, 2026',
    items: [
      'The calendar now opens on the current month and highlights event days.',
      'Switch the calendar between Hijri and Gregorian.',
      'Multimedia now has Events, News, and Photo Library tabs.',
      "Added a What's New button to catch up on updates.",
    ],
  },
  {
    version: '0.2.2',
    date: 'Jul 27, 2026',
    items: [
      'Added an Upcoming Meetings widget for your Outlook calendar.',
      'Added a reporting-line view to see where you sit in the org.',
      'The calendar now opens on the current month and highlights event days.',
    ],
  },
  {
    version: '0.2.1',
    date: 'Jul 23, 2026',
    items: [
      'Updated the app logo to the official Bahri emblem.',
      'Added live weather in the top bar.',
      'Fixed the CEO name shown across the portal.',
    ],
  },
  {
    version: '0.2.0',
    date: 'Jul 22, 2026',
    items: [
      'Added a new sign-in page with single sign-on.',
      'Added Employee Lookup and a full CEO message page.',
      'Congratulating the Employee of the Month now plays a celebration.',
    ],
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
