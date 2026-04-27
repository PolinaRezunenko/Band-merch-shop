<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <h1>Регистрация</h1>
                <form @submit.prevent="register">
                    <input type="text" v-model="firstName" placeholder="Имя" required>
                    <input type="text" v-model="lastName" placeholder="Фамилия" required>
                    <input type="email" v-model="email" placeholder="E-mail" required>
                    <input type="tel" v-model="phone" placeholder="+7 (999) 999-99-99" required>
                    <input type="password" v-model="password" placeholder="Пароль" required>
                    <input type="password" v-model="passwordConfirm" placeholder="Повторите пароль" required>
                    <button type="submit" class="btn-auth">Продолжить</button>
                </form>
                <p class="auth-switch">Уже есть аккаунт? <router-link to="/login">Вход</router-link></p>
            </div>
        </div>
        <PopularProducts />
        <DiscountBanner />
    </div>
</template>

<script>
import PopularProducts from '../components/PopularProducts.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'RegisterPage',
    components: { PopularProducts, DiscountBanner },
    data() { return { firstName: '', lastName: '', email: '', phone: '', password: '', passwordConfirm: '' } },
    methods: {
        register() { alert('Регистрация успешна!') }
    }
}
</script>

<style scoped>
.auth-page { background: #0a0a0a; min-height: 100vh; }
.auth-container { max-width: 450px; margin: 0 auto; padding: 4rem 2rem; }
.auth-card { background: #1a1a1a; padding: 2.5rem; border-radius: 12px; }
.auth-card h1 { color: #fff; text-align: center; margin-bottom: 2rem; font-size: 2rem; }
.auth-card input { width: 100%; padding: 0.9rem; margin-bottom: 1rem; background: #0a0a0a; border: 1px solid #333; color: #fff; border-radius: 6px; }
.btn-auth { width: 100%; padding: 0.9rem; background: #ff4444; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-bottom: 1rem; }
.auth-switch { color: #999; text-align: center; }
.auth-switch a { color: #ff4444; }
</style>