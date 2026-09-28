import { ArrowRight, Check, CircleAlert, GitCompareArrows, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge, statusTone } from '../../components/StatusBadge';
import { useArchitectureOptions, useRiskAssessments } from '../../hooks/use-migration-data';
import type { ArchitectureOption, RiskAssessment } from '../../types/domain';

export function RiskReadiness() {
  const query = useRiskAssessments();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  if (query.isLoading) return <div className="page-state" role="status">Loading assessment evidence…</div>;
  if (query.isError || !query.data) return <div className="page-state error-state" role="alert"><CircleAlert size={18} /> Assessment snapshot could not be loaded. <button className="text-button" onClick={() => void query.refetch()}>Retry</button></div>;

  const selected = query.data.find((assessment) => assessment.assetId === selectedId) ?? query.data[0];
  if (!selected) return <div className="panel empty-state"><ShieldCheck size={20} /><strong>No risk assessments available</strong><span>Assessments will appear when the service returns workload evidence.</span></div>;
  return <div className="page-stack">
    <div className="demo-notice"><CircleAlert size={15} /> Illustrative assessment records. Scores, evidence, and recommendations are sample data, not a live migration assessment.</div>
    <section className="assessment-layout">
      <div className="assessment-list panel"><div className="panel-heading"><div><p className="eyebrow">Workload assessments</p><h2>Risk & readiness</h2></div></div>{query.data.map((assessment) => <AssessmentListItem key={assessment.assetId} assessment={assessment} selected={selected.assetId === assessment.assetId} onSelect={() => setSelectedId(assessment.assetId)} />)}</div>
      <AssessmentDetails assessment={selected} />
    </section>
  </div>;
}

function AssessmentListItem({ assessment, selected, onSelect }: { assessment: RiskAssessment; selected: boolean; onSelect: () => void }) {
  return <button className={`assessment-list-item ${selected ? 'assessment-selected' : ''}`} onClick={onSelect}><span className={`readiness-ring readiness-${assessment.complianceRisk.toLowerCase()}`}>{assessment.readinessScore}</span><span className="assessment-list-copy"><strong>{assessment.assetName}</strong><small>{assessment.businessCriticality}</small><span><StatusBadge tone={statusTone(assessment.complianceRisk)}>{assessment.complianceRisk} risk</StatusBadge></span></span><ArrowRight size={14} /></button>;
}

function AssessmentDetails({ assessment }: { assessment: RiskAssessment }) {
  return <article className="panel assessment-detail"><div className="panel-heading"><div><p className="eyebrow">Assessment detail · {assessment.assetId}</p><h2>{assessment.assetName}</h2></div><span className="readiness-score"><strong>{assessment.readinessScore}</strong><small>/ 100 readiness</small></span></div>
    <div className="assessment-attributes"><div><span>Business criticality</span><strong>{assessment.businessCriticality}</strong></div><div><span>Downtime impact</span><strong>{assessment.downtimeImpact}</strong></div><div><span>Compliance risk</span><StatusBadge tone={statusTone(assessment.complianceRisk)}>{assessment.complianceRisk}</StatusBadge></div><div><span>Technical debt</span><strong>{assessment.technicalDebt}</strong></div><div><span>Compatibility</span><strong>{assessment.compatibility}</strong></div>{assessment.confidence !== undefined && <div><span>Assessment confidence</span><strong>{Math.round(assessment.confidence * 100)}% <small>sample signal</small></strong></div>}</div>
    <div className="assessment-recommendation"><div className="recommendation-mark"><ShieldCheck size={16} /></div><div><span className="eyebrow">Recommendation</span><p>{assessment.recommendation}</p></div></div>
    <div className="factor-list"><h3>Evidence and factors</h3>{assessment.factors.map((factor) => <article className="factor-row" key={factor.category}><div className="factor-score"><strong>{factor.score}</strong><span>/ 5</span></div><div className="factor-copy"><div className="factor-title"><strong>{factor.category}</strong><span className="factor-meter" aria-label={`${factor.score} out of 5`}><i style={{ width: `${factor.score * 20}%` }} /></span></div><p>{factor.explanation}</p><ul>{factor.evidence.map((evidence) => <li key={evidence}>{evidence}</li>)}</ul></div></article>)}</div>
    <p className="assessment-note">No compliance certification or target compatibility is inferred beyond the evidence shown.</p>
  </article>;
}

