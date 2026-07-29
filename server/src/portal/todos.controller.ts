import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { IsIn, IsString, MinLength } from 'class-validator'
import type { Todo } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CurrentUser, type AuthUser } from '../auth/auth.decorators'

class CreateTodoDto {
  @IsString()
  @MinLength(1)
  title!: string
}

class UpdateTodoDto {
  @IsIn(['Pending Approval', 'Completed'])
  status!: 'Pending Approval' | 'Completed'
}

const toDto = (t: Todo) => ({ id: t.id, title: t.title, when: t.when, status: t.status })

@Controller('todos')
export class TodosController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@CurrentUser() user: AuthUser) {
    const todos = await this.prisma.todo.findMany({
      where: { ownerId: user.sub },
      orderBy: { createdAt: 'desc' },
    })
    return todos.map(toDto)
  }

  @Post()
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateTodoDto) {
    const todo = await this.prisma.todo.create({
      data: { title: dto.title, when: 'Just now', status: 'Pending Approval', ownerId: user.sub },
    })
    return toDto(todo)
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ) {
    // Scope to the owner so users can only change their own tasks.
    await this.prisma.todo.updateMany({
      where: { id, ownerId: user.sub },
      data: { status: dto.status },
    })
    const todo = await this.prisma.todo.findUnique({ where: { id } })
    return todo ? toDto(todo) : null
  }
}
