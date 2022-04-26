export const currentSong = (state) => {
  /* 使用空对象来解决控制台报错undefined(第一层) */
  return state.playlist[state.currentIndex] || {}
}
