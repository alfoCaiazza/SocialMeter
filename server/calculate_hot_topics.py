from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from collections import Counter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import nltk 


def retrieve_posts_per_category(category):
    setup_logging()
    load_dotenv()

    mongo_client, db = connect_to_mongo()

    collection = db['dataAnalysis']

    query = {
        "year" : {"$gte": 2023},
        "category": category
    }

    posts = list(collection.find(query))

    mongo_client.close()

    print(len(posts))
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
    ita_stop_words = set(stopwords.words('italian'))
    eng_stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in ita_stop_words and word not in eng_stop_words]

    # Calcola e restituisce le frequenze delle parole: quante volte ogni parola appare in totale nei post 
    return Counter(filtered_tokens)

def get_sentiment_frequencies(posts):
    return get_words_frequencies(posts)


def calculate_word_percentages(word_frequencies):
    total_words = sum(word_frequencies.values())
    percentages = [(word, round((count / total_words) * 100, 3)) for word, count in word_frequencies.items()]
    
    # Ordina la lista in base alle percentuali (dal più alto al più basso) e seleziona le prime 150 parole
    top_percentages = sorted(percentages, key=lambda x: x[1], reverse=True)[:150]
    
    return top_percentages

def hot_topics(category):
    setup_logging()
    load_dotenv()

    nltk.download('punkt')
    nltk.download('stopwords')

    posts = retrieve_posts_per_category(category)
    frequencies = get_sentiment_frequencies(posts)
    percentages = calculate_word_percentages(frequencies)

    return percentages

