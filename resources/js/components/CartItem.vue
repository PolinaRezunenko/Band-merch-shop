<template>
    <div class="cart-item">
        <router-link :to="'/product/' + item.id" class="cart-item-image-link">
            <img :src="item.image_url" :alt="item.name" class="cart-item-image">
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
            itemQuantity: this.item.quantity 
        }
    },
    methods: {
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
    min-width: 120px;
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

@media (max-width: 640px) {
    .cart-item {
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .cart-item-prices {
        text-align: left;
        min-width: auto;
    }
}
</style>