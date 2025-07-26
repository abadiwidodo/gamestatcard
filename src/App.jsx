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
  }

  const closePost = () => {
    setGeneratedPost(null)
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
        link.download = `${generatedPost.playerName.replace(/\s+/g, '_')}_stats_${generatedPost.date.replace(/\//g, '-')}.png`
        link.href = canvas.toDataURL()
        link.click()
      } catch (error) {
        console.error('Error saving image:', error)
        alert('Error saving image. Please try again.')
      }
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Activity className="logo-icon" />
            <h1>NBA Stats Tracker</h1>
          </div>
          <p className="subtitle">Search for NBA players and view their last 5 game statistics</p>
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
            
            <div className="ig-post">
              <div className="ig-post-content" ref={postRef}>
                <div className="ig-post-background">
                  <div className="ig-post-header-info">
                    <h2 className="ig-player-name">{generatedPost.playerName}</h2>
                    <p className="ig-game-info">{generatedPost.date} • {generatedPost.opponent}</p>
                  </div>
                  
                  <div className="ig-stats-display">
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
                    
                    <div className="ig-secondary-stats">
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
                  </div>
                </div>
              </div>
              
              <div className="post-actions">
                <button onClick={saveAsPNG} className="save-button">
                  <Download size={16} />
                  Save as PNG
                </button>
                <p className="post-note">Click "Save as PNG" to download the image</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
