import { lazy, Suspense, useState } from 'react';
import { Activity, AlertTriangle, Boxes, ChartNoAxesCombined, ChevronDown, CircleHelp, Cloud, Command, FileCode2, GitBranch, LayoutDashboard, ListChecks, LockKeyhole, Menu, Network, Search, Settings2, ShieldCheck, Bell, X } from 'lucide-react';
import { AssetExplorer } from './features/assets/AssetExplorer';
import { Dashboard } from './features/dashboard/Dashboard';
import { MigrationOverview } from './features/migration/MigrationOverview';
import { useOverview } from './hooks/use-migration-data';
import type { Asset } from './types/domain';

const DependencyExplorer = lazy(() => import('./features/dependencies/DependencyExplorer').then((module) => ({ default: module.DependencyExplorer })));
const RiskReadiness = lazy(() => import('./features/planning/PlanningViews').then((module) => ({ default: module.RiskReadiness })));
const ArchitectureDesigner = lazy(() => import('./features/planning/PlanningViews').then((module) => ({ default: module.ArchitectureDesigner })));
const IaCStudio = lazy(() => import('./features/iac/IaCStudio').then((module) => ({ default: module.IaCStudio })));
const ControlCentre = lazy(() => import('./features/operations/OperationsViews').then((module) => ({ default: module.ControlCentre })));
const ValidationWorkspace = lazy(() => import('./features/operations/OperationsViews').then((module) => ({ default: module.ValidationWorkspace })));
const ReportsWorkspace = lazy(() => import('./features/operations/OperationsViews').then((module) => ({ default: module.ReportsWorkspace })));
const AgentRunsWorkspace = lazy(() => import('./features/operations/OperationsViews').then((module) => ({ default: module.AgentRunsWorkspace })));
const FeedbackWorkspace = lazy(() => import('./features/operations/OperationsViews').then((module) => ({ default: module.FeedbackWorkspace })));
const AuditWorkspace = lazy(() => import('./features/operations/OperationsViews').then((module) => ({ default: module.AuditWorkspace })));
const SettingsWorkspace = lazy(() => import('./features/operations/OperationsViews').then((module) => ({ default: module.SettingsWorkspace })));

type ActiveView = 'overview' | 'assets' | 'dependencies' | 'risk' | 'architecture' | 'migration' | 'iac' | 'control' | 'validation' | 'reports' | 'agents' | 'feedback' | 'audit' | 'settings';
type View = ActiveView | 'staged';

const navigation = [
  { label: 'WORKSPACE', items: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'assets', label: 'Discovery & assets', icon: Boxes },
    { id: 'dependencies', label: 'Dependencies', icon: Network },
  ] },
    { label: 'PLAN', items: [
    { id: 'risk', label: 'Risk & readiness', icon: ShieldCheck },
    { id: 'architecture', label: 'Architecture designer', icon: GitBranch },
    { id: 'migration', label: 'Migration planner', icon: ListChecks },
    { id: 'iac', label: 'IaC studio', icon: FileCode2 },
  ] },
  { label: 'OPERATE', items: [
    { id: 'control', label: 'Control centre', icon: Activity },
    { id: 'validation', label: 'Validation', icon: ChartNoAxesCombined },
    { id: 'reports', label: 'Reports', icon: Boxes },
    { id: 'agents', label: 'Agent runs', icon: Activity },
  ] },
  { label: 'GOVERNANCE', items: [
    { id: 'feedback', label: 'Feedback & learning', icon: CircleHelp },
    { id: 'audit', label: 'Audit log', icon: LockKeyhole },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ] },
] as const;

