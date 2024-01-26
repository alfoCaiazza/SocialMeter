from dotenv import load_dotenv
from scraping_reddit_data import connect_to_mongo

def get_posts(category):
    load_dotenv()
    client, db = connect_to_mongo()

    collection = db['analisedPosts']
    cursor = collection.find({'category': category})

    # Inizializzazione dei contatori per ciascun tipo di sentiment
    sentiment_counts = {
        'Negativo': 0,
        'Positivo': 0,
        'Neutrale': 0,
        'Totale': 0
    }
    
    # Inizializzazione della struttura dati per i conteggi annuali
    yearly_sentiment = {}
    emotion_counts = {}
    subreddit_counts = {}

    for post in cursor:
        compound = post.get('compound')
        year = post.get('year')
        emotion = post.get('emotion')
        subreddit = post.get('subreddit')

        if emotion:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

        if subreddit:
            subreddit_counts[subreddit] = subreddit_counts.get(subreddit, 0) + 1
        
        # Inizializza il conteggio per l'anno se non esiste
        if year and year not in yearly_sentiment:
            yearly_sentiment[year] = {'Negativo': 0, 'Positivo': 0, 'Neutrale': 0}
        
        # Classifica il post in base al suo sentiment
        if compound == 0:  # assumendo che sentiment negativo sia < 0
            sentiment_counts['Negativo'] += 1
            if year:
                yearly_sentiment[year]['Negativo'] += 1
        elif compound == 2:  # assumendo che sentiment positivo sia > 0
            sentiment_counts['Positivo'] += 1
            if year:
                yearly_sentiment[year]['Positivo'] += 1
        elif compound == 1:  # sentiment neutrale
            sentiment_counts['Neutrale'] += 1
            if year:
                yearly_sentiment[year]['Neutrale'] += 1
        
        sentiment_counts['Totale'] += 1

    sorted_yearly_sentiment = dict(sorted(yearly_sentiment.items()))
    # Chiudi la connessione al database
    client.close()

    # Restituisci sia i conteggi totali che quelli annuali
    return sentiment_counts, sorted_yearly_sentiment, emotion_counts, subreddit_counts

