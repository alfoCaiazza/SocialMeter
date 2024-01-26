from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from ita_BERT import classify_sentiment
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging

# Carica il tokenizer e il modello
tokenizer = AutoTokenizer.from_pretrained("neuraly/bert-base-italian-cased-sentiment")
model = AutoModelForSequenceClassification.from_pretrained("neuraly/bert-base-italian-cased-sentiment")

def calculate_comments_setiment(comments):
    comments_sentiment = []

    for comment in comments:
        compound, sentiment, probability = classify_sentiment(comment['text'], tokenizer, model)

        comment['compound'] = compound
        comment['sentiment'] = sentiment

        comments_sentiment.append(comment)
    
    return comments_sentiment

def calculate_setiment():
    setup_logging()
    load_dotenv()

    mongo_client, db = connect_to_mongo()

    collection = db['cleanedPosts']
    posts = collection.find({'category':'woman_condition'})
    data_analysis = db['dataAnalysis']

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
        
        compound, sentiment, probability = classify_sentiment(post['text'], tokenizer, model)
        
        comments = post.get('comments', [])
        comments_sentiment = calculate_comments_setiment(comments=comments)

        post['sentiment'] = sentiment
        post['compound'] = compound
        post['positivity'] = round(probability[2].item(), 3)
        post['neutrality'] =round(probability[1].item(), 3)
        post['negativity'] = round(probability[0].item(), 3)
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
