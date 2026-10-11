import React, { useEffect } from 'react'
import './RingBar.css'

const WIDGET_SRC = 'https://webring.mindshine.io/widget.js'

// The Mindshine Webring bar, inside the scene so the background carries on
// beneath it. The Android wrapper app leaves it out: its links lead off-site.
export default function RingBar () {
  const inWrapper = Boolean(window.EmojiCompassNative)

  useEffect(() => {
    if (inWrapper || document.querySelector(`script[src="${WIDGET_SRC}"]`)) return
    const script = document.createElement('script')
    script.src = WIDGET_SRC
    document.body.appendChild(script)
  }, [inWrapper])

  if (inWrapper) return null
  return (
    <div className="ring-bar">
      <div id="webring-widget" />
    </div>
  )
}
