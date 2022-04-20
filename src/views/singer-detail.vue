<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '../components/music-list/music-list.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  props: {
    singer: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  async created() {
    /* 如果缓存也为空,做一层保护，跳转到一级路由 */
    if(!this.computedSinger){
      const path = this.$route.matched[0].path
      this.$router.push({
        path:path
      })
      return
    }
    const result = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(result.songs)
    this.loading = false
    
  },
  computed: {
    computedSinger() {
      let res = null
      const singer = this.singer
      /* 判断singer是否传进来 */
      if (singer) {
        res = singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          res = cachedSinger
        }
      }
      return res
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    }
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
