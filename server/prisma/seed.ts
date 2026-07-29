import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Demo password for every seeded account (change for real deployments).
const DEMO_PASSWORD = 'demo1234'

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  // --- Users (auth accounts) ---
  await prisma.todo.deleteMany()
  await prisma.user.deleteMany()
  await prisma.user.createMany({
    data: [
      { email: 'anam@bahri.sa', passwordHash, name: 'Anam Amjad', initials: 'AA', role: 'manager', title: 'Project Manager', department: 'PMO', leaveBalance: 14 },
      { email: 'hr@bahri.sa', passwordHash, name: 'Sarah Al-Mansour', initials: 'SM', role: 'hr', title: 'Chief HR Officer', department: 'Human Resources', leaveBalance: 20 },
      { email: 'exec@bahri.sa', passwordHash, name: 'Ahmed Alsubaey', initials: 'AA', role: 'executive', title: 'Chief Executive Officer', department: 'Executive', leaveBalance: 30 },
      { email: 'employee@bahri.sa', passwordHash, name: 'Omar Nasser', initials: 'ON', role: 'employee', title: 'UX Designer', department: 'Product', leaveBalance: 12 },
      { email: 'admin@bahri.sa', passwordHash, name: 'Rania Khoury', initials: 'RK', role: 'admin', title: 'System Administrator', department: 'IT', leaveBalance: 18 },
    ],
  })

  // --- Employees (directory + org tree) — created parents-first for the FK ---
  await prisma.employee.deleteMany()
  const employees = [
    { id: 'e3', name: 'Ahmed Alsubaey', initials: 'AA', title: 'Chief Executive Officer', department: 'Executive', floor: 'Floor 9', extension: '9000', email: 'a.alsubaey@bahri.sa', team: 'Leadership Team', managerId: null },
    { id: 'e2', name: 'Sarah Al-Mansour', initials: 'SM', title: 'Chief HR Officer', department: 'Human Resources', floor: 'Floor 7', extension: '7001', email: 'sarah.m@bahri.sa', team: 'Leadership Team', managerId: 'e3' },
    { id: 'e7', name: 'Taher Azadbagh', initials: 'TA', title: 'Chief Planning Officer', department: 'Strategy', floor: 'Floor 8', extension: '8110', email: 'taher.a@bahri.sa', team: 'Leadership Team', managerId: 'e3' },
    { id: 'e9', name: 'Mohammed Al-Harbi', initials: 'MH', title: 'Chief Support Officer', department: 'Operations', floor: 'Floor 6', extension: '6015', email: 'm.harbi@bahri.sa', team: 'Leadership Team', managerId: 'e3' },
    { id: 'e1', name: 'Anam Amjad', initials: 'AA', title: 'Project Manager', department: 'PMO', floor: 'Floor 5', extension: '5120', email: 'anam@bahri.sa', team: 'Product Development', managerId: 'e7' },
    { id: 'e6', name: 'Khalid Al-Otaibi', initials: 'KO', title: 'Product Lead', department: 'Product', floor: 'Floor 4', extension: '4200', email: 'khalid.o@bahri.sa', team: 'Product Development', managerId: 'e7' },
    { id: 'e11', name: 'Nadia Farouk', initials: 'NF', title: 'Program Manager', department: 'PMO', floor: 'Floor 5', extension: '5140', email: 'nadia.f@bahri.sa', team: 'Product Development', managerId: 'e7' },
    { id: 'e4', name: 'Omar Nasser', initials: 'ON', title: 'UX Designer', department: 'Product', floor: 'Floor 4', extension: '4218', email: 'omar.n@bahri.sa', team: 'Product Development', managerId: 'e6' },
    { id: 'e5', name: 'Layla Hassan', initials: 'LH', title: 'Senior Engineer', department: 'Engineering', floor: 'Floor 4', extension: '4305', email: 'layla.h@bahri.sa', team: 'Product Development', managerId: 'e6' },
    { id: 'e8', name: 'Fatima Zahra', initials: 'FZ', title: 'QA Lead', department: 'Engineering', floor: 'Floor 4', extension: '4410', email: 'fatima.z@bahri.sa', team: 'Product Development', managerId: 'e6' },
    { id: 'e10', name: 'Rania Khoury', initials: 'RK', title: 'System Administrator', department: 'IT', floor: 'Floor 3', extension: '3077', email: 'rania.k@bahri.sa', team: 'Product Development', managerId: 'e9' },
  ]
  for (const e of employees) await prisma.employee.create({ data: e })

  // --- Todos for Anam ---
  const anam = await prisma.user.findUnique({ where: { email: 'anam@bahri.sa' } })
  if (anam) {
    await prisma.todo.createMany({
      data: [
        { title: 'Leave Request', when: 'Tomorrow, 10:00 AM', status: 'Pending Approval', ownerId: anam.id },
        { title: 'Digital card Request', when: 'Tomorrow, 10:00 AM', status: 'Completed', ownerId: anam.id },
      ],
    })
  }

  // --- Release notes (oldest first so newest sorts to the top by createdAt) ---
  await prisma.releaseNote.deleteMany()
  const notes = [
    { version: '0.2.0', date: 'Jul 22, 2026', items: ['New sign-in page with single sign-on.', 'Employee Lookup and a full CEO message page.', 'Congratulating the Employee of the Month plays a celebration.'] },
    { version: '0.2.3', date: 'Jul 27, 2026', items: ['The calendar opens on the current month and highlights event days.', 'Switch the calendar between Hijri and Gregorian.', 'Multimedia now has Events, News, and Photo Library tabs.'] },
    { version: '0.2.4', date: 'Jul 28, 2026', items: ['The side navigation no longer covers the page when it expands.', 'Fixed pages sometimes showing "couldn\'t load" on first open.'] },
  ]
  for (const n of notes) {
    await prisma.releaseNote.create({ data: { version: n.version, date: n.date, items: JSON.stringify(n.items) } })
  }

  console.log(`Seeded 5 users (password: ${DEMO_PASSWORD}), ${employees.length} employees, todos, ${notes.length} release notes.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
