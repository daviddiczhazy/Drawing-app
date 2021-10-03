<template>
  <div>
    <!-- Draver app -->
    <div id="drawerjs" class="window-drawerjs">
      <div class="demo-container">
        <div>
          <button class="button is-link is-light" @click="toggleColor">
            Color Picker
          </button>
          <button class="button is-primary is-light" @click="addRectangle">
            Add Rectangle
          </button>
          <button class="button is-primary is-light" @click="addEllipse">
            Add Ellipse
          </button>
          <button class="button is-danger is-light" @click="removeActiveItem">
            Remove
          </button>
        </div>

        <div class="canvas">
          <ColorPalette
            v-show="showcolors"
            v-on:change-color="chooseColor($event)"
          >
          </ColorPalette>
          <svg
            id="drawingsvg1"
            :width="width"
            :height="height"
            @mousemove="onMouseMove($event)"
            @mouseup="onMouseUp($event)"
            @click="onClickItem($event, {})"
          >
            // eslint-disable-next-line vue/require-v-for-key
            <g
              v-for="item in items"
              :key="item.id"
              :transform="'translate(' + item.x + ', ' + item.y + ')'"
            >
              <!-- item -->

              <rect
                v-if="item.type == 'rect'"
                :x="0"
                :y="0"
                :width="item.width"
                :height="item.height"
                :fill="item.color"
                @click="onClickItem($event, item)"
              ></rect>

              <ellipse
                v-if="item.type == 'ellipse'"
                :cx="item.width / 2"
                :cy="item.height / 2"
                :rx="item.width / 2"
                :ry="item.height / 2"
                :fill="item.color"
                @click="onClickItem($event, item)"
              ></ellipse>

              <!-- controls 
        <g v-for="item in items"
          :transform="'translate('+item.x+', '+item.y+')'"
          v-if="item.active"
        >-->
              <g v-if="item.active">
                <rect
                  :x="0"
                  :y="0"
                  :width="item.width"
                  :height="item.height"
                  class="ctrl-bounds"
                  @click="onClickItem($event, item)"
                  @_mouseout="onMouseUpRegion($event, item)"
                  @mousedown="onMouseDownRegion($event, item)"
                />
                <g @mousedown="onMouseDownHandles($event, item)">
                  <rect
                    class="ctrl-rect"
                    :width="tools.squaresize"
                    :height="tools.squaresize"
                    data-handleid="1"
                    :x="0 - tools.squaresize / 2"
                    :y="0 - tools.squaresize / 2"
                  />
                  <rect
                    class="ctrl-rect"
                    :width="tools.squaresize"
                    :height="tools.squaresize"
                    data-handleid="3"
                    :x="item.width - tools.squaresize / 2"
                    :y="0 - tools.squaresize / 2"
                  />
                  <rect
                    class="ctrl-rect"
                    :width="tools.squaresize"
                    :height="tools.squaresize"
                    data-handleid="7"
                    :x="0 - tools.squaresize / 2"
                    :y="item.height - tools.squaresize / 2"
                  />
                  <rect
                    class="ctrl-rect"
                    :width="tools.squaresize"
                    :height="tools.squaresize"
                    data-handleid="9"
                    :x="item.width - tools.squaresize / 2"
                    :y="item.height - tools.squaresize / 2"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div>
      <button class="button is-primary" @click="sendObject">Send</button>
      <button class="button is-secondary" @click="toggleName">Set name</button>
    </div>

    <div v-show="showInput" class="profile">
      <input
        class="input"
        type="text"
        id="nameform"
        placeholder="Set name:"
        v-model="changeName"
      /><button class="button is-primary" @click="setName">Set name</button>
      <div></div>
    </div>

    <h3 class="preview">
      Hello <strong>{{ profilename }}</strong> Received images are:
    </h3>
    <div class="preview-grid">
      <div class="preview-box" v-for="item in messages" :key="item.date">
        <p class="preview-text">
          @<em>{{ item.date }}</em> by <strong>{{ item.username }}</strong>
        </p>
        <div
          :style="{ width: width }"
          class="preview-svg"
          v-html="item.svg"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorPalette from '@/components/ColorPalette.vue'
import moment from 'moment'
export default {
  components: {
    ColorPalette,
  },
  data() {
    return {
      showInput: false,
      messages: [],
      connection: null,
      changeName: '',
      profilename: 'David',
      width: 380,
      height: 320,
      colors: '#999999',
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
  // Open connection to websocket right after the component is created
  created: function () {
    console.log('Starting connection to WebSocket Server')
    this.connection = new WebSocket('ws://localhost:8060')
    this.connection.onmessage = (event) => {
      console.log('this.messagess ', this.messages)
      this.messages.push(JSON.parse(event.data))
      console.log('incomming message ', event)
    }

    this.connection.onopen = function (event) {
      console.log(event)
      console.log('Successfully connected to the echo websocket server...')
    }
  },
  methods: {
    toggleColor() {
      this.showcolors = !this.showcolors
    },
    addRectangle() {
      this.items.push(this.createRectangle())
    },

    addEllipse() {
      this.items.push(this.createEllipse())
    },

    toggleName() {
      this.showInput = !this.showInput
      if (this.showInput) {
        this.changeName = ''
      }
    },

    setName() {
      this.profilename = this.changeName

      this.toggleName()
    },

    // Function to create Rectangle object which will be inserted into SVG
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

    // Function to create Elipse object which will be inserted into SVG
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
      this.activeItemIndex = this.items.indexOf(item)
    },

    // Function for un-select the active items
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

    onMouseUp() {
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

    chooseColor(color) {
      this.items.forEach((element) => {
        if (element.active === true) {
          element.color = color
        }
      })
    },

    // Function for interacting with Websocket. It will send JSON with current name, actual date andt time and drawed svg object
    sendObject() {
      this.deactivateItems()
      const svgImage = document.getElementById('drawingsvg1').outerHTML
      const message = {
        date: moment().calendar(),
        username: this.profilename,
        svg: svgImage,
      }
      this.connection.send(JSON.stringify(message))
    },
  },
}
</script>

<style scoped>
.window-drawerjs {
  margin: 0 auto;

  margin-bottom: 1em;
}

.canvas svg {
  border: 1px solid #2c3e50;
  background: #fff;
}

.button {
  margin: 0.25em;
}

svg text {
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

svg text::selection {
  background: none;
}

svg .ctrl-rect {
  fill: #ffffff;
  stroke: #222222;
  stroke-width: 1;
}

svg .ctrl-bounds {
  fill-opacity: 0;
  stroke: #222222;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-dasharray: 2, 4;
}

.color-picker-rect {
  display: inline-block;
  position: relative;
  width: 16px;
  height: 16px;
  border: 1px solid #2c3e50;
  border-radius: 2px;
  margin-right: 2px;
}
.preview {
  display: inline-block;
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-size: 24px;
  border-bottom: 1px solid #2c3e50;
}

.preview-grid {
  width: 80%;
  margin: 0 auto;
}

.preview-box {
  margin: 0.5em;
  display: inline-block;
}

.preview-svg {
  border: 2px solid #2c3e50;
}

.preview-text {
  background-color: #eee;
  display: inline-block;
  padding: 0 1em;
}

.profile {
  width: 400px;
  margin: 0.5em auto;
}
.button {
  margin: 0.5em;
}
</style>
