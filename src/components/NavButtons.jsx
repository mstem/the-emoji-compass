import React from 'react'
import { useStore } from '../store'
import { ROUTES } from '../constants'
import Button from './Button'
import InfoButton from './InfoButton'
import './NavButtons.css'

const SHARE_URL = 'https://emojicompass.com'
const SHARE_ICON = /iP(hone|ad|od)|Macintosh/.test(navigator.userAgent)
  ? 'share-ios'
  : 'share-android'

function shareSite () {
  // Inside the Android wrapper app the Web Share API is unavailable, so the
  // wrapper injects a bridge that opens the native share sheet.
  if (window.EmojiCompassNative?.shareUrl) {
    window.EmojiCompassNative.shareUrl(SHARE_URL)
  } else if (navigator.share) {
    navigator.share({ url: SHARE_URL }).catch(() => {})
  } else {
    navigator.clipboard?.writeText(SHARE_URL)
  }
}

export default function NavButtons ({ route, showInfoOverlay }) {
  const resetAppState = useStore((s) => s.resetAppState)

  return (
    <div className="nav-buttons">
      {route === ROUTES.ANSWER && (
        <Button type="refresh" title="Spin again" onClick={resetAppState} />
      )}
      <Button type={SHARE_ICON} title="Share" onClick={shareSite} />
      <InfoButton handler={showInfoOverlay} />
    </div>
  )
}
