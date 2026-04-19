import { handlers } from '@/lib/auth';

// NextAuth v5 использует Route Handlers в App Router
// GET и POST обрабатывают все запросы к /api/auth/* (логин, логаут, сессия, OAuth callback)
export const { GET, POST } = handlers;
