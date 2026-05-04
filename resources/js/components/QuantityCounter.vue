<template>
    <div class="quantity-counter">
        <button @click="decrement" :disabled="modelValue <= 1">−</button>
        <span>{{ modelValue }}</span>
        <button @click="increment">+</button>
    </div>
</template>

<script>
export default {
    name: 'QuantityCounter',
    props: {
        modelValue: {
            type: Number,
            default: 1
        }
    },
    emits: ['update:modelValue'],
    methods: {
        increment() {
            this.$emit('update:modelValue', this.modelValue + 1)
        },
        decrement() {
            if (this.modelValue > 1) {
                this.$emit('update:modelValue', this.modelValue - 1)
            }
        }
    }
}
</script>

<style scoped>
.quantity-counter {
    display: flex;
    align-items: center;
    border: 1px solid #333;
    border-radius: 6px;
    overflow: hidden;
    width: fit-content;
}

.quantity-counter button {
    width: 44px;
    height: 44px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-counter button:hover:not(:disabled) {
    background: #333;
}

.quantity-counter button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.quantity-counter span {
    width: 50px;
    text-align: center;
    color: #000000;
    font-weight: 600;
    font-size: 1rem;
    user-select: none;
}
</style>