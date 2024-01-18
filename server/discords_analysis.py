from scraping_reddit_data import connect_to_mongo
from dotenv import load_dotenv
import pandas as pd
import matrixprofile as mp
import matplotlib.pyplot as plt 

def truncate_series(df, profile):
    min_length = min(len(df), len(profile['mp']))
    return df.iloc[:min_length], profile['mp'][:min_length]

def startup(category):
    load_dotenv()
    mongo_client, db = connect_to_mongo()
    collection = db['dataAnalysis']
    query = {"category" : category}
    cursor = collection.find(query, {'score': 1, 'tot_comments': 1, 'pub_date': 1, 'compound' : 1})

    #Create a DataFrame
    df = pd.DataFrame(list(cursor))

    #Type checking on date format
    df['pub_date'] = pd.to_datetime(df['pub_date'])

    #Ordering datas cronologically
    df.sort_values('pub_date', inplace=True)

    #Time series creation
    serie_score = df['score'].values
    serie_comments = df['tot_comments'].values
    serie_sentiment = df['compound'].values

    # Calculate Matrix Profile for score
    mp_score = mp.compute(serie_score, windows=14) 
    df_truncated, mp_score_truncated = truncate_series(df, mp_score)

    #  Calculate Matrix Profile for comments
    mp_comments = mp.compute(serie_comments, windows=14)  
    _, mp_comments_truncated = truncate_series(df, mp_comments)

    # Calculate Matrix Profile for sentiment
    mp_sentiment = mp.compute(serie_sentiment, windows=14)  
    _, mp_sentiment_truncated = truncate_series(df, mp_sentiment)

    # # Visulization of score Matrix Profile
    # plt.figure(figsize=(10, 4))
    # plt.plot(df_truncated['pub_date'], mp_score_truncated, label='Matrix Profile dello Score')
    # plt.legend()
    # plt.title("Matrix Profile dello Score nei Post")
    # plt.xlabel("Data")
    # plt.ylabel("Matrix Profile Value")
    # plt.show()

    # # Visulization of comments Matrix Profile
    # plt.figure(figsize=(10, 4))
    # plt.plot(df_truncated['pub_date'], mp_comments_truncated, label='Matrix Profile del Numero di Commenti')
    # plt.legend()
    # plt.title("Matrix Profile del Numero di Commenti nei Post")
    # plt.xlabel("Data")
    # plt.ylabel("Matrix Profile Value")
    # plt.show()

    # # Visulization of sentiment Matrix Profile
    plt.figure(figsize=(10, 4))
    plt.plot(df_truncated['pub_date'], mp_sentiment_truncated, label='Matrix Profile del Sentiment')
    plt.legend()
    plt.title("Matrix Profile del Sentiment nei Post")
    plt.xlabel("Data")
    plt.ylabel("Matrix Profile Value")
    plt.show()

def main():
    startup('racism')

if __name__ == "__main__":
    main()
