export interface AIToolLauncher {
  id: string;
  name: string;
  nameAr: string;
  url: (prompt: string) => string;
  badgeClass: string;
  icon: string;
  isPopular?: boolean;
  category: 'chat' | 'agent' | 'search' | 'open';
}

export const FREE_AI_TOOLS: AIToolLauncher[] = [
  // 1. Manus AI
  {
    id: 'manus',
    name: 'Manus AI',
    nameAr: 'مانوس',
    url: () => 'https://manus.im/',
    badgeClass: 'bg-[#7c3aed]/20 hover:bg-[#7c3aed]/35 text-[#c084fc] border-[#7c3aed]/40',
    icon: '⚡',
    isPopular: true,
    category: 'agent',
  },
  // 2. DeepSeek
  {
    id: 'deepseek',
    name: 'DeepSeek',
    nameAr: 'ديب سيك',
    url: () => 'https://chat.deepseek.com/',
    badgeClass: 'bg-[#0066FF]/20 hover:bg-[#0066FF]/35 text-[#60a5fa] border-[#0066FF]/40',
    icon: '🐋',
    isPopular: true,
    category: 'chat',
  },
  // 3. Llama / Meta AI
  {
    id: 'llama',
    name: 'Llama (Meta AI)',
    nameAr: 'لاما',
    url: () => 'https://www.meta.ai/',
    badgeClass: 'bg-[#0081FB]/20 hover:bg-[#0081FB]/35 text-[#38bdf8] border-[#0081FB]/40',
    icon: '🦙',
    isPopular: true,
    category: 'chat',
  },
  // 4. ChatGPT
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    nameAr: 'شات جي بي تي',
    url: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`,
    badgeClass: 'bg-[#10a37f]/20 hover:bg-[#10a37f]/35 text-[#34d399] border-[#10a37f]/40',
    icon: '🤖',
    isPopular: true,
    category: 'chat',
  },
  // 5. Google Gemini
  {
    id: 'gemini',
    name: 'Gemini',
    nameAr: 'جيميني',
    url: () => 'https://gemini.google.com/app',
    badgeClass: 'bg-[#1b6ef3]/20 hover:bg-[#1b6ef3]/35 text-[#7cacf8] border-[#1b6ef3]/40',
    icon: '✨',
    isPopular: true,
    category: 'chat',
  },
  // 6. Claude
  {
    id: 'claude',
    name: 'Claude',
    nameAr: 'كلود',
    url: () => 'https://claude.ai/new',
    badgeClass: 'bg-[#d97706]/20 hover:bg-[#d97706]/35 text-[#fbbf24] border-[#d97706]/40',
    icon: '🟠',
    isPopular: true,
    category: 'chat',
  },
  // 7. Perplexity AI
  {
    id: 'perplexity',
    name: 'Perplexity',
    nameAr: 'بيربليكسيتي',
    url: (p) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p.slice(0, 450))}`,
    badgeClass: 'bg-[#0d9488]/20 hover:bg-[#0d9488]/35 text-[#2dd4bf] border-[#0d9488]/40',
    icon: '🔍',
    category: 'search',
  },
  // 8. Microsoft Copilot
  {
    id: 'copilot',
    name: 'Copilot',
    nameAr: 'كوبايلوت',
    url: () => 'https://copilot.microsoft.com/',
    badgeClass: 'bg-[#0284c7]/20 hover:bg-[#0284c7]/35 text-[#38bdf8] border-[#0284c7]/40',
    icon: '🌐',
    category: 'chat',
  },
  // 9. Mistral Le Chat
  {
    id: 'mistral',
    name: 'Mistral Le Chat',
    nameAr: 'ميسترال',
    url: () => 'https://chat.mistral.ai/',
    badgeClass: 'bg-[#ea580c]/20 hover:bg-[#ea580c]/35 text-[#fb923c] border-[#ea580c]/40',
    icon: '🔥',
    category: 'chat',
  },
  // 10. HuggingChat (Open Source Models)
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    nameAr: 'هاجينج شات',
    url: () => 'https://huggingface.co/chat/',
    badgeClass: 'bg-[#ca8a04]/20 hover:bg-[#ca8a04]/35 text-[#facc15] border-[#ca8a04]/40',
    icon: '🤗',
    category: 'open',
  },
  // 11. Groq (Ultra-fast Llama & Mixtral)
  {
    id: 'groq',
    name: 'Groq',
    nameAr: 'جروك',
    url: () => 'https://groq.com/',
    badgeClass: 'bg-[#f43f5e]/20 hover:bg-[#f43f5e]/35 text-[#fb7185] border-[#f43f5e]/40',
    icon: '⚡',
    category: 'open',
  },
  // 12. Poe AI
  {
    id: 'poe',
    name: 'Poe AI',
    nameAr: 'بو',
    url: () => 'https://poe.com/',
    badgeClass: 'bg-[#9333ea]/20 hover:bg-[#9333ea]/35 text-[#c084fc] border-[#9333ea]/40',
    icon: '💬',
    category: 'chat',
  },
  // 13. Qwen (Alibaba)
  {
    id: 'qwen',
    name: 'Qwen AI (Alibaba)',
    nameAr: 'كوين (Qwen)',
    url: () => 'https://chat.qwenlm.ai/',
    badgeClass: 'bg-[#7c3aed]/20 hover:bg-[#7c3aed]/35 text-[#c084fc] border-[#7c3aed]/40',
    icon: '🔮',
    isPopular: true,
    category: 'chat',
  },
];
