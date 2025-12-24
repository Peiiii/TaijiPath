
export enum LifePillar {
  Health = '身 (健)',
  Spirit = '心 (睿)',
  Career = '业 (成)',
  Relations = '仁 (和)'
}

export interface ReflectionEntry {
  id: string;
  date: string;
  yinContent: string; // 弱点/反思
  yangContent: string; // 优势/行动
  weaknessTags: string[]; // AI 提取的弱点标签
  strengthTags: string[]; // AI 提取的优势标签
  scores: Record<LifePillar, number>;
  aiWisdom: string;
  balanceScore: number; // 0-100 的平衡得分
}

export interface UserStats {
  level: string; // 境界：如“初入道”、“渐入佳境”、“大器初成”
  daysOfPractice: number;
  overallBalance: number;
}
