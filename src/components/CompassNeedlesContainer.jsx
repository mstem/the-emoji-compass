import React from 'react'
import CompassNeedle from './CompassNeedle'
import './CompassNeedlesContainer.css'

export default function CompassNeedlesContainer () {
  return (
    <div className="compass-needles-container">
      <div className="compass-needles">
        <CompassNeedle id={1} type="request" />
        <CompassNeedle id={2} type="request" />
        <CompassNeedle id={3} type="request" />
        <CompassNeedle id={4} type="response" />
        <div className="compass-hub" />
      </div>
    </div>
  )
}
