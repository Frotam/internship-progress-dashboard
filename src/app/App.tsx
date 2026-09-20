import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  Menu,
  Moon,
  Plus,
  Pencil,
  RotateCcw,
  Search,
  Sun,
  Trash2,
  X,
} from 'lucide-react'
import { internshipData } from '../data/normalize'
import type { Chapter, Confidence, InternshipData, Phase, Project, Update, WorkItem, WorkStatus } from '../types'

const STORAGE_KEY = 'sidhant-work-arc-data-v1'
const THEME_KEY = 'work-arc-theme'
const HISTORY_KEY = 'work-arc-push-history-v1'
const chapterItems: Array<{ id: Chapter; label: string }> = [
  { id: 'current-state', label: 'Current state' },
  { id: 'progression', label: 'Progression' },
  { id: 'projects', label: 'Projects' },
  { id: 'work', label: 'Work' },
  { id: 'evidence', label: 'Evidence' },
]

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const validChapters = new Set(chapterItems.map((item) => item.id))

function parseLocation() {
  const [rawChapter, query = ''] = window.location.hash.replace(/^#/, '').split('?')
  const chapter = validChapters.has(rawChapter as Chapter) ? rawChapter as Chapter : 'current-state'
  const params = new URLSearchParams(query)
  return { chapter, phase: params.get('phase') || undefined, project: params.get('project') || undefined }
}

function loadData(): InternshipData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return clone(internshipData)
    const parsed = JSON.parse(stored) as Partial<InternshipData>
    const storedUpdates = Array.isArray(parsed.updates) ? parsed.updates : []
    const storedWorkItems = Array.isArray(parsed.workItems) ? parsed.workItems : []
    return {
      ...clone(internshipData),
      ...parsed,
      summary: {
        ...internshipData.summary,
        ...parsed.summary,
        metrics: {
          completed: { ...internshipData.summary.metrics.completed, ...(parsed.summary?.metrics?.completed || {}) },
          inProgress: { ...internshipData.summary.metrics.inProgress, ...(parsed.summary?.metrics?.inProgress || {}) },
          total: { ...internshipData.summary.metrics.total, ...(parsed.summary?.metrics?.total || {}) },
          mergeRequests: { ...internshipData.summary.metrics.mergeRequests, ...(parsed.summary?.metrics?.mergeRequests || {}) },
          ...parsed.summary?.metrics,
        },
      },
      updates: internshipData.updates.map((seedUpdate) => {
        const storedUpdate = storedUpdates.find((item) => item.id === seedUpdate.id) as Partial<Update> & { workedOn?: string[]; challenges?: string[]; next?: string[] } | undefined
        if (!storedUpdate) return seedUpdate
        return {
          ...seedUpdate,
          ...storedUpdate,
          advanced: storedUpdate.advanced || storedUpdate.workedOn || seedUpdate.advanced,
          delivered: storedUpdate.delivered || seedUpdate.delivered,
          learned: storedUpdate.learned || seedUpdate.learned,
          stillOpen: storedUpdate.stillOpen || [...(storedUpdate.challenges || []), ...(storedUpdate.next || [])] || seedUpdate.stillOpen,
        }
      }),
      workItems: internshipData.workItems.map((seedWork) => ({
        ...seedWork,
        ...(storedWorkItems.find((item) => item.id === seedWork.id) || {}),
      })),
    }
  } catch {
    return clone(internshipData)
  }
}

function saveDownload(data: InternshipData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'internship.json'
  anchor.click()
  URL.revokeObjectURL(url)
}

function pushDataSnapshot(data: InternshipData) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as Array<{ pushedAt: string; data: InternshipData; delta?: { completed: number; inProgress: number; total: number } }>
  const previous = history[history.length - 1]?.data
  const currentCounts = workCounts(data)
  const previousCounts = previous ? workCounts(previous) : currentCounts
  history.push({
    pushedAt: new Date().toISOString(),
    data: clone(data),
    delta: {
      completed: currentCounts.completed - previousCounts.completed,
      inProgress: currentCounts.inProgress - previousCounts.inProgress,
      total: currentCounts.total - previousCounts.total,
    },
  })
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

function workCounts(data: InternshipData) {
  return {
    total: data.workItems.length,
    completed: data.workItems.filter((item) => item.status === 'completed').length,
    inProgress: data.workItems.filter((item) => item.status === 'in-progress').length,
  }
}

