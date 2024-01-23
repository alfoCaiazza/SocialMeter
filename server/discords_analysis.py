from scraping_reddit_data import connect_to_mongo
from dotenv import load_dotenv
import pandas as pd
import matrixprofile as mp

def truncate_series(df, profile):
    min_length = min(len(df), len(profile['mp']))
    return df.iloc[:min_length], profile['mp'][:min_length]

def startup(category, index, startDate, endDate):
    load_dotenv()
    _, db = connect_to_mongo()  # Assumendo che connect_to_mongo restituisca client e db

    # Convert startDate and endDate to a date format
    start_date = pd.to_datetime(startDate)
    end_date = pd.to_datetime(endDate)

    collection = db['dataAnalysis']
    query = {"category": category, "pub_date": {"$gte": start_date, "$lte": end_date}}
    cursor = collection.find(query, {'id': 1, 'score': 1, 'tot_comments': 1, 'pub_date': 1, 'compound' : 1, 'year': 1})

    # Create a DataFrame
    df = pd.DataFrame(list(cursor))

    # Type checking on date format
    df['pub_date'] = pd.to_datetime(df['pub_date'])

    # Ordering datas chronologically
    df.sort_values('pub_date', inplace=True)

    # Time series creation
    serie_score = df['score'].values
    serie_comments = df['tot_comments'].values
    serie_sentiment = df['compound'].values

    try:
        if index == "score":
            # Calculate and Visualize Matrix Profile for score
            mp_score = mp.compute(serie_score, windows=4) 
            df_truncated, mp_score_truncated = truncate_series(df, mp_score)

            # Prepara i dati per il frontend
            data_to_send = {
                'dates': df_truncated['pub_date'].dt.strftime('%Y-%m-%d').tolist(),
                'values': mp_score_truncated.tolist()
            }
            return data_to_send

        elif index == "tot_comments":
            # Calculate and Visualize Matrix Profile for comments
            mp_comments = mp.compute(serie_comments, windows=4)  
            df_truncated, mp_comments_truncated = truncate_series(df, mp_comments)

            # Prepara i dati per il frontend
            data_to_send = {
                'dates': df_truncated['pub_date'].dt.strftime('%Y-%m-%d').tolist(),
                'values': mp_comments_truncated.tolist()
            }
            return data_to_send

        elif index == "sentiment":
            # Calculate and Visualize Matrix Profile for sentiment
            mp_sentiment = mp.compute(serie_sentiment, windows=4)  
            df_truncated, mp_sentiment_truncated = truncate_series(df, mp_sentiment)

            # Prepara i dati per il frontend
            data_to_send = {
                'dates': df_truncated['pub_date'].dt.strftime('%Y-%m-%d').tolist(),
                'values': mp_sentiment_truncated.tolist()
            }
            return data_to_send
        elif index == "tot_posts":

            return data_to_send

    except Exception as e:
        print(f"Si è verificato un errore: {e}")