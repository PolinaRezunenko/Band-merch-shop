<template>
    <section class="discount-banner" style="background-image: url('/images/discount-bg.png')">
        <div class="discount-overlay"></div>
        <div class="discount-container">
            <h3>Скидка 7%</h3>
            <p>Получите скидки при подписке на наши эксклюзивные акции, обновления и новости</p>
            <form @submit.prevent="subscribe" class="subscribe-form">
                <input type="email" v-model="email" placeholder="Ваш E-mail" required>
                <button type="submit">Подписаться</button>
            </form>
        </div>
    </section>
</template>

<script>
import { inject } from 'vue'

export default {
    name: 'DiscountBanner',
    inject: ['notify'],
    data() {
        return { email: '' }
    },
    methods: {
        subscribe() {
            if (this.email.trim()) {
                if (this.notify) this.notify.success('Подписка оформлена!', 'Скидка 7% будет отправлена на ваш email')
                this.email = ''
            }
        }
    }
}
</script>

<style scoped>
.discount-banner {
    position: relative;
    max-width: 1200px;
    height: 333px;
    margin: 60px auto;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 12px;
    overflow: hidden;
}

.discount-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
}

.discount-container {
    position: relative;
    z-index: 2;
    text-align: left;
    padding: 47px 43px;
    max-width: 600px;
}

.discount-container h3 {
    font-family: 'Ruberoid', sans-serif;
    font-size: 40px;
    color: #fff;
    margin-bottom: 15px;
}

.discount-container p {
    font-family: 'Inter', sans-serif;
    color: #fff;
    max-width: 474px;
    margin: 0 0 30px 0;
    font-size: 18px;
    line-height: 1.5;
    opacity: 0.9;
}

.subscribe-form {
    display: flex;
    gap: 12px;
    max-width: 500px;
}

.subscribe-form input {
    flex: 1;
    padding: 14px 20px;
    background: #fff;
    border: none;
    color: #817E79;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    border-radius: 100px;
    outline: none;
    min-width: 0;
}

.subscribe-form button {
    padding: 14px 30px;
    background: #ffffff;
    color: #000000;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border-radius: 100px;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
}

.subscribe-form button:hover {
    background: black;
    color: #ffffff;
    border: 1px solid #fff;
}

/* ========== АДАПТИВ ========== */

/* 1024px */
@media (max-width: 1024px) {
    .discount-banner {
        margin: 40px 20px;
        height: 280px;
    }
    .discount-container {
        padding: 30px;
    }
    .discount-container h3 {
        font-size: 32px;
    }
    .discount-container p {
        font-size: 16px;
        margin-bottom: 20px;
    }
    .subscribe-form input {
        font-size: 15px;
    }
    .subscribe-form button {
        padding: 14px 25px;
        font-size: 13px;
    }
}

/* 780px */
@media (max-width: 780px) {
    .discount-banner {
        margin: 30px 20px;
        height: auto;
        min-height: 300px;
        justify-content: center;
    }
    .discount-container {
        text-align: center;
        padding: 30px 20px;
        max-width: 100%;
    }
    .discount-container h3 {
        font-size: 28px;
    }
    .discount-container p {
        font-size: 15px;
        max-width: 100%;
        margin-bottom: 20px;
    }
    .subscribe-form {
        flex-direction: column;
        gap: 10px;
        max-width: 100%;
    }
    .subscribe-form input {
        width: 100%;
    }
    .subscribe-form button {
        width: 100%;
        padding: 14px;
    }
}

/* 480px */
@media (max-width: 480px) {
    .discount-banner {
        margin: 20px 10px;
        min-height: 320px;
    }
    .discount-container {
        padding: 25px 15px;
    }
    .discount-container h3 {
        font-size: 24px;
    }
    .discount-container p {
        font-size: 14px;
        margin-bottom: 18px;
    }
    .subscribe-form input {
        font-size: 14px;
        padding: 12px 16px;
    }
    .subscribe-form button {
        font-size: 13px;
        padding: 12px;
    }
}

/* 390px */
@media (max-width: 390px) {
    .discount-banner {
        margin: 15px 8px;
        min-height: 300px;
        border-radius: 8px;
    }
    .discount-container {
        padding: 20px 12px;
    }
    .discount-container h3 {
        font-size: 22px;
    }
    .discount-container p {
        font-size: 13px;
        margin-bottom: 15px;
    }
    .subscribe-form input {
        font-size: 13px;
        padding: 10px 14px;
    }
    .subscribe-form button {
        font-size: 12px;
        padding: 10px;
    }
}
</style>