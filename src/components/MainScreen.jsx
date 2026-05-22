import React, { useEffect } from 'react'
import { useStore } from '../store'
import Compass from './Compass'
import MainTextDisplay from './MainTextDisplay'
import Emoji from './Emoji'
import { init } from '../scripts'
import './MainScreen.css'

export default function MainScreen () {
  const requestEmojis = useStore((s) => s.requestEmojis)
  const activeNeedle = useStore((s) => s.activeNeedle)

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="container container-main-screen">
      <Compass />
      {activeNeedle < 4 && (
        <div className="emoji-requested">
          {requestEmojis.map((symbol, i) => (
            <Emoji symbol={symbol} key={i} />
          ))}
        </div>
      )}
      <MainTextDisplay />
    </div>
  )
}
