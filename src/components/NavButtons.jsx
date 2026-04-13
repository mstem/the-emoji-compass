import React from 'react'
import { useStore } from '../store'
import { ROUTES } from '../constants'
import Button from './Button'
import InfoButton from './InfoButton'
import './NavButtons.css'

export default function NavButtons ({ route, showInfoOverlay }) {
  const resetAppState = useStore((s) => s.resetAppState)

  return (
    <div className="nav-buttons">
      <InfoButton handler={showInfoOverlay} />
      {route === ROUTES.ANSWER && (
        <Button type="close" title="Ask again" onClick={resetAppState} />
      )}
    </div>
  )
}
