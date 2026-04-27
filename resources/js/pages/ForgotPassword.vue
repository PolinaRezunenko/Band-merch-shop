<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <h1>Забыли пароль?</h1>
                <p class="forgot-text">Введите E-Mail Вашей учетной записи. Нажмите кнопку Продолжить, чтобы получить пароль по электронной почте.</p>
                <form @submit.prevent="resetPassword">
                    <input type="email" v-model="email" placeholder="E-mail" required>
                    <button type="submit" class="btn-auth">Продолжить</button>
                </form>
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
    name: 'ForgotPasswordPage',
    components: { PopularProducts, DiscountBanner },
    data() { return { email: '' } },
    methods: {
        resetPassword() { alert('Письмо отправлено!') }
    }
}
</script>

<style scoped>
.auth-page { background: #0a0a0a; min-height: 100vh; }
.auth-container { max-width: 450px; margin: 0 auto; padding: 4rem 2rem; }
.auth-card { background: #1a1a1a; padding: 2.5rem; border-radius: 12px; }
.auth-card h1 { color: #fff; text-align: center; margin-bottom: 1rem; font-size: 1.8rem; }
.forgot-text { color: #999; text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.5; }
.auth-card input { width: 100%; padding: 0.9rem; margin-bottom: 1rem; background: #0a0a0a; border: 1px solid #333; color: #fff; border-radius: 6px; }
.btn-auth { width: 100%; padding: 0.9rem; background: #ff4444; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; }
</style>