// Complex sound manager using Web Audio API
class SoundManager {
  private static instance: SoundManager
  private audioContext: AudioContext | null = null
  private bgMusicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private bgPlaying = false
  private bgTimeoutId: number | null = null

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
    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  private playNote(frequency: number, duration: number, type: OscillatorType, volume: number = 0.3) {
    this.initAudio()
    if (!this.audioContext || !this.sfxGain) return

    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.type = type
    osc.frequency.value = frequency
    osc.connect(gain)
    gain.connect(this.sfxGain)

    gain.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    osc.start(this.audioContext.currentTime)
    osc.stop(this.audioContext.currentTime + duration)
  }

  private playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine') {
    frequencies.forEach(freq => this.playNote(freq, duration, type, 0.15))
  }

  // Collection sounds - each item has unique sound
  playCollectTrash() {
    // Rising cheerful tone for trash
    this.playNote(523, 0.08, 'sine')
    setTimeout(() => this.playNote(659, 0.08, 'sine'), 40)
    setTimeout(() => this.playNote(784, 0.12, 'sine'), 80)
  }

  playCollectBattery() {
    // Electric charging sound - ascending arpeggio
    this.playNote(523, 0.06, 'square')
    setTimeout(() => this.playNote(659, 0.06, 'square'), 50)
    setTimeout(() => this.playNote(784, 0.06, 'square'), 100)
    setTimeout(() => this.playNote(1047, 0.15, 'square'), 150)
    // Add shimmer
    setTimeout(() => this.playNote(2093, 0.2, 'sine', 0.08), 200)
  }

  playCollectToy() {
    // Fun bouncy sound for toy
    this.playNote(880, 0.06, 'triangle')
    setTimeout(() => this.playNote(1100, 0.06, 'triangle', 0.15), 60)
    setTimeout(() => this.playNote(1320, 0.06, 'triangle', 0.15), 120)
    setTimeout(() => this.playNote(1760, 0.15, 'triangle', 0.2), 180)
  }

  playCleanWater() {
    // Water splash sound
    this.playNote(200, 0.1, 'sine', 0.2)
    setTimeout(() => this.playNote(150, 0.15, 'sine', 0.15), 80)
    // Add sparkle
    setTimeout(() => this.playNote(1200, 0.1, 'sine', 0.08), 50)
    setTimeout(() => this.playNote(1800, 0.08, 'sine', 0.06), 100)
  }

  playBaseStationReset() {
    // Mechanical reset sound
    this.playNote(200, 0.1, 'square', 0.15)
    setTimeout(() => this.playNote(250, 0.1, 'square', 0.15), 100)
    setTimeout(() => this.playNote(300, 0.1, 'square', 0.15), 200)
    setTimeout(() => this.playNote(400, 0.15, 'square', 0.15), 300)
    // Completion chime
    setTimeout(() => this.playChord([523, 659, 784], 0.2, 'sine'), 400)
  }

  playObstacleHit() {
    // Dull impact for hitting obstacles
    this.playNote(80, 0.15, 'sawtooth', 0.2)
    setTimeout(() => this.playNote(60, 0.2, 'sawtooth', 0.15), 50)
  }

  playDamage() {
    // Warning alarm
    this.playNote(300, 0.1, 'square', 0.2)
    setTimeout(() => this.playNote(250, 0.1, 'square', 0.2), 100)
    setTimeout(() => this.playNote(200, 0.15, 'square', 0.15), 200)
  }

  playVictory() {
    // Triumphant fanfare
    const melody = [523, 659, 784, 1047]
    melody.forEach((freq, i) => {
      setTimeout(() => this.playChord([freq, freq * 1.25], 0.2, 'sine'), i * 150)
    })
    setTimeout(() => this.playChord([1047, 1319, 1568], 0.4, 'sine'), 600)
  }

  playGameOver() {
    // Sad descending tones
    const notes = [400, 350, 300, 250, 200]
    notes.forEach((freq, i) => {
      setTimeout(() => this.playNote(freq, 0.25, 'triangle', 0.2), i * 200)
    })
  }

  playClick() {
    this.playNote(600, 0.05, 'square', 0.2)
  }

  // Robot movement sound - subtle motor whir
  playMove() {
    this.playNote(120, 0.05, 'sawtooth', 0.05)
  }

  // Complex background music with multiple layers
  startBgMusic() {
    this.stopBgMusic() // Stop any existing music first
    this.initAudio()
    if (!this.audioContext || !this.bgMusicGain) return

    this.bgPlaying = true

    // Bass line (plays every 2 beats)
    const bassNotes = [131, 165, 196, 165]
    // Melody (plays every beat)
    const melodyNotes = [
      [262, 330], [294, 349], [330, 392], [349, 440],
      [392, 494], [349, 440], [330, 392], [294, 349]
    ]
    // Arpeggio layer
    const arpeggio = [523, 659, 784, 659, 523, 392, 330, 262]

    let beat = 0

    const playBeat = () => {
      if (!this.bgPlaying || !this.audioContext || !this.bgMusicGain) return

      const time = this.audioContext.currentTime

      // Bass on beats 0, 2, 4, 6
      if (beat % 2 === 0) {
        const bassIdx = Math.floor(beat / 2) % bassNotes.length
        const bassOsc = this.audioContext.createOscillator()
        const bassGain = this.audioContext.createGain()
        bassOsc.type = 'triangle'
        bassOsc.frequency.value = bassNotes[bassIdx]
        bassOsc.connect(bassGain)
        bassGain.connect(this.bgMusicGain)
        bassGain.gain.setValueAtTime(0.25, time)
        bassGain.gain.exponentialRampToValueAtTime(0.05, time + 0.4)
        bassOsc.start(time)
        bassOsc.stop(time + 0.5)
      }

      // Melody chord
      const melodyIdx = beat % melodyNotes.length
      const bgGain = this.bgMusicGain!
      melodyNotes[melodyIdx].forEach(freq => {
        const melOsc = this.audioContext!.createOscillator()
        const melGain = this.audioContext!.createGain()
        melOsc.type = 'sine'
        melOsc.frequency.value = freq
        melOsc.connect(melGain)
        melGain.connect(bgGain)
        melGain.gain.setValueAtTime(0.12, time)
        melGain.gain.exponentialRampToValueAtTime(0.02, time + 0.3)
        melOsc.start(time)
        melOsc.stop(time + 0.35)
      })

      // Arpeggio note (every half beat)
      const arpIdx = beat % arpeggio.length
      const arpOsc = this.audioContext.createOscillator()
      const arpGain = this.audioContext.createGain()
      arpOsc.type = 'triangle'
      arpOsc.frequency.value = arpeggio[arpIdx]
      arpOsc.connect(arpGain)
      arpGain.connect(this.bgMusicGain)
      arpGain.gain.setValueAtTime(0.06, time)
      arpGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
      arpOsc.start(time)
      arpOsc.stop(time + 0.2)

      beat++

      // Schedule next beat (500ms per beat)
      this.bgTimeoutId = window.setTimeout(playBeat, 500) as unknown as number
    }

    // Start with a drum intro
    const introBeat = () => {
      if (!this.bgPlaying || !this.audioContext || !this.bgMusicGain) return

      const time = this.audioContext.currentTime
      // Kick drum on intro
      const kick = this.audioContext.createOscillator()
      const kickGain = this.audioContext.createGain()
      kick.type = 'sine'
      kick.frequency.setValueAtTime(150, time)
      kick.frequency.exponentialRampToValueAtTime(50, time + 0.1)
      kick.connect(kickGain)
      kickGain.connect(this.bgMusicGain)
      kickGain.gain.setValueAtTime(0.3, time)
      kickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
      kick.start(time)
      kick.stop(time + 0.15)

      this.bgTimeoutId = window.setTimeout(playBeat, 500) as unknown as number
    }

    introBeat()
  }

  stopBgMusic() {
    this.bgPlaying = false
    if (this.bgTimeoutId) {
      window.clearTimeout(this.bgTimeoutId)
      this.bgTimeoutId = null
    }
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