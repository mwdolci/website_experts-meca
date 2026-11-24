const calendarBody = document.getElementById('calendar-body');
const calendarCards = document.getElementById('calendar-cards');
const calendarTable = document.getElementById('calendar-table');

const btnCards = document.getElementById('btn-cards');
const btnTable = document.getElementById('btn-table');

const calendarRoles = {
    candidates: 'Candidats',
    trainers: 'Formateurs',
    experts: 'Experts',
    management: 'Management'
};

// Création d'un élément HTML
function createCalendarElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
}

// Formatage des dates
function formatCalendarDate(date, options) {
    return new Intl.DateTimeFormat('fr-FR', {
        ...options,
        timeZone: 'UTC'
    }).format(new Date(date + 'T00:00:00Z'));
}

// Première lettre en majuscule
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Formatage de la date d'un événement
function formatEventDate(event) {
    const full = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };

    let date = formatCalendarDate(event.startDate, full);

    if (event.endDate) {
        const startOptions =
            event.startDate.slice(0, 4) === event.endDate.slice(0, 4)
                ? { day: '2-digit', month: 'long' }
                : full;

        date = formatCalendarDate(event.startDate, startOptions)
            + ' - '
            + formatCalendarDate(event.endDate, full);
    }

    return event.provisional ? `(${date})` : date;
}

// Création du lien vers le lieu
function createLocationLink(event) {
    const link = document.createElement('a');

    link.href = event.locationUrl;
    link.textContent = event.location;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    return link;
}

// Création d'une cellule du tableau
function addCalendarCell(row, value, className) {
    const cell = row.insertCell();

    cell.textContent = value;

    if (className) cell.className = className;

    return cell;
}

// Affichage sous forme de tableau
function renderTable(events) {
    calendarBody.replaceChildren();

    for (const event of events) {
        const row = calendarBody.insertRow();

        const day = formatCalendarDate(event.startDate, {
            weekday: 'long'
        });

        addCalendarCell(row, formatEventDate(event));
        addCalendarCell(row, event.endDate ? '-' : capitalize(day));
        addCalendarCell(row, event.time || '-');
        addCalendarCell(row, event.title);

        const locationCell = addCalendarCell(
            row,
            event.location || '-'
        );

        if (event.locationUrl) {
            const link = createLocationLink(event);

            link.id = 'email-link';

            locationCell.replaceChildren(link);
        }

        for (const role of Object.keys(calendarRoles)) {
            addCalendarCell(
                row,
                event[role] ? '●' : '',
                event[role] ? 'checkbox-cell' : ''
            );
        }
    }
}

// Création d'une ligne d'information dans un pavé
function createCardInfo(icon, text) {
    const info = createCalendarElement(
        'div',
        'calendar-card-info'
    );

    const iconElement = createCalendarElement('i', icon);
    iconElement.setAttribute('aria-hidden', 'true');

    info.appendChild(iconElement);
    info.appendChild(createCalendarElement('span', '', text));

    return info;
}

// Création d'un pavé
function createCalendarCard(event) {
    const card = createCalendarElement(
        'article',
        'calendar-card'
    );

    // Date
    card.appendChild(createCalendarElement(
        'div',
        'calendar-card-date',
        formatEventDate(event)
    ));

    // Date provisoire
    if (event.provisional) {
        card.appendChild(createCalendarElement(
            'div',
            'calendar-provisional',
            'Date provisoire'
        ));
    }

    // Titre
    card.appendChild(createCalendarElement(
        'h3',
        'calendar-card-title',
        event.title
    ));

    // Heure
    if (event.time) {
        card.appendChild(createCardInfo(
            'far fa-clock',
            event.time
        ));
    }

    // Lieu
    if (event.location) {
        const location = createCardInfo(
            'fas fa-map-marker-alt',
            event.location
        );

        if (event.locationUrl) {
            location.lastElementChild.replaceWith(
                createLocationLink(event)
            );
        }

        card.appendChild(location);
    }

    // Badges des participants
    const badges = createCalendarElement(
        'div',
        'calendar-card-badges'
    );

    for (const [role, label] of Object.entries(calendarRoles)) {
        if (event[role]) {
            badges.appendChild(createCalendarElement(
                'span',
                `calendar-badge ${role}`,
                label
            ));
        }
    }

    card.appendChild(badges);

    return card;
}

// Affichage sous forme de pavés
function renderCards(events) {
    calendarCards.replaceChildren();

    let currentMonth = null;
    let grid = null;

    for (const event of events) {
        const month = event.startDate.slice(0, 7);

        // Création d'une nouvelle section mensuelle
        if (month !== currentMonth) {
            currentMonth = month;

            const section = createCalendarElement(
                'section',
                'calendar-month'
            );

            const monthTitle = formatCalendarDate(
                event.startDate,
                {
                    month: 'long',
                    year: 'numeric'
                }
            );

            section.appendChild(createCalendarElement(
                'h2',
                'calendar-month-title',
                capitalize(monthTitle)
            ));

            grid = createCalendarElement(
                'div',
                'calendar-grid'
            );

            section.appendChild(grid);
            calendarCards.appendChild(section);
        }

        grid.appendChild(createCalendarCard(event));
    }
}

// Changement du mode d'affichage
function setCalendarView(view) {
    const isCards = view !== 'table';

    calendarCards.hidden = !isCards;
    calendarTable.hidden = isCards;

    btnCards.classList.toggle('active', isCards);
    btnTable.classList.toggle('active', !isCards);

    btnCards.setAttribute('aria-pressed', String(isCards));
    btnTable.setAttribute('aria-pressed', String(!isCards));

    // Mémorisation de la préférence
    try {
        if (!window.matchMedia('(max-width: 600px)').matches) {
            savedView = isCards ? 'cards' : 'table';
            localStorage.setItem('calendarView', savedView);
        };
    } catch (error) {
        // L'affichage reste fonctionnel sans stockage local.
    }
}

// Chargement du calendrier
async function loadCalendar() {
    try {
        const response = await fetch('data/calendar.json', {
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const events = await response.json();

        // Tri chronologique
        events.sort((a, b) =>
            a.startDate.localeCompare(b.startDate)
        );

        // Génération des deux affichages
        renderTable(events);
        renderCards(events);

    } catch (error) {
        console.error(
            'Erreur de chargement du calendrier :',
            error
        );

        const message = 'Impossible de charger le calendrier.';

        calendarCards.textContent = message;
        calendarBody.replaceChildren();

        const cell = calendarBody.insertRow().insertCell();

        cell.colSpan = 9;
        cell.textContent = message;
    }
}

// Événements des boutons
btnCards.addEventListener('click', () => {
    setCalendarView('cards');
});

btnTable.addEventListener('click', () => {
    setCalendarView('table');
});

// Récupération de la préférence
let savedView = 'cards';

try {
    savedView = localStorage.getItem('calendarView') || 'cards';
} catch (error) {
    // Affichage par défaut sous forme de pavés.
}

// Détection du format smartphone
const smartphone = window.matchMedia('(max-width: 600px)');

// Adaptation du mode d'affichage
function updateCalendarView() {
    if (smartphone.matches) {
        setCalendarView('cards');
    } else {
        setCalendarView(savedView);
    }
}

// Détection du changement de taille d'écran
smartphone.addEventListener('change', updateCalendarView);

// Initialisation
updateCalendarView();
loadCalendar();