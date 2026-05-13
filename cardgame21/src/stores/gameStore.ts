import { defineStore } from 'pinia';
import axios from 'axios';

// Для деплоя используем /api, чтобы Go-прокси (main.go) перехватывал запросы
const api = axios.create({ baseURL: '/api' });

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
        console.error("Ошибка призыва карты.");
      }
    },

    async placeCard(colIndex: number) {
      if (this.isGameOver || !this.currentCard) return;

      const targetColumn = this.columns[colIndex];
      
      // ИСПРАВЛЕНИЕ ДЛЯ TS: Проверяем, что колонка существует
      if (!targetColumn) return;

      const cardToPlace = { ...this.currentCard };

      if (cardToPlace.value === undefined || cardToPlace.value === null) {
        if (cardToPlace.rank === 'A') cardToPlace.value = 11;
        else if (['K', 'Q', 'J'].includes(cardToPlace.rank)) cardToPlace.value = 10;
        else cardToPlace.value = parseInt(cardToPlace.rank) || 10;
      }

      targetColumn.push(cardToPlace);

      const total = this.calculateColumnValue(targetColumn);
      const cardCount = targetColumn.length;

      const isTwentyOne = total === 21;
      const isFiveCardCombo = cardCount === 5 && total <= 21;

      if (isTwentyOne || isFiveCardCombo) {
        this.score += isFiveCardCombo ? 150 : 100;
        
        setTimeout(() => {
          // ИСПРАВЛЕНИЕ ДЛЯ TS: Повторная проверка перед очисткой
          if (this.columns[colIndex]) {
            this.columns[colIndex] = [];
          }
        }, 300);
      } 
      else if (total > 21) {
        this.lives--;
        
        if (this.lives <= 0) {
          this.isGameOver = true;
          await this.saveScore();
        } else {
          setTimeout(() => {
            if (this.columns[colIndex]) {
              this.columns[colIndex] = [];
            }
          }, 300);
        }
      }

      if (!this.isGameOver) {
        await this.drawNextCard();
      }
    },

    calculateColumnValue(cards: any[] | undefined) {
      // ИСПРАВЛЕНИЕ ДЛЯ TS: Обработка случая, когда cards не переданы
      if (!cards || !cards.length) return 0;
      
      let sum = cards.reduce((acc, card) => acc + (card.value || 0), 0);
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
        console.error("Ошибка сохранения счета");
      }
    }
  }
});