export default class Song {
  constructor ({id, singer, name, album, image, aliaName, artist}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.aliaName = aliaName
    this.image = image
    this.artist = artist || []
  }
}

function singerName (arr) {
  let name = []
  name = arr.map((item) => {
    return item.name
  })

  return name.join('/')
}

export function createRecommendSong (music) {
  const artists = music.artists || music.song.artists || []
  const album = music.album || music.song.album || []
  return new Song({
    id: music.id,
    singer: singerName(artists),
    name: music.name,
    album: album,
    image: album.picUrl,
    artist: artists
  })
}

export function createRecommendListSong (music) {
  const artists = music.artists || music.ar
  const album = music.album || music.al
  return new Song({
    id: music.id,
    singer: singerName(artists),
    name: music.name,
    album: album,
    image: album.picUrl.replace(/.jpg|.jpeg|.png|.gif|.bmp/g, '.webp?imageView&thumbnail=360y360&quality=75&tostatic=0&type=webp'),
    artist: artists
  })
}

export function createSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al,
    image: music.al.picUrl
  })
}

export function createSearchSong (music) {
  const artists = music.artists || music.ar
  const album = music.album || music.al
  return new Song({
    id: music.id,
    singer: singerName(artists),
    name: music.name,
    album: album,
    image: '',
    artist: artists
  })
}
