# Meteo App

Applicazione web meteo funzionante con autenticazione Firebase, previsioni meteo tramite Open-Meteo (API gratuita), e personalizzazione utente.

## Struttura Progetto

```
mdev-horizon/
├── index.html              # Landing page (redirect a login)
├── dashboard.html          # Dashboard principale (UI moderna dal bozzetto)
├── selectcity.html         # Redirect a pages/selectcity.html
├── view7days.html          # Redirect a pages/view7days.html
├── auth.js                 # Logica autenticazione Firebase + tab switching
├── css/
│   └── app.css            # Foglio di stile unificato con design mobile & desktop
├── js/
│   ├── app.js             # Logica UI dashboard + capsule orarie e popup
│   ├── icons.js           # Icone SVG vettoriali per meteo e UI
│   ├── selectcity.js      # Logica ricerca città, GPS e cronologia
│   ├── view7days.js       # Previsioni settimanali a 7 giorni e timeline orarie
│   └── weather.js         # Fetch Open-Meteo API (orari, UV, vento, 7 giorni)
└── pages/
    ├── login.html         # Pagina login/registrazione
    ├── emailverify.html   # Verifica email post-registrazione
    ├── profile.html       # Profilo utente + preferenze
    ├── selectcity.html    # Ricerca dedicata e selezione città
    └── view7days.html     # Previsioni dettagliate a 7 giorni
```

## Configurazione

### Firebase Setup
1. Verifica che `auth.js` contenga le credenziali Firebase corrette (hardcoded nel progetto).
2. Nel progetto Firebase (console.firebase.google.com):
   - Abilita **Authentication** (Email/Password)
   - Abilita **Firestore Database** (modalità test per sviluppo)
   - Configura le regole Firestore per permettere letture/scritture agli utenti autenticati

### API Meteo
- Usa **Open-Meteo** (completamente gratuito, nessuna API key richiesta)
- Endpoint geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Endpoint meteo: `https://api.open-meteo.com/v1/forecast`

## Esecuzione Locale

### Opzione 1: Python HTTP Server
```bash
python -m http.server 8080
```
Poi apri: `http://localhost:8080/`

### Opzione 2: Node.js http-server
```bash
npx http-server . -p 8080
```

### Opzione 3: PowerShell (Windows)
```powershell
python -m http.server 8080
# oppure con .NET 6+
dotnet tool install --global dotnet-serve
dotnet serve -p 8080
```

## Flusso Utente

1. **Accesso**: `/pages/login.html`
   - Login con email/password
   - Registrazione con username
   - Verifica email (`/pages/emailverify.html`)

2. **Dashboard**: `/dashboard.html`
   - Ricerca meteo per città
   - Geolocalizzazione automatica
   - Visualizza temp, umidità, vento

3. **Profilo**: `/pages/profile.html`
   - Imposta città predefinita
   - Scegli unità (°C o °F)
   - Salva preferenze

## Bug Risolti

✓ File duplicati eliminati (style.css, other.css, login-scripts.js, emailverify.html root)  
✓ Redirect relativi corretti a percorsi assoluti  
✓ Importazione signOut aggiunta a js/app.js  
✓ Logica tab switching integrata in auth.js  
✓ Profile page: caricamento dati utente + salvataggio preferenze  
✓ CSS formattato e completato  
✓ index.html reindirizza a login automaticamente  

## Troubleshooting

- **Redirect loop**: Verifica che Firebase auth sia configurato correttamente
- **Meteo non carica**: Controlla la console browser per errori di rete Open-Meteo
- **Email non inviata**: Abilita email providers in Firebase Authentication
- **CORS errors**: Usa un server locale (non file://)

## Credenziali Demo

- Email: test@example.com
- Password: password123

(Crea il tuo account attraverso la pagina di registrazione)

## Sviluppo Futuro

- [ ] Previsioni multi-giorno
- [ ] Storico ricerche
- [ ] Widget desktop
- [ ] Dark/Light mode toggle
- [ ] Notifiche push meteo
