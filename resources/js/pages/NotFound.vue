<template>
    <div class="error-page">
        <div class="error-content">
            <img src="/images/404.png" alt="Страница не найдена" class="error-image" @error="handleImageError">
            <h1>Страница не найдена</h1>
            <p>Извините, но такой страницы не существует. Возможно, она была удалена или вы ввели неправильный адрес.</p>
            <router-link to="/" class="btn-home">Вернуться на главную</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFoundPage',
    methods: {
        handleImageError(event) {
            event.target.style.display = 'none'
        }
    }
}
</script>

<style scoped>
.error-page {
    background: #fff;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;
}
.error-image {
    max-width: 400px;
    width: 100%;
    margin-bottom: 30px;
}
.error-content h2 {
    font-family: 'Zen Antique', serif;
    font-size: 32px;
    color: #000;
    margin-bottom: 15px;
}
.error-content p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
}
.btn-home {
    display: inline-block;
    padding: 16px 40px;
    background: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
}
.btn-home:hover { background: #333; }
</style>