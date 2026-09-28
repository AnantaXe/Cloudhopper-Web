import { useQuery } from '@tanstack/react-query';
import { migrationApi } from '../api/migration-api';

export const migrationKeys = {
  overview: ['migration', 'overview'] as const,
  assets: ['migration', 'assets'] as const,
  graph: ['migration', 'dependency-graph'] as const,
  waves: ['migration', 'waves'] as const,
};

export function useOverview() {
  return useQuery({ queryKey: migrationKeys.overview, queryFn: () => migrationApi.getOverview() });
}

export function useAssets() {
  return useQuery({ queryKey: migrationKeys.assets, queryFn: () => migrationApi.listAssets() });
}

export function useDependencyGraph() {
  return useQuery({ queryKey: migrationKeys.graph, queryFn: () => migrationApi.getDependencyGraph() });
}

export function useMigrationWaves() {
  return useQuery({ queryKey: migrationKeys.waves, queryFn: () => migrationApi.listMigrationWaves() });
}

export function useMigrationWorkItems() {
  return useQuery({ queryKey: ['migration', 'work-items'], queryFn: () => migrationApi.listMigrationWorkItems() });
}

export function useRiskAssessments() {
  return useQuery({ queryKey: ['migration', 'risk-assessments'], queryFn: () => migrationApi.listRiskAssessments() });
}

export function useArchitectureOptions() {
  return useQuery({ queryKey: ['migration', 'architecture-options'], queryFn: () => migrationApi.listArchitectureOptions() });
}

export function useIaCFiles() {
  return useQuery({ queryKey: ['migration', 'iac-files'], queryFn: () => migrationApi.listIaCFiles() });
}

export function useValidationChecks() {
  return useQuery({ queryKey: ['migration', 'validation-checks'], queryFn: () => migrationApi.listValidationChecks() });
}

export function useApprovalRequests() {
  return useQuery({ queryKey: ['migration', 'approval-requests'], queryFn: () => migrationApi.listApprovalRequests() });
}

export function useExecutionTasks() {
  return useQuery({ queryKey: ['migration', 'execution-tasks'], queryFn: () => migrationApi.listExecutionTasks() });
}

export function useAgentRuns() {
  return useQuery({ queryKey: ['migration', 'agent-runs'], queryFn: () => migrationApi.listAgentRuns() });
}

export function useAuditEvents() {
  return useQuery({ queryKey: ['migration', 'audit-events'], queryFn: () => migrationApi.listAuditEvents() });
}

export function useFeedbackEntries() {
  return useQuery({ queryKey: ['migration', 'feedback'], queryFn: () => migrationApi.listFeedbackEntries() });
}

export function useReports() {
  return useQuery({ queryKey: ['migration', 'reports'], queryFn: () => migrationApi.listReports() });
}
