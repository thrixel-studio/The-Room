/**
 * React Query keys - Legacy support
 * TODO: Remove when fully migrated to RTK Query
 */

export const queryKeys = {
  entries: {
    all: ['entries'] as const,
    lists: () => [...queryKeys.entries.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.entries.lists(), filters] as const,
    details: () => [...queryKeys.entries.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.entries.details(), id] as const,
    drafts: ['entries', 'list', { status: 'DRAFT' }] as const,
    final: ['entries', 'list', { status: 'FINAL' }] as const,
    today: (date: string) => [...queryKeys.entries.all, 'today', date] as const,
    count: (status?: string) => [...queryKeys.entries.all, 'count', status] as const,
    calendar: (month?: string, year?: string) => 
      [...queryKeys.entries.all, 'calendar', month, year] as const,
  },
  insights: {
    all: ['insights'] as const,
    dashboard: () => [...queryKeys.insights.all, 'dashboard'] as const,
    calendar: (month?: string, year?: string) => 
      [...queryKeys.insights.all, 'calendar', month, year] as const,
  },
  writing: {
    all: ['writing'] as const,
    sessions: () => [...queryKeys.writing.all, 'sessions'] as const,
    session: (id: string) => [...queryKeys.writing.sessions(), id] as const,
  },
};
