<template>
  <div id="app">
    <AppHeader></AppHeader>

    <div class="app-content">
      <b-container fluid="md">
        <transition name="fade" mode="out-in">
          <RouterView />
        </transition>
      </b-container>
    </div>

    <AppFooter></AppFooter>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style lang="scss">
#app {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  .app-content {
    margin-top: 3em;
    margin-bottom: 3em;
  }
}
@media (min-width: 992px) {
  .perfect-center-lg {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
