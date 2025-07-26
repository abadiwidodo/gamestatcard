import axios from 'axios';

// NBA API service - This is a template for real API integration
// For production, you would use actual NBA API endpoints

const BASE_URL = 'https://api.balldontlie.io/v1'; // Example NBA API
const API_KEY = process.env.REACT_APP_NBA_API_KEY; // Add your API key to .env file

// Create axios instance with default config
const nbaApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
    'Content-Type': 'application/json'
  }
});

// Mock data for demonstration
const mockPlayers = [
  { id: 1, first_name: 'LeBron', last_name: 'James', team: { full_name: 'Los Angeles Lakers' }, position: 'SF' },
  { id: 2, first_name: 'Stephen', last_name: 'Curry', team: { full_name: 'Golden State Warriors' }, position: 'PG' },
  { id: 3, first_name: 'Kevin', last_name: 'Durant', team: { full_name: 'Phoenix Suns' }, position: 'SF' },
  { id: 4, first_name: 'Giannis', last_name: 'Antetokounmpo', team: { full_name: 'Milwaukee Bucks' }, position: 'PF' },
  { id: 5, first_name: 'Luka', last_name: 'Dončić', team: { full_name: 'Dallas Mavericks' }, position: 'PG' },
  { id: 6, first_name: 'Jayson', last_name: 'Tatum', team: { full_name: 'Boston Celtics' }, position: 'SF' },
  { id: 7, first_name: 'Joel', last_name: 'Embiid', team: { full_name: 'Philadelphia 76ers' }, position: 'C' },
  { id: 8, first_name: 'Nikola', last_name: 'Jokić', team: { full_name: 'Denver Nuggets' }, position: 'C' },
];

const generateMockGameStats = (playerId) => {
  return Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    home_team: { abbreviation: ['LAL', 'GSW', 'BOS', 'MIA', 'DEN'][index] },
    visitor_team: { abbreviation: ['PHX', 'DAL', 'MIL', 'PHI', 'BKN'][index] },
    pts: Math.floor(Math.random() * 30) + 15,
    reb: Math.floor(Math.random() * 12) + 3,
    ast: Math.floor(Math.random() * 10) + 2,
    stl: Math.floor(Math.random() * 3) + 1,
    blk: Math.floor(Math.random() * 3),
    fg_pct: (Math.random() * 0.4 + 0.4).toFixed(3),
    min: `${Math.floor(Math.random() * 10) + 30}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    turnover: Math.floor(Math.random() * 5) + 1,
    pf: Math.floor(Math.random() * 4) + 1
  }));
};

// API functions
export const searchPlayers = async (searchTerm) => {
  try {
    // For demo purposes, using mock data
    // In production, you would use:
    // const response = await nbaApi.get(`/players?search=${searchTerm}`);
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    const filteredPlayers = mockPlayers.filter(player => 
      `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      data: filteredPlayers,
      meta: { total_count: filteredPlayers.length }
    };
  } catch (error) {
    console.error('Error searching players:', error);
    throw new Error('Failed to search players');
  }
};

export const getPlayerStats = async (playerId, season = '2023') => {
  try {
    // For demo purposes, using mock data
    // In production, you would use:
    // const response = await nbaApi.get(`/stats?seasons[]=${season}&player_ids[]=${playerId}&per_page=5`);
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
    
    const stats = generateMockGameStats(playerId);
    
    return {
      data: stats,
      meta: { total_count: stats.length }
    };
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw new Error('Failed to fetch player statistics');
  }
};

export const getPlayerById = async (playerId) => {
  try {
    // For demo purposes, using mock data
    // In production, you would use:
    // const response = await nbaApi.get(`/players/${playerId}`);
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    const player = mockPlayers.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    return player;
  } catch (error) {
    console.error('Error fetching player:', error);
    throw new Error('Failed to fetch player details');
  }
};

export const getAllPlayers = async (page = 1, perPage = 25) => {
  try {
    // For demo purposes, using mock data
    // In production, you would use:
    // const response = await nbaApi.get(`/players?page=${page}&per_page=${perPage}`);
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    return {
      data: mockPlayers,
      meta: { 
        total_count: mockPlayers.length,
        current_page: page,
        per_page: perPage
      }
    };
  } catch (error) {
    console.error('Error fetching players:', error);
    throw new Error('Failed to fetch players');
  }
};

// Helper functions
export const formatPlayerName = (player) => {
  return `${player.first_name} ${player.last_name}`;
};

export const formatTeamName = (team) => {
  return team.full_name || team.name || 'Unknown Team';
};

export const calculateAverages = (stats) => {
  if (!stats || stats.length === 0) return {};
  
  const totals = stats.reduce((acc, game) => ({
    points: acc.points + (game.pts || 0),
    rebounds: acc.rebounds + (game.reb || 0),
    assists: acc.assists + (game.ast || 0),
    steals: acc.steals + (game.stl || 0),
    blocks: acc.blocks + (game.blk || 0),
  }), { points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 });
  
  const gameCount = stats.length;
  
  return {
    ppg: (totals.points / gameCount).toFixed(1),
    rpg: (totals.rebounds / gameCount).toFixed(1),
    apg: (totals.assists / gameCount).toFixed(1),
    spg: (totals.steals / gameCount).toFixed(1),
    bpg: (totals.blocks / gameCount).toFixed(1),
  };
};

export default nbaApi;
