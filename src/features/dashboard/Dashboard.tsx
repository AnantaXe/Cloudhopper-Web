import { ArrowDownRight, ArrowRight, ArrowUpRight, Clock3, CircleAlert, GitBranch, Layers3, ShieldAlert, Workflow } from 'lucide-react';
import { StatusBadge, statusTone } from '../../components/StatusBadge';
import { useMigrationWaves, useOverview } from '../../hooks/use-migration-data';
import type { RiskLevel } from '../../types/domain';

const risks: RiskLevel[] = ['Critical', 'High', 'Moderate', 'Low'];

interface DashboardProps {
  onNavigate: (view: 'assets' | 'dependencies' | 'migration') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const overview = useOverview();
  const waves = useMigrationWaves();

  if (overview.isLoading || waves.isLoading) return <div className="page-state" role="status">Loading workspace snapshot…</div>;
  if (overview.isError || waves.isError || !overview.data || !waves.data) return <div className="page-state error-state" role="alert"><CircleAlert size={18} /> Workspace snapshot could not be loaded. <button className="text-button" onClick={() => { void overview.refetch(); void waves.refetch(); }}>Retry</button></div>;

  const data = overview.data;
  const totalRisk = Object.values(data.riskDistribution).reduce((total, value) => total + value, 0);
  const activeWave = waves.data.find((wave) => wave.status === 'Running');

  return (
    <div className="page-stack">
      <section className="metric-grid" aria-label="Migration overview metrics">
        <button className="metric-card" onClick={() => onNavigate('assets')}>
          <span className="metric-label"><Layers3 size={15} /> Discovered assets</span>
          <strong>{data.discoveredAssets.toLocaleString()}</strong>
          <span className="metric-foot"><span className="metric-note">Across connected environments</span><ArrowUpRight size={15} /></span>
        </button>
        <button className="metric-card" onClick={() => onNavigate('assets')}>
          <span className="metric-label"><Workflow size={15} /> Applications</span>
          <strong>{data.applications}</strong>
          <span className="metric-foot"><span className="metric-note">In the inventory</span><ArrowRight size={15} /></span>
        </button>
        <button className="metric-card" onClick={() => onNavigate('migration')}>
          <span className="metric-label"><GitBranch size={15} /> Active agent runs</span>
          <strong>{data.activeRuns}</strong>
          <span className="metric-foot"><span className="metric-note">Workflow snapshot</span><ArrowUpRight size={15} /></span>
        </button>
        <button className="metric-card metric-attention" onClick={() => onNavigate('migration')}>
          <span className="metric-label"><ShieldAlert size={15} /> Approval gates</span>
          <strong>{data.pendingApprovals}</strong>
          <span className="metric-foot"><span className="metric-note">{data.blockedTasks} blocked tasks</span><ArrowDownRight size={15} /></span>
        </button>
      </section>

      <section className="overview-grid">
        <article className="panel migration-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Execution overview</p><h2>Migration waves</h2></div>
            <button className="quiet-button" onClick={() => onNavigate('migration')}>View plan <ArrowRight size={14} /></button>
          </div>
          <div className="wave-list">
            {waves.data.map((wave, index) => {
              const percent = wave.assetCount ? Math.round((wave.completed / wave.assetCount) * 100) : 0;
              return <div className="wave-row" key={wave.id}>
                <div className={`wave-index ${wave.status === 'Running' ? 'wave-index-active' : ''}`}>{String(index + 1).padStart(2, '0')}</div>
                <div className="wave-main">
                  <div className="wave-title"><div><strong>{wave.name}</strong><span>{wave.strategy} · {wave.assetCount} assets</span></div><StatusBadge tone={statusTone(wave.status)}>{wave.status}</StatusBadge></div>
                  <div className="progress-line" aria-label={`${percent}% complete`}><span style={{ width: `${percent}%` }} /></div>
                </div>
                <div className="wave-progress"><strong>{wave.completed}<span> / {wave.assetCount}</span></strong><small>{wave.startDate}</small></div>
              </div>;
            })}
          </div>
          {activeWave && <div className="active-wave-note"><span className="pulse-mark" /> <span><b>{activeWave.name}</b> is the active wave</span><span className="note-divider" />{activeWave.completed} of {activeWave.assetCount} resources complete</div>}
        </article>

        <article className="panel risk-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Assessment snapshot</p><h2>Risk distribution</h2></div>
            <button className="icon-button" aria-label="Open risk and readiness" title="Risk and readiness is not connected in this demo slice" disabled><ArrowRight size={16} /></button>
          </div>
          <p className="panel-caption">{totalRisk} assessed items · sourced from demo snapshot</p>
          <div className="risk-bars">
            {risks.map((risk) => {
              const count = data.riskDistribution[risk];
              const percent = totalRisk ? (count / totalRisk) * 100 : 0;
              return <div className="risk-row" key={risk}><span className={`risk-key risk-${risk.toLowerCase()}`}>{risk}</span><div className="risk-track"><span className={`risk-fill risk-${risk.toLowerCase()}`} style={{ width: `${percent}%` }} /></div><strong>{count}</strong><small>{Math.round(percent)}%</small></div>;
            })}
          </div>
          <div className="risk-footnote"><CircleAlert size={14} /><span>Risk explanations are shown on individual assessments when evidence is available.</span></div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel dependency-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Topology</p><h2>Dependency map</h2></div>
            <button className="quiet-button" onClick={() => onNavigate('dependencies')}>Explore graph <ArrowRight size={14} /></button>
          </div>
          <div className="mini-topology" aria-hidden="true">
            <div className="topology-node node-app"><span>APP</span><b>Orders API</b></div><span className="topology-link link-one" /><span className="topology-link link-two" /><span className="topology-link link-three" />
            <div className="topology-node node-vm"><span>COMPUTE</span><b>orders-prod-01</b></div>
            <div className="topology-node node-db"><span>DATABASE</span><b>orders-primary</b></div>
            <div className="topology-node node-id"><span>IDENTITY</span><b>Identity service</b></div>
          </div>
          <div className="dependency-caption"><span><i className="legend-dot critical-dot" />Critical path</span><span><i className="legend-dot" />Service relationship</span><button onClick={() => onNavigate('dependencies')}>View all relationships</button></div>
        </article>
        <article className="panel blockers-panel">
          <div className="panel-heading"><div><p className="eyebrow">Needs attention</p><h2>Operational queue</h2></div><span className="queue-count">{data.pendingApprovals + data.blockedTasks}</span></div>
          <button className="queue-item" onClick={() => onNavigate('migration')}><span className="queue-icon queue-approval"><Clock3 size={16} /></span><span><b>{data.pendingApprovals} approvals awaiting decision</b><small>Review requested migration gates</small></span><ArrowRight size={15} /></button>
          <button className="queue-item" onClick={() => onNavigate('assets')}><span className="queue-icon queue-blocked"><CircleAlert size={16} /></span><span><b>{data.blockedTasks} blocked tasks</b><small>Inspect affected resources</small></span><ArrowRight size={15} /></button>
          <div className="queue-disclaimer">Actions require a connected backend and explicit authorization.</div>
        </article>
      </section>
      <p className="snapshot-time"><Clock3 size={13} /> Snapshot updated {new Date(data.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · demo data, not live</p>
    </div>
  );
}
