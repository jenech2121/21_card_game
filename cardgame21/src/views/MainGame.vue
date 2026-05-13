<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const game = useGameStore();
const router = useRouter();

onMounted(async () => {
  // Начинаем игру: если нет текущей карты и игра не окончена — тянем жребий
  if (!game.currentCard && !game.isGameOver) {
    await game.drawNextCard();
  }
});
</script>

<template>
  <!-- ОСНОВНОЙ КОНТЕЙНЕР: Глубокий болотно-зеленый фон -->
  <div class="min-h-screen bg-[#051c12] p-2 sm:p-6 text-amber-100 font-['Cinzel'] overflow-hidden relative select-none flex flex-col items-center">
    
    <!-- ФОН: Магическое изумрудное свечение -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparentBase_70%)] pointer-events-none"></div>

    <!-- ВЕРХНЯЯ ПАНЕЛЬ: Счет, Жизни и Выход -->
    <div class="relative z-20 flex justify-between items-center w-full max-w-4xl mb-4 sm:mb-8 mt-2 px-2">
      <!-- Счетчик очков -->
      <div class="bg-black/60 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-amber-900/30 flex items-center gap-2 shadow-2xl">
        <span class="text-amber-700 uppercase text-[9px] sm:text-[11px] font-bold tracking-tighter">Свиток счета:</span>
        <span class="text-xl sm:text-3xl font-black text-amber-500 tracking-tighter">{{ game.score }}</span>
      </div>

      <!-- ЖИЗНИ (Сердца) -->
      <div class="flex gap-2 sm:gap-4 items-center bg-emerald-950/40 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-red-900/20 shadow-inner">
        <div v-for="n in 3" :key="n" class="flex items-center">
          <span v-if="n <= game.lives" class="text-xl sm:text-3xl text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse">♥</span>
          <span v-else class="text-xl sm:text-3xl text-white/5 grayscale">♥</span>
        </div>
      </div>

      <button @click="router.push('/')" class="text-[9px] sm:text-[11px] uppercase tracking-widest border border-amber-900/30 px-3 py-1.5 rounded bg-black/40 hover:bg-red-950/40 transition-all">
        Сдаться
      </button>
    </div>

    <!-- ИГРОВОЕ ПОЛЕ: 4 Колонки -->
    <div class="relative z-10 grid grid-cols-4 gap-2 sm:gap-8 w-full max-w-5xl mx-auto h-[300px] sm:h-[400px]">
      <div v-for="(col, idx) in game.columns" :key="idx"
           @click="game.placeCard(idx)"
           class="relative border-b-4 border-emerald-800/40 bg-[#061f16]/40 rounded-b-2xl sm:rounded-b-[2rem] cursor-pointer group transition-all hover:bg-emerald-900/20">
        
        <!-- СУММА НАД КОЛОНКОЙ -->
        <div class="absolute -top-8 sm:-top-12 left-0 right-0 text-center pointer-events-none">
          <span v-if="game.calculateColumnValue(col) > 0" 
                class="font-black text-lg sm:text-3xl tracking-tighter transition-all duration-300 inline-block" 
                :class="{
                  'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)] scale-125': game.calculateColumnValue(col) === 21 || col.length === 5,
                  'text-amber-700': game.calculateColumnValue(col) < 21 && col.length < 5,
                  'text-red-500 animate-bounce': game.calculateColumnValue(col) > 21
                }">
            {{ (col.length === 5 && game.calculateColumnValue(col) <= 21) ? 'COMBO!' : game.calculateColumnValue(col) }}
          </span>
        </div>
        
        <!-- КАРТЫ ВНУТРИ КОЛОНКИ -->
        <TransitionGroup name="cards">
          <div v-for="(card, cIdx) in col" :key="card.id"
               class="absolute left-1/2 -translate-x-1/2 w-[19vw] max-w-[100px] h-[27vw] max-h-[145px]"
               :style="{ top: (cIdx * 25) + 'px', zIndex: cIdx }">
            
            <div class="w-full h-full bg-gradient-to-br from-[#fffef5] to-[#f4f0db] border-2 border-amber-900/50 rounded-lg shadow-xl flex items-center justify-center text-[#020a06] relative">
              <!-- Углы карты -->
              <div class="absolute top-1 left-1 flex flex-col items-center leading-none">
                <span class="font-black text-sm sm:text-xl">{{ card.rank }}</span>
                <span class="text-[10px] sm:text-xs" :class="{'text-red-600': ['♥','♦'].includes(card.suit)}">{{ card.suit }}</span>
              </div>
              <!-- Центр карты -->
              <div class="text-3xl sm:text-5xl opacity-80" :class="{'text-red-600': ['♥','♦'].includes(card.suit)}">
                {{ card.suit }}
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Пустая колонка (подсказка) -->
        <div v-if="col.length === 0" class="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
          <span class="text-6xl sm:text-8xl">✧</span>
        </div>
      </div>
    </div>

    <!-- НИЖНЯЯ ПАНЕЛЬ: Колода и Текущая карта -->
    <div class="relative z-20 mt-auto mb-8 sm:mb-14 flex justify-center items-center gap-12 sm:gap-32 pt-4">
      
      <!-- КОЛОДА (Рубашка) -->
      <div class="flex flex-col items-center group">
        <div class="w-[20vw] max-w-[90px] h-[28vw] max-h-[130px] bg-gradient-to-br from-[#0a3d29] to-[#041a10] border-2 border-amber-700/60 rounded-xl relative overflow-hidden flex items-center justify-center shadow-2xl">
           <div class="absolute inset-2 border border-amber-500/20 rounded-lg"></div>
           <span class="text-3xl text-amber-500/30">👁</span>
        </div>
        <p class="mt-2 text-[8px] uppercase tracking-[0.4em] text-emerald-800 font-black">Колода</p>
      </div>

      <!-- ТЕКУЩАЯ КАРТА (Твой жребий) -->
      <div class="flex flex-col items-center">
        <Transition name="draw-card" mode="out-in">
          <div v-if="game.currentCard && !game.isGameOver" :key="game.currentCard.id" class="relative">
            <!-- Свечение под активной картой -->
            <div class="absolute -inset-8 bg-amber-500/10 blur-3xl rounded-full animate-pulse"></div>
            
            <div class="w-[28vw] max-w-[130px] h-[40vw] max-h-[185px] bg-gradient-to-br from-[#fffef5] to-[#f4f0db] border-[3px] border-amber-500 rounded-xl flex items-center justify-center text-[#020a06] relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">
               <div class="absolute top-2 left-2 flex flex-col items-center leading-none">
                 <span class="font-black text-2xl sm:text-4xl tracking-tighter">{{ game.currentCard.rank }}</span>
                 <span class="text-lg sm:text-2xl" :class="{'text-red-600': ['♥','♦'].includes(game.currentCard.suit)}">{{ game.currentCard.suit }}</span>
               </div>
               <div class="text-6xl sm:text-8xl" :class="{'text-red-600': ['♥','♦'].includes(game.currentCard.suit)}">
                 {{ game.currentCard.suit }}
               </div>
            </div>
          </div>
        </Transition>
        <p class="mt-4 sm:mt-8 text-amber-700 uppercase tracking-[0.5em] text-[10px] font-black italic animate-pulse">Твой жребий</p>
      </div>
    </div>

    <!-- МОДАЛЬНОЕ ОКНО: КОНЕЦ ИГРЫ -->
    <Transition name="modal">
      <div v-if="game.isGameOver" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div class="max-w-xs w-full bg-[#0a1f14] border-2 border-red-900/40 p-10 text-center rounded-2xl relative shadow-[0_0_50px_rgba(220,38,38,0.2)]">
          <h2 class="text-5xl text-red-700 mb-2 uppercase font-black tracking-tighter font-['Cinzel_Decorative']">МРАК</h2>
          <p class="text-amber-500 mb-10 uppercase tracking-widest font-bold">Счет: {{ game.score }}</p>
          <button @click="game.resetGame" class="w-full py-4 bg-red-900 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 border-b-4 border-red-950">
            Воскреснуть
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Анимация карт при появлении в колонке */
.cards-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.cards-enter-from {
  opacity: 0;
  transform: translate(-50%, 100px) scale(1.2) rotate(10deg);
}

/* Анимация вытягивания карты (Твой жребий) */
.draw-card-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.draw-card-enter-from {
  opacity: 0;
  transform: translateX(-100px) rotate(-15deg) scale(0.5);
}

/* Анимация модального окна */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Специфические цвета */
.text-red-600 { color: #b91c1c; }

/* Кастомный скроллбар (если появится) */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #051c12; }
::-webkit-scrollbar-thumb { background: #10b98133; }
</style>