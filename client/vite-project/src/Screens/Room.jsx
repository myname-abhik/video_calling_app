import React,{useEffect,useCallback,useState} from 'react'
import {useSocket} from "../context/socketprovider"
import ReactPlayer from "react-player"
import peer from '../service/peer'
const  RoomPage = ()=>
    {
        const socket = useSocket();
        const [remoteSocketId, setRemoteSocketId] = useState(null)
        const [mystream,setmystream] = useState(null)
        const [remoteStream,setremoteStream]= useState(null)
        const handleUserJoin = useCallback(({email,id})=>{
          console.log(`email ${email} joined the room`)
          setRemoteSocketId(id)
        },)
    const handleCallAccept = useCallback(({from,ans})=>{
     peer.setLocalDescription(ans)
     console.log('Call accepted')
     for (const track of mystream.getTracks()){
        peer.peer.addTrack(track,mystream)
     }
    },[mystream]);

    const handleCallUser = useCallback(async()=>{
      const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
      const offer = await peer.getOffer()
      socket.emit("user:call",{to :remoteSocketId,offer});
      setmystream(stream)
    },[remoteSocketId,socket])
    const handleincommingCall = useCallback(async({from,offer})=>{
        setRemoteSocketId(from)
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
        setmystream(stream)
     console.log(`incommig call`,from,offer)
     const ans =  await peer.getAnswer(offer)
     socket.emit('call:accept',{to:from,ans})
    },[])
    const handleNegotiationNeeded = useCallback(async ()=>{
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed',{offer,to: remoteSocketId})
    },[])
    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded',handleNegotiationNeeded)
        return ()=>{
            peer.peer.removeEventListener('negotiationneeded',handleNegotiationNeeded)
        }
    },[handleNegotiationNeeded])
    useEffect(()=>{
     peer.peer.addEventListener('track',async ev =>{
        const remoteStream = ev.streams
        setremoteStream(remoteStream)
     })
    },[])
    const handleNegotiationNeededincomming = useCallback((from,offer)=>{
     const ans = peer.getAnswer(offer)
     stock.emit('peer:nego:done',{to:from,ans})
    },[])
        useEffect(()=>{
            
           socket.on('user:join',handleUserJoin)
           socket.on('incomming:call',handleincommingCall)
           socket.on('call:accept',handleCallAccept)
           socket.on('peer:nego:needed',handleNegotiationNeededincomming)
          
           return ()=>{
            socket.off('user:join',handleUserJoin)
            socket.off('incomming:call',handleincommingCall)
            socket.off('call:accept',handleCallAccept)
           }
        },[socket,handleUserJoin,handleincommingCall,handleCallAccept])
        return(
            <div>
                <h1>Room Page</h1>
                <h4>{remoteSocketId ? 'connected' : 'Not Connected'}</h4>
                {
                    remoteSocketId &&
                    <button onClick={handleCallUser}> CALL</button>
                }
                {
                    mystream &&
                    
                    <ReactPlayer 
                    playing 
                    muted
                    height="300px"
                    width="500px"
                    url={mystream}/>
                }
                {
                    remoteStream &&
                    <ReactPlayer 
                    playing 
                    muted
                    height="300px"
                    width="500px"
                    url={remoteStream}/>
                }
            </div>
        )
    }
    export default RoomPage