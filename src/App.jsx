import { useState, useRef } from 'react'
import { Search, User, Calendar, TrendingUp, Activity, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [gameStats, setGameStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedPost, setGeneratedPost] = useState(null)
  const [showSecondaryStats, setShowSecondaryStats] = useState(true)
  const [gameInfoMode, setGameInfoMode] = useState('both') // 'date', 'opponent', 'both'
  const [gameInfoPosition, setGameInfoPosition] = useState('header') // 'header', 'top-stats', 'bottom-stats'
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [backgroundScale, setBackgroundScale] = useState(1)
  const [isDraggingBackground, setIsDraggingBackground] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [editHistory, setEditHistory] = useState([])
  const postRef = useRef(null)

  // Mock NBA players data for demo purposes
  const mockPlayers = [
    { id: 1, name: 'LeBron James', team: 'Los Angeles Lakers', position: 'SF' },
    { id: 2, name: 'Stephen Curry', team: 'Golden State Warriors', position: 'PG' },
    { id: 3, name: 'Kevin Durant', team: 'Phoenix Suns', position: 'SF' },
    { id: 4, name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'PF' },
    { id: 5, name: 'Luka Dončić', team: 'Dallas Mavericks', position: 'PG' },
    { id: 6, name: 'Jayson Tatum', team: 'Boston Celtics', position: 'SF' },
    { id: 7, name: 'Joel Embiid', team: 'Philadelphia 76ers', position: 'C' },
    { id: 8, name: 'Nikola Jokić', team: 'Denver Nuggets', position: 'C' },
  ]

  // Mock game stats data
  const generateMockStats = (playerName) => {
    return Array.from({ length: 5 }, (_, index) => ({
      game: index + 1,
      date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString(),
      opponent: `vs ${['Lakers', 'Warriors', 'Celtics', 'Heat', 'Nuggets'][index]}`,
      points: Math.floor(Math.random() * 30) + 15,
      rebounds: Math.floor(Math.random() * 12) + 3,
      assists: Math.floor(Math.random() * 10) + 2,
      steals: Math.floor(Math.random() * 3) + 1,
      blocks: Math.floor(Math.random() * 3),
      fgPercentage: (Math.random() * 0.4 + 0.4).toFixed(3),
      minutes: Math.floor(Math.random() * 10) + 30,
    }))
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const foundPlayer = mockPlayers.find(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      if (foundPlayer) {
        setSelectedPlayer(foundPlayer)
        setGameStats(generateMockStats(foundPlayer.name))
      } else {
        setError('Player not found. Try searching for: LeBron James, Stephen Curry, Kevin Durant, etc.')
        setSelectedPlayer(null)
        setGameStats([])
      }
    } catch (err) {
      setError('Error fetching player data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const generateIGPost = (game, playerName) => {
    const postData = {
      playerName,
      date: game.date,
      opponent: game.opponent,
      points: game.points,
      rebounds: game.rebounds,
      assists: game.assists,
      steals: game.steals,
      blocks: game.blocks,
      fgPercentage: game.fgPercentage,
      minutes: game.minutes
    }
    setGeneratedPost(postData)
    setShowSecondaryStats(true) // Reset to show secondary stats when generating new post
    setGameInfoMode('both') // Reset to show both date and opponent when generating new post
    setGameInfoPosition('header') // Reset to header position when generating new post
    setEditHistory([]) // Reset edit history for new post
    addToEditHistory('Post Generated', `Created IG post for ${playerName} - ${game.date}`)
  }

  // Function to track edits
  const addToEditHistory = (action, details) => {
    const timestamp = new Date().toLocaleString()
    const edit = {
      id: Date.now(),
      timestamp,
      action,
      details
    }
    setEditHistory(prev => [...prev, edit])
  }

  const removeSecondaryStats = () => {
    if (confirm('Are you sure you want to remove the detailed stats? This action cannot be undone for this post.')) {
      setShowSecondaryStats(false)
      addToEditHistory('Secondary Stats Removed', 'Removed detailed statistics (STL, BLK, FG%, MIN)')
    }
  }

  const toggleGameInfo = () => {
    const modes = ['both', 'date', 'opponent']
    const currentIndex = modes.indexOf(gameInfoMode)
    const nextIndex = (currentIndex + 1) % modes.length
    const newMode = modes[nextIndex]
    setGameInfoMode(newMode)
    
    const modeNames = {
      'both': 'Date & Opponent',
      'date': 'Date Only',
      'opponent': 'Opponent Only'
    }
    addToEditHistory('Game Info Display Changed', `Changed to show: ${modeNames[newMode]}`)
  }

  const getGameInfoContent = () => {
    if (!generatedPost) return ''
    
    switch (gameInfoMode) {
      case 'date':
        return generatedPost.date
      case 'opponent':
        return generatedPost.opponent.toUpperCase()
      case 'both':
      default:
        return `${generatedPost.date} • ${generatedPost.opponent.toUpperCase()}`
    }
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'game-info')
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.5'
    // Add visual feedback to all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
      zone.classList.add('drag-active')
    })
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    // Remove visual feedback from all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
      zone.classList.remove('drag-active', 'drag-over')
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    // Only remove if we're actually leaving the element (not just entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over')
    }
  }

  const handleDrop = (e, position) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    if (data === 'game-info') {
      const oldPosition = gameInfoPosition
      setGameInfoPosition(position)
      
      const positionNames = {
        'header': 'Header',
        'top-stats': 'Stats Section', 
        'bottom-stats': 'Bottom Section'
      }
      addToEditHistory('Game Info Moved', `Moved from ${positionNames[oldPosition]} to ${positionNames[position]}`)
    }
    // Clean up visual feedback
    e.currentTarget.classList.remove('drag-over')
  }

  const renderGameInfo = () => (
    <p 
      className="ig-game-info draggable" 
      onClick={toggleGameInfo}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {getGameInfoContent()}
    </p>
  )

  const closePost = () => {
    setGeneratedPost(null)
  }

  // Background image handling functions
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImage(event.target.result)
        setBackgroundPosition({ x: 0, y: 0 })
        setBackgroundScale(1)
        addToEditHistory('Background Image Added', `Uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBackgroundImage = () => {
    setBackgroundImage(null)
    setBackgroundPosition({ x: 0, y: 0 })
    setBackgroundScale(1)
    addToEditHistory('Background Image Removed', 'Removed custom background image')
  }

  const handleBackgroundMouseDown = (e) => {
    if (!backgroundImage) return
    e.preventDefault()
    setIsDraggingBackground(true)
    setDragStart({
      x: e.clientX - backgroundPosition.x,
      y: e.clientY - backgroundPosition.y
    })
  }

  const handleBackgroundMouseMove = (e) => {
    if (!isDraggingBackground || !backgroundImage) return
    e.preventDefault()
    setBackgroundPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleBackgroundMouseUp = () => {
    if (isDraggingBackground) {
      addToEditHistory('Background Position Changed', `Repositioned to (${backgroundPosition.x}, ${backgroundPosition.y})`)
    }
    setIsDraggingBackground(false)
  }

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value)
    setBackgroundScale(newScale)
    addToEditHistory('Background Scale Changed', `Scaled to ${newScale.toFixed(1)}x`)
  }

  const saveAsPNG = async () => {
    if (postRef.current) {
      try {
        const canvas = await html2canvas(postRef.current, {
          backgroundColor: null,
          scale: 2, // Higher quality
          useCORS: true,
          allowTaint: true
        })
        
        const link = document.createElement('a')
        const filename = `${generatedPost.playerName.replace(/\s+/g, '_')}_stats_${generatedPost.date.replace(/\//g, '-')}`
        link.download = `${filename}.png`
        link.href = canvas.toDataURL()
        link.click()

        // Save edit history as text file
        addToEditHistory('Image Saved', `Exported as PNG: ${filename}.png`)
        saveEditHistory(filename)
        
      } catch (error) {
        console.error('Error saving image:', error)
        alert('Error saving image. Please try again.')
      }
    }
  }

  const saveEditHistory = (filename) => {
    if (editHistory.length === 0) return

    const historyText = `NBA Stats IG Card - Edit History
Generated: ${new Date().toLocaleString()}
Player: ${generatedPost.playerName}
Game Date: ${generatedPost.date}
Stats: ${generatedPost.points}pts, ${generatedPost.rebounds}reb, ${generatedPost.assists}ast

=== EDIT HISTORY ===
${editHistory.map((edit, index) => 
  `${index + 1}. [${edit.timestamp}] ${edit.action}
   ${edit.details}`
).join('\n\n')}

Total Edits: ${editHistory.length}
`

    const blob = new Blob([historyText], { type: 'text/plain' })
    const link = document.createElement('a')
    link.download = `${filename}_edit_history.txt`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Activity className="logo-icon" />
            <h1>GAME STAT CARD</h1>
          </div>
          <p className="subtitle">Generate NBA players game stat card for social media posts</p>
        </div>
      </header>

      <main className="main-content">
        <div className="search-section">
          <div className="search-container">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for NBA player (e.g., LeBron James, Stephen Curry)"
                className="search-input"
                disabled={loading}
              />
              <button 
                onClick={handleSearch}
                disabled={loading || !searchTerm.trim()}
                className="search-button"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading player data...</p>
          </div>
        )}

        {selectedPlayer && !loading && (
          <div className="player-section">
            <div className="player-info">
              <div className="player-header">
                <User className="player-icon" />
                <div className="player-details">
                  <h2>{selectedPlayer.name}</h2>
                  <p className="team">{selectedPlayer.team}</p>
                  <p className="position">Position: {selectedPlayer.position}</p>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <div className="stats-header">
                <TrendingUp className="stats-icon" />
                <h3>Last 5 Games Statistics</h3>
              </div>
              
              <div className="stats-table-container">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th><Calendar size={16} /> Date</th>
                      <th>Opponent</th>
                      <th>PTS</th>
                      <th>REB</th>
                      <th>AST</th>
                      <th>STL</th>
                      <th>BLK</th>
                      <th>FG%</th>
                      <th>MIN</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameStats.map((game, index) => (
                      <tr key={index} className="stats-row">
                        <td>{game.date}</td>
                        <td>{game.opponent}</td>
                        <td className="stat-points">{game.points}</td>
                        <td>{game.rebounds}</td>
                        <td>{game.assists}</td>
                        <td>{game.steals}</td>
                        <td>{game.blocks}</td>
                        <td>{game.fgPercentage}</td>
                        <td>{game.minutes}</td>
                        <td>
                          <button 
                            onClick={() => generateIGPost(game, selectedPlayer.name)}
                            className="generate-button"
                          >
                            Generate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="stats-summary">
                <div className="summary-card">
                  <h4>Averages (Last 5 Games)</h4>
                  <div className="avg-stats">
                    <span>PPG: {(gameStats.reduce((sum, game) => sum + game.points, 0) / gameStats.length).toFixed(1)}</span>
                    <span>RPG: {(gameStats.reduce((sum, game) => sum + game.rebounds, 0) / gameStats.length).toFixed(1)}</span>
                    <span>APG: {(gameStats.reduce((sum, game) => sum + game.assists, 0) / gameStats.length).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedPlayer && !loading && !error && (
          <div className="welcome-message">
            <Activity size={64} className="welcome-icon" />
            <h3>Welcome to NBA Stats Tracker</h3>
            <p>Search for your favorite NBA players to view their recent game statistics.</p>
            <div className="suggested-players">
              <p>Try searching for:</p>
              <div className="player-chips">
                {mockPlayers.slice(0, 4).map(player => (
                  <button 
                    key={player.id}
                    onClick={() => setSearchTerm(player.name)}
                    className="player-chip"
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Instagram Post Generator Modal */}
      {generatedPost && (
        <div className="post-overlay" onClick={closePost}>
          <div className="post-container" onClick={(e) => e.stopPropagation()}>
            <div className="post-header">
              <h3>Instagram Post Preview</h3>
              <button onClick={closePost} className="close-button">×</button>
            </div>
            
            <div className="background-controls">
              <label className="upload-label">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                📷 Add Background Image
              </label>
              {backgroundImage && (
                <>
                  <button onClick={removeBackgroundImage} className="remove-bg-btn">
                    Remove Background
                  </button>
                  <div className="scale-control">
                    <label>Scale: </label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={backgroundScale}
                      onChange={handleScaleChange}
                    />
                    <span>{backgroundScale.toFixed(1)}x</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="ig-post">
              <div className="ig-post-content" ref={postRef}>
                <div 
                  className="ig-post-background"
                  onMouseDown={handleBackgroundMouseDown}
                  onMouseMove={handleBackgroundMouseMove}
                  onMouseUp={handleBackgroundMouseUp}
                  onMouseLeave={handleBackgroundMouseUp}
                  style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
                    backgroundSize: `${100 * backgroundScale}%`,
                    cursor: backgroundImage ? (isDraggingBackground ? 'grabbing' : 'grab') : 'default'
                  }}
                >
                  <div 
                    className="ig-post-header-info drop-zone"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'header')}
                  >
                    <h2 className="ig-player-name">{generatedPost.playerName}</h2>
                    {gameInfoPosition === 'header' && renderGameInfo()}
                  </div>
                  
                  <div className="ig-stats-display">
                    <div 
                      className="ig-main-stats drop-zone"
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'top-stats')}
                    >
                      {gameInfoPosition === 'top-stats' && (
                        <div className="game-info-in-stats">
                          {renderGameInfo()}
                        </div>
                      )}
                      <div className="ig-stat-item">
                        <span className="ig-stat-value">{generatedPost.points}</span>
                        <span className="ig-stat-label">POINTS</span>
                      </div>
                      <div className="ig-stat-item">
                        <span className="ig-stat-value">{generatedPost.rebounds}</span>
                        <span className="ig-stat-label">REBOUNDS</span>
                      </div>
                      <div className="ig-stat-item">
                        <span className="ig-stat-value">{generatedPost.assists}</span>
                        <span className="ig-stat-label">ASSISTS</span>
                      </div>
                    </div>
                    
                    {showSecondaryStats && (
                      <div className="ig-secondary-stats" onClick={removeSecondaryStats}>
                        <div className="ig-secondary-stat">
                          <span>{generatedPost.steals} STL</span>
                        </div>
                        <div className="ig-secondary-stat">
                          <span>{generatedPost.blocks} BLK</span>
                        </div>
                        <div className="ig-secondary-stat">
                          <span>{generatedPost.fgPercentage} FG%</span>
                        </div>
                        <div className="ig-secondary-stat">
                          <span>{generatedPost.minutes} MIN</span>
                        </div>
                      </div>
                    )}
                    
                    <div 
                      className="ig-bottom-section drop-zone"
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'bottom-stats')}
                    >
                      {gameInfoPosition === 'bottom-stats' && (
                        <div className="game-info-in-bottom">
                          {renderGameInfo()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="post-actions">
                <button onClick={saveAsPNG} className="save-button">
                  <Download size={16} />
                  Save as PNG
                </button>
                
                {editHistory.length > 0 && (
                  <div className="edit-history">
                    <h4>Edit History ({editHistory.length} changes)</h4>
                    <div className="edit-history-list">
                      {editHistory.slice(-5).map((edit) => (
                        <div key={edit.id} className="edit-item">
                          <span className="edit-action">{edit.action}</span>
                          <span className="edit-details">{edit.details}</span>
                          <span className="edit-time">{edit.timestamp}</span>
                        </div>
                      ))}
                      {editHistory.length > 5 && (
                        <div className="edit-item more-edits">
                          ... and {editHistory.length - 5} more changes
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="post-note">Click "Save as PNG" to download the image + edit history</p>
                <p className="post-note">💡 Tip: Click the detailed stats to remove them permanently</p>
                <p className="post-note">🔄 Tip: Click the game info to toggle date/opponent display</p>
                <p className="post-note">⟷ Tip: Drag the game info between sections (header ↔ stats ↔ bottom)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
