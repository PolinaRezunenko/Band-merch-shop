<template>
  <Transition name="modal">
    <div v-if="isVisible" class="auth-modal-overlay" @click="closeModal">
      <div class="auth-modal-container" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        
        <div class="auth-modal-content">
          <div class="auth-tabs">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'register' }"
              @click="activeTab = 'register'"
            >
              Регистрация
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'login' }"
              @click="activeTab = 'login'"
            >
              Вход
            </button>
          </div>

          <!-- Форма регистрации -->
          <div v-if="activeTab === 'register'" class="auth-form">
            <div class="form-group">
              <label>E-mail *</label>
              <input 
                v-model="registerData.email" 
                type="email" 
                class="form-input"
                :class="{ error: fieldErrors.email }"
                placeholder="your@email.com"
              >
              <span v-if="fieldErrors.email" class="error-text">{{ fieldErrors.email }}</span>
            </div>
            
            <div class="form-group">
              <label>Пароль *</label>
              <input 
                v-model="registerData.password" 
                type="password" 
                class="form-input"
                :class="{ error: fieldErrors.password }"
                placeholder="Пароль (мин. 6 символов)"
              >
              <span v-if="fieldErrors.password" class="error-text">{{ fieldErrors.password }}</span>
            </div>
            
            <div class="form-group">
              <label>Повторите пароль *</label>
              <input 
                v-model="registerData.confirmPassword" 
                type="password" 
                class="form-input"
                :class="{ error: fieldErrors.confirmPassword }"
                placeholder="Повторите пароль"
              >
              <span v-if="fieldErrors.confirmPassword" class="error-text">{{ fieldErrors.confirmPassword }}</span>
            </div>
            
            <!-- Опциональные поля -->
            <div class="optional-fields">
              <button type="button" class="show-optional-btn" @click="showOptional = !showOptional">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :style="{ transform: showOptional ? 'rotate(180deg)' : 'rotate(0deg)' }">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ showOptional ? 'Скрыть' : 'Имя, фамилия, телефон (необязательно)' }}
              </button>
              
              <div v-if="showOptional" class="optional-fields-content">
                <!-- Имя - отдельно -->
                <div class="form-group">
                  <label>Имя</label>
                  <input v-model="registerData.firstName" type="text" class="form-input" placeholder="Имя">
                </div>
                <!-- Фамилия - отдельно -->
                <div class="form-group">
                  <label>Фамилия</label>
                  <input v-model="registerData.lastName" type="text" class="form-input" placeholder="Фамилия">
                </div>
                <!-- Телефон -->
                <div class="form-group">
                  <label>Телефон</label>
                  <div class="phone-input">
                    <span class="phone-prefix">+7</span>
                    <input v-model="registerData.phone" type="tel" class="form-input" placeholder="(999) 999-99-99" @input="formatPhone">
                  </div>
                </div>
              </div>
            </div>
            
            <button class="submit-btn" @click="handleRegister" :disabled="registerLoading">
              <span v-if="registerLoading" class="spinner"></span>
              {{ registerLoading ? 'Секунду...' : 'Зарегистрироваться' }}
            </button>
          </div>

          <!-- Форма входа -->
          <div v-if="activeTab === 'login'" class="auth-form">
            <div class="form-group">
              <label>E-mail</label>
              <input v-model="loginData.email" type="email" class="form-input" :class="{ error: fieldErrors.loginEmail }" placeholder="E-mail">
              <span v-if="fieldErrors.loginEmail" class="error-text">{{ fieldErrors.loginEmail }}</span>
            </div>
            
            <div class="form-group">
              <label>Пароль</label>
              <input v-model="loginData.password" type="password" class="form-input" :class="{ error: fieldErrors.loginPassword }" placeholder="Пароль">
              <span v-if="fieldErrors.loginPassword" class="error-text">{{ fieldErrors.loginPassword }}</span>
            </div>
            
            <button class="submit-btn" @click="handleLogin" :disabled="loginLoading">
              <span v-if="loginLoading" class="spinner"></span>
              {{ loginLoading ? 'Секунду...' : 'Войти' }}
            </button>
            
            <div class="login-footer">
              <a href="#" class="forgot-password" @click.prevent="openForgotPassword">Забыли пароль?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Модальное окно "Забыли пароль" -->
  <Transition name="modal">
    <div v-if="showForgotPassword" class="auth-modal-overlay" @click="closeForgotPassword">
      <div class="auth-modal-container forgot-password-modal" @click.stop>
        <button class="close-btn" @click="closeForgotPassword">×</button>
        <div class="auth-modal-content">
          <h3>Забыли пароль?</h3>
          <p class="forgot-password-text">Введите E-Mail Вашей учетной записи.</p>
          <div class="form-group">
            <label>E-mail</label>
            <input v-model="forgotPasswordEmail" type="email" class="form-input" placeholder="E-mail">
          </div>
          <button class="submit-btn" @click="handleForgotPassword" :disabled="forgotPasswordLoading">
            {{ forgotPasswordLoading ? 'Отправка...' : 'Продолжить' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, reactive, inject } from 'vue'
import { supabase } from '../config/supabase'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AuthModal',
  props: { isVisible: { type: Boolean, default: false } },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const activeTab = ref('register')
    const showOptional = ref(false)
    const authStore = useAuthStore()
    const notify = inject('notify', { success: alert, error: alert, info: alert })
    
    const registerData = reactive({
      firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
    })
    const loginData = reactive({ email: '', password: '' })
    const forgotPasswordEmail = ref('')
    
    const registerLoading = ref(false)
    const loginLoading = ref(false)
    const forgotPasswordLoading = ref(false)
    const showForgotPassword = ref(false)
    
    const fieldErrors = reactive({
      email: '', password: '', confirmPassword: '',
      loginEmail: '', loginPassword: ''
    })

    const clearErrors = () => {
      Object.keys(fieldErrors).forEach(k => fieldErrors[k] = '')
    }

    const validateRegister = () => {
      clearErrors()
      let valid = true
      
      if (!registerData.email.trim()) {
        fieldErrors.email = 'Введите email'
        valid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
        fieldErrors.email = 'Некорректный email'
        valid = false
      }
      
      if (!registerData.password) {
        fieldErrors.password = 'Введите пароль'
        valid = false
      } else if (registerData.password.length < 6) {
        fieldErrors.password = 'Минимум 6 символов'
        valid = false
      }
      
      if (registerData.password !== registerData.confirmPassword) {
        fieldErrors.confirmPassword = 'Пароли не совпадают'
        valid = false
      }
      
      return valid
    }

    const validateLogin = () => {
      clearErrors()
      let valid = true
      
      if (!loginData.email.trim()) {
        fieldErrors.loginEmail = 'Введите email'
        valid = false
      }
      
      if (!loginData.password) {
        fieldErrors.loginPassword = 'Введите пароль'
        valid = false
      }
      
      return valid
    }

    const closeModal = () => {
      clearErrors()
      emit('close')
    }

    const openForgotPassword = () => {
      showForgotPassword.value = true
    }

    const closeForgotPassword = () => {
      showForgotPassword.value = false
    }

    const formatPhone = (event) => {
      let value = registerData.phone.replace(/\D/g, '')
      if (value.length > 10) value = value.slice(0, 10)
      let formatted = ''
      for (let i = 0; i < value.length; i++) {
        if (i === 0) formatted += '('
        if (i === 3) formatted += ') '
        if (i === 6) formatted += '-'
        if (i === 8) formatted += '-'
        formatted += value[i]
      }
      registerData.phone = formatted
    }

    const handleRegister = async () => {
      if (!validateRegister()) return
      
      registerLoading.value = true
      try {
        const { data, error } = await supabase.auth.signUp({
          email: registerData.email,
          password: registerData.password,
          options: {
            data: {
              first_name: registerData.firstName || '',
              last_name: registerData.lastName || '',
              phone: registerData.phone || ''
            }
          }
        })
        
        if (error) {
          if (error.message.includes('already')) {
            fieldErrors.email = 'Этот email уже зарегистрирован'
            notify.error('Ошибка', 'Email уже используется')
          } else {
            notify.error('Ошибка', error.message)
          }
          return
        }
        
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: registerData.email,
              first_name: registerData.firstName || '',
              last_name: registerData.lastName || '',
              phone: registerData.phone || '',
              created_at: new Date().toISOString()
            })
          
          if (profileError) {
            console.error('Ошибка сохранения профиля:', profileError)
          }
          
          if (data.session) {
            authStore.user = data.user
            await authStore.loadProfile()
            notify.success('Добро пожаловать!', 'Регистрация успешна')
            emit('success')
            closeModal()
          } else {
            notify.success('Подтвердите email!', 'Письмо отправлено на ваш адрес')
            activeTab.value = 'login'
          }
        }
        
        registerData.email = ''
        registerData.password = ''
        registerData.confirmPassword = ''
        registerData.firstName = ''
        registerData.lastName = ''
        registerData.phone = ''
        showOptional.value = false
        
      } catch (err) {
        console.error('Ошибка регистрации:', err)
        notify.error('Ошибка', 'Попробуйте позже')
      } finally {
        registerLoading.value = false
      }
    }

    const handleLogin = async () => {
      if (!validateLogin()) return
      
      loginLoading.value = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password
        })
        
        if (error) {
          notify.error('Ошибка', 'Неверный email или пароль')
          return
        }
        
        authStore.user = data.user
        await authStore.loadProfile()
        
        notify.success('Добро пожаловать!', `Вы вошли как ${data.user.email}`)
        emit('success')
        closeModal()
        
        loginData.email = ''
        loginData.password = ''
        
      } catch (err) {
        notify.error('Ошибка', 'Попробуйте позже')
      } finally {
        loginLoading.value = false
      }
    }

    const handleForgotPassword = async () => {
      if (!forgotPasswordEmail.value) {
        notify.error('Ошибка', 'Введите email')
        return
      }
      
      forgotPasswordLoading.value = true
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail.value)
        if (error) throw error
        notify.success('Готово!', 'Инструкция отправлена на email')
        closeForgotPassword()
        forgotPasswordEmail.value = ''
      } catch (err) {
        notify.error('Ошибка', 'Не удалось отправить')
      } finally {
        forgotPasswordLoading.value = false
      }
    }

    return {
      activeTab,
      showOptional,
      registerData,
      loginData,
      forgotPasswordEmail,
      registerLoading,
      loginLoading,
      forgotPasswordLoading,
      showForgotPassword,
      fieldErrors,
      closeModal,
      openForgotPassword,
      closeForgotPassword,
      formatPhone,
      handleRegister,
      handleLogin,
      handleForgotPassword
    }
  }
}
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.auth-modal-container {
  background: white;
  border-radius: 12px;
  position: relative;
  max-width: 450px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.auth-modal-content {
  padding: 40px;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #000;
}

.auth-tabs {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 30px;
}

.tab-btn {
  flex: 1;
  padding: 12px 0;
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #000;
}

.tab-btn.active {
  color: #000;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #000;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
}

.form-input.error {
  border-color: #f44336;
  background-color: #fff5f5;
}

.error-text {
  font-size: 12px;
  color: #f44336;
}

.optional-fields {
  margin-top: 5px;
}

.show-optional-btn {
  background: none;
  border: none;
  color: #888;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  transition: color 0.2s ease;
}

.show-optional-btn:hover {
  color: #000;
}

.optional-fields-content {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.phone-input {
  display: flex;
  align-items: center;
}

.phone-prefix {
  padding: 12px 12px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
}

.phone-input .form-input {
  border-radius: 0 8px 8px 0;
  flex: 1;
}

.submit-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #333;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}

.forgot-password {
  color: #888;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #000;
  text-decoration: underline;
}

.forgot-password-modal .auth-modal-content h3 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: #000;
  margin-bottom: 16px;
  text-align: center;
}

.forgot-password-text {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 25px;
  text-align: center;
}

@media (max-width: 768px) {
  .auth-modal-content {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .auth-modal-container {
    max-width: 95%;
  }
  
  .auth-modal-content {
    padding: 25px 15px;
  }
  
  .tab-btn {
    font-size: 14px;
    padding: 10px 0;
  }
  
  .form-input {
    padding: 10px 12px;
    font-size: 14px;
  }
}
</style>