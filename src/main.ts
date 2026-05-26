import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import MenuScene from './scenes/MenuScene'
import GameScene from './scenes/GameScene'
import GameOverScene from './scenes/GameOverScene'
import VictoryScene from './scenes/VictoryScene'
import SkillsScene from './scenes/SkillsScene'
import LevelSelectScene from './scenes/LevelSelectScene'

let game: Phaser.Game | null = null

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene, VictoryScene, SkillsScene, LevelSelectScene],
}

function startGame() {
  if (game) {
    game.destroy(true)
  }
  game = new Phaser.Game(config)
}

// Vite HMR: destroy old game before creating new one
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (game) {
      game.destroy(true)
      game = null
    }
  })
}

startGame()