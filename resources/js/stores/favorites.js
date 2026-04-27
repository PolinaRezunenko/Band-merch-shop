import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
    const items = ref([])

    function loadFavorites() {
        const saved = localStorage.getItem('favorites')
        if (saved) {
            items.value = JSON.parse(saved)
        }
    }

    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(items.value))
    }

    function isFavorite(productId) {
        return items.value.some(item => item.id === productId)
    }

    function toggleFavorite(product) {
        const index = items.value.findIndex(item => item.id === product.id)
        if (index > -1) {
            items.value.splice(index, 1)
        } else {
            items.value.push({
                id: product.id,
                name: product.name,
                price: product.price,
                old_price: product.old_price,
                image_url: product.image_url,
                sizes: product.sizes,
                is_new: product.is_new,
                is_hot: product.is_hot
            })
        }
        saveFavorites()
    }

    loadFavorites()

    return { items, isFavorite, toggleFavorite }
})