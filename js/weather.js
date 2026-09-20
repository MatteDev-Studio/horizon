// Uses Open-Meteo (free, no API key)
// Geocoding: https://geocoding-api.open-meteo.com/v1/search?name=...
// Weather: https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...

export function weatherCodeToInfo(code) {
  const map = {
    0: { desc: 'Sereno', icon: '☀️' },
    1: { desc: 'Prevalentemente sereno', icon: '🌤️' },
    2: { desc: 'Parzialmente nuvoloso', icon: '⛅' },
    3: { desc: 'Coperto', icon: '☁️' },
    45: { desc: 'Nebbia', icon: '🌫️' },
    48: { desc: 'Nebbia con brina', icon: '🌫️' },
    51: { desc: 'Pioviggine leggera', icon: '🌦️' },
    53: { desc: 'Pioviggine moderata', icon: '🌧️' },
    55: { desc: 'Pioviggine densa', icon: '🌧️' },
    56: { desc: 'Pioviggine gelata', icon: '🌧️' },
    57: { desc: 'Pioviggine gelata intensa', icon: '🌧️' },
    61: { desc: 'Pioggia leggera', icon: '🌦️' },
    63: { desc: 'Pioggia moderata', icon: '🌧️' },
    65: { desc: 'Pioggia intensa', icon: '🌧️' },
    66: { desc: 'Pioggia gelata leggera', icon: '🌧️' },
    67: { desc: 'Pioggia gelata intensa', icon: '🌧️' },
    71: { desc: 'Neve leggera', icon: '🌨️' },
    73: { desc: 'Neve moderata', icon: '🌨️' },
    75: { desc: 'Neve intensa', icon: '❄️' },
    77: { desc: 'Granelli di neve', icon: '❄️' },
    80: { desc: 'Rovesci leggeri', icon: '🌦️' },
    81: { desc: 'Rovesci moderati', icon: '🌧️' },
    82: { desc: 'Forti rovesci', icon: '⛈️' },
    85: { desc: 'Rovesci di neve leggeri', icon: '🌨️' },
    86: { desc: 'Rovesci di neve forti', icon: '❄️' },
    95: { desc: 'Temporale', icon: '⛈️' },
    96: { desc: 'Temporale con grandine leggera', icon: '⛈️' },
    99: { desc: 'Temporale con grandine forte', icon: '⛈️' }
  };

  return map[code] || { desc: 'Condizioni variabili', icon: '🌤️' };
}

export function weatherCodeToDesc(code) {
  return weatherCodeToInfo(code).desc;
}

