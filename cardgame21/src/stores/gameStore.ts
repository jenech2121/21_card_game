import { defineStore } from 'pinia';
import axios from 'axios';

// Оставляем локальный URL для разработки
const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export const useGameStore = defineStore('game', {
  state: () => ({
    columns: [[], [], [], []] as any[][],
    currentCard: null as any,
    lives: 3,
    score: 0,
    isGameOver: false,
    playerName: 'Странник',
    leaderboard: [] as any[]
  }),
  
  getters: {
    getSuitName: () => (suit: string) => {
      const map: Record<string, string> = { '♠': 'spades', '♣': 'clubs', '♥': 'hearts', '♦': 'diamonds' };
      return (suit && map[suit]) ? map[suit] : 'spades';
    },
    getRankName: () => (rank: string) => {
      const map: Record<string, string> = { 'A': 'ace', 'K': 'king', 'Q': 'queen', 'J': 'jack' };
      return (rank && map[rank]) ? map[rank] : rank;
    }
  },

  actions: {
    async resetGame() {
      this.columns = [[], [], [], []];
      this.score = 0;
      this.lives = 3;
      this.isGameOver = false;
      await this.drawNextCard();
    },

    async drawNextCard() {
      try {
        const res = await api.get('/draw');
        this.currentCard = res.data;
      } catch (e) {
        console.error("Ошибка призыва карты. Проверь бэкенд!");
      }
    },

    async placeCard(colIndex: number) {
      if (this.isGameOver || !this.currentCard) return;

      const targetColumn = this.columns[colIndex];
      const cardToPlace = { ...this.currentCard };

      // Гарантируем наличие числового значения карты перед вставкой
      if (cardToPlace.value === undefined || cardToPlace.value === null) {
        if (cardToPlace.rank === 'A') cardToPlace.value = 11;
        else if (['K', 'Q', 'J'].includes(cardToPlace.rank)) cardToPlace.value = 10;
        else cardToPlace.value = parseInt(cardToPlace.rank) || 10;
      }

      // 1. Добавляем карту
      targetColumn.push(cardToPlace);

      // 2. Считаем текущее состояние колонки
      const total = this.calculateColumnValue(targetColumn);
      const cardCount = targetColumn.length;

      // 3. ПРОВЕРКА ПОБЕДНЫХ УСЛОВИЙ
      // Условие 1: Набрали ровно 21
      // Условие 2: Собрали 5 карт и нет перебора (Combo)
      const isTwentyOne = total === 21;
      const isFiveCardCombo = cardCount === 5 && total <= 21;

      if (isTwentyOne || isFiveCardCombo) {
        // Начисляем очки (за комбо из 5 карт даем чуть больше)
        this.score += isFiveCardCombo ? 150 : 100;
        
        // Очищаем колонку с задержкой для анимации
        setTimeout(() => {
          this.columns[colIndex] = [];
        }, 300);
      } 
      // 4. ПРОВЕРКА ПЕРЕБОРА
      else if (total > 21) {
        this.lives--;
        
        if (this.lives <= 0) {
          this.isGameOver = true;
          await this.saveScore();
        } else {
          // Если жизни еще есть, просто сжигаем колонку
          setTimeout(() => {
            this.columns[colIndex] = [];
          }, 300);
        }
      }

      // 5. Тянем следующую карту, если игра продолжается
      if (!this.isGameOver) {
        await this.drawNextCard();
      }
    },

    calculateColumnValue(cards: any[]) {
      if (!cards || !cards.length) return 0;
      
      let sum = cards.reduce((acc, card) => acc + (card.value || 0), 0);
      let aces = cards.filter(c => c.rank === 'A').length;
      
      // Мягкая логика Туза: если перебор, Туз превращается из 11 в 1
      while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
      }
      return sum;
    },

    async saveScore() {
      try {
        const res = await api.post('/leaderboard', { 
          name: this.playerName, 
          score: this.score 
        });
        this.leaderboard = res.data;
      } catch (e) {
        console.error("Ошибка сохранения счета");
      }
    }
  }
});