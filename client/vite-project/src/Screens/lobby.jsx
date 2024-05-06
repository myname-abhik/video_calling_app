import react, { useState,useCallback ,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { useSocket } from '../context/socketprovider'
const LobbyScreen = ()=>{
    const [email,setEmail] = useState('')
    const [room,setRoom] = useState('')
    const socket = useSocket()
    const navigate = useNavigate();
    // console.log(socket);
const handlesubmitform = useCallback((e)=>{
e.preventDefault();
socket.emit('room:join',{email,room});

},[email,room,socket]
);
const handleJoinRoom = useCallback((data) => {
    const {email,room} = data;
    navigate(`/room/${room}`)
},[navigate])
useEffect(()=>{
    socket.on('room:join',handleJoinRoom);
    return ()=>{
        socket.off('room:join',handleJoinRoom);
    }
},[socket]);
    return (
       <>
        <h1>Lobby Screen</h1>
    <form onSubmit={handlesubmitform}>
    <label htmlFor='email'>Email ID</label>
    <input type="email" id='email'
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    ></input>
    <br/>
    <label htmlFor='room'
    >Room No</label>
    
    <input type="text" id='room'
    value={room}
    onChange={(e)=>setRoom(e.target.value)}></input>
    <br/>
    <button>Join</button>
    
    </form>
       </> 
    )
}
export default LobbyScreen;