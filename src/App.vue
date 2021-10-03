<template>
  <div>
    <h1 class="front-view-title">Drawing app</h1>

    <front-view></front-view>
  </div>
</template>

<script>
// @ is an alias to /src
import 'bulma/css/bulma.css'
import FrontView from '@/views/FrontView'

export default {
  name: 'App',
  components: {
    FrontView,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding-bottom: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.front-view-title {
  background-color: #2c3e50;
  color: aliceblue;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 0.5em;
}
</style>
