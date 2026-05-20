import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Loading UI with new color scheme
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x2a2a3e, 0.95)
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 60)
    progressBox.lineStyle(2, 0xff0000, 1)
    progressBox.strokeRect(width / 2 - 160, height / 2 - 30, 320, 60)

    const titleText = this.add.text(width / 2, height / 2 - 60, 'RockRush', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 4,
    }).setOrigin(0.5)

    const loadingText = this.add.text(width / 2, height / 2 + 5, '加载中...', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5)

    const progressBar = this.add.graphics()

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0xff0000, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 40)
      loadingText.setText(`${Math.round(value * 100)}%`)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      titleText.destroy()
      loadingText.destroy()
    })

    this.generateTextures()
  }

  generateTextures() {
    // ===== ROBOT VACUUM (TOP VIEW) - Premium look =====
    const robotG = new Phaser.GameObjects.Graphics(this)

    // Drop shadow
    robotG.fillStyle(0x000000, 0.2)
    robotG.fillCircle(20, 22, 17)

    // Main body - white with gradient effect
    robotG.fillStyle(0xf8f8f8, 1)
    robotG.fillCircle(18, 18, 16)

    // Outer ring - light gray with depth
    robotG.lineStyle(2, 0xcccccc, 1)
    robotG.strokeCircle(18, 18, 16)

    // Inner ring detail
    robotG.lineStyle(1, 0xe8e8e8, 1)
    robotG.strokeCircle(18, 18, 14)

    // LDS dome (laser distance sensor) - center top
    robotG.fillStyle(0x333333, 1)
    robotG.fillCircle(18, 13, 7)
    // LDS dome highlight
    robotG.fillStyle(0x444444, 1)
    robotG.fillCircle(18, 13, 5)
    robotG.fillStyle(0x222222, 1)
    robotG.fillCircle(18, 13, 4)

    // LDS window (the rotating laser emitter) - red for brand color
    robotG.fillStyle(0xff0000, 0.9)
    robotG.fillRect(17, 8, 2, 5)
    // Laser glow
    robotG.fillStyle(0xff4444, 0.5)
    robotG.fillCircle(18, 10, 3)

    // Roborock "R" logo on LDS dome - white dot
    robotG.fillStyle(0xffffff, 1)
    robotG.fillCircle(18, 13, 2.5)

    // Center bumper line - subtle
    robotG.lineStyle(1, 0xdddddd, 1)
    robotG.lineBetween(6, 18, 30, 18)

    // Edge highlight (top-left)
    robotG.lineStyle(1, 0xffffff, 0.6)
    robotG.arc(18, 18, 15, -150 * Math.PI / 180, -90 * Math.PI / 180, false)

    robotG.generateTexture('robot', 36, 36)
    robotG.destroy()

    // ===== LASER RADAR EFFECT =====
    const radarG = new Phaser.GameObjects.Graphics(this)
    radarG.fillStyle(0xff0000, 0.08)
    radarG.fillCircle(18, 18, 18)
    radarG.fillStyle(0xff0000, 0.15)
    radarG.fillCircle(18, 18, 12)
    radarG.fillStyle(0xff0000, 0.25)
    radarG.fillCircle(18, 18, 6)
    radarG.fillStyle(0xff4444, 0.5)
    radarG.fillCircle(18, 18, 2)
    radarG.generateTexture('radar', 36, 36)
    radarG.destroy()

    // ===== TRASH/DUST - More varied and natural =====
    const trashG = new Phaser.GameObjects.Graphics(this)
    const colors = [0x8b7355, 0x9c8b7a, 0x7a6b5a, 0xa59585, 0x6b5b4a, 0x5c4d3e]
    for (let i = 0; i < 10; i++) {
      trashG.fillStyle(colors[i % colors.length], 0.9)
      const x = 3 + Math.random() * 22
      const y = 3 + Math.random() * 22
      const size = 1.5 + Math.random() * 3.5
      trashG.fillCircle(x, y, size)
    }
    // Add some smaller dust particles
    for (let i = 0; i < 5; i++) {
      trashG.fillStyle(0xaaa999, 0.5)
      trashG.fillCircle(Math.random() * 26 + 1, Math.random() * 26 + 1, 0.8)
    }
    trashG.generateTexture('trash', 28, 28)
    trashG.destroy()

    // ===== FLOOR TILES - WOOD (Premium wood grain) =====
    // Dirty wood floor with better grain
    const dirtyWoodG = new Phaser.GameObjects.Graphics(this)
    // Base color gradient effect
    dirtyWoodG.fillStyle(0xD4B896, 1)
    dirtyWoodG.fillRect(0, 0, 16, 16)
    // Wood grain lines
    dirtyWoodG.lineStyle(1, 0xc4a56a, 0.5)
    for (let i = 0; i < 4; i++) {
      dirtyWoodG.lineBetween(0, i * 4 + 1, 16, i * 4 + 1)
      dirtyWoodG.lineBetween(0, i * 4 + 3, 16, i * 4 + 3)
    }
    // Knots and variation
    dirtyWoodG.fillStyle(0xb8956e, 0.4)
    dirtyWoodG.fillCircle(4, 4, 2)
    dirtyWoodG.fillCircle(12, 8, 1.5)
    dirtyWoodG.fillCircle(8, 12, 2)
    dirtyWoodG.fillCircle(2, 10, 1)
    // Dark dirt spots
    dirtyWoodG.fillStyle(0x8b7355, 0.3)
    dirtyWoodG.fillCircle(6, 8, 1.5)
    dirtyWoodG.fillCircle(14, 4, 1)
    // Edge shading
    dirtyWoodG.fillStyle(0x000000, 0.05)
    dirtyWoodG.fillRect(0, 15, 16, 1)
    dirtyWoodG.fillRect(15, 0, 1, 16)
    dirtyWoodG.generateTexture('floor_dirty', 16, 16)
    dirtyWoodG.destroy()

    // Clean wood floor - pristine
    const cleanWoodG = new Phaser.GameObjects.Graphics(this)
    cleanWoodG.fillStyle(0xF5DEB3, 1)
    cleanWoodG.fillRect(0, 0, 16, 16)
    // Wood grain
    cleanWoodG.lineStyle(1, 0xe5ceb0, 0.4)
    for (let i = 0; i < 4; i++) {
      cleanWoodG.lineBetween(0, i * 4 + 2, 16, i * 4 + 2)
    }
    // Shine / highlight
    cleanWoodG.fillStyle(0xffffff, 0.2)
    cleanWoodG.fillRect(0, 0, 16, 3)
    cleanWoodG.fillRect(0, 0, 3, 16)
    // Subtle polish
    cleanWoodG.fillStyle(0xffffff, 0.1)
    cleanWoodG.fillRect(2, 2, 12, 12)
    cleanWoodG.generateTexture('floor_clean', 16, 16)
    cleanWoodG.destroy()

    // ===== FLOOR TILES - TILE (Polished porcelain) =====
    // Dirty tile floor
    const dirtyTileG = new Phaser.GameObjects.Graphics(this)
    dirtyTileG.fillStyle(0xC8C8C8, 1)
    dirtyTileG.fillRect(0, 0, 16, 16)
    // Grout lines
    dirtyTileG.lineStyle(1, 0x909090, 1)
    dirtyTileG.strokeRect(0.5, 0.5, 15, 15)
    // Dirt and stains
    dirtyTileG.fillStyle(0xaaaaaa, 0.4)
    dirtyTileG.fillCircle(4, 4, 2.5)
    dirtyTileG.fillCircle(12, 12, 2)
    dirtyTileG.fillCircle(8, 8, 1.5)
    dirtyTileG.fillCircle(2, 12, 1)
    // Hard water stains
    dirtyTileG.fillStyle(0x999999, 0.3)
    dirtyTileG.fillCircle(10, 3, 1.5)
    dirtyTileG.generateTexture('floor_dirty_tile', 16, 16)
    dirtyTileG.destroy()

    // Clean tile floor - glossy
    const cleanTileG = new Phaser.GameObjects.Graphics(this)
    cleanTileG.fillStyle(0xf8f8f8, 1)
    cleanTileG.fillRect(0, 0, 16, 16)
    // Grout
    cleanTileG.lineStyle(1, 0xbbbbbb, 1)
    cleanTileG.strokeRect(0.5, 0.5, 15, 15)
    // Shine / gloss effect
    cleanTileG.fillStyle(0xFFFFFF, 0.4)
    cleanTileG.fillTriangle(2, 2, 14, 2, 2, 10)
    // Secondary highlight
    cleanTileG.fillStyle(0xffffff, 0.2)
    cleanTileG.fillRect(4, 4, 8, 4)
    cleanTileG.generateTexture('floor_clean_tile', 16, 16)
    cleanTileG.destroy()

    // ===== FLOOR TILES - CARPET (Soft plush) =====
    // Dirty carpet floor - with stains
    const dirtyCarpetG = new Phaser.GameObjects.Graphics(this)
    dirtyCarpetG.fillStyle(0x8B7355, 1)
    dirtyCarpetG.fillRect(0, 0, 16, 16)
    // Carpet fiber texture
    for (let i = 0; i < 16; i++) {
      dirtyCarpetG.fillStyle(0x7A6245, 0.4)
      dirtyCarpetG.fillCircle(Math.random() * 14 + 1, Math.random() * 14 + 1, 0.8)
    }
    // Stains and marks
    dirtyCarpetG.fillStyle(0x6B5335, 0.5)
    dirtyCarpetG.fillCircle(5, 5, 3)
    dirtyCarpetG.fillCircle(12, 10, 2.5)
    dirtyCarpetG.fillCircle(8, 13, 2)
    // Dust pile
    dirtyCarpetG.fillStyle(0x5a4a3a, 0.6)
    dirtyCarpetG.fillCircle(10, 6, 2)
    dirtyCarpetG.generateTexture('floor_dirty_carpet', 16, 16)
    dirtyCarpetG.destroy()

    // Clean carpet floor - fresh
    const cleanCarpetG = new Phaser.GameObjects.Graphics(this)
    cleanCarpetG.fillStyle(0x9B8365, 1)
    cleanCarpetG.fillRect(0, 0, 16, 16)
    // Carpet texture - even fibers
    for (let i = 0; i < 18; i++) {
      cleanCarpetG.fillStyle(0x8B7355, 0.25)
      cleanCarpetG.fillCircle(1 + (i % 6) * 2.5, 1 + Math.floor(i / 6) * 3, 0.7)
    }
    // Subtle highlight
    cleanCarpetG.fillStyle(0xab9375, 0.5)
    cleanCarpetG.fillRect(2, 2, 12, 4)
    cleanCarpetG.generateTexture('floor_clean_carpet', 16, 16)
    cleanCarpetG.destroy()

    // ===== SHINY FLOOR - SUPER POLISHED =====
    // Shiny wood floor - gleaming
    const shinyWoodG = new Phaser.GameObjects.Graphics(this)
    shinyWoodG.fillStyle(0xF8E8C8, 1)
    shinyWoodG.fillRect(0, 0, 16, 16)
    // Wood grain
    shinyWoodG.lineStyle(1, 0xe8d8b8, 0.5)
    for (let i = 0; i < 4; i++) {
      shinyWoodG.lineBetween(0, i * 4 + 2, 16, i * 4 + 2)
    }
    // Strong shine lines
    shinyWoodG.fillStyle(0xffffff, 0.7)
    shinyWoodG.fillRect(0, 0, 16, 2)
    shinyWoodG.fillRect(0, 0, 2, 16)
    // Reflection streaks
    shinyWoodG.fillStyle(0xffffff, 0.4)
    shinyWoodG.fillRect(3, 3, 10, 1)
    shinyWoodG.fillRect(5, 6, 8, 1)
    shinyWoodG.fillRect(2, 10, 12, 1)
    // Glossy highlight
    shinyWoodG.fillStyle(0xfffff0, 0.3)
    shinyWoodG.fillRect(1, 1, 6, 6)
    shinyWoodG.generateTexture('floor_shiny', 16, 16)
    shinyWoodG.destroy()

    // Shiny tile floor - mirror-like
    const shinyTileG = new Phaser.GameObjects.Graphics(this)
    shinyTileG.fillStyle(0xfafafa, 1)
    shinyTileG.fillRect(0, 0, 16, 16)
    // Grout
    shinyTileG.lineStyle(1, 0xcccccc, 1)
    shinyTileG.strokeRect(0.5, 0.5, 15, 15)
    // Major shine reflection
    shinyTileG.fillStyle(0xffffff, 0.8)
    shinyTileG.fillTriangle(1, 1, 15, 1, 1, 12)
    // Secondary shine
    shinyTileG.fillStyle(0xffffff, 0.5)
    shinyTileG.fillRect(2, 2, 12, 3)
    // Glint spots
    shinyTileG.fillStyle(0xffffff, 0.9)
    shinyTileG.fillCircle(4, 4, 1.5)
    shinyTileG.fillCircle(12, 8, 1)
    shinyTileG.fillCircle(6, 12, 0.8)
    shinyTileG.generateTexture('floor_shiny_tile', 16, 16)
    shinyTileG.destroy()

    // Shiny carpet - not realistic but adding for completeness
    const shinyCarpetG = new Phaser.GameObjects.Graphics(this)
    shinyCarpetG.fillStyle(0xaB9375, 1)
    shinyCarpetG.fillRect(0, 0, 16, 16)
    // Dense fibers
    for (let i = 0; i < 20; i++) {
      shinyCarpetG.fillStyle(0x9B8365, 0.3)
      shinyCarpetG.fillCircle(1 + (i % 5) * 3, 1 + Math.floor(i / 5) * 3, 0.8)
    }
    // Shine patches
    shinyCarpetG.fillStyle(0xcbB395, 0.6)
    shinyCarpetG.fillRect(2, 2, 12, 5)
    // Glossy highlight
    shinyCarpetG.fillStyle(0xffffff, 0.25)
    shinyCarpetG.fillRect(1, 1, 8, 4)
    shinyCarpetG.generateTexture('floor_shiny_carpet', 16, 16)
    shinyCarpetG.destroy()

    // ===== WALL TILES (3D effect with depth) =====
    const wallG = new Phaser.GameObjects.Graphics(this)
    // Base wall color
    wallG.fillStyle(0x3a4a5a, 1)
    wallG.fillRect(0, 0, 16, 16)

    // Brick pattern with mortar
    wallG.fillStyle(0x4a5a6a, 1)
    wallG.fillRect(1, 1, 7, 6)
    wallG.fillRect(9, 1, 6, 6)
    wallG.fillRect(5, 9, 6, 6)
    wallG.fillRect(1, 9, 4, 6)
    wallG.fillRect(11, 9, 4, 6)

    // Top edge highlight (3D effect)
    wallG.fillStyle(0x5a6a7a, 1)
    wallG.fillRect(1, 1, 7, 2)
    wallG.fillRect(9, 1, 6, 2)
    wallG.fillRect(5, 9, 6, 2)
    wallG.fillRect(1, 9, 4, 2)
    wallG.fillRect(11, 9, 4, 2)

    // Bottom shadow
    wallG.fillStyle(0x2a3a4a, 1)
    wallG.fillRect(1, 7, 7, 1)
    wallG.fillRect(9, 7, 6, 1)
    wallG.fillRect(5, 15, 6, 1)
    wallG.fillRect(1, 15, 4, 1)
    wallG.fillRect(11, 15, 4, 1)

    // Mortar lines (grout)
    wallG.lineStyle(1, 0x2a3a4a, 1)
    wallG.strokeRect(0.5, 0.5, 15, 15)

    wallG.generateTexture('wall', 16, 16)
    wallG.destroy()

    // ===== CABLE (Thicker, more visible) =====
    const cableG = new Phaser.GameObjects.Graphics(this)
    // Main cable shadow
    cableG.lineStyle(7, 0x0a0a0a, 0.5)
    cableG.beginPath()
    cableG.moveTo(2, 22)
    cableG.lineTo(10, 10)
    cableG.lineTo(18, 22)
    cableG.lineTo(26, 10)
    cableG.strokePath()
    // Main cable
    cableG.lineStyle(6, 0x1a1a1a, 1)
    cableG.beginPath()
    cableG.moveTo(2, 20)
    cableG.lineTo(10, 8)
    cableG.lineTo(18, 20)
    cableG.lineTo(26, 8)
    cableG.strokePath()
    // Cable highlight
    cableG.lineStyle(2, 0x333333, 1)
    cableG.beginPath()
    cableG.moveTo(2, 18)
    cableG.lineTo(10, 6)
    cableG.lineTo(18, 18)
    cableG.lineTo(26, 6)
    cableG.strokePath()
    // Center connector
    cableG.fillStyle(0x444444, 1)
    cableG.fillCircle(10, 14, 3)
    cableG.fillCircle(18, 14, 3)
    cableG.generateTexture('cable', 28, 20)
    cableG.destroy()

    // ===== BATTERY PICKUP (Glowing green) =====
    const batteryG = new Phaser.GameObjects.Graphics(this)
    // Glow effect
    batteryG.fillStyle(0x00ff00, 0.15)
    batteryG.fillCircle(12, 12, 14)
    // Battery body
    batteryG.fillStyle(0x32CD32, 1)
    batteryG.fillRoundedRect(3, 5, 14, 10, 2)
    // Battery terminal
    batteryG.fillStyle(0x228B22, 1)
    batteryG.fillRoundedRect(17, 7, 4, 6, 1)
    // Lightning bolt
    batteryG.fillStyle(0xffffff, 1)
    batteryG.fillTriangle(10, 7, 8, 12, 11, 12)
    batteryG.fillTriangle(9, 11, 11, 11, 10, 15)
    // Highlight
    batteryG.fillStyle(0x44ff44, 0.5)
    batteryG.fillRect(4, 6, 6, 2)
    batteryG.generateTexture('battery', 24, 24)
    batteryG.destroy()

    // ===== PARTICLE (Dust) =====
    const particleG = new Phaser.GameObjects.Graphics(this)
    particleG.fillStyle(0xDEB887, 0.8)
    particleG.fillCircle(4, 4, 3)
    particleG.fillStyle(0xffffff, 0.3)
    particleG.fillCircle(3, 3, 1)
    particleG.generateTexture('particle', 8, 8)
    particleG.destroy()

    // ===== PET DROPPINGS (Poop - cute style) =====
    const poopG = new Phaser.GameObjects.Graphics(this)
    // Main pile - warm brown
    poopG.fillStyle(0x8B4513, 1)
    poopG.fillCircle(8, 10, 6)
    poopG.fillCircle(6, 8, 4)
    poopG.fillCircle(10, 8, 4)
    // Dark spots
    poopG.fillStyle(0x654321, 1)
    poopG.fillCircle(7, 9, 2)
    poopG.fillCircle(9, 11, 1.5)
    // Highlight
    poopG.fillStyle(0xa0522d, 0.5)
    poopG.fillCircle(6, 7, 1.5)
    // Smiley face (cute)
    poopG.fillStyle(0xffffff, 0.8)
    poopG.fillCircle(7, 8, 1)
    poopG.fillCircle(9, 8, 1)
    poopG.generateTexture('poop', 16, 16)
    poopG.destroy()

    // ===== WATER STAIN (Realistic puddle) =====
    const waterG = new Phaser.GameObjects.Graphics(this)
    // Main water puddle
    waterG.fillStyle(0x4169E1, 0.35)
    waterG.fillEllipse(12, 12, 20, 12)
    // Inner water
    waterG.fillStyle(0x5a79e1, 0.3)
    waterG.fillEllipse(12, 12, 16, 9)
    // Highlight
    waterG.fillStyle(0x87CEEB, 0.5)
    waterG.fillEllipse(9, 10, 8, 4)
    // Ripple effect
    waterG.lineStyle(1, 0x6a8fd1, 0.3)
    waterG.strokeEllipse(12, 12, 16, 10)
    waterG.lineStyle(1, 0x7a9fe1, 0.2)
    waterG.strokeEllipse(12, 12, 12, 7)
    waterG.generateTexture('water', 24, 24)
    waterG.destroy()

    // ===== SMALL TOY (Ball - colorful) =====
    const toyG = new Phaser.GameObjects.Graphics(this)
    // Ball base
    toyG.fillStyle(0xFF6B6B, 1)
    toyG.fillCircle(8, 8, 6)
    // Highlight
    toyG.fillStyle(0xFF9999, 1)
    toyG.fillCircle(6, 6, 2.5)
    toyG.fillStyle(0xFFBBBB, 0.5)
    toyG.fillCircle(5, 5, 1.5)
    // Stripe
    toyG.lineStyle(2, 0xCC5555, 0.8)
    toyG.strokeCircle(8, 8, 6)
    // Shadow
    toyG.fillStyle(0x000000, 0.1)
    toyG.fillEllipse(8, 10, 5, 2)
    toyG.generateTexture('toy', 16, 16)
    toyG.destroy()

    // ===== FURNITURE: SOFA (Modern L-shape) =====
    const sofaG = new Phaser.GameObjects.Graphics(this)
    // Shadow
    sofaG.fillStyle(0x000000, 0.15)
    sofaG.fillRoundedRect(4, 10, 28, 12, 3)

    // Sofa base - dark gray
    sofaG.fillStyle(0x4A4A5A, 1)
    sofaG.fillRoundedRect(2, 8, 28, 12, 3)
    // Sofa back
    sofaG.fillStyle(0x5A5A6A, 1)
    sofaG.fillRoundedRect(2, 2, 28, 8, 3)
    // Cushions
    sofaG.fillStyle(0x6A6A7A, 1)
    sofaG.fillRoundedRect(4, 4, 12, 6, 2)
    sofaG.fillRoundedRect(18, 4, 12, 6, 2)
    // Armrests
    sofaG.fillStyle(0x3A3A4A, 1)
    sofaG.fillRoundedRect(0, 4, 4, 14, 2)
    sofaG.fillRoundedRect(28, 4, 4, 14, 2)
    // Cushion highlights
    sofaG.fillStyle(0x7A7A8A, 0.5)
    sofaG.fillRoundedRect(5, 5, 10, 2, 1)
    sofaG.fillRoundedRect(19, 5, 10, 2, 1)
    sofaG.generateTexture('sofa', 32, 20)
    sofaG.destroy()

    // ===== FURNITURE: TABLE (Wooden dining) =====
    const tableG = new Phaser.GameObjects.Graphics(this)
    // Shadow
    tableG.fillStyle(0x000000, 0.12)
    tableG.fillRect(3, 12, 28, 6)

    // Table top - warm wood
    tableG.fillStyle(0x8B4513, 1)
    tableG.fillRoundedRect(1, 4, 30, 6, 2)
    // Table top highlight
    tableG.fillStyle(0xA0522D, 1)
    tableG.fillRect(2, 5, 28, 2)
    // Table top edge shadow
    tableG.fillStyle(0x654321, 1)
    tableG.fillRect(2, 9, 28, 1)

    // Table legs
    tableG.fillStyle(0x5D4037, 1)
    tableG.fillRect(4, 10, 3, 8)
    tableG.fillRect(25, 10, 3, 8)
    // Leg highlight
    tableG.fillStyle(0x6D5047, 1)
    tableG.fillRect(4, 10, 1, 8)
    tableG.fillRect(25, 10, 1, 8)

    tableG.generateTexture('table', 32, 18)
    tableG.destroy()

    // ===== FURNITURE: CHAIR =====
    const chairG = new Phaser.GameObjects.Graphics(this)
    // Shadow
    chairG.fillStyle(0x000000, 0.1)
    chairG.fillRoundedRect(5, 12, 16, 6, 2)

    // Seat
    chairG.fillStyle(0x8B4513, 1)
    chairG.fillRoundedRect(4, 8, 16, 6, 2)
    // Seat cushion
    chairG.fillStyle(0x9B5523, 1)
    chairG.fillRoundedRect(5, 6, 14, 5, 2)

    // Back
    chairG.fillStyle(0x654321, 1)
    chairG.fillRoundedRect(5, 2, 14, 7, 2)
    // Back cushion
    chairG.fillStyle(0x754531, 1)
    chairG.fillRoundedRect(6, 3, 12, 5, 1)

    // Legs
    chairG.fillStyle(0x5D4037, 1)
    chairG.fillRect(5, 14, 2, 6)
    chairG.fillRect(17, 14, 2, 6)
    // Leg highlights
    chairG.fillStyle(0x6D5047, 1)
    chairG.fillRect(5, 14, 1, 6)

    chairG.generateTexture('chair', 24, 20)
    chairG.destroy()

    // ===== FURNITURE: BED (Cozy with pillows) =====
    const bedG = new Phaser.GameObjects.Graphics(this)
    // Shadow
    bedG.fillStyle(0x000000, 0.12)
    bedG.fillRect(2, 4, 30, 20)

    // Bed frame - dark wood
    bedG.fillStyle(0x5D4037, 1)
    bedG.fillRect(0, 2, 32, 22)
    // Frame highlight
    bedG.fillStyle(0x6D5047, 1)
    bedG.fillRect(0, 2, 32, 2)

    // Mattress - white
    bedG.fillStyle(0xE8E8E8, 1)
    bedG.fillRoundedRect(2, 4, 28, 16, 3)
    // Mattress edge
    bedG.fillStyle(0xD8D8D8, 1)
    bedG.fillRect(2, 18, 28, 2)

    // Pillow - soft white
    bedG.fillStyle(0xF5F5F5, 1)
    bedG.fillRoundedRect(4, 5, 10, 6, 2)
    // Pillow shadow
    bedG.fillStyle(0xE5E5E5, 1)
    bedG.fillRoundedRect(4, 9, 10, 2, 1)

    // Blanket - blue
    bedG.fillStyle(0x6495ED, 1)
    bedG.fillRoundedRect(16, 10, 12, 8, 2)
    // Blanket fold
    bedG.fillStyle(0x5495DD, 1)
    bedG.fillRect(16, 10, 12, 2)
    // Blanket pattern
    bedG.fillStyle(0x7495EF, 0.5)
    bedG.fillRect(18, 12, 8, 1)

    bedG.generateTexture('bed', 32, 24)
    bedG.destroy()

    // ===== FURNITURE: CABINET (Wardrobe style) =====
    const cabinetG = new Phaser.GameObjects.Graphics(this)
    // Shadow
    cabinetG.fillStyle(0x000000, 0.12)
    cabinetG.fillRoundedRect(4, 6, 28, 20, 2)

    // Body
    cabinetG.fillStyle(0x6B4423, 1)
    cabinetG.fillRoundedRect(2, 4, 28, 20, 2)
    // Top highlight
    cabinetG.fillStyle(0x7B5033, 1)
    cabinetG.fillRect(2, 4, 28, 3)

    // Doors - slightly different wood tones
    cabinetG.fillStyle(0x8B5A2B, 1)
    cabinetG.fillRect(4, 7, 11, 15)
    cabinetG.fillStyle(0x7B4A1B, 1)
    cabinetG.fillRect(17, 7, 11, 15)

    // Door gap line
    cabinetG.fillStyle(0x5B3413, 1)
    cabinetG.fillRect(15.5, 7, 1, 15)

    // Handles - gold
    cabinetG.fillStyle(0xDAA520, 1)
    cabinetG.fillCircle(14, 14, 1.5)
    cabinetG.fillCircle(18, 14, 1.5)
    // Handle highlight
    cabinetG.fillStyle(0xEAB530, 1)
    cabinetG.fillCircle(14, 14, 0.8)
    cabinetG.fillCircle(18, 14, 0.8)

    // Top surface
    cabinetG.fillStyle(0x7B5033, 1)
    cabinetG.fillRect(1, 2, 30, 3)

    cabinetG.generateTexture('cabinet', 32, 24)
    cabinetG.destroy()

    // ===== FURNITURE: BOOKSHELF (Full of books) =====
    const shelfG = new Phaser.GameObjects.Graphics(this)
    // Shadow
    shelfG.fillStyle(0x000000, 0.1)
    shelfG.fillRect(4, 2, 28, 30)

    // Frame - dark wood
    shelfG.fillStyle(0x5D4037, 1)
    shelfG.fillRect(2, 0, 28, 32)
    // Frame highlight
    shelfG.fillStyle(0x6D5047, 1)
    shelfG.fillRect(2, 0, 28, 2)
    shelfG.fillRect(2, 0, 2, 32)

    // Shelves
    shelfG.fillStyle(0x4D3027, 1)
    shelfG.fillRect(3, 10, 26, 2)
    shelfG.fillRect(3, 20, 26, 2)

    // Books - colorful spine colors
    const bookColors = [0x8B0000, 0x006400, 0x00008B, 0x8B4513, 0x4B0082, 0xB8860B, 0x2F4F4F]
    for (let row = 0; row < 3; row++) {
      let bx = 4
      for (let i = 0; i < 6; i++) {
        const bw = 3 + Math.random() * 2
        const bh = 8 - row * 2
        shelfG.fillStyle(bookColors[(i + row) % bookColors.length], 1)
        shelfG.fillRect(bx, 28 - row * 10 - bh, bw - 1, bh)
        // Book highlight
        shelfG.fillStyle(0xffffff, 0.1)
        shelfG.fillRect(bx, 28 - row * 10 - bh, 1, bh)
        bx += bw
      }
    }

    // Some books lying down
    shelfG.fillStyle(0x6B0000, 1)
    shelfG.fillRect(4, 22, 8, 3)
    shelfG.fillStyle(0x005000, 1)
    shelfG.fillRect(20, 12, 7, 3)

    shelfG.generateTexture('bookshelf', 32, 32)
    shelfG.destroy()

    // ===== FURNITURE: BATHTUB (Modern with bubbles) =====
    const tubG = new Phaser.GameObjects.Graphics(this)
    // Shadow
    tubG.fillStyle(0x000000, 0.1)
    tubG.fillRoundedRect(2, 6, 32, 20, 4)

    // Outer tub - white ceramic
    tubG.fillStyle(0xE8E8E8, 1)
    tubG.fillRoundedRect(0, 4, 32, 20, 4)
    // Tub edge highlight
    tubG.fillStyle(0xF8F8F8, 1)
    tubG.fillRoundedRect(0, 4, 32, 4, 4)

    // Inner (water area) - light blue
    tubG.fillStyle(0xB0E0E6, 1)
    tubG.fillRoundedRect(2, 6, 28, 14, 3)
    // Water surface shimmer
    tubG.fillStyle(0xC0F0F6, 0.7)
    tubG.fillRect(3, 7, 26, 3)

    // Faucet - chrome
    tubG.fillStyle(0xC0C0C0, 1)
    tubG.fillRect(26, 0, 4, 6)
    tubG.fillCircle(28, 8, 3)
    // Faucet highlight
    tubG.fillStyle(0xE0E0E0, 1)
    tubG.fillRect(26, 0, 2, 6)

    // Bubbles
    tubG.fillStyle(0xFFFFFF, 0.7)
    tubG.fillCircle(8, 12, 2.5)
    tubG.fillCircle(14, 14, 2)
    tubG.fillCircle(20, 11, 3)
    tubG.fillCircle(11, 16, 1.5)
    tubG.fillCircle(17, 10, 1.5)
    // Bubble highlights
    tubG.fillStyle(0xFFFFFF, 0.9)
    tubG.fillCircle(7, 11, 1)
    tubG.fillCircle(13, 13, 0.8)

    tubG.generateTexture('bathtub', 32, 24)
    tubG.destroy()

    // ===== DUST SPARKLE EFFECT (Golden shimmer) =====
    const sparkleG = new Phaser.GameObjects.Graphics(this)
    // Star shape
    sparkleG.fillStyle(0xFFD700, 1)
    sparkleG.fillTriangle(8, 0, 6, 8, 10, 8)
    sparkleG.fillTriangle(8, 16, 6, 8, 10, 8)
    sparkleG.fillTriangle(0, 8, 8, 6, 8, 10)
    sparkleG.fillTriangle(16, 8, 8, 6, 8, 10)
    // Center glow
    sparkleG.fillStyle(0xFFEE88, 0.8)
    sparkleG.fillCircle(8, 8, 2)
    sparkleG.generateTexture('sparkle', 16, 16)
    sparkleG.destroy()

    // ===== CLEAN TRAIL EFFECT (Green path) =====
    const trailG = new Phaser.GameObjects.Graphics(this)
    // Soft green circle
    trailG.fillStyle(0x00ff88, 0.25)
    trailG.fillCircle(4, 4, 4)
    trailG.fillStyle(0x44ffaa, 0.2)
    trailG.fillCircle(4, 4, 2.5)
    trailG.fillStyle(0x88ffcc, 0.15)
    trailG.fillCircle(4, 4, 1.5)
    trailG.generateTexture('trail', 8, 8)
    trailG.destroy()
  }

  create() {
    this.scene.start('GameScene')
  }
}