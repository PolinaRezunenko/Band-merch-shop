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
                            <span class="contact-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                    <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                </svg>
                            </span>
                            <div>
                                <strong>Email</strong>
                                <p>support@bmth-store.ru</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 16.92V19C22.001 19.4956 21.8843 19.9845 21.6605 20.423C21.4366 20.8615 21.1121 21.2357 20.7158 21.5118C20.3195 21.7879 19.8643 21.9571 19.3875 22.0047C18.9108 22.0523 18.4289 21.9767 17.99 21.784C10.49 18.9 5.10001 13.51 2.22001 6.01C2.0275 5.57102 1.95199 5.0891 1.99967 4.61235C2.04736 4.1356 2.21663 3.68052 2.49284 3.28425C2.76905 2.88798 3.14337 2.56359 3.58201 2.33983C4.02065 2.11606 4.5097 1.9995 5.00501 2.00001H7.00501C7.74499 1.99346 8.45693 2.30655 8.96301 2.8628C9.46909 3.41905 9.72278 4.16241 9.66001 4.90501C9.51846 6.61514 9.09199 8.28617 8.40001 9.86001" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                </svg>
                            </span>
                            <div>
                                <strong>Telegram / VK</strong>
                                <p>@bmth_store</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                    <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                </svg>
                            </span>
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
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="#008000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Сообщение отправлено! Мы свяжемся с вами в ближайшее время.
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
.contacts-container { max-width: 1200px; margin: 0 auto; }

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
    flex-shrink: 0;
}

.contact-icon svg {
    stroke: #000;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
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

@media (max-width: 1024px) { .contacts-container { padding: 40px 20px; } }
@media (max-width: 780px) { .contacts-container { padding: 30px 20px; } }
@media (max-width: 480px) { .contacts-container { padding: 20px 15px; } }

@media (max-width: 768px) {
    .contacts-layout { grid-template-columns: 1fr; gap: 40px; }
    .contacts-form { padding: 25px; }
    h1 { font-size: 32px; }
}

@media (max-width: 390px) {
    h1 { font-size: 28px; }
    .contacts-form { padding: 20px; }
    .contact-item { gap: 10px; }
    .contact-icon svg { width: 22px; height: 22px; }
}
</style>