function lastPushedCounts() {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as Array<{ data?: InternshipData }>
    const latest = history[history.length - 1]?.data
    return latest ? workCounts(latest) : null
  } catch {
    return null
  }
}

function lastPushedDelta() {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as Array<{ delta?: { completed: number; inProgress: number; total: number } }>
    return history[history.length - 1]?.delta || null
  } catch {
    return null
  }
}

function scrollToChapter(id: string) {
  const element = document.getElementById(id)
  if (!element) return
  const top = element.getBoundingClientRect().top + window.scrollY - 92
  window.scrollTo({ top, behavior: 'smooth' })
}

function scrollToElement(id: string) {
  const element = document.getElementById(id)
  if (!element) return
  const top = element.getBoundingClientRect().top + window.scrollY - 104
  window.scrollTo({ top, behavior: 'smooth' })
}

function statusLabel(status: WorkStatus) {
  return status.replace('-', ' ')
}

function StatusLabel({ status }: { status: WorkStatus }) {
  return <span className={`status-label status-${status}`}><span />{statusLabel(status)}</span>
}

function ConfidenceLabel({ confidence }: { confidence: Confidence }) {
  return <span className={`confidence confidence-${confidence}`}>{confidence}</span>
}

function MetaLine({ children }: { children: ReactNode }) {
  return <span className="meta-line">{children}</span>
}

