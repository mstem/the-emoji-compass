import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'
import Emoji from './Emoji'
import FlavorText from './FlavorText'
import Arc from './Arc'
import ARC_LABEL_REQUEST from '../img/arc_label_request.svg'
import ARC_LABEL_RESPONSE from '../img/arc_label_response.svg'
import './AnswerScreen.css'

export default function AnswerScreen () {
  const requestEmojis = useStore((s) => s.requestEmojis)
  const responseEmojis = useStore((s) => s.responseEmojis)

  const randomSelectedEmoji = useRef(Math.floor(Math.random() * 3))

  const [userHasInteracted, setUserHasInteracted] = useState(false)
  const [activeArc, setActiveArc] = useState(2)
  const [activeEmoji, setActiveEmoji] = useState(randomSelectedEmoji.current)
  const [text, setText] = useState(
    responseEmojis[randomSelectedEmoji.current]?.text ?? ''
  )

  // Keep latest state in refs for use inside the setInterval closure
  const stateRef = useRef({ userHasInteracted, activeArc, activeEmoji })
  useEffect(() => {
    stateRef.current = { userHasInteracted, activeArc, activeEmoji }
  })

  function selectRequestEmoji (index) {
    setActiveArc(1)
    setActiveEmoji(index)
    setText(requestEmojis[index].text)
  }

  function selectResponseEmoji (index) {
    setActiveArc(2)
    setActiveEmoji(index)
    setText(responseEmojis[index].text)
  }

  function rotateSelection () {
    const { userHasInteracted: interacted, activeArc: arc, activeEmoji: emoji } = stateRef.current
    if (interacted) return
    if (arc === 1) {
      emoji === 2 ? selectResponseEmoji(0) : selectRequestEmoji(emoji + 1)
    }
    if (arc === 2) {
      emoji === 2 ? selectRequestEmoji(0) : selectResponseEmoji(emoji + 1)
    }
  }

  useEffect(() => {
    const timer = window.setInterval(rotateSelection, 3000)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (requestEmojis.length === 0 || responseEmojis.length === 0) return null

  return (
    <div className="container container-answer-screen">
      <div className="answer-arc-container">
        <Arc
          active={activeArc === 1 ? activeEmoji : null}
          handleSelect={(event, index) => {
            setUserHasInteracted(true)
            selectRequestEmoji(index)
          }}
        />
        <img src={ARC_LABEL_REQUEST} className="arc-label" alt="I asked:" />
        <div className="answer-emojis">
          {requestEmojis.map((emoji, i) => (
            <Emoji symbol={emoji} key={i} />
          ))}
        </div>
      </div>

      <div className="answer-arc-container">
        <Arc
          active={activeArc === 2 ? activeEmoji : null}
          handleSelect={(event, index) => {
            setUserHasInteracted(true)
            selectResponseEmoji(index)
          }}
        />
        <img src={ARC_LABEL_RESPONSE} className="arc-label" alt="The compass returned:" />
        <div className="answer-emojis">
          {responseEmojis.map((emoji, i) => (
            <Emoji symbol={emoji} key={i} />
          ))}
        </div>
      </div>

      <div className="answer-text">
        {text && <FlavorText text={text} />}
      </div>
    </div>
  )
}
