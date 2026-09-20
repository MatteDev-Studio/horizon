import { getIconSvg } from './icons.js';
import { auth, db } from '/auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

function getRecentCities() {
  try {
    const raw = localStorage.getItem('mdev_recent_cities');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveRecentCity(cityName) {
  if (!cityName) return;
  try {
    let list = getRecentCities();
    list = list.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
    list.unshift(cityName);
    list = list.slice(0, 8);
    localStorage.setItem('mdev_recent_cities', JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

function renderRecentCities() {
  const section = document.getElementById('recentSection');
  const container = document.getElementById('recentList');
  if (!section || !container) return;

  const list = getRecentCities();
  if (list.length === 0) {
    section.style.display = 'none';
    return;
  }

  container.innerHTML = '';
  list.forEach((city) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'city-chip recent-chip';
    chip.innerHTML = `${getIconSvg('location', 'chip-icon')} <span>${city}</span>`;
    chip.addEventListener('click', () => selectCityAndRedirect(city));
    container.appendChild(chip);
  });

  section.style.display = 'block';
}

async function selectCityAndRedirect(cityName) {
  if (!cityName) return;
  saveRecentCity(cityName);
  localStorage.setItem('mdev_selected_city', cityName);

  if (currentUser) {
    try {
      await setDoc(doc(db, 'users', currentUser.uid), { prefCity: cityName }, { merge: true });
    } catch (e) {
      console.warn('Impossibile salvare preferenza su Firestore:', e);
    }
  }

  window.location.href = `/dashboard.html?city=${encodeURIComponent(cityName)}`;
}

let searchTimeout = null;

async function searchCities(query) {
  const listEl = document.getElementById('searchResultsList');
  const sectionEl = document.getElementById('searchResultsSection');
  if (!listEl || !sectionEl) return;

  const q = query.trim();
  if (!q) {
    sectionEl.style.display = 'none';
    listEl.innerHTML = '';
    return;
  }

  sectionEl.style.display = 'block';
  listEl.innerHTML = '<div class="city-loading">Ricerca in corso...</div>';

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=it`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Errore durante la ricerca');

    const data = await res.json();
    const results = data.results || [];

    if (results.length === 0) {
      listEl.innerHTML = '<div class="city-no-results">Nessuna città trovata per questa ricerca.</div>';
      return;
    }

    listEl.innerHTML = '';
    results.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'city-result-item';

      const admin = item.admin1 ? `${item.admin1}, ` : '';
      const country = item.country || '';
      const fullSubtitle = `${admin}${country}`;

      btn.innerHTML = `
        <div class="city-result-info">
          <span class="city-result-icon">${getIconSvg('location')}</span>
          <div>
            <div class="city-result-name">${item.name}</div>
            <div class="city-result-sub">${fullSubtitle}</div>
          </div>
        </div>
        <span class="city-result-arrow">${getIconSvg('arrowRight')}</span>
      `;

      btn.addEventListener('click', () => {
        selectCityAndRedirect(item.name);
      });

      listEl.appendChild(btn);
    });
  } catch (err) {
    listEl.innerHTML = `<div class="city-error">Errore: ${err.message}</div>`;
  }
}

function handleGPS() {
  const gpsBtn = document.getElementById('gpsBtn');
  if (!navigator.geolocation) {
    alert('La geolocalizzazione non è supportata dal tuo browser.');
    return;
  }

  if (gpsBtn) {
    gpsBtn.disabled = true;
    gpsBtn.classList.add('loading');
    gpsBtn.querySelector('span:last-child').textContent = 'Rilevamento posizione...';
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      try {
        // Reverse geocoding via Open-Meteo or fallback
        const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=it`;
        const res = await fetch(revUrl);
        let cityName = '';
        if (res.ok) {
          const js = await res.json();
          cityName = js.city || js.locality || js.principalSubdivision || '';
        }
        if (!cityName) {
          cityName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        }
        selectCityAndRedirect(cityName);
      } catch (err) {
        selectCityAndRedirect(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
      }
    },
    (err) => {
      alert(`Impossibile ottenere la posizione: ${err.message}`);
      if (gpsBtn) {
        gpsBtn.disabled = false;
        gpsBtn.classList.remove('loading');
        gpsBtn.querySelector('span:last-child').textContent = 'Usa la mia posizione attuale';
      }
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  // Inserimento icone SVG
  const backArrowIcon = document.getElementById('backArrowIcon');
  if (backArrowIcon) backArrowIcon.innerHTML = getIconSvg('arrowLeft');

  const backBtn = document.getElementById('backBtn');
  const storedCity = localStorage.getItem('mdev_selected_city');
  if (backBtn && storedCity) {
    backBtn.href = `/dashboard.html?city=${encodeURIComponent(storedCity)}`;
  }

  const searchIconWrap = document.getElementById('searchIconWrap');
  if (searchIconWrap) searchIconWrap.innerHTML = getIconSvg('search');

  const gpsIconWrap = document.getElementById('gpsIconWrap');
  if (gpsIconWrap) gpsIconWrap.innerHTML = getIconSvg('gps');

  renderRecentCities();

  const input = document.getElementById('citySearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const submitBtn = document.getElementById('searchSubmitBtn');
  const gpsBtn = document.getElementById('gpsBtn');
  const clearRecentBtn = document.getElementById('clearRecentBtn');

  if (input) {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => searchCities(val), 320);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(searchTimeout);
        searchCities(input.value);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.focus();
      }
      clearBtn.style.display = 'none';
      searchCities('');
    });
  }

  if (submitBtn && input) {
    submitBtn.addEventListener('click', () => searchCities(input.value));
  }

  if (gpsBtn) {
    gpsBtn.addEventListener('click', handleGPS);
  }

  if (clearRecentBtn) {
    clearRecentBtn.addEventListener('click', () => {
      localStorage.removeItem('mdev_recent_cities');
      renderRecentCities();
    });
  }

  // Chips consigliate
  document.querySelectorAll('#popularCities .city-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const city = btn.getAttribute('data-city');
      if (city) selectCityAndRedirect(city);
    });
  });
});