export function degreeToDirection(deg) {
  if (deg == null) return '—';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvRisk(uv) {
  if (uv == null) return { level: 'Non disponibile', color: 'var(--muted)', desc: 'Dato non disponibile' };
  const val = Number(uv);
  if (val < 3) {
    return { level: 'Basso', color: '#65e6a9', desc: 'Rischio basso, sicuro per la maggior parte delle persone.' };
  }
  if (val < 6) {
    return { level: 'Moderato', color: '#ffc47a', desc: 'Protezione raccomandata se all\'aperto nelle ore centrali.' };
  }
  if (val < 8) {
    return { level: 'Alto', color: '#ff944d', desc: 'Protezione solare, cappello e occhiali necessari.' };
  }
  if (val < 11) {
    return { level: 'Molto Alto', color: '#ff6b6b', desc: 'Evita l\'esposizione diretta prolungata al sole.' };
  }
  return { level: 'Estremo', color: '#c084fc', desc: 'Pericolo estremo: resta all\'ombra e proteggiti al massimo.' };
}

async function geocode(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=it`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding fallito');

  const js = await res.json();
  if (!js.results || js.results.length === 0) throw new Error('Località non trovata');
  return js.results[0];
}

export async function fetchWeatherByCity(city, units = 'metric') {
  const place = await geocode(city);
  return await fetchWeatherByCoords(place.latitude, place.longitude, units, place);
}

export async function fetchWeatherByCoords(lat, lon, units = 'metric', placeInfo = null) {
  const hourlyParams = [
    'temperature_2m',
    'relativehumidity_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weathercode',
    'windspeed_10m',
    'winddirection_10m',
    'uv_index'
  ].join(',');

  const dailyParams = [
    'weathercode',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'precipitation_probability_max',
    'uv_index_max',
    'windspeed_10m_max',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset'
  ].join(',');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Meteo non trovato');

  const js = await res.json();
  const cw = js.current_weather || {};

  let humidity = null;
  try {
    if (js.hourly && js.hourly.time && js.hourly.relativehumidity_2m) {
      const times = js.hourly.time;
      const now = new Date();
      let idx = times.findIndex((t) => t.startsWith(now.toISOString().slice(0, 13)));
      if (idx === -1) idx = 0;
      humidity = js.hourly.relativehumidity_2m[idx];
    }
  } catch (err) {
    // Ignore humidity parsing issues.
  }

  const allDays = [];
  try {
    if (js.daily && js.daily.time) {
      const dailyTimes = js.daily.time;
      const codes = js.daily.weathercode || [];
      const tmax = js.daily.temperature_2m_max || [];
      const tmin = js.daily.temperature_2m_min || [];
      const precip = js.daily.precipitation_sum || [];
      const precipProbMax = js.daily.precipitation_probability_max || [];
      const uvMax = js.daily.uv_index_max || [];
      const windMax = js.daily.windspeed_10m_max || [];
      const appMax = js.daily.apparent_temperature_max || [];
      const appMin = js.daily.apparent_temperature_min || [];
      const sunrises = js.daily.sunrise || [];
      const sunsets = js.daily.sunset || [];

      for (let dIdx = 0; dIdx < dailyTimes.length; dIdx += 1) {
        const dayDate = dailyTimes[dIdx];
        const dayHours = [];

        if (js.hourly && js.hourly.time) {
          const hTimes = js.hourly.time;
          for (let hIdx = 0; hIdx < hTimes.length; hIdx += 1) {
            const hTimeStr = hTimes[hIdx];
            if (hTimeStr.startsWith(dayDate)) {
              const timeParts = hTimeStr.split('T')[1] || '';
              const hourNum = parseInt(timeParts.split(':')[0], 10) || 0;
              const isNight = hourNum < 6 || hourNum >= 21;
              const hCode = js.hourly.weathercode ? js.hourly.weathercode[hIdx] : 0;
              const info = weatherCodeToInfo(hCode);
              let icon = info.icon;
              if (isNight && (hCode === 0 || hCode === 1)) {
                icon = '🌙';
              }

              dayHours.push({
                time: timeParts,
                fullTime: hTimeStr,
                hour: hourNum,
                isNight,
                temp: js.hourly.temperature_2m ? js.hourly.temperature_2m[hIdx] : null,
                apparentTemp: js.hourly.apparent_temperature ? js.hourly.apparent_temperature[hIdx] : null,
                humidity: js.hourly.relativehumidity_2m ? js.hourly.relativehumidity_2m[hIdx] : null,
                precipitationProb: js.hourly.precipitation_probability ? js.hourly.precipitation_probability[hIdx] : 0,
                precipitation: js.hourly.precipitation ? js.hourly.precipitation[hIdx] : 0,
                weathercode: hCode,
                description: info.desc,
                icon,
                windSpeed: js.hourly.windspeed_10m ? js.hourly.windspeed_10m[hIdx] : null,
                windDirectionDeg: js.hourly.winddirection_10m ? js.hourly.winddirection_10m[hIdx] : null,
                windDirection: degreeToDirection(js.hourly.winddirection_10m ? js.hourly.winddirection_10m[hIdx] : null),
                uvIndex: js.hourly.uv_index ? js.hourly.uv_index[hIdx] : 0
              });
            }
          }
        }

        const formatSunTime = (sunStr) => {
          if (!sunStr) return null;
          return sunStr.includes('T') ? sunStr.split('T')[1].slice(0, 5) : sunStr;
        };

        const dayCode = codes[dIdx];
        const dayInfo = weatherCodeToInfo(dayCode);

        allDays.push({
          date: dayDate,
          isToday: dIdx === 0,
          code: dayCode,
          description: dayInfo.desc,
          icon: dayInfo.icon,
          tempMax: tmax[dIdx],
          tempMin: tmin[dIdx],
          apparentTempMax: appMax[dIdx] ?? null,
          apparentTempMin: appMin[dIdx] ?? null,
          precipitation: precip[dIdx] ?? 0,
          precipitationProbMax: precipProbMax[dIdx] ?? null,
          windSpeedMax: windMax[dIdx] ?? null,
          uvIndexMax: uvMax[dIdx] ?? null,
          sunrise: formatSunTime(sunrises[dIdx]),
          sunset: formatSunTime(sunsets[dIdx]),
          hourly: dayHours
        });
      }
    }
  } catch (err) {
    console.error('Errore nel parsing delle previsioni:', err);
  }

  // The 5-day upcoming forecast (days 1 to 5)
  const forecast = allDays.slice(1, 6);

  return {
    name: placeInfo?.name || '',
    country: placeInfo?.country || '',
    temp: cw.temperature,
    wind_speed: cw.windspeed,
    weathercode: cw.weathercode,
    humidity,
    description: weatherCodeToDesc(cw.weathercode),
    icon: weatherCodeToInfo(cw.weathercode).icon,
    today: allDays[0] || null,
    allDays,
    forecast
  };
}
