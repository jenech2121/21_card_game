<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const game = useGameStore();
const router = useRouter();

onMounted(async () => {
  if (!game.currentCard && !game.isGameOver) {
    await game.drawNextCard();
  }
});
</script>

<template>
  <!-- ОСНОВНОЙ КОНТЕЙНЕР: Фон стал чуть светлее и сочнее -->
  <div class="min-h-screen bg-[#0a1f14] p-2 sm:p-6 text-amber-100 font-['Cinzel'] overflow-hidden relative select-none flex flex-col items-center">
    
    <!-- ФОН: Усиленное изумрудное свечение -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none"></div>

    <!-- ВЕРХНЯЯ ПАНЕЛЬ -->
    <div class="relative z-20 flex justify-between items-center w-full max-w-4xl mb-4 sm:mb-8 mt-2 px-2">
      <!-- Очки -->
      <div class="bg-black/60 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-amber-900/30 flex items-center gap-2 shadow-xl">
        <span class="text-amber-700 uppercase text-[9px] sm:text-[11px] font-bold tracking-tighter">Счет:</span>
        <span class="text-xl sm:text-3xl font-black text-amber-500 tracking-tighter">{{ game.score }}</span>
      </div>

      <!-- ЖИЗНИ -->
      <div class="flex gap-2 sm:gap-4 items-center bg-emerald-900/20 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-red-900/20 shadow-inner">
        <div v-for="n in 3" :key="n" class="flex items-center">
          <span v-if="n <= game.lives" class="text-xl sm:text-3xl text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse">♥</span>
          <span v-else class="text-xl sm:text-3xl text-white/5 grayscale">♥</span>
        </div>
      </div>

      <button @click="router.push('/')" class="text-[9px] sm:text-[11px] uppercase tracking-widest border border-amber-900/30 px-3 py-1.5 rounded bg-black/20 hover:bg-red-950/40 transition-all">
        Выход
      </button>
    </div>

    <!-- ИГРОВОЕ ПОЛЕ -->
    <div class="relative z-10 grid grid-cols-4 gap-2 sm:gap-8 w-full max-w-5xl mx-auto h-[280px] sm:h-[350px]">
      <div v-for="(col, idx) in game.columns" :key="idx"
           @click="game.placeCard(idx)"
           class="relative border-b-4 border-emerald-800/40 bg-[#061f16]/40 rounded-b-2xl sm:rounded-b-[2rem] cursor-pointer group transition-all hover:bg-emerald-900/20">
        
        <!-- Сумма -->
        <div class="absolute -top-7 sm:-top-10 left-0 right-0 text-center">
          <span v-if="game.calculateColumnValue(col) > 0" 
                class="font-black text-lg sm:text-2xl tracking-tighter transition-all duration-300" 
                :class="game.calculateColumnValue(col) === 21 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] scale-125' : 'text-amber-700'">
            {{ game.calculateColumnValue(col) }}
          </span>
        </div>
        
        <!-- КАРТЫ В КОЛОНКЕ -->
        <TransitionGroup name="cards">
          <div v-for="(card, cIdx) in col" :key="card.id"
               class="absolute left-1/2 -translate-x-1/2 card-container"
               :style="{ top: (cIdx * 22) + 'px', zIndex: cIdx }">
            
            <div class="card-body shadow-xl border-amber-900/50">
              <div class="card-corner top-left">
                <span class="rank">{{ card.rank }}</span>
                <span class="suit" :class="{'text-red-600': ['♥','♦'].includes(card.suit)}">{{ card.suit }}</span>
              </div>
              <div class="card-center" :class="{'text-red-600': ['♥','♦'].includes(card.suit)}">{{ card.suit }}</div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Подсказка -->
        <div v-if="col.length === 0" class="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
          <span class="text-6xl sm:text-8xl">✧</span>
        </div>
      </div>
    </div>

    <!-- НИЖНЯЯ ПАНЕЛЬ: Увеличенная карта "Твой жребий" -->
    <div class="relative z-20 mt-auto mb-6 sm:mb-10 flex justify-center items-center gap-10 sm:gap-24 pt-4">
      
      <!-- КОЛОДА (увеличенная) -->
      <div class="flex flex-col items-center group opacity-80">
        <div class="mythic-card-back-large shadow-2xl">
           <div class="gold-inner-border-large"></div>
           <div class="mystic-pattern-large"></div>
           <span class="emblem-large">👁</span>
        </div>
        <p class="mt-2 text-[9px] uppercase tracking-[0.4em] text-emerald-800 font-black">Колода</p>
      </div>

      <!-- ТЕКУЩАЯ КАРТА - УВЕЛИЧЕННАЯ -->
      <div class="flex flex-col items-center">
        <Transition name="draw-card" mode="out-in">
          <div v-if="game.currentCard && !game.isGameOver" :key="game.currentCard.id" class="relative">
            <!-- Свечение -->
            <div class="absolute -inset-10 bg-amber-500/10 blur-3xl rounded-full animate-pulse"></div>
            
            <div class="large-card-body current-card-glow shadow-[0_0_50px_rgba(0,0,0,0.8)]">
               <div class="large-card-corner top-left">
                 <span class="large-rank">{{ game.currentCard.rank }}</span>
                 <span class="large-suit" :class="{'text-red-600': ['♥','♦'].includes(game.currentCard.suit)}">{{ game.currentCard.suit }}</span>
               </div>
               <div class="large-card-center" :class="{'text-red-600': ['♥','♦'].includes(game.currentCard.suit)}">
                 {{ game.currentCard.suit }}
               </div>
            </div>
          </div>
        </Transition>
        <p class="mt-6 sm:mt-10 text-amber-700 uppercase tracking-[0.5em] text-[10px] font-black italic animate-pulse">Твой жребий</p>
      </div>
    </div>

    <!-- МОДАЛКА КОНЦА -->
    <Transition name="modal">
      <div v-if="game.isGameOver" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
        <div class="max-w-xs sm:max-w-md w-full bg-[#0a1f14] border-2 border-red-900/40 p-10 text-center rounded-2xl relative shadow-2xl">
          <h2 class="text-5xl sm:text-6xl text-red-700 mb-4 uppercase font-black tracking-tighter">Смерть</h2>
          <p class="text-lg sm:text-xl text-amber-500 mb-10 uppercase tracking-widest font-bold">Счет: {{ game.score }}</p>
          <button @click="game.resetGame" class="w-full py-5 bg-red-900 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg">
            Воскреснуть
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* РАЗМЕРЫ КАРТ В КОЛОНКАХ (оставляем как было) */
.card-container {
  width: 19vw; max-width: 110px;
  height: 27vw; max-height: 155px;
}

