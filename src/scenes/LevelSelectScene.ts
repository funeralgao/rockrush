import Phaser from 'phaser'
import GameState from '../GameState'
import SoundManager from '../SoundManager'
import { LEVELS, getTotalLevels } from '../LevelManager'

export default class LevelSelectScene extends Phaser.Scene {
  private levelButtons: Phaser.GameObjects.Container[] = []

  constructor() {
    super({ key: 'LevelSelectScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Title
    const title = this.add.text(width / 2, 40, '选择关卡', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 4,
    }).setOrigin(0.5)

    // Back button
    const backBtn = this.add.text(width / 2, height - 30, '[ 返回主菜单 ]', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#666666',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    backBtn.on('pointerover', () => backBtn.setColor('#00ff88'))
    backBtn.on('pointerout', () => backBtn.setColor('#666666'))
    backBtn.on('pointerdown', () => {
      SoundManager.playClick()
      this.scene.start('MenuScene')
    })

    // Level buttons
    const totalLevels = getTotalLevels()
    const startY = 90
    const spacingY = 45

    for (let i = 0; i < totalLevels; i++) {
      const level = LEVELS[i]
      const y = startY + i * spacingY
      const isUnlocked = (i + 1) <= GameState.unlockedLevels

      const btn = this.createLevelButton(level, i + 1, y, isUnlocked)
      this.levelButtons.push(btn)
    }

    // High score display
    this.add.text(width / 2, height - 60, `最高分: ${GameState.highScore}`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#888888',
    }).setOrigin(0.5)

    // Keyboard
    this.input.keyboard?.once('keydown-ESC', () => {
      this.scene.start('MenuScene')
    })
  }

  private createLevelButton(level: typeof LEVELS[0], levelNum: number, y: number, isUnlocked: boolean): Phaser.GameObjects.Container {
    const container = this.add.container(0, y)
    const width = this.cameras.main.width

    const bg = this.add.rectangle(
      width / 2,
      0,
      350,
      38,
      0x2a2a3e,
      1
    )

    if (isUnlocked) {
      bg.setStrokeStyle(1, 0xff0000)
    } else {
      bg.setStrokeStyle(1, 0x444444)
    }

    const levelText = this.add.text(30, 0, `第 ${levelNum} 关`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: isUnlocked ? '#ffffff' : '#555555',
    }).setOrigin(0, 0.5)

    const nameText = this.add.text(100, 0, level.name, {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: isUnlocked ? '#cccccc' : '#444444',
    }).setOrigin(0, 0.5)

    // Lock icon for locked levels
    if (!isUnlocked) {
      const lockText = this.add.text(width - 30, 0, '🔒', {
        fontSize: '14px',
      }).setOrigin(0.5)
      container.add([bg, levelText, nameText, lockText])
    } else {
      container.add([bg, levelText, nameText])

      bg.setInteractive({ useHandCursor: true })
      bg.on('pointerover', () => {
        bg.setFillStyle(0x3a2a3e)
        bg.setStrokeStyle(2, 0xff4444)
      })
      bg.on('pointerout', () => {
        bg.setFillStyle(0x2a2a3e)
        bg.setStrokeStyle(1, 0xff0000)
      })
      bg.on('pointerdown', () => {
        SoundManager.playClick()
        GameState.selectLevel(levelNum)
        this.scene.start('GameScene')
      })
    }

    return container
  }
}