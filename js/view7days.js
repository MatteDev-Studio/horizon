import { getIconSvg, getWeatherSvg } from './icons.js';
import { fetchWeatherByCity, getUvRisk } from './weather.js';
import { auth, db } from '/auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

let currentUnits = 'metric';
let currentCity = 'Milano';

function formatDayName(dateStr, isToday) {
  if (isToday) return 'Oggi';
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  return days[date.getDay()];
}

function formatDateNumber(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function toDisplayTemp(value) {
  if (value == null) return '—';
  return currentUnits === 'imperial' ? `${Math.round((value * 9) / 5 + 32)}°` : `${Math.round(value)}°`;
}

function toDisplayWind(value) {
  if (value == null) return '—';
  return currentUnits === 'imperial' ? `${Math.round(value * 0.621371)} mph` : `${Math.round(value)} km/h`;
}

function toDisplayPrecip(value) {
  if (value == null) return '0';
  return currentUnits === 'imperial' ? (value * 0.0393701).toFixed(1) : value.toFixed(1);
}

function renderWeek(data) {
  const loading = document.getElementById('loadingWeek');
  const container = document.getElementById('weekCardsContainer');
  const cityLabel = document.getElementById('activeCityLabel');
  const subtitle = document.getElementById('weekRangeSubtitle');

  if (loading) loading.style.display = 'none';
  if (!container) return;
  container.style.display = 'grid';
  container.innerHTML = '';

  const fullPlace = `${data.name || currentCity}${data.country ? `, ${data.country}` : ''}`;
  if (cityLabel) cityLabel.textContent = fullPlace;

  const days = data.allDays || [];
  if (days.length === 0) {
    container.innerHTML = '<div class="card">Nessun dato disponibile.</div>';
    return;
  }

  if (subtitle && days.length > 1) {
    subtitle.textContent = `Da ${formatDayName(days[0].date, true)} a ${formatDayName(days[days.length - 1].date, false)} • ${fullPlace}`;
  }

  days.forEach((day, index) => {
    const card = document.createElement('div');
    card.className = `day-row-card ${day.isToday ? 'is-today-card' : ''}`;
    card.id = `dayCard-${index}`;

    const uvInfo = getUvRisk(day.uvIndexMax);
    const rainText = `${toDisplayPrecip(day.precipitation)} ${currentUnits === 'imperial' ? 'in' : 'mm'}`;
    const rainProbText = day.precipitationProbMax != null ? `${day.precipitationProbMax}%` : '0%';

    card.innerHTML = `
      <div class="day-main-row" role="button" tabindex="0" title="Tocca per espandere le 24 ore">
        <div class="day-col-date">
          <div class="day-name">${formatDayName(day.date, day.isToday)}</div>
          <div class="day-date-sub">${formatDateNumber(day.date)}</div>
        </div>

        <div class="day-col-icon">
          ${getWeatherSvg(day.code, false, 'week-weather-svg')}
          <span class="day-cond-desc">${day.description}</span>
        </div>

        <div class="day-col-metrics">
          <div class="metric-pill wind-pill" title="Vento max">
            ${getIconSvg('wind', 'pill-svg')}
            <span>${toDisplayWind(day.windSpeedMax)}</span>
          </div>
          <div class="metric-pill uv-pill" title="Indice UV: ${uvInfo.level}" style="border-color:${uvInfo.color}">
            ${getIconSvg('uv', 'pill-svg')}
            <span style="color:${uvInfo.color}">UV ${day.uvIndexMax != null ? Number(day.uvIndexMax).toFixed(0) : '—'}</span>
          </div>
          <div class="metric-pill rain-pill" title="Probabilità pioggia">
            ${getIconSvg('droplet', 'pill-svg')}
            <span>${rainProbText}</span>
          </div>
        </div>

        <div class="day-col-temps">
          <span class="temp-high">${toDisplayTemp(day.tempMax)}</span>
          <span class="temp-divider">/</span>
          <span class="temp-low">${toDisplayTemp(day.tempMin)}</span>
        </div>

        <div class="day-col-toggle">
          <span class="expand-chevron">▾</span>
        </div>
      </div>

      <!-- Sezione oraria espandibile (24h) -->
      <div class="day-expanded-drawer" style="display:none">
        <div class="expanded-drawer-inner">
          <div class="drawer-metrics-summary">
            <div><strong>Precipitazioni:</strong> ${rainText} (${rainProbText})</div>
            <div><strong>Vento max:</strong> ${toDisplayWind(day.windSpeedMax)}</div>
            <div><strong>Indice UV:</strong> <span style="color:${uvInfo.color}; font-weight:800">${uvInfo.level} (${day.uvIndexMax != null ? Number(day.uvIndexMax).toFixed(1) : '—'})</span></div>
            ${day.sunrise ? `<div><strong>Alba:</strong> ${day.sunrise} • <strong>Tramonto:</strong> ${day.sunset}</div>` : ''}
          </div>

          <h4 class="drawer-hourly-title">Previsioni a orario (24h)</h4>
          <div class="drawer-hourly-track">
            ${
              day.hourly && day.hourly.length > 0
                ? day.hourly
                    .map(
                      (h) => `
              <div class="drawer-hour-card ${h.isNight ? 'is-night' : 'is-day'}">
                <div class="drawer-hour-time">${h.time}</div>
                <div class="drawer-hour-icon">${getWeatherSvg(h.weathercode, h.isNight, 'drawer-weather-svg')}</div>
                <div class="drawer-hour-temp">${toDisplayTemp(h.temp)}</div>
                <div class="drawer-hour-wind">${toDisplayWind(h.windSpeed)}</div>
                ${h.uvIndex > 0 ? `<div class="drawer-hour-uv">UV ${h.uvIndex.toFixed(0)}</div>` : ''}
              </div>
            `
                    )
                    .join('')
                : '<div class="muted small">Orari non disponibili.</div>'
            }
          </div>
        </div>
      </div>
    `;

    const mainRow = card.querySelector('.day-main-row');
    const drawer = card.querySelector('.day-expanded-drawer');
    const chevron = card.querySelector('.expand-chevron');

    const toggleDrawer = () => {
      const isVisible = drawer.style.display === 'block';
      drawer.style.display = isVisible ? 'none' : 'block';
      card.classList.toggle('is-expanded', !isVisible);
      if (chevron) chevron.textContent = isVisible ? '▾' : '▴';
    };

    mainRow.addEventListener('click', toggleDrawer);
    mainRow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDrawer();
      }
    });

    container.appendChild(card);
  });
}

