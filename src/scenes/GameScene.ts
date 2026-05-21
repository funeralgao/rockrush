import Phaser from 'phaser'
import GameState from '../GameState'
import SoundManager from '../SoundManager'
import { getLevelConfig, LevelConfig } from '../LevelManager'

// Grid constants - Large world for exploration
const TILE_SIZE = 16
const GRID_WIDTH = 60
const GRID_HEIGHT = 45

export default class GameScene extends Phaser.Scene {
  // Robot vacuum
  private robot!: Phaser.Physics.Arcade.Sprite
  private robotGridX = 1
  private robotGridY = 1
  private facingX = 0
  private facingY = 1
  private isMoving = false

  // Stats
  private health = 100
  private maxHealth = 100
  private score = 0
  private cleanPercent = 0
  private totalTrash = 0
  private collectedTrash = 0
  private isGameOver = false

  // Grid data
  private gridData: number[][] = []
  private floorTiles: Phaser.GameObjects.Image[][] = []
  private trashSprites: Phaser.GameObjects.Sprite[] = []
  private obstacles: Phaser.GameObjects.Image[] = []
  private batteryPickups: Phaser.GameObjects.Image[] = []
  private specialPickups: Phaser.GameObjects.Image[] = []
  private furniture: Phaser.GameObjects.Image[] = []
  private cleanTrails: Phaser.GameObjects.Image[] = []

  // UI
  private healthBar!: Phaser.GameObjects.Graphics
  private healthText!: Phaser.GameObjects.Text
  private scoreText!: Phaser.GameObjects.Text
  private cleanText!: Phaser.GameObjects.Text
  private levelText!: Phaser.GameObjects.Text
  private uiY = 8
  private uiContainer!: Phaser.GameObjects.Container

  // Visual effects
  private robotGlow!: Phaser.GameObjects.Arc
  private robotLight!: Phaser.GameObjects.Arc
  private dustParticles!: Phaser.GameObjects.Particles.ParticleEmitter
  private sparkleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter

