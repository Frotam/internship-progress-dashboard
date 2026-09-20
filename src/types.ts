export type Confidence = 'confirmed' | 'estimated' | 'unknown'

export type WorkStatus =
  | 'assigned'
  | 'in-progress'
  | 'completed'
  | 'blocked'
  | 'planned'
  | 'support'
  | 'investigation'
  | 'testing'
  | 'unknown'

export type Chapter = 'current-state' | 'progression' | 'projects' | 'work' | 'evidence'

export interface Profile {
  name: string
  role: string
  team: string
  company: string
  startDate: string
  progressLabel: string
  lastUpdated: string
}

export interface Summary {
  eyebrow: string
  atAGlance: string | null
  assignedItemsLabel: string
  storyPointsNote: string
  metrics: ProgressMetrics
}

export interface ProgressMetric {
  value: number | null
  confidence: Confidence
  changeSinceLastUpdate: number | null
}

export interface ProgressMetrics {
  completed: ProgressMetric
  inProgress: ProgressMetric
  total: ProgressMetric
  mergeRequests: ProgressMetric
}

export interface FocusItem {
  projectId: string
  title: string
  detail: string | null
  tags: string[]
  confidence: Confidence
}

export interface ProjectWorkstream {
  name: string
  description: string | null
}

export interface Project {
  id: string
  name: string
  technologies: string[]
  description: string
  contributions: string[]
  currentStatus: string | null
  keyLearnings: string[]
  notes: string | null
  status: WorkStatus
  confidence: Confidence
  workstreams: ProjectWorkstream[]
}

export interface WorkItem {
  id: string
  title: string
  project: string
  projectId: string
  type: string | null
  status: WorkStatus
  confidence: Confidence
  storyPoints: number | null
  storyPointsIsEstimate: boolean
  date: string | null
  jiraUrl: string | null
  mrUrl: string | null
  notes: string | null
  phaseId: string
}

export interface Phase {
  id: string
  label: string
  period: string
  title: string
  description: string | null
  phase: string
  labels: string[]
  projectIds: string[]
  workIds: string[]
  learningIds: string[]
  current: boolean
}

export interface Update {
  id: string
  date: string
  period: string
  summary: string | null
  advanced: string[]
  delivered: string[]
  learned: string[]
  stillOpen: string[]
  projectIds: string[]
  workIds: string[]
  isLatest: boolean
  confidence: Confidence
}

export interface Learning {
  id: string
  topic: string
  what: string
  applied: string
  confidenceLabel: string
  period: string
  confidence: Confidence
}

export interface Artifact {
  id: string
  title: string
  type: string
  description: string | null
  url: string | null
  projectIds: string[]
  phaseId: string | null
}

export interface InternshipData {
  profile: Profile
  summary: Summary
  currentFocus: FocusItem[]
  projects: Project[]
  workItems: WorkItem[]
  phases: Phase[]
  updates: Update[]
  learnings: Learning[]
  artifacts: Artifact[]
  skills: string[]
}
