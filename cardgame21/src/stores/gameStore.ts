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
    /**
     * Инициализация Telegram WebApp
     * Устанавливает имя игрока, расширяет окно и настраивает цвета
     */
    initTelegram() {
      const tg = (window as any).Telegram?.WebApp;

      if (tg) {
        tg.ready(); // Сообщаем Telegram, что мы загрузились
        tg.expand(); // Разворачиваем игру на весь экран
        
        // Устанавливаем имя игрока из Telegram
        if (tg.initDataUnsafe?.user) {
          this.playerName = tg.initDataUnsafe.user.first_name;
        }
        
        // Подкрасим рамку и фон окна Telegram под цвет твоей игры
        tg.setHeaderColor('#051c12');
        tg.setBackgroundColor('#051c12');
      }
    },

    async resetGame() {
      this.initTelegram(); // Инициализируем ТГ при каждом сбросе/старте
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
      
      // Проверяем, что колонка существует
      if (!targetColumn) return;

      const cardToPlace = { ...this.currentCard };

      // Расчет значения карты, если оно не пришло с сервера
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