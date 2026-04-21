import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

interface Card {
  id: string; suit: string; rank: string; value: number;
}

const suits = ['♠', '♣', '♥', '♦'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Хранилище в памяти (для продакшена лучше БД)
let leaderboard: { name: string; score: number }[] = [];

// API: Генерация случайной карты (Бесконечная колода)
app.get('/api/draw', (req, res) => {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  
  let value = parseInt(rank);
  if (['J', 'Q', 'K'].includes(rank)) value = 10;
  if (rank === 'A') value = 11;

  const card: Card = {
    id: Math.random().toString(36).substring(2, 9),
    suit,
    rank,
    value: isNaN(value) ? 10 : value
  };
  
  res.json(card);
});

// API: Таблица лидеров
app.post('/api/leaderboard', (req, res) => {
  const { name, score } = req.body;
  if (score > 0) {
    leaderboard.push({ name: name || 'Аноним', score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10); // Только ТОП-10
  }
  res.json(leaderboard);
});

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard);
});

app.listen(3001, () => console.log('Server running on port 3001'));