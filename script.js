// Attendre que toute la page soit chargée avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function() {

    // =============================
    // Gestion de la bannière cookies
    // =============================
    const banner = document.getElementById("cookie-banner");
    const btn = document.getElementById("cookie-ok");

    if (localStorage.getItem("cookiesAccepted")) {
        banner.style.display = "none";
    }

    btn.addEventListener("click", function () {
        localStorage.setItem("cookiesAccepted", "true");
        banner.style.display = "none";
    });
    
    // =============================
    // Animation du titre principal (section .hero)
    // =============================
    const titre = document.querySelector('.hero h2');
    if (titre) { // vérifie que .hero h2 existe
        titre.classList.add('active');
        setTimeout(function () {
            const soustitre = document.querySelector('.hero p');
            if (soustitre) {
                soustitre.classList.add('active');
            }
        }, 800);
    }

    // =============================
    // Animation de la section News
    // =============================
    setTimeout(function() {
        const newsContainer = document.querySelector('.news-container');
        if (newsContainer) {
            newsContainer.classList.add('active'); // Applique l'effet estompé / transition
        }
    }, 500); // Délai avant l'apparition de la news

    // =============================
    // Animation des cercles “features” (Collège / Professions / Examens)
    // =============================
    setTimeout(function () {
        const features = document.querySelectorAll('.circle');
        features.forEach(function (circle, index) {
            setTimeout(function () {
                circle.classList.add('active'); // Active l'animation du cercle
            }, index * 500); // Décalage de 500ms entre chaque cercle
        });
    }, 1200); // Délai avant de commencer l'animation des cercles

    // =============================
    // Gestion du menu burger
    // =============================
    const burger = document.querySelector('.burger-menu');  // Bouton burger
    const menu = document.querySelector('.menu');           // Menu à afficher/masquer

    if (burger && menu) {
        // Toggle = si la classe existe, elle est retirée ; si elle n'existe pas, elle est ajoutée
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');  // Transforme le burger en croix
            menu.classList.toggle('active');    // Affiche ou masque le menu mobile
        });
    }
});

// Fonction pour filtrer les images d'un container donné (un <details>)
function filterImages(container) {
    const yearFilters = Array.from(container.querySelectorAll('.filter[data-filter^="20"]:checked'))
                             .map(cb => cb.getAttribute('data-filter') || '');
    const professionFilters = Array.from(container.querySelectorAll('.filter[data-filter="PMC"], .filter[data-filter="MPC"]:checked'))
                                   .map(cb => cb.getAttribute('data-filter') || '');
    const categoryFilters = Array.from(container.querySelectorAll('.filter[data-filter="FR"], .filter[data-filter="TO"], .filter[data-filter="AS"], .filter[data-filter="PN"]:checked'))
                                 .map(cb => cb.getAttribute('data-filter') || '');

    const images = container.querySelectorAll('.images img');

    // Masquer toutes les images si aucun filtre n'est sélectionné
    if (yearFilters.length === 0 && professionFilters.length === 0 && categoryFilters.length === 0) {
        images.forEach(img => img.style.display = 'none');
        return;
    }

    let anyVisible = false;

    images.forEach(img => {
        const matchesYear = yearFilters.length === 0 || yearFilters.some(filter => img.classList.contains(filter));
        const matchesProfession = professionFilters.length === 0 || professionFilters.some(filter => img.classList.contains(filter));
        const matchesCategory = categoryFilters.length === 0 || categoryFilters.some(filter => img.classList.contains(filter));

        if (matchesYear && matchesProfession && matchesCategory) {
            img.style.display = 'block';
            anyVisible = true;
        } else {
            img.style.display = 'none';
        }
    });

    // Afficher un message si aucune image n'est visible
    const existingMessage = container.querySelector('.images p.message');
    if (!anyVisible) {
        if (!existingMessage) {
            const message = document.createElement('p');
            message.textContent = "Aucun examen ne correspond à votre sélection";
            message.className = 'message';
            message.style.color = 'white'; // message en blanc
            container.querySelector('.images').appendChild(message);
        }
    } else if (existingMessage) {
        existingMessage.remove();
    }
}

