"use strict";
/* Script carousels (sliders) de l'accueil */

/**
 * Affiche les fleches en fonction du nombre de divs dans le carousel
 * et de la taille de l'écran
 * 
 * @param {*} flecheGauche 
 * @param {*} flecheDroite 
 */
function afficheFleches(items, flecheGauche, flecheDroite) {
    let nbDivs = items.length;
    if (window.innerWidth > 900) {
        if (nbDivs <= 3) {
            flecheGauche.style.display = "none";
            flecheDroite.style.display = "none";
        } else {
            flecheGauche.style.display = "flex";
            flecheDroite.style.display = "flex";
        }
    }
    if (window.innerWidth > 550) {
        if (nbDivs <= 2) {
            flecheGauche.style.display = "none";
            flecheDroite.style.display = "none";
        } else {
            flecheGauche.style.display = "flex";
            flecheDroite.style.display = "flex";
        }
    }
    if (window.innerWidth <= 550) {
        if (nbDivs <= 1) {
            flecheGauche.style.display = "none";
            flecheDroite.style.display = "none";
        } else {
            flecheGauche.style.display = "flex";
            flecheDroite.style.display = "flex";
        }
    }

}

/**
 * Gestion des évènements au scroll (fleches inactive et gradient
 * inactif)
 * 
 * @param {*} flecheGauche 
 * @param {*} flecheDroite 
 * @param {*} carousel 
 */
function scrollEv(flecheGauche, flecheDroite, carousel) {
    if (carousel.scrollLeft <= 0) {
        flecheGauche.classList.add("arrow-inactive");
    } else {
        flecheGauche.classList.remove("arrow-inactive");
    }
    if (carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth - 1) {
        flecheDroite.classList.add("arrow-inactive");
    } else {
        flecheDroite.classList.remove("arrow-inactive");
    }
}

/**
 * Gestion d'un clic sur une fleche gauche
 * On slide vers la div gauche la plus proche
 * 
 * @param {*} carousel 
 * @param {*} rectListe 
 */
function clicFlecheGauche(carousel, rectListe) {
    let decaleScroll;
    for (let i = 0; i < rectListe.length; i++) {
        if (carousel.scrollLeft > rectListe[rectListe.length - 1]) {
            decaleScroll = rectListe[rectListe.length - 1];
        } else if (carousel.scrollLeft > rectListe[i] && carousel.scrollLeft <= rectListe[i + 1]) {
            decaleScroll = rectListe[i];
        }
    }
    carousel.scrollTo({
        left: decaleScroll,
        behavior: "smooth"
    });
}

/**
 * Gestion d'un clic sur une fleche droite
 * On slide vers la div droite la plus proche
 * 
 * @param {*} carousel 
 * @param {*} rectListe 
 */
function clickRight(carousel, rectListe) {
    let decaleScroll;
    for (let i = 0; i < rectListe.length; i++) {
        if (carousel.scrollLeft >= rectListe[i] - 1 && carousel.scrollLeft < rectListe[i + 1]) {
            decaleScroll = rectListe[i + 1];
        }
    }
    carousel.scrollTo({
        left: decaleScroll,
        behavior: "smooth"
    });
}

/**
 * On liste dans rectListe les coordonnées des divs du carousel
 * 
 * @param {*} carouselNumber 
 * @param {*} carousels 
 * @returns rectListe
 */
function listeRectCarousel(carouselNumber, carousels) {
    let divs = carousels[carouselNumber].getElementsByClassName("carousel-item");
    let rectListe = [];
    let rectGauche = carousels[carouselNumber].getBoundingClientRect().left;

    for (let i = 0; i < divs.length; i++) {
        let rect = divs[i].getBoundingClientRect();
        rectListe.push(rect.left - rectGauche);
    }

    for (let i = rectListe.length - 1; i >= 0; i--) {
        rectListe[i] = rectListe[i] - rectListe[0];
    }
    return rectListe;
}

/**
 * On liste dans rectListe les coordonnées des divs du carousel
 * Puis on ajoute un évènement click sur la fleche gauche
 * 
 * @param {*} carouselNumber 
 * @param {*} carousels 
 * @param {*} flechesGauches 
 */
function autoSlidePosGauche(carouselNumber, carousels, flechesGauches) {
    let rectListe = listeRectCarousel(carouselNumber, carousels);
    console.log(rectListe);
    flechesGauches[carouselNumber].addEventListener("click", () => {
        clicFlecheGauche(carousels[carouselNumber], rectListe);
    });
}

/**
 * On liste dans rectListe les coordonnées des divs du carousel
 * Puis on ajoute un évènement click sur la fleche droite
 * 
 * @param {*} carouselNumber 
 * @param {*} carousels 
 * @param {*} flechesDroites 
 */
function autoSlidePosRight(carouselNumber, carousels, flechesDroites) {
    let rectListe = listeRectCarousel(carouselNumber, carousels);
    flechesDroites[carouselNumber].addEventListener("click", () => {
        clickRight(carousels[carouselNumber], rectListe);
    }
    );
}

/* Liste des fleches gauches (ici 2 car 2 carousels) */
let flechesGauches = document.getElementsByClassName("left-arrow");
/* Liste des fleches droites (ici 2 car 2 carousels) */
let flechesDroites = document.getElementsByClassName("right-arrow");
/* Liste des carousels (ici 2 car 2 carousels) */
let carousels = document.getElementsByClassName("carousel");
/* Liste des items */
let items = document.getElementsByClassName("carousel-item");

/* pour toutes les fleches gauches on ajoute l'eventListener */
for (let i = 0; i < flechesGauches.length; i++) {
    autoSlidePosGauche(i, carousels, flechesGauches);
    window.onresize = () => {
        autoSlidePosGauche(i, carousels, flechesGauches);
    }
}

/* pour toutes les fleches droites on ajoute l'eventListener */
for (let i = 0; i < flechesDroites.length; i++) {
    autoSlidePosRight(i, carousels, flechesDroites);
    window.onresize = () => {
        autoSlidePosRight(i, carousels, flechesDroites);
    }
}

/* on ajoute les evenements de scroll pour les 2 carousels */
for (let i = 0; i < carousels.length; i++) {
    carousels[i].addEventListener("scroll", () => {
        /* mêmes fonctions pour les gradient et les fleches */
        scrollEv(flechesGauches[i], flechesDroites[i], carousels[i]);
    });
}

/* on initialise l'affichage des fleches */
for (let i = 0; i < carousels.length; i++) {
    afficheFleches(items, flechesGauches[i], flechesDroites[i]);
    scrollEv(flechesGauches[i], flechesDroites[i], carousels[i]);
    /* a chaque resize de la fenetre, on ré initialise l'affichage des fleches */
    window.onresize = () => {
        afficheFleches(items, flechesGauches[i], flechesDroites[i]);
        scrollEv(flechesGauches[i], flechesDroites[i], carousels[i]);
    };
}
