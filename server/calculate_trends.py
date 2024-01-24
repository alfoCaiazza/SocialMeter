from dotenv import load_dotenv
from scraping_reddit_data import connect_to_mongo

def get_posts(category):
    load_dotenv()
    client, db = connect_to_mongo()

    collection = db['dataAnalysis']
    cursor = collection.find({'category': category})

    # Inizializzazione dei contatori per ciascun tipo di sentiment
    sentiment_counts = {
        'Negativo': 0,
        'Positivo': 0,
        'Neutrale': 0,
        'Totale': 0
    }

    for post in cursor:
        compound = post.get('compound')
        # Classifica il post in base al suo sentiment
        if compound == 0:  # assumendo che sentiment negativo sia < 0
            sentiment_counts['Negativo'] += 1
        elif compound == 2:  # assumendo che sentiment positivo sia > 0
            sentiment_counts['Positivo'] += 1
        elif compound == 1:  # sentiment neutrale
            sentiment_counts['Neutrale'] += 1
        
        sentiment_counts['Totale'] += 1

    return sentiment_counts

# Esempio di chiamata alla funzione
category = 'woman_condition'
sentiment_counts = get_posts(category)
print(sentiment_counts)
