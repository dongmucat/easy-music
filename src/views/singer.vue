<template>
  <div class="singer">
    <index-list :data="singers" v-loading:[loadingText]="loading"></index-list>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list'

export default {
  name: 'singer',
  components:{
    IndexList
  },
  data() {
    return {
      singers: [],
      loadingText:'正在载入歌手列表,请稍等~~~'
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
  }
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
