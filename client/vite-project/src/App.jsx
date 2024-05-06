import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import  {Routes,Route} from 'react-router-dom'
import LobbyScreen from './Screens/lobby'
import RoomPage from './Screens/Room'

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<LobbyScreen/>}/>
      <Route path='/room/:roomid' element={<RoomPage/>}/>
     </Routes>
    </>
  )
}

export default App
