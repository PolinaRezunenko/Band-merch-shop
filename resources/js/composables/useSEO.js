import { watch } from 'vue'
import { useRoute } from 'vue-router'

export function useSEO() {
    const route = useRoute()

    const seo = {
        '/': {
            title: 'BMTH Store — Официальный мерч Bring Me The Horizon',
            description: 'Купить официальный мерч Bring Me The Horizon: футболки, худи, аксессуары, винил и CD-диски. Доставка по России.'
        },
        '/catalog': {
            title: 'Каталог мерча — BMTH Store',
            description: 'Каталог брендированной продукции BMTH. Футболки, худи, аксессуары, винил и CD-диски.'
        },
        '/cart': {
            title: 'Корзина — BMTH Store',
            description: 'Ваша корзина в интернет-магазине мерча BMTH. Оформите заказ онлайн.'
        },
        '/checkout': {
            title: 'Оформление заказа — BMTH Store',
            description: 'Оформление заказа мерча BMTH: выбор доставки и оплаты.'
        },
        '/profile': {
            title: 'Личный кабинет — BMTH Store',
            description: 'Личный кабинет покупателя: история заказов, профиль, смена пароля.'
        },
        '/favorites': {
            title: 'Избранное — BMTH Store',
            description: 'Избранные товары в магазине мерча Bring Me The Horizon.'
        },
        '/contacts': {
            title: 'Контакты — BMTH Store',
            description: 'Свяжитесь с нами по любым вопросам о мерче BMTH.'
        },
        '/about': {
            title: 'О нас — BMTH Store',
            description: 'Информация о магазине официального мерча Bring Me The Horizon.'
        },
        '/admin': {
            title: 'Админ-панель — BMTH Store',
            description: 'Управление заказами, товарами и пользователями магазина BMTH Store.'
        },
        '/forbidden': {
            title: '403 — Доступ запрещен — BMTH Store',
            description: 'У вас недостаточно прав для просмотра этой страницы.'
        }
    }

    function updateMeta(path) {
        const data = seo[path]
        if (data) {
            document.title = data.title
            
            let meta = document.querySelector('meta[name="description"]')
            if (!meta) {
                meta = document.createElement('meta')
                meta.setAttribute('name', 'description')
                document.head.appendChild(meta)
            }
            meta.setAttribute('content', data.description)
        }
    }

    watch(() => route.path, (path) => updateMeta(path), { immediate: true })
}