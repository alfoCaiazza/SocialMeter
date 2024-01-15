from scraping_reddit_data import connect_to_mongo, setup_logging
from dotenv import load_dotenv
import logging
import re
import emoji
import time
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def remove_stopwords(text):
    words = word_tokenize(text, language='italian')

    # Filtra le parole rimuovendo le stopwords
    it_stopwords = set(stopwords.words('italian'))
    filtered_text = [word for word in words if word.lower() not in it_stopwords]

    # Riunisci il testo filtrato
    cleaned_text = ' '.join(filtered_text)

    return cleaned_text

def clean_text(text):
    #Eliminazione dei caratteri speciali e degli spazi in eccesso
    cleaned_text = re.sub(r'[^\w\s]', ' ', text).strip()

    #Eliminazione delle emoji
    cleaned_text = emoji.demojize(cleaned_text)

    #Eliminazione dei link
    cleaned_text = re.sub(r'http\S+', ' ', cleaned_text)

    #Eliminazione degli spazi multipli
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)

    #Resa delle parole in minuscolo
    cleaned_text = cleaned_text.lower()

    return cleaned_text

def main():
    #Viene effettuata la pulizia dei dati e il controllo sul contenuto del testo: se corpo del post o dei commenti è vuoto non vengono inseriti nel database
    setup_logging()
    load_dotenv()
    nltk.download('stopwords')
    nltk.download('punkt')
    mongo_client, db = connect_to_mongo()

    collection = db['posts']
    reddit_posts = collection.find({})
    clean_reddit_posts = db['cleanedPosts']

    index = 1

    for post in reddit_posts:
        logging.info(f"Cleaning post {index} with ID: {post['id']}")
        cleaned_text = clean_text(post['text'])

        post_comments = post.get('comments', [])
        cleaned_comments = []
        for comment in post_comments:
            comment['text'] = clean_text(comment.get('text', ''))      
            cleaned_comments.append(comment)

        post['og_text'] = post['text']
        post['text'] = cleaned_text
        post['comments'] = cleaned_comments
        clean_reddit_posts.insert_one(post)

        index += 1

    mongo_client.close()

if __name__ == "__main__":
    main()