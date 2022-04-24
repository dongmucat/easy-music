<template>
  <div class="player">
    <div
      class="normal-player"
      v-show="fullScreen"
    >
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div
          class="back"
          @click="goBack"
        >
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i
              class="icon-prev"
              @click="prev"
            ></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i
              :class="playIcon"
              @click="togglePlay"
            ></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i
              class="icon-next"
              @click="next"
            ></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
    ></audio>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, watch, ref } from "vue";
export default {
  name: "player",
  components: {},
  setup(props) {
    /* data */
    const audioRef = ref(null)
    const songReady = ref(false)
    /* vuex */
    const store = useStore()
    /* computed*/
    const fullScreen = computed(() => store.state.fullScreen)
    const playing = computed(() => store.state.playing)
    const currentSong = computed(() => store.getters.currentSong)
    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play"
    });
    const currentIndex = computed(() => store.state.currentIndex)
    const playlist = computed(() => store.state.playlist)
    const disableCls = computed(()=>{
        return songReady.value ? '': 'disable'
    })

    /* 监视 */
    watch(currentSong, newSong => {
      if (!newSong.id && !newSong.url) {
        return
      }
      /* 歌曲发生变化的时候songReady.value为false */
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    });

    watch(playing, newPlaying => {
      /* 当songReady为false时候，什么都不做直接返回 */
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    });

    // methods
    function goBack() {
      store.commit("setFullScreen", false)
    }

    function togglePlay() {
        if (!songReady.value) {
            return
        }
      store.commit("setPlayingState", !playing.value)
    }

    function pause() {
      store.commit("setPlayingState", false)
    }

    function prev() {
      /* 环形播放 */
      const list = playlist.value
      if (!songReady.value || !list.length) {
        return
      }
      /* 只有一首歌的情况 */
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit("setCurrentIndex", index)
        /* 如果目前播放的歌曲是暂停的，并且想回到上一首,那么回到上一首就会播放 */
        if (playing.value === false) {
          store.commit("setPlayingState", true)
        }
      }
    }

    function next() {
      /* 环形播放 */
      const list = playlist.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          //第一首歌
          index = 0
        }
        store.commit("setCurrentIndex", index)
        /* 如果目前播放的歌曲是暂停的，并且想回到上一首,那么回到上一首就会播放 */
        if (playing.value === false) {
          store.commit("setPlayingState", true)
        }
      }
    }

    function loop() {
      const audioEl = audioRef.value
      //从头播放
      audioEl.currentTime = 0
      audioEl.play()
    }

    function ready() {
      if (songReady.value === true) {
        return
      }
      songReady.value = true
    }

    function error() {
        /* 发生歌曲播放错误的时候也允许前进和后退 */
        songReady.value = true
    }
    return {
      /* computed */
      fullScreen,
      currentSong,
      playIcon,
      /* watch */
      audioRef,
      /* methods */
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      /* style */
      disableCls
    }
  }
};
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;

      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
