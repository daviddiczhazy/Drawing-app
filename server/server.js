const WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ port: 8060 })
const clients = []
var clientId = 0

wss.on('connection', function connection(ws) {
  ws.id = ++clientId
  clients.push(ws)
  ws.on('message', function incoming(message) {
    console.log(message)
    clients.forEach((client) => {
      //if (client.id !== ws.id)
      client.send(message)
    })
  })
})
