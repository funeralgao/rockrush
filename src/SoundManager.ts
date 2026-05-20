// Simple sound manager using Web Audio API
class SoundManager {
  private static instance: SoundManager
  private audioContext: AudioContext | null = null
  private bgMusicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private bgMusicOscillator: OscillatorNode | null = null
  private bgPlaying = false

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  private initAudio() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
      this.bgMusicGain = this.audioContext.createGain()
      this.bgMusicGain.connect(this.audioContext.destination)
      this.bgMusicGain.gain.value = 0.15

      this.sfxGain = this.audioContext.createGain()
      this.sfxGain.connect(this.audioContext.destination)
      this.sfxGain.gain.value = 0.3
    }
  }

  // Play a simple tone for sound effects
  playTone(frequency: number, duration: number, type: OscillatorType = 'square') {
    this.initAudio()
    if (!this.audioContext || !this.sfxGain) return

    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.type = type
    osc.frequency.value = frequency
    osc.connect(gain)
    gain.connect(this.sfxGain)

    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    osc.start(this.audioContext.currentTime)
    osc.stop(this.audioContext.currentTime + duration)
  }

  // Sound effects
  playCollect() {
    this.playTone(880, 0.08, 'sine')
    setTimeout(() => this.playTone(1100, 0.08, 'sine'), 50)
  }

  playBattery() {
    this.playTone(523, 0.1, 'sine')
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 80)
    setTimeout(() => this.playTone(784, 0.15, 'sine'), 160)
  }

  playHit() {
    this.playTone(150, 0.15, 'sawtooth')
  }

  playVictory() {
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine'), i * 150)
    })
  }

  playGameOver() {
    const notes = [400, 350, 300, 250]
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'triangle'), i * 200)
    })
  }

  playClick() {
    this.playTone(600, 0.05, 'square')
  }

  // Background music - simple looping melody
  startBgMusic() {
    if (this.bgPlaying) return
    this.initAudio()
    if (!this.audioContext || !this.bgMusicGain) return

    this.bgPlaying = true
    const melody = [262, 294, 330, 349, 392, 349, 330, 294]
    let noteIndex = 0

    const playNote = () => {
      if (!this.bgPlaying || !this.audioContext || !this.bgMusicGain) return

      const osc = this.audioContext.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = melody[noteIndex]

      const gain = this.audioContext.createGain()
      osc.connect(gain)
      gain.connect(this.bgMusicGain)

      gain.gain.setValueAtTime(0.8, this.audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4)

      osc.start(this.audioContext.currentTime)
      osc.stop(this.audioContext.currentTime + 0.4)

      noteIndex = (noteIndex + 1) % melody.length
      setTimeout(playNote, 500)
    }

    playNote()
  }

  stopBgMusic() {
    this.bgPlaying = false
  }

  setMusicVolume(volume: number) {
    if (this.bgMusicGain) {
      this.bgMusicGain.gain.value = volume * 0.15
    }
  }

  setSfxVolume(volume: number) {
    if (this.sfxGain) {
      this.sfxGain.gain.value = volume * 0.3
    }
  }
}

export default SoundManager.getInstance()