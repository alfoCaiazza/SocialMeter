from dotenv import load_dotenv
from RedditAnalysis.server.data_analysis.scraping_reddit_data import connect_to_mongo

def get_posts(category):
    load_dotenv()
    client, db = connect_to_mongo()

    collection = db['finalResult']
    cursor = collection.find({'category': category, 'year': {'$gte': 2019}})

    sentiment_counts = {
        'Negativo': 0,
        'Positivo': 0,
        'Neutrale': 0,
        'Totale': 0,
        'Rabbia': 0,
        'Gioia': 0,
        'Tristezza': 0,
        'Paura': 0
    }
    
    yearly_sentiment = {}
    yearly_emotions = {}
    emotion_counts = {}

    # Modifica la struttura di subreddit_counts per tenere traccia dei sentimenti per subreddit
    subreddit_counts = {}  # Ora sarà una mappa di mappe

    for post in cursor:
        compound = post.get('compound')
        year = post.get('year')
        emotion = post.get('emotion')
        subreddit = post.get('subreddit')

        if emotion:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

            if year not in yearly_emotions:
                yearly_emotions[year] = {'Rabbia': 0, 'Gioia': 0, 'Tristezza': 0, 'Paura': 0}

            if emotion in ['Rabbia', 'Gioia', 'Tristezza', 'Paura']:
                yearly_emotions[year][emotion] += 1

        if subreddit:
            if subreddit not in subreddit_counts:
                subreddit_counts[subreddit] = {'Negativo': 0, 'Positivo': 0, 'Neutrale': 0, 'Totale' : 0, 'Rabbia': 0, 'Gioia': 0, 'Tristezza': 0, 'Paura': 0}

            # Classifica il post in base al suo sentiment e aggiorna il conteggio per il subreddit specifico
            if compound == 0:  # assumendo che sentiment negativo sia < 0
                subreddit_counts[subreddit]['Negativo'] += 1
            elif compound == 2:  # assumendo che sentiment positivo sia > 0
                subreddit_counts[subreddit]['Positivo'] += 1
            elif compound == 1:  # sentiment neutrale
                subreddit_counts[subreddit]['Neutrale'] += 1
            
            if emotion in ['Rabbia', 'Gioia', 'Tristezza', 'Paura']:
                subreddit_counts[subreddit][emotion] += 1

        if year and year not in yearly_sentiment:
            yearly_sentiment[year] = {'Negativo': 0, 'Positivo': 0, 'Neutrale': 0}
        
        if compound == 0:
            sentiment_counts['Negativo'] += 1
            if year:
                yearly_sentiment[year]['Negativo'] += 1
        elif compound == 2:
            sentiment_counts['Positivo'] += 1
            if year:
                yearly_sentiment[year]['Positivo'] += 1
        elif compound == 1:
            sentiment_counts['Neutrale'] += 1
            if year:
                yearly_sentiment[year]['Neutrale'] += 1
        
        sentiment_counts['Totale'] += 1

    sorted_yearly_sentiment = dict(sorted(yearly_sentiment.items()))
    sorted_yearly_emotions = dict(sorted(yearly_emotions.items()))

    client.close()

    return sentiment_counts, sorted_yearly_sentiment, emotion_counts, sorted_yearly_emotions, subreddit_counts
