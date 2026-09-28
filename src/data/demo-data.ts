import type { AgentRun, ApprovalRequest, ArchitectureOption, Asset, AuditEvent, Dependency, ExecutionTask, FeedbackEntry, IaCFile, MigrationReport, MigrationWave, MigrationWorkItem, OverviewSnapshot, RiskAssessment, ValidationCheck } from '../types/domain';

export const demoAssets: Asset[] = [
  { id: 'app-orders', name: 'Orders API', kind: 'Application', provider: 'AWS', environment: 'Production', region: 'us-east-1', status: 'Assessed', risk: 'High', dependencies: 4, owner: 'Commerce', updatedAt: '2026-09-29T08:42:00Z', tags: ['tier-1', 'java'] },
  { id: 'vm-orders-01', name: 'orders-prod-01', kind: 'Virtual machine', provider: 'AWS', environment: 'Production', region: 'us-east-1', status: 'In migration', risk: 'High', dependencies: 3, owner: 'Commerce', updatedAt: '2026-09-29T08:37:00Z', tags: ['tier-1', 'linux'] },
  { id: 'db-orders', name: 'orders-primary', kind: 'Database', provider: 'AWS', environment: 'Production', region: 'us-east-1', status: 'Assessed', risk: 'Critical', dependencies: 2, owner: 'Data platform', updatedAt: '2026-09-29T08:31:00Z', tags: ['tier-0', 'postgres'] },
  { id: 'app-identity', name: 'Identity service', kind: 'Application', provider: 'AWS', environment: 'Production', region: 'us-west-2', status: 'Blocked', risk: 'Critical', dependencies: 3, owner: 'Platform', updatedAt: '2026-09-29T08:15:00Z', tags: ['tier-0', 'java'] },
  { id: 'app-catalog', name: 'Catalog service', kind: 'Application', provider: 'Azure', environment: 'Staging', region: 'eastus', status: 'Discovered', risk: 'Moderate', dependencies: 2, owner: 'Commerce', updatedAt: '2026-09-29T07:54:00Z', tags: ['tier-2', 'node'] },
  { id: 'vm-catalog-01', name: 'catalog-stg-01', kind: 'Virtual machine', provider: 'Azure', environment: 'Staging', region: 'eastus', status: 'Discovered', risk: 'Low', dependencies: 1, owner: 'Commerce', updatedAt: '2026-09-29T07:38:00Z', tags: ['tier-2', 'linux'] },
  { id: 'db-catalog', name: 'catalog-cache', kind: 'Database', provider: 'AWS', environment: 'Production', region: 'us-east-1', status: 'Assessed', risk: 'Moderate', dependencies: 1, owner: 'Data platform', updatedAt: '2026-09-29T07:21:00Z', tags: ['redis', 'tier-2'] },
  { id: 'net-core', name: 'core-vpc-prod', kind: 'Network', provider: 'AWS', environment: 'Production', region: 'us-east-1', status: 'Assessed', risk: 'High', dependencies: 5, owner: 'Platform', updatedAt: '2026-09-29T06:58:00Z', tags: ['network', 'shared'] },
  { id: 'app-billing', name: 'Billing worker', kind: 'Container', provider: 'AWS', environment: 'Production', region: 'us-east-1', status: 'Discovered', risk: 'Moderate', dependencies: 2, owner: 'Finance systems', updatedAt: '2026-09-28T20:12:00Z', tags: ['tier-1', 'worker'] },
  { id: 'storage-receipts', name: 'receipts-archive', kind: 'Storage', provider: 'AWS', environment: 'Production', region: 'us-east-1', status: 'Discovered', risk: 'Low', dependencies: 1, owner: 'Finance systems', updatedAt: '2026-09-28T19:47:00Z', tags: ['archive', 's3'] },
  { id: 'app-notify', name: 'Notification gateway', kind: 'Application', provider: 'Azure', environment: 'Development', region: 'westus2', status: 'Discovered', risk: 'Low', dependencies: 1, owner: 'Platform', updatedAt: '2026-09-28T18:22:00Z', tags: ['tier-3', 'node'] },
  { id: 'db-identity', name: 'identity-directory', kind: 'Database', provider: 'AWS', environment: 'Production', region: 'us-west-2', status: 'Blocked', risk: 'Critical', dependencies: 2, owner: 'Platform', updatedAt: '2026-09-28T17:05:00Z', tags: ['tier-0', 'postgres'] },
];

