/* ============================================================
   iFuture – script.js
   Webbutveckling 1

   Innehåll (vecka 12):
   - Läs mer-funktionalitet: visar och döljer Funktioner-boxen
     för den valda produkten i dess produktkort.

   Övrig funktionalitet implementeras under kommande veckor:
   - Vecka 17: Mörkt läge, hamburgermeny, emoji-markering,
                sökfunktion och PricesAPI-koppling.
   ============================================================ */


/* ------------------------------------------------------------
   LÄS MER – TOGGLE FÖR FUNKTIONER-BOXEN
   Varje "Läs mer"-knapp styr enbart Funktioner-boxen i
   sitt eget produktkort via attributet data-target.
   ------------------------------------------------------------ */

/* Väntar tills hela sidan har laddats klart innan koden körs */
document.addEventListener('DOMContentLoaded', function () {
    /* ----------------------------------------------------------
       HAMBURGERMENY
    ---------------------------------------------------------- */
    var hamburger = document.querySelector('.hamburger');
    var navMeny = document.getElementById('nav-menu');

    if (hamburger && navMeny) {
        hamburger.addEventListener('click', function () {
            var ärÖppen = navMeny.classList.contains('nav-open');
            if (ärÖppen) {
                navMeny.classList.remove('nav-open');
                hamburger.setAttribute('aria-expanded', 'false');
            } else {
                navMeny.classList.add('nav-open');
                hamburger.setAttribute('aria-expanded', 'true');
            }
        });

        /* Stänger menyn när man klickar på en länk */
        navMeny.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMeny.classList.remove('nav-open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        /* ----------------------------------------------------------
   PRODUKTSÖKNING – products.html
   Filtrerar produktkort i realtid medan användaren skriver.
   Döljer även tillhörande underrubriker (h3 i .title_2) och
   produktrader (.products-row) om alla kort i dem är dolda.
   ---------------------------------------------------------- */

        var sokFalt = document.getElementById('product_search');

        if (sokFalt) {

            sokFalt.addEventListener('input', function () {

                /* Hämtar söktexten och gör den till gemener för enkel jämförelse */
                var sokText = sokFalt.value.toLowerCase().trim();

                /* Hämtar alla produktkort */
                var allaProdukter = document.querySelectorAll('.product-item');

                /* Loopar igenom varje produktkort */
                allaProdukter.forEach(function (kort) {

                    /* Hämtar produktnamnet från h3:an inuti .title_3 */
                    var namnElement = kort.querySelector('.title_3 h3');
                    var namn = namnElement ? namnElement.textContent.toLowerCase() : '';

                    /* Visar eller döljer kortet beroende på om namnet matchar söktexten */
                    if (namn.includes(sokText)) {
                        kort.style.display = '';
                    } else {
                        kort.style.display = 'none';
                    }
                });

                /* --------------------------------------------------
                   Döljer tomma produktrader och deras underrubriker
                   så att sidan inte får fula mellanrum vid filtrering
                -------------------------------------------------- */
                var produktRader = document.querySelectorAll('.products-row');

                produktRader.forEach(function (rad) {

                    /* Kontrollerar om minst ett synligt kort finns i raden */
                    var harSynligaKort = Array.from(rad.querySelectorAll('.product-item'))
                        .some(function (kort) {
                            return kort.style.display !== 'none';
                        });

                    /* Döljer eller visar raden */
                    rad.style.display = harSynligaKort ? '' : 'none';

                    /* Döljer även underrubriken (föregående syskon med .title_2) */
                    var föregående = rad.previousElementSibling;
                    if (föregående && föregående.classList.contains('title_2')) {
                        föregående.style.display = harSynligaKort ? '' : 'none';
                    }
                });
            });
        }

        /* ----------------------------------------------------------
   MÖRKT LÄGE – Togglar dark-mode på body
   Valet sparas i localStorage så det finns kvar vid
   nästa besök eller omladdning av sidan.
---------------------------------------------------------- */

        var darkKnapp = document.querySelector('.change_color');

        if (darkKnapp) {

            /* Läser in sparat val från localStorage när sidan laddas */
            var ärMörkt = localStorage.getItem('dark-mode') === 'true';

            /* Återställer dark mode om det var aktiverat senast */
            if (ärMörkt) {
                document.body.classList.add('dark-mode');
                darkKnapp.textContent = '☀️ Ljust';
                darkKnapp.setAttribute('aria-label', 'Byt till ljust läge');
            }

            /* Lyssnar på klick för att toggla dark mode */
            darkKnapp.addEventListener('click', function () {

                /* Kontrollerar om dark mode är aktiverat just nu */
                var mörktNu = document.body.classList.contains('dark-mode');

                if (mörktNu) {
                    /* Stänger av dark mode */
                    document.body.classList.remove('dark-mode');
                    darkKnapp.textContent = '🌙 Mörkt';
                    darkKnapp.setAttribute('aria-label', 'Byt till mörkt läge');
                    localStorage.setItem('dark-mode', 'false');
                } else {
                    /* Aktiverar dark mode */
                    document.body.classList.add('dark-mode');
                    darkKnapp.textContent = '☀️ Ljust';
                    darkKnapp.setAttribute('aria-label', 'Byt till ljust läge');
                    localStorage.setItem('dark-mode', 'true');
                }
            });
        }
    }

    /* Hämtar alla "Läs mer"-knappar på sidan */
    var lasmerKnappar = document.querySelectorAll('.btn-las-mer');

    /* Loopar igenom varje knapp och lägger till en klicklyssnare */
    lasmerKnappar.forEach(function (knapp) {

        /* Hämtar ID:t för den Funktioner-box som knappen styr */
        var målId = knapp.getAttribute('data-target');

        /* Hämtar det specifika Funktioner-elementet via ID:t */
        var målet = document.getElementById(målId);

        /* Döljer Funktioner-boxen från start när sidan laddas */
        if (målet) {
            /* Döljer elementet */
            målet.style.display = 'none';
        }

        /* Lyssnar på klick på just denna knapp */
        knapp.addEventListener('click', function () {

            /* Kontrollerar om Funktioner-boxen är synlig eller dold */
            if (målet.style.display === 'none') {

                /* Visar Funktioner-boxen för detta kort */
                målet.style.display = 'block';

                /* Ändrar knapptexten till "Läs mindre" */
                knapp.textContent = 'Läs mindre';

                /* Markerar knappen som expanderad för tillgänglighet */
                knapp.setAttribute('aria-expanded', 'true');

            } else {

                /* Döljer Funktioner-boxen för detta kort */
                målet.style.display = 'none';

                /* Återställer knapptexten till "Läs mer" */
                knapp.textContent = 'Läs mer';

                /* Markerar knappen som stängd för tillgänglighet */
                knapp.setAttribute('aria-expanded', 'false');
            }
        });
    });
});

// =====================================================
// DYNAMISK LABEL – Ställa frågor (questions.html)
// Uppdaterar "Vad undrar du om ...?" när användaren
// väljer en enhet i select-listan
// =====================================================

// Hämtar select-listan och label-elementet
const deviceSelect = document.getElementById("enhet");
const questionLabel = document.getElementById("question-label");

if (deviceSelect && questionLabel) {

    // Standardtext för labeln när ingen enhet är vald
    const standardText = "Vad undrar du om enheten som du har valt ovan?";

    // Uppdaterar labeln när användaren väljer en enhet
    deviceSelect.addEventListener("change", function () {
        // Hämtar det valda enhetens värde
        const selected = this.value;
        if (selected) {
            // Uppdaterar labeln med den valda enhetens namn
            questionLabel.innerHTML = `Vad undrar du om ${selected}? <span class="required-star" aria-hidden="true">*</span>`;
        } else {
            // Återställer till standardtext om inget är valt
            questionLabel.innerHTML = `${standardText} <span class="required-star" aria-hidden="true">*</span>`;
        }
    });

    // Hämtar formuläret för reset-lyssnaren
    const qForm = document.getElementById("question-form");
    if (qForm) {
        // Återställer labeln när Nollställ-knappen trycks
        // setTimeout 0 behövs eftersom reset-eventet körs innan
        // webbläsaren hinner nollställa fältets värde
        qForm.addEventListener("reset", function () {
            setTimeout(function () {
                questionLabel.innerHTML = `${standardText} <span class="required-star" aria-hidden="true">*</span>`;
            }, 0);
        });
    }
}

// =====================================================
// FORMULÄRVALIDERING & BEKRÄFTELSESKÄRM – questions.html
// =====================================================

// Hämtar formuläret
const questionForm = document.getElementById("question-form");

if (questionForm) {

    // Lyssnar på när formuläret skickas
    questionForm.addEventListener("submit", function (e) {

        // Kontrollerar att ett kön är valt
        // (radio-knappar hanteras inte alltid korrekt av required)
        const genderSelected = document.querySelector('input[name="kon"]:checked');
        if (!genderSelected) {
            // Stoppar formuläret och visar ett felmeddelande
            e.preventDefault();
            alert("Du måste välja ett kön.");
            return;
        }

        // Stoppar formuläret från att navigera till /skicka
        e.preventDefault();

        // Hämtar förnamn från formuläret
        const firstName = document.getElementById("fornamn").value;
        // Hämtar efternamn från formuläret
        const lastName = document.getElementById("efternamn").value;
        // Hämtar e-postadressen från formuläret
        const email = document.getElementById("epost").value;
        // Hämtar telefonnumret från formuläret
        const phone = document.getElementById("telefonnummer").value;
        // Hämtar den valda enheten från formuläret
        const device = document.getElementById("enhet").value;
        // Hämtar frågetexten från formuläret
        const question = document.getElementById("fraga").value;

        // Fyller i sammanfattningen i bekräftelseskärmen
        document.getElementById("question-summary").innerHTML = `
            <hr>
            <h4>Sammanfattning av din fråga:</h4>
            <p><strong>Namn:</strong> ${firstName} ${lastName}</p>
            <p><strong>Kön:</strong> ${genderSelected.value}</p>
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            <p><strong>Enhet:</strong> ${device}</p>
            <p><strong>Fråga:</strong> ${question}</p>
        `;

        // Döljer formuläret
        questionForm.style.display = "none";
        // Visar bekräftelseskärmen
        document.getElementById("question-result").style.display = "block";
    });

    // Hämtar tillbaka-knappen
    const btnBack = document.getElementById("btn-back");

    if (btnBack) {
        // Lyssnar på klick på tillbaka-knappen
        btnBack.addEventListener("click", function () {
            // Återställer formulärets fält
            questionForm.reset();
            // Döljer bekräftelseskärmen
            document.getElementById("question-result").style.display = "none";
            // Visar formuläret igen
            questionForm.style.display = "";
        });
    }
}

/* ----------------------------------------------------------
   EMOJI-MARKERING – Markera nyheter som lästa
   Tillståndet sparas i localStorage så att markeringen
   finns kvar även om användaren laddar om sidan.
---------------------------------------------------------- */

/* Hämtar alla emoji-knappar på sidan */
var emojiKnappar = document.querySelectorAll('.btn-emoji');

/* Loopar igenom varje knapp */
emojiKnappar.forEach(function (knapp) {

    /* Hämtar knappens unika ID från data-id-attributet */
    var nyckel = 'emoji-' + knapp.getAttribute('data-id');

    /* Läser in sparat tillstånd från localStorage */
    var ärLäst = localStorage.getItem(nyckel) === 'true';

    /* Återställer knappens utseende baserat på sparat tillstånd */
    if (ärLäst) {
        knapp.textContent = '✅';
        knapp.setAttribute('aria-label', 'Nyhet markerad som läst');
    }

    /* Lyssnar på klick för att toggla tillståndet */
    knapp.addEventListener('click', function () {

        /* Kontrollerar om nyhet redan är markerad som läst */
        var nuLäst = localStorage.getItem(nyckel) === 'true';

        if (nuLäst) {
            /* Avmarkerar – tar bort från localStorage */
            localStorage.removeItem(nyckel);
            knapp.textContent = '✓';
            knapp.setAttribute('aria-label', 'Markera nyhet som läst');
        } else {
            /* Markerar som läst – sparar i localStorage */
            localStorage.setItem(nyckel, 'true');
            knapp.textContent = '✅';
            knapp.setAttribute('aria-label', 'Nyhet markerad som läst');
        }
    });
});