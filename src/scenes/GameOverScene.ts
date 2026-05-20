import Phaser from 'phaser'
import SoundManager from '../SoundManager'

interface GameOverData {
  score: number
  cleanPercent: number
  healthRemaining: number
}

export default class GameOverScene extends Phaser.Scene {
  private gameData!: GameOverData

  constructor() {
    super({ key: 'GameOverScene' })
  }

  init(data: GameOverData) {
    this.gameData = data
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background overlay
    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.85
    )

    // Game Over panel
    const panel = this.add.rectangle(
      width / 2,
      height / 2,
      280,
      200,
      0x2a2a3e,
      1
    )
    panel.setStrokeStyle(3, 0xff0000)

    // Title with glow effect
    const titleGlow = this.add.text(width / 2, height / 2 - 65, 'GAME OVER', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 6,
    }).setOrigin(0.5)

    // Pulsing animation for title
    this.tweens.add({
      targets: titleGlow,
      scale: 1.05,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Stats
    const scoreLabel = this.add.text(width / 2 - 80, height / 2 - 20, '最终分数', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#888888',
    }).setOrigin(0, 0.5)

    const scoreValue = this.add.text(width / 2 + 80, height / 2 - 20, `${this.gameData.score}`, {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(1, 0.5)

    const cleanLabel = this.add.text(width / 2 - 80, height / 2 + 15, '清扫率', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#888888',
    }).setOrigin(0, 0.5)

    const cleanValue = this.add.text(width / 2 + 80, height / 2 + 15, `${this.gameData.cleanPercent}%`, {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#00ff88',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(1, 0.5)

    // Buttons
    const buttonY = height / 2 + 65

    // Retry button
    const retryBtn = this.add.rectangle(
      width / 2,
      buttonY,
      160,
      36,
      0x2a2a3e,
      1
    )
    retryBtn.setStrokeStyle(2, 0xff0000)
    retryBtn.setInteractive({ useHandCursor: true })

    const retryText = this.add.text(width / 2, buttonY, '▶ 重新开始', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5)

    // Menu button
    const menuBtn = this.add.text(width / 2, buttonY + 40, '[ 返回主菜单 ]', {
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

    // Button interactions
    retryBtn.on('pointerover', () => {
      retryBtn.setFillStyle(0x3a2a3e)
      retryBtn.setStrokeStyle(3, 0xff4444)
      retryText.setColor('#ff4444')
    })

    retryBtn.on('pointerout', () => {
      retryBtn.setFillStyle(0x2a2a3e)
      retryBtn.setStrokeStyle(2, 0xff0000)
      retryText.setColor('#ffffff')
    })

    retryBtn.on('pointerdown', () => {
      SoundManager.playClick()
      this.cameras.main.fade(300, 0, 0, 0)
      this.time.delayedCall(300, () => {
        this.scene.start('GameScene')
      })
    })

    // Keyboard shortcut hint
    this.add.text(
      width / 2,
      buttonY + 70,
      '按 空格键 或 Enter 重新开始',
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#555555',
      }
    ).setOrigin(0.5)

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('GameScene')
    })

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('GameScene')
    })

    // Fade in animation
    overlay.setAlpha(0)
    panel.setAlpha(0)
    titleGlow.setAlpha(0)
    scoreLabel.setAlpha(0)
    scoreValue.setAlpha(0)
    cleanLabel.setAlpha(0)
    cleanValue.setAlpha(0)
    retryBtn.setAlpha(0)
    retryText.setAlpha(0)

    this.tweens.add({
      targets: [overlay, panel, titleGlow, scoreLabel, scoreValue, cleanLabel, cleanValue, retryBtn, retryText],
      alpha: 1,
      duration: 500,
      delay: 200,
      ease: 'Cubic.easeOut',
    })
  }
}