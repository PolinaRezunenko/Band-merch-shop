<template>
    <div class="contacts-page">
        <div class="contacts-container">
            <Breadcrumbs :items="[{ label: 'Контакты', link: null }]" />
            
            <h1>Контакты</h1>
            
            <div class="contacts-layout">
                <!-- Контактная информация -->
                <div class="contacts-info">
                    <h2>Свяжитесь с нами</h2>
                    <p>Есть вопросы о товарах, доставке или хотите предложить сотрудничество? Напишите нам!</p>
                    
                    <div class="contact-items">
                        <div class="contact-item">
                            <span class="contact-icon">📧</span>
                            <div>
                                <strong>Email</strong>
                                <p>support@bmth-store.ru</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📱</span>
                            <div>
                                <strong>Telegram / VK</strong>
                                <p>@bmth_store</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📍</span>
                            <div>
                                <strong>Адрес</strong>
                                <p>г. Владивосток, ул. Примерная, д. 1</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Форма обратной связи -->
                <div class="contacts-form">
                    <h2>Форма обратной связи</h2>
                    
                    <div v-if="success" class="success-message">
                        ✅ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.
                    </div>
                    
                    <form @submit.prevent="submitForm">
                        <div class="form-group">
                            <label>Имя *</label>
                            <input v-model="form.name" type="text" placeholder="Ваше имя" required>
                        </div>
                        <div class="form-group">
                            <label>Email *</label>
                            <input v-model="form.email" type="email" placeholder="your@email.com" required>
                        </div>
                        <div class="form-group">
                            <label>Сообщение *</label>
                            <textarea v-model="form.message" rows="5" placeholder="Ваше сообщение..." required></textarea>
                        </div>
                        <button type="submit" :disabled="loading">
                            {{ loading ? 'Отправка...' : 'Отправить сообщение' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <DiscountBanner />
    </div>
</template>

<script>
import { supabase } from '../config/supabase'
import { inject } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import DiscountBanner from '../components/DiscountBanner.vue'

export default {
    name: 'ContactsPage',
    components: { Breadcrumbs, DiscountBanner },
    inject: ['notify'],
    data() {
        return {
            form: { name: '', email: '', message: '' },
            loading: false,
            success: false
        }
    },
    methods: {
        async submitForm() {
            if (!this.form.name || !this.form.email || !this.form.message) return
            
            this.loading = true
            try {
                const { error } = await supabase.from('feedback').insert({
                    name: this.form.name,
                    email: this.form.email,
                    message: this.form.message
                })
                
                if (error) throw error
                
                this.success = true
                this.form = { name: '', email: '', message: '' }
                if (this.notify) this.notify.success('Отправлено!', 'Сообщение успешно отправлено')
                
                setTimeout(() => { this.success = false }, 5000)
            } catch (err) {
                if (this.notify) this.notify.error('Ошибка', 'Не удалось отправить сообщение')
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.contacts-page { background: #fff; min-height: 100vh; }
.contacts-container { max-width: 1200px; margin: 0 auto;  }

h1 {
     font-family: 'Raleway', sans-serif; 
    color: #0a0a0a; 
    margin-top: 30px;
    margin-bottom: 30px; 
    font-size: 48px; 
}

.contacts-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    margin-bottom: 60px;
}

h2 {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    color: #000;
    margin-bottom: 20px;
    font-weight: 600;
}

.contacts-info p {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 30px;
}

.contact-items {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.contact-item {
    display: flex;
    gap: 15px;
    align-items: flex-start;
}

.contact-icon {
    font-size: 28px;
    flex-shrink: 0;
}

.contact-item strong {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #000;
    margin-bottom: 5px;
}

.contact-item p {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #666;
    margin: 0;
}

/* Форма */
.contacts-form {
    background: #f9f9f9;
    padding: 40px;
    border-radius: 12px;
}

.success-message {
    background: #e6ffe6;
    color: #008000;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s;
    resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: #000;
}

button[type="submit"] {
    width: 100%;
    padding: 16px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: background 0.3s;
}

button[type="submit"]:hover { background: #333; }
button[type="submit"]:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 768px) {
    .contacts-layout { grid-template-columns: 1fr; gap: 40px; }
    .contacts-form { padding: 25px; }
}
</style>