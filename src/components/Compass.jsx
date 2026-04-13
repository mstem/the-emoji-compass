import React from 'react'
import CompassDial from './CompassDial'
import CompassNeedlesContainer from './CompassNeedlesContainer'
import './Compass.css'

export default function Compass () {
  return (
    <div className="compass-container">
      <CompassDial />
      <CompassNeedlesContainer />
    </div>
  )
}
