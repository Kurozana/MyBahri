import { Body, Controller, Get, Post } from '@nestjs/common'
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator'
import type { ReleaseNote } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { RequirePermissions } from '../auth/auth.decorators'

class CreateReleaseNoteDto {
  @IsString()
  version!: string

  @IsString()
  date!: string

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  items!: string[]
}

const toDto = (n: ReleaseNote) => ({
  version: n.version,
  date: n.date,
  items: JSON.parse(n.items) as string[],
})

@Controller('release-notes')
export class ReleaseNotesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list() {
    const notes = await this.prisma.releaseNote.findMany({ orderBy: { createdAt: 'desc' } })
    return notes.map(toDto)
  }

  @Post()
  @RequirePermissions('content.manage')
  async create(@Body() dto: CreateReleaseNoteDto) {
    const note = await this.prisma.releaseNote.create({
      data: { version: dto.version, date: dto.date, items: JSON.stringify(dto.items) },
    })
    return toDto(note)
  }
}
