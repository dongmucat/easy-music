import { useStore } from 'vuex'
import { PLAY_KEY } from '@/assets/js/constant'
import { save } from '@/assets/js/array-store'

/**
 * @param {any} void
 * @returns {any} savePlay
 */
export default function usePlayHistory() {
  // 获取store
  const store = useStore()
  // 设置最多保留200首歌
  const maxLen = 200
  /**
   * 用于更新以及保存歌曲播放历史
   * @param {any} song 
   */
  function savePlay(song) {
    // 保存播放歌曲历史
    const songs = save(song, PLAY_KEY, (item) => {
      return item.id === song.id
    }, maxLen)
    // 提交到mutations中的setPlayHistory
    store.commit('setPlayHistory', songs)
  }

  // 返回值
  return {
    savePlay
  }
}
