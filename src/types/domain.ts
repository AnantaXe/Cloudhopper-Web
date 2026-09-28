export type AssetKind = 'Application' | 'Virtual machine' | 'Database' | 'Container' | 'Storage' | 'Network';
export type AssetStatus = 'Discovered' | 'Assessed' | 'In migration' | 'Blocked';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type WorkflowStatus = 'Queued' | 'Running' | 'Waiting for approval' | 'Completed' | 'Failed';
export type ValidationStatus = 'Not run' | 'Running' | 'Passed' | 'Failed' | 'Warning';

export interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  provider: string;
  environment: string;
  region: string;
  status: AssetStatus;
  risk: RiskLevel;
  dependencies: number;
  owner: string;
  updatedAt: string;
  tags: string[];
}

export interface Dependency {
  id: string;
  sourceId: string;
  targetId: string;
  relationship: 'serves' | 'reads from' | 'connects to' | 'stores in';
  critical: boolean;
}

export interface MigrationWave {
  id: string;
  name: string;
  strategy: string;
  status: WorkflowStatus;
  assetCount: number;
  completed: number;
  startDate: string;
  risk: RiskLevel;
}

export interface MigrationWorkItem {
  id: string;
  name: string;
  source: string;
  target: string;
  strategy: 'Rehost' | 'Replatform' | 'Refactor' | 'Repurchase' | 'Retire' | 'Retain';
  waveId: string;
  dependencies: string[];
  prerequisites: string[];
  status: WorkflowStatus | 'Blocked';
  risk: RiskLevel;
  estimatedDurationDays: number;
  rollbackCheckpoint: string;
  criticalPath: boolean;
}

export interface OverviewSnapshot {
  discoveredAssets: number;
  applications: number;
  activeRuns: number;
  pendingApprovals: number;
  blockedTasks: number;
  riskDistribution: Record<RiskLevel, number>;
  updatedAt: string;
}

export interface DependencyGraph {
  assets: Asset[];
  relationships: Dependency[];
}

export interface AssessmentFactor {
  category: string;
  score: number;
  explanation: string;
  evidence: string[];
}

export interface RiskAssessment {
  assetId: string;
  assetName: string;
  businessCriticality: string;
  downtimeImpact: string;
  complianceRisk: RiskLevel;
  readinessScore: number;
  technicalDebt: string;
  compatibility: string;
  recommendation: string;
  confidence?: number;
  factors: AssessmentFactor[];
}

export interface ArchitectureOption {
  id: string;
  workload: string;
  name: string;
  summary: string;
  topology: string[];
  benefits: string[];
  considerations: string[];
  migrationImpact: string;
  compatibility: string;
  risk: RiskLevel;
  recommended: boolean;
  security?: string;
  identity?: string;
  encryption?: string;
  compliance?: string;
  cost?: string;
}

export interface IaCFile {
  path: string;
  language: string;
  content: string;
  origin: 'Generated' | 'User edited' | 'Approved';
  validation: ValidationStatus;
}

export interface ValidationCheck {
  id: string;
  category: 'Functional' | 'Performance' | 'Security' | 'Data';
  name: string;
  status: ValidationStatus;
  resource: string;
  detail: string;
  observedAt: string;
}

export interface ApprovalRequest {
  id: string;
  action: string;
  reason: string;
  resources: string[];
  expectedImpact: string;
  risk: RiskLevel;
  evidence: string[];
  recommendation: string;
  previousAttempts: number;
  rollbackPlan: string;
  agent: string;
  createdAt: string;
}

export interface ExecutionTask {
  id: string;
  name: string;
  resource: string;
  status: 'Queued' | 'Running' | 'Waiting for approval' | 'Completed' | 'Failed' | 'Retrying' | 'Blocked';
  agent: string;
  runId: string;
  step: string;
  retries: number;
  updatedAt: string;
  error?: string;
}

export interface AgentEvent {
  id: string;
  timestamp: string;
  summary: string;
  status: string;
}

export interface AgentRun {
  id: string;
  agent: string;
  status: WorkflowStatus | 'Retrying' | 'Paused' | 'Cancelled';
  startedAt: string;
  currentStep: string;
  workflow: string;
  events: AgentEvent[];
  model?: string;
  tokens?: number;
}

export interface AuditEvent {
  id: string;
  actor: string;
  actorType: 'User' | 'Agent' | 'System';
  action: string;
  target: string;
  workflowId: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Critical';
  result: string;
}

export interface FeedbackEntry {
  id: string;
  recommendation: string;
  humanDecision: string;
  correction: string;
  outcome: string;
  evaluationSignal: string;
  reviewedAt: string;
}

export interface MigrationReport {
  id: string;
  name: string;
  type: 'Executive' | 'Technical' | 'Compliance';
  updatedAt: string;
  description: string;
  evidenceAvailable: boolean;
}

export interface MigrationApi {
  getOverview(): Promise<OverviewSnapshot>;
  listAssets(): Promise<Asset[]>;
  getDependencyGraph(): Promise<DependencyGraph>;
  listMigrationWaves(): Promise<MigrationWave[]>;
  listMigrationWorkItems(): Promise<MigrationWorkItem[]>;
  listRiskAssessments(): Promise<RiskAssessment[]>;
  listArchitectureOptions(): Promise<ArchitectureOption[]>;
  listIaCFiles(): Promise<IaCFile[]>;
  listValidationChecks(): Promise<ValidationCheck[]>;
  listApprovalRequests(): Promise<ApprovalRequest[]>;
  listExecutionTasks(): Promise<ExecutionTask[]>;
  listAgentRuns(): Promise<AgentRun[]>;
  listAuditEvents(): Promise<AuditEvent[]>;
  listFeedbackEntries(): Promise<FeedbackEntry[]>;
  listReports(): Promise<MigrationReport[]>;
}
