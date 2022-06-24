<template>
	<teleport to="body">
		<transition name="slide-down">
			<div class="message" v-show="visible" @click="hide">
				<slot></slot>
			</div>
		</transition>
	</teleport>
</template>

<script>
export default {
	name: 'message',
	props: {
		// 延时时间，默认为 2000 ms
		delay: {
			type: Number,
			default: 2000
		}
	},
	data() {
		return {
			// 控制 Message组件的显示
			visible: false
		}
	},
	methods: {
		/**
		 * 用于展示 Message 组件
		 */
		show() {
			this.visible = true
			this.wait()
		},
		/**
		 * 用于隐藏 Message 组件
		 */
		hide() {
			clearTimeout(this.timer)
			this.visible = false
		},
		/**
		 * 展示，然后等待一段时间自动隐藏
		 */
		wait() {
			clearTimeout(this.timer)
			this.timer = setTimeout(() => {
				this.hide()
			}, this.delay)
		}
	}
}
</script>

<style scoped lang="scss">
.message {
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 400;
	background: $color-dialog-background;

	&.slide-down-enter-active,
	&.slide-down-leave-active {
		transition: all 0.3s;
	}

	&.slide-down-enter-from,
	&.slide-down-leave-to {
		transform: translate3d(0, -100%, 0);
	}
}
</style>