.card-body {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #fffef5 0%, #f4f0db 100%);
  border: 1.5px solid #92400e;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: #020a06; position: relative;
}

.card-corner {
  position: absolute; top: 4px; left: 4px;
  display: flex; flex-direction: column; align-items: center; line-height: 0.9;
}
.rank { font-weight: 900; font-size: 1.3rem; letter-spacing: -1px; }
.suit { font-size: 0.9rem; }
.card-center { font-size: 3rem; opacity: 0.9; }

/* ========== УВЕЛИЧЕННАЯ РУБАШКА КОЛОДЫ ========== */
.mythic-card-back-large {
  width: 32vw; max-width: 110px;
  height: 46vw; max-height: 150px;
  background: linear-gradient(135deg, #0a3d29 0%, #041a10 100%);
  border: 3px solid #b45309;
  border-radius: 16px;
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.gold-inner-border-large {
  position: absolute; inset: 8px;
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
}
.mystic-pattern-large {
  position: absolute; inset: 0; opacity: 0.1;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16Z' fill='%23f59e0b'/%3E%3C/svg%3E");
}
.emblem-large { font-size: 3rem; color: #f59e0b; opacity: 0.25; }

/* ========== УВЕЛИЧЕННАЯ КАРТА "ТВОЙ ЖРЕБИЙ" ========== */
.large-card-body {
  width: 32vw; max-width: 150px;
  height: 46vw; max-height: 200px;
  background: linear-gradient(135deg, #fffef5 0%, #f4f0db 100%);
  border: 3px solid #f59e0b;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: #020a06; position: relative;
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
}

.large-card-corner {
  position: absolute; top: 12px; left: 12px;
  display: flex; flex-direction: column; align-items: center; line-height: 0.9;
}

.large-rank {
  font-weight: 900;
  font-size: 2.5rem;
  letter-spacing: -2px;
}

.large-suit {
  font-size: 1.8rem;
}

.large-card-center {
  font-size: 6rem;
  opacity: 0.9;
}

.current-card-glow { 
  border-width: 4px; 
  border-color: #f59e0b;
  box-shadow: 0 0 40px rgba(245, 158, 11, 0.5);
}

/* АНИМАЦИИ */
.draw-card-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.draw-card-enter-from { opacity: 0; transform: translateX(-100px) scale(0.5); }

.cards-enter-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.cards-enter-from { opacity: 0; transform: translate(-50%, 150px) scale(1.1); }

/* Адаптив для мобильных устройств */
@media (max-width: 640px) {
  .rank { font-size: 1rem; }
  .card-center { font-size: 2.2rem; }
  .card-container { width: 30vw; height: 30vw; }
  
  .large-rank { font-size: 1.8rem; }
  .large-suit { font-size: 1.2rem; }
  .large-card-center { font-size: 3.5rem; }
  
  .large-card-body {
    width: 40vw;
    max-width: 180px;
    height: 56vw;
    max-height: 250px;
  }
  
  .mythic-card-back-large {
    width: 40vw;
    max-width: 180px;
    height: 56vw;
    max-height: 250px;
  }
  
  .emblem-large { font-size: 2rem; }
}

.text-red-600 { color: #b91c1c; }
</style>