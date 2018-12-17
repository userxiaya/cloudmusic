export default class SongDetail {
  constructor ({id, name, image, detail, trackCount, updateFrequency}) {
    this.id = id
    this.name = name
    this.image = image
    this.detail = detail // Array
    this.trackCount = trackCount
    this.updateFrequency = updateFrequency
  }
}
const setDetail = function (array) {
  let res = []
  array.forEach((obj) => {
    let list = []
    for (let key in obj) {
      if (obj[key]) {
        list.push(obj[key])
      }
    }
    res.push(list.join('-'))
  })
  return res
}
export function createSongDetail (music) {
  return new SongDetail({
    id: music.id,
    name: music.name,
    image: music.coverImgUrl,
    detail: setDetail(music.tracks),
    trackCount: music.trackCount,
    updateFrequency: music.updateFrequency
  })
}
