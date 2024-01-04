# Social Media Analysis Web App

La Social Media Analysis Web App è il risultato di un progetto di tesi dedicato all'analisi dei social media e allo scraping dei dati da Reddit. L'obiettivo principale è chiarire le tendenze e i pattern comportamentali dei redditors italiani riguardo a tematiche controverse come violenza sulle donne, misoginia, parità di genere, ecc.

## Funzionalità Principali

1. **Visualizzazione dei Risultati:** Mostra i risultati della ricerca, inclusi i dati sulle parole più utilizzate, grafici rappresentanti il sentiment generale e altre informazioni rilevanti.

2. **Analisi delle Tendenze:** Permette agli utenti di comprendere i comportamenti e le opinioni della community di Reddit riguardo alle tematiche selezionate.

## Requisiti di Installazione

Per avviare l'applicazione, assicurarsi di avere installato:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

## Istruzioni per l'Avvio

1. Aprire il terminale nella directory del client React:
    ```bash
    cd path/Redditanalysis/redditanalysis/client
    ```

2. Installare le dipendenze del client:
    ```bash
    npm install
    ```

3. Avviare il client React:
    ```bash
    npm start
    ```

4. Aprire un secondo terminale nella directory del server Flask:
    ```bash
    cd path/Redditanalysis/redditanalysis/server
    ```

5. Installare le dipendenze del server:
    ```bash
    pip install -r requirements.txt
    ```

6. Avviare il server Flask:
    ```bash
    python app.py
    ```

7. Accedere alla web app tramite il browser all'indirizzo [http://localhost:3000/](http://localhost:3000/)

## Dipendenze di Terze Parti

L'applicazione utilizza diverse librerie e framework, tra cui:

- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) per gestire le richieste cross-origin.
- [Axios](https://axios-http.com/) per effettuare richieste HTTP.
- [Bootstrap](https://getbootstrap.com/) per lo stile e il layout.
- [Pymongo](https://pymongo.readthedocs.io/) per la connessione al database MongoDB.
- [React Router DOM](https://reactrouter.com/web/guides/quick-start) per la gestione delle rotte nel client React.
- [Pandas](https://pandas.pydata.org/) per la manipolazione e l'analisi dei dati.



---

*Nota: Assicurarsi di avere un ambiente Python virtuale configurato correttamente per gestire le dipendenze del server Flask.*
