import { gsap } from 'gsap'

import symbols from './symbols.json'
import { random, getUniqueRandomIntegers, getRotation } from './utils'
import { useStore } from './store'

// adjustable values
const DELAY_BETWEEN_PICKS = 10
const DELAY_AFTER_ALL_PICKS = 1150
const DIAL_ROTATION_SPEED = 2.5

let dialAnimation

export function init () {
  window.addEventListener('compass:legacy:cancel_dial_animation', function (e) {
    window.cancelAnimationFrame(dialAnimation)
  })
}

function onDialPositionUpdate (rotation) {
  useStore.getState().updateNeedlePosition(rotation)
}

function rotateDialStep (el, draggable, frame, totalFrames, rotateTo, overshoot, rotateDirection, easing, resolve) {
  let rotated = false
  let rotateToOvershoot = rotateTo + overshoot * rotateDirection
  let progress = frame / totalFrames

  if ((rotateDirection === 1 && draggable.rotation <= rotateToOvershoot)
   || (rotateDirection === -1 && draggable.rotation >= rotateToOvershoot)) {
    gsap.set(el, { rotation: draggable.rotation + DIAL_ROTATION_SPEED * easing(progress) * rotateDirection })
    rotated = true
  }

  if (rotated) {
    draggable.update()
    onDialPositionUpdate(draggable.rotation)

    dialAnimation = window.requestAnimationFrame(function (timestamp) {
      rotateDialStep(el, draggable, frame + 1, totalFrames, rotateTo, overshoot, rotateDirection, easing, resolve)
    })
  } else if (overshoot !== 0) {
    dialAnimation = window.requestAnimationFrame(function (timestamp) {
      rotateDialStep(el, draggable, 0, 10, rotateTo, Math.trunc(overshoot / 2), rotateDirection * -1, (t) => t * t, resolve)
    })
  } else {
    onDialPositionUpdate(draggable.rotation)
    resolve()
  }
}

function rotatePromise (el, draggable, rotateTo) {
  const rotateDirection = Math.round(random()) ? 1 : -1
  const rotateQuantity = Math.ceil(random()) // a number between 1 and 2 inclusive
  const overshoot = 5 + Math.ceil(random() * 5) // Number of degrees to overshoot

  let circs = Math.floor(draggable.rotation / 360) + rotateQuantity * rotateDirection
  const rotateToActual = circs * 360 + rotateTo
  const rotateToOvershoot = rotateToActual + overshoot * rotateDirection
  const duration = Math.abs(draggable.rotation - rotateToOvershoot) / 200 * 60

  return new Promise(function (resolve) {
    let easing = (t) => (t < rotateToActual / rotateToOvershoot) ? (16 * t * t * t * t * t) : (1 + 16 * (--t) * t * t * t * t)
    dialAnimation = window.requestAnimationFrame(function (timestamp) {
      rotateDialStep(el, draggable, 0, duration, rotateToActual, overshoot, rotateDirection, easing, resolve)
    })
  })
}

function wait (delay) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, delay)
  })
}

// Have a 4th dial automatically and randomly select 3 more emojis
export function autoRotateNeedle (dial) {
  const el = dial.el.current
  const draggable = dial.draggable[0]

  el.classList.add('needle-active')
  draggable.update()

  const numberOfSymbols = symbols.length
  const randomNumbers = getUniqueRandomIntegers(numberOfSymbols, 3)
  const responseEmojis = randomNumbers.map((num) => symbols[num])

  const rotateTo = getRotation(randomNumbers[0], numberOfSymbols)
  const { addResponseEmoji, showAnswerScreen } = useStore.getState()

  rotatePromise(el, draggable, rotateTo)
    .then(function () {
      addResponseEmoji(responseEmojis[0])
      return wait(DELAY_BETWEEN_PICKS)
    })
    .then(function () {
      const rotateTo = getRotation(randomNumbers[1], numberOfSymbols)
      return rotatePromise(el, draggable, rotateTo)
    })
    .then(function () {
      addResponseEmoji(responseEmojis[1])
      return wait(DELAY_BETWEEN_PICKS)
    })
    .then(function () {
      const rotateTo = getRotation(randomNumbers[2], numberOfSymbols)
      return rotatePromise(el, draggable, rotateTo)
    })
    .then(function () {
      addResponseEmoji(responseEmojis[2])
      return wait(DELAY_AFTER_ALL_PICKS)
    })
    .then(function () {
      showAnswerScreen()
    })
}