const pageInfo: Record<ActiveView, { title: string; description: string }> = {
  overview: { title: 'Migration overview', description: 'Operational snapshot across discovery, planning, and execution.' },
  assets: { title: 'Discovery & assets', description: 'Inventory across connected environments and providers.' },
  dependencies: { title: 'Dependency map', description: 'Explore service relationships and critical paths.' },
  risk: { title: 'Risk & readiness', description: 'Review workload evidence and readiness factors.' },
  architecture: { title: 'Architecture designer', description: 'Compare target options and migration tradeoffs.' },
  migration: { title: 'Migration planner', description: 'Review the current sequence of migration waves.' },
  iac: { title: 'IaC studio', description: 'Review generated infrastructure code and validation state.' },
  control: { title: 'Migration control centre', description: 'Monitor task execution, blockers, and human gates.' },
  validation: { title: 'Validation', description: 'Inspect functional, performance, security, and data checks.' },
  reports: { title: 'Reports', description: 'Browse executive, technical, and compliance report records.' },
  agents: { title: 'Agent runs', description: 'Trace workflow events, steps, and failure states.' },
  feedback: { title: 'Feedback & learning', description: 'Review human decisions and evaluation signals.' },
  audit: { title: 'Audit log', description: 'Search user, agent, and system event records.' },
  settings: { title: 'Settings', description: 'Inspect identity, session, and permission connection state.' },
};

function resolveView(id: string): View {
  if (id in pageInfo) return id as ActiveView;
  return 'staged';
}

