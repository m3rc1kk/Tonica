import './styles/styles.css'
import AppRouter from "./routes/AppRouter.jsx";
import {PlayerProvider} from "./context/PlayerContext.jsx";
import Player from "./components/Player/Player.jsx";

export default function App() {
  return (
    <>
        <AppRouter/>
        <Player />
    </>
  )
}


