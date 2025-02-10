<template>
  <footer class="text-light bg-info text-center">
      Copyright &copy; {{ thisYear }}
      <a href="https://wenge-it.com" class="text-light">Wengé IT</a>.
    
      Powered by
      <a href="https://www.mongodb.com/cloud" class="text-light">MongoDB Cloud</a>
      and
      <a href="https://opentdb.com/" class="text-light">Open Trivia Database</a>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {},
  data() {
    return {
      thisYear: new Date().getFullYear()
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer {
  font-size: 10px;
  padding: 5px;
}
</style>
