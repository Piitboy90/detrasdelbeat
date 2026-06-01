// Delegating entirely to SupabaseAuthContext to ensure only one auth context is active
export { SupabaseAuthProvider as AuthProvider, useAuth } from './SupabaseAuthContext';