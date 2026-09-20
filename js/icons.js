// Modern, clean SVG icons for weather conditions and UI elements

export function getIconSvg(name, className = 'icon-svg') {
  const icons = {
    location: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>`,

    profile: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>`,

    search: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>`,

    arrowRight: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>`,

    arrowLeft: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>`,

    close: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`,

    wind: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
    </svg>`,

    uv: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,

    droplet: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>`,

    thermometer: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
    </svg>`,

    gps: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 2v3m0 14v3m10-10h-3M5 12H2"></path>
      <circle cx="12" cy="12" r="7"></circle>
    </svg>`,

    calendar: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>`,

    sunrise: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0"></path>
      <line x1="12" y1="2" x2="12" y2="9"></line>
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
      <line x1="1" y1="18" x2="3" y2="18"></line>
      <line x1="21" y1="18" x2="23" y2="18"></line>
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
      <line x1="23" y1="22" x2="1" y2="22"></line>
      <polyline points="8 6 12 2 16 6"></polyline>
    </svg>`,

    sunset: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0"></path>
      <line x1="12" y1="9" x2="12" y2="2"></line>
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
      <line x1="1" y1="18" x2="3" y2="18"></line>
      <line x1="21" y1="18" x2="23" y2="18"></line>
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
      <line x1="23" y1="22" x2="1" y2="22"></line>
      <polyline points="16 5 12 9 8 5"></polyline>
    </svg>`
  };

  return icons[name] || '';
}

export function getWeatherSvg(code, isNight = false, className = 'weather-svg') {
  if (code === 0) {
    if (isNight) {
      return `<svg class="${className} moon-svg" viewBox="0 0 64 64" fill="none">
        <path d="M48 36.5C46.5 47.8 36.2 56 24.5 54.5C18.2 53.7 12.8 50.1 9.5 45C11.5 45.8 13.8 46.2 16.2 46.2C28.3 46.2 38.2 36.3 38.2 24.2C38.2 18 35.6 12.4 31.5 8.5C41.2 10.6 48.6 18.8 48 36.5Z" fill="#FDE047" stroke="#FACC15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="48" cy="14" r="1.5" fill="#FEF08A"/>
        <circle cx="56" cy="22" r="1" fill="#FEF08A"/>
      </svg>`;
    }
    return `<svg class="${className} sun-svg" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="14" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>
      <line x1="32" y1="6" x2="32" y2="12" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="52" x2="32" y2="58" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="6" y1="32" x2="12" y2="32" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="52" y1="32" x2="58" y2="32" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  if (code === 1 || code === 2) {
    if (isNight) {
      return `<svg class="${className} moon-cloud-svg" viewBox="0 0 64 64" fill="none">
        <path d="M38 22C36.8 28.5 31.5 33 25 33C22 33 19.3 32 17.2 30.2C19 33.5 22.8 35.8 27.2 35.8C33.8 35.8 39.2 30.5 39.2 23.8C39.2 20.3 37.8 17.2 35.5 15C37.2 16.8 38.3 19.2 38 22Z" fill="#FDE047" stroke="#FACC15" stroke-width="1.8"/>
        <path d="M46 47H19C14 47 10 43 10 38C10 33.4 13.4 29.6 17.9 29.1C19.3 23.8 24.1 20 29.8 20C36.4 20 41.8 25.1 42.4 31.6C46.6 32.2 50 35.8 50 40C50 43.9 46.9 47 46 47Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" stroke-linejoin="round"/>
      </svg>`;
    }
    return `<svg class="${className} sun-cloud-svg" viewBox="0 0 64 64" fill="none">
      <circle cx="39" cy="23" r="12" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>
      <path d="M48 49H20C14.5 49 10 44.5 10 39C10 33.8 13.9 29.6 19 29.1C20.6 23.2 26 19 32.5 19C39.9 19 46 24.8 46.7 32.1C51.3 32.8 55 36.8 55 41.5C55 45.6 51.9 49 48 49Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.2" stroke-linejoin="round"/>
    </svg>`;
  }

  if (code === 3) {
    return `<svg class="${className} overcast-svg" viewBox="0 0 64 64" fill="none">
      <path d="M43 35H18C13.6 35 10 31.4 10 27C10 22.8 13.1 19.4 17.2 19C18.5 14.3 22.8 11 28 11C33.9 11 38.8 15.6 39.4 21.4C43.1 22 46 25.2 46 29C46 32.3 43.3 35 43 35Z" fill="#94A3B8" stroke="#64748B" stroke-width="2" stroke-linejoin="round"/>
      <path d="M52 51H22C16.5 51 12 46.5 12 41C12 35.8 15.9 31.6 21 31.1C22.6 25.2 28 21 34.5 21C41.9 21 48 26.8 48.7 34.1C53.3 34.8 57 38.8 57 43.5C57 47.6 54.9 51 52 51Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.2" stroke-linejoin="round"/>
    </svg>`;
  }

  if (code === 45 || code === 48) {
    return `<svg class="${className} fog-svg" viewBox="0 0 64 64" fill="none">
      <path d="M47 34H19C14.5 34 11 30.5 11 26C11 21.8 14.1 18.4 18.2 18C19.5 13.3 23.8 10 29 10C34.9 10 39.8 14.6 40.4 20.4C44.1 21 47 24.2 47 28C47 31.3 45.3 34 47 34Z" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2" stroke-linejoin="round"/>
      <line x1="14" y1="41" x2="50" y2="41" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
      <line x1="18" y1="47" x2="46" y2="47" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
      <line x1="15" y1="53" x2="49" y2="53" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return `<svg class="${className} rain-svg" viewBox="0 0 64 64" fill="none">
      <path d="M48 38H20C14.5 38 10 33.5 10 28C10 22.8 13.9 18.6 19 18.1C20.6 12.2 26 8 32.5 8C39.9 8 46 13.8 46.7 21.1C51.3 21.8 55 25.8 55 30.5C55 34.6 51.9 38 48 38Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.2" stroke-linejoin="round"/>
      <line x1="22" y1="45" x2="19" y2="54" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
      <line x1="33" y1="45" x2="30" y2="54" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
      <line x1="44" y1="45" x2="41" y2="54" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return `<svg class="${className} snow-svg" viewBox="0 0 64 64" fill="none">
      <path d="M48 38H20C14.5 38 10 33.5 10 28C10 22.8 13.9 18.6 19 18.1C20.6 12.2 26 8 32.5 8C39.9 8 46 13.8 46.7 21.1C51.3 21.8 55 25.8 55 30.5C55 34.6 51.9 38 48 38Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="21" cy="46" r="2.5" fill="#93C5FD"/>
      <circle cx="32" cy="48" r="2.5" fill="#93C5FD"/>
      <circle cx="43" cy="46" r="2.5" fill="#93C5FD"/>
      <circle cx="26" cy="54" r="2" fill="#BAE6FD"/>
      <circle cx="38" cy="54" r="2" fill="#BAE6FD"/>
    </svg>`;
  }

  if (code >= 95) {
    return `<svg class="${className} storm-svg" viewBox="0 0 64 64" fill="none">
      <path d="M48 36H20C14.5 36 10 31.5 10 26C10 20.8 13.9 16.6 19 16.1C20.6 10.2 26 6 32.5 6C39.9 6 46 11.8 46.7 19.1C51.3 19.8 55 23.8 55 28.5C55 32.6 51.9 36 48 36Z" fill="#64748B" stroke="#475569" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="31,37 25,48 32,48 29,59 41,45 34,45" fill="#FACC15" stroke="#EAB308" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;
  }

  return `<svg class="${className} default-svg" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="14" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>
  </svg>`;
}
