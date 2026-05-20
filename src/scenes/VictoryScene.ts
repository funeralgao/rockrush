import Phaser from 'phaser'
import GameState from '../GameState'
import SoundManager from '../SoundManager'

interface VictoryData {
  score: number
  cleanPercent: number
  healthRemaining: number
}

export default class VictoryScene extends Phaser.Scene {
  private gameData!: VictoryData

  constructor() {
    super({ key: 'VictoryScene' })
  }

  init(data: VictoryData) {
    this.gameData = data
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Award skill points
    const reward = GameState.getLevelReward()
    GameState.addSkillPoints(reward)

    // Starfield background effect
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2 + 0.5,
        0xffffff,
        Math.random() * 0.5 + 0.3
      )
      this.tweens.add({
        targets: star,
        alpha: Math.random(),
        duration: 500 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
      })
    }

    // Victory panel
    const panel = this.add.rectangle(
      width / 2,
      height / 2,
      300,
      260,
      0x2a2a3e,
      1
    )
    panel.setStrokeStyle(3, 0xff0000)

    // Victory title
    const titleGlow = this.add.text(width / 2, height / 2 - 100, '🎉 通关! 🎉', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 5,
    }).setOrigin(0.5)

    // Title animation
    this.tweens.add({
      targets: titleGlow,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Stats
    const stats = [
      { label: '最终分数', value: `${this.gameData.score}`, color: '#FFD700' },
      { label: '清扫率', value: `${this.gameData.cleanPercent}%`, color: '#00ff88' },
      { label: '剩余电量', value: `${Math.round(this.gameData.healthRemaining)}%`, color: '#32CD32' },
    ]

    stats.forEach((stat, i) => {
      const y = height / 2 - 45 + i * 30

      this.add.text(width / 2 - 90, y, stat.label, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#888888',
      }).setOrigin(0, 0.5)

      this.add.text(width / 2 + 90, y, stat.value, {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: stat.color,
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(1, 0.5)
    })

    // Skill points reward
    const skillRewardY = height / 2 + 50
    const rewardText = this.add.text(width / 2, skillRewardY, `+${reward} 技能点`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: rewardText,
      scale: 1.2,
      duration: 300,
      yoyo: true,
    })

    // Buttons
    const buttonY = height / 2 + 90

    // Skills button
    const skillsBtn = this.add.rectangle(
      width / 2 - 70,
      buttonY,
      120,
      36,
      0x2d2d44,
      1
    )
    skillsBtn.setStrokeStyle(2, 0xff0000)
    skillsBtn.setInteractive({ useHandCursor: true })

    const skillsText = this.add.text(width / 2 - 70, buttonY, '⚡ 技能', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ff4444',
    }).setOrigin(0.5)

    skillsBtn.on('pointerover', () => {
      skillsBtn.setFillStyle(0x3a2a3e)
      skillsText.setColor('#ffffff')
    })

    skillsBtn.on('pointerout', () => {
      skillsBtn.setFillStyle(0x2a2a3e)
      skillsText.setColor('#ff4444')
    })

    skillsBtn.on('pointerdown', () => {
      SoundManager.playClick()
      this.cameras.main.fade(300, 0, 0, 0)
      this.time.delayedCall(300, () => {
        this.scene.start('SkillsScene', {
          skillPoints: GameState.skillPoints,
          skillState: GameState.skillState,
          onUpgrade: (skillId: string) => {
            GameState.upgradeSkill(skillId)
          },
          onBack: () => {
            GameState.nextLevel()
            this.scene.start('GameScene')
          },
        })
      })
    })

    // Next level button
    const nextBtn = this.add.rectangle(
      width / 2 + 70,
      buttonY,
      120,
      36,
      0x2a2a3e,
      1
    )
    nextBtn.setStrokeStyle(2, 0xff4444)
    nextBtn.setInteractive({ useHandCursor: true })

    const nextText = this.add.text(width / 2 + 70, buttonY, '▶ 下一关', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5)

    nextBtn.on('pointerover', () => {
      nextBtn.setFillStyle(0x3a2a3e)
      nextBtn.setStrokeStyle(3, 0xff0000)
      nextText.setColor('#ff4444')
    })

    nextBtn.on('pointerout', () => {
      nextBtn.setFillStyle(0x2a2a3e)
      nextBtn.setStrokeStyle(2, 0xff4444)
      nextText.setColor('#ffffff')
    })

    nextBtn.on('pointerdown', () => {
      SoundManager.playClick()
      this.cameras.main.fade(300, 0, 0, 0)
      this.time.delayedCall(300, () => {
        GameState.nextLevel()
        this.scene.start('GameScene')
      })
    })

    // Menu button
    const menuBtn = this.add.text(width / 2, buttonY + 45, '[ 返回主菜单 ]', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#666666',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    menuBtn.on('pointerover', () => menuBtn.setColor('#00ff88'))
    menuBtn.on('pointerout', () => menuBtn.setColor('#666666'))
    menuBtn.on('pointerdown', () => {
      SoundManager.playClick()
      this.scene.start('MenuScene')
    })

    // Fade in
    panel.setAlpha(0)
    titleGlow.setAlpha(0)
    this.tweens.add({
      targets: [panel, titleGlow],
      alpha: 1,
      duration: 500,
      ease: 'Cubic.easeOut',
    })

    // Play victory sound
    SoundManager.playVictory()
  }
}