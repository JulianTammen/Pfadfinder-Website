// Mobile Navigation Toggle
(function () {
const btn = document.querySelector('.menu-toggle');
const nav = document.getElementById('primary-nav');


function closeNav() {
nav.classList.remove('open');
nav.setAttribute('data-collapsed', '');
btn.setAttribute('aria-expanded', 'false');
document.body.classList.remove('noscroll');
}


function openNav() {
nav.classList.add('open');
nav.removeAttribute('data-collapsed');
btn.setAttribute('aria-expanded', 'true');
document.body.classList.add('noscroll');
}


btn.addEventListener('click', () => {
const isOpen = nav.classList.contains('open');
if (isOpen) closeNav(); else openNav();
});


nav.addEventListener('click', (e) => {
if (e.target.tagName === 'A' && nav.classList.contains('open')) {
closeNav();
}
});


const mq = window.matchMedia('(min-width: 901px)');
mq.addEventListener('change', (e) => { if (e.matches) closeNav(); });
})();