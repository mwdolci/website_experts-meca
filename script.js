document.addEventListener('DOMContentLoaded', function() {
        const titre = document.querySelector('.hero h2');
        titre.classList.add('active');
        setTimeout(function () {
            const soustitre = document.querySelector('.hero p');
            soustitre.classList.add('active');
        }, 800);

        // Ajout de l'effet estompé à la section news
        setTimeout(function() {
            const newsContainer = document.querySelector('.news-container');
            newsContainer.classList.add('active');
        }, 500); // Délai après lequel l'effet doit s'appliquer (ajustable)

        setTimeout(function () {
            const features = document.querySelectorAll('.circle');
            features.forEach(function (circle, index) {
                setTimeout(function () {
                    circle.classList.add('active');
                }, index * 500); // Ajoute un délai de 400ms entre chaque élément
            });
        }, 1200);

        const burger = document.querySelector('.burger-menu');
        const menu = document.querySelector('.menu');

        if (burger && menu) {
            burger.addEventListener('click', () => {
                burger.classList.toggle('active');
                menu.classList.toggle('active');
            });
        }
    });
