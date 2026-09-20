import { auth, db } from '/auth.js';
import { fetchWeatherByCity, getUvRisk } from './weather.js';
import { getIconSvg, getWeatherSvg } from './icons.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

let currentUnits = 'metric';
let currentCity = 'Milano';
let weatherData = null;

function formatFullDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  return `Oggi, ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatModalDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function toDisplayTemp(value, includeUnit = false) {
  if (value == null) return '—';
  if (includeUnit) {
    return currentUnits === 'imperial' ? `${Math.round((value * 9) / 5 + 32)} °F` : `${Math.round(value)} °C`;
  }
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

function renderHeroCard(data) {
  const placeEl = document.getElementById('place');
  const todayDateEl = document.getElementById('todayDate');
  const tempEl = document.getElementById('temp');
  const descEl = document.getElementById('desc');
  const illustrationEl = document.getElementById('weatherIllustration');
  const minMaxEl = document.getElementById('heroMinMax');
  const windText = document.getElementById('heroWindText');
  const uvText = document.getElementById('heroUvText');
  const humText = document.getElementById('heroHumidityText');

  const fullPlace = `${data.name || currentCity}${data.country ? `, ${data.country}` : ''}`;
  if (placeEl) placeEl.textContent = fullPlace;

  const today = data.today;
  if (todayDateEl && today) {
    todayDateEl.textContent = formatFullDate(today.date);
  }

  if (tempEl) tempEl.textContent = toDisplayTemp(data.temp, true);
  if (descEl) descEl.textContent = data.description || 'Condizioni attuali';

  // Weather SVG Illustration
  if (illustrationEl) {
    illustrationEl.innerHTML = getWeatherSvg(data.weathercode, false, 'hero-illustration-svg');
  }

  // Min/Max
  if (minMaxEl && today) {
    minMaxEl.textContent = `Min ${toDisplayTemp(today.tempMin)} • Max ${toDisplayTemp(today.tempMax)}`;
  }

  // Vento
  if (windText) {
    windText.textContent = toDisplayWind(data.wind_speed);
  }

  // UV
  if (uvText && today) {
    uvText.textContent = `UV ${today.uvIndexMax != null ? Number(today.uvIndexMax).toFixed(0) : '—'}`;
  }

  // Umidità
  if (humText) {
    humText.textContent = `${data.humidity ?? '—'}%`;
  }

  const heroCard = document.getElementById('heroWeatherCard');
  if (heroCard) heroCard.style.display = 'block';
}

function openHourlyModal(hourData, dayDate) {
  const modal = document.getElementById('hourlyModal');
  if (!modal || !hourData) return;

  const modalDayDate = document.getElementById('modalDayDate');
  const modalHourTitle = document.getElementById('modalHourTitle');
  const modalWeatherIcon = document.getElementById('modalWeatherIcon');
  const modalTemp = document.getElementById('modalTemp');
  const modalCondition = document.getElementById('modalCondition');
  const modalApparent = document.getElementById('modalApparent');
  const modalStatWind = document.getElementById('modalStatWind');
  const modalStatWindDir = document.getElementById('modalStatWindDir');
  const modalStatUv = document.getElementById('modalStatUv');
  const modalStatUvLevel = document.getElementById('modalStatUvLevel');
  const modalStatRain = document.getElementById('modalStatRain');
  const modalStatRainQty = document.getElementById('modalStatRainQty');
  const modalStatHum = document.getElementById('modalStatHum');

  if (modalDayDate && dayDate) modalDayDate.textContent = formatModalDate(dayDate);
  if (modalHourTitle) modalHourTitle.textContent = `Previsioni delle ${hourData.time}`;

  if (modalWeatherIcon) {
    modalWeatherIcon.innerHTML = getWeatherSvg(hourData.weathercode, hourData.isNight, 'modal-svg');
  }

  if (modalTemp) modalTemp.textContent = toDisplayTemp(hourData.temp);
  if (modalCondition) modalCondition.textContent = hourData.description;
  if (modalApparent) {
    modalApparent.textContent = `Percepita: ${toDisplayTemp(hourData.apparentTemp)}`;
  }

  if (modalStatWind) modalStatWind.textContent = toDisplayWind(hourData.windSpeed);
  if (modalStatWindDir) modalStatWindDir.textContent = `Direzione: ${hourData.windDirection || '—'}`;

  const uvInfo = getUvRisk(hourData.uvIndex);
  if (modalStatUv) modalStatUv.textContent = hourData.uvIndex != null ? Number(hourData.uvIndex).toFixed(1) : '0';
  if (modalStatUvLevel) {
    modalStatUvLevel.textContent = uvInfo.level;
    modalStatUvLevel.style.color = uvInfo.color;
  }

  if (modalStatRain) modalStatRain.textContent = `${hourData.precipitationProb ?? 0}%`;
  const unit = currentUnits === 'imperial' ? 'in' : 'mm';
  if (modalStatRainQty) modalStatRainQty.textContent = `${toDisplayPrecip(hourData.precipitation)} ${unit}`;

  if (modalStatHum) modalStatHum.textContent = `${hourData.humidity ?? '—'}%`;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeHourlyModal() {
  const modal = document.getElementById('hourlyModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function renderHourlyCapsules(data) {
  const section = document.getElementById('hourlySection');
  const track = document.getElementById('hourlyCapsulesTrack');
  if (!section || !track) return;

  const today = data.today;
  if (!today || !today.hourly || today.hourly.length === 0) {
    section.style.display = 'none';
    return;
  }

  track.innerHTML = '';

  const now = new Date();
  const currentHour = now.getHours();

  // Combine today's remaining hours + tomorrow morning hours to give a fluid 24h sequence
  const combinedHours = [];
  const todayDate = today.date;

  today.hourly.forEach((h) => {
    combinedHours.push({ ...h, dayDate: todayDate });
  });

  if (data.allDays && data.allDays.length > 1) {
    const tomorrow = data.allDays[1];
    if (tomorrow.hourly) {
      tomorrow.hourly.forEach((h) => {
        combinedHours.push({ ...h, dayDate: tomorrow.date });
      });
    }
  }

  // Find index closest to current hour today
  let startIndex = today.hourly.findIndex((h) => h.hour >= currentHour);
  if (startIndex === -1) startIndex = 0;

  // Take 12-16 capsules starting from current time
  const slice = combinedHours.slice(startIndex, startIndex + 16);

  slice.forEach((h, idx) => {
    const capsule = document.createElement('div');
    capsule.className = `hourly-capsule ${h.isNight ? 'is-night' : 'is-day'}`;
    capsule.setAttribute('role', 'button');
    capsule.setAttribute('tabindex', '0');

    const isNow = idx === 0 && h.dayDate === todayDate;
    const timeLabel = isNow ? 'Adesso' : h.time;

    capsule.innerHTML = `
      <div class="capsule-time">${timeLabel}</div>
      <div class="capsule-icon">${getWeatherSvg(h.weathercode, h.isNight, 'capsule-svg')}</div>
      <div class="capsule-temp">${toDisplayTemp(h.temp)}</div>
      ${h.precipitationProb > 0 ? `<div class="capsule-pill">💧 ${h.precipitationProb}%</div>` : ''}
    `;

    capsule.addEventListener('click', () => openHourlyModal(h, h.dayDate));
    capsule.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openHourlyModal(h, h.dayDate);
      }
    });

    track.appendChild(capsule);
  });

  section.style.display = 'block';
}

function updateBannerLink() {
  const banner = document.getElementById('view7DaysBanner');
  const bannerSection = document.getElementById('bannerSection');
  if (banner) {
    banner.href = `/pages/view7days.html?city=${encodeURIComponent(currentCity)}`;
  }
  if (bannerSection) {
    bannerSection.style.display = 'block';
  }
}

async function loadWeather() {
  const loading = document.getElementById('loadingBox');
  if (loading) loading.style.display = 'flex';

  try {
    weatherData = await fetchWeatherByCity(currentCity, currentUnits);
    if (loading) loading.style.display = 'none';

    renderHeroCard(weatherData);
    renderHourlyCapsules(weatherData);
    updateBannerLink();
  } catch (err) {
    if (loading) {
      loading.innerHTML = `<p style="color:var(--danger)">Errore: ${err.message}</p>`;
    }
  }
}

function initIcons() {
  const navLoc = document.getElementById('navLocationIcon');
  if (navLoc) navLoc.innerHTML = getIconSvg('location');

  const navProf = document.getElementById('navProfileIcon');
  if (navProf) navProf.innerHTML = getIconSvg('profile');

  const windIcon = document.getElementById('heroWindIcon');
  if (windIcon) windIcon.innerHTML = getIconSvg('wind', 'mini-pill-svg');

  const uvIcon = document.getElementById('heroUvIcon');
  if (uvIcon) uvIcon.innerHTML = getIconSvg('uv', 'mini-pill-svg');

  const humIcon = document.getElementById('heroHumidityIcon');
  if (humIcon) humIcon.innerHTML = getIconSvg('droplet', 'mini-pill-svg');

  const bannerArrow = document.getElementById('bannerArrowIcon');
  if (bannerArrow) bannerArrow.innerHTML = getIconSvg('arrowRight');

  const modalClose = document.getElementById('modalCloseIcon');
  if (modalClose) modalClose.innerHTML = getIconSvg('close');

  const modalWindIcon = document.getElementById('modalStatWindIcon');
  if (modalWindIcon) modalWindIcon.innerHTML = getIconSvg('wind', 'modal-stat-svg');

  const modalUvIcon = document.getElementById('modalStatUvIcon');
  if (modalUvIcon) modalUvIcon.innerHTML = getIconSvg('uv', 'modal-stat-svg');

  const modalRainIcon = document.getElementById('modalStatRainIcon');
  if (modalRainIcon) modalRainIcon.innerHTML = getIconSvg('droplet', 'modal-stat-svg');

  const modalHumIcon = document.getElementById('modalStatHumIcon');
  if (modalHumIcon) modalHumIcon.innerHTML = getIconSvg('thermometer', 'modal-stat-svg');
}

document.addEventListener('DOMContentLoaded', () => {
  initIcons();

  // Modal close handlers
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeHourlyModal);

  const bottomCloseBtn = document.getElementById('modalBottomCloseBtn');
  if (bottomCloseBtn) bottomCloseBtn.addEventListener('click', closeHourlyModal);

  const modal = document.getElementById('hourlyModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeHourlyModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeHourlyModal();
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (confirm('Vuoi uscire dal tuo account?')) {
        await signOut(auth);
        window.location.href = '/pages/login.html';
      }
    });
  }

  // Controlla città attiva da URL o localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const cityFromUrl = urlParams.get('city');
  const cityFromStorage = localStorage.getItem('mdev_selected_city');

  if (cityFromUrl) {
    currentCity = cityFromUrl;
  } else if (cityFromStorage) {
    currentCity = cityFromStorage;
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const uData = snap.data();
          currentUnits = uData.prefUnits || 'metric';
          if (!cityFromUrl && !cityFromStorage && uData.prefCity) {
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
