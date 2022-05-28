import { Server } from 'socket.io'

export default async function socketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket server is already running')
  } else {
    console.log('Socket server is initializing')
    const io = new Server(res.socket.server)

    io.use(async (socket, next) => {
      socket.userId = socket.handshake.auth.userId
      next()
    })

    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('socket client connected')
      socket.join(socket.userId)

      socket.on('messageAdded', (msg) => {
        io.to(msg.createMessage.senderId)
          .to(msg.createMessage.receiverId)
          .emit('newMessage', msg)
      })

      socket.on('userIsTyping', ({ receiverId }) => {
        socket.to(receiverId).emit('typing')
      })

      socket.on('disconnect', () => {
        console.log(`client socket disconnected`)
      })
    })
  }

  res.end()
}
