import { SkillStateList, SKILLS } from './SkillsManager'

const SAVE_KEY = 'rockrush_save'

export interface SaveData {
  skillPoints: number
  skillState: SkillStateList
  currentLevel: number
  totalSkillPointsEarned: number
  highScore: number
  unlockedLevels: number
  hasPlayed: boolean
}

class GameState {
  private static instance: GameState

  skillPoints: number = 0
  skillState: SkillStateList = []
  currentLevel: number = 1
  totalSkillPointsEarned: number = 0
  highScore: number = 0
  unlockedLevels: number = 1
  hasPlayed: boolean = false

  private constructor() {
    // Initialize all skills at level 0
    SKILLS.forEach(skill => {
      this.skillState.push({
        id: skill.id,
        currentLevel: 0,
      })
    })
    this.load()
  }

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState()
    }
    return GameState.instance
  }

  save() {
    const data: SaveData = {
      skillPoints: this.skillPoints,
      skillState: this.skillState,
      currentLevel: this.currentLevel,
      totalSkillPointsEarned: this.totalSkillPointsEarned,
      highScore: this.highScore,
      unlockedLevels: this.unlockedLevels,
      hasPlayed: this.hasPlayed,
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save game:', e)
    }
  }

  load() {
    try {
      const saved = localStorage.getItem(SAVE_KEY)
      if (saved) {
        const data: SaveData = JSON.parse(saved)
        this.skillPoints = data.skillPoints ?? 0
        this.currentLevel = data.currentLevel ?? 1
        this.totalSkillPointsEarned = data.totalSkillPointsEarned ?? 0
        this.highScore = data.highScore ?? 0
        this.unlockedLevels = data.unlockedLevels ?? 1
        this.hasPlayed = data.hasPlayed ?? false

        // Load skill states if available
        if (data.skillState && Array.isArray(data.skillState)) {
          data.skillState.forEach((savedSkill: SkillStateList[0]) => {
            const existing = this.skillState.find(s => s.id === savedSkill.id)
            if (existing) {
              existing.currentLevel = savedSkill.currentLevel
            }
          })
        }
      }
    } catch (e) {
      console.warn('Failed to load game:', e)
    }
  }

  resetProgress() {
    this.currentLevel = 1
    this.skillPoints = 0
    this.totalSkillPointsEarned = 0
    this.unlockedLevels = 1
    this.hasPlayed = false
    SKILLS.forEach(skill => {
      const state = this.skillState.find(s => s.id === skill.id)
      if (state) state.currentLevel = 0
    })
    this.save()
  }

  addSkillPoints(points: number) {
    this.skillPoints += points
    this.totalSkillPointsEarned += points
    this.save()
  }

  upgradeSkill(skillId: string): boolean {
    const skill = this.skillState.find(s => s.id === skillId)
    const skillDef = SKILLS.find(s => s.id === skillId)

    if (!skill || !skillDef) return false
    if (skill.currentLevel >= skillDef.maxLevel) return false

    // Cost for upgrading to next level
    const costs = [0, 10, 50, 200] // level 0→1: 10, 1→2: 50, 2→3: 200
    const nextLevel = skill.currentLevel + 1
    const cost = costs[nextLevel] || Infinity

    if (this.skillPoints < cost) return false

    this.skillPoints -= cost
    skill.currentLevel++
    this.save()
    return true
  }

  getSkillLevel(skillId: string): number {
    const skill = this.skillState.find(s => s.id === skillId)
    return skill?.currentLevel ?? 0
  }

  getLevelReward(): number {
    return 2
  }

  nextLevel() {
    this.currentLevel++
    if (this.currentLevel > this.unlockedLevels) {
      this.unlockedLevels = this.currentLevel
    }
    this.save()
  }

  updateHighScore(score: number) {
    if (score > this.highScore) {
      this.highScore = score
      this.save()
    }
  }

  selectLevel(level: number) {
    if (level <= this.unlockedLevels) {
      this.currentLevel = level
    }
  }
}

export default GameState.getInstance()