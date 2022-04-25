import { PLAY_MODE, SEARCH_KEY, FAVORITE_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

/* 定义全局共享数据 */
const state = {
  sequenceList: [],
  /* 真正的播放列表 */
  playlist: [],
  /* 是否正在播放 */
  playing: false,
  /* 播放模式，默认是顺序播放 */
  playMode: PLAY_MODE.sequence,
  /* 播放歌曲索引 */
  currentIndex: 0,
  /* 播放器的状态（全屏或者是收缩） */
  fullScreen: false,
  /* 收藏列表 */
  favoriteList: load(FAVORITE_KEY),
  searchHistory: load(SEARCH_KEY),
  playHistory: []
}

export default state
