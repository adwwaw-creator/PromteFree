export interface SourceItem {
  id: string;
  title: string;
  type: 'text' | 'file' | 'url';
  content: string;
  summary: string;
  keyTopics: string[];
  charCount: number;
  wordCount: number;
  isSelected: boolean;
  addedAt: string;
  url?: string;
  fileName?: string;
}

export interface CitationRef {
  citationId: number;
  sourceId: string;
  sourceTitle: string;
  quote: string;
  startIndex?: number;
  endIndex?: number;
}

export interface NotebookChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations: CitationRef[];
  timestamp: string;
  suggestedQuestions?: string[];
}

export interface AudioTranscriptTurn {
  id: string;
  speaker: 'host1' | 'host2';
  speakerName: string;
  text: string;
  durationSeconds: number;
  startSeconds: number;
  endSeconds: number;
}

export interface AudioOverviewData {
  id: string;
  title: string;
  summary: string;
  durationSeconds: number;
  hosts: {
    host1: string;
    host2: string;
  };
  turns: AudioTranscriptTurn[];
  generatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceId?: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
  quote?: string;
  sourceTitle?: string;
}

export interface StudyGuideData {
  id: string;
  title: string;
  overview: string;
  keyTerms: KeyTerm[];
  quizQuestions: QuizQuestion[];
  essayQuestions: string[];
  generatedAt: string;
}

export interface BriefingDocData {
  id: string;
  title: string;
  executiveSummary: string;
  keyTakeaways: string[];
  background: string;
  criticalRisks: string[];
  actionItems: string[];
  generatedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  citations: CitationRef[];
}

export interface TimelineItem {
  id: string;
  timePeriod: string;
  title: string;
  description: string;
  sourceTitle?: string;
}

export interface NotebookNote {
  id: string;
  title: string;
  content: string;
  color: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'zinc';
  isPinned: boolean;
  sourceTitle?: string;
  createdAt: string;
}

export interface Notebook {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sources: SourceItem[];
  chatMessages: NotebookChatMessage[];
  notes: NotebookNote[];
  audioOverview?: AudioOverviewData | null;
  studyGuide?: StudyGuideData | null;
  briefingDoc?: BriefingDocData | null;
  faqs?: FAQItem[] | null;
  timelines?: TimelineItem[] | null;
  createdAt: string;
  updatedAt: string;
}
