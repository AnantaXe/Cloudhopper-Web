import { Activity, ArrowRight, CircleAlert, FileText, Filter, LockKeyhole, Search, ShieldCheck, Workflow } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge, statusTone } from '../../components/StatusBadge';
import { useAgentRuns, useApprovalRequests, useAuditEvents, useExecutionTasks, useFeedbackEntries, useMigrationWaves, useReports, useValidationChecks } from '../../hooks/use-migration-data';
import type { ApprovalRequest, AuditEvent, ExecutionTask, FeedbackEntry, MigrationReport, ValidationCheck } from '../../types/domain';

export function ControlCentre() {
  const tasksQuery = useExecutionTasks();
  const approvalsQuery = useApprovalRequests();
  const wavesQuery = useMigrationWaves();
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  if (tasksQuery.isLoading || approvalsQuery.isLoading || wavesQuery.isLoading) return <LoadingState label="Loading execution snapshot…" />;
  if (tasksQuery.isError || approvalsQuery.isError || wavesQuery.isError || !tasksQuery.data || !approvalsQuery.data || !wavesQuery.data) return <ErrorState label="Execution snapshot could not be loaded." retry={() => { void tasksQuery.refetch(); void approvalsQuery.refetch(); void wavesQuery.refetch(); }} />;

  const tasks = tasksQuery.data;
  const approvals = approvalsQuery.data;
  const activeWave = wavesQuery.data.find((wave) => wave.status === 'Running');
  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const selected = approvals.find((approval) => approval.id === selectedApproval) ?? approvals[0];

  return <div className="page-stack">
    <DemoNotice>Execution state is a static demo snapshot. Pause, resume, retry, rollback, and approval mutations are not connected.</DemoNotice>
    <section className="panel control-summary"><div className="control-state-mark"><Activity size={19} /></div><div className="control-summary-main"><p className="eyebrow">Current execution · sample</p><h2>{activeWave?.name ?? 'No active wave'}</h2><p>{activeWave ? `Wave ${activeWave.id.replace('wave-', '')} · ${activeWave.strategy} · ${activeWave.assetCount} planned assets` : 'No active migration is present in this snapshot.'}</p></div><div className="control-progress"><div><span>Visible task completion</span><strong>{progress}%</strong></div><div className="progress-line"><span style={{ width: `${progress}%` }} /></div><small>{completed} of {tasks.length} sample tasks</small></div><StatusBadge tone="info">{activeWave?.status ?? 'Queued'}</StatusBadge></section>
    <section className="control-grid">
      <article className="panel execution-panel"><div className="panel-heading"><div><p className="eyebrow">Task execution</p><h2>Workflow tasks</h2></div><span className="panel-caption">{tasks.length} sample records</span></div><div className="table-scroll"><table><thead><tr><th scope="col">Task / resource</th><th scope="col">Status</th><th scope="col">Responsible agent</th><th scope="col">Current step</th><th scope="col">Run</th></tr></thead><tbody>{tasks.map((task) => <TaskRow key={task.id} task={task} />)}{tasks.length === 0 && <tr><td colSpan={5} className="empty-cell">No execution tasks are available.</td></tr>}</tbody></table></div></article>
      <aside className="panel approvals-panel"><div className="panel-heading"><div><p className="eyebrow">Human gates</p><h2>Approval inbox</h2></div><span className="queue-count">{approvals.length}</span></div><div className="approval-list">{approvals.map((approval) => <button key={approval.id} className={`approval-list-item ${selected?.id === approval.id ? 'approval-list-selected' : ''}`} onClick={() => setSelectedApproval(approval.id)}><span className="approval-list-risk"><StatusBadge tone={statusTone(approval.risk)}>{approval.risk}</StatusBadge></span><strong>{approval.action}</strong><small>{approval.agent} · {new Date(approval.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></button>)}{approvals.length === 0 && <div className="approval-empty">No pending approval requests.</div>}</div></aside>
    </section>
    {selected ? <ApprovalContext approval={selected} /> : <div className="panel empty-state"><LockKeyhole size={18} /><strong>No approval request selected</strong><span>Approval context will appear when a request is available.</span></div>}
    <section className="panel log-panel"><div className="panel-heading"><div><p className="eyebrow">Execution trace</p><h2>Recent task events</h2></div><span className="panel-caption">Refresh-safe snapshot · server is source of truth</span></div><div className="event-table"><div className="event-header"><span>Resource</span><span>Event</span><span>Run ID</span><span>Updated</span></div>{tasks.map((task) => <div className="event-row" key={task.id}><strong>{task.resource}</strong><span>{task.step}{task.error && <small className="event-error">{task.error}</small>}</span><code>{task.runId}</code><time>{new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>)}</div></section>
  </div>;
}

function TaskRow({ task }: { task: ExecutionTask }) {
  return <tr><td><strong className="table-primary">{task.name}</strong><small className="cell-subline">{task.resource}</small></td><td><StatusBadge tone={statusTone(task.status)}>{task.status}</StatusBadge>{task.retries > 0 && <small className="retry-count">{task.retries} attempt{task.retries > 1 ? 's' : ''}</small>}</td><td>{task.agent}</td><td><span className="task-step">{task.step}</span>{task.error && <small className="table-error">{task.error}</small>}</td><td><code className="run-id">{task.runId}</code></td></tr>;
}

function ApprovalContext({ approval }: { approval: ApprovalRequest }) {
  return <section className="panel approval-context"><div className="panel-heading"><div><p className="eyebrow">Approval context · {approval.id}</p><h2>{approval.action}</h2></div><StatusBadge tone={statusTone(approval.risk)}>{approval.risk} risk</StatusBadge></div><div className="approval-context-grid"><div><h3>Why approval is requested</h3><p>{approval.reason}</p><h3>Expected impact</h3><p>{approval.expectedImpact}</p><h3>Agent recommendation</h3><p>{approval.recommendation}</p></div><div><h3>Affected resources</h3><ul>{approval.resources.map((resource) => <li key={resource}>{resource}</li>)}</ul><h3>Evidence</h3><ul>{approval.evidence.map((evidence) => <li key={evidence}>{evidence}</li>)}</ul></div><div><h3>Previous attempts</h3><p>{approval.previousAttempts}</p><h3>Rollback plan</h3><p>{approval.rollbackPlan}</p><h3>Requester / time</h3><p>{approval.agent}<br />{new Date(approval.createdAt).toLocaleString()}</p></div></div><div className="approval-action-notice"><LockKeyhole size={14} /> Decision controls are unavailable until approval and audit mutation contracts are connected.</div></section>;
}

export function ValidationWorkspace() {
  const query = useValidationChecks();
  const [category, setCategory] = useState('All checks');
  if (query.isLoading) return <LoadingState label="Loading validation results…" />;
  if (query.isError || !query.data) return <ErrorState label="Validation records could not be loaded." retry={() => void query.refetch()} />;
  const filtered = query.data.filter((check) => category === 'All checks' || check.category === category);
  const categories = ['All checks', 'Functional', 'Performance', 'Security', 'Data'];
  return <div className="page-stack"><DemoNotice>Check results are illustrative fixture data. No live test runner, scanner, performance measurement, or reconciliation service is connected.</DemoNotice><section className="validation-summary-grid">{(['Functional', 'Performance', 'Security', 'Data'] as const).map((name) => { const rows = query.data.filter((check) => check.category === name); const failed = rows.filter((check) => ['Failed', 'Warning'].includes(check.status)).length; return <article className="panel validation-summary" key={name}><span>{name}</span><strong>{rows.length}</strong><small>{failed ? `${failed} need review` : 'No open findings in sample'}</small></article>; })}</section><section className="panel validation-panel"><div className="panel-heading"><div><p className="eyebrow">Migration verification</p><h2>Validation checks</h2></div><span className="panel-caption">{query.data.length} checks · sample timestamps</span></div><div className="filter-tabs" role="tablist" aria-label="Validation category">{categories.map((name) => <button key={name} role="tab" aria-selected={category === name} className={category === name ? 'filter-tab-active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div><div className="table-scroll"><table><thead><tr><th scope="col">Category / check</th><th scope="col">Resource</th><th scope="col">Status</th><th scope="col">Evidence summary</th><th scope="col">Observed</th></tr></thead><tbody>{filtered.map((check) => <ValidationRow check={check} key={check.id} />)}</tbody></table></div>{filtered.length === 0 && <div className="empty-state"><ShieldCheck size={19} /><strong>No checks in this category</strong></div>}</section><div className="validation-footnote"><CircleAlert size={14} /> Compliance claims, throughput, latency, IAM verification, and encryption state require backend evidence and are not inferred here.</div></div>;
}

function ValidationRow({ check }: { check: ValidationCheck }) {
  return <tr><td><strong className="table-primary">{check.name}</strong><small className="cell-subline">{check.category}</small></td><td>{check.resource}</td><td><StatusBadge tone={statusTone(check.status)}>{check.status}</StatusBadge></td><td className="validation-detail-cell">{check.detail}</td><td>{new Date(check.observedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td></tr>;
}

export function ReportsWorkspace() {
  const query = useReports();
  const [type, setType] = useState('All reports');
  if (query.isLoading) return <LoadingState label="Loading report index…" />;
  if (query.isError || !query.data) return <ErrorState label="Report index could not be loaded." retry={() => void query.refetch()} />;
  const reports = query.data.filter((report) => type === 'All reports' || report.type === type);
  return <div className="page-stack"><DemoNotice>These are report index records only. Exports, budget figures, and compliance evidence are not available in the connected contract.</DemoNotice><section className="panel report-toolbar"><div><p className="eyebrow">Reporting library</p><h2>Migration reports</h2></div><label className="sr-only" htmlFor="report-type">Filter reports by type</label><select id="report-type" value={type} onChange={(event) => setType(event.target.value)}><option>All reports</option><option>Executive</option><option>Technical</option><option>Compliance</option></select></section><section className="report-grid">{reports.map((report) => <ReportCard report={report} key={report.id} />)}</section>{reports.length === 0 && <div className="panel empty-state"><FileText size={20} /><strong>No reports in this category</strong></div>}</div>;
}

function ReportCard({ report }: { report: MigrationReport }) {
  return <article className="panel report-card"><span className={`report-icon report-${report.type.toLowerCase()}`}><FileText size={17} /></span><div className="report-card-title"><span>{report.type} report</span><StatusBadge tone={report.evidenceAvailable ? 'success' : 'warning'}>{report.evidenceAvailable ? 'Sample evidence' : 'No evidence'}</StatusBadge></div><h3>{report.name}</h3><p>{report.description}</p><div className="report-card-footer"><time>{new Date(report.updatedAt).toLocaleDateString()}</time><button className="quiet-button" disabled title="Report export is not connected">Open report <ArrowRight size={13} /></button></div></article>;
}

export function AgentRunsWorkspace() {
  const query = useAgentRuns();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  if (query.isLoading) return <LoadingState label="Loading agent run history…" />;
  if (query.isError || !query.data) return <ErrorState label="Agent run history could not be loaded." retry={() => void query.refetch()} />;
  const selected = query.data.find((run) => run.id === selectedId) ?? query.data[0];
  if (!selected) return <div className="panel empty-state"><Activity size={20} /><strong>No agent runs available</strong><span>Workflow events will appear when the agent service returns run records.</span></div>;
  return <div className="page-stack"><DemoNotice>Run IDs, events, and task summaries are demo records. Model/token telemetry is displayed only where supplied; no hidden reasoning is shown.</DemoNotice><section className="agent-run-layout"><div className="panel run-list"><div className="panel-heading"><div><p className="eyebrow">Workflow observability</p><h2>Agent runs</h2></div></div>{query.data.map((run) => <button className={`run-list-item ${run.id === selected.id ? 'run-selected' : ''}`} key={run.id} onClick={() => setSelectedId(run.id)}><StatusBadge tone={statusTone(run.status)}>{run.status}</StatusBadge><strong>{run.agent}</strong><small>{run.workflow}</small><code>{run.id}</code></button>)}</div><section className="panel run-detail"><div className="panel-heading"><div><p className="eyebrow">Run timeline · <code>{selected.id}</code></p><h2>{selected.agent}</h2></div><StatusBadge tone={statusTone(selected.status)}>{selected.status}</StatusBadge></div><div className="run-metadata"><span><b>Workflow</b>{selected.workflow}</span><span><b>Started</b>{new Date(selected.startedAt).toLocaleString()}</span><span><b>Current step</b>{selected.currentStep}</span><span><b>Model</b>{selected.model ?? 'Not supplied'}</span>{selected.tokens !== undefined && <span><b>Tokens</b>{selected.tokens.toLocaleString()}</span>}</div><div className="run-timeline">{selected.events.map((event, index) => <article className="run-event" key={event.id}><span className={`timeline-marker marker-${statusTone(event.status) ?? 'neutral'}`} /><div><div className="run-event-heading"><strong>{event.summary}</strong><StatusBadge tone={statusTone(event.status)}>{event.status}</StatusBadge></div><time>{new Date(event.timestamp).toLocaleString()}</time></div>{index < selected.events.length - 1 && <i className="timeline-line" />}</article>)}</div></section></section></div>;
}

export function AuditWorkspace() {
  const query = useAuditEvents();
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All severities');
  const filtered = useMemo(() => (query.data ?? []).filter((event) => {
    const needle = search.toLowerCase();
    const matchesText = !needle || [event.actor, event.action, event.target, event.workflowId, event.result].some((value) => value.toLowerCase().includes(needle));
    return matchesText && (severity === 'All severities' || event.severity === severity);
  }), [query.data, search, severity]);
  if (query.isLoading) return <LoadingState label="Loading audit events…" />;
  if (query.isError || !query.data) return <ErrorState label="Audit events could not be loaded." retry={() => void query.refetch()} />;
  return <div className="page-stack"><DemoNotice>Audit records are a fixed sample and are not an authoritative or complete event history.</DemoNotice><section className="panel audit-panel"><div className="table-heading"><div><p className="eyebrow">Traceability</p><h2>Audit log <span>{filtered.length}</span></h2></div><span className="panel-caption">User · agent · system events</span></div><div className="audit-filters"><label className="asset-search"><Search size={15} /><span className="sr-only">Search audit events</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Actor, resource, action, run ID…" /></label><label className="sr-only" htmlFor="severity-filter">Filter by severity</label><select id="severity-filter" value={severity} onChange={(event) => setSeverity(event.target.value)}><option>All severities</option><option>Info</option><option>Warning</option><option>Critical</option></select><span><Filter size={13} /> {filtered.length} matching</span></div><div className="table-scroll"><table><thead><tr><th scope="col">Time</th><th scope="col">Actor</th><th scope="col">Action</th><th scope="col">Target</th><th scope="col">Workflow</th><th scope="col">Severity / result</th></tr></thead><tbody>{filtered.map((event) => <AuditRow event={event} key={event.id} />)}{filtered.length === 0 && <tr><td colSpan={6} className="empty-cell">No events match the current filters.</td></tr>}</tbody></table></div></section></div>;
}

function AuditRow({ event }: { event: AuditEvent }) {
  return <tr><td><time className="audit-time">{new Date(event.timestamp).toLocaleString()}</time></td><td><strong className="table-primary">{event.actor}</strong><small className="cell-subline">{event.actorType}</small></td><td>{event.action}</td><td>{event.target}</td><td><code className="run-id">{event.workflowId}</code></td><td><StatusBadge tone={statusTone(event.severity)}>{event.severity}</StatusBadge><small className="cell-subline">{event.result}</small></td></tr>;
}

export function FeedbackWorkspace() {
  const query = useFeedbackEntries();
  if (query.isLoading) return <LoadingState label="Loading feedback history…" />;
  if (query.isError || !query.data) return <ErrorState label="Feedback records could not be loaded." retry={() => void query.refetch()} />;
  return <div className="page-stack"><DemoNotice>Learning and evaluation entries are sample records. Submitting feedback and changing model behavior are not connected.</DemoNotice>{query.data.length ? <section className="feedback-list">{query.data.map((entry) => <FeedbackCard entry={entry} key={entry.id} />)}</section> : <div className="panel empty-state"><Workflow size={20} /><strong>No feedback records available</strong><span>Human reviews will appear when feedback data is connected.</span></div>}<section className="panel feedback-eval"><div className="eval-icon"><Workflow size={17} /></div><div><p className="eyebrow">Evaluation signals</p><h2>Feedback is visible; learning is not inferred</h2><p>Evaluation outcomes appear only where an explicit sample signal is provided. No model performance metric or training effect is claimed.</p></div></section></div>;
}

function FeedbackCard({ entry }: { entry: FeedbackEntry }) {
  return <article className="panel feedback-card"><div className="feedback-card-header"><span className="feedback-id">REVIEW · {entry.id}</span><time>{new Date(entry.reviewedAt).toLocaleString()}</time></div><div className="feedback-columns"><div><span className="eyebrow">Original agent recommendation</span><p>{entry.recommendation}</p></div><div><span className="eyebrow">Human decision</span><strong>{entry.humanDecision}</strong><p>{entry.correction}</p></div><div><span className="eyebrow">Outcome & evaluation</span><p>{entry.outcome}</p><StatusBadge tone="neutral">{entry.evaluationSignal}</StatusBadge></div></div></article>;
}

export function SettingsWorkspace() {
  return <div className="page-stack"><DemoNotice>Authentication and authorization are backend responsibilities. This page reports frontend connection state only; it does not grant access.</DemoNotice><section className="settings-grid"><article className="panel settings-section"><div className="settings-icon"><LockKeyhole size={17} /></div><div><p className="eyebrow">Identity boundary</p><h2>Single sign-on</h2><p>OIDC / SAML provider configuration is not available in the current contract.</p><StatusBadge tone="warning">Not connected</StatusBadge></div></article><article className="panel settings-section"><div className="settings-icon"><ShieldCheck size={17} /></div><div><p className="eyebrow">Session security</p><h2>MFA & session state</h2><p>Session expiry, MFA state, and secure session refresh are owned by the identity service.</p><StatusBadge tone="neutral">Not supplied</StatusBadge></div></article><article className="panel settings-section"><div className="settings-icon"><Workflow size={17} /></div><div><p className="eyebrow">Permission-aware UI</p><h2>Workspace permissions</h2><p>The current demo has no role or permission claims. Backend authorization remains authoritative.</p><StatusBadge tone="warning">No claims supplied</StatusBadge></div></article><article className="panel settings-section"><div className="settings-icon"><Activity size={17} /></div><div><p className="eyebrow">Data connection</p><h2>Migration service</h2><p>All displayed records are served from the local typed demo adapter.</p><StatusBadge tone="warning">Demo adapter</StatusBadge></div></article></section></div>;
}

function DemoNotice({ children }: { children: string }) {
  return <div className="demo-notice"><CircleAlert size={15} /> {children}</div>;
}

function LoadingState({ label }: { label: string }) {
  return <div className="page-state" role="status">{label}</div>;
}

function ErrorState({ label, retry }: { label: string; retry: () => void }) {
  return <div className="page-state error-state" role="alert"><CircleAlert size={18} /> {label} <button className="text-button" onClick={retry}>Retry</button></div>;
}
