import { ref, watch, nextTick, computed } from 'vue'
export default function useFixed(props) {
    const TITLE_HEIGHT = 30
    const groupRef = ref(null)
    const listHeights = ref([])
    const scrollY = ref(0)
    const currenIndex = ref(0)
    const distance = ref(0)

    const fixedTitle = computed(() => {
        //滑到最顶层取消
        if (scrollY.value < 0) {
            return ''
        }
        const currentGroup = props.data[currenIndex.value]
        return currentGroup ? currentGroup.title : ''
    })
    //计算标题顶上去的样式
    const fixedStyle = computed(() => {
        const distanceVal = distance.value
        //计算偏移量
        const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
        return {
          transform: `translate3d(0,${diff}px,0)`
        }
      })

    //如果只对对象中的某个属性进行监听，需要把第一个参数写成函数的形式才会生效
    watch(() => props.data, async () => {
        //dom发生变化是在nextTick之后
        await nextTick()
        calculate()
    })

    watch(scrollY, (newValue) => {
        const listHeightsVal = listHeights.value
        //因为一开始push了一个0进去，因此listHeightsVal的长度比list长度大1
        //下面遍历是看落在了哪个区间内
        for (let index = 0; index < listHeightsVal.length - 1; index++) {
            const heightTop = listHeightsVal[index]
            const heightBottom = listHeightsVal[index + 1]
            if (newValue >= heightTop && newValue <= heightBottom) {
                currenIndex.value = index
                distance.value = heightBottom - newValue
            }
        }
    })
    //应该在DOM变化后就进行一次计算
    function calculate() {
        //获取DOM子元素数组
        const list = groupRef.value.children
        const listHeightsVal = listHeights.value
        let height = 0
        //数组清空
        listHeightsVal.length = 0
        //从0开始
        listHeightsVal.push(height)
        for (let index = 0; index < list.length; index++) {
            //累加高度
            height += list[index].clientHeight
            //加入到累加高度数组中
            listHeightsVal.push(height)
        }
    }
    //获取位置
    function onScroll(pos) {
        scrollY.value = -pos.y
    }
    return {
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle
    }
}
