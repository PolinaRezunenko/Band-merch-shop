<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="yandex-verification" content="27622861081903f0" />
    <meta name="google-site-verification" content="I50gTttvk0JY30gp9V62BFDN0JFtUVxrX96iYRoUWyg" />

    <link rel="preload" href="/images/hero-bg.png" as="image">
    <link rel="preload" href="/images/catalog-hero-bg.png" as="image">
    <link rel="preload" href="/images/discount-bg.png" as="image">
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
    

 <title>BMTH Store</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="app"></div>
</body>
</html>