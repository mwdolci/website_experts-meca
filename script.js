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

// Fonction pour filtrer les images
        function filterImages() {
            const yearFilters = Array.from(document.querySelectorAll('.filter[data-filter^="20"]:checked')).map(cb => cb.getAttribute('data-filter') || '');
            const professionFilters = Array.from(document.querySelectorAll('.filter[data-filter="PMC"], .filter[data-filter="MPC"]:checked')).map(cb => cb.getAttribute('data-filter') || '');
            const categoryFilters = Array.from(document.querySelectorAll('.filter[data-filter="FR"], .filter[data-filter="TO"], .filter[data-filter="AS"], .filter[data-filter="PN"]:checked')).map(cb => cb.getAttribute('data-filter') || '');
    
            const images = document.querySelectorAll('.images img');
    
            // Si aucun filtre n'est sélectionné, masquer toutes les images
            if (yearFilters.length === 0 && professionFilters.length === 0 && categoryFilters.length === 0) {
                images.forEach(img => img.style.display = 'none');
                return; // Fin de la fonction, rien n'est visible
            }
    
            let anyVisible = false;
    
            images.forEach(img => {
                const matchesYear = yearFilters.length === 0 || yearFilters.some(filter => img.classList.contains(filter));
                const matchesProfession = professionFilters.length === 0 || professionFilters.some(filter => img.classList.contains(filter));
                const matchesCategory = categoryFilters.length === 0 || categoryFilters.some(filter => img.classList.contains(filter));
    
                if (matchesYear && matchesProfession && matchesCategory) {
                    img.style.display = 'block';
                    anyVisible = true; // Indiquer qu'au moins une image est visible
                } else {
                    img.style.display = 'none';
                }
            });
    
            // Afficher un message si aucune image n'est visible
            const existingMessage = document.querySelector('.images p.message');
            if (!anyVisible) {
                if (!existingMessage) {
                    const message = document.createElement('p');
                    message.textContent = "Aucune image ne correspond à vos filtres.";
                    message.className = 'message';
                    document.querySelector('.images').appendChild(message);
                }
            } else {
                if (existingMessage) {
                    existingMessage.remove(); // Supprimer le message si des images sont visibles
                }
            }
        }
    
        function toggleActiveState() {
            document.querySelectorAll('.dropdown-content label').forEach(label => {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox.checked) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
    
        document.querySelectorAll('.filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                filterImages();
                toggleActiveState();
            });
        });
