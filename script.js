// MYKNXNS Foundation - small enhancements. No build step, no dependencies.

// Mobile menu
var toggle = document.getElementById('navToggle');
var links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Core values tabs (homepage)
var valueTabs = document.querySelectorAll('.value-tab');
var valuePanels = document.querySelectorAll('.value-panel');
valueTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    var idx = tab.getAttribute('data-value');
    valueTabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    valuePanels.forEach(function (p, i) {
      var on = String(i) === idx;
      p.classList.toggle('active', on);
      if (on) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden', ''); }
    });
  });
});

// Preselect Volunteering / Partnership on the get-involved form
// based on ?type=volunteer or ?type=partner in the URL
var interestRow = document.getElementById('interestRow');
if (interestRow) {
  var type = new URLSearchParams(window.location.search).get('type');
  var value = type === 'partner' ? 'Partnership' : type === 'volunteer' ? 'Volunteering' : null;
  if (value) {
    var radio = interestRow.querySelector('input[value="' + value + '"]');
    if (radio) radio.checked = true;
  }
}

// Reveal on scroll
var revealTargets = document.querySelectorAll('.card, .impact-item, .section h2, .section .kicker, .section-intro, .lead, .media-tile, .partner-slot');
revealTargets.forEach(function (el) { el.classList.add('reveal'); });
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(function (el) { io.observe(el); });
} else {
  revealTargets.forEach(function (el) { el.classList.add('in'); });
}

// Current year in footer
var year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Submit the Volunteer & Partner form to Formspree without leaving the MYKNXNS website
var contactForm = document.querySelector('form[action*="formspree.io"]');

if (contactForm) {
  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    var submitButton = contactForm.querySelector('button[type="submit"]');
    var originalButtonText = submitButton ? submitButton.textContent : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      var response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        window.location.href = 'thank-you.html';
      } else {
        alert('We were unable to submit your information. Please try again or email connect@myknxnscommunitydevelopment.com.');
      }
    } catch (error) {
      alert('We were unable to submit your information. Please try again or email connect@myknxnscommunitydevelopment.com.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
