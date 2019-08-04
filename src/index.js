const socketio = require('socket.io')
const path = require('path')
const http = require('http')
const express = require('express')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))




io.on('connection', (socket) => {
   console.log('New connection of web socket')

   socket.on('join', ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room })
      
      if(error){
        return callback(error)
      }


      socket.join(room)

      socket.emit('message', generateMessage('Welcome!') )
      socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))

      callback()
    

    })

   socket.on('sendMessage', (message, callback) => {

    io.to('center').emit('message', generateMessage(message))
    callback()

    
   })

   socket.on('sendLocation', (coords, callback) => {
         io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
         callback()
   })

   socket.on('disconnect', () => {
       io.emit('message', generateMessage('A User has left!'))
   })

})



server.listen(port, () => {
    console.log('Server is up on the port ' + port)
})