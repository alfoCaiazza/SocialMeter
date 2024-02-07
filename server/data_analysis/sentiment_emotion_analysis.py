from RedditAnalysis.server.data_analysis.scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from RedditAnalysis.server.data_analysis.feel_it_analizer import get_emotion, get_sentiment
from feel_it import EmotionClassifier, SentimentClassifier
import logging

emotion_classifier = EmotionClassifier()
sentiment_classifier = SentimentClassifier()

def calculate_comments_emotion(comments):
    comments_sentiment = []

    for comment in comments:
        sentiment = get_sentiment(comment['text'], sentiment_classifier)
        comment['sentiment_feel_it'] = sentiment

        comments_sentiment.append(comment)
    
    return comments_sentiment

def calculate_setiment():
    setup_logging()
    load_dotenv()
    
    mongo_client, db = connect_to_mongo()

    collection = db['analisedPosts']
    posts = collection.find({'category' : 'racism'})
    data_analysis = db['finalResult']

    index = 1

    for post in posts:
        logging.info(f"Analizing category post {index} with ID: {post['id']}")

        if index % 500 == 0:
            logging.info(f"Closing MongoDB connection with post {index}.")
            mongo_client.close()
            logging.info("Re-opening MongoDB connection")
            mongo_client, db = connect_to_mongo()  # Ristabilisce la connessione
            posts = collection.find({}).skip(index)  # Continua dal prossimo post
            data_analysis = db['dataAnalysis']
        
        sentiment = get_sentiment(post['text'], sentiment_classifier)
        post['sentiment_feel_it'] = sentiment

        comments = post.get('comments', [])
        comments_sentiment = calculate_comments_emotion(comments=comments)

        post['comments'] = comments_sentiment
        
        data_analysis.insert_one(post)
        index += 1

    mongo_client.close()


def main():
    setup_logging()
    load_dotenv()

    calculate_setiment()


if __name__ == "__main__":
    main()
