import React, { useRef, useEffect } from 'react'
import Button from './Button'
import MINI_COMPASS_IMAGE from '../img/mini_compass.svg'
import './InfoOverlay.css'

export default function InfoOverlay ({ handler }) {
  const contentEl = useRef(null)
  const scrollerEl = useRef(null)

  function checkScrollPosition (el) {
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight
    const boundingHeight = el.getBoundingClientRect().height
    const scrollEl = scrollerEl.current

    if (scrollTop === 0) {
      scrollEl.classList.remove('info-overlay-scroller-top')
    } else {
      scrollEl.classList.add('info-overlay-scroller-top')
    }

    if (scrollTop + boundingHeight < scrollHeight) {
      scrollerEl.current.classList.add('info-overlay-scroller-bottom')
    } else {
      scrollerEl.current.classList.remove('info-overlay-scroller-bottom')
    }
  }

  useEffect(() => {
    checkScrollPosition(contentEl.current)
  }, [])

  return (
    <div className="info-overlay-container">
      <div className="info-overlay-background" onClick={handler} />
      <div className="info-overlay">
        <div className="info-overlay-scroller info-overlay-scroller-bottom" ref={scrollerEl}>
          <div
            className="info-overlay-content"
            ref={contentEl}
            onScroll={(e) => checkScrollPosition(e.target)}
          >
            <img src={MINI_COMPASS_IMAGE} alt="The Emoji Compass" className="mini-compass" />

            <h2>How to use</h2>

            <p>
              The Emoji Compass will tell you the answer to any question you hold in your heart.
              You can ask it an unlimited number of questions by combining the three emoji symbols
              that best represent your query. After you choose, the fourth needle will spin and
              hover on three more symbols, each imbued with many layers of meaning. Only by
              skillfully divining these meanings within will you navigate to the answer you seek.
            </p>

            <h2>About the project</h2>

            <p>
              You can read the full ridiculous backstory of this project on{' '}
              <a href="https://www.mattstempeck.com/portfolio/emoji-compass/" target="_blank" rel="noopener noreferrer">
                Matt's website
              </a>.
            </p>

            <p>
              The Emoji Compass is a production of{' '}
              <a href="https://biffud.com" target="_blank" rel="noopener noreferrer">Bad Idea Factory</a>
              , a creative collective that builds technology to make people 🤔. The app is inspired
              by, but has no official endorsement or connection to, His Dark Materials, the series
              by Sir Philip Pullman. You can and should{' '}
              <a href="https://www.indiebound.org/book/9780440238133" target="_blank" rel="noopener noreferrer">
                purchase his works
              </a>.
            </p>

            <p>
              Uncompensated laborers on this project include Matt Stempeck, Lou Huang, Margo
              Dunlap, Dan Schultz, and their accomplice Chris Peterson.
            </p>

            <h2>Colophon</h2>

            <p>
              You'll find the code that powers The Emoji Compass on{' '}
              <a href="https://github.com/mstem/the-emoji-compass" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>.
            </p>

            <p>
              The Emoji Compass was built with several open source technologies that were
              generously made available by their creators, including:
            </p>

            <ul>
              <li>
                <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a>
              </li>
              <li>
                <a href="https://zustand.docs.pmnd.rs/" target="_blank" rel="noopener noreferrer">Zustand</a>
              </li>
              <li>
                <a href="https://reactcommunity.org/react-transition-group/" target="_blank" rel="noopener noreferrer">
                  React Transition Group
                </a>
              </li>
              <li>
                <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">Vite</a>
              </li>
              <li>
                The{' '}
                <a href="https://fonts.google.com/specimen/Gentium+Book+Basic" target="_blank" rel="noopener noreferrer">
                  Gentium Book Basic
                </a>{' '}
                font, licensed under the{' '}
                <a href="http://scripts.sil.org/OFL" target="_blank" rel="noopener noreferrer">
                  SIL Open Font License
                </a>
              </li>
            </ul>

            <h2>Privacy policy</h2>

            <p>
              By using the app you agree to the{' '}
              <a href="https://github.com/mstem/the-emoji-compass/blob/main/PRIVACY.md" target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>.
            </p>
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
        <footer>
          <Button type="close-light" title="Close" onClick={handler} />
        </footer>
      </div>
    </div>
  )
}