export const demoDependencies: Dependency[] = [
  { id: 'edge-1', sourceId: 'app-orders', targetId: 'vm-orders-01', relationship: 'serves', critical: true },
  { id: 'edge-2', sourceId: 'vm-orders-01', targetId: 'db-orders', relationship: 'reads from', critical: true },
  { id: 'edge-3', sourceId: 'app-orders', targetId: 'app-identity', relationship: 'connects to', critical: true },
  { id: 'edge-4', sourceId: 'app-orders', targetId: 'db-catalog', relationship: 'reads from', critical: false },
  { id: 'edge-5', sourceId: 'app-identity', targetId: 'db-identity', relationship: 'reads from', critical: true },
  { id: 'edge-6', sourceId: 'vm-orders-01', targetId: 'net-core', relationship: 'connects to', critical: false },
  { id: 'edge-7', sourceId: 'app-catalog', targetId: 'vm-catalog-01', relationship: 'serves', critical: false },
  { id: 'edge-8', sourceId: 'app-billing', targetId: 'storage-receipts', relationship: 'stores in', critical: false },
  { id: 'edge-9', sourceId: 'app-notify', targetId: 'app-identity', relationship: 'connects to', critical: false },
];

export const demoWaves: MigrationWave[] = [
  { id: 'wave-0', name: 'Foundation', strategy: 'Replatform', status: 'Completed', assetCount: 8, completed: 8, startDate: 'Sep 08', risk: 'Low' },
  { id: 'wave-1', name: 'Commerce core', strategy: 'Rehost', status: 'Running', assetCount: 14, completed: 9, startDate: 'Sep 22', risk: 'High' },
  { id: 'wave-2', name: 'Customer identity', strategy: 'Refactor', status: 'Waiting for approval', assetCount: 11, completed: 0, startDate: 'Oct 06', risk: 'Critical' },
  { id: 'wave-3', name: 'Data services', strategy: 'Replatform', status: 'Queued', assetCount: 19, completed: 0, startDate: 'Oct 20', risk: 'Moderate' },
];

export const demoMigrationWorkItems: MigrationWorkItem[] = [
  { id: 'item-network', name: 'Core network foundation', source: 'core-vpc-prod', target: 'Target network', strategy: 'Replatform', waveId: 'wave-0', dependencies: [], prerequisites: ['Network address plan confirmed'], status: 'Completed', risk: 'Low', estimatedDurationDays: 2, rollbackCheckpoint: 'Source network remains unchanged', criticalPath: false },
  { id: 'item-orders-app', name: 'Orders API', source: 'orders-prod-01', target: 'Managed container runtime', strategy: 'Replatform', waveId: 'wave-1', dependencies: ['Core network foundation', 'Identity service'], prerequisites: ['Container image reviewed', 'Application health check defined'], status: 'Running', risk: 'High', estimatedDurationDays: 3, rollbackCheckpoint: 'Retain source host until target validation passes', criticalPath: true },
  { id: 'item-orders-db', name: 'Orders database', source: 'orders-primary', target: 'Managed PostgreSQL', strategy: 'Replatform', waveId: 'wave-1', dependencies: ['Core network foundation'], prerequisites: ['JDBC compatibility confirmed', 'Data reconciliation passes'], status: 'Blocked', risk: 'Critical', estimatedDurationDays: 4, rollbackCheckpoint: 'Keep source database writable until cutover approval', criticalPath: true },
  { id: 'item-identity', name: 'Identity service', source: 'identity-directory', target: 'Target identity service', strategy: 'Retain', waveId: 'wave-2', dependencies: ['Orders API', 'Notification gateway'], prerequisites: ['Shared-service owners approve dependency order'], status: 'Waiting for approval', risk: 'Critical', estimatedDurationDays: 5, rollbackCheckpoint: 'Rollback procedure not supplied', criticalPath: true },
  { id: 'item-catalog', name: 'Catalog service', source: 'catalog-stg-01', target: 'Managed container runtime', strategy: 'Rehost', waveId: 'wave-3', dependencies: ['Core network foundation'], prerequisites: ['Staging verification complete'], status: 'Queued', risk: 'Moderate', estimatedDurationDays: 2, rollbackCheckpoint: 'Source VM retained until service verification', criticalPath: false },
];

