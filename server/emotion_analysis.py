from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from feel_it_analizer import get_emotion
from feel_it import EmotionClassifier
import logging

emotion_classifier = EmotionClassifier()

def calculate_comments_emotion(comments):
    comments_sentiment = []

    for comment in comments:
        emotion = get_emotion(comment['text'], emotion_classifier)
        comment['emotion'] = emotion

        comments_sentiment.append(comment)
    
    return comments_sentiment

def calculate_sentiment():
    setup_logging()
    load_dotenv()
    
    mongo_client, db = connect_to_mongo()

    collection = db['dataAnalysis']
    posts = collection.find({})

    index = 1

    for post in posts:
        logging.info(f"Analyzing post {index} with ID: {post['id']}")

        if index % 500 == 0:
            logging.info(f"Closing MongoDB connection with post {index}.")
            mongo_client.close()
            logging.info("Re-opening MongoDB connection")
            mongo_client, db = connect_to_mongo()
            collection = db['dataAnalysis']  # Assicurati di riassegnare la collection corretta
            posts = collection.find({}).skip(index)

        # Aggiungi l'emozione al post
        post_emotion = get_emotion(post['text'], emotion_classifier)
        comments = post.get('comments', [])
        comments_emotion = calculate_comments_emotion(comments=comments)

        # Prepara i campi da aggiornare
        update_fields = {
            'emotion': post_emotion,
            'comments': comments_emotion
        }

        # Aggiorna il documento corrente nella collection
        collection.update_one({'_id': post['_id']}, {'$set': update_fields})

        index += 1

    mongo_client.close()

def main():
    setup_logging()
    load_dotenv()
    
    calculate_sentiment()

if __name__ == "__main__":
    main()
