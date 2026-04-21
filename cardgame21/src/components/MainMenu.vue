<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

const showMenu = ref(true);
const isSettingsOpen = ref(false);
const musicVolume = ref(70);
const sfxVolume = ref(50);

const startGame = async () => {
  await gameStore.resetGame();
  router.push('/game'); // Убедись, что в роутере прописан путь /game
};

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};
</script>

<template>
  <div class="relative min-h-screen w-full bg-[#051c12] flex items-center justify-center overflow-hidden font-['Cinzel'] text-amber-200">
    <!-- Фон из твоего промта -->
    <div class="absolute inset-0 pointer-events-none opacity-40">
      <div class="swamp-mist"></div>
      <div v-for="n in 10" :key="n" class="floating-symbol absolute" 
           :style="{ left: (n * 10) + '%', animationDelay: (n * -1.5) + 's' }">
        {{ ['♠', '♣', '♥', '♦'][n % 4] }}
      </div>
    </div>

    <Transition name="mythic-fade" appear>
      <div v-if="showMenu" class="relative z-10 w-full max-w-lg text-center px-6">
        <div class="mb-12 relative select-none">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-900/20 blur-[100px] rounded-full"></div>
          <h1 class="relative text-[10rem] md:text-[13rem] font-['Cinzel_Decorative'] font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-500 to-amber-900 leading-none drop-shadow-2xl">
            21
          </h1>
          <p class="text-amber-600/80 font-bold tracking-[0.4em] uppercase text-xs mt-2">Mystic Swamp Edition</p>
        </div>

        <div class="flex flex-col gap-5 max-w-[340px] mx-auto">
          <button @click="startGame" class="mythic-btn bg-amber-950/10 border-amber-600/40 hover:border-amber-400 py-5 text-xl">
            <span class="flex items-center justify-center gap-4 uppercase tracking-widest">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Начать ритуал
            </span>
            <div class="corner -top-1 -left-1 border-t-2 border-l-2"></div>
            <div class="corner -bottom-1 -right-1 border-b-2 border-r-2"></div>
          </button>

          <button @click="toggleSettings" class="mythic-btn bg-[#0a2e22]/40 border-emerald-900 py-4 text-sm text-amber-700 hover:text-amber-400">
            <span class="flex items-center justify-center gap-3 uppercase tracking-[0.3em]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
              Настройки Судьбы
            </span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Окно настроек (код без изменений) -->
    <Transition name="modal">
      <div v-if="isSettingsOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="toggleSettings"></div>
        <div class="relative w-full max-w-sm bg-[#0a2e22] border-2 border-amber-600/50 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div class="corner -top-[2px] -left-[2px] w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
          <div class="corner -bottom-[2px] -right-[2px] w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>
          <h2 class="font-['Cinzel_Decorative'] text-3xl text-amber-500 mb-8 tracking-wider text-center">Свитки Звука</h2>
          <div class="space-y-8">
            <div class="space-y-3">
              <div class="flex justify-between text-xs uppercase tracking-[0.2em] text-amber-600"><span>Музыка Ветра</span><span>{{ musicVolume }}%</span></div>
              <input type="range" v-model="musicVolume" class="mythic-range" />
            </div>
            <div class="space-y-3">
              <div class="flex justify-between text-xs uppercase tracking-[0.2em] text-amber-600"><span>Шепот Болота</span><span>{{ sfxVolume }}%</span></div>
              <input type="range" v-model="sfxVolume" class="mythic-range" />
            </div>
          </div>
          <button @click="toggleSettings" class="mt-10 w-full py-3 border border-amber-600/30 text-amber-500 hover:bg-amber-500 hover:text-[#051c12] transition-all duration-300 font-bold tracking-widest uppercase text-sm">Вернуться в туман</button>
        </div>
      </div>
    </Transition>

    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,10,5,0.9)_100%)] pointer-events-none"></div>
  </div>
</template>

<style scoped>
/* Стили остаются как в твоем коде */
.mythic-btn { position: relative; transition: all 0.5s ease; border-width: 1px; }
.corner { position: absolute; width: 12px; height: 12px; border-color: rgba(245, 158, 11, 0.6); pointer-events: none; }
.mythic-range { -webkit-appearance: none; width: 100%; height: 4px; background: #051c12; border-radius: 2px; outline: none; border: 1px solid rgba(245, 158, 11, 0.2); }
.mythic-range::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #f59e0b; border: 2px solid #0a2e22; cursor: pointer; box-shadow: 0 0 10px rgba(245, 158, 11, 0.5); transform: rotate(45deg); }
.floating-symbol { bottom: -50px; animation: float linear infinite 15s; opacity: 0.1; }
@keyframes float { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 10% { opacity: 0.3; } 90% { opacity: 0.3; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
.modal-enter-active, .modal-leave-active { transition: all 0.5s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9) translateY(-20px); }
.swamp-mist { position: absolute; width: 200%; height: 200%; background: radial-gradient(circle, rgba(20, 83, 45, 0.2) 0%, transparent 70%); animation: rotate-mist 40s linear infinite; }
@keyframes rotate-mist { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.mythic-fade-enter-active { transition: all 1.5s ease-out; }
.mythic-fade-enter-from { opacity: 0; filter: blur(20px); transform: translateY(20px); }
</style>