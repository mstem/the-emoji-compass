import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { useStore } from '../store'
import { random, getEmojiPosition } from '../utils'
import { autoRotateNeedle } from '../scripts'
import './CompassNeedle.css'

gsap.registerPlugin(Draggable)

export default function CompassNeedle ({ id, type }) {
  const symbols = useStore((s) => s.symbols)
  const activeNeedle = useStore((s) => s.activeNeedle)
  const requestEmojis = useStore((s) => s.requestEmojis)
  const addRequestEmoji = useStore((s) => s.addRequestEmoji)
  const updateNeedlePosition = useStore((s) => s.updateNeedlePosition)
  const setActiveNeedle = useStore((s) => s.setActiveNeedle)

  const el = useRef(null)
  const draggableRef = useRef(null)

  // Keep latest store actions in refs so the Draggable closure always has current values
  const symbolsRef = useRef(symbols)
  const requestEmojisRef = useRef(requestEmojis)
  const addRequestEmojiRef = useRef(addRequestEmoji)
  const updateNeedlePositionRef = useRef(updateNeedlePosition)
  const setActiveNeedleRef = useRef(setActiveNeedle)
  useEffect(() => { symbolsRef.current = symbols }, [symbols])
  useEffect(() => { requestEmojisRef.current = requestEmojis }, [requestEmojis])
  useEffect(() => { addRequestEmojiRef.current = addRequestEmoji }, [addRequestEmoji])
  useEffect(() => { updateNeedlePositionRef.current = updateNeedlePosition }, [updateNeedlePosition])
  useEffect(() => { setActiveNeedleRef.current = setActiveNeedle }, [setActiveNeedle])

  const setElementSize = () => {
    const ring = document.getElementById('ring')
    if (!ring || !el.current) return
    const circleSize = ring.getBoundingClientRect().width
    const ratio = type === 'response' ? 0.425 : 0.355
    el.current.style.width = ratio * circleSize + 'px'
  }

  const enable = () => {
    if (!el.current || !draggableRef.current) return
    el.current.classList.add('needle-active')
    gsap.set(el.current, { zIndex: 1 })
    draggableRef.current.enable()
  }

  const disable = () => {
    if (!el.current || !draggableRef.current) return
    el.current.classList.remove('needle-active')
    el.current.style.animation = ''
    gsap.set(el.current, { zIndex: 0 })
    draggableRef.current.disable()
    el.current.style.userSelect = 'none'
    el.current.style.touchAction = 'none'
  }

  // Mount: set up GSAP Draggable
  useEffect(() => {
    setElementSize()
    window.addEventListener('resize', setElementSize)

    gsap.set(el.current, {
      transformOrigin: '2.0vmin',
      rotation: random() * 360,
    })

    const [d] = Draggable.create(el.current, {
      type: 'rotation',
      sticky: true,
      throwProps: true,
      liveSnap: {
        rotation: (value) => {
          const syms = symbolsRef.current
          const increment = 360 / syms.length
          const snappedStep = Math.round(value / increment)
          const snappedIndex = ((snappedStep % syms.length) + syms.length) % syms.length
          const selected = requestEmojisRef.current.map((s) => s.emoji)
          if (selected.includes(syms[snappedIndex].emoji)) {
            for (let offset = 1; offset < syms.length; offset++) {
              const plusStep = snappedStep + offset
              const plusIndex = ((plusStep % syms.length) + syms.length) % syms.length
              if (!selected.includes(syms[plusIndex].emoji)) return plusStep * increment
              const minusStep = snappedStep - offset
              const minusIndex = ((minusStep % syms.length) + syms.length) % syms.length
              if (!selected.includes(syms[minusIndex].emoji)) return minusStep * increment
            }
          }
          return snappedStep * increment
        },
      },
      onDragStart: () => {
        el.current.style.animation = 'none'
        window.dispatchEvent(new CustomEvent('compass:needle_drag_start'))
      },
      onDrag: function () {
        updateNeedlePositionRef.current(this.rotation)
      },
      onDragEnd: function () {
        updateNeedlePositionRef.current(this.rotation)
        const position = getEmojiPosition(this.rotation, symbolsRef.current)
        addRequestEmojiRef.current(symbolsRef.current[position])
        this.disable()
        el.current.classList.remove('needle-active')
        gsap.set(el.current, { zIndex: 0 })
        el.current.style.userSelect = 'none'
        el.current.style.touchAction = 'none'
        setActiveNeedleRef.current(id + 1)
      },
      onThrowUpdate: function () {
        updateNeedlePositionRef.current(this.rotation)
      },
    })

    draggableRef.current = d

    return () => {
      window.removeEventListener('resize', setElementSize)
      d.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Enable or disable based on which needle is active
  useEffect(() => {
    if (!draggableRef.current) return
    if (activeNeedle === id) {
      if (type === 'response') {
        autoRotateNeedle({ el, draggable: [draggableRef.current] })
      } else {
        enable()
      }
    } else {
      disable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNeedle])

  return <div className={`needle needle-${type}`} ref={el} />
}
