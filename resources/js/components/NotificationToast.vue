<template>
    <Teleport to="body">
        <div class="toast-container">
            <transition-group name="notification">
                <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    :class="['notification-toast', `notification-toast--${notification.type}`]"
                >
                    <div class="notification-content">
                        <div class="notification-icon">
                            <span v-if="notification.type === 'success'">✓</span>
                            <span v-if="notification.type === 'error'">✗</span>
                            <span v-if="notification.type === 'info'">ℹ</span>
                        </div>
                        <div class="notification-body">
                            <h4 class="notification-title">{{ notification.title }}</h4>
                            <p class="notification-message">{{ notification.message }}</p>
                        </div>
                        <button class="notification-close" @click="remove(notification.id)">×</button>
                    </div>
                </div>
            </transition-group>
        </div>
    </Teleport>
</template>

<script>
import { ref } from 'vue'

const notifications = ref([])
let idCounter = 0

export default {
    name: 'NotificationToast',
    setup() {
        const remove = (id) => {
            const index = notifications.value.findIndex(n => n.id === id)
            if (index !== -1) notifications.value.splice(index, 1)
        }

        const show = (options) => {
            const id = ++idCounter
            notifications.value.unshift({
                id,
                type: options.type || 'success',
                title: options.title || '',
                message: options.message || '',
                duration: options.duration || 4000
            })
            if (options.duration !== 0) {
                setTimeout(() => remove(id), options.duration || 4000)
            }
        }

        const success = (title, message) => show({ type: 'success', title, message })
        const error = (title, message) => show({ type: 'error', title, message })
        const info = (title, message) => show({ type: 'info', title, message })

        // ВАЖНО! Экспортируем методы для ref
        return { notifications, remove, success, error, info }
    }
}
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.notification-toast {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    border-left: 4px solid;
    min-width: 320px;
    max-width: 450px;
    pointer-events: auto;
    font-family: 'Inter', sans-serif;
}

.notification-content {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.notification-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
}

.notification-body { flex: 1; }

.notification-title {
    font-weight: 600;
    color: #292966;
    font-size: 16px;
    margin: 0 0 5px 0;
}

.notification-message {
    color: #666;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
}

.notification-close {
    background: none;
    border: none;
    font-size: 20px;
    color: #999;
    cursor: pointer;
    flex-shrink: 0;
}

/* Colors */
.notification-toast--success { border-color: #10b981; }
.notification-toast--success .notification-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.notification-toast--error { border-color: #ef4444; }
.notification-toast--error .notification-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.notification-toast--info { border-color: #3b82f6; }
.notification-toast--info .notification-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

/* Animations */
.notification-enter-active { transition: all 0.5s ease; }
.notification-leave-active { transition: all 0.3s ease; }
.notification-enter-from { opacity: 0; transform: translateX(100%); }
.notification-leave-to { opacity: 0; transform: translateX(100%); }
</style>