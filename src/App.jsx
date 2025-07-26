import { useState, useRef } from 'react'
import { Search, User, Calendar, TrendingUp, Activity, Download, Heart, MessageCircle, Share, LogIn, Menu, X, CreditCard } from 'lucide-react'
import html2canvas from 'html2canvas'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthModal from './components/AuthModal'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [gameStats, setGameStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedPost, setGeneratedPost] = useState(null)
  const [showSecondaryStats, setShowSecondaryStats] = useState(true)
  const [gameInfoMode, setGameInfoMode] = useState('both') // 'date', 'opponent', 'both'
  const [gameInfoPosition, setGameInfoPosition] = useState('header') // 'header', 'top-stats', 'bottom-stats'
  const [playerNamePosition, setPlayerNamePosition] = useState('header') // 'header', 'top-stats', 'bottom-stats'
  const [elementOrder, setElementOrder] = useState(['player', 'game']) // Controls left-right order
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [backgroundScale, setBackgroundScale] = useState(1)
  const [isDraggingBackground, setIsDraggingBackground] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [editHistory, setEditHistory] = useState([])
  const [playerNameFont, setPlayerNameFont] = useState('Inter')
  const [showFontSelector, setShowFontSelector] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [showDashboard, setShowDashboard] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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

  // Mock IG posts data with #ae5history hashtag
  const mockIGPosts = [
    {
      id: 1,
      playerName: 'LeBron James',
      gameInfo: '1/25 • vs Warriors',
      stats: { points: 32, rebounds: 8, assists: 12 },
      date: '2 days ago',
      likes: 1247,
      comments: 89,
      shares: 156,
      photo: '/images/1.jpg' // Your uploaded photo
    },
    {
      id: 2,
      playerName: 'Stephen Curry',
      gameInfo: '1/24 • vs Lakers',
      stats: { points: 28, rebounds: 5, assists: 9 },
      date: '3 days ago',
      likes: 892,
      comments: 67,
      shares: 112,
      photo: '/images/2.jpg' // Your uploaded photo
    },
    {
      id: 3,
      playerName: 'Giannis Antetokounmpo',
      gameInfo: '1/23 • vs Celtics',
      stats: { points: 35, rebounds: 14, assists: 6 },
      date: '4 days ago',
      likes: 1156,
      comments: 94,
      shares: 203,
      photo: '/images/3.jpg' // Your uploaded photo
    },
    {
      id: 4,
      playerName: 'Luka Dončić',
      gameInfo: '1/22 • vs Nuggets',
      stats: { points: 31, rebounds: 7, assists: 13 },
      date: '5 days ago',
      likes: 967,
      comments: 72,
      shares: 134,
      photo: '/images/4.jpg' // Your uploaded photo
    },
    {
      id: 5,
      playerName: 'Jayson Tatum',
      gameInfo: '1/21 • vs Heat',
      stats: { points: 29, rebounds: 9, assists: 8 },
      date: '6 days ago',
      likes: 743,
      comments: 55,
      shares: 98,
      photo: '/images/5.jpg' // Your uploaded photo
    },
    {
      id: 6,
      playerName: 'Joel Embiid',
      gameInfo: '1/20 • vs Knicks',
      stats: { points: 38, rebounds: 12, assists: 4 },
      date: '1 week ago',
      likes: 1334,
      comments: 108,
      shares: 187,
      photo: '/images/6.jpg' // Your uploaded photo
    },
    {
      id: 7,
      playerName: 'Kawhi Leonard',
      gameInfo: '1/19 • vs Suns',
      stats: { points: 26, rebounds: 6, assists: 5 },
      date: '1 week ago',
      likes: 856,
      comments: 63,
      shares: 119,
      photo: '/images/7.jpg' // Your uploaded photo
    },
    {
      id: 8,
      playerName: 'Anthony Davis',
      gameInfo: '1/18 • vs Clippers',
      stats: { points: 33, rebounds: 11, assists: 3 },
      date: '1 week ago',
      likes: 1089,
      comments: 87,
      shares: 142,
      photo: '/images/8.jpg' // Your uploaded photo
    },
    {
      id: 9,
      playerName: 'Damian Lillard',
      gameInfo: '1/17 • vs Hawks',
      stats: { points: 41, rebounds: 4, assists: 8 },
      date: '2 weeks ago',
      likes: 1456,
      comments: 124,
      shares: 198,
      photo: '/images/9.jpg' // Your uploaded photo
    }
  ]

  // Mock game stats data
  const generateMockStats = (playerName) => {
    return Array.from({ length: 5 }, (_, index) => ({
      game: index + 1,
      date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
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
    setPlayerNamePosition('header') // Reset player name to header position when generating new post
    setElementOrder(['player', 'game']) // Reset to default order when generating new post
    setPlayerNameFont('Inter') // Reset to default font when generating new post
    setShowFontSelector(false) // Hide font selector when generating new post
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
    const dataType = e.target.classList.contains('ig-player-name') ? 'player-name' : 'game-info'
    
    // Store the drag type as regular (vertical) drag by default
    // Horizontal switching will be handled by specific drop zones
    e.dataTransfer.setData('text/plain', dataType)
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.5'
    
    // Add visual feedback to all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
      zone.classList.add('drag-active')
    })
    
    // Add visual feedback for horizontal zones when both elements are in same section
    const currentPlayerSection = playerNamePosition
    const currentGameSection = gameInfoPosition
    if (currentPlayerSection === currentGameSection) {
      document.querySelectorAll('.horizontal-drop-zone').forEach(zone => {
        zone.classList.add('horizontal-drag-active')
      })
    }
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    // Remove visual feedback from all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
      zone.classList.remove('drag-active', 'drag-over')
    })
    document.querySelectorAll('.horizontal-drop-zone').forEach(zone => {
      zone.classList.remove('horizontal-drag-active', 'horizontal-drag-over')
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    if (e.currentTarget.classList.contains('horizontal-drop-zone')) {
      e.currentTarget.classList.add('horizontal-drag-over')
    } else {
      e.currentTarget.classList.add('drag-over')
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    // Only remove if we're actually leaving the element (not just entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over', 'horizontal-drag-over')
    }
  }

  const handleDrop = (e, position) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    
    // Check if this is a horizontal reordering (dropping on horizontal-drop-zone when both elements are in same section)
    const isHorizontalDrop = e.currentTarget.classList.contains('horizontal-drop-zone')
    const bothElementsInSameSection = playerNamePosition === gameInfoPosition
    
    if (isHorizontalDrop && bothElementsInSameSection && (data === 'player-name' || data === 'game-info')) {
      // Handle horizontal reordering
      const newOrder = [...elementOrder].reverse()
      setElementOrder(newOrder)
      
      const elementType = data === 'player-name' ? 'Player Name' : 'Game Info'
      addToEditHistory('Element Order Changed', `${elementType} moved to ${newOrder[0] === 'player' ? 'left' : 'right'} side`)
    }
    // Handle vertical positioning
    else if (data === 'game-info') {
      const oldPosition = gameInfoPosition
      setGameInfoPosition(position)
      
      const positionNames = {
        'header': 'Header',
        'top-stats': 'Stats Section', 
        'bottom-stats': 'Bottom Section'
      }
      addToEditHistory('Game Info Moved', `Moved from ${positionNames[oldPosition]} to ${positionNames[position]}`)
    } else if (data === 'player-name') {
      const oldPosition = playerNamePosition
      setPlayerNamePosition(position)
      
      const positionNames = {
        'header': 'Header',
        'top-stats': 'Stats Section', 
        'bottom-stats': 'Bottom Section'
      }
      addToEditHistory('Player Name Moved', `Moved from ${positionNames[oldPosition]} to ${positionNames[position]}`)
    }
    
    // Clean up visual feedback
    e.currentTarget.classList.remove('drag-over', 'horizontal-drag-over')
  }

  const renderPlayerName = () => (
    <div className="player-name-container">
      <h2 
        className="ig-player-name clickable-player-name draggable" 
        style={{ fontFamily: playerNameFont }}
        onClick={toggleFontSelector}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        draggable
        title="Click to change font, drag to move"
      >
        {generatedPost.playerName}
      </h2>
      {showFontSelector && (
        <div className="font-selector-dropdown">
          <select value={playerNameFont} onChange={handleFontChange} autoFocus>
            <option value="Inter">Inter (Default)</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Impact">Impact</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Arial Black">Arial Black</option>
          </select>
        </div>
      )}
    </div>
  )

  const renderGameInfo = () => (
    <p 
      className="ig-game-info draggable" 
      onClick={toggleGameInfo}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title="Click to toggle info, drag to move"
    >
      {getGameInfoContent()}
    </p>
  )

  const renderBothElements = (section) => {
    const playerInSection = playerNamePosition === section
    const gameInSection = gameInfoPosition === section
    
    if (!playerInSection && !gameInSection) return null
    if (playerInSection && !gameInSection) return renderPlayerName()
    if (!playerInSection && gameInSection) return renderGameInfo()
    
    // Both elements are in the same section - render side by side
    const elements = elementOrder.map(type => 
      type === 'player' ? renderPlayerName() : renderGameInfo()
    )
    
    return (
      <div className="both-elements-container">
        <div className="horizontal-drag-zone">
          <div 
            className="horizontal-drop-zone left-drop" 
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, section)}
          >
            <div className="element-container">
              {elements[0]}
            </div>
          </div>
          <div 
            className="horizontal-drop-zone right-drop"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, section)}
          >
            <div className="element-container">
              {elements[1]}
            </div>
          </div>
        </div>
      </div>
    )
  }

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

  const handleFontChange = (e) => {
    const newFont = e.target.value
    setPlayerNameFont(newFont)
    setShowFontSelector(false) // Hide selector after selection
    addToEditHistory('Player Name Font Changed', `Changed font to: ${newFont}`)
  }

  const toggleFontSelector = () => {
    setShowFontSelector(!showFontSelector)
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

  const resetToHomepage = () => {
    setSelectedPlayer(null)
    setGameStats([])
    setSearchTerm('')
    setError('')
    setGeneratedPost(null)
    setShowDashboard(false)
    setShowAuthModal(false)
    setShowMobileMenu(false)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={resetToHomepage}>
            <CreditCard className="logo-icon" />
            <h1>GameStatCard</h1>
          </div>
          
          {/* Desktop Authentication Controls */}
          <div className="auth-controls desktop-only">
            {user ? (
              <button 
                onClick={() => setShowDashboard(true)}
                className="user-account-btn"
              >
                <User size={16} />
                {user.email}
              </button>
            ) : (
              <div className="auth-buttons">
                <button 
                  onClick={() => {
                    setAuthMode('signin')
                    setShowAuthModal(true)
                  }}
                  className="user-account-btn"
                >
                  <LogIn size={16} />
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    setAuthMode('signup')
                    setShowAuthModal(true)
                  }}
                  className="user-account-btn"
                >
                  <User size={16} />
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="mobile-menu-controls mobile-only">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="hamburger-btn"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <>
              <div 
                className="mobile-menu-overlay" 
                onClick={() => setShowMobileMenu(false)}
              />
              <div className="mobile-menu-dropdown">
                {user ? (
                  <>
                    <div className="mobile-user-info">
                      <User size={16} />
                      <span>{user.email}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setShowDashboard(true)
                        setShowMobileMenu(false)
                      }}
                      className="mobile-menu-item"
                    >
                      <CreditCard size={16} />
                      Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setAuthMode('signin')
                        setShowAuthModal(true)
                        setShowMobileMenu(false)
                      }}
                      className="mobile-menu-item"
                    >
                      <LogIn size={16} />
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        setAuthMode('signup')
                        setShowAuthModal(true)
                        setShowMobileMenu(false)
                      }}
                      className="mobile-menu-item"
                    >
                      <User size={16} />
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="search-section">
          <div className="section-header">
            <p className="subtitle">Generate NBA players game stat card for social media posts</p>
          </div>
          <div className="search-container">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="NBA player (e.g., LeBron James, Stephen Curry)"
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
                      <th>OPP</th>
                      <th>PTS</th>
                      <th>REB</th>
                      <th>AST</th>
                      <th>STL</th>
                      <th>BLK</th>
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
          <>
            <div className="welcome-message">
              <CreditCard size={64} className="welcome-icon" />
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

            <div className="ig-posts-gallery">
              <div className="gallery-header">
                <h3>Community GameStatCard</h3>
                <div className="gallery-hashtag">
                  <CreditCard size={16} />
                  #ae5history
                </div>
                <p className="gallery-description">
                  Discover amazing stat cards created by our community. Get inspired and create your own unique NBA player cards!
                </p>
              </div>
              
              <div className="posts-grid">
                {mockIGPosts.map(post => (
                  <div key={post.id} className="post-card">
                    <div 
                      className="post-image-clean"
                      style={post.photo ? {
                        backgroundImage: `url(${post.photo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      } : {}}
                    >
                      {/* Clean photo display - no overlays */}
                    </div>
                    <div className="post-meta">
                      <div className="post-date">{post.date}</div>
                      <div className="post-engagement">
                        <div className="engagement-item">
                          <Heart className="engagement-icon" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="engagement-item">
                          <MessageCircle className="engagement-icon" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="engagement-item">
                          <Share className="engagement-icon" />
                          <span>{post.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
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
                  style={backgroundImage ? {
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
                    backgroundSize: `${100 * backgroundScale}%`,
                    cursor: isDraggingBackground ? 'grabbing' : 'grab'
                  } : {
                    cursor: 'default'
                  }}
                >
                  <div 
                    className="ig-post-header-info drop-zone"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'header')}
                  >
                    {renderBothElements('header')}
                  </div>
                  
                  <div className="ig-stats-display">
                    <div 
                      className="ig-main-stats drop-zone"
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'top-stats')}
                    >
                      {(gameInfoPosition === 'top-stats' || playerNamePosition === 'top-stats') && (
                        <div className="elements-in-stats">
                          {renderBothElements('top-stats')}
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
                      {(gameInfoPosition === 'bottom-stats' || playerNamePosition === 'bottom-stats') && (
                        <div className="elements-in-bottom">
                          {renderBothElements('bottom-stats')}
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
                <p className="post-note">🎨 Tip: Click the player name to change font style</p>
                <p className="post-note">📍 Tip: Drag the player name between sections like the game info</p>
                <p className="post-note">↔️ Tip: When both elements are in the same section, drag left/right to switch positions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setMode={setAuthMode}
      />

      {/* Dashboard Modal */}
      {showDashboard && (
        <Dashboard onClose={() => setShowDashboard(false)} />
      )}
    </div>
  )
}

// Main App Component with Auth Provider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithAuth
