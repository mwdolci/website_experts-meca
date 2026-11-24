const calendarBody = document.getElementById('calendar-body');

// Les dates sont interprétées en UTC pour éviter les décalages de jour.
function formatCalendarDate(date, options) {
    return new Intl.DateTimeFormat('fr-FR', {
        ...options,
        timeZone: 'UTC'
    }).format(new Date(date + 'T00:00:00Z'));
}

function formatEventDate(event) {
    const full = { day: '2-digit', month: 'long', year: 'numeric' };
    let date = formatCalendarDate(event.startDate, full);

    if (event.endDate) {
        const startOptions = event.startDate.slice(0, 4) === event.endDate.slice(0, 4)
            ? { day: '2-digit', month: 'long' }
            : full;

        date = formatCalendarDate(event.startDate, startOptions)
            + ' - ' + formatCalendarDate(event.endDate, full);
    }

    return event.provisional ? `(${date})` : date;
}

function addCalendarCell(row, value, className) {
    const cell = row.insertCell();
    cell.textContent = value;

    if (className) cell.className = className;

    return cell;
}

async function loadCalendar() {
    try {
        const response = await fetch('data/calendar.json', { cache: 'no-cache' });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const events = await response.json();

        events.sort((a, b) => a.startDate.localeCompare(b.startDate));
        calendarBody.replaceChildren();

        for (const event of events) {
            const row = calendarBody.insertRow();
            const day = formatCalendarDate(event.startDate, { weekday: 'long' });

            addCalendarCell(row, formatEventDate(event));
            addCalendarCell(row, event.endDate ? '-' : day.charAt(0).toUpperCase() + day.slice(1));
            addCalendarCell(row, event.time || '-');
            addCalendarCell(row, event.title);

            const locationCell = addCalendarCell(row, event.location || '-');

            if (event.locationUrl) {
                const link = document.createElement('a');

                link.href = event.locationUrl;
                link.textContent = event.location;
                link.id = 'email-link'; // Conserve le style du HTML original.
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                locationCell.replaceChildren(link);
            }

            for (const role of ['candidates', 'trainers', 'experts', 'management']) {
                addCalendarCell(row, event[role] ? '●' : '', event[role] ? 'checkbox-cell' : '');
            }
        }
    } catch (error) {
        console.error('Erreur de chargement du calendrier :', error);

        calendarBody.replaceChildren();

        const cell = calendarBody.insertRow().insertCell();
        cell.colSpan = 9;
        cell.textContent = 'Impossible de charger le calendrier.';
    }
}

loadCalendar();