import initObj from '@/base/initObj'
export const currentSong = (state) => {
  let res = {}
  for (let key in initObj) {
    res[key] = initObj[key]
  }
  const obj = state.musicList.find(function (e) {
    return e.id === state.currentIndex
  })
  if (!obj) {
    return res
  }
  for (let key in res) {
    if (obj[key]) {
      res[key] = obj[key]
    }
  }
  return res || {}
}
export const playing = state => {
  return state.playing
}
export const playerObj = state => {
  return state.playerObj
}
export const musicList = state => {
  return state.musicList
}
export const historyList = state => {
  return state.historyList
}
export const currentMusicIndex = state => {
  return state.currentIndex
}
export const searchHistoryList = state => {
  return state.searchHistory
}
