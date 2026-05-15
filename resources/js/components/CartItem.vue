<template>
    <div class="cart-item">
        <router-link :to="'/product/' + item.id" class="cart-item-image-link">
            <img :src="itemImage" :alt="item.name" loading="lazy" class="cart-item-image" @error="handleImageError">
        </router-link>
        
        <div class="cart-item-info">
            <router-link :to="'/product/' + item.id" class="cart-item-name">
                {{ item.name }}
            </router-link>
            <p class="cart-item-size" v-if="item.selectedSize && item.selectedSize !== 'Универсальный'">
                Размер: {{ item.selectedSize }}
            </p>
        </div>
        
        <QuantityCounter v-model="itemQuantity" @update:model-value="updateQty" />
        
        <div class="cart-item-prices">
            <span class="cart-item-price">{{ (item.price * itemQuantity).toLocaleString() }} ₽</span>
            <span v-if="item.old_price" class="cart-item-old-price">
                {{ (item.old_price * itemQuantity).toLocaleString() }} ₽
            </span>
        </div>
        
        <button class="btn-remove" @click="$emit('remove', item.id, item.selectedSize)">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="5" y1="5" x2="15" y2="15" stroke="#999" stroke-width="1.5"/>
                <line x1="15" y1="5" x2="5" y2="15" stroke="#999" stroke-width="1.5"/>
            </svg>
        </button>
    </div>
</template>

<script>
import { supabase } from '../config/supabase'
import QuantityCounter from './QuantityCounter.vue'

export default {
    name: 'CartItem',
    components: { QuantityCounter },
    props: { 
        item: { 
            type: Object, 
            required: true 
        } 
    },
    emits: ['remove', 'update-quantity'],
    data() {
        return { 
            itemQuantity: this.item.quantity,
            itemImage: this.item.image_url
        }
    },
    async mounted() {
        await this.loadMainImage()
    },
    methods: {
        async loadMainImage() {
            try {
                const { data, error } = await supabase
                    .from('product_images')
                    .select('image_url')
                    .eq('product_id', this.item.id)
                    .eq('is_main', true)
                    .single()
                
                if (data && !error) {
                    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                    this.itemImage = `${supabaseUrl}/storage/v1/object/public/product-images/${data.image_url}`
                }
            } catch (err) {
                // Оставляем image_url из item
            }
        },
        handleImageError(event) {
            event.target.src = 'https://placehold.co/100x100/f5f5f5/0a0a0a?text=Нет+фото'
        },
        updateQty(val) {
            this.itemQuantity = val
            this.$emit('update-quantity', { 
                id: this.item.id, 
                size: this.item.selectedSize, 
                quantity: val 
            })
        }
    }
}
</script>

<style scoped>
/* Стили без изменений */
.cart-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 15px;
    transition: border-color 0.3s;
}

.cart-item:hover {
    border-color: #ddd;
}

.cart-item-image-link {
    flex-shrink: 0;
}

.cart-item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
    transition: opacity 0.3s;
}

.cart-item-image:hover {
    opacity: 0.8;
}

.cart-item-info {
    flex: 1;
    min-width: 0;
}

.cart-item-name {
    color: #000;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
    transition: color 0.3s;
    display: block;
    font-family: 'Inter', sans-serif;
}

.cart-item-name:hover {
    color: #666;
}

.cart-item-size {
    color: #999;
    font-size: 14px;
    margin-top: 5px;
    font-family: 'Inter', sans-serif;
}

.cart-item-prices {
    text-align: right;
    min-width: 100px;
}

.cart-item-price {
    color: #000;
    font-weight: 700;
    font-size: 18px;
    display: block;
    font-family: 'Inter', sans-serif;
}

.cart-item-old-price {
    color: #999;
    text-decoration: line-through;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
}

.btn-remove {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    flex-shrink: 0;
    transition: opacity 0.2s;
}

.btn-remove:hover {
    opacity: 0.5;
}

@media (max-width: 1200px) {
    .cart-item { gap: 16px; padding: 16px; }
}

@media (max-width: 1024px) {
    .cart-item { gap: 14px; padding: 14px; }
    .cart-item-image { width: 80px; height: 80px; }
}

@media (max-width: 780px) {
    .cart-item { gap: 12px; padding: 12px; }
    .cart-item-image { width: 70px; height: 70px; }
    .cart-item-name { font-size: 14px; }
    .cart-item-price { font-size: 16px; }
}

@media (max-width: 480px) {
    .cart-item {
        flex-wrap: wrap;
        gap: 10px;
        padding: 10px;
    }
    .cart-item-image { width: 60px; height: 60px; }
    .cart-item-info { flex: 1 1 60%; }
    .cart-item-prices {
        text-align: left;
        min-width: auto;
        order: 1;
    }
    .btn-remove {
        order: 2;
        margin-left: auto;
    }
}

@media (max-width: 390px) {
    .cart-item { gap: 8px; padding: 8px; }
    .cart-item-image { width: 50px; height: 50px; }
    .cart-item-name { font-size: 13px; }
    .cart-item-price { font-size: 14px; }
    .cart-item-size { font-size: 12px; }
}
</style>