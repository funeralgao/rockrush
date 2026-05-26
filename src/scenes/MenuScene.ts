import Phaser from 'phaser'
import GameState from '../GameState'
import SoundManager from '../SoundManager'

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background music
    SoundManager.startBgMusic()

    // Decorative background gradient effect
    const bgGradient = this.add.graphics()
    bgGradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x2a2a3e, 0x2a2a3e, 1)
    bgGradient.fillRect(0, 0, width, height)
    bgGradient.setDepth(-1)

    // Decorative lines
    const decorLine = this.add.graphics()
    decorLine.lineStyle(1, 0xff0000, 0.1)
    for (let i = 0; i < 5; i++) {
      decorLine.lineBetween(0, height * 0.3 + i * 30, width, height * 0.3 + i * 30)
    }

    // Title with glow effect
    const titleGlow = this.add.text(width / 2, 45, 'RockRush', {
      fontFamily: 'Arial',
      fontSize: '38px',
      color: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 8,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: titleGlow,
      scale: 1.03,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Subtitle
    this.add.text(width / 2, 78, '石头科技扫地机', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#cccccc',
    }).setOrigin(0.5)

    // Restart button (at top)
    const restartBtn = this.add.rectangle(
      width / 2,
      110,
      200,
      40,
      0x2a2a3e,
      1
    )
    restartBtn.setStrokeStyle(2, 0xff0000)
    restartBtn.setInteractive({ useHandCursor: true })

    const restartText = this.add.text(width / 2, 110, '🔄 重新开始游戏', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5)

    restartBtn.on('pointerover', () => {
      restartBtn.setFillStyle(0x3a2a3e)
      restartBtn.setStrokeStyle(3, 0xff4444)
      restartText.setColor('#ff4444')
    })

    restartBtn.on('pointerout', () => {
      restartBtn.setFillStyle(0x2a2a3e)
      restartBtn.setStrokeStyle(2, 0xff0000)
      restartText.setColor('#ffffff')
    })

    restartBtn.on('pointerdown', () => {
      SoundManager.playClick()
      GameState.resetProgress()
      this.cameras.main.fade(300, 0, 0, 0)
      this.time.delayedCall(300, () => {
        this.scene.start('GameScene')
      })
    })

    // Start button
    const startBtn = this.add.rectangle(
      width / 2,
      160,
      200,
      40,
      0x2a2a3e,
      1
    )
    startBtn.setStrokeStyle(2, 0xff0000)
    startBtn.setInteractive({ useHandCursor: true })

    const startText = this.add.text(width / 2, 160, '▶ 开始游戏', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5)

    startBtn.on('pointerover', () => {
      startBtn.setFillStyle(0x3a2a3e)
      startBtn.setStrokeStyle(3, 0xff4444)
      startText.setColor('#ff4444')
    })

    startBtn.on('pointerout', () => {
      startBtn.setFillStyle(0x2a2a3e)
      startBtn.setStrokeStyle(2, 0xff0000)
      startText.setColor('#ffffff')
    })

    startBtn.on('pointerdown', () => {
      SoundManager.playClick()
      GameState.hasPlayed = true
      this.cameras.main.fade(300, 0, 0, 0)
      this.time.delayedCall(300, () => {
        this.scene.start('GameScene')
      })
    })

    // Level select button
    const levelBtn = this.add.rectangle(
      width / 2,
      210,
      200,
      40,
      0x2a2a3e,
      1
    )
    levelBtn.setStrokeStyle(2, 0xff0000)
    levelBtn.setInteractive({ useHandCursor: true })

    const levelText = this.add.text(width / 2, 210, '📍 选择关卡', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5)

    levelBtn.on('pointerover', () => {
      levelBtn.setFillStyle(0x3a2a3e)
      levelBtn.setStrokeStyle(3, 0xff4444)
      levelText.setColor('#ff4444')
    })

    levelBtn.on('pointerout', () => {
      levelBtn.setFillStyle(0x2a2a3e)
      levelBtn.setStrokeStyle(2, 0xff0000)
      levelText.setColor('#ffffff')
    })

    levelBtn.on('pointerdown', () => {
      SoundManager.playClick()
      this.cameras.main.fade(300, 0, 0, 0)
      this.time.delayedCall(300, () => {
        this.scene.start('LevelSelectScene')
      })
    })

    // Skills button
    const skillsBtn = this.add.rectangle(
      width / 2,
      260,
      200,
      40,
      0x2a2a3e,
      1
    )
    skillsBtn.setStrokeStyle(2, 0xcc0000)
    skillsBtn.setInteractive({ useHandCursor: true })

    const skillsText = this.add.text(width / 2, 260, `⚡ 技能 (${GameState.skillPoints}点)`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ff4444',
    }).setOrigin(0.5)

    skillsBtn.on('pointerover', () => {
      skillsBtn.setFillStyle(0x3a2a3e)
      skillsBtn.setStrokeStyle(3, 0xff4444)
      skillsText.setColor('#ffffff')
    })

    skillsBtn.on('pointerout', () => {
      skillsBtn.setFillStyle(0x2a2a3e)
      skillsBtn.setStrokeStyle(2, 0xcc0000)
      skillsText.setColor('#ff4444')
    })

    skillsBtn.on('pointerdown', () => {
      SoundManager.playClick()
      this.cameras.main.fade(300, 0, 0, 0)
      this.time.delayedCall(300, () => {
        this.scene.start('SkillsScene')
      })
    })

    // High score
    this.add.text(width / 2, 310, `最高分: ${GameState.highScore}`, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#888888',
    }).setOrigin(0.5)

    // Instructions
    this.add.text(width / 2, 330, 'WASD/方向键移动 | 避开线材 | 收集电池', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#666666',
    }).setOrigin(0.5)

    // Clear save button - bottom right
    const clearBtn = this.add.text(width - 20, height - 20, '🗑️ 清空存档', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#666666',
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true })

    clearBtn.on('pointerover', () => clearBtn.setColor('#ff4444'))
    clearBtn.on('pointerout', () => clearBtn.setColor('#666666'))
    clearBtn.on('pointerdown', () => {
      SoundManager.playClick()
      GameState.resetProgress()
      window.location.reload()
    })

    // Check if user has played before - show restart button only if they have progress
    if (!GameState.hasPlayed) {
      // Hide restart button on first visit
      restartBtn.setVisible(false)
      restartText.setVisible(false)
    } else {
      // Show restart button on subsequent visits
      restartBtn.on('pointerdown', () => {
        SoundManager.playClick()
        GameState.resetProgress()
        this.cameras.main.fade(300, 0, 0, 0)
        this.time.delayedCall(300, () => {
          this.scene.start('GameScene')
        })
      })
    }
  }
}