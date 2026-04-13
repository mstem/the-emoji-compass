import React, { useState, useRef, useEffect } from 'react'
import { useStore } from './store'
import { ROUTES } from './constants'
import NavButtons from './components/NavButtons'
import MainScreen from './components/MainScreen'
import AnswerScreen from './components/AnswerScreen'
import InfoOverlay from './components/InfoOverlay'
import './App.css'

// If a viewer tabs away and returns after this long, skip to the answer screen.
const IMPATIENCE_TIME_LIMIT = 20000

export default function App () {
  const route = useStore((s) => s.route)
  const responseEmojis = useStore((s) => s.responseEmojis)
  const showAnswerScreen = useStore((s) => s.showAnswerScreen)

  const [infoVisible, setInfoVisible] = useState(false)
  const lastViewedTimestamp = useRef(Date.now())

  useEffect(() => {
    function handleVisibilityChange () {
      if (document.hidden) {
        lastViewedTimestamp.current = Date.now()
      } else if (
        Date.now() - lastViewedTimestamp.current > IMPATIENCE_TIME_LIMIT &&
        responseEmojis.length > 0
      ) {
        showAnswerScreen()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [responseEmojis, showAnswerScreen])

  let screen
  switch (route) {
    case ROUTES.ANSWER:
      screen = <AnswerScreen />
      break
    case ROUTES.MAIN:
    default:
      screen = <MainScreen />
      break
  }

  return (
    <main role="main" className={route === ROUTES.MAIN ? 'main-screen' : ''}>
      {screen}
      {infoVisible && <InfoOverlay handler={() => setInfoVisible(false)} />}
      <NavButtons route={route} showInfoOverlay={() => setInfoVisible(true)} />
    </main>
  )
}
