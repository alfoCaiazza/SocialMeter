from scraping_reddit_data import connect_to_mongo
from dotenv import load_dotenv
import pandas as pd

def startup(category, index, startDate, endDate):
    load_dotenv()
    client, db = connect_to_mongo()  

    # Convert startDate and endDate to a date format
    start_date = pd.to_datetime(startDate)
    end_date = pd.to_datetime(endDate)

    collection = db['dataAnalysis']
    query = {"category": category, "pub_date": {"$gte": start_date, "$lte": end_date}}
    cursor = collection.find(query, {'id': 1, 'score': 1, 'tot_comments': 1, 'pub_date': 1, 'compound' : 1})

    try:
        data_to_send = {
            'dates': [],
            'values': [],
            'posts': []
        }

        if index == "tot_posts":
            post_count_by_day = {}  # Dizionario per il conteggio dei post per giorno

        for record in cursor:
            date = record['pub_date']
            post_id = record['id']

            if index == "score":
                value = record['score']
            elif index == "tot_comments":
                value = record['tot_comments']
            elif index == "sentiment":
                value = record['compound']
            elif index == "tot_posts":
                post_count_by_day[date] = post_count_by_day.get(date, 0) + 1
            
            post_info = {
                'id': post_id,
                'score': record.get('score', ''),
                'tot_comments': record.get('tot_comments', ''),
                'sentiment': record.get('sentiment',''),
            }

            data_to_send['dates'].append(date)
            if index == "tot_posts":
                data_to_send['values'].append(post_count_by_day[date])
            else:
                data_to_send['values'].append(value)
            data_to_send['posts'].append(post_info)

        # Creazione di un DataFrame
        data_df = pd.DataFrame(data_to_send)

        # Conversione delle date in formato datetime
        data_df['dates'] = pd.to_datetime(data_df['dates'])

        # Ordinamento del DataFrame per data
        data_df.sort_values(by='dates', inplace=True)

        # Restituire i dati ordinati
        return {
            'dates': data_df['dates'].dt.strftime('%d-%m-%Y').tolist(),  # Formattare le date nel formato desiderato
            'values': data_df['values'].tolist(),
            'posts': data_df['posts'].tolist()
        }

    except Exception as e:
        print(f"Error: {e}")
        return None
