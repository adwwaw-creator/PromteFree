/**
 * ArabiPromptEngine — محرك هندسة البرومبتات العربي فائق الدقة
 * Enterprise Client-Side Meta-Prompt Engineering Engine
 * 
 * Usage example requested by user:
 * ```typescript
 * const result = ArabiPromptEngine.generate(userIdea, {
 *   language: "ar",
 *   execute: true,
 *   brand: true
 * });
 * 
 * const finalPrompt = result.prompt;
 * ```
 */

import { ArabiPromptEngine, generateMetaPrompt, detectLanguage, inferCategory } from './promptGenerator';
import { buildPrompt, sanitizeIdea } from './buildPrompt';
import type {
  TargetModel,
  PromptCategory,
  OutputLanguage,
  ExecutionType,
  DetailLevel,
  DeliveryMode,
  PromptResultData,
  ArabiPromptEngineOptions,
} from '../types';

export {
  ArabiPromptEngine,
  generateMetaPrompt,
  detectLanguage,
  inferCategory,
  buildPrompt,
  sanitizeIdea,
};

export type {
  TargetModel,
  PromptCategory,
  OutputLanguage,
  ExecutionType,
  DetailLevel,
  DeliveryMode,
  PromptResultData,
  ArabiPromptEngineOptions,
};

export default ArabiPromptEngine;
