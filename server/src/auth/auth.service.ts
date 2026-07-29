import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import type { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password')
    }
    const token = await this.jwt.signAsync({ sub: user.id, role: user.role, email: user.email })
    return { token, user: this.toDto(user) }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new UnauthorizedException()
    return this.toDto(user)
  }

  private toDto(u: User) {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      initials: u.initials,
      role: u.role,
      title: u.title,
      department: u.department,
    }
  }
}
