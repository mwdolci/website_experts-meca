const contactCards = document.getElementById('contact-cards');

// Création d'un élément HTML
function createContactElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
}

// Création d'une ligne de coordonnées
function createContactInfo(icon, text, href) {
    const info = createContactElement(
        'div',
        'contact-card-info'
    );

    const iconElement = createContactElement('i', icon);
    iconElement.setAttribute('aria-hidden', 'true');

    const link = createContactElement('a', '', text);
    link.href = href;

    info.appendChild(iconElement);
    info.appendChild(link);

    return info;
}

// Création d'un pavé de contact
function createContactCard(contact) {
    const card = createContactElement(
        'article',
        'contact-card'
    );

    // Nom et prénom
    card.appendChild(createContactElement(
        'h3',
        'contact-card-name',
        `${contact.lastName} ${contact.firstName}`
    ));

    // Fonctions
    const roles = createContactElement(
        'div',
        'contact-card-roles'
    );

    for (const role of contact.roles) {
        roles.appendChild(createContactElement(
            'div',
            'contact-card-role',
            role
        ));
    }

    card.appendChild(roles);

    // Coordonnées
    const details = createContactElement(
        'div',
        'contact-card-details'
    );

    // Adresse e-mail
    if (contact.email) {
        details.appendChild(createContactInfo(
            'fas fa-envelope',
            contact.email,
            `mailto:${contact.email}`
        ));
    }

    // Numéro de téléphone
    if (contact.phone) {
        details.appendChild(createContactInfo(
            'fas fa-phone',
            contact.phone,
            `tel:${contact.phone.replace(/\s/g, '')}`
        ));
    }

    card.appendChild(details);

    return card;
}

// Affichage des contacts par entité
function renderContacts(entities) {
    contactCards.replaceChildren();

    for (const entity of entities) {

        const section = createContactElement(
            'section',
            'contact-section'
        );

        // Nom de l'entité
        section.appendChild(createContactElement(
            'h2',
            'contact-section-title',
            entity.entity
        ));

        // Description
        if (entity.description) {
            section.appendChild(createContactElement(
                'p',
                'contact-section-description',
                entity.description
            ));
        }

        // Adresse postale
        if (entity.address) {
            section.appendChild(createContactElement(
                'p',
                'contact-section-address',
                entity.address
            ));
        }

        // Grille des contacts
        const grid = createContactElement(
            'div',
            'contact-grid'
        );

        for (const contact of entity.contacts) {
            grid.appendChild(createContactCard(contact));
        }

        section.appendChild(grid);
        contactCards.appendChild(section);
    }
}

// Chargement des contacts
async function loadContacts() {
    try {
        const response = await fetch('data/contact.json', {
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const entities = await response.json();

        renderContacts(entities);

    } catch (error) {
        console.error(
            'Erreur de chargement des contacts :',
            error
        );

        contactCards.textContent =
            'Impossible de charger les contacts.';
    }
}

// Initialisation
loadContacts();