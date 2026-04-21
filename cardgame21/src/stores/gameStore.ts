import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export const useGameStore = defineStore('game', {
  state: () => ({
    columns: [[], [], [], []] as any[][],
    currentCard: null as any,
    score: 0,
    isGameOver: false,
    playerName: 'Странник',
    leaderboard: [] as any[]
  }),
  
  getters: {
    // Хелпер для преобразования символа в имя для card-engine
    getSuitName: () => (suit: string) => {
      const map: Record<string, string> = {
        '♠': 'spades',
        '♣': 'clubs',
        '♥': 'hearts',
        '♦': 'diamonds'
      };
      return map[suit] || 'spades';
    }
  },

  actions: {
    async resetGame() {
      this.columns = [[], [], [], []];
      this.score = 0;
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
      targetColumn.push(this.currentCard);

      const total = this.calculateColumnValue(targetColumn);

      if (total === 21) {
        this.score += 100;
        setTimeout(() => {
          this.columns[colIndex] = [];
        }, 300);
      } else if (total > 21) {
        this.isGameOver = true;
        await this.saveScore();
      }

      if (!this.isGameOver) {
        await this.drawNextCard();
      }
    },

    calculateColumnValue(cards: any[]) {
      let sum = cards.reduce((acc, card) => acc + card.value, 0);
      let aces = cards.filter(c => c.rank === 'A').length;

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
        console.error("Ошибка сохранения рекорда");
      }
    }
  }
});