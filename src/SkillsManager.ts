// Skill definitions
export interface Skill {
  id: string
  name: string
  description: string
  maxLevel: number
  icon: string
}

export interface SkillState {
  id: string
  currentLevel: number
}

export type SkillStateList = SkillState[]

export const SKILLS: Skill[] = [
  {
    id: 'super_suction',
    name: '超强吸力',
    description: '增大清扫范围，周围2格内垃圾自动收集',
    maxLevel: 3,
    icon: '💨',
  },
  {
    id: 'eco_mode',
    name: '节能模式',
    description: '减少电量消耗速度',
    maxLevel: 3,
    icon: '🔋',
  },
]

// Get skill points needed for a level
export function getSkillPointsForLevel(level: number): number {
  return level * 2 + 1
}

// Check if skill effect is active
export function isSkillActive(state: SkillStateList, skillId: string): boolean {
  const skill = state.find(s => s.id === skillId)
  return skill !== undefined && skill.currentLevel > 0
}

// Get skill level
export function getSkillLevel(state: SkillStateList, skillId: string): number {
  const skill = state.find(s => s.id === skillId)
  return skill?.currentLevel ?? 0
}

// Calculate effect multiplier based on skill level
export function getEffectMultiplier(skillId: string, level: number): number {
  switch (skillId) {
    case 'super_suction':
      return level * 0.5 // 0.5, 1.0, 1.5 range multiplier
    case 'eco_mode':
      return 1 - (level * 0.2) // 0.2, 0.4, 0.6 reduction
    default:
      return 0
  }
}
