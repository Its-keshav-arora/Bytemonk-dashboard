export {}
export type Roles = 'admin' | 'mcp'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}