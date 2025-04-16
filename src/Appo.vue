<template>
  <div>
    <h1>API Data:</h1>
    <pre>{{ apiData }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const apiData = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000')
    const data = await response.json()
    apiData.value = data
  } catch (error) {
    console.error('API error:', error)
  }
})
</script>