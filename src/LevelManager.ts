// Level configurations - Open floor plan style
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
  // Level 1: 客厅 - Open living room with TV area, sofa area, dining area
  {
    id: 1,
    name: '客厅',
    theme: '现代客厅',
    trashCount: 25,
    cableCount: 3,
    batteryCount: 4,
    poopCount: 0,
    waterCount: 2,
    toyCount: 2,
    baseHealth: 100,
    // Outer walls + interior partitions
    walls: [
      // Outer boundary (automatic from grid, but adding explicit)
      // TV wall - long continuous
      { x: 1, y: 15, w: 18, h: 1 },
      // Sofa back - partial wall
      { x: 4, y: 11, w: 8, h: 1 },
      // Side bookshelf wall
      { x: 26, y: 10, w: 1, h: 7 },
      // TV cabinet unit
      { x: 2, y: 16, w: 6, h: 1 },
      // Dining area partition
      { x: 20, y: 12, w: 6, h: 1 },
      // Plant corner
      { x: 27, y: 17, w: 2, h: 1 },
    ],
    furniture: [
      { type: 'sofa', x: 8, y: 12 },
      { type: 'table', x: 15, y: 10 },
      { type: 'cabinet', x: 28, y: 6 },
    ],
    floorType: 'wood',
  },
  // Level 2: 主卧 - Bedroom with bed, wardrobe, windowsill area
  {
    id: 2,
    name: '主卧',
    theme: '温馨卧室',
    trashCount: 20,
    cableCount: 3,
    batteryCount: 3,
    poopCount: 1,
    waterCount: 1,
    toyCount: 1,
    baseHealth: 100,
    walls: [
      // Bed headboard wall
      { x: 2, y: 6, w: 10, h: 1 },
      // Wardrobe full height
      { x: 25, y: 4, w: 1, h: 10 },
      // Window seating
      { x: 15, y: 14, w: 7, h: 1 },
      // Dressing table partition
      { x: 3, y: 12, w: 5, h: 1 },
      // Bedside table
      { x: 14, y: 6, w: 2, h: 1 },
    ],
    furniture: [
      { type: 'bed', x: 7, y: 9 },
      { type: 'cabinet', x: 4, y: 8 },
      { type: 'chair', x: 18, y: 15 },
    ],
    floorType: 'carpet',
  },
  // Level 3: 厨房 - Large kitchen with island, counters
  {
    id: 3,
    name: '厨房',
    theme: '开放式厨房',
    trashCount: 28,
    cableCount: 4,
    batteryCount: 4,
    poopCount: 0,
    waterCount: 2,
    toyCount: 1,
    baseHealth: 100,
    walls: [
      // L-shaped counter top
      { x: 1, y: 4, w: 12, h: 1 },
      { x: 1, y: 4, w: 1, h: 8 },
      // Lower counter
      { x: 1, y: 11, w: 7, h: 1 },
      // Kitchen island
      { x: 15, y: 9, w: 7, h: 1 },
      // Fridge wall
      { x: 26, y: 4, w: 1, h: 7 },
      // Pantry
      { x: 27, y: 12, w: 2, h: 1 },
    ],
    furniture: [
      { type: 'table', x: 18, y: 14 },
      { type: 'chair', x: 14, y: 14 },
      { type: 'chair', x: 22, y: 14 },
    ],
    floorType: 'tile',
  },
  // Level 4: 洗手间 - Bathroom with separate areas
  {
    id: 4,
    name: '洗手间',
    theme: '现代卫生间',
    trashCount: 15,
    cableCount: 2,
    batteryCount: 3,
    poopCount: 2,
    waterCount: 3,
    toyCount: 0,
    baseHealth: 100,
    walls: [
      // Vanity counter
      { x: 1, y: 6, w: 10, h: 1 },
      // Shower enclosure
      { x: 21, y: 3, w: 1, h: 10 },
      // Toilet partition
      { x: 12, y: 12, w: 6, h: 1 },
      // Storage niche
      { x: 26, y: 8, w: 1, h: 6 },
      // Mirror wall
      { x: 2, y: 7, w: 6, h: 1 },
    ],
    furniture: [
      { type: 'bathtub', x: 24, y: 14 },
    ],
    floorType: 'tile',
  },
  // Level 5: 儿童房 - Kids room with play zones
  {
    id: 5,
    name: '儿童房',
    theme: '童趣天地',
    trashCount: 25,
    cableCount: 3,
    batteryCount: 4,
    poopCount: 1,
    waterCount: 2,
    toyCount: 5,
    baseHealth: 95,
    walls: [
      // Lower bunk back
      { x: 2, y: 7, w: 8, h: 1 },
      // Desk
      { x: 15, y: 8, w: 9, h: 1 },
      // Toy shelf
      { x: 25, y: 10, w: 1, h: 6 },
      // Bookshelf
      { x: 8, y: 14, w: 6, h: 1 },
      // Play area corner
      { x: 2, y: 16, w: 4, h: 1 },
    ],
    furniture: [
      { type: 'bed', x: 5, y: 9 },
      { type: 'table', x: 19, y: 11 },
      { type: 'bookshelf', x: 3, y: 17 },
      { type: 'chair', x: 27, y: 8 },
    ],
    floorType: 'carpet',
  },
  // Level 6: 阳台 - Balcony with planting areas
  {
    id: 6,
    name: '阳台',
    theme: '阳光花园',
    trashCount: 22,
    cableCount: 3,
    batteryCount: 4,
    poopCount: 0,
    waterCount: 3,
    toyCount: 1,
    baseHealth: 100,
    walls: [
      // Planter left
      { x: 1, y: 4, w: 6, h: 1 },
      { x: 1, y: 4, w: 1, h: 5 },
      // Planter right
      { x: 22, y: 3, w: 6, h: 1 },
      { x: 27, y: 3, w: 1, h: 7 },
      // Drying rack
      { x: 11, y: 11, w: 8, h: 1 },
      // Storage unit
      { x: 15, y: 4, w: 1, h: 4 },
    ],
    furniture: [
      { type: 'chair', x: 14, y: 7 },
      { type: 'chair', x: 19, y: 7 },
    ],
    floorType: 'tile',
  },
  // Level 7: 餐厅 - Dining room with sideboard
  {
    id: 7,
    name: '餐厅',
    theme: '雅致餐厅',
    trashCount: 20,
    cableCount: 2,
    batteryCount: 3,
    poopCount: 0,
    waterCount: 1,
    toyCount: 0,
    baseHealth: 100,
    walls: [
      // Sideboard
      { x: 1, y: 4, w: 10, h: 1 },
      // Window bench
      { x: 17, y: 13, w: 10, h: 1 },
      // Decorative shelf
      { x: 25, y: 5, w: 1, h: 5 },
      // Server area
      { x: 12, y: 7, w: 4, h: 1 },
    ],
    furniture: [
      { type: 'table', x: 14, y: 10 },
      { type: 'chair', x: 10, y: 10 },
      { type: 'chair', x: 18, y: 10 },
      { type: 'chair', x: 14, y: 6 },
      { type: 'chair', x: 14, y: 14 },
    ],
    floorType: 'wood',
  },
  // Level 8: 书房 - Study with large desk and bookshelves
  {
    id: 8,
    name: '书房',
    theme: '静谧书房',
    trashCount: 18,
    cableCount: 5,
    batteryCount: 2,
    poopCount: 0,
    waterCount: 1,
    toyCount: 0,
    baseHealth: 100,
    walls: [
      // Large desk
      { x: 2, y: 9, w: 12, h: 1 },
      // Left bookshelf
      { x: 17, y: 4, w: 1, h: 9 },
      // Right bookshelf
      { x: 25, y: 3, w: 1, h: 10 },
      // Monitor stand
      { x: 14, y: 5, w: 2, h: 3 },
      // Filing cabinet
      { x: 2, y: 14, w: 5, h: 1 },
    ],
    furniture: [
      { type: 'table', x: 8, y: 12 },
      { type: 'bookshelf', x: 3, y: 6 },
      { type: 'chair', x: 21, y: 9 },
    ],
    floorType: 'wood',
  },
  // Level 9: 玄关 - Entryway with shoe storage
  {
    id: 9,
    name: '玄关',
    theme: '温馨入口',
    trashCount: 15,
    cableCount: 2,
    batteryCount: 2,
    poopCount: 1,
    waterCount: 1,
    toyCount: 2,
    baseHealth: 100,
    walls: [
      // Shoe cabinet
      { x: 1, y: 7, w: 8, h: 1 },
      // Bench
      { x: 15, y: 11, w: 7, h: 1 },
      // Coat closet
      { x: 26, y: 4, w: 1, h: 8 },
      // Mirror panel
      { x: 10, y: 4, w: 1, h: 5 },
      // Umbrella stand
      { x: 23, y: 14, w: 2, h: 1 },
    ],
    furniture: [
      { type: 'cabinet', x: 4, y: 9 },
      { type: 'chair', x: 18, y: 13 },
    ],
    floorType: 'tile',
  },
  // Level 10: 储藏室 - Storage with workbench
  {
    id: 10,
    name: '储藏室',
    theme: '杂物仓库',
    trashCount: 30,
    cableCount: 5,
    batteryCount: 4,
    poopCount: 2,
    waterCount: 2,
    toyCount: 2,
    baseHealth: 90,
    walls: [
      // Left shelving
      { x: 1, y: 4, w: 1, h: 10 },
      { x: 1, y: 13, w: 6, h: 1 },
      // Workbench
      { x: 11, y: 9, w: 8, h: 1 },
      // Right shelving
      { x: 24, y: 3, w: 1, h: 9 },
      { x: 22, y: 10, w: 5, h: 1 },
      // Stacked boxes
      { x: 17, y: 15, w: 5, h: 1 },
      // Tool rack
      { x: 7, y: 5, w: 3, h: 1 },
    ],
    furniture: [
      { type: 'cabinet', x: 3, y: 5 },
      { type: 'table', x: 14, y: 11 },
      { type: 'bookshelf', x: 27, y: 4 },
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