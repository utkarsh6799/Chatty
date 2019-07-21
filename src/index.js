const socketio = require('socket.io')
const path = require('path')
const http = require('http')
const express = require('express')


const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))




io.on('connection', (socket) => {
   console.log('New connection of web socket')

   socket.emit('message', 'Welcome!')
   socket.broadcast.emit('message', 'A new User has joined!')

   socket.on('sendMessage', (message) => {

    io.emit('message', message)

    
   })

   socket.on('sendLocation', (coords) => {
         io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
   })

   socket.on('disconnect', () => {
       io.emit('message', 'A User has left!')
   })

})



server.listen(port, () => {
    console.log('Server is up on the port ' + port)
})