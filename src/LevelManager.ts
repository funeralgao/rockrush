// Level configurations - Large world layout
export interface LevelConfig {
  id: number
  name: string
  theme: string
  trashCount: number
  cableCount: number
  batteryCount: number
  poopCount: number
  waterCount: number
  toyCount: number
  baseHealth: number
  walls: { x: number; y: number; w: number; h: number }[]
  furniture: { type: string; x: number; y: number }[]
  floorType: string
}

export const LEVELS: LevelConfig[] = [
  // Level 1: 客厅 - Large open living room (60x45 map)
  {
    id: 1,
    name: '客厅',
    theme: '现代客厅',
    trashCount: 35,
    cableCount: 4,
    batteryCount: 5,
    poopCount: 0,
    waterCount: 3,
    toyCount: 3,
    baseHealth: 100,
    walls: [
      // TV area wall (top)
      { x: 5, y: 8, w: 25, h: 1 },
      // Sofa back wall (middle-left)
      { x: 8, y: 20, w: 15, h: 1 },
      // Bookshelf wall (right side)
      { x: 50, y: 10, w: 1, h: 15 },
      // Dining partition (center-right)
      { x: 40, y: 25, w: 12, h: 1 },
      // Counter top (bottom-left)
      { x: 5, y: 35, w: 20, h: 1 },
      // Plant corner (bottom-right)
      { x: 52, y: 38, w: 5, h: 1 },
    ],
    furniture: [
      { type: 'sofa', x: 15, y: 26 },
      { type: 'table', x: 30, y: 18 },
      { type: 'cabinet', x: 55, y: 12 },
      { type: 'chair', x: 48, y: 28 },
    ],
    floorType: 'wood',
  },
  // Level 2: 主卧 - Large bedroom
  {
    id: 2,
    name: '主卧',
    theme: '温馨卧室',
    trashCount: 30,
    cableCount: 4,
    batteryCount: 4,
    poopCount: 2,
    waterCount: 2,
    toyCount: 2,
    baseHealth: 100,
    walls: [
      // Bed headboard (top-left area)
      { x: 5, y: 10, w: 20, h: 1 },
      // Wardrobe (right side)
      { x: 50, y: 8, w: 1, h: 20 },
      // Window seating (bottom)
      { x: 30, y: 38, w: 15, h: 1 },
      // Dressing table partition
      { x: 8, y: 25, w: 12, h: 1 },
      // Closet (bottom-right)
      { x: 48, y: 32, w: 8, h: 1 },
    ],
    furniture: [
      { type: 'bed', x: 15, y: 18 },
      { type: 'cabinet', x: 10, y: 16 },
      { type: 'chair', x: 38, y: 40 },
      { type: 'bookshelf', x: 55, y: 20 },
    ],
    floorType: 'carpet',
  },
  // Level 3: 厨房 - Large kitchen
  {
    id: 3,
    name: '厨房',
    theme: '开放式厨房',
    trashCount: 40,
    cableCount: 5,
    batteryCount: 5,
    poopCount: 0,
    waterCount: 3,
    toyCount: 2,
    baseHealth: 100,
    walls: [
      // L-shaped counter (top-left)
      { x: 3, y: 8, w: 25, h: 1 },
      { x: 3, y: 8, w: 1, h: 15 },
      // Lower counter
      { x: 3, y: 22, w: 15, h: 1 },
      // Kitchen island (center)
      { x: 30, y: 18, w: 15, h: 1 },
      // Fridge wall (right)
      { x: 55, y: 8, w: 1, h: 15 },
      // Pantry
      { x: 50, y: 28, w: 8, h: 1 },
    ],
    furniture: [
      { type: 'table', x: 38, y: 30 },
      { type: 'chair', x: 32, y: 30 },
      { type: 'chair', x: 44, y: 30 },
      { type: 'cabinet', x: 58, y: 12 },
    ],
    floorType: 'tile',
  },
  // Level 4: 洗手间 - Large bathroom
  {
    id: 4,
    name: '洗手间',
    theme: '现代卫生间',
    trashCount: 25,
    cableCount: 3,
    batteryCount: 4,
    poopCount: 3,
    waterCount: 4,
    toyCount: 0,
    baseHealth: 100,
    walls: [
      // Vanity counter (top)
      { x: 5, y: 10, w: 20, h: 1 },
      // Shower enclosure (right)
      { x: 45, y: 6, w: 1, h: 20 },
      // Toilet partition (center)
      { x: 25, y: 25, w: 15, h: 1 },
      // Storage niche
      { x: 52, y: 18, w: 1, h: 12 },
      // Mirror wall
      { x: 5, y: 14, w: 15, h: 1 },
    ],
    furniture: [
      { type: 'bathtub', x: 50, y: 32 },
      { type: 'cabinet', x: 8, y: 8 },
    ],
    floorType: 'tile',
  },
  // Level 5: 儿童房 - Kids room
  {
    id: 5,
    name: '儿童房',
    theme: '童趣天地',
    trashCount: 35,
    cableCount: 4,
    batteryCount: 5,
    poopCount: 2,
    waterCount: 3,
    toyCount: 8,
    baseHealth: 95,
    walls: [
      // Lower bunk back
      { x: 5, y: 15, w: 18, h: 1 },
      // Desk
      { x: 30, y: 16, w: 20, h: 1 },
      // Toy shelf (right)
      { x: 52, y: 20, w: 1, h: 15 },
      // Bookshelf (center-bottom)
      { x: 18, y: 30, w: 15, h: 1 },
      // Play area corner
      { x: 5, y: 35, w: 10, h: 1 },
    ],
    furniture: [
      { type: 'bed', x: 12, y: 22 },
      { type: 'table', x: 40, y: 24 },
      { type: 'bookshelf', x: 8, y: 38 },
      { type: 'chair', x: 55, y: 16 },
    ],
    floorType: 'carpet',
  },
  // Level 6: 阳台 - Balcony
  {
    id: 6,
    name: '阳台',
    theme: '阳光花园',
    trashCount: 30,
    cableCount: 4,
    batteryCount: 5,
    poopCount: 0,
    waterCount: 4,
    toyCount: 2,
    baseHealth: 100,
    walls: [
      // Planter left
      { x: 3, y: 8, w: 12, h: 1 },
      { x: 3, y: 8, w: 1, h: 12 },
      // Planter right
      { x: 45, y: 6, w: 12, h: 1 },
      { x: 56, y: 6, w: 1, h: 15 },
      // Drying rack (center)
      { x: 22, y: 22, w: 18, h: 1 },
      // Storage unit
      { x: 32, y: 8, w: 1, h: 10 },
    ],
    furniture: [
      { type: 'chair', x: 28, y: 14 },
      { type: 'chair', x: 38, y: 14 },
      { type: 'table', x: 50, y: 30 },
    ],
    floorType: 'tile',
  },
  // Level 7: 餐厅 - Dining room
  {
    id: 7,
    name: '餐厅',
    theme: '雅致餐厅',
    trashCount: 30,
    cableCount: 3,
    batteryCount: 4,
    poopCount: 0,
    waterCount: 2,
    toyCount: 0,
    baseHealth: 100,
    walls: [
      // Sideboard (top)
      { x: 5, y: 8, w: 22, h: 1 },
      // Window bench (bottom)
      { x: 35, y: 35, w: 20, h: 1 },
      // Decorative shelf (right)
      { x: 52, y: 10, w: 1, h: 12 },
      // Server area (center-left)
      { x: 25, y: 15, w: 10, h: 1 },
    ],
    furniture: [
      { type: 'table', x: 30, y: 22 },
      { type: 'chair', x: 22, y: 22 },
      { type: 'chair', x: 38, y: 22 },
      { type: 'chair', x: 30, y: 14 },
      { type: 'chair', x: 30, y: 30 },
    ],
    floorType: 'wood',
  },
  // Level 8: 书房 - Study
  {
    id: 8,
    name: '书房',
    theme: '静谧书房',
    trashCount: 28,
    cableCount: 6,
    batteryCount: 3,
    poopCount: 0,
    waterCount: 2,
    toyCount: 0,
    baseHealth: 100,
    walls: [
      // Large desk (center-left)
      { x: 5, y: 18, w: 25, h: 1 },
      // Left bookshelf
      { x: 35, y: 8, w: 1, h: 18 },
      // Right bookshelf
      { x: 52, y: 6, w: 1, h: 20 },
      // Monitor stand
      { x: 28, y: 10, w: 5, h: 6 },
      // Filing cabinet
      { x: 5, y: 30, w: 12, h: 1 },
    ],
    furniture: [
      { type: 'table', x: 18, y: 26 },
      { type: 'bookshelf', x: 8, y: 12 },
      { type: 'chair', x: 42, y: 18 },
      { type: 'cabinet', x: 56, y: 8 },
    ],
    floorType: 'wood',
  },
  // Level 9: 玄关 - Entryway
  {
    id: 9,
    name: '玄关',
    theme: '温馨入口',
    trashCount: 25,
    cableCount: 3,
    batteryCount: 3,
    poopCount: 2,
    waterCount: 2,
    toyCount: 3,
    baseHealth: 100,
    walls: [
      // Shoe cabinet (left)
      { x: 3, y: 15, w: 18, h: 1 },
      // Bench (center)
      { x: 30, y: 22, w: 15, h: 1 },
      // Coat closet (right)
      { x: 52, y: 8, w: 1, h: 18 },
      // Mirror panel
      { x: 22, y: 8, w: 1, h: 12 },
      // Umbrella stand
      { x: 48, y: 30, w: 5, h: 1 },
    ],
    furniture: [
      { type: 'cabinet', x: 10, y: 20 },
      { type: 'chair', x: 38, y: 28 },
      { type: 'table', x: 55, y: 18 },
    ],
    floorType: 'tile',
  },
  // Level 10: 储藏室 - Storage
  {
    id: 10,
    name: '储藏室',
    theme: '杂物仓库',
    trashCount: 45,
    cableCount: 6,
    batteryCount: 5,
    poopCount: 3,
    waterCount: 3,
    toyCount: 3,
    baseHealth: 90,
    walls: [
      // Left shelving
      { x: 3, y: 8, w: 1, h: 20 },
      { x: 3, y: 27, w: 15, h: 1 },
      // Workbench (center)
      { x: 22, y: 18, w: 18, h: 1 },
      // Right shelving
      { x: 50, y: 6, w: 1, h: 18 },
      { x: 45, y: 20, w: 12, h: 1 },
      // Stacked boxes (bottom)
      { x: 35, y: 32, w: 12, h: 1 },
      // Tool rack
      { x: 15, y: 10, w: 8, h: 1 },
    ],
    furniture: [
      { type: 'cabinet', x: 8, y: 10 },
      { type: 'table', x: 30, y: 24 },
      { type: 'bookshelf', x: 56, y: 8 },
      { type: 'chair', x: 20, y: 35 },
    ],
    floorType: 'tile',
  },
]

export function getLevelConfig(level: number): LevelConfig {
  const levelIndex = ((level - 1) % LEVELS.length)
  return LEVELS[levelIndex]
}

export function getTotalLevels(): number {
  return LEVELS.length
}