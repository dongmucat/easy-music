<template>
  <div class="singer">

  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'

export default {
  name: 'singer',
  data() {
    return {
      singers: []
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
    console.log(this.singers)
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
