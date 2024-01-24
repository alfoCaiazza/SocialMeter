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
    cursor = collection.find(query)

    try:
        data_to_send = {
            'dates': [],
            'values': [],
            'posts': [] if index != 'tot_posts' else None  # Non inizializzare la lista se index è 'tot_posts'
        }

        post_count_by_day = {}  # Dizionario per il conteggio dei post per giorno, se necessario

        for record in cursor:
            date = record['pub_date'].strftime('%d-%m-%Y')  # Formattazione della data
            if index == "tot_posts":
                post_count_by_day[date] = post_count_by_day.get(date, 0) + 1
                continue  # Salta alla prossima iterazione per 'tot_posts'
            
            # Estrazione e aggiunta di altre informazioni se index non è 'tot_posts'
            post_id = record['id']
            value = record.get(index, '')  # Ottiene il valore in base a index (score, tot_comments, sentiment)

            post_info = {
                'id': post_id,
                'score': record.get('score', ''),
                'tot_comments': record.get('tot_comments', ''),
                'compound': record.get('compound',''),
            }

            data_to_send['dates'].append(date)
            data_to_send['values'].append(value)
            data_to_send['posts'].append(post_info)

        if index == "tot_posts":
            # Aggiungere le date e i valori aggregati per 'tot_posts'
            for date, count in post_count_by_day.items():
                data_to_send['dates'].append(date)
                data_to_send['values'].append(count)

        # Creazione di un DataFrame
        data_df = pd.DataFrame(data_to_send)

        # Conversione delle date in formato datetime e ordinamento
        if index == "tot_posts":
            data_df['dates'] = pd.to_datetime(data_df['dates'], format='%d-%m-%Y')
        else:
            data_df['dates'] = pd.to_datetime(data_df['dates'])
        data_df.sort_values(by='dates', inplace=True)

        # Restituire i dati ordinati
        return {
            'dates': data_df['dates'].dt.strftime('%d-%m-%Y').tolist(),  # Formattare le date nel formato desiderato
            'values': data_df['values'].tolist(),
            'posts': data_df['posts'].tolist() if index != 'tot_posts' else None
        }

    except Exception as e:
        print(f"Error: {e}")
        return None
