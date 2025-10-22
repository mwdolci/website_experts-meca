document.addEventListener('DOMContentLoaded', function() {
    // Menu navigation smartphone
    document.querySelector('.burger-menu').addEventListener('click', function () {
        document.querySelector('.menu').classList.toggle('active');
        this.classList.toggle('active');
    });

    const news = [
        {
            title: 'Titre de la nouvelle 1',
            description: 'Description de la nouvelle 1...',
            link: '#'
        },
        {
            title: 'Titre de la nouvelle 2',
            description: 'Description de la nouvelle 2...',
            link: '#'
        },
        {
            title: 'Titre de la nouvelle 3',
            description: 'Description de la nouvelle 3...',
            link: '#'
        }
    ];

    let currentNewsIndex = 0;

    const titleElement = document.getElementById('news-title');
    const descriptionElement = document.getElementById('news-description');
    const linkElement = document.getElementById('news-link');

    function updateNews() {
        const currentNews = news[currentNewsIndex];
        titleElement.textContent = currentNews.title;
        descriptionElement.textContent = currentNews.description;
        linkElement.href = currentNews.link;
    }

    document.getElementById('prev-news').addEventListener('click', function() {
        currentNewsIndex = (currentNewsIndex > 0) ? currentNewsIndex - 1 : news.length - 1;
        updateNews();
    });

    document.getElementById('next-news').addEventListener('click', function() {
        currentNewsIndex = (currentNewsIndex < news.length - 1) ? currentNewsIndex + 1 : 0;
        updateNews();
    });

    // Initial load
    updateNews();
});
