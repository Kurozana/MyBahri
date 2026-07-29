import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard, PermissionsGuard } from './auth.guards'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        // `expiresIn` types want a template-literal string; a config string is fine at runtime.
        signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '12h') as `${number}h` },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Global: every route requires a valid JWT unless marked @Public(),
    // then permission checks run for routes with @RequirePermissions().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
