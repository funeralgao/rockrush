import Phaser from 'phaser'
import { SKILLS, SkillStateList } from '../SkillsManager'
import SoundManager from '../SoundManager'
import GameState from '../GameState'

interface SkillsSceneData {
  skillPoints: number
  skillState: SkillStateList
  onUpgrade: (skillId: string) => void
  onBack: () => void
}

// Cost for each level: going from 0→1 costs 1 point, 1→2 costs 3 points
const LEVEL_COSTS = [0, 1, 3]

function getUpgradeCost(currentLevel: number): number {
  if (currentLevel >= 3) return Infinity
  return LEVEL_COSTS[currentLevel + 1]
}

export default class SkillsScene extends Phaser.Scene {
  private sceneData!: SkillsSceneData
  private skillPointsText!: Phaser.GameObjects.Text
  private skillButtons: { btn: Phaser.GameObjects.Container; skillId: string }[] = []

  constructor() {
    super({ key: 'SkillsScene' })
  }

  init(data: SkillsSceneData) {
    // Always use current GameState data, not passed data (which may be stale)
    this.sceneData = {
      skillPoints: GameState.skillPoints,
      skillState: GameState.skillState,
      onUpgrade: (skillId: string) => {
        GameState.upgradeSkill(skillId)
      },
      onBack: () => {},
    }
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background overlay
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.9
    )

    // Title
    const title = this.add.text(width / 2, 30, '技能升级', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 4,
    }).setOrigin(0.5)

    // Skill points
    this.skillPointsText = this.add.text(width / 2, 60, `技能点: ${this.sceneData.skillPoints}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5)

    // Skills list
    const startY = 90
    const spacing = 60

    SKILLS.forEach((skill, index) => {
      const currentLevel = this.sceneData.skillState.find(s => s.id === skill.id)?.currentLevel ?? 0
      const y = startY + index * spacing

      // Skill container
      const container = this.createSkillItem(skill, currentLevel, y)
      this.skillButtons.push({ btn: container, skillId: skill.id })
    })

    // Back button
    const backBtn = this.add.text(width / 2, height - 30, '[ 返回主菜单 ]', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#888888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    backBtn.on('pointerover', () => backBtn.setColor('#ff4444'))
    backBtn.on('pointerout', () => backBtn.setColor('#888888'))
    backBtn.on('pointerdown', () => {
      SoundManager.playClick()
      this.scene.start('MenuScene')
    })

    // Keyboard
    this.input.keyboard?.once('keydown-ESC', () => {
      this.scene.start('MenuScene')
    })
  }

  private createSkillItem(skill: typeof SKILLS[0], currentLevel: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(0, y)
    const panelWidth = 360
    const panelX = this.cameras.main.width / 2

    // Background panel
    const bg = this.add.rectangle(
      panelX,
      0,
      panelWidth,
      50,
      0x2a2a3e,
      1
    )
    bg.setStrokeStyle(1, 0xaa0000)

    // Icon and name - top row
    const nameText = this.add.text(panelX - panelWidth/2 + 15, -8, `${skill.icon} ${skill.name}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0, 0.5)

    // Level dots - top row, right side
    const dotsStartX = panelX + 60
    for (let i = 0; i < skill.maxLevel; i++) {
      const dotX = dotsStartX + i * 20
      const dot = this.add.circle(dotX, -8, 6, i < currentLevel ? 0xff4444 : 0x444444)
      dot.setStrokeStyle(1, 0xaa0000)
      container.add(dot)
    }

    // Upgrade button - right side
    const cost = getUpgradeCost(currentLevel)
    const canUpgrade = currentLevel < skill.maxLevel && this.sceneData.skillPoints >= cost
    const upgradeBtn = this.add.text(panelX + panelWidth/2 - 25, -8, canUpgrade ? '+' : 'MAX', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: canUpgrade ? '#ff0000' : '#666666',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    if (canUpgrade) {
      upgradeBtn.on('pointerover', () => upgradeBtn.setColor('#ff4444'))
      upgradeBtn.on('pointerout', () => upgradeBtn.setColor('#ff0000'))
      upgradeBtn.on('pointerdown', () => {
        SoundManager.playClick()
        this.sceneData.onUpgrade(skill.id)
        this.refreshSkillLevels()
      })
    }

    // Description - bottom row
    const costText = currentLevel < skill.maxLevel
      ? `升级消耗: ${cost}点`
      : '已满级'
    const descText = this.add.text(panelX - panelWidth/2 + 15, 12, `${skill.description}`, {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#888888',
    }).setOrigin(0, 0.5)

    // Cost indicator
    const costIndicator = this.add.text(panelX + panelWidth/2 - 60, 12, costText, {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: currentLevel < skill.maxLevel ? '#ff4444' : '#666666',
    }).setOrigin(0, 0.5)

    container.add([bg, nameText, descText, upgradeBtn, costIndicator])

    return container
  }

  private refreshSkillLevels() {
    this.sceneData.skillPoints = GameState.skillPoints
    this.sceneData.skillState = GameState.skillState
    this.skillPointsText.setText(`技能点: ${this.sceneData.skillPoints}`)
    this.scene.restart(this.sceneData)
  }
}