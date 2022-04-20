<template>
  <div class="singer">
    <index-list
      :data="singers"
      v-loading:[loadingText]="loading"
      @select="selectSinger"
    ></index-list>
  </div>
  <router-view :singer="selectedSinger"></router-view>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null,
      loadingText: '正在载入歌手列表,请稍等~~~'
    }
  },
  computed: {
    loading() {
      return !this.singers.length
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      /* 缓存 */
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger(singer){
      storage.session.set(SINGER_KEY,singer)
    }
  },
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
