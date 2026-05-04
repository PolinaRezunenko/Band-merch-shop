<template>
    <section class="discount-banner" style="background-image: url('/images/discount-bg.png')">
        <div class="discount-overlay"></div>
        <div class="discount-container">
            <h3>Узнавайте первыми о наших акциях, розыгрышах и новостях</h3>
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



.discount-container {
    position: relative;
    z-index: 2;
    text-align: left;
    padding: 47px 43px;
    max-width: 750px;
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
    margin: 0 0 92px 0;
    font-size: 18px;
    line-height: 1.5;
    opacity: 0.9;
    letter-spacing: -3%;
}

.subscribe-form {
    display: flex;
    gap: 12px;
    max-width: 570px;
    height: 55px;
    margin: 0;
}

.subscribe-form input {
    flex: 1;
    padding: 14px 20px;
    background: #fff;
    border: none;
    color: #817E79;
    font-family: 'Inter', sans-serif;
    font-size: 17px;
    border-radius: 100px;
    outline: none;
    width: 356px;

}

.subscribe-form button {
    padding: 19.5px 60px;
    background: #ffffff;
    color: #000000;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13.2px;
    font-weight: 600;
    border-radius: 100px;
    cursor: pointer;
    white-space: nowrap;
    width: 205px;
}

.subscribe-form button:hover {
    background: black;
    border: 1px solid rgb(255, 255, 255);
    color: #ffffff;
}
</style>