async function loadWeather() {
  const urlParams = new URLSearchParams(window.location.search);
  const cityFromUrl = urlParams.get('city');
  const cityFromStorage = localStorage.getItem('mdev_selected_city');

  if (cityFromUrl) {
    currentCity = cityFromUrl;
  } else if (cityFromStorage) {
    currentCity = cityFromStorage;
  }

  try {
    const backBtn = document.getElementById('backBtn');
    if (backBtn && currentCity) {
      backBtn.href = `/dashboard.html?city=${encodeURIComponent(currentCity)}`;
    }

    const data = await fetchWeatherByCity(currentCity, currentUnits);
    renderWeek(data);
  } catch (err) {
    const loading = document.getElementById('loadingWeek');
    if (loading) loading.textContent = `Errore nel caricamento del meteo: ${err.message}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const backArrowIcon = document.getElementById('backArrowIcon');
  if (backArrowIcon) backArrowIcon.innerHTML = getIconSvg('arrowLeft');

  const locationIconWrap = document.getElementById('locationIconWrap');
  if (locationIconWrap) locationIconWrap.innerHTML = getIconSvg('location');

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const uData = snap.data();
          currentUnits = uData.prefUnits || 'metric';
          if (!new URLSearchParams(window.location.search).get('city') && !localStorage.getItem('mdev_selected_city') && uData.prefCity) {
            currentCity = uData.prefCity;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadWeather();
  });
});