  // Controls
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key }

  // Touch controls
  private touchButtons!: Phaser.GameObjects.Container
  private isTouchDevice = false
  private virtualJoystick: { dx: number; dy: number } = { dx: 0, dy: 0 }

  private levelConfig!: LevelConfig

  // Mini-map radar
  private miniMap!: Phaser.GameObjects.Container
  private miniMapWidth = 80
  private miniMapHeight = 60
  private miniMapScaleX = 80 / GRID_WIDTH
  private miniMapScaleY = 60 / GRID_HEIGHT
  private miniMapElements: Phaser.GameObjects.GameObject[] = []

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.levelConfig = getLevelConfig(GameState.currentLevel)

    // Start in center of large map
    this.robotGridX = Math.floor(GRID_WIDTH / 2)
    this.robotGridY = Math.floor(GRID_HEIGHT / 2)
    this.isMoving = false
    this.isGameOver = false

    this.initGrid(this.levelConfig)
    this.createMap()
    this.spawnFurniture(this.levelConfig.furniture)
    this.createRobot()
    this.createParticleEffects()
    this.spawnTrash(this.levelConfig.trashCount)
    this.spawnObstacles(this.levelConfig.cableCount, 'cable')
    this.spawnObstacles(this.levelConfig.poopCount, 'poop')
    this.spawnObstacles(this.levelConfig.waterCount, 'water')
    this.spawnBatteryPickups(this.levelConfig.batteryCount)
    this.spawnSpecialPickups(this.levelConfig.toyCount, 'toy')
    this.createUI(this.levelConfig.name)
    this.createMiniMap()
    this.setupControls()
    this.setupTouchControls()
    this.playStartAnimation()
    this.setupSound()

    // Camera follow robot in large world
    this.cameras.main.startFollow(this.robot, true, 0.08, 0.08)
    this.cameras.main.setZoom(1)
    this.cameras.main.setBounds(0, 0, GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE)

    SoundManager.startBgMusic()
  }

  setupSound() {
    this.input.once('pointerdown', () => {
      SoundManager.startBgMusic()
    })
  }

  initGrid(levelConfig: LevelConfig) {
    this.gridData = []
    for (let y = 0; y < GRID_HEIGHT; y++) {
      this.gridData[y] = []
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1) {
          this.gridData[y][x] = 1
        } else {
          this.gridData[y][x] = 0
        }
      }
    }

    levelConfig.walls.forEach(wall => {
      this.addWall(wall.x, wall.y, wall.w, wall.h)
    })
  }

  addWall(x: number, y: number, w: number, h: number) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (y + dy < GRID_HEIGHT && x + dx < GRID_WIDTH) {
          this.gridData[y + dy][x + dx] = 1
        }
      }
    }
  }

  createMap() {
    this.floorTiles = []

    const floorType = this.levelConfig.floorType || 'wood'
    const dirtyFloorKey = floorType === 'tile' ? 'floor_dirty_tile' :
                          floorType === 'carpet' ? 'floor_dirty_carpet' : 'floor_dirty'

    for (let y = 0; y < GRID_HEIGHT; y++) {
      this.floorTiles[y] = []
      for (let x = 0; x < GRID_WIDTH; x++) {
        const worldX = x * TILE_SIZE
        const worldY = y * TILE_SIZE

        if (this.gridData[y][x] === 1) {
          const wall = this.add.image(worldX + 8, worldY + 8, 'wall')
          wall.setDepth(0)
          const wallTop = this.add.rectangle(worldX + 8, worldY + 4, 14, 4, 0x3d5a73)
          wallTop.setDepth(0.1)
          this.floorTiles[y][x] = wall
        } else {
          const tile = this.add.image(worldX + 8, worldY + 8, dirtyFloorKey)
          tile.setDepth(0)
          this.floorTiles[y][x] = tile
        }
      }
    }
  }

  spawnFurniture(furnitureList: { type: string; x: number; y: number }[]) {
    furnitureList.forEach(item => {
      const worldX = item.x * TILE_SIZE + TILE_SIZE / 2
      const worldY = item.y * TILE_SIZE + TILE_SIZE / 2

      const furnImage = this.add.image(worldX, worldY, item.type)
      furnImage.setDepth(2)

      this.gridData[item.y][item.x] = 1
      this.furniture.push(furnImage)
    })
  }

  createRobot() {
    this.robotGlow = this.add.arc(
      this.robotGridX * TILE_SIZE + TILE_SIZE / 2,
      this.robotGridY * TILE_SIZE + TILE_SIZE / 2,
      20,
      0, 360,
      false,
      0x00ff88,
      0.15
    )
    this.robotGlow.setDepth(5)

    this.robotLight = this.add.arc(
      this.robotGridX * TILE_SIZE + TILE_SIZE / 2,
      this.robotGridY * TILE_SIZE + TILE_SIZE / 2,
      12,
      0, 360,
      false,
      0xffffff,
      0.3
    )
    this.robotLight.setDepth(8)

    this.robot = this.physics.add.sprite(
      this.robotGridX * TILE_SIZE + TILE_SIZE / 2,
      this.robotGridY * TILE_SIZE + TILE_SIZE / 2,
      'robot'
    )
    this.robot.setDepth(10)
    this.robot.body!.setSize(18, 18)
    this.robot.setCollideWorldBounds(false)
    this.robot.setAngle(0) // Initial facing up

    this.tweens.add({
      targets: this.robotGlow,
      alpha: 0.05,
      scale: 1.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.tweens.add({
      targets: this.robotLight,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear',
    })
  }

  createParticleEffects() {
    const rect = new Phaser.Geom.Rectangle(-5, -5, 10, 10)
    this.dustParticles = this.add.particles(0, 0, 'floor_clean', {
      x: 0,
      y: 0,
      speed: { min: 10, max: 30 },
      angle: { min: 180, max: 220 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 300,
      frequency: 100,
      emitZone: { type: 'random', source: rect } as Phaser.Types.GameObjects.Particles.EmitZoneData,
    })
    this.dustParticles.setDepth(15)
    this.dustParticles.stop()

    this.sparkleEmitter = this.add.particles(0, 0, 'sparkle', {
      x: 0,
      y: 0,
      speed: { min: 20, max: 50 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 400,
      frequency: 0,
      quantity: 5,
    })
    this.sparkleEmitter.setDepth(20)
    this.sparkleEmitter.stop()
  }

  playStartAnimation() {
    this.robot.setScale(0)
    this.tweens.add({
      targets: this.robot,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut',
    })

    this.tweens.add({
      targets: this.robotGlow,
      scale: 1.5,
      alpha: 0.3,
      duration: 500,
      ease: 'Cubic.easeOut',
    })

    this.cameras.main.shake(200, 0.005)
  }

  spawnTrash(count: number) {
    this.totalTrash = count
    this.collectedTrash = 0

    for (let i = 0; i < count; i++) {
      let x, y
      let attempts = 0
      do {
        x = Phaser.Math.Between(2, GRID_WIDTH - 3)
        y = Phaser.Math.Between(2, GRID_HEIGHT - 3)
        attempts++
      } while (
        this.gridData[y][x] !== 0 &&
        this.gridData[y][x] !== 2 &&
        (x === this.robotGridX && y === this.robotGridY) ||
        this.isTrashAt(x, y) ||
        attempts > 100
      )

      const trash = this.add.sprite(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        'trash'
      )
      trash.setDepth(5)
      trash.setData('gridX', x)
      trash.setData('gridY', y)
      trash.setData('collected', false)

      this.tweens.add({
        targets: trash,
        y: trash.y - 3,
        duration: 400 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      this.trashSprites.push(trash)
    }
  }

  spawnObstacles(count: number, type: string) {
    for (let i = 0; i < count; i++) {
      let x, y
      let attempts = 0
      do {
        x = Phaser.Math.Between(2, GRID_WIDTH - 3)
        y = Phaser.Math.Between(2, GRID_HEIGHT - 3)
        attempts++
      } while (
        this.gridData[y][x] !== 0 ||
        (Math.abs(x - this.robotGridX) < 4 && Math.abs(y - this.robotGridY) < 4) ||
        this.isNearObstacle(x, y) ||
        attempts > 50
      )

      if (type !== 'water') {
        this.gridData[y][x] = 3
      }

      const obs = this.add.image(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        type
      )
      obs.setDepth(6)
      obs.setData('gridX', x)
      obs.setData('gridY', y)
      obs.setData('type', type)
      obs.setData('cleaned', false)

      if (type === 'water') {
        this.tweens.add({
          targets: obs,
          alpha: 0.7,
          duration: 500 + Math.random() * 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      }

      if (type === 'cable') {
        this.tweens.add({
          targets: obs,
          angle: 5,
          duration: 1000 + Math.random() * 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      }

      this.obstacles.push(obs)
    }
  }

  spawnBatteryPickups(count: number) {
    for (let i = 0; i < count; i++) {
      let x, y
      let attempts = 0
      do {
        x = Phaser.Math.Between(2, GRID_WIDTH - 3)
        y = Phaser.Math.Between(2, GRID_HEIGHT - 3)
        attempts++
      } while (
        this.gridData[y][x] !== 0 ||
        (Math.abs(x - this.robotGridX) < 5 && Math.abs(y - this.robotGridY) < 5) ||
        this.isTrashAt(x, y) ||
        attempts > 50
      )

      const battery = this.add.image(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        'battery'
      )
      battery.setDepth(5)
      battery.setData('gridX', x)
      battery.setData('gridY', y)
      battery.setData('type', 'battery')

      this.tweens.add({
        targets: battery,
        scale: 1.2,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      this.batteryPickups.push(battery)
    }
  }

  spawnSpecialPickups(count: number, type: string) {
    for (let i = 0; i < count; i++) {
      let x, y
      let attempts = 0
      do {
        x = Phaser.Math.Between(2, GRID_WIDTH - 3)
        y = Phaser.Math.Between(2, GRID_HEIGHT - 3)
        attempts++
      } while (
        this.gridData[y][x] !== 0 ||
        (Math.abs(x - this.robotGridX) < 5 && Math.abs(y - this.robotGridY) < 5) ||
        this.isTrashAt(x, y) ||
        attempts > 50
      )

      const toy = this.add.image(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        type
      )
      toy.setDepth(5)
      toy.setData('gridX', x)
      toy.setData('gridY', y)
      toy.setData('type', type)

      this.tweens.add({
        targets: toy,
        y: toy.y - 4,
        duration: 300 + Math.random() * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      this.specialPickups.push(toy)
    }
  }

  isTrashAt(x: number, y: number): boolean {
    return this.trashSprites.some(
      t => !t.getData('collected') && t.getData('gridX') === x && t.getData('gridY') === y
    )
  }

  isNearWall(x: number, y: number): boolean {
    // Check adjacent cells for walls
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
          if (this.gridData[ny][nx] === 1) return true
        }
      }
    }
    return false
  }

  isNearFurniture(x: number, y: number): boolean {
    // Check adjacent cells for furniture (gridData value of 1)
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
          if (this.gridData[ny][nx] === 1) return true
        }
      }
    }
    return false
  }

  isNearObstacle(x: number, y: number): boolean {
    // Check adjacent cells for existing obstacles
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const nx = x + dx
        const ny = y + dy
        if (this.obstacles.some(o => o.getData('gridX') === nx && o.getData('gridY') === ny)) {
          return true
        }
      }
    }
    return false
  }

  createUI(levelName: string) {
    // Create UI container that follows camera (fixed to camera view)
    this.uiContainer = this.add.container(0, 0)
    this.uiContainer.setScrollFactor(0)
    this.uiContainer.setDepth(100)

    // Lightning icon (no background)
    this.uiContainer.add(this.add.text(8, this.uiY, '⚡', { fontSize: '12px', color: '#ff0000' }).setOrigin(0, 0.5))

    // Health bar background
    this.uiContainer.add(this.add.rectangle(20, this.uiY, 80, 12, 0x444444).setOrigin(0, 0.5))

    this.healthBar = this.add.graphics()
    this.uiContainer.add(this.healthBar)
    this.updateHealthBar()

    this.healthText = this.add.text(51, this.uiY, `${Math.round(this.health)}%`, {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0, 0.5)
    this.uiContainer.add(this.healthText)

    this.levelText = this.add.text(130, this.uiY, `${levelName}`, {
      fontFamily: 'Arial',
      fontSize: '9px',
      color: '#cccccc',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0, 0.5)
    this.uiContainer.add(this.levelText)

    this.scoreText = this.add.text(250, this.uiY, `分数: ${this.score}`, {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0, 0.5)
    this.uiContainer.add(this.scoreText)

    this.cleanText = this.add.text(400, this.uiY, `🧹 ${this.cleanPercent}%`, {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#44ff88',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0, 0.5)
    this.uiContainer.add(this.cleanText)

    if (!this.isTouchDevice) {
      this.uiContainer.add(this.add.text(
        this.cameras.main.width - 5,
        this.cameras.main.height - 5,
        'WASD/方向键 | P暂停 | ESC主菜单',
        { fontFamily: 'monospace', fontSize: '8px', color: '#666666', stroke: '#000000', strokeThickness: 1 }
      ).setOrigin(1, 1))
    }
  }

  createMiniMap() {
    const mapX = this.cameras.main.width - this.miniMapWidth - 10
    const mapY = this.cameras.main.height - this.miniMapHeight - 40

    this.miniMap = this.add.container(mapX, mapY)
    this.miniMap.setScrollFactor(0)
    this.miniMap.setDepth(100)

    // Circular background using graphics
    const bg = this.add.graphics()
    bg.fillStyle(0x000000, 0.8)
    bg.fillCircle(this.miniMapWidth / 2, this.miniMapHeight / 2, this.miniMapWidth / 2)
    bg.lineStyle(2, 0x00ff88, 0.8)
    bg.strokeCircle(this.miniMapWidth / 2, this.miniMapHeight / 2, this.miniMapWidth / 2)
    this.miniMap.add(bg)

    // Add clipping mask to keep elements inside circle
    const mask = this.add.graphics()
    mask.fillStyle(0xffffff, 1)
    mask.fillCircle(this.miniMapWidth / 2, this.miniMapHeight / 2, this.miniMapWidth / 2)
    mask.setAlpha(0.01) // Nearly invisible but needed for clipping
    this.miniMap.add(mask)
  }

  updateMiniMap() {
    // Destroy old elements
    this.miniMapElements.forEach(elem => elem.destroy())
    this.miniMapElements = []

    // Draw walls on mini map
    this.levelConfig.walls.forEach(wall => {
      const wallRect = this.add.rectangle(
        wall.x * this.miniMapScaleX,
        wall.y * this.miniMapScaleY,
        wall.w * this.miniMapScaleX,
        wall.h * this.miniMapScaleY,
        0x666666
      )
      wallRect.setOrigin(0, 0)
      this.miniMap.add(wallRect)
      this.miniMapElements.push(wallRect)
    })

    // Draw furniture on mini map
    this.levelConfig.furniture.forEach(furn => {
      const furnDot = this.add.rectangle(
        furn.x * this.miniMapScaleX,
        furn.y * this.miniMapScaleY,
        3,
        3,
        0x888888
      )
      furnDot.setOrigin(0, 0)
      this.miniMap.add(furnDot)
      this.miniMapElements.push(furnDot)
    })

    // Draw robot position
    const robotDot = this.add.circle(
      this.robotGridX * this.miniMapScaleX,
      this.robotGridY * this.miniMapScaleY,
      3,
      0xff0000
    )
    this.miniMap.add(robotDot)
    this.miniMapElements.push(robotDot)
  }

  updateHealthBar() {
    this.healthBar.clear()
    const healthPercent = this.health / this.maxHealth

    let color = 0x44ff44
    if (healthPercent < 0.3) color = 0xff4444
    else if (healthPercent < 0.6) color = 0xffaa00

    this.healthBar.fillStyle(color, 1)
    this.healthBar.fillRect(20, this.uiY - 5, 80 * healthPercent, 10)

    this.healthBar.fillStyle(0xffffff, 0.3)
    this.healthBar.fillRect(20, this.uiY - 5, 80 * healthPercent, 3)
  }

  setupControls() {
    if (!this.input.keyboard) return

    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }

    this.input.keyboard.on('keydown-P', () => {
      if (this.scene.isActive()) {
        this.scene.pause()
      } else {
        this.scene.resume()
      }
    })

    this.input.keyboard.on('keydown-ESC', () => {
      SoundManager.stopBgMusic()
      this.scene.start('MenuScene')
    })
  }

  setupTouchControls() {
    if (!this.game.device.input.touch) {
      return
    }
    this.isTouchDevice = true

    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.touchButtons = this.add.container(0, 0)
    this.touchButtons.setDepth(200)

    const btnSize = 36
    const spacing = 40
    const startX = 50
    const startY = height - 60

    const directions = [
      { label: '▲', dx: 0, dy: -1, x: startX + spacing, y: startY },
      { label: '◀', dx: -1, dy: 0, x: startX, y: startY + spacing },
      { label: '▼', dx: 0, dy: 1, x: startX + spacing, y: startY + spacing * 2 },
      { label: '▶', dx: 1, dy: 0, x: startX + spacing * 2, y: startY + spacing },
    ]

    directions.forEach(dir => {
      const btn = this.add.rectangle(dir.x, dir.y, btnSize, btnSize, 0x2d2d44, 0.8)
      btn.setStrokeStyle(2, 0x00ff88)
      btn.setInteractive({ useHandCursor: false })

      const text = this.add.text(dir.x, dir.y, dir.label, {
        fontSize: '16px',
        color: '#00ff88',
      }).setOrigin(0.5)

      btn.on('pointerdown', () => {
        this.virtualJoystick.dx = dir.dx
        this.virtualJoystick.dy = dir.dy
      })

      btn.on('pointerup', () => {
        if (this.virtualJoystick.dx === dir.dx) this.virtualJoystick.dx = 0
        if (this.virtualJoystick.dy === dir.dy) this.virtualJoystick.dy = 0
      })

      btn.on('pointerout', () => {
        if (this.virtualJoystick.dx === dir.dx) this.virtualJoystick.dx = 0
        if (this.virtualJoystick.dy === dir.dy) this.virtualJoystick.dy = 0
      })

      this.touchButtons.add([btn, text])
    })

    const menuBtn = this.add.rectangle(width - 40, height - 30, 60, 30, 0x2d2d44, 0.8)
    menuBtn.setStrokeStyle(1, 0x666666)
    menuBtn.setInteractive({ useHandCursor: true })

    const menuText = this.add.text(width - 40, height - 30, '菜单', {
      fontSize: '12px',
      color: '#888888',
    }).setOrigin(0.5)

    menuBtn.on('pointerdown', () => {
      SoundManager.stopBgMusic()
      this.scene.start('MenuScene')
    })

    this.touchButtons.add([menuBtn, menuText])
  }

  update() {
    if (!this.isMoving) {
      this.handleInput()
    }
    this.checkCollisions()
    this.drainHealth()
    this.updateUI()
    this.updateMiniMap()
    this.checkGameOver()
    this.updateParticlePosition()
    this.updateRobotEffects()
  }

  updateParticlePosition() {
    if (this.isMoving) {
      this.dustParticles.setPosition(this.robot.x, this.robot.y + 5)
    }
  }

  updateRobotEffects() {
    this.robotGlow.setPosition(this.robot.x, this.robot.y)
    this.robotLight.setPosition(this.robot.x, this.robot.y)
  }

  handleInput() {
    let dx = 0
    let dy = 0

    if (this.cursors.left?.isDown || this.wasd.A.isDown) {
      dx = -1
      this.facingX = -1
      this.facingY = 0
    } else if (this.cursors.right?.isDown || this.wasd.D.isDown) {
      dx = 1
      this.facingX = 1
      this.facingY = 0
    } else if (this.cursors.up?.isDown || this.wasd.W.isDown) {
      dy = -1
      this.facingX = 0
      this.facingY = -1
    } else if (this.cursors.down?.isDown || this.wasd.S.isDown) {
      dy = 1
      this.facingX = 0
      this.facingY = 1
    }

    if (dx === 0 && dy === 0) {
      dx = this.virtualJoystick.dx
      dy = this.virtualJoystick.dy
      this.facingX = dx
      this.facingY = dy
    }

    if (dx !== 0 || dy !== 0) {
      const newX = this.robotGridX + dx
      const newY = this.robotGridY + dy

      if (this.canMoveTo(newX, newY)) {
        this.moveRobot(newX, newY)
      }
    }
  }

  canMoveTo(x: number, y: number): boolean {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
      return false
    }
    return this.gridData[y][x] !== 1 && this.gridData[y][x] !== 3
  }

  moveRobot(newX: number, newY: number) {
    this.isMoving = true
    this.robotGridX = newX
    this.robotGridY = newY

    // Rotate robot before moving
    this.updateRobotRotation()

    this.addCleanTrail(newX, newY)
    this.dustParticles.start()

    // Wiggle animation during movement (subtle 20% squeeze)
    this.robot.setScale(1.02, 0.98)

    this.tweens.add({
      targets: this.robot,
      x: newX * TILE_SIZE + TILE_SIZE / 2,
      y: newY * TILE_SIZE + TILE_SIZE / 2,
      scaleX: 1,
      scaleY: 1,
      duration: 80,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false
        this.dustParticles.stop()
      },
    })
  }

  updateRobotRotation() {
    // Rotate robot clockwise to face movement direction
    if (this.facingX === 1) {
      this.robot.setAngle(90)
    } else if (this.facingX === -1) {
      this.robot.setAngle(-90)
    } else if (this.facingY === -1) {
      this.robot.setAngle(0)
    } else if (this.facingY === 1) {
      this.robot.setAngle(180)
    }
  }

  addCleanTrail(x: number, y: number) {
    if (this.gridData[y][x] === 0 && this.floorTiles[y][x]) {
      this.gridData[y][x] = 2
      const shinyFloorKey = this.getShinyFloorKey()
      this.floorTiles[y][x].setTexture(shinyFloorKey)

      const trail = this.add.image(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        'trail'
      )
      trail.setDepth(1)
      trail.setAlpha(0.6)

      this.tweens.add({
        targets: trail,
        alpha: 0,
        duration: 1500,
        delay: 300,
        onComplete: () => trail.destroy(),
      })

      this.cleanTrails.push(trail)
    }
  }

  checkCollisions() {
    const suctionLevel = GameState.getSkillLevel('super_suction')
    if (suctionLevel > 0) {
      const suctionRange = suctionLevel + 1
      this.trashSprites.forEach(trash => {
        if (!trash.getData('collected')) {
          const tx = trash.getData('gridX')
          const ty = trash.getData('gridY')
          const dist = Math.abs(tx - this.robotGridX) + Math.abs(ty - this.robotGridY)

          if (dist <= suctionRange) {
            this.collectTrash(trash)
          }
        }
      })
    }

    this.trashSprites.forEach(trash => {
      if (!trash.getData('collected')) {
        const tx = trash.getData('gridX')
        const ty = trash.getData('gridY')

        if (tx === this.robotGridX && ty === this.robotGridY) {
          this.collectTrash(trash)
        }
      }
    })

    this.batteryPickups.forEach(battery => {
      const bx = battery.getData('gridX')
      const by = battery.getData('gridY')

      if (bx === this.robotGridX && by === this.robotGridY) {
        this.collectBattery(battery)
      }
    })

    this.specialPickups.forEach(toy => {
      const tx = toy.getData('gridX')
      const ty = toy.getData('gridY')

      if (tx === this.robotGridX && ty === this.robotGridY) {
        this.collectToy(toy)
      }
    })

    this.obstacles.forEach(obs => {
      if (obs.getData('type') === 'water' && !obs.getData('cleaned')) {
        const ox = obs.getData('gridX')
        const oy = obs.getData('gridY')

        if (ox === this.robotGridX && oy === this.robotGridY) {
          this.cleanWater(obs)
        }
      }
    })
  }

  cleanWater(obs: Phaser.GameObjects.Image) {
    obs.setData('cleaned', true)

    this.sparkleEmitter.setPosition(obs.x, obs.y)
    this.sparkleEmitter.explode(8)

    this.tweens.add({
      targets: obs,
      alpha: 0,
      scale: 0.5,
      duration: 300,
      onComplete: () => obs.destroy(),
    })

    const popup = this.add.text(obs.x, obs.y - 10, '+5💧', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#4169E1',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(50)

    this.tweens.add({
      targets: popup,
      y: popup.y - 20,
      alpha: 0,
      duration: 500,
      onComplete: () => popup.destroy(),
    })

    this.score += 5
    SoundManager.playCollect()
  }

  showDamageEffect() {
    const flash = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0xff0000,
      0.4
    ).setDepth(150)

    this.cameras.main.shake(100, 0.015)

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy(),
    })

    const warning = this.add.text(this.robot.x, this.robot.y - 20, '⚠️', {
      fontSize: '16px',
    }).setOrigin(0.5).setDepth(160)

    this.tweens.add({
      targets: warning,
      y: warning.y - 15,
      alpha: 0,
      duration: 500,
      onComplete: () => warning.destroy(),
    })
  }

  showSmallDamageEffect() {
    const flash = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0xff6600,
      0.15
    ).setDepth(150)

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 150,
      onComplete: () => flash.destroy(),
    })
  }

  collectTrash(trash: Phaser.GameObjects.Sprite) {
    trash.setData('collected', true)

    this.sparkleEmitter.setPosition(trash.x, trash.y)
    this.sparkleEmitter.explode(10)

    this.tweens.add({
      targets: trash,
      alpha: 0,
      scale: 1.5,
      duration: 200,
      onComplete: () => trash.destroy(),
    })

    const popup = this.add.text(trash.x, trash.y - 10, '+10', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(50)

    this.tweens.add({
      targets: popup,
      y: popup.y - 20,
      alpha: 0,
      duration: 500,
      onComplete: () => popup.destroy(),
    })

    this.score += 10
    this.collectedTrash++
    SoundManager.playCollect()
    this.updateCleanPercent()

    const tx = trash.getData('gridX')
    const ty = trash.getData('gridY')
    if (this.gridData[ty][tx] === 0 && this.floorTiles[ty][tx]) {
      this.gridData[ty][tx] = 2
      const shinyFloorKey = this.getShinyFloorKey()
      const tile = this.floorTiles[ty][tx]
      this.tweens.add({
        targets: tile,
        alpha: 0,
        duration: 100,
        onComplete: () => {
          if (tile) {
            tile.setTexture(shinyFloorKey)
            tile.setAlpha(0)
            this.tweens.add({
              targets: tile,
              alpha: 1,
              duration: 200,
            })
          }
        },
      })
    }
  }

  private getShinyFloorKey(): string {
    const floorType = this.levelConfig.floorType || 'wood'
    if (floorType === 'tile') return 'floor_shiny_tile'
    if (floorType === 'carpet') return 'floor_shiny_carpet'
    return 'floor_shiny'
  }

  collectBattery(battery: Phaser.GameObjects.Image) {
    this.tweens.add({
      targets: battery,
      alpha: 0,
      scale: 0,
      duration: 200,
      onComplete: () => battery.destroy(),
    })

    this.health = Math.min(this.maxHealth, this.health + 30)

    const popup = this.add.text(battery.x, battery.y - 10, '+30⚡', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#32cd32',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(50)

    this.tweens.add({
      targets: popup,
      y: popup.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => popup.destroy(),
    })

    const flash = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x32cd32,
      0.3
    ).setDepth(200)

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy(),
    })

    SoundManager.playBattery()
  }

  collectToy(toy: Phaser.GameObjects.Image) {
    this.tweens.add({
      targets: toy,
      alpha: 0,
      scale: 0,
      duration: 200,
      onComplete: () => toy.destroy(),
    })

    const bonus = 25
    this.score += bonus

    const popup = this.add.text(toy.x, toy.y - 10, `+${bonus}🌟`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#FF6B6B',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(50)

    this.tweens.add({
      targets: popup,
      y: popup.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => popup.destroy(),
    })

    this.sparkleEmitter.setPosition(toy.x, toy.y)
    this.sparkleEmitter.explode(15)

    SoundManager.playCollect()
  }

  updateCleanPercent() {
    if (this.totalTrash > 0) {
      this.cleanPercent = Math.round((this.collectedTrash / this.totalTrash) * 100)
      if (this.cleanPercent >= 100) {
        this.onVictory()
      }
    }
  }

  onVictory() {
    GameState.updateHighScore(this.score)

    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 100, () => {
        const x = Phaser.Math.Between(50, this.cameras.main.width - 50)
        const y = Phaser.Math.Between(50, this.cameras.main.height - 50)
        this.sparkleEmitter.setPosition(x, y)
        this.sparkleEmitter.explode(20)
      })
    }

    const flash = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x00ff88,
      0.4
    ).setDepth(200)

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 500,
      onComplete: () => flash.destroy(),
    })

    SoundManager.playVictory()

    this.time.delayedCall(500, () => {
      this.scene.start('VictoryScene', {
        score: this.score,
        cleanPercent: this.cleanPercent,
        healthRemaining: this.health,
      })
    })
  }

  drainHealth() {
    const ecoLevel = GameState.getSkillLevel('eco_mode')
    const ecoMultiplier = 1 - (ecoLevel * 0.2)

    this.health -= 0.006 * ecoMultiplier

    if (this.isMoving) {
      this.health -= 0.012 * ecoMultiplier
    }

    let touchingObstacle = false
    let obstacleType = ''

    this.obstacles.forEach(obs => {
      const ox = obs.getData('gridX')
      const oy = obs.getData('gridY')
      const type = obs.getData('type')

      if (ox === this.robotGridX && oy === this.robotGridY && !obs.getData('cleaned')) {
        touchingObstacle = true
        obstacleType = type

        if (type === 'cable') {
          this.health -= 2.0 * ecoMultiplier
        } else if (type === 'poop') {
          this.health -= 4.0 * ecoMultiplier
        }
      }
    })

    if (touchingObstacle && !this.isMoving) {
      if (obstacleType === 'poop') {
        if (Math.random() < 0.1) {
          this.showDamageEffect()
        }
      } else if (obstacleType === 'cable') {
        if (Math.random() < 0.05) {
          this.showSmallDamageEffect()
        }
      }
    }

    this.health = Math.max(0, Math.min(this.maxHealth, this.health))
  }

  updateUI() {
    this.healthText.setText(`${Math.round(this.health)}%`)
    this.scoreText.setText(`分数: ${this.score}`)
    this.cleanText.setText(`🧹 ${this.cleanPercent}%`)
    this.updateHealthBar()
  }

  checkGameOver() {
    if (this.health <= 0 && !this.isGameOver) {
      this.isGameOver = true
      GameState.updateHighScore(this.score)
      SoundManager.playGameOver()

      this.cameras.main.shake(300, 0.02)
      this.time.delayedCall(300, () => {
        this.scene.start('GameOverScene', {
          score: this.score,
          cleanPercent: this.cleanPercent,
          healthRemaining: this.health,
        })
      })
    }
  }
}