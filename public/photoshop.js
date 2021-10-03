var photoshop = VueColor.Photoshop
var material = VueColor.Material
var sketch = VueColor.Sketch
var slider = VueColor.Slider
var compact = VueColor.Compact
var swatches = VueColor.Swatches

var defaultProps = {
  hex: '#999999',
  a: 1,
}

new Vue({
  el: '#app',

  data() {
    return {
      width: 500,
      height: 400,
      colors: defaultProps,
      onChangeColorListener: null,
      showcolors: false,
      movetarget: null,
      activeItemIndex: null,
      items: [],
      tools: {
        squaresize: 8,
        min_height: 10,
      },
    }
  },

  components: {
    // 'color-picker': material,
    // 'color-picker': photoshop,
    'color-picker': sketch,
    // 'color-picker': slider,
    // 'color-picker': compact,
    // 'color-picker': swatches,
  },

  methods: {
    onChange(val) {
      if (this.onChangeColorListener) {
        this.colors = val
        this.onChangeColorListener()
      }
    },

    toggleColor() {
      this.showcolors = !this.showcolors
    },

    addTextField() {
      this.items.push(this.createTextField())
    },

    addRectangle() {
      this.items.push(this.createRectangle())
    },

    addEllipse() {
      this.items.push(this.createEllipse())
    },

    createTextField() {
      return {
        type: 'text',
        textAnchor: 'left',
        active: false,
        x: ((this.items.length + 2) % 20) * 20,
        y: ((this.items.length + 2) % 20) * 20,
        text: 'ENTER TEXT',
        width: 400,
        height: 40,
        font: 'Arial',
        color: this.colors.hex || '#366696',
      }
    },

    createRectangle() {
      return {
        type: 'rect',
        active: false,
        x: ((this.items.length + 2) % 20) * 20,
        y: ((this.items.length + 2) % 20) * 20,
        width: 400,
        height: 20,
        color: this.colors.hex || '#366696',
      }
    },

    createEllipse() {
      return {
        type: 'ellipse',
        active: false,
        x: ((this.items.length + 2) % 20) * 20,
        y: ((this.items.length + 2) % 20) * 20,
        width: 120,
        height: 120,
        color: this.colors.hex || '#366696',
      }
    },

    onClickItem(event, item) {
      event.stopPropagation() //prevent parent from firing
      if (item.active) {
        return
      }
      // select item if not selected
      this.deactivateItems()
      item.active = true
      this.onChangeColorListener = function () {
        item.color = this.colors.hex
      }
      this.colors = defaultProps
      this.colors.hex = item.color
      this.activeItemIndex = this.items.indexOf(item)
    },

    moveUp() {
      if (
        this.activeItemIndex >= 0 &&
        this.activeItemIndex < this.items.length
      ) {
        var i = this.items[this.activeItemIndex]
        swapArrayElements(
          this.items,
          this.activeItemIndex,
          this.activeItemIndex + 1
        )
        this.activeItemIndex += 1
        this.$forceUpdate()
      }
    },

    moveDown() {
      if (this.activeItemIndex >= 0 && this.activeItemIndex >= 0) {
        var i = this.items[this.activeItemIndex]
        swapArrayElements(
          this.items,
          this.activeItemIndex,
          this.activeItemIndex - 1
        )
        this.activeItemIndex -= 1
        this.$forceUpdate()
      }
    },

    deactivateItems() {
      this.items.map(function (i) {
        if (i) i.active = false
      })
    },

    removeActiveItem() {
      this.items = this.items.filter((i) => i.active === false)
    },

    onMouseDownRegion(event, item) {
      if (item.active) {
        item.drag = {
          type: 'MOVE',
          x: item.x,
          y: item.y,
          mx: event.x,
          my: event.y,
        }
      }
      this.movetarget = item
    },

    onMouseUp(event, element) {
      this.movetarget = null
    },

    onMouseMove(event) {
      if (this.movetarget == null) return
      var item = this.movetarget
      var t = this.tools

      if (item.active && item.drag != undefined) {
        if (item.drag.type == 'MOVE') {
          item.x = event.x - item.drag.mx + item.drag.x
          item.y = event.y - item.drag.my + item.drag.y
        }
        if (item.drag.type == 'SCALE') {
          if (item.drag.handleID == '1') {
            // TL resize handler
            item.x = Math.min(
              event.x - item.drag.mx + item.drag.x,
              item.drag.x + (item.drag.w - t.min_height)
            )
            item.y = Math.min(
              event.y - item.drag.my + item.drag.y,
              item.drag.y + (item.drag.h - t.min_height)
            ) // with y constraint
            item.width = Math.max(
              item.drag.w - event.x + item.drag.mx,
              t.min_height
            )
            item.height = Math.max(
              item.drag.h - event.y + item.drag.my,
              t.min_height
            )
          }
          if (item.drag.handleID == '3') {
            // TR resize handler
            item.y = Math.min(
              event.y - item.drag.my + item.drag.y,
              item.drag.y + (item.drag.h - t.min_height)
            ) // with y constraint
            item.width = Math.max(
              item.drag.w + event.x - item.drag.mx,
              t.min_height
            )
            item.height = Math.max(
              item.drag.h - event.y + item.drag.my,
              t.min_height
            )
          }
          if (item.drag.handleID == '7') {
            // BL
            item.x = Math.min(
              event.x - item.drag.mx + item.drag.x,
              item.drag.x + (item.drag.w - t.min_height)
            )
            item.width = Math.max(
              item.drag.w - event.x + item.drag.mx,
              t.min_height
            )
            item.height = Math.max(
              item.drag.h + event.y - item.drag.my,
              t.min_height
            )
          }
          if (item.drag.handleID == '9') {
            // BR
            item.width = Math.max(
              item.drag.w + event.x - item.drag.mx,
              t.min_height
            )
            item.height = Math.max(
              item.drag.h + event.y - item.drag.my,
              t.min_height
            )
          }
        }
      }
    },

    onKeyUp(event) {
      if (event.key === 'Delete') {
        this.removeActiveItem()
      }
      return event.preventDefault()
    },

    onMouseDownHandles(event, item) {
      var handleID = event.target.getAttribute('data-handleid')

      item.drag = {
        x: item.x,
        y: item.y,
        mx: event.x,
        my: event.y,
        w: item.width,
        h: item.height,
        type: 'SCALE',
        handleID: handleID,
      }

      this.movetarget = item
    },

    textAlign(val) {
      var i = this.items[this.activeItemIndex]
      if (i && i.type == 'text') {
        i.textAnchor = val

        this.$forceUpdate()
      }
    },

    getTextXPos(item) {
      if (item.textAnchor == 'middle') return item.width / 2
      if (item.textAnchor == 'end') return item.width
      return 0
    },
  },

  mounted() {
    window.addEventListener('keyup', this.onKeyUp)
  },
})
var swapArrayElements = function (arr, indexA, indexB) {
  var temp = arr[indexA]
  arr[indexA] = arr[indexB]
  arr[indexB] = temp
}
