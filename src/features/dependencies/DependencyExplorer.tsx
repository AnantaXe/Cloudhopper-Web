import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CircleAlert, GitBranch, List } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge, statusTone } from '../../components/StatusBadge';
import { useDependencyGraph } from '../../hooks/use-migration-data';
import type { Asset, AssetKind, Dependency } from '../../types/domain';

interface DependencyExplorerProps {
  focusAssetId?: string;
  onClearFocus: () => void;
  onOpenAsset: (asset: Asset) => void;
}

export function DependencyExplorer({ focusAssetId, onClearFocus, onOpenAsset }: DependencyExplorerProps) {
  const query = useDependencyGraph();
  const [selectedId, setSelectedId] = useState<string | null>(focusAssetId ?? null);
  const [kindFilter, setKindFilter] = useState('All types');
  const [showList, setShowList] = useState(false);

  const graph = query.data;
  const visibleAssets = useMemo(() => (graph?.assets ?? []).filter((asset) => kindFilter === 'All types' || asset.kind === kindFilter), [graph?.assets, kindFilter]);
  const visibleIds = new Set(visibleAssets.map((asset) => asset.id));
  const visibleRelationships = (graph?.relationships ?? []).filter((edge) => visibleIds.has(edge.sourceId) && visibleIds.has(edge.targetId));
  const activeId = selectedId ?? focusAssetId;
  const selectedAsset = graph?.assets.find((asset) => asset.id === activeId);
  const relatedIds = new Set(visibleRelationships.filter((edge) => edge.sourceId === activeId || edge.targetId === activeId).flatMap((edge) => [edge.sourceId, edge.targetId]));

  const nodes = useMemo<Node[]>(() => visibleAssets.map((asset, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const isEmphasized = !activeId || relatedIds.has(asset.id);
    return { id: asset.id, position: { x: column * 235 + 28, y: row * 150 + 34 }, data: { label: <div className="graph-node-content"><span>{asset.kind.toUpperCase()}</span><strong>{asset.name}</strong><small>{asset.provider} · {asset.environment}</small></div> }, className: `graph-node ${asset.kind.toLowerCase().replaceAll(' ', '-')} ${asset.risk.toLowerCase()} ${activeId === asset.id ? 'graph-node-selected' : ''} ${isEmphasized ? '' : 'graph-node-dimmed'}`, style: { width: 190, borderColor: activeId === asset.id ? '#25846c' : undefined } };
  }), [visibleAssets, activeId, relatedIds]);

  const edges = useMemo<Edge[]>(() => visibleRelationships.map((edge) => ({ id: edge.id, source: edge.sourceId, target: edge.targetId, label: edge.relationship, animated: edge.critical, className: `${edge.critical ? 'critical-edge' : ''} ${activeId && (edge.sourceId === activeId || edge.targetId === activeId) ? 'edge-highlighted' : ''}`, markerEnd: { type: 'arrowclosed', color: edge.critical ? '#bd624c' : '#85938f' }, style: { stroke: edge.critical ? '#bd624c' : '#9ba7a3', strokeWidth: activeId && (edge.sourceId === activeId || edge.targetId === activeId) ? 2.4 : 1.5 }, labelStyle: { fill: '#53645e', fontSize: 10, fontWeight: 600 } })), [visibleRelationships, activeId]);

  if (query.isLoading) return <div className="page-state" role="status">Loading dependency relationships…</div>;
  if (query.isError || !graph) return <div className="page-state error-state" role="alert"><CircleAlert size={18} /> Dependency graph could not be loaded. <button className="text-button" onClick={() => void query.refetch()}>Retry</button></div>;

  return <div className="page-stack">
    {focusAssetId && <div className="focus-notice">Focused on one asset from the inventory. <button className="text-button" onClick={() => { setSelectedId(null); onClearFocus(); }}>Clear focus</button></div>}
    <section className="panel graph-panel"><div className="graph-toolbar"><div><p className="eyebrow">Relationship topology · demo graph</p><h2>Service dependencies</h2></div><div className="graph-controls"><label className="sr-only" htmlFor="graph-kind-filter">Filter graph by asset type</label><select id="graph-kind-filter" value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}><option>All types</option>{(['Application', 'Virtual machine', 'Database', 'Container', 'Storage', 'Network'] satisfies AssetKind[]).map((kind) => <option key={kind}>{kind}</option>)}</select><div className="view-toggle" role="group" aria-label="Graph view"><button className={!showList ? 'active' : ''} aria-pressed={!showList} aria-label="Graph view" onClick={() => setShowList(false)}><GitBranch size={15} /></button><button className={showList ? 'active' : ''} aria-pressed={showList} aria-label="Relationship list" onClick={() => setShowList(true)}><List size={15} /></button></div></div></div>
      {!showList ? <div className="flow-canvas" aria-label="Interactive service dependency graph"><ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.18 }} minZoom={0.25} maxZoom={1.7} onNodeClick={(_, node) => setSelectedId(node.id)} nodesConnectable={false} proOptions={{ hideAttribution: true }}><Background color="#dbe1de" gap={22} size={1} /><Controls showInteractive={false} /><MiniMap pannable zoomable nodeStrokeWidth={3} /></ReactFlow></div> : <div className="relationship-list"><table><thead><tr><th scope="col">Source</th><th scope="col">Relationship</th><th scope="col">Target</th><th scope="col">Path</th></tr></thead><tbody>{visibleRelationships.map((edge) => <RelationshipRow key={edge.id} edge={edge} assets={visibleAssets} onOpenAsset={onOpenAsset} />)}{visibleRelationships.length === 0 && <tr><td colSpan={4} className="empty-cell">No relationships match this type filter.</td></tr>}</tbody></table></div>}
      <div className="graph-legend"><span><i className="legend-dot critical-dot" />Critical relationship</span><span><i className="legend-dot" />Dependency</span><span>{visibleAssets.length} assets · {visibleRelationships.length} relationships</span></div>
    </section>
    <section className="graph-detail-grid"><article className="panel graph-selection"><p className="eyebrow">Selected resource</p>{selectedAsset ? <><div className="selected-resource-title"><h2>{selectedAsset.name}</h2><StatusBadge tone={statusTone(selectedAsset.risk)}>{selectedAsset.risk} risk</StatusBadge></div><p>{selectedAsset.kind} · {selectedAsset.provider} · {selectedAsset.environment}</p><div className="related-summary">{visibleRelationships.filter((edge) => edge.sourceId === selectedAsset.id || edge.targetId === selectedAsset.id).length} visible direct relationships</div><button className="quiet-button" onClick={() => onOpenAsset(selectedAsset)}>Open asset details <span aria-hidden="true">→</span></button></> : <p>Select a node to inspect its direct relationships.</p>}</article><article className="panel graph-explanation"><div className="explanation-icon"><CircleAlert size={17} /></div><div><h3>Relationship evidence</h3><p>The current mock contract includes relationship type and critical-path indication only. Direction and criticality are illustrative; source evidence is not available in this demo.</p></div></article></section>
  </div>;
}

function RelationshipRow({ edge, assets, onOpenAsset }: { edge: Dependency; assets: Asset[]; onOpenAsset: (asset: Asset) => void }) {
  const source = assets.find((asset) => asset.id === edge.sourceId);
  const target = assets.find((asset) => asset.id === edge.targetId);
  if (!source || !target) return null;
  return <tr><td><button className="table-link" onClick={() => onOpenAsset(source)}>{source.name}</button></td><td>{edge.relationship}</td><td><button className="table-link" onClick={() => onOpenAsset(target)}>{target.name}</button></td><td><StatusBadge tone={edge.critical ? 'danger' : 'neutral'}>{edge.critical ? 'Critical path' : 'Standard'}</StatusBadge></td></tr>;
}
