/* Nightmare Property Care - script.js */

// ---- Mobile navigation ----
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');

function setMenu(open) {
  links.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---- Header shadow once the page is scrolled ----
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

// ---- "Request a Quote" buttons pre-select the matching service ----
document.querySelectorAll('[data-service]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('service').value = btn.dataset.service;
  });
});

// ---- Form validation ----
const form = document.getElementById('quote-form');
const status = document.getElementById('form-status');

// Each rule returns an error message, or '' if the field is fine.
const rules = {
  name:    v => v.trim().length < 2 ? 'Please enter your name.' : '',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.',
  phone:   v => v.replace(/\D/g, '').length >= 10 ? '' : 'Please enter a phone number with at least 10 digits.',
  service: v => v ? '' : 'Please choose a service.',
  address: v => v.trim().length < 5 ? 'Please enter the property address.' : ''
};

function check(field) {
  const msg = rules[field.name](field.value);
  field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  field.parentElement.querySelector('.error').textContent = msg;
  return !msg;
}

Object.keys(rules).forEach(name => {
  const field = form.elements[name];
  field.addEventListener('blur', () => check(field));
  field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') check(field); });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const results = Object.keys(rules).map(name => check(form.elements[name]));
  if (results.includes(false)) {
    status.textContent = 'Please fix the highlighted fields and try again.';
    status.className = 'form-status bad';
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  /* TO RECEIVE REAL MESSAGES: connect a free form service such as Formspree
     (set the form's action attribute to your Formspree URL and send with fetch),
     or Netlify Forms. Until then this only shows a confirmation on screen. */
  status.textContent = 'Thanks! Your quote request is ready to send. (Form service not connected yet.)';
  status.className = 'form-status good';
  form.reset();
});

// ---- Footer year ----
document.getElementById('year').textContent = new Date().getFullYear();
