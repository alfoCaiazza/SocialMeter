from scraping_reddit_data import connect_to_mongo
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import matrixprofile as mp

def truncate_series(df, profile):
    """
    Tronca il DataFrame e il Matrix Profile per avere la stessa lunghezza.
    """
    min_length = min(len(df), len(profile['mp']))
    return df.iloc[:min_length], profile['mp'][:min_length]

def startup(category, index, startDate, endDate):
    """
    Avvia il processo di analisi dei dati di Reddit.
    """
    load_dotenv()
    _, db = connect_to_mongo()  # Assumendo che connect_to_mongo restituisca client e db

    # Convert startDate and endDate to a date format
    start_date = pd.to_datetime(startDate)
    end_date = pd.to_datetime(endDate)

    collection = db['dataAnalysis']
    query = {"category": category, "pub_date": {"$gte": start_date, "$lte": end_date}}
    cursor = collection.find(query, {'id': 1, 'score': 1, 'tot_comments': 1, 'pub_date': 1, 'compound' : 1})

    # Create a DataFrame
    df = pd.DataFrame(list(cursor))

    # Type checking on date format
    df['pub_date'] = pd.to_datetime(df['pub_date'])

    # Ordering data chronologically
    df.sort_values('pub_date', inplace=True)

    # Calculate total interactions (score + total comments) for each post
    df['total_interactions'] = df['score'] + df['tot_comments']

    # Time series creation
    serie_score = df['score'].values
    serie_comments = df['tot_comments'].values
    serie_sentiment = df['compound'].values

    try:
        if index == "score":
            # Calculate Matrix Profile for score
            mp_score = mp.compute(serie_score, windows=4) 
            df_truncated, mp_score_truncated = truncate_series(df, mp_score)

            df_truncated['value'] = mp_score_truncated

        elif index == "tot_comments":
            # Calculate Matrix Profile for total comments
            mp_tot_comments = mp.compute(serie_comments, windows=4) 
            df_truncated, mp_tot_comments_truncated = truncate_series(df, mp_tot_comments)

            df_truncated['value'] = mp_tot_comments_truncated

        elif index == "sentiment":
            # Calculate Matrix Profile for sentiment
            mp_sentiment = mp.compute(serie_sentiment, windows=4) 
            df_truncated, mp_sentiment_truncated = truncate_series(df, mp_sentiment)

            df_truncated['value'] = mp_sentiment_truncated

        # Prepare data for the frontend
        data_to_send = {
            'dates': df_truncated['pub_date'].dt.strftime('%Y-%m-%d').tolist(),
            'values': df_truncated['value'].tolist(),
            'posts': df_truncated[['id', 'pub_date', 'score', 'tot_comments', 'compound', 'value']].to_dict(orient='records')
        }
        return data_to_send

    except Exception as e:
        print(f"Si è verificato un errore: {e}")
        return None

# Esempio di chiamata alla funzione
# print(startup('woman_condition', 'tot_comments', '2020-01-01', '2024-01-01'))
