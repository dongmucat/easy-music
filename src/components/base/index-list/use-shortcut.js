import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
    const ANCHOR_HEIGHT = 18
    const scrollRef = ref(null)

    const shortcutList = computed(() => {
        return props.data.map((group) => {
            return group.title
        })
    })

    const touch = {}

    function onShortcutTouchStart(e) {
        const anchorIndex = parseInt(e.target.dataset.index)
        //得到刚开始的Y坐标
        touch.y1 = e.touches[0].pageY
        touch.anchorIndex = anchorIndex
        //跳转
        scrollTo(anchorIndex)
    }

    function onShortcutTouchMove(e) {
        //得到滑动的Y坐标
        touch.y2 = e.touches[0].pageY
        const delta = Math.floor((touch.y2 - touch.y1) / ANCHOR_HEIGHT)
        const anchorIndex = touch.anchorIndex + delta
        //跳转
        scrollTo(anchorIndex)
    }

    function scrollTo(index) {
        if (isNaN(index)) {
            return
        }
        //限制index在0和shortcutList.value.length - 1之间
        index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
        const targetEl = groupRef.value.children[index]
        const scroll = scrollRef.value.scroll
        scroll.scrollToElement(targetEl, 0)
    }

    return {
        shortcutList,
        scrollRef,
        onShortcutTouchStart,
        onShortcutTouchMove
    }
}
