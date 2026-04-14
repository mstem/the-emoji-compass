import React, { Fragment, useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useStore } from '../store'
import Emoji from './Emoji'
import FlavorText from './FlavorText'
import './MainTextDisplay.css'

const TEXT_DISPLAY = {
  INSTRUCTION1: 'INSTRUCTION1',
  INSTRUCTION2: 'INSTRUCTION2',
  EMOJI_DESCRIPTION: 'EMOJI_DESCRIPTION',
  RESPONSE_EMOJIS: 'RESPONSE_EMOJIS',
}

export default function MainTextDisplay () {
  const symbols = useStore((s) => s.symbols)
  const needlePosition = useStore((s) => s.needlePosition)
  const activeNeedle = useStore((s) => s.activeNeedle)
  const responseEmojis = useStore((s) => s.responseEmojis)

  const [isFirstVisit] = useState(() => {
    if (!localStorage.getItem('emoji-compass-visited')) {
      localStorage.setItem('emoji-compass-visited', '1')
      return true
    }
    return false
  })

  const [textDisplay, setTextDisplay] = useState(TEXT_DISPLAY.INSTRUCTION1)

  // Mirror getDerivedStateFromProps logic: update textDisplay based on store state
  useEffect(() => {
    if (activeNeedle === 4) {
      setTextDisplay(TEXT_DISPLAY.RESPONSE_EMOJIS)
    } else if (Number.isInteger(needlePosition)) {
      setTextDisplay(TEXT_DISPLAY.EMOJI_DESCRIPTION)
    } else if (activeNeedle && activeNeedle > 1 && needlePosition === null) {
      setTextDisplay(TEXT_DISPLAY.INSTRUCTION2)
    }
  }, [activeNeedle, needlePosition])

  useEffect(() => {
    function handleDragStart () {
      setTextDisplay(TEXT_DISPLAY.EMOJI_DESCRIPTION)
    }
    window.addEventListener('compass:needle_drag_start', handleDragStart)
    return () => window.removeEventListener('compass:needle_drag_start', handleDragStart)
  }, [])

  function renderTextContents () {
    switch (textDisplay) {
      case TEXT_DISPLAY.EMOJI_DESCRIPTION: {
        const symbol = symbols[needlePosition]
        if (!symbol) return null
        return (
          <div className="text-box emoji-description">
            <FlavorText text={symbol.text} />
          </div>
        )
      }
      case TEXT_DISPLAY.RESPONSE_EMOJIS:
        return (
          <div className="text-box emoji-picking">
            {responseEmojis.map((emoji, i) => (
              <Fragment key={i}>
                <CSSTransition in={true} classNames="show" timeout={150} appear={true}>
                  <Emoji symbol={emoji} />
                </CSSTransition>
              </Fragment>
            ))}
          </div>
        )
      case TEXT_DISPLAY.INSTRUCTION2:
        return (
          <div className="text-box instruction-text">
            <p>Drag the next needle to select the next emoji.</p>
          </div>
        )
      case TEXT_DISPLAY.INSTRUCTION1:
      default:
        if (isFirstVisit) {
          return (
            <div className="text-box instruction-text instruction-text-howto">
              <p>
                The Emoji Compass will tell you the answer to any question you hold in your heart.
                Rotate the three hands to pick the symbols that best represent your query.
                The fourth needle will then spin and reveal your answer.
              </p>
            </div>
          )
        }
        return (
          <div className="text-box instruction-text">
            <p>Ask a question by choosing three symbols.</p>
            <p>Rotate the hands of the compass to select the first.</p>
          </div>
        )
    }
  }

  return (
    <div className="text-container">
      {renderTextContents()}
    </div>
  )
}
