import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../config/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uxtjoywjdihkxqzjhsgg.supabase.co'

export const useProductsStore = defineStore('products', () => {
    const allProducts = ref([])
    const loading = ref(false)
    const lastFetch = ref(null)
    const CACHE_TTL = 300000 // 5 минут

    async function fetchAllProducts(force = false) {
        if (!force && lastFetch.value && Date.now() - lastFetch.value < CACHE_TTL) {
            return allProducts.value
        }

        loading.value = true
        
        // 1. Загружаем товары (БЕЗ image_url, т.к. там плейсхолдеры)
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, category_id, name, description, price, old_price, sizes, colors, is_new, is_hot, in_stock, created_at, collection_id')
            .order('created_at', { ascending: false })

        if (productsError) {
            console.error('Ошибка загрузки товаров:', productsError)
            loading.value = false
            return []
        }

        // 2. Загружаем ВСЕ изображения (не только главные)
        const productIds = products.map(p => p.id)
        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('product_id, image_url, is_main')
            .in('product_id', productIds)
            .order('sort_order', { ascending: true })

        if (imagesError) {
            console.error('Ошибка загрузки фото:', imagesError)
        }

        // 3. Собираем карту: product_id -> URL главного фото
        const imageMap = {}
        if (images) {
            images.forEach(img => {
                // ТОЧНО ТАК ЖЕ, КАК В ВАШЕМ ProductCard!
                if (img.is_main) {
                    imageMap[img.product_id] = `${SUPABASE_URL}/storage/v1/object/public/product-images/${img.image_url}`
                }
            })
        }

        // 4. Если для товара нет главного фото — берём первое попавшееся
        if (images) {
            images.forEach(img => {
                if (!imageMap[img.product_id]) {
                    imageMap[img.product_id] = `${SUPABASE_URL}/storage/v1/object/public/product-images/${img.image_url}`
                }
            })
        }

        // 5. Обогащаем товары правильными фото
        allProducts.value = products.map(product => ({
            ...product,
            image_url: imageMap[product.id] || '/images/placeholder.png'
        }))

        lastFetch.value = Date.now()
        loading.value = false
        return allProducts.value
    }

    // Геттеры
    const hotProducts = computed(() => allProducts.value.filter(p => p.is_hot))
    const newProducts = computed(() => allProducts.value.filter(p => p.is_new))
    const inStock = computed(() => allProducts.value.filter(p => p.in_stock))

    function getProductById(id) {
        return allProducts.value.find(p => p.id === Number(id))
    }

    function clearCache() {
        allProducts.value = []
        lastFetch.value = null
    }

    return { 
        allProducts, 
        loading, 
        fetchAllProducts, 
        hotProducts, 
        newProducts, 
        inStock,
        getProductById,
        clearCache
    }
})