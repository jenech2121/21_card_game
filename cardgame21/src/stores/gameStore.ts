import { defineStore } from 'pinia';
import axios from 'axios';

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
        console.error("Ошибка призыва карты");
      }
    },

    async placeCard(colIndex: number) {
      if (this.isGameOver || !this.currentCard) return;

      const targetColumn = this.columns[colIndex];
      // Гарантируем наличие числового значения карты
      const cardToPlace = { ...this.currentCard };
      if (!cardToPlace.value) {
         if (cardToPlace.rank === 'A') cardToPlace.value = 11;
         else if (['K', 'Q', 'J'].includes(cardToPlace.rank)) cardToPlace.value = 10;
         else cardToPlace.value = parseInt(cardToPlace.rank);
      }

      targetColumn.push(cardToPlace);
      const total = this.calculateColumnValue(targetColumn);

      if (total === 21) {
        this.score += 100;
        setTimeout(() => { this.columns[colIndex] = []; }, 300);
      } 
      else if (total > 21) {
        this.lives--; // Жизнь уходит
        console.log(`Осталось жизней: ${this.lives}`);
        
        if (this.lives <= 0) {
          this.isGameOver = true;
          await this.saveScore();
        } else {
          // Сжигаем колонку, но продолжаем
          setTimeout(() => { this.columns[colIndex] = []; }, 300);
        }
      }

      if (!this.isGameOver) {
        await this.drawNextCard();
      }
    },

    calculateColumnValue(cards: any[]) {
      if (!cards || !cards.length) return 0;
      let sum = cards.reduce((acc, card) => acc + (card.value || 0), 0);
      let aces = cards.filter(c => c.rank === 'A').length;
      
      // Логика туза: если перебор, считаем туз как 1 (вычитаем 10)
      while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
      }
      return sum;
    },

    async saveScore() {
      try {
        const res = await api.post('/leaderboard', { name: this.playerName, score: this.score });
        this.leaderboard = res.data;
      } catch (e) {}
    }
  }
});