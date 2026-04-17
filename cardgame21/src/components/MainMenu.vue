<script setup lang="ts">
import { ref } from 'vue';

const showMenu = ref(true);

const startGame = () => console.log("Ритуал начат...");
const openSettings = () => console.log("Открываем свитки судьбы...");
</script>

<template>
  <!-- Мифические шрифты -->
  <component is="style">
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;700&display=swap');
  </component>

  <!-- Задний фон: глубокий болотно-зелёный -->
  <div class="relative min-h-screen w-full bg-[#051c12] flex items-center justify-center overflow-hidden font-['Cinzel']">
    
    <!-- 1. ТЕКСТУРА (Шум и мелкие частицы) -->
    <div class="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

    <!-- 2. БОЛОТНЫЙ ТУМАН (Зеленовато-желтые испарения) -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="swamp-mist opacity-50"></div>
      <div class="swamp-mist-2 opacity-30"></div>
    </div>

    <!-- 3. ПЛАВАЮЩИЕ СИМВОЛЫ -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div v-for="n in 12" :key="n" 
           class="floating-symbol absolute text-amber-600/10 select-none"
           :style="{
             left: (n * 8) + '%',
             top: Math.random() * 100 + '%',
             animationDuration: (12 + n) + 's',
             animationDelay: (n * -1) + 's',
             fontSize: (Math.random() * 25 + 20) + 'px'
           }">
        {{ ['♠', '♣', '♥', '♦', '✦', '✧'][n % 6] }}
      </div>
    </div>

    <!-- 4. ОСНОВНОЙ КОНТЕНТ -->
    <Transition name="mythic-fade" appear>
      <div v-if="showMenu" class="relative z-10 w-full max-w-lg text-center px-6">
        
        <!-- Заголовок -->
        <div class="mb-12 relative select-none">
          <!-- Глубокое зеленое свечение за цифрой -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-900/20 blur-[100px] rounded-full"></div>
          
          <h1 class="relative text-[10rem] md:text-[13rem] font-['Cinzel_Decorative'] font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-500 to-amber-900 leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            21
          </h1>
          
          <div class="flex items-center justify-center gap-4 -mt-4">
            <svg class="w-4 h-4 text-amber-700/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
            </svg>
            <p class="text-amber-600/80 font-bold tracking-[0.4em] uppercase text-xs md:text-sm">
              Mystic Swamp Edition
            </p>
            <svg class="w-4 h-4 text-amber-700/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
            </svg>
          </div>
        </div>

        <!-- Кнопки управления (Оба блока видимы) -->
        <div class="flex flex-col gap-5 max-w-[340px] mx-auto">
          
          <!-- Кнопка ИГРАТЬ (Главная) -->
          <button 
            @click="startGame"
            class="group relative py-5 bg-amber-950/10 border border-amber-600/40 text-amber-200 transition-all duration-500 hover:border-amber-400 hover:bg-amber-900/20 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
          >
            <span class="relative z-10 flex items-center justify-center gap-4 text-xl font-bold tracking-[0.2em] uppercase">
              <svg class="w-5 h-5 transition-transform group-hover:scale-125" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Начать ритуал
            </span>
            <!-- Декоративные уголки -->
            <div class="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-amber-500/60"></div>
            <div class="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-amber-500/60"></div>
          </button>

          <!-- Кнопка НАСТРОЙКИ (Теперь видимый блок) -->
          <button 
            @click="openSettings"
            class="group relative py-4 bg-[#0a2e22]/40 border border-emerald-900 text-amber-700/80 transition-all duration-500 hover:border-emerald-600 hover:text-amber-400"
          >
            <span class="relative z-10 flex items-center justify-center gap-4 text-sm font-bold tracking-[0.3em] uppercase">
              <svg class="w-4 h-4 group-hover:rotate-90 transition-transform duration-1000" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              Настройки Судьбы
            </span>
          </button>
        </div>

        <!-- Футер -->
        <div class="mt-20 opacity-20">
          <p class="text-[9px] text-amber-100 tracking-[0.5em] uppercase italic font-bold">
            © MMXXVI TwentyOne Master | Nikonovich
          </p>
        </div>
      </div>
    </Transition>

    <!-- Виньетка (затемнение по краям с зеленоватым отливом) -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,10,5,0.9)_100%)] pointer-events-none"></div>
  </div>
</template>

<style scoped>
/* Анимация мистических символов */
.floating-symbol {
  animation: float-up linear infinite;
  text-shadow: 0 0 15px rgba(251, 191, 36, 0.1);
}

@keyframes float-up {
  0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
  15% { opacity: 0.3; }
  85% { opacity: 0.3; }
  100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
}

/* Болотный туман (Зелено-желтые облака) */
.swamp-mist, .swamp-mist-2 {
  position: absolute;
  width: 250%;
  height: 250%;
  background: radial-gradient(circle, rgba(20, 83, 45, 0.15) 0%, transparent 60%);
  top: -75%;
  left: -75%;
  animation: rotate-mist 50s linear infinite;
}
.swamp-mist-2 {
  animation: rotate-mist 70s linear infinite reverse;
  background: radial-gradient(circle, rgba(101, 163, 13, 0.05) 0%, transparent 60%);
}

@keyframes rotate-mist {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Анимация появления */
.mythic-fade-enter-active {
  transition: all 2s cubic-bezier(0.19, 1, 0.22, 1);
}
.mythic-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  filter: blur(20px);
}
</style>