export const demoOverview: OverviewSnapshot = {
  discoveredAssets: 248,
  applications: 36,
  activeRuns: 3,
  pendingApprovals: 2,
  blockedTasks: 4,
  riskDistribution: { Low: 91, Moderate: 104, High: 41, Critical: 12 },
  updatedAt: '2026-09-29T09:12:00Z',
};

export const demoRiskAssessments: RiskAssessment[] = [
  {
    assetId: 'app-orders', assetName: 'Orders API', businessCriticality: 'Tier 1 · revenue path', downtimeImpact: 'Customer checkout unavailable', complianceRisk: 'High', readinessScore: 62, technicalDebt: 'Moderate · runtime upgrade needed', compatibility: 'Conditional · validate JDBC driver', recommendation: 'Replatform after database compatibility validation.', confidence: 0.78,
    factors: [
      { category: 'Dependency exposure', score: 4, explanation: 'The service has several direct dependencies in the demo graph.', evidence: ['Orders API → orders-primary', 'Orders API → Identity service'] },
      { category: 'Runtime compatibility', score: 3, explanation: 'A runtime compatibility check is represented as outstanding in this sample.', evidence: ['Java runtime family tagged on the asset'] },
    ],
  },
  {
    assetId: 'app-identity', assetName: 'Identity service', businessCriticality: 'Tier 0 · shared platform', downtimeImpact: 'Authentication unavailable across workloads', complianceRisk: 'Critical', readinessScore: 34, technicalDebt: 'High · upgrade path not assessed', compatibility: 'Unknown · evidence required', recommendation: 'Retain in the current environment until shared-service dependencies are resolved.',
    factors: [
      { category: 'Shared-service impact', score: 5, explanation: 'Multiple services reference identity in the demo relationship set.', evidence: ['Orders API → Identity service', 'Notification gateway → Identity service'] },
      { category: 'Evidence coverage', score: 4, explanation: 'Compatibility details are absent from this sample record.', evidence: ['No runtime or target compatibility evidence supplied'] },
    ],
  },
];

export const demoArchitectureOptions: ArchitectureOption[] = [
  { id: 'orders-managed-container', workload: 'Orders API', name: 'Managed container service', summary: 'Container target with managed orchestration.', topology: ['Managed container runtime', 'Managed PostgreSQL', 'Private network segment', 'Central identity provider'], benefits: ['Lower platform operations than self-managed orchestration', 'Keeps the service boundary intact'], considerations: ['Container image and runtime checks required', 'Database compatibility evidence is outstanding'], migrationImpact: 'Containerize application; migrate database separately.', compatibility: 'Conditional · confirm runtime and JDBC support.', risk: 'Moderate', recommended: true },
  { id: 'orders-kubernetes', workload: 'Orders API', name: 'Kubernetes platform', summary: 'Container workload on a managed Kubernetes cluster.', topology: ['Managed Kubernetes', 'Managed PostgreSQL', 'Private network segment', 'Workload identity'], benefits: ['Consistent platform for multi-service workloads', 'Supports independent service scaling'], considerations: ['Requires cluster operations and platform ownership', 'More infrastructure to validate and govern'], migrationImpact: 'Containerize and define cluster, policy, and workload configuration.', compatibility: 'Conditional · cluster readiness and application probes need review.', risk: 'High', recommended: false },
];

