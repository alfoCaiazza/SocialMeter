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

def retrieve_hottest_posts():
    setup_logging()
    load_dotenv()

    mongo_client, db = connect_to_mongo()

    collection = db['cleanedPosts']
    most_commented_posts = list(collection.find({"year": {"$gte": 2023}}).sort("comments", -1).limit(20))
    most_scored_posts = list(collection.find({"year": {"$gte": 2023}}).sort("score", -1).limit(20))

    posts = delete_duplicate(most_scored_posts, most_commented_posts)

    mongo_client.close()

    return posts

def get_words_frequencies(posts):
    text_list = [post['text'] for post in posts]

     # Unisce tutti i post in un unico testo
    text = ' '.join(text_list).lower()

    # Rimuove la punteggiatura
    text = text.translate(str.maketrans('', '', string.punctuation))

    # Tokenizza il testo
    tokens = word_tokenize(text, language='italian')

    # Rimuove le stop words italiane
    stop_words = set(stopwords.words('italian'))
    filtered_tokens = [word for word in tokens if word not in stop_words]

    # Calcola e restituisce le frequenze delle parole: quante volte ogni parola appare in totale nei post 
    return Counter(filtered_tokens)


def main():
    setup_logging()
    load_dotenv()

    nltk.download('punkt')
    nltk.download('stopwords')

    posts = retrieve_hottest_posts()

    print(f"Total posts retrieved: {len(posts)}: ")
    
    for post in posts:
        print(f"ID: {post['id']}, Score: {post['score']}, Comments: {len(post.get('comments', []))} ---- Year: {post['year']}")

    print("Calculating words frequencies: ")
    frequencies = get_words_frequencies(posts)
    print(frequencies)


if __name__ == "__main__":
    main()
