import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller()
export class DirectoryController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('org-members')
  async orgMembers() {
    const emps = await this.prisma.employee.findMany()
    return emps.map((e) => ({
      id: e.id,
      name: e.name,
      title: e.title,
      initials: e.initials,
      team: e.team,
    }))
  }

  @Get('employees')
  async employees() {
    const emps = await this.prisma.employee.findMany()
    return emps.map((e) => ({
      id: e.id,
      name: e.name,
      initials: e.initials,
      title: e.title,
      department: e.department,
      floor: e.floor,
      extension: e.extension,
      email: e.email,
      managerId: e.managerId ?? undefined,
    }))
  }
}
