import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/manrope'
import '@fontsource/jetbrains-mono/500.css'
import {
  ArrowDownToLine, ArrowUpRight, BriefcaseBusiness, Check, ChevronDown,
  CircleAlert, Code2, ExternalLink, FileText, FolderKanban, GraduationCap,
  LayoutDashboard, Menu, Pencil, RotateCcw, Search, Sparkles, X
} from 'lucide-react'
import seedData from './data/internship.json'
import './styles.css'

const STORAGE_KEY = 'sidhant-internship-dashboard-data-v1'
const STATUS_OPTIONS = ['Active', 'Contributing', 'Exploring', 'Testing', 'Support', 'Completed', 'In Progress', 'Planned']
const STORY_STATUSES = ['Completed', 'In Progress', 'Planned', 'Support', 'Testing']
const navItems = [
  ['overview', 'Overview'], ['projects', 'Projects'], ['work', 'Work Delivered'],
  ['timeline', 'Timeline'], ['learning', 'Learning'], ['updates', 'Updates']
]

function readLocalData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || seedData } catch { return seedData }
}
function clone(value) { return JSON.parse(JSON.stringify(value)) }
function statusClass(status = '') { return `status ${status.toLowerCase().replaceAll(' ', '-')}` }
function downloadData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = 'internship.json'; anchor.click()
  URL.revokeObjectURL(url)
}

function StatusBadge({ status }) { return <span className={statusClass(status)}><i />{status}</span> }
function SectionTitle({ eyebrow, title, action }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action}</div>
}
function Tag({ children }) { return <span className="tag">{children}</span> }
function MiniIcon({ type }) {
  const Icon = type === 'project' ? FolderKanban : type === 'learn' ? GraduationCap : type === 'work' ? BriefcaseBusiness : Sparkles
  return <span className="mini-icon"><Icon size={15} /></span>
}

function Intro({ onDone }) {
  return <div className="intro" aria-live="polite">
    <div className="intro-mark"><span /><span /><span /></div>
    <p>Hey, I’m Sidhant.</p><h1>Here’s what I’ve been working on.</h1>
    <button onClick={onDone}>Enter dashboard <ArrowUpRight size={15} /></button>
  </div>
}

function Header({ profile, active, setActive, editMode, setEditMode, showIntro }) {
  const [open, setOpen] = useState(false)
  return <header className="topbar">
    <button className="brand" onClick={() => setActive('overview')} aria-label="Go to overview"><span className="brand-mark"><b /></span><span>{profile.name}<small>{profile.role} · {profile.team}</small></span></button>
    <nav className={open ? 'open' : ''} aria-label="Main navigation">{navItems.map(([key, label]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => { setActive(key); setOpen(false) }}>{label}</button>)}</nav>
    <div className="header-actions"><button className="icon-button" onClick={showIntro} title="Show introduction" aria-label="Show introduction"><Sparkles size={16} /></button><button className={editMode ? 'edit-toggle enabled' : 'edit-toggle'} onClick={() => setEditMode(!editMode)}><Pencil size={14} /> {editMode ? 'Editing' : 'Edit'}</button><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button></div>
  </header>
}

function Metrics({ data }) {
  const points = data.stories.reduce((total, story) => total + (Number(story.storyPoints) || 0), 0)
  return <div className="metrics"><article className="metric-card"><MiniIcon type="project" /><strong>{data.projects.length}</strong><span>Active projects</span></article><article className="metric-card"><MiniIcon type="work" /><strong>{data.stories.length}</strong><span>{data.summary.assignedItemsLabel}</span></article><article className="metric-card"><MiniIcon type="learn" /><strong>~{points}</strong><span>Story points <em>estimated</em></span></article><article className="metric-card wide"><MiniIcon type="spark" /><p>Working across product development, testing, CI/CD and AI-agent workflows.</p><span className="metric-foot">Manager view · updated from local data</span></article></div>
}

