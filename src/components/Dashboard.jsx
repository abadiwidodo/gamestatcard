import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Activity, User as UserIcon, Download, Calendar, TrendingUp, LogOut } from 'lucide-react'

const Dashboard = ({ onClose }) => {
  const { user, signOut } = useAuth()
  const [userStats, setUserStats] = useState({
    cardsCreated: 0,
    totalDownloads: 0,
    joinedDate: null
  })

  useEffect(() => {
    if (user) {
      // Simulate user stats - in a real app, fetch from Supabase
      setUserStats({
        cardsCreated: Math.floor(Math.random() * 50) + 5,
        totalDownloads: Math.floor(Math.random() * 200) + 20,
        joinedDate: new Date(user.created_at).toLocaleDateString()
      })
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const recentCards = [
    { id: 1, player: 'LeBron James', date: '2 days ago', downloads: 15 },
    { id: 2, player: 'Stephen Curry', date: '5 days ago', downloads: 23 },
    { id: 3, player: 'Giannis Antetokounmpo', date: '1 week ago', downloads: 18 },
  ]

  return (
    <div className="dashboard-overlay" onClick={onClose}>
      <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <Activity size={24} />
            <h2>My Dashboard</h2>
          </div>
          <button onClick={onClose} className="dashboard-close-btn">×</button>
        </div>

        <div className="dashboard-content">
          {/* User Info */}
          <div className="user-info-card">
            <div className="user-avatar">
              <UserIcon size={32} />
            </div>
            <div className="user-details">
              <h3>{user?.email}</h3>
              <p>Member since {userStats.joinedDate}</p>
            </div>
            <button onClick={handleSignOut} className="sign-out-btn">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Activity size={20} />
              </div>
              <div className="stat-info">
                <h3>{userStats.cardsCreated}</h3>
                <p>Cards Created</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Download size={20} />
              </div>
              <div className="stat-info">
                <h3>{userStats.totalDownloads}</h3>
                <p>Total Downloads</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-info">
                <h3>{Math.round(userStats.totalDownloads / userStats.cardsCreated) || 0}</h3>
                <p>Avg Downloads</p>
              </div>
            </div>
          </div>

          {/* Recent Cards */}
          <div className="recent-cards">
            <h3>Recent Cards</h3>
            <div className="cards-list">
              {recentCards.map(card => (
                <div key={card.id} className="card-item">
                  <div className="card-info">
                    <h4>{card.player}</h4>
                    <p>
                      <Calendar size={14} />
                      {card.date}
                    </p>
                  </div>
                  <div className="card-downloads">
                    <Download size={14} />
                    {card.downloads}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn primary">
                <Activity size={16} />
                Create New Card
              </button>
              <button className="action-btn secondary">
                <TrendingUp size={16} />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
