import { useStore } from "vuex"
import { computed,ref,watch} from "vue"
export default function useCd() {
    const cdRef = ref(null)
    const cdImageRef = ref(null)

    const store = useStore()
    const playing = computed(() => store.state.playing)
    const cdCls = computed(()=>{
        return playing.value ? 'playing' : ''
    })

    watch(playing,(newPlaying)=>{
        if (!newPlaying) {
            syncTransform(cdRef.value,cdImageRef.value)
        }
    })
    
    function syncTransform(wrapper,inner) {
        const innerTransform = getComputedStyle(inner).transform
        const wrapperTransform = getComputedStyle(wrapper).transform
        wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ',wrapperTransform)
    }

    return {
        cdCls,
        cdRef,
        cdImageRef
    }
}