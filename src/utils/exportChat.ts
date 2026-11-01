import { ChatMessage, TargetModel } from '../types';

interface ExportOptions {
  currentModel: TargetModel;
  lang: 'ar' | 'en' | 'fr';
}

/**
 * Exports chat messages as a formatted Markdown (.md) file
 */
export function exportChatToMarkdown(messages: ChatMessage[], options: ExportOptions) {
  if (!messages || messages.length === 0) return;

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const nowFormatted = new Date().toLocaleString(options.lang === 'ar' ? 'ar-SA' : options.lang === 'fr' ? 'fr-FR' : 'en-US');

  let mdContent = `# Daw AI - محادثة مُصدّرة\n\n`;
  mdContent += `**التاريخ:** ${nowFormatted}\n`;
  mdContent += `**النموذج:** ${options.currentModel}\n`;
  mdContent += `**عدد الرسائل:** ${messages.length}\n\n`;
  mdContent += `---\n\n`;

  messages.forEach((msg, idx) => {
    const roleTitle = msg.role === 'user' ? '👤 المستخدم' : '🤖 الذكاء الاصطناعي (Gemini)';
    mdContent += `### ${roleTitle} (${msg.timestamp || `#${idx + 1}`})\n\n`;

    if (msg.content) {
      mdContent += `${msg.content}\n\n`;
    }

    if (msg.promptData) {
      if (msg.promptData.title) {
        mdContent += `#### 📌 ${msg.promptData.title}\n\n`;
      }
      if (msg.promptData.promptCode) {
        mdContent += `\`\`\`text\n${msg.promptData.promptCode}\n\`\`\`\n\n`;
      } else if (msg.promptData.prompt) {
        mdContent += `\`\`\`text\n${msg.promptData.prompt}\n\`\`\`\n\n`;
      }
      if (msg.promptData.executionResult) {
        mdContent += `**النتيجة المنفذة:**\n\n${msg.promptData.executionResult}\n\n`;
      }
    }

    mdContent += `---\n\n`;
  });

  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dawai-chat-${dateStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports chat messages as a JSON (.json) file
 */
export function exportChatToJson(messages: ChatMessage[], options: ExportOptions) {
  if (!messages || messages.length === 0) return;

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const payload = {
    exportedAt: new Date().toISOString(),
    model: options.currentModel,
    language: options.lang,
    messageCount: messages.length,
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
      model: m.model,
      promptData: m.promptData || null,
    })),
  };

  const jsonContent = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dawai-chat-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
