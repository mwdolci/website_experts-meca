const partnerCards = document.getElementById('partner-cards');

// Création d'un élément HTML
function createPartnerElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
}

// Création d'un pavé partenaire
function createPartnerCard(partner) {
    const card = createPartnerElement(
        'article',
        'partner-card'
    );

    // Contenu principal
    const content = createPartnerElement(
        'div',
        'partner-card-content'
    );

    // Logo
    const logo = createPartnerElement(
        'div',
        'partner-logo'
    );

    const image = createPartnerElement('img');

    image.src = partner.logo;
    image.alt = `Logo ${partner.name}`;
    image.loading = 'lazy';

    logo.appendChild(image);
    content.appendChild(logo);

    // Partie texte
    const text = createPartnerElement(
        'div',
        'partner-card-text'
    );

    // Nom du partenaire
    text.appendChild(createPartnerElement(
        'h3',
        'partner-card-title',
        partner.name
    ));

    // Description
    text.appendChild(createPartnerElement(
        'p',
        'partner-card-description',
        partner.description
    ));

    // Filières de formation facultatives
    if (partner.programs && partner.programs.length > 0) {

        text.appendChild(createPartnerElement(
            'p',
            'partner-programs-title',
            'Filières Bachelor :'
        ));

        const programs = createPartnerElement(
            'ul',
            'partner-programs'
        );

        for (const program of partner.programs) {
            programs.appendChild(createPartnerElement(
                'li',
                '',
                program
            ));
        }

        text.appendChild(programs);
    }

    content.appendChild(text);
    card.appendChild(content);

    // Pied du pavé
    const footer = createPartnerElement(
        'div',
        'partner-card-footer'
    );

    // Lien vers le site Internet
    const link = createPartnerElement(
        'a',
        'partner-card-link',
        'Visiter le site'
    );

    link.href = partner.website;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    link.setAttribute(
        'aria-label',
        `Visiter le site de ${partner.name} (nouvel onglet)`
    );

    const icon = createPartnerElement(
        'i',
        'fas fa-external-link-alt'
    );

    icon.setAttribute('aria-hidden', 'true');

    link.appendChild(icon);
    footer.appendChild(link);
    card.appendChild(footer);

    return card;
}

// Affichage des partenaires
function renderPartners(partners) {
    partnerCards.replaceChildren();

    for (const partner of partners) {
        partnerCards.appendChild(
            createPartnerCard(partner)
        );
    }
}

// Chargement des partenaires
async function loadPartners() {
    try {
        const response = await fetch('data/partners.json', {
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const partners = await response.json();

        renderPartners(partners);

    } catch (error) {
        console.error(
            'Erreur de chargement des partenaires :',
            error
        );

        partnerCards.textContent =
            'Impossible de charger les partenaires.';
    }
}

// Initialisation
loadPartners();