function SectionMarker({ index, eyebrow, title, children }: { index: string; eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="section-marker">
    <span className="section-index">{index}</span>
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
    {children}
  </div>
}

function StoryIndex({ active, onNavigate, onEdit, theme, onToggleTheme }: { active: Chapter; onNavigate: (chapter: Chapter) => void; onEdit: () => void; theme: 'dark' | 'light'; onToggleTheme: () => void }) {
  const [open, setOpen] = useState(false)
  return <header className="story-header">
    <a className="wordmark" href="#current-state" onClick={(event) => { event.preventDefault(); onNavigate('current-state') }}>
      <span className="wordmark-mark">WA</span>
      <span><strong>The Work Arc</strong><small>Engineering progress / 2026</small></span>
    </a>
    <button className="mobile-index-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Open story index">
      {open ? <X size={18} /> : <Menu size={18} />}
    </button>
    <nav className={open ? 'story-nav is-open' : 'story-nav'} aria-label="Story index">
      {chapterItems.map((item, index) => <button key={item.id} className={active === item.id ? 'is-active' : ''} onClick={() => { onNavigate(item.id); setOpen(false) }}>
        <span>{String(index + 1).padStart(2, '0')}</span>{item.label}
      </button>)}
    </nav>
    <div className="header-actions"><button className="theme-trigger" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button><button className="edit-trigger" onClick={onEdit}><Pencil size={15} /> Edit</button></div>
  </header>
}

function ResponsibilityArc({ phases, selectedId, onSelect, compact = false }: { phases: Phase[]; selectedId: string; onSelect: (phase: Phase) => void; compact?: boolean }) {
  return <div className={compact ? 'arc arc-compact' : 'arc'} role="tablist" aria-label="Responsibility progression">
    <div className="arc-line" />
    {phases.map((phase, index) => <button key={phase.id} className={`arc-node ${selectedId === phase.id ? 'is-selected' : ''} ${phase.current ? 'is-current' : ''}`} onClick={() => onSelect(phase)} role="tab" aria-selected={selectedId === phase.id}>
      <span className="arc-dot"><i /></span>
      <span className="arc-number">{String(index + 1).padStart(2, '0')}</span>
      <strong>{phase.label}</strong>
      {!compact && <small>{phase.period}</small>}
    </button>)}
  </div>
}

function CurrentFocus({ data, onEdit }: { data: InternshipData; onEdit: () => void }) {
  return <section className="focus-panel">
    <div className="panel-head"><div><span className="eyebrow">Now</span><h3>Current focus</h3></div><button className="text-button" onClick={onEdit}><Pencil size={14} /> Update</button></div>
    <div className="focus-list">
      {data.currentFocus.length ? data.currentFocus.map((focus) => <div className="focus-row" key={focus.projectId}>
        <span className="focus-rule" />
        <div><strong>{focus.title}</strong><p>{focus.detail || 'Current detail not yet added.'}</p><div className="tag-line">{focus.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
        <ConfidenceLabel confidence={focus.confidence} />
      </div>) : <EmptyState title="Current focus not yet added" detail="Open edit mode to describe what is happening now." />}
    </div>
  </section>
}

function BriefingMetrics({ data }: { data: InternshipData }) {
  const metricsSource = data.summary.metrics
  const currentCounts = workCounts(data)
  const pushedCounts = lastPushedCounts()
  const pushedDelta = lastPushedDelta()
  const liveChange = (key: 'completed' | 'inProgress' | 'total') => pushedCounts ? currentCounts[key] - pushedCounts[key] : null
  const metrics = [
    { value: metricsSource.completed.value, label: 'Completed work', metric: metricsSource.completed, liveKey: 'completed' as const },
    { value: metricsSource.inProgress.value, label: 'In progress', metric: metricsSource.inProgress, liveKey: 'inProgress' as const },
    { value: metricsSource.total.value, label: 'Total work items', metric: metricsSource.total, liveKey: 'total' as const },
    { value: metricsSource.mergeRequests.value, label: 'Merge requests', metric: metricsSource.mergeRequests, liveKey: null },
  ] as const
  return <section className="briefing-metrics" aria-label="Progress summary">{metrics.map((metric) => { const confidence = metric.metric.confidence; const change = metric.liveKey && pushedDelta ? pushedDelta[metric.liveKey] : metric.liveKey && pushedCounts ? liveChange(metric.liveKey) : null; return <div className="briefing-metric" key={metric.label}><strong>{metric.value === null ? '—' : metric.value}</strong><span>{metric.label}</span><small className={`metric-${confidence}`}>{confidence}</small>{change !== null && <em className="metric-change">{change >= 0 ? '+' : ''}{change} since last push</em>}</div> })}</section>
}

function TrafficLight({ active }: { active: WorkStatus }) {
  const color = active === 'completed' ? 'green' : ['in-progress', 'testing'].includes(active) ? 'amber' : 'red'
  return <div className="traffic-light" aria-label={`Current work signal: ${color}`} title={`Current work signal: ${color}`}><span className={color === 'red' ? 'is-active' : ''} /><span className={color === 'amber' ? 'is-active' : ''} /><span className={color === 'green' ? 'is-active' : ''} /></div>
}

function CurrentWork({ data, onEdit }: { data: InternshipData; onEdit: () => void }) {
  const activeWork = data.workItems.filter((item) => ['in-progress', 'testing', 'support', 'investigation'].includes(item.status)).slice(0, 6)
  return <section className="current-work"><div className="panel-head"><div><span className="eyebrow">Attention now</span><h3>Current work</h3></div><div className="current-work-actions"><TrafficLight active={activeWork[0]?.status || 'unknown'} /><button className="text-button" onClick={onEdit}><Pencil size={14} /> Update status</button></div></div><div className="current-work-head"><span>Project</span><span>Work</span><span>Status</span><span>Evidence</span></div>{activeWork.length ? activeWork.map((item) => <div className="current-work-row" key={item.id}><strong>{item.project}</strong><div><span className="work-key">{item.id}</span><span>{item.title}</span></div><div><StatusLabel status={item.status} /><ConfidenceLabel confidence={item.confidence} /></div><span className="work-evidence">{item.jiraUrl || item.mrUrl ? 'Linked' : 'Not recorded'}</span></div>) : <EmptyState title="Current work not yet confirmed" detail="Work statuses are still estimated in the source data. Update them in authoring mode when confirmed." />}</section>
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="empty-state"><span className="empty-mark">—</span><div><strong>{title}</strong><p>{detail}</p></div></div>
}

function DeltaReport({ update, onSelect }: { update: Update | undefined; onSelect: (lane: string) => void }) {
  if (!update) return <EmptyState title="Update details not yet added" detail="Open edit mode to record the next manager-ready delta." />
  const lanes = [
    ['Advanced', update.advanced, 'advanced'],
    ['Delivered', update.delivered, 'delivered'],
    ['Learned', update.learned, 'learned'],
    ['Still open', update.stillOpen, 'open'],
  ] as const
  return <div className="delta-report">
    <div className="delta-summary"><div><span className="eyebrow">{update.period}</span><h3>{update.date}</h3></div><ConfidenceLabel confidence={update.confidence} /></div>
    <p className="delta-intro">{update.summary || 'Update details not yet added.'}</p>
    <div className="delta-lanes">{lanes.map(([label, items, key]) => <button className={`delta-lane lane-${key}`} key={label} onClick={() => onSelect(key)}>
      <span className="lane-label">{label}<b>{items.length}</b></span>
      {items.length ? <ul>{items.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul> : <p>Nothing added yet.</p>}
      <ArrowRight size={15} />
    </button>)}</div>
  </div>
}

function PhaseDetail({ phase, data, onProject, onWork }: { phase: Phase; data: InternshipData; onProject: (id: string) => void; onWork: (id?: string) => void }) {
  const projects = data.projects.filter((project) => phase.projectIds.includes(project.id))
  const work = data.workItems.filter((item) => phase.workIds.includes(item.id))
  const learnings = data.learnings.filter((item) => phase.learningIds.includes(item.id))
  return <div className="phase-detail" key={phase.id}>
    <div className="phase-copy"><MetaLine>{phase.period} / {phase.phase}</MetaLine><h3>{phase.title}</h3><p>{phase.description || 'Current phase details are intentionally editable and have not been added yet.'}</p><div className="tag-line">{phase.labels.map((label) => <span key={label}>{label}</span>)}</div></div>
    <div className="phase-context"><div><span className="context-label">Projects</span>{projects.map((project) => <button className="context-link" key={project.id} onClick={() => onProject(project.id)}>{project.name}<ArrowRight size={14} /></button>)}</div><div><span className="context-label">Learning</span>{learnings.length ? learnings.map((learning) => <span className="context-muted" key={learning.id}>{learning.topic}</span>) : <span className="context-muted">No learning linked yet.</span>}</div><div><span className="context-label">Work</span>{work.length ? work.slice(0, 3).map((item) => <button className="context-link" key={item.id} onClick={() => onWork(item.id)}>{item.id}<ArrowRight size={14} /></button>) : <button className="context-link" onClick={() => onWork()}>{phase.id === 'current' ? 'View current ledger' : 'Browse related work'}<ArrowRight size={14} /></button>}</div></div>
  </div>
}

function CurrentState({ data, selectedPhase, onSelectPhase, onNavigate, onEdit }: { data: InternshipData; selectedPhase: Phase; onSelectPhase: (phase: Phase) => void; onNavigate: (chapter: Chapter) => void; onEdit: () => void }) {
  const latest = data.updates.find((update) => update.isLatest) || data.updates[0]
  const selectDelta = (lane: string) => {
    const phaseId = lane === 'learned' ? 'explore' : lane === 'delivered' ? 'deliver' : lane === 'open' ? 'current' : 'support'
    const phase = data.phases.find((item) => item.id === phaseId)
    if (!phase) return
    onSelectPhase(phase)
    window.setTimeout(() => scrollToElement('work-evolution'), 80)
  }
  return <section id="current-state" className="chapter chapter-current">
    <div className="briefing-header"><div><MetaLine>{data.profile.company} / {data.profile.team}</MetaLine><h1>Progress briefing.</h1></div><div className="briefing-meta"><span>{data.profile.name} · {data.profile.role}</span><span>Started {data.profile.startDate}</span><span>Updated {data.profile.lastUpdated}</span></div></div>
    <div className="briefing-focus"><div className="briefing-focus-heading"><div><span className="eyebrow">Current focus</span><h2>What is requiring attention now</h2></div><button className="text-button" onClick={onEdit}><Pencil size={14} /> Edit focus</button></div><CurrentFocus data={data} onEdit={onEdit} /></div>
    <BriefingMetrics data={data} />
    <section className="delta-panel briefing-delta"><div className="panel-head"><div><span className="eyebrow">Since your last update</span><h2>What changed</h2></div><button className="text-button" onClick={() => onNavigate('work')}>View work context <ArrowRight size={14} /></button></div><DeltaReport update={latest} onSelect={selectDelta} /></section>
    <CurrentWork data={data} onEdit={onEdit} />
    <div className="arc-block" id="work-evolution"><div className="arc-heading"><div><span className="eyebrow">How the work evolved</span><h2>From learning existing systems to broader engineering work</h2><p className="arc-explanation">How my work expanded across feature development, backend work, testing, delivery, AI workflows, and support.</p></div><MetaLine>{data.phases.length} phases / interactive</MetaLine></div><ResponsibilityArc phases={data.phases} selectedId={selectedPhase.id} onSelect={onSelectPhase} /><PhaseDetail phase={selectedPhase} data={data} onProject={(id) => { onNavigate('projects'); window.setTimeout(() => document.getElementById(`project-${id}`)?.focus(), 250) }} onWork={(id) => { onNavigate('work'); if (id) window.setTimeout(() => document.getElementById(`work-${id}`)?.focus(), 250) }} /></div>
  </section>
}

function ProgressionChapter({ data, selectedPhase, onSelectPhase, onProject, onWork }: { data: InternshipData; selectedPhase: Phase; onSelectPhase: (phase: Phase) => void; onProject: (id: string) => void; onWork: (id?: string) => void }) {
  return <section id="progression" className="chapter chapter-progression"><SectionMarker index="01" eyebrow="Progression" title="The work changed shape as responsibility expanded."><MetaLine>Selected: {selectedPhase.label}</MetaLine></SectionMarker><div className="progression-stage"><ResponsibilityArc phases={data.phases} selectedId={selectedPhase.id} onSelect={onSelectPhase} /><PhaseDetail phase={selectedPhase} data={data} onProject={onProject} onWork={onWork} /></div></section>
}

function ProjectDossier({ project, data, onWork }: { project: Project; data: InternshipData; onWork: (id?: string) => void }) {
  const relatedWork = data.workItems.filter((item) => item.projectId === project.id)
  const phaseNames = data.phases.filter((phase) => phase.projectIds.includes(project.id)).map((phase) => phase.label)
  return <article id={`project-${project.id}`} className="dossier" tabIndex={-1}>
    <div className="dossier-index"><span>{project.id === 'service-tag-validator' ? '01' : project.id === 'mhub' ? '02' : '03'}</span><ConfidenceLabel confidence={project.confidence} /></div>
    <div className="dossier-main"><div className="dossier-heading"><div><MetaLine>{phaseNames.join(' / ')}</MetaLine><h3>{project.name}</h3></div><div className="tag-line">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div><p className="dossier-description">{project.description}</p><div className="dossier-columns"><div><span className="context-label">Contributions</span><ul className="clean-list">{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span className="context-label">Learning</span><ul className="clean-list">{project.keyLearnings.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span className="context-label">Current status</span><p className="dossier-note">{project.currentStatus || 'Current status not yet confirmed.'}</p><ConfidenceLabel confidence={project.confidence} /></div></div>{project.workstreams.length > 0 && <div className="workstream-row"><span className="context-label">Sally workstreams</span>{project.workstreams.map((workstream) => <div key={workstream.name}><strong>{workstream.name}</strong><p>{workstream.description || 'Workstream details not yet added.'}</p></div>)}</div>}<div className="dossier-footer"><span>{relatedWork.length} related work items</span><button className="text-button" onClick={() => onWork(relatedWork[0]?.id)}>Open work ledger <ArrowRight size={14} /></button></div></div>
  </article>
}

function ProjectsChapter({ data, selectedProject, setSelectedProject, onWork }: { data: InternshipData; selectedProject: string; setSelectedProject: (id: string) => void; onWork: (id?: string) => void }) {
  const project = data.projects.find((item) => item.id === selectedProject) || data.projects[0]
  return <section id="projects" className="chapter chapter-projects"><SectionMarker index="02" eyebrow="Projects" title="Three places where the arc became concrete." /><div className="project-switcher" role="tablist" aria-label="Projects">{data.projects.map((item) => <button key={item.id} className={item.id === project.id ? 'is-active' : ''} onClick={() => setSelectedProject(item.id)} role="tab" aria-selected={item.id === project.id}><span>{item.id === 'service-tag-validator' ? '01' : item.id === 'mhub' ? '02' : '03'}</span>{item.name}</button>)}</div><ProjectDossier project={project} data={data} onWork={onWork} /></section>
}

function WorkLedger({ data, onEdit }: { data: InternshipData; onEdit: (work?: WorkItem) => void }) {
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('all')
  const [status, setStatus] = useState('all')
  const [confidence, setConfidence] = useState('all')
  const visible = useMemo(() => data.workItems.filter((item) => {
    const haystack = `${item.id} ${item.title} ${item.project} ${item.type || ''}`.toLowerCase()
    return haystack.includes(query.toLowerCase()) && (project === 'all' || item.projectId === project) && (status === 'all' || item.status === status) && (confidence === 'all' || item.confidence === confidence)
  }), [data.workItems, query, project, status, confidence])
  return <section id="work" className="chapter chapter-work"><SectionMarker index="03" eyebrow="Work ledger" title="The work, with uncertainty left visible."><MetaLine>{visible.length} of {data.workItems.length} items</MetaLine></SectionMarker><div className="ledger-toolbar"><label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Jira key or work" aria-label="Search work" /></label><select value={project} onChange={(event) => setProject(event.target.value)} aria-label="Filter by project"><option value="all">All projects</option>{data.projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="all">All statuses</option>{['completed', 'in-progress', 'planned', 'support', 'testing', 'unknown'].map((item) => <option key={item} value={item}>{statusLabel(item as WorkStatus)}</option>)}</select><select value={confidence} onChange={(event) => setConfidence(event.target.value)} aria-label="Filter by confidence"><option value="all">All confidence</option><option value="confirmed">Confirmed</option><option value="estimated">Estimated</option><option value="unknown">Unknown</option></select></div><div className="ledger-list">{visible.length ? visible.map((item) => <article className="ledger-row" id={`work-${item.id}`} tabIndex={-1} key={item.id}><div className="ledger-key"><span>{item.id}</span>{item.jiraUrl ? <a href={item.jiraUrl} target="_blank" rel="noreferrer" aria-label={`Open ${item.id}`}><ExternalLink size={13} /></a> : <span className="unavailable">No link</span>}</div><div className="ledger-title"><strong>{item.title}</strong><small>{item.project} · {item.type || 'Type not added'}</small></div><StatusLabel status={item.status} /><ConfidenceLabel confidence={item.confidence} /><span className="ledger-points">{item.storyPoints === null ? '—' : `${item.storyPoints}${item.storyPointsIsEstimate ? ' est.' : ''}`}</span>{onEdit && <button className="row-edit" onClick={() => onEdit(item)} aria-label={`Edit ${item.id}`}><Pencil size={14} /></button>}</article>) : <EmptyState title="No work matches these filters" detail="Try another project, status, confidence, or search term." />}</div></section>
}

function EvidenceChapter({ data, onEdit }: { data: InternshipData; onEdit: () => void }) {
  return <section id="evidence" className="chapter chapter-evidence"><SectionMarker index="04" eyebrow="Evidence" title="A place for the work to become inspectable."><MetaLine>{data.artifacts.length} artifact{data.artifacts.length === 1 ? '' : 's'}</MetaLine></SectionMarker><div className="evidence-intro"><p>Artifacts can be attached to projects, phases, or work items as they become available. The index stays honest when evidence has not yet been added.</p><button className="outline-button" onClick={onEdit}><Pencil size={14} /> Add evidence</button></div><div className="evidence-list">{data.artifacts.map((artifact) => <article className="evidence-row" key={artifact.id}><FileText size={18} /><div><span className="context-label">{artifact.type}</span><h3>{artifact.title}</h3><p>{artifact.description || 'Description not yet added.'}</p></div>{artifact.url ? <a className="text-button" href={artifact.url} target="_blank" rel="noreferrer">Open <ExternalLink size={14} /></a> : <span className="unavailable">Link not added</span>}</article>)}{!data.artifacts.length && <EmptyState title="No evidence added yet" detail="Use edit mode when a demo, diagram, screenshot, or safe internal link is ready." />}</div></section>
}

function EditPanel({ data, onSave, onClose, onPush, onExport = onPush, onReset }: { data: InternshipData; onSave: (data: InternshipData) => void; onClose: () => void; onPush: () => void; onExport?: () => void; onReset: () => void }) {
  const latest = data.updates.find((item) => item.isLatest) || data.updates[0]
  const [draft, setDraft] = useState(() => clone(data))
  const [newStory, setNewStory] = useState({ id: '', title: '', projectId: 'service-tag-validator', status: 'unknown' as WorkStatus, storyPoints: '' })
  const draftLatest = draft.updates.find((item) => item.isLatest) || draft.updates[0]
  const updateLatest = (field: keyof Update, value: string) => setDraft((current) => ({ ...current, updates: current.updates.map((item) => item.id === draftLatest?.id ? { ...item, [field]: value.split('\n').filter((line) => line.trim().length > 0) } : item) }))
  const updateWorkItem = (id: string, field: 'status' | 'storyPoints', value: string) => setDraft((current) => ({ ...current, workItems: current.workItems.map((item) => item.id === id ? { ...item, [field]: field === 'storyPoints' ? (value === '' ? null : Number(value)) : value as WorkStatus, confidence: 'estimated', storyPointsIsEstimate: field === 'storyPoints' ? true : item.storyPointsIsEstimate } : item) }))
  const updateMetricDelta = (key: keyof InternshipData['summary']['metrics'], value: string) => setDraft((current) => ({ ...current, summary: { ...current.summary, metrics: { ...current.summary.metrics, [key]: { ...current.summary.metrics[key], changeSinceLastUpdate: value === '' ? null : Number(value) } } } }))
  const removeWorkItem = (id: string) => setDraft((current) => ({ ...current, workItems: current.workItems.filter((item) => item.id !== id) }))
  const addWorkItem = () => {
    const project = draft.projects.find((item) => item.id === newStory.projectId)
    if (!newStory.id.trim() || !newStory.title.trim() || !project) return
    setDraft((current) => ({ ...current, workItems: [...current.workItems, { id: newStory.id.trim(), title: newStory.title.trim(), project: project.name, projectId: project.id, type: 'Development', status: newStory.status, confidence: 'estimated', storyPoints: newStory.storyPoints === '' ? null : Number(newStory.storyPoints), storyPointsIsEstimate: true, date: null, jiraUrl: null, mrUrl: null, notes: 'Added locally; confirm details.', phaseId: 'current' }] }))
    setNewStory({ id: '', title: '', projectId: 'service-tag-validator', status: 'unknown', storyPoints: '' })
  }
  return <div className="edit-backdrop" role="dialog" aria-modal="true" aria-label="Edit Work Arc content"><aside className="edit-panel"><div className="edit-head"><div><span className="eyebrow">Authoring mode</span><h2>Update the arc</h2></div><button className="icon-button" onClick={onClose} aria-label="Close edit mode"><X size={18} /></button></div><p className="edit-note">Changes stay in this browser until exported. Empty fields remain intentionally unknown in the visitor view.</p><div className="edit-scroll"><fieldset><legend>Progress numbers</legend>{([['completed', 'Completed work'], ['inProgress', 'In-progress work'], ['total', 'Total work items'], ['mergeRequests', 'Merge requests']] as const).map(([key, label]) => <label className="edit-field" key={key}><span>{label} / number</span><input type="number" min="0" value={draft.summary.metrics[key].value ?? ''} placeholder="Not recorded" onChange={(event) => setDraft((current) => ({ ...current, summary: { ...current.summary, metrics: { ...current.summary.metrics, [key]: { ...current.summary.metrics[key], value: event.target.value === '' ? null : Number(event.target.value), confidence: 'estimated' } } } }))} /></label>)}</fieldset><fieldset><legend>Current focus</legend>{draft.currentFocus.map((focus, index) => <label className="edit-field" key={focus.projectId}><span>{focus.title} / detail</span><input value={focus.detail || ''} placeholder="Current detail not yet added" onChange={(event) => setDraft((current) => ({ ...current, currentFocus: current.currentFocus.map((item, itemIndex) => itemIndex === index ? { ...item, detail: event.target.value || null } : item) }))} /></label>)}</fieldset>{draftLatest && <fieldset><legend>Latest delta report</legend><label className="edit-field"><span>Summary</span><textarea value={draftLatest.summary || ''} placeholder="Update details not yet added" onChange={(event) => setDraft((current) => ({ ...current, updates: current.updates.map((item) => item.id === draftLatest.id ? { ...item, summary: event.target.value || null } : item) }))} /></label>{(['advanced', 'delivered', 'learned', 'stillOpen'] as Array<keyof Update>).map((field) => <label className="edit-field" key={field}><span>{field === 'stillOpen' ? 'Still open' : field[0].toUpperCase() + field.slice(1)}</span><textarea value={Array.isArray(draftLatest[field]) ? (draftLatest[field] as string[]).join('\n') : ''} onChange={(event) => updateLatest(field, event.target.value)} /></label>)}</fieldset>}<fieldset><legend>Story points and statuses</legend>{draft.workItems.map((item) => <div className="edit-work-row" key={item.id}><span>{item.id}</span><input type="number" min="0" value={item.storyPoints ?? ''} placeholder="Points" aria-label={`${item.id} story points`} onChange={(event) => updateWorkItem(item.id, 'storyPoints', event.target.value)} /><select value={item.status} aria-label={`${item.id} status`} onChange={(event) => updateWorkItem(item.id, 'status', event.target.value)}>{['unknown', 'assigned', 'in-progress', 'completed', 'blocked', 'planned', 'support', 'investigation', 'testing'].map((status) => <option key={status} value={status}>{statusLabel(status as WorkStatus)}</option>)}</select></div>)}</fieldset><fieldset><legend>Project notes</legend>{draft.projects.map((project) => <label className="edit-field" key={project.id}><span>{project.name}</span><textarea value={project.notes || ''} placeholder="Notes not yet added" onChange={(event) => setDraft((current) => ({ ...current, projects: current.projects.map((item) => item.id === project.id ? { ...item, notes: event.target.value || null } : item) }))} /></label>)}</fieldset></div><div className="edit-actions"><button className="quiet-button" onClick={onReset}><RotateCcw size={14} /> Reset</button><button className="quiet-button" onClick={onExport}><ArrowDownToLine size={14} /> Export JSON</button><button className="save-button" onClick={() => { onSave(draft); onClose() }}><Check size={15} /> Save changes</button></div></aside></div>
}

export default function App() {
  const [data, setData] = useState<InternshipData>(loadData)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem(THEME_KEY)
    return stored === 'light' ? 'light' : 'dark'
  })
  const [location, setLocation] = useState(parseLocation)
  const [selectedPhaseId, setSelectedPhaseId] = useState(location.phase || 'current')
  const [selectedProjectId, setSelectedProjectId] = useState(location.project || 'service-tag-validator')
  const [editing, setEditing] = useState(false)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }, [data])
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(THEME_KEY, theme) }, [theme])
  useEffect(() => { const update = () => setLocation(parseLocation()); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])
  useEffect(() => { if (location.phase && data.phases.some((phase) => phase.id === location.phase)) setSelectedPhaseId(location.phase); if (location.project && data.projects.some((project) => project.id === location.project)) setSelectedProjectId(location.project) }, [location, data.phases, data.projects])

  const selectedPhase = data.phases.find((phase) => phase.id === selectedPhaseId) || data.phases[data.phases.length - 1]
  const navigate = (chapter: Chapter, params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString()
    window.history.pushState({}, '', `#${chapter}${query ? `?${query}` : ''}`)
    setLocation({ chapter, phase: params.phase, project: params.project })
    window.setTimeout(() => scrollToChapter(chapter), 10)
  }
  const selectPhase = (phase: Phase) => { setSelectedPhaseId(phase.id); window.history.replaceState({}, '', `#progression?phase=${phase.id}`) }
  const reset = () => { if (window.confirm('Reset browser-local edits and return to canonical data?')) { localStorage.removeItem(STORAGE_KEY); setData(clone(internshipData)); setEditing(false) } }
  const pushData = () => { pushDataSnapshot(data); setData(clone(data)); window.alert('Data pushed to local history.') }

  return <div className={`app-shell theme-${theme}`}><StoryIndex active={location.chapter} onNavigate={navigate} onEdit={() => setEditing(true)} theme={theme} onToggleTheme={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} /><main><CurrentState data={data} selectedPhase={selectedPhase} onSelectPhase={selectPhase} onNavigate={navigate} onEdit={() => setEditing(true)} /><ProgressionChapter data={data} selectedPhase={selectedPhase} onSelectPhase={selectPhase} onProject={(id) => { setSelectedProjectId(id); navigate('projects', { project: id }) }} onWork={(id) => navigate('work', id ? { phase: selectedPhase.id } : {})} /><ProjectsChapter data={data} selectedProject={selectedProjectId} setSelectedProject={(id) => { setSelectedProjectId(id); window.history.replaceState({}, '', `#projects?project=${id}`) }} onWork={(id) => navigate('work', id ? { project: selectedProjectId } : {})} /><WorkLedger data={data} onEdit={() => setEditing(true)} /><EvidenceChapter data={data} onEdit={() => setEditing(true)} /></main><footer><span>{data.profile.name} / {data.profile.team}</span><span>Local source · {data.profile.lastUpdated}</span></footer>{editing && <EditPanel data={data} onSave={setData} onClose={() => setEditing(false)} onPush={pushData} onReset={reset} />}</div>
}
