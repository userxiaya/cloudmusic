import * as types from './mutation-types'
import { getSong, songDetail, artistDetail } from '@/base/api'
const randomNum = function (minNum, maxNum) {
  let res = null
  switch (arguments.length) {
    case 1:
      res = parseInt(Math.random() * minNum + 1, 10)
      break
    case 2:
      res = parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      break
    default:
      res = 0
      break
  }
  return res
}
const getIndexs = function (index, min, max) {
  const resIndex = randomNum(min, max)
  if (resIndex === index) {
    return getIndexs(index, min, max)
  } else {
    return resIndex
  }
}
const playSongs = function (id, self) {
  getSong(id).then(res => {
    if (res.data && res.data.code + '' === '200') {
      res = res.data
      const url = (res.data && res.data[0]) ? (res.data[0].url || '') : ''
      if (url) {
        self.$bus.emit('playMusicUrl', url)
      }
    }
  })
}
const getSingerUrl = function (id) {
  return new Promise((resolve, reject) => {
    artistDetail(id).then((res) => {
      const data = res.data
      if (data && `${data.code}` === '200') {
        resolve(data.artist.picUrl)
      } else {
        resolve('')
      }
    }).catch(e => {
      reject(e)
    })
  })
}
const getSongUrl = function (id) {
  return new Promise((resolve, reject) => {
    songDetail(id).then((res) => {
      const result = res.data
      if (result.songs && result.songs[0] && result.songs[0].al.picUrl) {
        resolve(result.songs[0].al.picUrl)
      } else {
        resolve('')
      }
    }).catch(e => {
      reject(e)
    })
  })
}
const mutations = {
  [types.setPlay] (state, flag) {
    state.playing = flag
  },
  [types.setPlayerObj] (state, obj) {
    for (let key in obj) {
      state.playerObj[key] = obj[key]
    }
  },
  [types.setSearchHistory] (state, list) {
    state.searchHistory = list.slice(0, 6)
    window.localStorage.setItem('searchHistory', JSON.stringify(list))
  },
  [types.saveSearchHistory] (state, name) {
    let list = state.searchHistory
    const index = list.indexOf(name)
    if (index !== -1) {
      list.splice(index, 1)
    }
    list.unshift(name)
    this.commit('SET_SEARCHHISTORY', list)
  },
  [types.saveHistory] (state, song) {
    const list = state.historyList
    const obj = list.find(function (e) {
      return e.id === song.id
    })
    if (obj) {
      const index = state.historyList.indexOf(obj)
      if (index !== -1) {
        state.historyList.splice(index, 1)
      }
    }
    list.unshift(song)
    this.commit('SETHISTORY', list)
  },
  [types.setHistory] (state, list) {
    state.historyList = list.slice(0, 100)
    window.localStorage.setItem('historyList', JSON.stringify(state.historyList))
  },
  [types.setCurrentIndex] (state, index) {
    state.currentIndex = index
    window.localStorage.setItem('currentIndex', index)
  },
  [types.setMusicList] (state, list) {
    state.musicList = list.slice(0, 1000)
    window.localStorage.setItem('musicList', JSON.stringify(state.musicList))
  },
  async [types.playBySong] (state, { self, song }) {
    if (!song.image) {
      try {
        song.image = await getSongUrl(song.id)
      } catch (e) {
        song.image = ''
      }
    }
    if (!song.artistNew) {
      setTimeout(async () => {
        let artistList = []
        for (let i = 0; i < song.artist.length; i++) {
          const item = song.artist[i]
          const url = await getSingerUrl(item.id)
          artistList.push({
            name: item.name,
            id: item.id,
            singerImage: url
          })
        }
        song.artistNew = artistList
        const index = state.musicList.map(o => o.id).indexOf(state.currentIndex)
        let list = []
        state.musicList.forEach((e) => {
          list.push(e)
        })
        list[index] = song
        this.commit('SET_MUSICLIST', list)
      }, 10)
    }
    const obj = state.musicList.find(function (e) {
      return e.id === song.id
    })
    if (obj) {
      if (!obj.image) {
        obj.image = song.image// 补全部分接口取不到url值
        this.commit('SET_MUSICLIST', state.musicList)// 同步补全的信息
      }
      this.commit('SET_CURRENTINDEX', song.id)
    } else {
      let endList = []
      state.musicList.forEach(e => {
        endList.push(e)
      })
      endList.unshift(song)
      this.commit('SET_MUSICLIST', endList)
      this.commit('SET_CURRENTINDEX', song.id)
    }
    playSongs(state.currentIndex, self)
  },
  [types.playBySongList] (state, { list, id }) {
    this.commit('SET_MUSICLIST', list)
    switch (state.playType) {
      case 2:
        this.commit('SET_CURRENTINDEX', list[randomNum(0, list.length - 1)].id)
        break
      default:
        this.commit('SET_CURRENTINDEX', id)
    }
  },
  [types.nextSong] (state, { self }) {
    const index = state.musicList.map(o => o.id).indexOf(state.currentIndex)
    switch (state.playMode) {
      case 2:
        if (state.musicList.length <= 1) {
          self.$bus.emit('add-seek-to', { precent: 0 })
        }
        const i = getIndexs(index, 0, state.musicList.length - 1)
        this.commit('SET_CURRENTINDEX', state.musicList[i].id)
        break
      default:
        if (state.musicList.length <= 1) {
          self.$bus.emit('add-seek-to', { precent: 0 })
        } else {
          if (index === state.musicList.length - 1) {
            this.commit('SET_CURRENTINDEX', state.musicList[0].id)
          } else {
            this.commit('SET_CURRENTINDEX', state.musicList[index + 1].id)
          }
        }
    }
    playSongs(state.currentIndex, self)
  },
  [types.prevSong] (state, { self }) {
    const index = state.musicList.map(o => o.id).indexOf(state.currentIndex)
    switch (state.playMode) {
      case 2:
        if (state.musicList.length <= 1) {
          self.$bus.emit('add-seek-to', { precent: 0 })
        }
        const i = getIndexs(index, 0, state.musicList.length - 1)
        this.commit('SET_CURRENTINDEX', state.musicList[i].id)
        break
      default:
        if (state.musicList.length <= 1) {
          self.$bus.emit('add-seek-to', { precent: 0 })
        } else {
          if (index === 0) {
            this.commit('SET_CURRENTINDEX', state.musicList[state.musicList.length - 1].id)
          } else {
            this.commit('SET_CURRENTINDEX', state.musicList[index - 1].id)
          }
        }
    }
    playSongs(state.currentIndex, self)
  },
  [types.setPrevTempList] (state, id) {
    const list = state.prevTempList
    list.unshift(id + '')
    state.prevTempList = list.slice(0, 20)
  },
  [types.consummateSong] (state) {
    const song = state.musicList.find(function (e) {
      return e.id === state.currentIndex
    })
    const index = state.musicList.map(o => o.id).indexOf(state.currentIndex)
    let list = []
    state.musicList.forEach((e) => {
      list.push(e)
    })
    if (!song.artistNew || (song.artistNew.length === 0 && song.artist && song.artist.length > 0)) {
      setTimeout(async () => {
        let artistList = []
        for (let i = 0; i < song.artist.length; i++) {
          const item = song.artist[i]
          const url = await getSingerUrl(item.id)
          artistList.push({
            name: item.name,
            id: item.id,
            singerImage: url
          })
        }
        song.artistNew = artistList
        list[index] = song
        this.commit('SET_MUSICLIST', list)
      }, 10)
    }
    if (!song.image) {
      setTimeout(async () => {
        song.image = await getSongUrl(song.id)
        list[index] = song
        this.commit('SET_MUSICLIST', state.musicList)// 同步补全的信息
      }, 100)
    }
  }
}
export default mutations
