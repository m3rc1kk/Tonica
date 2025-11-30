import './styles/styles.css'
import AppRouter from "./routes/AppRouter.jsx";
import Player from "./components/Player/Player.jsx";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function App() {
  const location = useLocation();
  const isBigPlayerOpen = location.pathname.startsWith('/big-player/');
  const [shouldRenderPlayer, setShouldRenderPlayer] = useState(!isBigPlayerOpen);
  const [isPlayerExiting, setIsPlayerExiting] = useState(false);

  useEffect(() => {
    if (isBigPlayerOpen) {
      setIsPlayerExiting(true);
      const timer = setTimeout(() => {
        setShouldRenderPlayer(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShouldRenderPlayer(true);
      setIsPlayerExiting(false);
    }
  }, [isBigPlayerOpen]);

  return (
    <>
        <AppRouter/>
        {shouldRenderPlayer && (
          <div 
            className={isPlayerExiting ? 'player-wrapper player-wrapper--exiting' : 'player-wrapper'}
          >
            <Player />
          </div>
        )}
    </>
  )
}


