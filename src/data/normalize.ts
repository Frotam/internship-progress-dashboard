import rawData from './internship.json'
import type {
  Artifact,
  Confidence,
  FocusItem,
  InternshipData,
  Learning,
  Phase,
  Project,
  Update,
  WorkItem,
  WorkStatus,
} from '../types'

type RawRecord = Record<string, unknown>

const raw = rawData as RawRecord
const rawStories = Array.isArray(raw.stories) ? (raw.stories as RawRecord[]) : []
const rawProjects = Array.isArray(raw.projects) ? (raw.projects as RawRecord[]) : []
const rawTimeline = Array.isArray(raw.timeline) ? (raw.timeline as RawRecord[]) : []
const rawUpdates = Array.isArray(raw.updates) ? (raw.updates as RawRecord[]) : []
const rawLearnings = Array.isArray(raw.learnings) ? (raw.learnings as RawRecord[]) : []
const rawArtifacts = Array.isArray(raw.artifacts) ? (raw.artifacts as RawRecord[]) : []

const excludedWork = new Set(['DTXSEA-267', 'DTXSEA-256'])
const projectIdByName: Record<string, string> = {
  'Service Tag Validator': 'service-tag-validator',
  mHub: 'mhub',
  Sally: 'sally',
}

const cleanText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const cleaned = value.trim()
  if (!cleaned || /^\[.*\]$/.test(cleaned) || cleaned.includes('[Edit')) return null
  return cleaned
}

const cleanList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.map(cleanText).filter((item): item is string => Boolean(item))
}

const confidenceFrom = (value: unknown, fallback: Confidence = 'unknown'): Confidence => {
  if (value === 'confirmed' || value === 'estimated' || value === 'unknown') return value
  return fallback
}

const normalizeStatus = (value: unknown): WorkStatus => {
  const status = typeof value === 'string' ? value.toLowerCase() : ''
  if (status === 'completed') return 'completed'
  if (status === 'in progress') return 'in-progress'
  if (status === 'planned') return 'planned'
  if (status === 'support') return 'support'
  if (status === 'testing') return 'testing'
  if (status === 'blocked') return 'blocked'
  if (status === 'investigation') return 'investigation'
  if (status === 'assigned') return 'assigned'
  return 'unknown'
}

const isSampleRecord = (record: RawRecord) => {
  const notes = typeof record.notes === 'string' ? record.notes : ''
  return notes.toLowerCase().includes('sample')
}

const safeUrl = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim() || value.includes('example.com')) return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

const phaseIdForStory = (story: RawRecord): string => {
  const project = String(story.project || '')
  const type = String(story.type || '').toLowerCase()
  if (project === 'Sally' && type.includes('development')) return 'explore'
  if (type.includes('ci/cd')) return 'deliver'
  if (type.includes('testing')) return 'verify'
  if (type.includes('bug')) return 'support'
  if (project === 'Service Tag Validator') return 'build'
  return 'connect'
}

const rawWork = rawStories
  .filter((story) => !excludedWork.has(String(story.id)))
  .map<WorkItem>((story) => {
    const project = String(story.project || '')
    const sampled = isSampleRecord(story)
    const points = typeof story.storyPoints === 'number' && !Number.isNaN(story.storyPoints)
      ? story.storyPoints
      : null
    return {
      id: String(story.id || 'unknown'),
      title: String(story.title || 'Untitled work item'),
      project,
      projectId: projectIdByName[project] || 'unknown',
      type: cleanText(story.type),
      status: sampled ? normalizeStatus(story.status) : normalizeStatus(story.status),
      confidence: sampled ? 'estimated' : confidenceFrom(story.confidence),
      storyPoints: points,
      storyPointsIsEstimate: Boolean(story.storyPointsIsEstimate) || sampled,
      date: cleanText(story.date),
      jiraUrl: safeUrl(story.jiraUrl),
      mrUrl: safeUrl(story.mrUrl),
      notes: cleanText(story.notes),
      phaseId: phaseIdForStory(story),
    }
  })

const projects: Project[] = rawProjects.map((project) => ({
  id: String(project.id),
  name: String(project.name),
  technologies: cleanList(project.technologies),
  description: cleanText(project.description) || 'Project context has not been added yet.',
  contributions: cleanList(project.contributions),
  currentStatus: cleanText(project.currentStatus),
  keyLearnings: cleanList(project.keyLearnings),
  notes: cleanText(project.notes),
  status: 'unknown',
  confidence: 'estimated',
  workstreams: Array.isArray(project.workstreams)
    ? (project.workstreams as RawRecord[]).map((workstream) => ({
        name: String(workstream.name || 'Workstream'),
        description: cleanText(workstream.description),
      }))
    : [],
}))