export function ArchitectureDesigner() {
  const query = useArchitectureOptions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  if (query.isLoading) return <div className="page-state" role="status">Loading architecture options…</div>;
  if (query.isError || !query.data) return <div className="page-state error-state" role="alert"><CircleAlert size={18} /> Architecture options could not be loaded. <button className="text-button" onClick={() => void query.refetch()}>Retry</button></div>;

  const workload = query.data[0]?.workload;
  const options = query.data.filter((option) => option.workload === workload);
  const selected = options.find((option) => option.id === selectedId) ?? options[0];
  if (!selected) return <div className="panel empty-state"><GitCompareArrows size={20} /><strong>No architecture options available</strong><span>Options will appear when the recommendation service returns alternatives.</span></div>;
  return <div className="page-stack">
    <div className="demo-notice"><CircleAlert size={15} /> Target architecture comparison is illustrative. There is no connected recommendation or export service.</div>
    <section className="panel architecture-header"><div><p className="eyebrow">Target design · {workload}</p><h2>Compare architecture options</h2><p>Review topology, migration impact, and documented tradeoffs. The sample recommendation is not an automated ranking.</p></div><span className="comparison-label"><GitCompareArrows size={15} /> {options.length} options</span></section>
    <section className="architecture-options">{options.map((option) => <ArchitectureOptionCard key={option.id} option={option} selected={selected.id === option.id} onSelect={() => setSelectedId(option.id)} />)}</section>
    <ArchitectureDiagram option={selected} />
  </div>;
}

function ArchitectureOptionCard({ option, selected, onSelect }: { option: ArchitectureOption; selected: boolean; onSelect: () => void }) {
  return <button className={`architecture-option panel ${selected ? 'architecture-option-selected' : ''}`} onClick={onSelect} aria-pressed={selected}><span className="option-topline"><span>{option.recommended && <span className="recommended-label"><Check size={12} /> Suggested in sample</span>}</span><StatusBadge tone={statusTone(option.risk)}>{option.risk} risk</StatusBadge></span><h3>{option.name}</h3><p>{option.summary}</p><div className="option-callout"><span>Migration impact</span><strong>{option.migrationImpact}</strong></div><div className="option-callout"><span>Compatibility</span><strong>{option.compatibility}</strong></div><span className="option-open">Compare details <ArrowRight size={13} /></span></button>;
}

function ArchitectureDiagram({ option }: { option: ArchitectureOption }) {
  const dimensions: Array<[string, string | undefined]> = [
    ['Network', option.topology.find((item) => item.toLowerCase().includes('network'))],
    ['Security design', option.security],
    ['IAM', option.identity],
    ['Encryption', option.encryption],
    ['Compliance controls', option.compliance],
    ['Cost considerations', option.cost],
  ];
  return <section className="panel architecture-diagram"><div className="panel-heading"><div><p className="eyebrow">Selected topology</p><h2>{option.name}</h2></div><span className="diagram-label">CONCEPTUAL · NOT TO SCALE</span></div><div className="architecture-canvas" role="img" aria-label={`Conceptual architecture: ${option.topology.join(', ')}`}><div className="arch-zone"><span>APPLICATION TIER</span><div className="arch-node arch-source"><small>SOURCE WORKLOAD</small><strong>{option.workload}</strong></div></div><span className="arch-connection" aria-hidden="true" /><div className="arch-zone"><span>TARGET SERVICES</span><div className="arch-targets">{option.topology.map((service) => <div className="arch-node" key={service}><small>TARGET COMPONENT</small><strong>{service}</strong></div>)}</div></div></div><div className="option-tradeoffs"><div><h3><Check size={14} /> Benefits</h3><ul>{option.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></div><div><h3><CircleAlert size={14} /> Considerations</h3><ul>{option.considerations.map((consideration) => <li key={consideration}>{consideration}</li>)}</ul></div></div><div className="architecture-dimensions"><h3>Design evidence</h3><dl>{dimensions.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? 'Not supplied'}</dd></div>)}</dl></div></section>;
}