export const demoIaCFiles: IaCFile[] = [
  { path: 'terraform/main.tf', language: 'Terraform', origin: 'Generated', validation: 'Not run', content: 'resource "aws_vpc" "migration_network" {\n  cidr_block           = var.network_cidr\n  enable_dns_support   = true\n  enable_dns_hostnames = true\n\n  tags = {\n    Name        = "northstar-migration"\n    Environment = var.environment\n  }\n}\n\nresource "aws_subnet" "application" {\n  vpc_id     = aws_vpc.migration_network.id\n  cidr_block = var.application_subnet_cidr\n}\n' },
  { path: 'terraform/variables.tf', language: 'Terraform', origin: 'User edited', validation: 'Not run', content: 'variable "environment" {\n  type        = string\n  description = "Deployment environment"\n}\n\nvariable "network_cidr" {\n  type        = string\n  description = "Network address range"\n}\n\nvariable "application_subnet_cidr" {\n  type        = string\n  description = "Application subnet range"\n}\n' },
  { path: 'kubernetes/orders.yaml', language: 'Kubernetes YAML', origin: 'Generated', validation: 'Not run', content: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: orders-api\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: orders-api\n  template:\n    metadata:\n      labels:\n        app: orders-api\n    spec:\n      containers:\n        - name: orders-api\n          image: example.invalid/orders-api:review-required\n          ports:\n            - containerPort: 8080\n' },
];

export const demoValidationChecks: ValidationCheck[] = [
  { id: 'check-smoke', category: 'Functional', name: 'Orders API smoke check', status: 'Passed', resource: 'Orders API', detail: 'Demo record: endpoint response check passed.', observedAt: '2026-09-29T08:55:00Z' },
  { id: 'check-regression', category: 'Functional', name: 'Checkout regression suite', status: 'Running', resource: 'Orders API', detail: 'A sample regression run is in progress.', observedAt: '2026-09-29T09:03:00Z' },
  { id: 'check-perf', category: 'Performance', name: 'Latency comparison', status: 'Not run', resource: 'Orders API', detail: 'No latency measurements are available in this sample.', observedAt: '2026-09-29T08:40:00Z' },
  { id: 'check-iam', category: 'Security', name: 'Workload identity verification', status: 'Warning', resource: 'orders-prod-01', detail: 'Demo warning: identity evidence is incomplete.', observedAt: '2026-09-29T08:49:00Z' },
  { id: 'check-data', category: 'Data', name: 'Orders data reconciliation', status: 'Failed', resource: 'orders-primary', detail: 'Demo failure: sample record counts differ; investigate before sign-off.', observedAt: '2026-09-29T08:51:00Z' },
];

export const demoApprovals: ApprovalRequest[] = [
  { id: 'approval-204', action: 'Approve identity service migration wave', reason: 'The proposed wave includes a shared Tier 0 service.', resources: ['Identity service', 'identity-directory'], expectedImpact: 'Authentication dependencies require coordinated validation.', risk: 'Critical', evidence: ['2 direct service relationships in the demo graph', 'Compatibility evidence marked unknown'], recommendation: 'Defer until service owners confirm the dependency plan.', previousAttempts: 0, rollbackPlan: 'Rollback checkpoint details have not been supplied.', agent: 'Migration planning agent', createdAt: '2026-09-29T08:58:00Z' },
  { id: 'approval-198', action: 'Approve Commerce core execution', reason: 'The wave is ready to proceed to the next execution step.', resources: ['Orders API', 'orders-prod-01'], expectedImpact: 'The demo wave shows 9 of 14 planned resources completed.', risk: 'High', evidence: ['Sample migration wave status: Running'], recommendation: 'Review active task results before deciding.', previousAttempts: 1, rollbackPlan: 'No backend rollback procedure is connected.', agent: 'Migration orchestration agent', createdAt: '2026-09-29T08:32:00Z' },
];

export const demoExecutionTasks: ExecutionTask[] = [
  { id: 'task-401', name: 'Provision target network', resource: 'core-vpc-prod', status: 'Completed', agent: 'Infrastructure agent', runId: 'run-8821', step: 'Provisioning complete', retries: 0, updatedAt: '2026-09-29T08:21:00Z' },
  { id: 'task-402', name: 'Migrate application host', resource: 'orders-prod-01', status: 'Running', agent: 'Compute migration agent', runId: 'run-8821', step: 'Target health check', retries: 0, updatedAt: '2026-09-29T09:08:00Z' },
  { id: 'task-403', name: 'Verify database consistency', resource: 'orders-primary', status: 'Failed', agent: 'Data validation agent', runId: 'run-8819', step: 'Record reconciliation', retries: 1, updatedAt: '2026-09-29T08:51:00Z', error: 'Sample record counts differ; correlation: run-8819' },
  { id: 'task-404', name: 'Approve identity wave', resource: 'Identity service', status: 'Waiting for approval', agent: 'Migration planning agent', runId: 'run-8815', step: 'Human approval gate', retries: 0, updatedAt: '2026-09-29T08:58:00Z' },
  { id: 'task-405', name: 'Confirm network policy', resource: 'core-vpc-prod', status: 'Blocked', agent: 'Security assessment agent', runId: 'run-8817', step: 'Awaiting policy evidence', retries: 0, updatedAt: '2026-09-29T08:46:00Z', error: 'Policy evidence is not available in this demo record.' },
];

export const demoAgentRuns: AgentRun[] = [
  { id: 'run-8821', agent: 'Compute migration agent', status: 'Running', startedAt: '2026-09-29T08:11:00Z', currentStep: 'Target health check', workflow: 'Commerce core · Wave 1', model: 'Not supplied', events: [
    { id: 'event-1', timestamp: '2026-09-29T08:11:00Z', summary: 'Run queued from approved Commerce core plan.', status: 'Completed' },
    { id: 'event-2', timestamp: '2026-09-29T08:24:00Z', summary: 'Target network provisioning task completed.', status: 'Completed' },
    { id: 'event-3', timestamp: '2026-09-29T08:42:00Z', summary: 'Application host migration started.', status: 'Completed' },
    { id: 'event-4', timestamp: '2026-09-29T09:08:00Z', summary: 'Target health check is running.', status: 'Running' },
  ] },
  { id: 'run-8819', agent: 'Data validation agent', status: 'Failed', startedAt: '2026-09-29T08:37:00Z', currentStep: 'Record reconciliation', workflow: 'Commerce core · Wave 1', events: [
    { id: 'event-5', timestamp: '2026-09-29T08:37:00Z', summary: 'Database comparison started.', status: 'Completed' },
    { id: 'event-6', timestamp: '2026-09-29T08:51:00Z', summary: 'Reconciliation found a sample count mismatch.', status: 'Failed' },
  ] },
  { id: 'run-8815', agent: 'Migration planning agent', status: 'Waiting for approval', startedAt: '2026-09-29T07:56:00Z', currentStep: 'Human approval gate', workflow: 'Customer identity · Wave 2', events: [
    { id: 'event-7', timestamp: '2026-09-29T07:56:00Z', summary: 'Wave readiness review started.', status: 'Completed' },
    { id: 'event-8', timestamp: '2026-09-29T08:58:00Z', summary: 'Approval request created for the identity wave.', status: 'Waiting for approval' },
  ] },
];

export const demoAuditEvents: AuditEvent[] = [
  { id: 'audit-1001', actor: 'Compute migration agent', actorType: 'Agent', action: 'Started migration task', target: 'orders-prod-01', workflowId: 'run-8821', timestamp: '2026-09-29T08:42:00Z', severity: 'Info', result: 'Running' },
  { id: 'audit-1002', actor: 'Data validation agent', actorType: 'Agent', action: 'Recorded reconciliation failure', target: 'orders-primary', workflowId: 'run-8819', timestamp: '2026-09-29T08:51:00Z', severity: 'Critical', result: 'Failed · count mismatch' },
  { id: 'audit-1003', actor: 'Migration planning agent', actorType: 'Agent', action: 'Requested human approval', target: 'Customer identity · Wave 2', workflowId: 'run-8815', timestamp: '2026-09-29T08:58:00Z', severity: 'Warning', result: 'Waiting for approval' },
  { id: 'audit-1004', actor: 'Demo operator', actorType: 'User', action: 'Viewed asset details', target: 'Orders API', workflowId: 'workspace', timestamp: '2026-09-29T09:02:00Z', severity: 'Info', result: 'Viewed' },
];

export const demoFeedback: FeedbackEntry[] = [
  { id: 'feedback-55', recommendation: 'Rehost Orders API with its current database.', humanDecision: 'Correction submitted', correction: 'Replatform after verifying JDBC and database compatibility.', outcome: 'Pending validation', evaluationSignal: 'Recommendation partially accepted', reviewedAt: '2026-09-28T15:42:00Z' },
  { id: 'feedback-51', recommendation: 'Move identity service in the first application wave.', humanDecision: 'Rejected', correction: 'Retain until shared-service dependencies are mapped.', outcome: 'Wave sequence updated in sample plan', evaluationSignal: 'Recommendation rejected', reviewedAt: '2026-09-27T12:10:00Z' },
];

export const demoReports: MigrationReport[] = [
  { id: 'report-exec-01', name: 'Migration status summary', type: 'Executive', updatedAt: '2026-09-29T08:00:00Z', description: 'Wave progress and open blockers from the demo snapshot.', evidenceAvailable: false },
  { id: 'report-tech-01', name: 'Dependency and architecture review', type: 'Technical', updatedAt: '2026-09-29T07:40:00Z', description: 'Relationship map and target-option summary.', evidenceAvailable: true },
  { id: 'report-compliance-01', name: 'Compliance evidence inventory', type: 'Compliance', updatedAt: '2026-09-28T16:25:00Z', description: 'No compliance control results are included in this demo dataset.', evidenceAvailable: false },
];
