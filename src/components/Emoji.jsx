import React from 'react'
import alphaomega from '../img/alphaomega.svg'
import './Emoji.css'

export default function Emoji ({ symbol }) {
  if (symbol.emoji === 'αΩ') {
    return (
      <span>
        <img className="emoji" src={alphaomega} alt={symbol.emoji} />
      </span>
    )
  }

  return (
    <span className="emoji" role="img" aria-label={symbol.title}>
      {symbol.emoji}
    </span>
  )
}
