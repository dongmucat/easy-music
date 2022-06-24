<template>
	<teleport to="body">
		<transition name="slide">
			<div class="add-song" v-show="visible">
				<div class="header">
					<h1 class="title">添加歌曲到列表</h1>
					<div class="close" @click="hide">
						<i class="icon-close"></i>
					</div>
				</div>
				<div class="search-input-wrapper">
					<search-input v-model="query" placeholder="搜索歌曲"></search-input>
				</div>
				<div v-show="!query">
					<switches
						:items="['最近播放', '搜索历史']"
						v-model="currentIndex"
					></switches>
					<div class="list-wrapper">
						<!-- 最近播放 -->
						<scroll
							v-if="currentIndex === 0"
							class="list-scroll"
							ref="scrollRef"
						>
							<div class="list-inner">
								<song-list :songs="playHistory" @select="selectSongBySongList">
								</song-list>
							</div>
						</scroll>
						<!-- 播放历史 -->
						<scroll
							v-if="currentIndex === 1"
							class="list-scroll"
							ref="scrollRef"
						>
							<div class="list-inner">
								<search-list
									:searches="searchHistory"
									:show-delete="false"
									@select="addQuery"
								></search-list>
							</div>
						</scroll>
					</div>
				</div>
				<div class="search-result" v-show="query">
					<suggest
						:query="query"
						:show-singer="false"
						@select-song="selectSongBySuggest"
					>
					</suggest>
				</div>
				<message ref="messageRef">
					<div class="message-title">
						<i class="icon-ok"></i>
						<span class="text">1首歌曲已经添加到播放列表</span>
					</div>
				</message>
			</div>
		</transition>
	</teleport>
</template>

<script>
// =====================组件引用=====================
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import Switches from '@/components/base/switches/switches'
import Scroll from '@/components/base/scroll/scroll'
import SearchList from '@/components/base/search-list/search-list'
import SongList from '@/components/base/song-list/song-list'
import Message from '@/components/base/message/message'
// =====================hooks引用=====================
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useSearchHistory from '@/components/search/use-search-history'

export default {
	name: 'add-song',
	components: {
		Switches,
		SongList,
		SearchList,
		SearchInput,
		Suggest,
		Scroll,
		Message
	},
	setup() {
		// =====================变量声明=====================
		// 控制add-song组件的显示
		const visible = ref(false)
		// 搜索查询参数
		const query = ref('')
		// 控制 “最近播放 ”和 “搜索历史” 的切换
		const currentIndex = ref(0)
		// scrollRef
		const scrollRef = ref(null)
		// vuex的store
		const store = useStore()
		// messageRef ，主要控制message的显示
		const messageRef = ref(null)

		// =====================computed=====================
		const playHistory = computed(() => store.state.playHistory)
		const searchHistory = computed(() => store.state.searchHistory)
		// =====================watch=====================
		watch(query, async () => {
			// 当查询参数发生变化的时候
			await nextTick()
			// 等待一个nextTick后刷新Scroll
			refreshScroll()
		})
		// =====================hooks=====================
		const { saveSearch } = useSearchHistory()

		// =====================methods=====================
		/**
		 * 展示add-song组件
		 */
		async function show() {
			visible.value = true
			await nextTick()
			refreshScroll()
		}

		/**
		 * 隐藏add-song组件
		 */
		function hide() {
			visible.value = false
		}
		/**
		 * 用于Scroll组件刷新
		 */
		function refreshScroll() {
			scrollRef.value.scroll.refresh()
		}

		/**
		 * 点击添加查询歌曲参数
		 * @param {String} key
		 */
		function addQuery(key) {
			query.value = key
		}

		/**
		 * 在搜索歌单列表选择并且添加歌曲
		 * @param {Object} song 歌曲
		 */
		function selectSongBySuggest(song) {
			addSong(song)
			// 保存历史
			saveSearch(query.value)
		}

		/**
		 * 在最近播放点击添加歌曲
		 * @param {Object} song
		 */
		function selectSongBySongList({ song }) {
			addSong(song)
		}

		/**
		 * 用于添加歌曲
		 * @param {Object} song 歌曲
		 */
		function addSong(song) {
			// 添加歌曲
			store.dispatch('addSong', song)
			// 展示Message组件，提示成功
			showMessage()
		}

		/**
		 * 显示Message组件
		 */
		function showMessage() {
			messageRef.value.show()
		}

		return {
			// computed
			playHistory,
			searchHistory,
			// ref
			messageRef,
			scrollRef,
			visible,
			query,
			currentIndex,
			// methods
			show,
			hide,
			addQuery,
			selectSongBySongList,
			selectSongBySuggest
		}
	}
}
</script>

<style lang="scss" scoped>
.add-song {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	z-index: 300;
	background: $color-background;

	.header {
		position: relative;
		height: 44px;
		text-align: center;

		.title {
			line-height: 44px;
			font-size: $font-size-large;
			color: $color-text;
		}

		.close {
			position: absolute;
			top: 0;
			right: 8px;

			.icon-close {
				display: block;
				padding: 12px;
				font-size: 20px;
				color: $color-theme;
			}
		}
	}

	.search-input-wrapper {
		margin: 20px;
	}

	.list-wrapper {
		position: absolute;
		top: 165px;
		bottom: 0;
		width: 100%;

		.list-scroll {
			height: 100%;
			overflow: hidden;

			.list-inner {
				padding: 20px 30px;
			}
		}
	}

	.search-result {
		position: fixed;
		top: 124px;
		bottom: 0;
		width: 100%;
	}
}

.message-title {
	text-align: center;
	padding: 18px 0;
	font-size: 0;

	.icon-ok {
		font-size: $font-size-medium;
		color: $color-theme;
		margin-right: 4px;
	}

	.text {
		font-size: $font-size-medium;
		color: $color-text;
	}
}
</style>
