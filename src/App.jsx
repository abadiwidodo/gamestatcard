import { useState, useRef } from 'react'
import { Search, User, Calendar, TrendingUp, Activity, Download, Heart, MessageCircle, Share, LogIn, Menu, X, CreditCard, Instagram, Type, Hash, Bold, Italic, Underline, Palette, ArrowDown } from 'lucide-react'
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
  const [showSecondaryStats, setShowSecondaryStats] = useState(false)
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
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [showDashboard, setShowDashboard] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [quickSearchTerm, setQuickSearchTerm] = useState('')
  const [quickSearchResults, setQuickSearchResults] = useState([])
  const [quickSearchLoading, setQuickSearchLoading] = useState(false)
  const [selectedQuickGame, setSelectedQuickGame] = useState(null)
  const [postFormat, setPostFormat] = useState('instagram-square') // 'instagram-square', 'instagram-reel', 'tiktok'
  
  // WYSIWYG Editor State
  const [selectedTextElement, setSelectedTextElement] = useState(null) // 'playerName' or 'gameInfo'
  const [isEditingPlayerName, setIsEditingPlayerName] = useState(false)
  const [editPlayerNameValue, setEditPlayerNameValue] = useState('')
  const [textStyles, setTextStyles] = useState({
    playerName: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 800,
      fontStyle: 'normal',
      textDecoration: 'none'
    },
    gameInfo: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 400,
      fontStyle: 'normal',
      textDecoration: 'none'
    }
  })
  
  // Freestyle positioning state
  const [textPositions, setTextPositions] = useState({
    playerName: { x: 20, y: 20 },
    gameInfo: { x: 20, y: 60 },
    mainStats: { x: 20, y: 300 }
  })
  const [isDraggingText, setIsDraggingText] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
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
    return Array.from({ length: 3 }, (_, index) => ({
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

  const handleQuickSearch = async () => {
    if (!quickSearchTerm.trim()) return

    setQuickSearchLoading(true)
    setQuickSearchResults([])
    setSelectedQuickGame(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const foundPlayer = mockPlayers.find(player => 
        player.name.toLowerCase().includes(quickSearchTerm.toLowerCase())
      )

      if (foundPlayer) {
        const gameStats = generateMockStats(foundPlayer.name)
        setQuickSearchResults(gameStats.map(game => ({
          ...game,
          playerName: foundPlayer.name
        })))
      } else {
        setQuickSearchResults([])
      }
    } catch (err) {
      setQuickSearchResults([])
    } finally {
      setQuickSearchLoading(false)
    }
  }

  const handleQuickKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuickSearch()
    }
  }

  const handleQuickGenerate = () => {
    if (selectedQuickGame) {
      generateIGPost(selectedQuickGame, selectedQuickGame.playerName)
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
    setShowSecondaryStats(false) // Keep secondary stats hidden by default
    setGameInfoMode('both') // Reset to show both date and opponent when generating new post
    setGameInfoPosition('header') // Reset to header position when generating new post
    setPlayerNamePosition('header') // Reset player name to header position when generating new post
    setElementOrder(['player', 'game']) // Reset to default order when generating new post
    // Reset text positions for freestyle mode
    setTextPositions({
      playerName: { x: 20, y: 20 },
      gameInfo: { x: 20, y: 60 },
      mainStats: { x: 20, y: 300 }
    })
    // Reset editing states
    setIsEditingPlayerName(false)
    setEditPlayerNameValue('')
    setSelectedTextElement(null)
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
        className={`ig-player-name selectable-text draggable ${selectedTextElement === 'playerName' ? 'selected' : ''}`}
        style={getTextStyle('playerName')}
        onClick={() => selectTextElement('playerName')}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        draggable
        title="Click to edit, drag to move"
      >
        {generatedPost.playerName}
      </h2>
    </div>
  )

  const renderGameInfo = () => (
    <p 
      className={`ig-game-info selectable-text draggable ${selectedTextElement === 'gameInfo' ? 'selected' : ''}`}
      style={getTextStyle('gameInfo')}
      onClick={() => selectTextElement('gameInfo')}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title="Click to edit, drag to move"
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

  // WYSIWYG Editor Functions
  const selectTextElement = (elementType) => {
    setSelectedTextElement(elementType)
    if (elementType === 'playerName' && !isEditingPlayerName) {
      // Double-click or specific action needed to start editing
      // For now, just selecting doesn't start editing automatically
    }
  }

  const updateTextStyle = (property, value) => {
    if (!selectedTextElement) return
    
    setTextStyles(prev => ({
      ...prev,
      [selectedTextElement]: {
        ...prev[selectedTextElement],
        [property]: value
      }
    }))
    
    const elementName = selectedTextElement === 'playerName' ? 'Player Name' : 'Game Info'
    addToEditHistory(`${elementName} Style Changed`, `${property}: ${value}`)
  }

  const clearTextSelection = () => {
    setSelectedTextElement(null)
  }

  const getTextStyle = (elementType) => {
    return textStyles[elementType] || textStyles.playerName
  }

  // Player name editing functions
  const startEditingPlayerName = () => {
    setIsEditingPlayerName(true)
    setEditPlayerNameValue(generatedPost.playerName)
    setSelectedTextElement('playerName')
  }

  const savePlayerNameEdit = () => {
    if (editPlayerNameValue.trim()) {
      setGeneratedPost(prev => ({
        ...prev,
        playerName: editPlayerNameValue.trim()
      }))
      addToEditHistory('Player Name Changed', `Changed from "${generatedPost.playerName}" to "${editPlayerNameValue.trim()}"`)
    }
    setIsEditingPlayerName(false)
    setEditPlayerNameValue('')
  }

  const cancelPlayerNameEdit = () => {
    setIsEditingPlayerName(false)
    setEditPlayerNameValue('')
  }

  const handlePlayerNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      savePlayerNameEdit()
    } else if (e.key === 'Escape') {
      cancelPlayerNameEdit()
    }
  }

  // Freestyle text positioning functions
  const handleTextMouseDown = (e, elementType) => {
    // Don't allow dragging of main stats or when editing player name
    if (elementType === 'mainStats' || (elementType === 'playerName' && isEditingPlayerName)) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = e.currentTarget.closest('.ig-post').getBoundingClientRect()
    
    setIsDraggingText(elementType)
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    
    // Select the element when starting to drag
    setSelectedTextElement(elementType)
  }

  // Touch event handlers for mobile
  const handleTextTouchStart = (e, elementType) => {
    // Don't allow dragging of main stats or when editing player name
    if (elementType === 'mainStats' || (elementType === 'playerName' && isEditingPlayerName)) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = e.currentTarget.closest('.ig-post').getBoundingClientRect()
    
    setIsDraggingText(elementType)
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    })
    
    // Select the element when starting to drag
    setSelectedTextElement(elementType)
  }

  const handleTextMouseMove = (e) => {
    if (!isDraggingText) return
    
    e.preventDefault()
    const container = document.querySelector('.ig-post')
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    const newX = e.clientX - containerRect.left - dragOffset.x
    const newY = e.clientY - containerRect.top - dragOffset.y
    
    // More generous bounds to allow full horizontal and vertical movement
    const minX = 0
    const minY = 0
    const maxX = containerRect.width - 50  // Leave some margin but allow more movement
    const maxY = containerRect.height - 50 // Leave some margin but allow more movement
    
    const constrainedX = Math.max(minX, Math.min(newX, maxX))
    const constrainedY = Math.max(minY, Math.min(newY, maxY))
    
    setTextPositions(prev => ({
      ...prev,
      [isDraggingText]: { x: constrainedX, y: constrainedY }
    }))
  }

  const handleTextTouchMove = (e) => {
    if (!isDraggingText) return
    
    e.preventDefault()
    const touch = e.touches[0]
    const container = document.querySelector('.ig-post')
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    const newX = touch.clientX - containerRect.left - dragOffset.x
    const newY = touch.clientY - containerRect.top - dragOffset.y
    
    // More generous bounds to allow full horizontal and vertical movement
    const minX = 0
    const minY = 0
    const maxX = containerRect.width - 50  // Leave some margin but allow more movement
    const maxY = containerRect.height - 50 // Leave some margin but allow more movement
    
    const constrainedX = Math.max(minX, Math.min(newX, maxX))
    const constrainedY = Math.max(minY, Math.min(newY, maxY))
    
    setTextPositions(prev => ({
      ...prev,
      [isDraggingText]: { x: constrainedX, y: constrainedY }
    }))
  }

  const handleTextMouseUp = () => {
    if (isDraggingText) {
      const elementName = isDraggingText === 'playerName' ? 'Player Name' : 
                         isDraggingText === 'gameInfo' ? 'Game Info' : 'Main Stats'
      const position = textPositions[isDraggingText]
      addToEditHistory('Text Repositioned', `${elementName} moved to (${Math.round(position.x)}, ${Math.round(position.y)})`)
    }
    setIsDraggingText(null)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleTextTouchEnd = () => {
    if (isDraggingText) {
      const elementName = isDraggingText === 'playerName' ? 'Player Name' : 
                         isDraggingText === 'gameInfo' ? 'Game Info' : 'Main Stats'
      const position = textPositions[isDraggingText]
      addToEditHistory('Text Repositioned', `${elementName} moved to (${Math.round(position.x)}, ${Math.round(position.y)})`)
    }
    setIsDraggingText(null)
    setDragOffset({ x: 0, y: 0 })
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
            <div>
              <h1>GameStatCard</h1>
              <p className="subtitle">Create & Share NBA Stats card</p>
            </div>
          </div>
          
          {/* Desktop Authentication Controls */}
          <div className="auth-controls desktop-only">
            {user ? (
              <button 
                onClick={() => setShowDashboard(true)}
                className="user-account-btn"
              >
                <User size={16} />
                <span>{user.email}</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  setAuthMode('signin')
                  setShowAuthModal(true)
                }}
                className="button button-primary"
              >
                <LogIn size={16} />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="mobile-only">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`hamburger-btn ${showMobileMenu ? 'open' : ''}`}
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
                  <button 
                    onClick={() => {
                      setAuthMode('signin')
                      setShowAuthModal(true)
                      setShowMobileMenu(false)
                    }}
                    className="mobile-menu-item"
                  >
                    <LogIn size={16} />
                    Login / Sign Up
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="main-layout">
          <div className="generator-section">
            <div className="card">
              <div className="quick-generator-container">
                <div className="form-group">
                  <label htmlFor="quick-search">Player Name</label>
                  <div className="quick-search-box">
                    <input
                      id="quick-search"
                      type="text"
                      value={quickSearchTerm}
                      onChange={(e) => setQuickSearchTerm(e.target.value)}
                      onKeyPress={handleQuickKeyPress}
                      placeholder="e.g., LeBron James"
                      className="input"
                      disabled={quickSearchLoading}
                    />
                    <button 
                      onClick={handleQuickSearch}
                      disabled={quickSearchLoading || !quickSearchTerm.trim()}
                      className="button button-primary"
                      aria-label="Search"
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>

                {quickSearchResults.length > 0 && (
                  <div className="form-group">
                    <label>Select Game</label>
                    <div className="quick-games-grid">
                      {quickSearchResults.map((game, index) => (
                        <div 
                          key={index} 
                          className={`quick-game-box ${selectedQuickGame?.game === game.game ? 'selected' : ''}`}
                          onClick={() => setSelectedQuickGame(game)}
                        >
                          <div className="quick-game-date">{game.date}</div>
                          <div className="quick-game-opponent">{game.opponent}</div>
                          <div className="quick-game-stats">
                            <span>{game.points}pts</span>
                            <span>{game.rebounds}reb</span>
                            <span>{game.assists}ast</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Post Format</label>
                  <div className="format-options">
                    <button 
                      className={`format-option ${postFormat === 'instagram-square' ? 'selected' : ''}`}
                      onClick={() => setPostFormat('instagram-square')}
                    >
                      <Instagram size={20} />
                      <span>IG Square</span>
                    </button>
                    <button 
                      className={`format-option ${postFormat === 'instagram-reel' ? 'selected' : ''}`}
                      onClick={() => setPostFormat('instagram-reel')}
                    >
                      <Instagram size={20} />
                      <span>IG Reel</span>
                    </button>
                    <button 
                      className={`format-option ${postFormat === 'tiktok' ? 'selected' : ''}`}
                      onClick={() => setPostFormat('tiktok')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      <span>TikTok</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleQuickGenerate}
                  disabled={!selectedQuickGame}
                  className="button button-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  GENERATE
                </button>
              </div>
            </div>

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading player data...</p>
              </div>
            )}

            {selectedPlayer && !loading && (
              <div className="card">
                <div className="player-section">
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
                                className="button button-secondary"
                              >
                                Generate
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {!selectedPlayer && !loading && !error && (
              <div className="card">
                <div className="card-header">
                  <h2>Community Gallery</h2>
                  <p>Discover amazing stat cards created by our community.</p>
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
            )}
          </div>

          {generatedPost && (
            <div className="preview-section">
              <div className="preview-header">
                <h3>Preview</h3>
                <button onClick={closePost} className="close-button">×</button>
              </div>
              
              {/* WYSIWYG Text Editor Toolbar */}
              <div className={`wysiwyg-toolbar ${!selectedTextElement ? 'hidden' : ''}`}>
                {selectedTextElement && (
                  <>
                    {selectedTextElement === 'playerName' && (
                      <div className="toolbar-group">
                        <button 
                          onClick={startEditingPlayerName}
                          className="toolbar-button"
                          title="Edit Player Name"
                        >
                          ✏️ Edit Text
                        </button>
                      </div>
                    )}
                    
                    <div className="toolbar-group">
                      <Type size={16} className="toolbar-icon" />
                      <select 
                        value={textStyles[selectedTextElement]?.fontFamily || 'Inter'}
                        onChange={(e) => updateTextStyle('fontFamily', e.target.value)}
                        className="toolbar-select font-preview-select"
                      >
                        <option value="Inter" style={{fontFamily: 'Inter'}}>Inter</option>
                        <option value="Arial" style={{fontFamily: 'Arial'}}>Arial</option>
                        <option value="Helvetica" style={{fontFamily: 'Helvetica'}}>Helvetica</option>
                        <option value="Georgia" style={{fontFamily: 'Georgia'}}>Georgia</option>
                        <option value="Times New Roman" style={{fontFamily: 'Times New Roman'}}>Times New Roman</option>
                        <option value="Courier New" style={{fontFamily: 'Courier New'}}>Courier New</option>
                        <option value="Verdana" style={{fontFamily: 'Verdana'}}>Verdana</option>
                        <option value="Impact" style={{fontFamily: 'Impact'}}>Impact</option>
                        <option value="Trebuchet MS" style={{fontFamily: 'Trebuchet MS'}}>Trebuchet MS</option>
                        <option value="Arial Black" style={{fontFamily: 'Arial Black'}}>Arial Black</option>
                        <option value="Comic Sans MS" style={{fontFamily: 'Comic Sans MS'}}>Comic Sans MS</option>
                        <option value="Tahoma" style={{fontFamily: 'Tahoma'}}>Tahoma</option>
                        <option value="Palatino" style={{fontFamily: 'Palatino'}}>Palatino</option>
                        <option value="Book Antiqua" style={{fontFamily: 'Book Antiqua'}}>Book Antiqua</option>
                        <option value="Century Gothic" style={{fontFamily: 'Century Gothic'}}>Century Gothic</option>
                        <option value="Lucida Console" style={{fontFamily: 'Lucida Console'}}>Lucida Console</option>
                        <option value="Franklin Gothic Medium" style={{fontFamily: 'Franklin Gothic Medium'}}>Franklin Gothic Medium</option>
                        <option value="Calibri" style={{fontFamily: 'Calibri'}}>Calibri</option>
                        <option value="Cambria" style={{fontFamily: 'Cambria'}}>Cambria</option>
                        <option value="Consolas" style={{fontFamily: 'Consolas'}}>Consolas</option>
                        <option value="Segoe UI" style={{fontFamily: 'Segoe UI'}}>Segoe UI</option>
                        <option value="Roboto" style={{fontFamily: 'Roboto'}}>Roboto</option>
                        <option value="Open Sans" style={{fontFamily: 'Open Sans'}}>Open Sans</option>
                        <option value="Lato" style={{fontFamily: 'Lato'}}>Lato</option>
                        <option value="Montserrat" style={{fontFamily: 'Montserrat'}}>Montserrat</option>
                        <option value="Oswald" style={{fontFamily: 'Oswald'}}>Oswald</option>
                        <option value="Playfair Display" style={{fontFamily: 'Playfair Display'}}>Playfair Display</option>
                        <option value="Source Sans Pro" style={{fontFamily: 'Source Sans Pro'}}>Source Sans Pro</option>
                        <option value="Merriweather" style={{fontFamily: 'Merriweather'}}>Merriweather</option>
                        <option value="Poppins" style={{fontFamily: 'Poppins'}}>Poppins</option>
                      </select>
                    </div>
                    
                    <div className="toolbar-group">
                      <Hash size={16} className="toolbar-icon" />
                      <input 
                        type="number"
                        value={textStyles[selectedTextElement]?.fontSize || 16}
                        onChange={(e) => updateTextStyle('fontSize', parseInt(e.target.value))}
                        className="toolbar-input"
                        min="8"
                        max="72"
                      />
                    </div>
                    
                    <div className="toolbar-group">
                      <button 
                        onClick={() => {
                          const currentWeight = textStyles[selectedTextElement]?.fontWeight || 400;
                          const newWeight = currentWeight >= 600 ? 400 : 700;
                          updateTextStyle('fontWeight', newWeight);
                        }}
                        className={`toolbar-button ${(textStyles[selectedTextElement]?.fontWeight || 400) >= 600 ? 'active' : ''}`}
                        title="Toggle Bold"
                      >
                        <Bold size={16} />
                      </button>
                      
                      <button 
                        onClick={() => updateTextStyle('fontStyle', textStyles[selectedTextElement]?.fontStyle === 'italic' ? 'normal' : 'italic')}
                        className={`toolbar-button ${textStyles[selectedTextElement]?.fontStyle === 'italic' ? 'active' : ''}`}
                        title="Toggle Italic"
                      >
                        <Italic size={16} />
                      </button>
                      
                      <button 
                        onClick={clearTextSelection}
                        className="toolbar-button done-button"
                        title="Done Editing"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              <div className="preview-canvas">
                <div 
                  id="post-to-generate"
                  className="ig-post freestyle-post"
                  ref={postRef}
                  onMouseMove={handleTextMouseMove}
                  onMouseUp={handleTextMouseUp}
                  onMouseLeave={handleTextMouseUp}
                  onTouchMove={handleTextTouchMove}
                  onTouchEnd={handleTextTouchEnd}
                >
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
                    {/* Freestyle positioned text elements */}
                    <div
                      className={`freestyle-text-element ${selectedTextElement === 'playerName' ? 'selected' : ''}`}
                      style={{
                        position: 'absolute',
                        left: `${textPositions.playerName.x}px`,
                        top: `${textPositions.playerName.y}px`,
                        cursor: isDraggingText === 'playerName' ? 'grabbing' : 'grab',
                        zIndex: selectedTextElement === 'playerName' ? 10 : 5,
                        ...getTextStyle('playerName')
                      }}
                      onMouseDown={(e) => handleTextMouseDown(e, 'playerName')}
                      onTouchStart={(e) => handleTextTouchStart(e, 'playerName')}
                      onClick={() => selectTextElement('playerName')}
                      onDoubleClick={startEditingPlayerName}
                      title="Click to edit, drag to move, double-click to edit text"
                    >
                      {isEditingPlayerName ? (
                        <input
                          type="text"
                          value={editPlayerNameValue}
                          onChange={(e) => setEditPlayerNameValue(e.target.value)}
                          onKeyDown={handlePlayerNameKeyPress}
                          onBlur={savePlayerNameEdit}
                          autoFocus
                          style={{
                            background: 'transparent',
                            border: '2px solid var(--primary)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            color: 'inherit',
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            fontWeight: 'inherit',
                            fontStyle: 'inherit',
                            outline: 'none',
                            minWidth: '200px'
                          }}
                        />
                      ) : (
                        generatedPost.playerName
                      )}
                    </div>

                    <div
                      className={`freestyle-text-element ${selectedTextElement === 'gameInfo' ? 'selected' : ''}`}
                      style={{
                        position: 'absolute',
                        left: `${textPositions.gameInfo.x}px`,
                        top: `${textPositions.gameInfo.y}px`,
                        cursor: isDraggingText === 'gameInfo' ? 'grabbing' : 'grab',
                        zIndex: selectedTextElement === 'gameInfo' ? 10 : 5,
                        ...getTextStyle('gameInfo')
                      }}
                      onMouseDown={(e) => handleTextMouseDown(e, 'gameInfo')}
                      onTouchStart={(e) => handleTextTouchStart(e, 'gameInfo')}
                      onClick={() => selectTextElement('gameInfo')}
                      title="Click to edit, drag to move"
                    >
                      {getGameInfoContent()}
                    </div>
                    
                    {/* Stats display */}
                    <div 
                      className={`ig-stats-display ${selectedTextElement === 'mainStats' ? 'selected' : ''}`}
                      onClick={() => selectTextElement('mainStats')}
                      title="Click to edit"
                    >
                      <div className="ig-main-stats">
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
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="post-actions">
                <div className="form-group">
                  <label className="button button-secondary" style={{width: '100%', textAlign: 'center'}}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    📷 Change Background
                  </label>
                </div>

                {backgroundImage && (
                  <div className="form-group">
                    <label>Background Scale</label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={backgroundScale}
                      onChange={handleScaleChange}
                      className="slider"
                    />
                  </div>
                )}

                <button onClick={saveAsPNG} className="button button-primary" style={{width: '100%'}}>
                  <Download size={16} />
                  Save as PNG
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
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
