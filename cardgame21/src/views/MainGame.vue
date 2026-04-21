<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';


const game = useGameStore();
const router = useRouter();

const handleExit = () => router.push('/');

onMounted(() => {
  if (!game.currentCard && !game.isGameOver) {
    game.drawNextCard();
  }
});
</script>

<template>
  <div class="min-h-screen bg-[#051c12] p-6 text-amber-200 font-['Cinzel'] overflow-hidden relative select-none">
    
    <div class="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

    <!-- Шапка -->
    <div class="relative z-10 flex justify-between items-center max-w-6xl mx-auto mb-16">
      <div class="bg-black/40 px-6 py-2 rounded-full border border-amber-900/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <span class="text-amber-700 mr-2 uppercase text-[10px] tracking-widest">Счет:</span>
        <span class="text-2xl font-bold text-amber-500">{{ game.score }}</span>
      </div>
      <button @click="handleExit" class="px-4 py-2 border border-amber-900/30 rounded hover:text-amber-400 transition-all text-[10px] uppercase tracking-widest">
        Прервать ритуал
      </button>
    </div>

    <!-- Игровое поле -->
    <div class="relative z-10 grid grid-cols-4 gap-8 max-w-6xl mx-auto h-[500px]">
      <!-- 
        ЗДЕСЬ МЫ УДАЛИЛИ .column-slot И ПРОПИСАЛИ ВСЕ КЛАССЫ НАПРЯМУЮ:
        border-2 border-emerald-950 (или #022c22) bg-[#0a2e22]/10 
      -->
      <div v-for="(col, idx) in game.columns" :key="idx"
           @click="game.placeCard(idx)"
           class="relative border-2 border-emerald-950 bg-[#0a2e22]/10 rounded-2xl transition-all duration-500 cursor-pointer group hover:border-amber-700/30 hover:bg-[#0a2e22]/30">
        
        <!-- Счетчик суммы -->
        <div class="absolute -top-10 left-0 right-0 text-center transition-all duration-300"
             :class="game.calculateColumnValue(col) > 0 ? 'opacity-100' : 'opacity-0'">
          <span class="text-[10px] text-amber-800 uppercase">Сумма:</span>
          <span class="ml-2 font-bold" :class="game.calculateColumnValue(col) === 21 ? 'text-green-500 animate-pulse' : 'text-amber-500'">
            {{ game.calculateColumnValue(col) }}
          </span>
        </div>
        
        <!-- КАРТЫ В КОЛОНКЕ -->
        <TransitionGroup name="cards">
          <div v-for="(card, cIdx) in col" :key="card.id"
               class="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
               :style="{ top: (cIdx * 35) + 'px', zIndex: cIdx }">
            <div>{{ card.rank }}</div>
              </div>
        </TransitionGroup>

        <!-- Пустой слот -->
        <div v-if="col.length === 0" class="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-20 transition-opacity">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z"/></svg>
        </div>
      </div>
    </div>

    <!-- Нижняя панель -->
    <div class="relative z-10 mt-20 flex justify-center items-end gap-16">
      
      <!-- Источник -->
      <div class="hidden md:flex flex-col items-center group">
         <PlayingCard :back="true" class="w-28 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />
         <p class="mt-4 text-[9px] uppercase text-amber-900 font-black tracking-widest">Источник</p>
      </div>

      <!-- ТЕКУЩАЯ КАРТА -->
      <div class="flex flex-col items-center">
        <Transition name="new-card" mode="out-in">
          <div v-if="game.currentCard && !game.isGameOver" :key="game.currentCard.id"
               class="relative z-20">
            <div class="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse"></div>
            <PlayingCard 
              :suit="game.getSuitName(game.currentCard.suit)" 
              :rank="game.currentCard.rank.toLowerCase()" 
              class="w-32 md:w-36 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform scale-110"
            />
          </div>
        </Transition>
        <p class="mt-8 text-amber-700 uppercase tracking-[0.5em] text-[10px] font-black italic">Следующая жертва</p>
      </div>
    </div>

    <!-- Модалка конца игры -->
    <Transition name="modal">
      <div v-if="game.isGameOver" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#020a06]/95 backdrop-blur-xl">
        <div class="max-w-md w-full bg-[#0a2e22] border border-amber-900/40 p-10 text-center shadow-[0_0_100px_rgba(0,0,0,1)] relative">
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-amber-500"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-amber-500"></div>
          
          <h2 class="font-['Cinzel_Decorative'] text-5xl text-red-800 mb-6 uppercase tracking-tighter">Ритуал Оборван</h2>
          <div class="text-2xl text-amber-500 mb-8 font-bold tracking-widest">Счет: {{ game.score }}</div>
          
          <div class="mb-10 space-y-3 bg-black/20 p-4 border border-white/5">
            <h3 class="text-[10px] text-amber-800 uppercase tracking-widest mb-2 font-black">Тени прошлого</h3>
            <div v-for="(leader, i) in game.leaderboard.slice(0, 3)" :key="i" class="flex justify-between text-xs tracking-widest uppercase">
              <span class="text-amber-900">{{ leader.name }}</span>
              <span class="text-amber-600">{{ leader.score }}</span>
            </div>
          </div>

          <button @click="game.resetGame" class="w-full py-4 bg-transparent border border-amber-600 text-amber-500 font-black uppercase tracking-widest hover:bg-amber-600 hover:text-[#051c12] transition-all">
            Начать новый цикл
          </button>
        </div>
      </div>
    </Transition>

    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)] pointer-events-none"></div>
  </div>
</template>

<style scoped>
/* Анимации полета карт */
.cards-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.cards-enter-from {
  opacity: 0;
  transform: translate(-50%, 300px) rotate(15deg) scale(0.5);
}

.new-card-enter-active { transition: all 0.4s ease; }
.new-card-leave-active { transition: all 0.3s ease; }
.new-card-enter-from { opacity: 0; transform: scale(0.8); filter: blur(10px); }
.new-card-leave-to { opacity: 0; transform: translateY(-50px) scale(1.1); filter: blur(10px); }

.modal-enter-active { transition: all 1s ease; }
.modal-enter-from { opacity: 0; transform: scale(1.05); filter: blur(20px); }
</style>