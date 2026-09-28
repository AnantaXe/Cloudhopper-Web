import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, CircleAlert, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusBadge, statusTone } from '../../components/StatusBadge';
import { useAssets } from '../../hooks/use-migration-data';
import type { Asset, AssetKind, AssetStatus } from '../../types/domain';

const pageSize = 7;
const assetKinds: AssetKind[] = ['Application', 'Virtual machine', 'Database', 'Container', 'Storage', 'Network'];

interface AssetExplorerProps {
  initialSearch: string;
  environment: string;
  onEnvironmentChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onOpenDependencies: (asset: Asset) => void;
}

export function AssetExplorer({ initialSearch, environment, onEnvironmentChange, onSearchChange, onOpenDependencies }: AssetExplorerProps) {
  const query = useAssets();
  const [kindFilter, setKindFilter] = useState('All types');
  const [providerFilter, setProviderFilter] = useState('All providers');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filteredAssets = useMemo(() => {
    const assets = query.data ?? [];
    return assets.filter((asset) => {
      const needle = initialSearch.trim().toLowerCase();
      const matchesSearch = !needle || [asset.name, asset.id, asset.kind, asset.owner, ...asset.tags].some((text) => text.toLowerCase().includes(needle));
      return matchesSearch && (environment === 'All environments' || asset.environment === environment) && (kindFilter === 'All types' || asset.kind === kindFilter) && (providerFilter === 'All providers' || asset.provider === providerFilter) && (statusFilter === 'All statuses' || asset.status === statusFilter);
    }).sort((first, second) => sortDirection === 'asc' ? first.name.localeCompare(second.name) : second.name.localeCompare(first.name));
  }, [query.data, initialSearch, environment, kindFilter, providerFilter, statusFilter, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const visibleAssets = filteredAssets.slice(page * pageSize, (page + 1) * pageSize);

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(0);
  }

  return <div className="page-stack">
    <section className="inventory-toolbar panel"><label className="asset-search"><Search size={16} /><span className="sr-only">Search assets</span><input value={initialSearch} onChange={(event) => { onSearchChange(event.target.value); setPage(0); }} placeholder="Search assets, owners, tags…" /></label><label className="sr-only" htmlFor="type-filter">Filter by type</label><select id="type-filter" value={kindFilter} onChange={(event) => updateFilter(setKindFilter, event.target.value)}><option>All types</option>{assetKinds.map((kind) => <option key={kind}>{kind}</option>)}</select><label className="sr-only" htmlFor="provider-filter">Filter by provider</label><select id="provider-filter" value={providerFilter} onChange={(event) => updateFilter(setProviderFilter, event.target.value)}><option>All providers</option><option>AWS</option><option>Azure</option></select><label className="sr-only" htmlFor="status-filter">Filter by status</label><select id="status-filter" value={statusFilter} onChange={(event) => updateFilter(setStatusFilter, event.target.value)}><option>All statuses</option>{(['Discovered', 'Assessed', 'In migration', 'Blocked'] satisfies AssetStatus[]).map((status) => <option key={status}>{status}</option>)}</select></section>
    {query.isLoading ? <div className="page-state" role="status">Loading asset inventory…</div> : query.isError ? <div className="page-state error-state" role="alert"><CircleAlert size={18} /> Inventory could not be loaded. <button className="text-button" onClick={() => void query.refetch()}>Retry</button></div> : <section className="panel table-panel">
      <div className="table-heading"><div><p className="eyebrow">Inventory snapshot</p><h2>Infrastructure assets <span>{filteredAssets.length}</span></h2></div><div className="table-meta"><span>Demo data · refreshed per snapshot</span><button className="quiet-button sort-button" onClick={() => setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')}>Name {sortDirection === 'asc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}</button></div></div>
      <div className="table-scroll"><table><thead><tr><th scope="col">Asset</th><th scope="col">Type</th><th scope="col">Provider / region</th><th scope="col">Environment</th><th scope="col">Risk</th><th scope="col">Status</th><th scope="col">Links</th></tr></thead><tbody>
        {visibleAssets.map((asset) => <tr key={asset.id} className={selectedAsset?.id === asset.id ? 'selected-row' : ''} onClick={() => setSelectedAsset(asset)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedAsset(asset); } }} tabIndex={0} aria-label={`Inspect ${asset.name}`}>
          <td><div className="asset-name-cell"><span className={`asset-type-icon type-${asset.kind.toLowerCase().replaceAll(' ', '-')}`}>{asset.kind === 'Application' ? 'APP' : asset.kind === 'Database' ? 'DB' : asset.kind === 'Network' ? 'NET' : asset.kind === 'Storage' ? 'STO' : asset.kind === 'Container' ? 'CTR' : 'VM'}</span><span><strong>{asset.name}</strong><small>{asset.id}</small></span></div></td><td>{asset.kind}</td><td><strong className="provider-name">{asset.provider}</strong><small className="cell-subline">{asset.region}</small></td><td>{asset.environment}</td><td><StatusBadge tone={statusTone(asset.risk)}>{asset.risk}</StatusBadge></td><td><StatusBadge tone={statusTone(asset.status)}>{asset.status}</StatusBadge></td><td><button className="link-count" onClick={(event) => { event.stopPropagation(); onOpenDependencies(asset); }}>{asset.dependencies} <span>links</span></button></td>
        </tr>)}
        {visibleAssets.length === 0 && <tr><td className="empty-cell" colSpan={7}><div className="empty-state"><Search size={20} /><strong>No assets match these filters</strong><span>Adjust the search or clear a filter to broaden the inventory.</span><button className="text-button" onClick={() => { onSearchChange(''); onEnvironmentChange('All environments'); setKindFilter('All types'); setProviderFilter('All providers'); setStatusFilter('All statuses'); }}>Clear filters</button></div></td></tr>}
      </tbody></table></div>
      <div className="table-footer"><span>Showing {filteredAssets.length ? page * pageSize + 1 : 0}–{Math.min((page + 1) * pageSize, filteredAssets.length)} of {filteredAssets.length} assets</span><div className="pagination"><button aria-label="Previous page" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft size={16} /></button><span>Page {page + 1} of {pageCount}</span><button aria-label="Next page" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}><ChevronRight size={16} /></button></div></div>
    </section>}
    {selectedAsset && <div className="detail-backdrop" role="presentation" onClick={() => setSelectedAsset(null)}><aside className="asset-detail-panel" role="dialog" aria-modal="true" aria-labelledby="asset-detail-title" onClick={(event) => event.stopPropagation()}><div className="detail-header"><div><p className="eyebrow">Asset record · {selectedAsset.id}</p><h2 id="asset-detail-title">{selectedAsset.name}</h2></div><button className="icon-button" aria-label="Close asset details" onClick={() => setSelectedAsset(null)}><X size={17} /></button></div><div className="detail-badges"><StatusBadge tone={statusTone(selectedAsset.status)}>{selectedAsset.status}</StatusBadge><StatusBadge tone={statusTone(selectedAsset.risk)}>{selectedAsset.risk} risk</StatusBadge></div><dl className="detail-fields"><div><dt>Resource type</dt><dd>{selectedAsset.kind}</dd></div><div><dt>Provider</dt><dd>{selectedAsset.provider}</dd></div><div><dt>Environment</dt><dd>{selectedAsset.environment}</dd></div><div><dt>Region</dt><dd>{selectedAsset.region}</dd></div><div><dt>Owner</dt><dd>{selectedAsset.owner}</dd></div><div><dt>Last observed</dt><dd>{new Date(selectedAsset.updatedAt).toLocaleString()}</dd></div></dl><div className="detail-section"><h3>Tags</h3><div className="tag-list">{selectedAsset.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div><div className="detail-section"><h3>Relationships</h3><p>{selectedAsset.dependencies} linked resource{selectedAsset.dependencies === 1 ? '' : 's'} in the demo inventory.</p><button className="primary-button" onClick={() => onOpenDependencies(selectedAsset)}>Explore dependency map <ChevronRight size={15} /></button></div><div className="detail-source">Demo record. Risk evidence and assessment details are not included in the current API contract.</div></aside></div>}
  </div>;
}
