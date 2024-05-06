const {Server} = require('socket.io');

const io  = new Server(8000,{cors:true});
const emailToSocketIdMap = new Map();
const socketidtoEmailMap = new Map();
io.on('connection',  (socket)=>{
    console.log('Socket connection is established',socket.id)
    socket.on('room:join',(data)=>{
        const {email,room} = data;
        emailToSocketIdMap.set(email,socket.id);
        socketidtoEmailMap.set(socket.id,email);
        io.to(room).emit('user:join',{email,id:socket.id});
        socket.join(room);
        io.to(socket.id).emit('room:join',data);
        
    })
socket.on('user:call',({to,offer})=>{
    io.to(to).emit('incomming:call',{from:socket.id,offer})
})
socket.on('call:accept',({to,ans})=>{
    io.to(to).emit('call:accept',{from:socket.id,ans})
})
socket.on('peer:nego:needed',({to,offer})=>{
    io.to(to).emit('peer:nego:needed',{from:socket.id,offer})
})

})