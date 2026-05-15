<template>
    <img 
        :src="loadedSrc || placeholder"
        :alt="alt"
        :width="width"
        :height="height"
        loading="lazy"
        :class="imgClass"
        @error="onError"
    >
</template>

<script>
export default {
    name: 'CachedImage',
    props: {
        src: String,
        alt: { type: String, default: '' },
        width: [String, Number],
        height: [String, Number],
        placeholder: { type: String, default: '/images/placeholder.png' },
        imgClass: String
    },
    data() {
        return {
            loadedSrc: null,
            cache: {}
        }
    },
    watch: {
        src: {
            immediate: true,
            handler(newSrc) {
                if (!newSrc) return
                // Проверяем кэш
                const cached = localStorage.getItem('img_' + newSrc)
                if (cached) {
                    this.loadedSrc = cached
                    return
                }
                // Загружаем и кэшируем
                const img = new Image()
                img.onload = () => {
                    this.loadedSrc = newSrc
                    try { localStorage.setItem('img_' + newSrc, newSrc) } catch(e) {}
                }
                img.src = newSrc
            }
        }
    },
    methods: {
        onError() {
            this.loadedSrc = this.placeholder
        }
    }
}
</script>