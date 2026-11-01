export type TargetModel =
  | 'gemini-flash-lite'
  | 'gemini-3-8-flash'
  | 'gemini-4-argon'
  | 'gemini-3-1-image'
  | 'chatgpt-4o'
  | 'claude-3-7-sonnet'
  | 'deepseek'
  | 'llama'
  | 'qwen'
  | 'manus'
  | 'deepseek-r1'
  | 'manus-agent'
  | 'llama-3-3'
  | 'qwen-2-5'
  | 'claude'
  | 'gpt'
  | 'gemini'
  | 'midjourney';

export type DetailLevel = 'short' | 'medium' | 'detailed';
export type DeliveryMode = 'prompt_only' | 'result_only' | 'both';
export type ToneType = 'formal' | 'creative' | 'technical' | 'friendly' | 'academic';

export type PromptCategory =
  | 'auto'
  | 'image'
  | 'video'
  | 'music'
  | 'research'
  | 'code'
  | 'marketing'
  | 'education'
  | 'student'
  | 'business'
  | 'health'
  | 'general';

export type OutputLanguage = 'ar' | 'darija' | 'en' | 'fr';

export type ExecutionType = DeliveryMode | 'prompt';

export interface PromptOptions {
  target?: TargetModel | string;
  detail?: DetailLevel;
  delivery?: DeliveryMode;
  language?: string;
  tone?: string;
}

export interface PromptResultData {
  idea: string;
  category: PromptCategory;
  categoryLabel: string;
  categoryIcon: string;
  language: OutputLanguage;
  execution: ExecutionType;
  delivery?: DeliveryMode;
  detail?: DetailLevel;
  tone?: string;
  model: TargetModel;
  modelUrl?: string;
  modelDirectName?: string;
  title: string;
  targetModelsLabel: string;
  notice: string;
  prompt: string;
  promptCode: string;
  executionResult?: string;
  assumptions?: string[];
  tips?: string[];
  metadata?: {
    engine: string;
    version: string;
    timestamp: string;
    branded: boolean;
    executed: boolean;
  };
}

export interface ArabiPromptEngineOptions {
  language?: OutputLanguage | 'ar' | 'en' | 'fr' | 'darija' | string;
  execute?: boolean;
  brand?: boolean;
  model?: TargetModel;
  target?: TargetModel | string;
  detail?: DetailLevel;
  delivery?: DeliveryMode;
  tone?: string;
  domain?: PromptCategory;
  category?: PromptCategory;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  model?: string;
  promptData?: PromptResultData;
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  avatar: string;
}

