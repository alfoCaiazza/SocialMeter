from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from bson import json_util, ObjectId
from collections import Counter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import logging
import json
import datetime
import nltk 

def default(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime.datetime):
        return obj.isoformat()
    raise TypeError("Object of type %s is not JSON serializable" % type(obj).__name__)

def delete_duplicate(first_list, second_list):
    combined_posts = first_list + second_list

    json_posts = [json.dumps(post, default=default, sort_keys=True) for post in combined_posts]

    unique_json_posts = list(set(json_posts))

    unique_post = [json.loads(post) for post in unique_json_posts]

    return unique_post

def retrieve_posts_per_sentiment():
    setup_logging()
    load_dotenv()

    mongo_client, db = connect_to_mongo()

    collection = db['dataAnalysis']
    # "year": {"$gte": 2023},
    positive_posts = list(collection.find({"sentiment": "Positivo", "category" : "woman_condition"}))
    negative_posts = list(collection.find({ "sentiment": "Negativo", "category" : "woman_condition"}))
    neutral_posts = list(collection.find({ "sentiment": "Neutrale", "category" : "woman_condition"}))

    mongo_client.close()

    return positive_posts, negative_posts, neutral_posts

def get_words_frequencies(posts):
    text_list = [post['text'] for post in posts]

     # Unisce tutti i post in un unico testo
    text = ' '.join(text_list).lower()

    # Rimuove la punteggiatura
    text = text.translate(str.maketrans('', '', string.punctuation))

    # Tokenizza il testo
    tokens = word_tokenize(text, language='italian')

    # Rimuove le stop words italiane
    ita_stop_words = set(stopwords.words('italian'))
    eng_stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in ita_stop_words and word not in eng_stop_words]

    # Calcola e restituisce le frequenze delle parole: quante volte ogni parola appare in totale nei post 
    return Counter(filtered_tokens)

def get_sentiment_frequencies(positive, negative, neutral):
    positive_frequencies = get_words_frequencies(positive)
    negative_frequencies = get_words_frequencies(negative)
    neutral_frequencies = get_words_frequencies(neutral)

    return positive_frequencies, negative_frequencies, neutral_frequencies

def main():
    setup_logging()
    load_dotenv()

    nltk.download('punkt')
    nltk.download('stopwords')

    positive, negative, neutral = retrieve_posts_per_sentiment()
    positive_frequencies, negative_frequencies, neutral_frequencies = get_words_frequencies(neutral)



if __name__ == "__main__":
    main()
