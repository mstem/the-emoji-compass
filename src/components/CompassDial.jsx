import React, { useRef, useEffect, useCallback } from 'react'
import { useStore } from '../store'
import Emoji from './Emoji'
import compass from '../img/compass.svg'
import './CompassDial.css'

export default function CompassDial () {
  const symbols = useStore((s) => s.symbols)
  const needlePosition = useStore((s) => s.needlePosition)
  const ringEl = useRef(null)

  const repositionSymbols = useCallback(() => {
    if (!ringEl.current) return
    const circleSize = ringEl.current.getBoundingClientRect().width
    const items = ringEl.current.querySelectorAll('.compass-dial-emoji')
    const offset = (circleSize / 2) * 0.8125

    items.forEach(function (item, index, symbolList) {
      const count = symbolList.length
      const angle = 360 / count
      const rotation = index * angle
      item.style.transform =
        'rotate(' + rotation + 'deg) translate(' + offset + 'px) rotate(-' + rotation + 'deg)'
    })
  }, [])

  useEffect(() => {
    repositionSymbols()
    window.addEventListener('resize', repositionSymbols)
    return () => window.removeEventListener('resize', repositionSymbols)
  }, [repositionSymbols])

  // Reposition after needlePosition updates (highlighted class changes DOM)
  useEffect(() => {
    repositionSymbols()
  }, [needlePosition, repositionSymbols])

  return (
    <div className="compass-dial-container">
      <div id="ring" className="compass-dial" ref={ringEl}>
        <img src={compass} className="compass-dial-background" alt="The compass" />
        {symbols.map((symbol, i) => {
          const classNames = ['compass-dial-emoji']
          if (needlePosition === i) classNames.push('compass-dial-emoji-highlighted')
          return (
            <div className={classNames.join(' ')} key={symbol.emoji}>
              <Emoji symbol={symbol} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
