import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        let res = null
        const data = this.data
        if (data) {
          res = data
        } else {
          const cached = storage.session.get(key)
          if (
            cached &&
            (cached.mid || cached.id + '') === this.$route.params.id
          ) {
            res = cached
          }
        }
        return res
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created() {
      const data = this.computedData
      if (!data) {
        // 如果没有data则跳转到 /top-list
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      // 获取歌曲
      const result = await fetch(data)
      // 处理歌曲并且保存
      this.songs = await processSongs(result.songs)
      // 取消loading效果
      this.loading = false
    }
  }
}
