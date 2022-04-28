import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

const lyricMap = {}

export function getLyric(song) {
  /* 如果该歌曲已经有了歌词，则不需要再发送请求 */
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  /* 闭包，保留lyricMap: mid ->  lyric ，因为在不同的场景mid是相同的*/
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词~'
    lyricMap[mid] = lyric
    return lyric
  })
}
