import { create } from 'zustand'
import symbols from './symbols.json'
import { ROUTES } from './constants'
import { getEmojiPosition } from './utils'

const initialState = {
  symbols,
  route: ROUTES.MAIN,
  requestEmojis: [],
  responseEmojis: [],
  needlePosition: null,
  activeNeedle: 1,
}

export const useStore = create((set, get) => ({
  ...initialState,

  addRequestEmoji: (emoji) =>
    set((s) => ({ requestEmojis: [...s.requestEmojis, emoji] })),

  addResponseEmoji: (emoji) =>
    set((s) => ({ responseEmojis: [...s.responseEmojis, emoji] })),

  setResponseEmoji: (emojis) =>
    set({ responseEmojis: [...emojis] }),

  showAnswerScreen: () =>
    set({ route: ROUTES.ANSWER }),

  resetAppState: () =>
    set({ ...initialState }),

  updateNeedlePosition: (rotation) =>
    set((s) => ({ needlePosition: getEmojiPosition(rotation, s.symbols) })),

  setActiveNeedle: (needleId) =>
    set({ activeNeedle: needleId, needlePosition: null }),
}))