// Fonction pour gérer l'état actif des labels
function toggleActiveState(container) {
    container.querySelectorAll('.dropdown-content label').forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

// Appliquer aux checkboxes de chaque details
document.querySelectorAll('.corner-container details').forEach(details => {
    details.querySelectorAll('.filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            filterImages(details);
            toggleActiveState(details);
        });
    });
});

// Sélectionne toutes les boîtes
const boites = document.querySelectorAll('.boite');

// Pour chacune, ajoute un clic qui redirige
boites.forEach(boite => {
    boite.style.cursor = 'pointer'; // Montre que c'est cliquable
    boite.addEventListener('click', () => {
        window.location.href = 'contact.html';
    });
});

// Pour afficher les news en page d'accueil
const news = [
    {
    date: "News: 24/09/2025",
    title: "Le calendrier 2026 est désormais en ligne",
    linkText: "En savoir plus",
    linkUrl: "calendar.html"
    },
    {
    date: "News: 18/02/2026",
    title: "La présentation de la séance d'informations candidats/FEE du 17 février 2026 peut désormais être téléchargée",
    linkText: "Présentation séance info",
    linkUrl: "https://kdrive.infomaniak.com/app/share/1859723/f7893d41-26b1-40f6-8c63-816d642bcfc8"
    },
    {
    date: "News: 19/02/2026",
    title: "La séance pour experts \"Start session d'examens\" du 25 février 2026 peut être suivie en ligne",
    linkText: "Lien Teams",
    linkUrl: "https://teams.microsoft.com/meet/34333854819918?p=2O4IJ4T0jgQgLRm70W"
    }
];

let currentIndex = 0;
let autoSlide;

// éléments DOM
const dateEl = document.getElementById("news-date");
const titleEl = document.getElementById("news-title");
const linkEl = document.getElementById("news-link");
const nextBtn = document.getElementById("next-news");
const prevBtn = document.getElementById("prev-news");
const newsItem = document.querySelector(".news-item");
const dotsContainer = document.getElementById("news-dots");

// --- création des points ---
function renderDots() {
  if (!dotsContainer) return;

  dotsContainer.innerHTML = "";
  news.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "news-dot" + (i === currentIndex ? " active" : "");
    dot.setAttribute("aria-label", `Aller à la news ${i + 1}`);

    dot.addEventListener("click", () => {
      currentIndex = i;
      showNews(currentIndex);
      resetAutoSlide();
    });

    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  if (!dotsContainer) return;

  dotsContainer.querySelectorAll(".news-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

// --- fonction fade JS-only ---
function fade(element, from, to, duration, callback) {
  const start = performance.now();

  function animate(time) {
    const progress = Math.min((time - start) / duration, 1);
    element.style.opacity = from + (to - from) * progress;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (callback) {
      callback();
    }
  }

  requestAnimationFrame(animate);
}

// --- affiche la news avec fondu ---
function showNews(index) {
  fade(newsItem, 1, 0, 300, () => {
	currentIndex = index;   // assure la synchro
	updateDots();  
	
    // mise à jour du contenu
    dateEl.textContent = news[index].date;
    titleEl.textContent = news[index].title;
    linkEl.textContent = news[index].linkText;
    linkEl.href = news[index].linkUrl;

    fade(newsItem, 0, 1, 300);
  });
}

// --- navigation ---
function nextNews() {
  currentIndex = (currentIndex + 1) % news.length;
  showNews(currentIndex);
}

function prevNews() {
  currentIndex = (currentIndex - 1 + news.length) % news.length;
  showNews(currentIndex);
}

// --- auto-rotation ---
function startAutoSlide() {
  autoSlide = setInterval(nextNews, 4000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

// --- événements boutons ---
nextBtn.addEventListener("click", () => {
  nextNews();
  resetAutoSlide();
});

prevBtn.addEventListener("click", () => {
  prevNews();
  resetAutoSlide();
});

// --- initialisation ---
newsItem.style.opacity = 1; // pour éviter un flash
renderDots();      // crée les points
showNews(currentIndex);
startAutoSlide();

