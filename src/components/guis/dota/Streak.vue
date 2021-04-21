<template>
  <div class="container mt-2 mb-2">
    <div v-if="streak !== null" class="streak">
      <span v-if="streak.isWin" class="text-success">WIN STREAK X{{streak.count}}</span>
      <span v-else class="text-danger">LOSE STREAK x{{streak.count}}</span>
    </div>
    <span v-else class="spinner-border spinner-border-sm"></span>
  </div>
</template>

<script>
export default {
  name: "Streak",
  props: {
    streak: Object,
  }
}
</script>

<style scoped>
.streak {
  font-size: 24px;
}
</style>