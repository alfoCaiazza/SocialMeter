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

def find_anomalies(df, matrix_profile, threshold):
    """
    Identifica le anomalie nel Matrix Profile e restituisce gli ID dei post corrispondenti.
    """
    anomalies_indices = np.where(matrix_profile > threshold)[0]
    anomaly_posts = df.iloc[anomalies_indices]
    return anomaly_posts

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

            # Threshold for anomaly detection
            threshold = np.mean(mp_score_truncated) + 2 * np.std(mp_score_truncated)

            # Detect anomalies
            anomaly_posts = find_anomalies(df_truncated, mp_score_truncated, threshold)

            # Prepare data for the frontend
            data_to_send = {
                'dates': df_truncated['pub_date'].dt.strftime('%Y-%m-%d').tolist(),
                'values': mp_score_truncated.tolist(),
                'anomalies': anomaly_posts[['id', 'pub_date', 'score', 'tot_comments', 'compound']].to_dict(orient='records')
            }
            return data_to_send

        elif index == "tot_comments":
            # Calculate Matrix Profile for score
            mp_tot_comments = mp.compute(serie_comments, windows=4) 
            df_truncated, mp_tot_comments_truncated = truncate_series(df, mp_tot_comments)

            # Threshold for anomaly detection
            threshold = np.mean(mp_tot_comments_truncated) + 2 * np.std(mp_tot_comments_truncated)

            # Detect anomalies
            anomaly_posts = find_anomalies(df_truncated, mp_tot_comments_truncated, threshold)

            # Prepare data for the frontend
            data_to_send = {
                'dates': df_truncated['pub_date'].dt.strftime('%Y-%m-%d').tolist(),
                'values': mp_tot_comments_truncated.tolist(),
                'anomalies': anomaly_posts[['id', 'pub_date', 'score', 'tot_comments', 'compound']].to_dict(orient='records')
            }
            return data_to_send

        elif index == "sentiment":
            # Calculate Matrix Profile for score
            mp_sentiment = mp.compute(serie_sentiment, windows=4) 
            df_truncated, mp_sentiment_truncated = truncate_series(df, mp_sentiment)

            # Threshold for anomaly detection
            threshold = np.mean(mp_sentiment_truncated) + 2 * np.std(mp_sentiment_truncated)

            # Detect anomalies
            anomaly_posts = find_anomalies(df_truncated, mp_sentiment_truncated, threshold)

            # Prepare data for the frontend
            data_to_send = {
                'dates': df_truncated['pub_date'].dt.strftime('%Y-%m-%d').tolist(),
                'values': mp_sentiment_truncated.tolist(),
                'anomalies': anomaly_posts[['id', 'pub_date', 'score', 'tot_comments', 'compound']].to_dict(orient='records')
            }
            return data_to_send

        # Aggiungere eventuali altri casi di analisi qui

    except Exception as e:
        print(f"Si è verificato un errore: {e}")
