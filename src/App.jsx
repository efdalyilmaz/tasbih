import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedSound, setSelectedSound] = useState('bell')
  const [showSoundMenu, setShowSoundMenu] = useState(false)
  const audioRef = useRef(null)

  // Ses efektleri tanımları
  const soundEffects = {
    bell: {
      name: '🔔 Çan',
      click: { freq: 800, duration: 0.1, type: 'sine' },
      reset: { freq: 400, duration: 0.2, type: 'sine' },
      complete: { freq: 1200, duration: 0.3, type: 'sine' }
    },
    chime: {
      name: '🎵 Melodi',
      click: { freq: 523, duration: 0.15, type: 'triangle' },
      reset: { freq: 262, duration: 0.25, type: 'triangle' },
      complete: { freq: 1047, duration: 0.4, type: 'triangle' }
    },
    click: {
      name: '🖱️ Tıklama',
      click: { freq: 2000, duration: 0.05, type: 'square' },
      reset: { freq: 1500, duration: 0.1, type: 'square' },
      complete: { freq: 2500, duration: 0.15, type: 'square' }
    },
    nature: {
      name: '🌿 Doğa',
      click: { freq: 600, duration: 0.2, type: 'sawtooth' },
      reset: { freq: 300, duration: 0.3, type: 'sawtooth' },
      complete: { freq: 900, duration: 0.5, type: 'sawtooth' }
    },
    meditation: {
      name: '🧘 Meditasyon',
      click: { freq: 432, duration: 0.3, type: 'sine' },
      reset: { freq: 216, duration: 0.4, type: 'sine' },
      complete: { freq: 648, duration: 0.6, type: 'sine' }
    }
  }

  // Ses çalma fonksiyonu
  const playSound = (soundType = 'click') => {
    if (!soundEnabled) return
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const soundConfig = soundEffects[selectedSound][soundType]
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(soundConfig.freq, audioContext.currentTime)
      oscillator.type = soundConfig.type
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + soundConfig.duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + soundConfig.duration)
    } catch (error) {
      console.log('Ses çalınamadı:', error)
    }
  }

  // 99'a ulaştığında sıfırla
  useEffect(() => {
    if (count >= 99) {
      playSound('complete') // Tamamlanma sesi
      setTimeout(() => {
        setCount(0)
      }, 1000)
    }
  }, [count])

  const handleIncrement = () => {
    if (count < 99) {
      setCount(prev => prev + 1)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 200)
      playSound('click')
    }
  }

  const handleReset = () => {
    setCount(0)
    playSound('reset')
  }

  const handleSoundChange = (soundKey) => {
    setSelectedSound(soundKey)
    setShowSoundMenu(false)
    // Ses değişikliği için kısa bir ses çal
    setTimeout(() => playSound('click'), 100)
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Tasbih</h1>
        
        <div className="counter-display">
          <span className="counter">{count}</span>
          <span className="max-count">/ 99</span>
        </div>

        <div className="tasbih-container">
          <div 
            className={`tasbih ${isAnimating ? 'animate' : ''}`}
            onClick={handleIncrement}
          >
            <div className="tasbih-beads">
              {[...Array(33)].map((_, index) => (
                <div 
                  key={index} 
                  className={`bead ${index < (count % 33) ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="controls">
          <button 
            className="increment-btn"
            onClick={handleIncrement}
            disabled={count >= 99}
          >
            Artır
          </button>
          
          <button 
            className="reset-btn"
            onClick={handleReset}
          >
            Sıfırla
          </button>
        </div>

        <div className="sound-controls">
          <div className="sound-toggle">
            <button 
              className={`sound-btn ${soundEnabled ? 'enabled' : 'disabled'}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? '🔊 Ses Açık' : '🔇 Ses Kapalı'}
            </button>
          </div>

          <div className="sound-selector">
            <button 
              className="sound-select-btn"
              onClick={() => setShowSoundMenu(!showSoundMenu)}
            >
              {soundEffects[selectedSound].name} ▼
            </button>
            
            {showSoundMenu && (
              <div className="sound-menu">
                {Object.entries(soundEffects).map(([key, sound]) => (
                  <button
                    key={key}
                    className={`sound-option ${selectedSound === key ? 'selected' : ''}`}
                    onClick={() => handleSoundChange(key)}
                  >
                    {sound.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="info">
          <p>99'a ulaştığında otomatik olarak sıfırlanır</p>
          <p>Toplam: {Math.floor(count / 99)} tam tur</p>
          <p className="current-sound">Seçili Ses: {soundEffects[selectedSound].name}</p>
        </div>
      </div>
    </div>
  )
}

export default App