function FocusCards({ data, onNavigate }) {
  return <div className="focus-grid">{data.currentFocus.map((item, index) => {
    const project = data.projects.find(p => p.id === item.projectId)
    return <button className="focus-card" data-accent={project?.accent} onClick={() => onNavigate('projects')} key={item.projectId}>
      <div className="card-top"><span className="sequence">0{index + 1}</span><StatusBadge status={project?.status || 'Active'} /></div>
      <h3>{item.title}</h3><p>{item.detail}</p><div className="tags">{item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div><span className="card-arrow"><ArrowUpRight size={17} /></span>
    </button>
  })}</div>
}

function UpdateCard({ update, compact = false, editMode, onEdit }) {
  const [expanded, setExpanded] = useState(compact)
  const chunks = [['Delivered', update.delivered], ['Worked on', update.workedOn], ['Learned', update.learned], ['Next', update.next]]
  return <article className={`update-card ${update.isLatest ? 'latest' : ''}`}>
    <div className="update-heading"><div><div className="date-line">{update.isLatest && <span className="latest-label">Latest update</span>}<span>{update.period}</span></div><h3>{update.date}</h3></div><div className="action-row">{editMode && <button className="quiet-button" onClick={onEdit}><Pencil size={14} /> Edit</button>}<button className="chevron" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><ChevronDown size={18} /></button></div></div>
    <p className="update-summary">{update.summary}</p>
    {expanded && <div className="update-content">{chunks.map(([heading, values]) => <div className="update-column" key={heading}><strong>{heading}</strong><ul>{values.map((value, i) => <li key={i}>{value}</li>)}</ul></div>)}{update.challenges?.some(Boolean) && <div className="update-column challenges"><strong>Challenges</strong><ul>{update.challenges.map((value, i) => <li key={i}>{value}</li>)}</ul></div>}</div>}
  </article>
}

function Overview({ data, onNavigate, editMode, startEdit }) {
  const latest = data.updates.find(item => item.isLatest) || data.updates[0]
  return <main className="page overview-page">
    <section className="hero"><div className="hero-grid" /><div className="hero-signal" aria-hidden="true"><span className="signal-core" /><i className="orbit orbit-one"><b /></i><i className="orbit orbit-two"><b /></i><i className="orbit orbit-three"><b /></i><em>LIVE / 2026</em></div><span className="eyebrow">{data.summary.eyebrow}</span><div className="hero-title"><h1>{data.profile.name}<span className="dot">.</span></h1><div><p>{data.profile.role} <span>·</span> {data.profile.team}</p><strong>{data.profile.progressLabel}</strong></div></div><p className="at-a-glance">{data.summary.atAGlance}</p></section>
    <Metrics data={data} />
    <section><SectionTitle eyebrow="Current focus" title="What I’m working on now" action={editMode && <button className="quiet-button" onClick={() => startEdit('focus')}><Pencil size={14} /> Edit focus</button>} /><FocusCards data={data} onNavigate={onNavigate} /></section>
    <section className="two-col"><div><SectionTitle eyebrow="What’s new" title="Progress since the last update" action={<button className="text-link" onClick={() => onNavigate('updates')}>All updates <ArrowUpRight size={15} /></button>} /><UpdateCard update={latest} compact editMode={editMode} onEdit={() => startEdit('update', latest.id)} /></div><div className="overview-side"><SectionTitle eyebrow="Recent work" title="Jira at a glance" action={<button className="text-link" onClick={() => onNavigate('work')}>View all <ArrowUpRight size={15} /></button>} /><div className="story-stack">{data.stories.slice(0, 5).map(story => <div className="story-line" key={story.id}><span className="story-key">{story.id}</span><span className="story-title">{story.title}</span><StatusBadge status={story.status} /></div>)}</div></div></section>
    <section><SectionTitle eyebrow="Internship journey" title="How the work has evolved" action={<button className="text-link" onClick={() => onNavigate('timeline')}>View timeline <ArrowUpRight size={15} /></button>} /><TimelineStrip timeline={data.timeline} /></section>
    <section className="overview-bottom"><LearningPreview data={data} onNavigate={onNavigate} /><Artifacts data={data} /> </section>
  </main>
}

function TimelineStrip({ timeline }) { return <div className="timeline-strip">{timeline.map((item, index) => <div className="timeline-stop" key={item.period}><div className="timeline-rail"><i />{index < timeline.length - 1 && <b />}</div><span>{item.period}</span><strong>{item.phase}</strong><p>{item.title}</p></div>)}</div> }
function LearningPreview({ data, onNavigate }) { return <div className="learning-preview"><SectionTitle eyebrow="Learning in context" title="What I’m building fluency in" action={<button className="text-link" onClick={() => onNavigate('learning')}>Details <ArrowUpRight size={15} /></button>} /><div className="technology-cloud">{data.skills.map(skill => <Tag key={skill}>{skill}</Tag>)}</div><p>Learning is shown as applied context—not a percentage score.</p></div> }
function Artifacts({ data }) { return <div className="artifacts-preview"><SectionTitle eyebrow="Evidence" title="Artifacts" /><div className="artifact-list">{data.artifacts.map(artifact => <div className="artifact-row" key={artifact.id}><FileText size={17} /><div><strong>{artifact.title}</strong><small>{artifact.url ? artifact.type : artifact.placeholder || 'No artifact added yet'}</small></div>{artifact.url && <a href={artifact.url} target="_blank" rel="noreferrer" aria-label={`Open ${artifact.title}`}><ExternalLink size={15} /></a>}</div>)}</div></div> }

function Projects({ data, editMode, startEdit }) { return <main className="page"><PageIntro eyebrow="Projects" title="Work in motion" text="A qualitative view of the three project areas — without invented completion percentages." /> <div className="project-list">{data.projects.map((project, idx) => <ProjectCard key={project.id} project={project} index={idx} editMode={editMode} onEdit={() => startEdit('project', project.id)} />)}</div></main> }
function ProjectCard({ project, index, editMode, onEdit }) { return <article className="project-card" data-accent={project.accent}><div className="project-index">0{index + 1}</div><div className="project-main"><div className="project-title-row"><div><h2>{project.name}</h2><div className="tags">{project.technologies.map(t => <Tag key={t}>{t}</Tag>)}</div></div><div className="project-actions"><StatusBadge status={project.status} />{editMode && <button className="quiet-button" onClick={onEdit}><Pencil size={14} /> Edit</button>}</div></div><p className="project-description">{project.description}</p><div className="project-detail-grid"><InfoBlock title="My contributions" values={project.contributions} /><InfoBlock title="Current status" values={[project.currentStatus]} /><InfoBlock title="Key learnings" values={project.keyLearnings} /></div>{project.workstreams && <div className="workstreams"><span className="overline">Sally workstreams</span>{project.workstreams.map(w => <div key={w.name}><strong>{w.name}</strong><p>{w.description}</p></div>)}</div>}<div className="project-notes"><span>Notes</span><p>{project.notes || 'No notes added yet.'}</p></div></div></article> }
function InfoBlock({ title, values }) { return <div className="info-block"><h4>{title}</h4><ul>{values.map((v, i) => <li key={i}>{v}</li>)}</ul></div> }
function PageIntro({ eyebrow, title, text, children }) { return <section className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p>{children}</section> }

function WorkDelivered({ data, editMode, startEdit }) {
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('All')
  const filters = ['All', 'Service Tag Validator', 'mHub', 'Sally', 'Completed', 'In Progress', 'Bug / Defect', 'Development', 'CI/CD', 'Testing']
  const stories = useMemo(() => data.stories.filter(story => `${story.id} ${story.title} ${story.project} ${story.type} ${story.status}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || story.project === filter || story.status === filter || story.type === filter)), [data.stories, query, filter])
  return <main className="page"><PageIntro eyebrow="Work delivered" title="Jira work, in context" text="Statuses and story points are deliberately editable sample data until confirmed." /><div className="work-toolbar"><label className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Jira ID or work item" /></label><span>{stories.length} items shown</span></div><div className="filter-row">{filters.map(item => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="table-wrap"><table><thead><tr><th>Jira ID</th><th>Title</th><th>Project</th><th>Type</th><th>Status</th><th>Points</th><th>Date</th>{editMode && <th />}</tr></thead><tbody>{stories.map(story => <tr key={story.id}><td>{story.jiraUrl ? <a className="jira-link" href={story.jiraUrl} target="_blank" rel="noreferrer">{story.id} <ArrowUpRight size={12} /></a> : story.id}</td><td className="story-cell"><strong>{story.title}</strong>{story.notes && <small>{story.notes}</small>}{story.mrUrl && <a href={story.mrUrl} target="_blank" rel="noreferrer">View Merge Request ↗</a>}</td><td>{story.project}</td><td><span className="type-label">{story.type}</span></td><td><StatusBadge status={story.status} /></td><td><span className="points">{story.storyPoints}<em>est.</em></span></td><td className="muted">{story.date}</td>{editMode && <td><button className="table-edit" onClick={() => startEdit('story', story.id)} aria-label={`Edit ${story.id}`}><Pencil size={14} /></button></td>}</tr>)}</tbody></table></div></main>
}

function Timeline({ data, editMode, startEdit }) { return <main className="page"><PageIntro eyebrow="Timeline" title="Internship journey" text="A record of the work changing from learning, to building, testing, support and new workflow exploration." /> <div className="timeline-list">{data.timeline.map((item, idx) => <article className="timeline-item" key={item.period}><div className="timeline-marker"><span>{idx + 1}</span></div><div className="timeline-copy"><div className="timeline-item-top"><span className="period">{item.period}</span>{editMode && <button className="quiet-button" onClick={() => startEdit('timeline', idx)}><Pencil size={14} /> Edit</button>}</div><h2>{item.title}</h2><p>{item.description}</p><div className="tags">{item.labels.map(l => <Tag key={l}>{l}</Tag>)}</div></div><strong className="phase">{item.phase}</strong></article>)}</div></main> }
function Learning({ data, editMode, startEdit }) { return <main className="page"><PageIntro eyebrow="Learning" title="What I’m learning" text="Progress captured through where knowledge is being applied, rather than arbitrary proficiency scores." /><div className="learning-grid">{data.learnings.map(item => <article className="learning-card" key={item.id}><div><MiniIcon type="learn" /><span>{item.period}</span></div><h2>{item.topic}</h2><dl><div><dt>What I’m learning</dt><dd>{item.what}</dd></div><div><dt>Applied in</dt><dd>{item.applied}</dd></div><div><dt>Current context</dt><dd>{item.confidence}</dd></div></dl>{editMode && <button className="quiet-button" onClick={() => startEdit('learning', item.id)}><Pencil size={14} /> Edit</button>}</article>)}</div></main> }
function Updates({ data, editMode, startEdit }) { return <main className="page"><PageIntro eyebrow="Updates" title="What’s new?" text="A manager-friendly running log. Newest update stays on top so changes are easy to scan." /><div className="updates-list">{data.updates.map(update => <UpdateCard key={update.id} update={update} editMode={editMode} onEdit={() => startEdit('update', update.id)} />)}</div></main> }

function Editor({ data, editState, onClose, onSave }) {
  const { kind, id } = editState || {}; const [draft, setDraft] = useState(null)
  useEffect(() => {
    if (!kind) return
    let value
    if (kind === 'project') value = data.projects.find(p => p.id === id)
    if (kind === 'story') value = data.stories.find(s => s.id === id)
    if (kind === 'update') value = data.updates.find(u => u.id === id)
    if (kind === 'learning') value = data.learnings.find(l => l.id === id)
    if (kind === 'timeline') value = data.timeline[id]
    if (kind === 'focus') value = { currentFocus: data.currentFocus, atAGlance: data.summary.atAGlance }
    setDraft(clone(value))
  }, [kind, id, data])
  if (!kind || !draft) return null
  const set = (field, value) => setDraft(current => ({ ...current, [field]: value }))
  const list = (field) => (draft[field] || []).join('\n')
  const listSet = (field, value) => set(field, value.split('\n').filter(Boolean))
  const title = kind === 'focus' ? 'Edit current focus' : `Edit ${kind}`
  const submit = e => { e.preventDefault(); onSave(kind, id, draft); onClose() }
  return <div className="editor-backdrop" role="dialog" aria-modal="true" aria-label={title}><form className="editor" onSubmit={submit}><div className="editor-head"><div><span className="eyebrow">Edit mode</span><h2>{title}</h2></div><button type="button" className="icon-button" onClick={onClose}><X size={18} /></button></div><p className="editor-notice">Edits are stored in this browser only. Export to update the canonical <code>internship.json</code> source manually.</p><div className="editor-fields">{kind === 'project' && <><Field label="Project" value={draft.name} onChange={v => set('name', v)} /><Select label="Status" value={draft.status} options={STATUS_OPTIONS} onChange={v => set('status', v)} /><TextArea label="Description" value={draft.description} onChange={v => set('description', v)} /><TextArea label="Current status" value={draft.currentStatus} onChange={v => set('currentStatus', v)} /><TextArea label="Contributions — one per line" value={list('contributions')} onChange={v => listSet('contributions', v)} /><TextArea label="Notes" value={draft.notes} onChange={v => set('notes', v)} /></>}{kind === 'story' && <><Field label="Jira ID" value={draft.id} onChange={v => set('id', v)} /><Field label="Title" value={draft.title} onChange={v => set('title', v)} /><Select label="Status" value={draft.status} options={STORY_STATUSES} onChange={v => set('status', v)} /><Field label="Story points" type="number" value={draft.storyPoints} onChange={v => set('storyPoints', Number(v))} /><Field label="Date" value={draft.date} onChange={v => set('date', v)} /><Field label="Jira URL" value={draft.jiraUrl} onChange={v => set('jiraUrl', v)} /><Field label="MR URL" value={draft.mrUrl} onChange={v => set('mrUrl', v)} /><TextArea label="Notes" value={draft.notes} onChange={v => set('notes', v)} /></>}{kind === 'update' && <><Field label="Date" value={draft.date} onChange={v => set('date', v)} /><Field label="Period" value={draft.period} onChange={v => set('period', v)} /><TextArea label="Summary" value={draft.summary} onChange={v => set('summary', v)} />{['delivered','workedOn','learned','challenges','next'].map(field => <TextArea key={field} label={`${field[0].toUpperCase() + field.slice(1)} — one per line`} value={list(field)} onChange={v => listSet(field, v)} />)}</>}{kind === 'learning' && <><Field label="Topic" value={draft.topic} onChange={v => set('topic', v)} /><TextArea label="What I learned" value={draft.what} onChange={v => set('what', v)} /><TextArea label="Where I applied it" value={draft.applied} onChange={v => set('applied', v)} /><Field label="Confidence / context" value={draft.confidence} onChange={v => set('confidence', v)} /><Field label="Date / period" value={draft.period} onChange={v => set('period', v)} /></>}{kind === 'timeline' && <><Field label="Period" value={draft.period} onChange={v => set('period', v)} /><Field label="Phase" value={draft.phase} onChange={v => set('phase', v)} /><Field label="Title" value={draft.title} onChange={v => set('title', v)} /><TextArea label="Description" value={draft.description} onChange={v => set('description', v)} /><TextArea label="Labels — one per line" value={list('labels')} onChange={v => listSet('labels', v)} /></>}{kind === 'focus' && <><TextArea label="At-a-glance summary" value={draft.atAGlance} onChange={v => set('atAGlance', v)} />{draft.currentFocus.map((item, idx) => <div className="focus-edit" key={item.projectId}><strong>{item.title}</strong><Field label="Current focus" value={item.detail} onChange={v => set('currentFocus', draft.currentFocus.map((x, i) => i === idx ? { ...x, detail: v } : x))} /><TextArea label="Tags — one per line" value={item.tags.join('\n')} onChange={v => set('currentFocus', draft.currentFocus.map((x, i) => i === idx ? { ...x, tags: v.split('\n').filter(Boolean) } : x))} /></div>)}</>}</div><div className="editor-footer"><button type="button" className="quiet-button" onClick={onClose}>Cancel</button><button className="save-button" type="submit"><Check size={15} /> Save changes</button></div></form></div>
}
function Field({ label, value, onChange, type = 'text' }) { return <label className="field"><span>{label}</span><input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} /></label> }
function Select({ label, value, options, onChange }) { return <label className="field"><span>{label}</span><select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></label> }
function TextArea({ label, value, onChange }) { return <label className="field"><span>{label}</span><textarea value={value ?? ''} onChange={e => onChange(e.target.value)} /></label> }

function Footer({ data, editMode, setEditMode, exportData, resetData }) { return <footer><div><strong>{data.profile.name}</strong><span> · {data.profile.team} · {data.profile.role}</span><small>Internship Progress Dashboard · Started {data.profile.startDate}</small></div><div className="footer-actions"><span>Last updated: {data.profile.lastUpdated}</span><button onClick={() => setEditMode(!editMode)}><Pencil size={13} /> {editMode ? 'Editing' : 'Edit mode'}</button><button onClick={exportData}><ArrowDownToLine size={13} /> Export data</button><button onClick={resetData}><RotateCcw size={13} /> Reset changes</button></div></footer> }

function App() {
  const [data, setData] = useState(readLocalData); const [active, setActive] = useState('overview'); const [editMode, setEditMode] = useState(false); const [intro, setIntro] = useState(true); const [editState, setEditState] = useState(null)
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }, [data])
  useEffect(() => { const timer = window.setTimeout(() => setIntro(false), 1500); return () => clearTimeout(timer) }, [])
  const saveEdit = (kind, id, draft) => setData(current => { const next = clone(current); if (kind === 'project') next.projects = next.projects.map(p => p.id === id ? draft : p); if (kind === 'story') next.stories = next.stories.map(s => s.id === id ? draft : s); if (kind === 'update') next.updates = next.updates.map(u => u.id === id ? draft : u); if (kind === 'learning') next.learnings = next.learnings.map(l => l.id === id ? draft : l); if (kind === 'timeline') next.timeline[id] = draft; if (kind === 'focus') { next.currentFocus = draft.currentFocus; next.summary.atAGlance = draft.atAGlance } return next })
  const reset = () => { if (window.confirm('Reset browser-local edits and return to the original JSON data?')) { localStorage.removeItem(STORAGE_KEY); setData(clone(seedData)) } }
  const go = section => { setActive(section); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const common = { data, editMode, startEdit: (kind, id) => setEditState({ kind, id }) }
  const page = active === 'overview' ? <Overview {...common} onNavigate={go} /> : active === 'projects' ? <Projects {...common} /> : active === 'work' ? <WorkDelivered {...common} /> : active === 'timeline' ? <Timeline {...common} /> : active === 'learning' ? <Learning {...common} /> : <Updates {...common} />
  return <>{intro && <Intro onDone={() => setIntro(false)} />}<Header profile={data.profile} active={active} setActive={go} editMode={editMode} setEditMode={setEditMode} showIntro={() => setIntro(true)} />{page}<Footer data={data} editMode={editMode} setEditMode={setEditMode} exportData={() => downloadData(data)} resetData={reset} /><Editor data={data} editState={editState} onClose={() => setEditState(null)} onSave={saveEdit} /></>
}

createRoot(document.getElementById('root')).render(<App />)
