<template>
  <div class="profile">
    <input
      class="input"
      type="text"
      id="nameform"
      placeholder="Set name:"
      v-model="username"
    /><button class="button is-primary" @click="setName">Set name</button>
    <div></div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  data() {
    return {
      username: '',
    }
  },
  methods: {
    setName() {
      if (!this.username) {
        console.log('nezadal si meno ')
        return
      }
      this.$emit('changeName', this.username)
      console.log('your new name is: ' + this.username)
    },
  },
}
</script>

<style scoped>
.profile {
  width: 50%;
  margin: 1em auto;
}
.button {
  margin: 0.5em;
}
</style>
