import { useStore } from "vuex"
import { computed, watch, ref, handleError } from "vue"
import { getLyric } from '@/service/song'
import Lyric from "lyric-parser"
export default function useLyric({ songReady, currentTime }) {
    const lyricListRef = ref(null)
    const lyricScrollRef = ref(null)
    const currentLyric = ref(null)
    const currentLineNum = ref(0)
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)

    watch(currentSong, async (newSong) => {
        /* 不合法直接返回 */
        if (!newSong.url || !newSong.id) {
            return
        }
        /* 清理上一个currentLyric和currentLineNum缓存 */
        stopLyric()
        currentLyric.value = null
        currentLineNum.value = 0

        const lyric = await getLyric(newSong)
        store.commit('addSongLyric', {
            song: newSong,
            lyric: lyric
        })

        if (currentSong.value.lyric !== lyric) {
            return
        }

        currentLyric.value = new Lyric(lyric, handleLyric)
        if (songReady.value) {
            playLyric()
        }
    })

    function handleLyric({ lineNum }) {
        currentLineNum.value = lineNum
        const scrollComp = lyricScrollRef.value
        const listEl = lyricListRef.value
        if (!listEl) {
            return
        }
        if (lineNum > 5) {
            const lineEl = listEl.children[lineNum - 5]
            /* 滚动到对应歌词的位置 */
            scrollComp.scroll.scrollToElement(lineEl, 1000)
        } else {
            scrollComp.scroll.scrollTo(0, 0, 1000)
        }
    }

    function playLyric() {
        const currentLyricVal = currentLyric.value
        if (currentLyricVal) {
            currentLyricVal.seek(currentTime.value * 1000)
        }
    }

    function stopLyric() {
        const currentLyricVal = currentLyric.value
        if (currentLyricVal) {
            currentLyricVal.stop()
        }
    }
    return {
        currentLyric,
        currentLineNum,
        playLyric,
        stopLyric,
        lyricListRef,
        lyricScrollRef
    }

}