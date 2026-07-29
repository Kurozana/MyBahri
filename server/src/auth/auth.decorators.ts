import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'
import type { Permission } from './permissions'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const PERMISSIONS_KEY = 'permissions'
export const RequirePermissions = (...perms: Permission[]) => SetMetadata(PERMISSIONS_KEY, perms)

export type AuthUser = { sub: string; role: string; email: string }

/** Injects the authenticated user (JWT payload) into a handler param. */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  const req = ctx.switchToHttp().getRequest()
  return req.user as AuthUser
})
