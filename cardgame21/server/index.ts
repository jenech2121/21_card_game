import express from 'express';
import cors from 'cors';
import { Telegraf } from 'telegraf';

// 1. ИСПРАВЛЕНИЕ: Переменные без кавычек
const BOT_TOKEN = '8650182991:AAHoe3iOoSiN-F03O3ux6v4dHAnieU6Wd8w';
const WEB_APP_URL = 'https://t.me/Mythic21gamebot/play'; 

// Передаем переменную BOT_TOKEN, а не строку 'BOT_TOKEN'
const bot = new Telegraf(BOT_TOKEN);

const app = express();
app.use(cors());
app.use(express.json());

interface Card {
  id: string; 
  suit: string; 
  rank: string; 
  value: number;
}

const suits = ['♠', '♣', '♥', '♦'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let leaderboard: { name: string; score: number }[] = [];

// 2. ИСПРАВЛЕНИЕ: Кнопка запуска Mini App
bot.start((ctx) => {
  ctx.reply(`Приветствую, ${ctx.from.first_name}! 🌙\nГотов испытать судьбу в Мистических 21?`, {
    reply_markup: {
      inline_keyboard: [
        // Передаем переменную WEB_APP_URL без кавычек
        [{ text: "Вступить в игру 🃏", web_app: { url: WEB_APP_URL } }]
      ]
    }
  });
});

// Запуск бота с обработкой ошибок
bot.launch()
  .then(() => console.log('✅ Telegram Bot запущен и готов к игре!'))
  .catch((err) => console.error('❌ Ошибка запуска бота:', err));

// --- API ЭНДПОИНТЫ ---

// API: Генерация случайной карты
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
    leaderboard = leaderboard.slice(0, 10);
  }
  res.json(leaderboard);
});

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard);
});

// 3. ИСПРАВЛЕНИЕ: Порт 3000 (для работы с Go-прокси в main.go)
const PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`[Node.js] Logic running on http://127.0.0.1:${PORT}`);
});

// Грациозная остановка бота при выключении сервера
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));