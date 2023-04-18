<script setup>
import { ref, computed } from 'vue'
import {Routes} from './router'

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return Routes[currentPath.value.slice(1) || '/']
})
</script>

<template>
    <div  style="width: 90vw; height: 100vh;">
      <component :is="currentView"/>
    </div>
</template>