function App() {
  const overview = useOverview();
  const [view, setView] = useState<ActiveView>('overview');
  const [search, setSearch] = useState('');
  const [environment, setEnvironment] = useState('All environments');
  const [focusedAsset, setFocusedAsset] = useState<string | undefined>();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [stagedSection, setStagedSection] = useState('');

  function navigate(nextView: ActiveView) {
    setView(nextView);
    setStagedSection('');
    setMobileNavOpen(false);
    if (nextView !== 'dependencies') setFocusedAsset(undefined);
    if (nextView !== 'assets') setSearch('');
  }

  function showStaged(label: string) {
    setStagedSection(label);
    setMobileNavOpen(false);
  }

  function focusDependencies(asset: Asset) {
    setFocusedAsset(asset.id);
    setView('dependencies');
  }

  const page = pageInfo[view];

  return <div className="app-shell">
    {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
    <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`} aria-label="Primary navigation">
      <div className="brand-lockup"><span className="brand-mark"><Cloud size={19} strokeWidth={2.2} /></span><span className="brand-name">cloudhopper<span>migration operations</span></span><button className="mobile-close icon-button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}><X size={17} /></button></div>
      <button className="workspace-select" disabled title="Workspace selection requires a connected project API"><span className="workspace-avatar">N</span><span className="workspace-copy"><strong>Northstar</strong><small>Demo workspace</small></span><ChevronDown size={15} /></button>
      <div className="sidebar-divider" />
      <nav className="nav-groups">
        {navigation.map((group) => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map((item) => {
          const Icon = item.icon;
          const active = view === resolveView(item.id) && (item.id === view) && !stagedSection;
          const staged = 'staged' in item && item.staged;
          return <button key={item.id} className={`nav-item ${active ? 'nav-active' : ''} ${staged ? 'nav-staged' : ''}`} aria-current={active ? 'page' : undefined} title={staged ? `${item.label} is not available in this demo slice` : undefined} onClick={() => staged ? showStaged(item.label) : navigate(resolveView(item.id) as ActiveView)}><Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.id === 'migration' && <i className="nav-indicator" aria-label="Active migration" />}</button>;
        })}</div>)}
      </nav>
      <div className="sidebar-bottom"><div className="connection-status"><span className="connection-dot" /><span><strong>Demo adapter</strong><small>Backend not connected</small></span></div><button className="sidebar-help" onClick={() => showStaged('Help & support')}><CircleHelp size={16} />Help & support</button><div className="account-row"><span className="account-avatar">DM</span><span><strong>Demo operator</strong><small>Workspace member</small></span><ChevronDown size={14} /></div></div>
    </aside>

    <main className="main-shell">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={19} /></button><div className="breadcrumbs"><span>Northstar</span><span className="breadcrumb-slash">/</span><strong>{stagedSection || page.title}</strong></div></div><div className="topbar-tools"><label className="global-search"><Search size={15} /><span className="sr-only">Search assets</span><input value={search} onChange={(event) => { setSearch(event.target.value); if (view !== 'assets') setView('assets'); setStagedSection(''); }} placeholder="Search assets…" /><kbd><Command size={10} /> K</kbd></label><label className="sr-only" htmlFor="environment-select">Environment</label><select id="environment-select" className="environment-select" value={environment} onChange={(event) => { setEnvironment(event.target.value); setView('assets'); setStagedSection(''); }}><option>All environments</option><option>Production</option><option>Staging</option><option>Development</option></select><button className="approval-indicator" onClick={() => navigate('control')} title="Review approval queue"><span className="approval-bell"><Bell size={16} /><i /></span><span>Approvals</span><b>{overview.data?.pendingApprovals ?? '…'}</b></button><button className="top-icon-button" aria-label="Notifications" title="Notifications are not connected" disabled><Bell size={17} /></button></div></header>
      <div className="content-area">
        <div className="content-heading"><div><div className="heading-kicker"><span className="workspace-pip" />NORTHSTAR WORKSPACE <span className="heading-separator">/</span> {stagedSection ? 'PRODUCT AREA' : page.title.toUpperCase()}</div><h1>{stagedSection || page.title}</h1><p>{stagedSection ? 'This capability is outside the current connected demo slice.' : page.description}</p></div><div className="heading-actions"><span className="demo-stamp"><span />DEMO DATA</span><button className="help-button" onClick={() => showStaged('Help & support')} aria-label="Help" title="Help & support"><CircleHelp size={17} /></button></div></div>
        {stagedSection ? <StagedNotice section={stagedSection} onReturn={() => { setStagedSection(''); setView('overview'); }} /> : <Suspense fallback={<div className="page-state" role="status">Loading workspace view…</div>}>
          {view === 'overview' && <Dashboard onNavigate={navigate} />}
          {view === 'assets' && <AssetExplorer initialSearch={search} environment={environment} onEnvironmentChange={setEnvironment} onSearchChange={setSearch} onOpenDependencies={focusDependencies} />}
          {view === 'dependencies' && <DependencyExplorer focusAssetId={focusedAsset} onClearFocus={() => setFocusedAsset(undefined)} onOpenAsset={(asset) => { setSearch(asset.name); setView('assets'); setFocusedAsset(undefined); }} />}
          {view === 'risk' && <RiskReadiness />}
          {view === 'architecture' && <ArchitectureDesigner />}
          {view === 'migration' && <MigrationOverview />}
          {view === 'iac' && <IaCStudio />}
          {view === 'control' && <ControlCentre />}
          {view === 'validation' && <ValidationWorkspace />}
          {view === 'reports' && <ReportsWorkspace />}
          {view === 'agents' && <AgentRunsWorkspace />}
          {view === 'feedback' && <FeedbackWorkspace />}
          {view === 'audit' && <AuditWorkspace />}
          {view === 'settings' && <SettingsWorkspace />}
        </Suspense>}
        <footer className="workspace-footer"><span>Cloudhopper <b>·</b> Migration operations</span><span>Snapshot data only <b>·</b> No production systems connected</span></footer>
      </div>
    </main>
  </div>;
}

function StagedNotice({ section, onReturn }: { section: string; onReturn: () => void }) {
  return <section className="staged-state panel"><div className="staged-symbol"><AlertTriangle size={22} /></div><p className="eyebrow">Not connected in this demo</p><h2>{section}</h2><p>This workspace slice currently includes overview, discovery and assets, dependency exploration, and migration-wave snapshots. {section} needs a defined backend contract before its data or actions can be shown accurately.</p><button className="primary-button" onClick={onReturn}>Return to overview <ChevronDown className="rotate-left" size={15} /></button></section>;
}

export default App;
