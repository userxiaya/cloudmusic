// import axios from 'axios'
import fetch from './fetch'
let get = function (url) {
  const qz = 'http://47.107.134.246:3000'
  // const qz = process.env.NODE_ENV === 'production' ? 'http://47.107.134.246:3000' : '/apis'
  return fetch({
    method: 'get',
    url: `${qz + url}`
  })
  // return axios.get(`${qz + url}`)
}

export function getSong (id) {
  // const url = `/song/url?id=${id}`
  const url = `/music/url?id=${id}`
  return get(url)
}

export function getLyric (id) {
  const url = `/lyric?id=${id}`
  return get(url)
}
export function loginRefresh () {
  const timestamp = new Date().getTime()
  const url = `/login/refresh?timestamp=${timestamp}` // 不需要缓存的接口加上timestamp
  return get(url)
}
export function loginStatus () {
  const timestamp = new Date().getTime()
  const url = `/login/status?timestamp=${timestamp}`
  return get(url)
}
export function logout () {
  const timestamp = new Date().getTime()
  const url = `/logout?timestamp=${timestamp}`
  return get(url)
}
export function login (phone, password) {
  const url = `/login/cellphone?phone=${phone}&password=${password}`
  return get(url)
}
export function banner () {
  const url = `/banner`
  return get(url)
}
export function recommendResource () {
  const url = `/recommend/resource`
  return get(url)
}
export function personalized () {
  const url = `/personalized`
  return get(url)
}// 推荐的歌单
export function recommendSongs () {
  const url = `/recommend/songs`
  return get(url)
}
export function newSong () {
  const url = `/personalized/newsong`
  return get(url)
}
export function playlistDetail (id) {
  const url = `/playlist/detail?id=${id}`
  return get(url)
}
export function lyric (id) {
  const timestamp = new Date().getTime()
  const url = `/lyric?id=${id}&timestamp=${timestamp}`
  return get(url)
}
export function userPlaylist (uid) {
  const url = `/user/playlist?uid=${uid}`
  return get(url)
}
export function searchHot () {
  const url = `/search/hot`
  return get(url)
}
export function getSearchSongs (name, page) {
  const url = `/search?keywords=${name}&offset=${page}`
  return get(url)
}

export function getSearchSuggest (name) {
  const url = `/search/suggest?keywords=${name}`
  return get(url)
}
export function songDetail (id) {
  const url = `/song/detail?ids=${id}`
  return get(url)
}
export function getSingers () {
  const url = '/top/artists?limit=100'
  return get(url)
}
export function artistDetail (id) {
  const url = `/artists?id=${id}`
  return get(url)
}
export function toplistDetail () {
  const url = `/toplist/detail`
  return get(url)
}
