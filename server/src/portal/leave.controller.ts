import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CurrentUser, type AuthUser } from '../auth/auth.decorators'

@Controller('leave-balance')
export class LeaveController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async get(@CurrentUser() user: AuthUser) {
    const u = await this.prisma.user.findUnique({ where: { id: user.sub } })
    return { balance: u?.leaveBalance ?? 0, unit: 'days', asOf: new Date().toISOString() }
  }
}
