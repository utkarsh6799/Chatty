const socketio = require('socket.io')
const path = require('path')
const http = require('http')
const express = require('express')
const { generateMessage } = require('./utils/messages')


const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))




io.on('connection', (socket) => {
   console.log('New connection of web socket')

   socket.emit('message', generateMessage('Welcome!') )
   socket.broadcast.emit('message', generateMessage('A new User has joined!'))

   socket.on('sendMessage', (message, callback) => {

    io.emit('message', generateMessage(message))
    callback('delivered!')

    
   })

   socket.on('sendLocation', (coords, callback) => {
         io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
         callback()
   })

   socket.on('disconnect', () => {
       io.emit('message', generateMessage('A User has left!'))
   })

})



server.listen(port, () => {
    console.log('Server is up on the port ' + port)
})