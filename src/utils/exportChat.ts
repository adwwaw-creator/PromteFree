export const exportChatToMarkdown = (messages: any[] = [], options?: any) => {
  return messages.map((m) => `### ${m.role}\n${m.content}`).join('\n\n');
};

export const exportChatToJson = (messages: any[] = [], options?: any) => {
  return JSON.stringify({ options, messages }, null, 2);
};
