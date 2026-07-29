import { Module } from '@nestjs/common'
import { TodosController } from './todos.controller'
import { DirectoryController } from './directory.controller'
import { LeaveController } from './leave.controller'
import { ReleaseNotesController } from './release-notes.controller'

@Module({
  controllers: [TodosController, DirectoryController, LeaveController, ReleaseNotesController],
})
export class PortalModule {}
