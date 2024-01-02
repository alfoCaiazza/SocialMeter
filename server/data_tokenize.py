from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from pymongo import MongoClient
from dotenv import load_dotenv
import nltk
import os
import logging

nltk.download('stopwords')
nltk.download('punkt')

def connect_to_mongo():
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("MONGO_DB_NAME_CLEANED")

    try:
        mongo_client = MongoClient(mongo_uri)
        db = mongo_client.get_database(db_name)
        logging.info(f"Connected to '{db_name}' database")
        return mongo_client, db
    except Exception as e:
        logging.error(f"Error connecting to database: {str(e)}")
        raise

def process_string(text):
    #Tokenizzazione
    tokens = word_tokenize(text=text)

    #Rimozione dei token a singolo carattere e con stopword
    filtered_tokens = [word.lower() for word in tokens if len(word) > 1 and word.lower() not in stopwords.words('italian')]

    return filtered_tokens

def main():
    load_dotenv()
    mongo_client, db = connect_to_mongo()

    collection = db['cleanedPosts']
    posts = collection.find({})

    for post in posts:
        #Preleva il testo del post e lo tokenizza
        post_tokens = process_string( post['text'])

        post_comments = post.get('comments', [])
        for comment in post_comments:
            comment_token = process_string(comment.get('text', ''))


if __name__ == "__main__":
    main() 