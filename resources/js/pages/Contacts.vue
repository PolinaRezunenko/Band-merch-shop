<template>
    <div class="page">
        <div class="container">
            <h1>Контакты</h1>
            <form @submit.prevent="sendMessage">
                <input v-model="name" placeholder="Имя" required>
                <input v-model="email" placeholder="E-mail" type="email" required>
                <textarea v-model="message" placeholder="Сообщение" rows="5" required></textarea>
                <button type="submit">Отправить</button>
            </form>
            <div class="contact-info">
                <p>📧 support@bandmerch.ru</p>
                <p>📞 +7 (999) 123-45-67</p>
            </div>
        </div>
        <DiscountBanner />
    </div>
</template>

<script>
import DiscountBanner from '../components/DiscountBanner.vue'
export default {
    name: 'ContactsPage',
    components: { DiscountBanner },
    data() { return { name: '', email: '', message: '' } },
    methods: {
        sendMessage() { alert('Сообщение отправлено!'); this.name = ''; this.email = ''; this.message = ''; }
    }
}
</script>

<style scoped>
.page { background: #0a0a0a; min-height: 100vh; }
.container { max-width: 600px; margin: 0 auto; padding: 3rem 2rem; }
.container h1 { color: #fff; margin-bottom: 2rem; }
input, textarea { width: 100%; padding: 0.8rem; margin-bottom: 1rem; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 6px; }
button { background: #ff4444; color: #fff; border: none; padding: 0.9rem 2rem; border-radius: 6px; cursor: pointer; font-weight: 600; }
.contact-info { margin-top: 2rem; color: #999; }
.contact-info p { margin-bottom: 0.5rem; }
</style>