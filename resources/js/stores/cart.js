import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])

    const totalItems = computed(() => {
        return items.value.reduce((sum, item) => sum + item.quantity, 0)
    })

    const totalPrice = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })

    function addToCart(product, size, quantity = 1) {
        const existingItem = items.value.find(
            item => item.id === product.id && item.selectedSize === size
        )

        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            items.value.push({
                id: product.id,
                name: product.name,
                price: product.price,
                old_price: product.old_price,
                image_url: product.image_url,
                selectedSize: size || (product.sizes && product.sizes[0]),
                quantity: quantity
            })
        }

        saveToLocalStorage()
    }

    function removeFromCart(productId, size) {
        items.value = items.value.filter(
            item => !(item.id === productId && item.selectedSize === size)
        )
        saveToLocalStorage()
    }

    function updateQuantity(productId, size, quantity) {
        const item = items.value.find(
            item => item.id === productId && item.selectedSize === size
        )
        if (item) {
            item.quantity = quantity
            saveToLocalStorage()
        }
    }

    function clearCart() {
        items.value = []
        saveToLocalStorage()
    }

    function saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(items.value))
    }

    function loadFromLocalStorage() {
        const saved = localStorage.getItem('cart')
        if (saved) {
            items.value = JSON.parse(saved)
        }
    }

    // Загружаем корзину при создании
    loadFromLocalStorage()

    return {
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    }
})