const phaseSeeds: Phase[] = [
  { id: 'orient', label: 'Orient', period: 'Weeks 1–2', title: 'Learning the systems', description: 'Getting hands-on with mHub, Service Tag Validator, C#, .NET, and existing project workflows.', phase: 'Understand', labels: ['Onboarding', 'C# / .NET'], projectIds: ['mhub', 'service-tag-validator'], workIds: [], learningIds: ['dotnet'], current: false },
  { id: 'build', label: 'Build', period: 'Month 1', title: 'Building product features', description: 'Contributing to Service Tag Validator UI, deletion workflows, backend behavior, and record history.', phase: 'Feature work', labels: ['UI', 'Backend', 'API'], projectIds: ['service-tag-validator'], workIds: [], learningIds: ['angular', 'dotnet'], current: false },
  { id: 'connect', label: 'Connect', period: 'Month 1', title: 'Connecting delivery layers', description: 'Working across applications, pipelines, test cases, and the systems that support delivery.', phase: 'Integration', labels: ['CI/CD', 'Testing'], projectIds: ['mhub', 'service-tag-validator'], workIds: [], learningIds: ['cicd', 'testing'], current: false },
  { id: 'verify', label: 'Verify', period: 'Month 1–2', title: 'Testing what changed', description: 'Writing test cases, supporting UAT, investigating defects, and improving confidence in existing behavior.', phase: 'Quality', labels: ['Test cases', 'UAT', 'Coverage'], projectIds: ['mhub', 'service-tag-validator'], workIds: [], learningIds: ['testing', 'support'], current: false },
  { id: 'deliver', label: 'Deliver', period: 'Month 1–2', title: 'Supporting delivery', description: 'Working with CI/CD setup, deployment, pipeline issues, and application support.', phase: 'Delivery', labels: ['Pipelines', 'Deployment', 'Support'], projectIds: ['mhub'], workIds: [], learningIds: ['cicd', 'support'], current: false },
  { id: 'explore', label: 'Explore', period: 'Month 1–2', title: 'Exploring AI-agent workflows', description: 'Working with AI Advisor performance questions and the FRAT / PAM Agent workflow.', phase: 'AI workflows', labels: ['Python', 'Agents', 'Performance'], projectIds: ['sally'], workIds: [], learningIds: ['python', 'agents'], current: false },
  { id: 'support', label: 'Support', period: 'Month 2', title: 'Debugging in context', description: 'Building understanding through development, testing, bug fixing, and application support.', phase: 'Application support', labels: ['Debugging', 'Testing'], projectIds: ['service-tag-validator', 'mhub', 'sally'], workIds: [], learningIds: ['support'], current: false },
  { id: 'current', label: 'Current', period: 'Current period', title: 'Current focus', description: null, phase: 'Editable', labels: ['Update needed'], projectIds: ['service-tag-validator', 'mhub', 'sally'], workIds: [], learningIds: [], current: true },
]

rawWork.forEach((work) => {
  const phase = phaseSeeds.find((item) => item.id === work.phaseId)
  if (phase) phase.workIds.push(work.id)
})

const phases = phaseSeeds.map((phase) => {
  const timelineMatch = rawTimeline.find((timeline) => String(timeline.period || '').toLowerCase().includes(phase.period.toLowerCase().split(' ')[0]))
  return timelineMatch && phase.id === 'current'
    ? { ...phase, description: cleanText(timelineMatch.description) }
    : phase
})

const updates: Update[] = rawUpdates.map((update) => ({
  id: String(update.id),
  date: String(update.date || 'Date not added'),
  period: String(update.period || 'Update'),
  summary: cleanText(update.summary),
  advanced: cleanList(update.workedOn),
  delivered: cleanList(update.delivered),
  learned: cleanList(update.learned),
  stillOpen: [...cleanList(update.challenges), ...cleanList(update.next)],
  projectIds: [],
  workIds: [],
  isLatest: Boolean(update.isLatest),
  confidence: cleanText(update.summary) ? 'estimated' : 'unknown',
}))

const learnings: Learning[] = rawLearnings.map((learning) => ({
  id: String(learning.id),
  topic: String(learning.topic),
  what: cleanText(learning.what) || 'Learning context has not been added yet.',
  applied: cleanText(learning.applied) || 'Application context has not been added yet.',
  confidenceLabel: cleanText(learning.confidence) || 'Context not yet described',
  period: String(learning.period || 'Period not added'),
  confidence: 'confirmed',
}))

const artifacts: Artifact[] = rawArtifacts.map((artifact) => ({
  id: String(artifact.id),
  title: String(artifact.title),
  type: String(artifact.type || 'Artifact'),
  description: cleanText(artifact.description),
  url: safeUrl(artifact.url),
  projectIds: [],
  phaseId: null,
}))

const currentFocus: FocusItem[] = Array.isArray(raw.currentFocus)
  ? (raw.currentFocus as RawRecord[]).map((item) => ({
      projectId: String(item.projectId),
      title: String(item.title),
      detail: cleanText(item.detail),
      tags: cleanList(item.tags),
      confidence: 'estimated',
    }))
  : []

export const internshipData: InternshipData = {
  profile: raw.profile as InternshipData['profile'],
  summary: {
    ...(raw.summary as InternshipData['summary']),
    atAGlance: cleanText((raw.summary as RawRecord)?.atAGlance),
    metrics: ((raw.summary as RawRecord)?.metrics || {
      completed: { value: null, confidence: 'unknown', changeSinceLastUpdate: null },
      inProgress: { value: null, confidence: 'unknown', changeSinceLastUpdate: null },
      total: { value: null, confidence: 'unknown', changeSinceLastUpdate: null },
      mergeRequests: { value: null, confidence: 'unknown', changeSinceLastUpdate: null },
    }) as InternshipData['summary']['metrics'],
  },
  currentFocus,
  projects,
  workItems: rawWork,
  phases,
  updates,
  learnings,
  artifacts,
  skills: cleanList(raw.skills),
}
