<template>
  <div class="color-palette">
    <ul class="color-pallete-list">
      <li
        :style="{ background: item.color }"
        v-for="item in colorParts"
        :key="item.id"
        @click="sendColor(item)"
      ></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colorParts: [
        {
          id: 1,
          color: 'cyan',
        },
        {
          id: 2,
          color: 'aquamarine',
        },
        {
          id: 3,
          color: 'hotpink',
        },
        {
          id: 4,
          color: 'violet',
        },
        {
          id: 5,
          color: 'gold',
        },
        {
          id: 6,
          color: 'lightgreen',
        },
        {
          id: 7,
          color: 'sienna',
        },
        {
          id: 8,
          color: 'slategray',
        },
      ],
    }
  },

  methods: {
    sendColor(item) {
      this.$emit('changeColor', item.color)
    },
  },
}
</script>

<style scoped>
.color-palette {
  position: relative;
}

.color-pallete-list li {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid #2c3e50;
  margin: 2px;
}
</style>
