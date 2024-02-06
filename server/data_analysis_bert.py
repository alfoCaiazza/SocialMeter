from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from ita_BERT import classify_sentiment
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging

# Carica il tokenizer e il modello
tokenizer = AutoTokenizer.from_pretrained("neuraly/bert-base-italian-cased-sentiment")
model = AutoModelForSequenceClassification.from_pretrained("neuraly/bert-base-italian-cased-sentiment")

def calculate_comments_sentiment(comments):
    comments_sentiment = []

    for comment in comments:
        compound, sentiment, probability = classify_sentiment(comment['text'], tokenizer, model)

        comment['compound'] = compound
        comment['sentiment'] = sentiment

        comments_sentiment.append(comment)
    
    return comments_sentiment

def calculate_sentiment():
    setup_logging()
    load_dotenv()

    mongo_client, db = connect_to_mongo()

    collection = db['cleanedPosts']
    posts = collection.find({'category': 'woman_condition'})

    index = 1

    for post in posts:
        logging.info(f"Analyzing category post {index} with ID: {post['id']}")

        if index % 500 == 0:
            logging.info(f"Closing MongoDB connection with post {index}.")
            mongo_client.close()
            logging.info("Re-opening MongoDB connection")
            mongo_client, db = connect_to_mongo()  # Ristabilisce la connessione
            collection = db['cleanedPosts']  # Riassegna la collection in caso di riavvio della connessione
            posts = collection.find({'category': 'woman_condition'}).skip(index)  # Continua dal prossimo post
        
        compound, sentiment, probability = classify_sentiment(post['text'], tokenizer, model)
        
        comments = post.get('comments', [])
        comments_sentiment = calculate_comments_sentiment(comments=comments)

        update_fields = {
            'sentiment': sentiment,
            'compound': compound,
            'positivity': round(probability[2].item(), 3),
            'neutrality': round(probability[1].item(), 3),
            'negativity': round(probability[0].item(), 3),
            'comments': comments_sentiment
        }

        collection.update_one({'_id': post['_id']}, {'$set': update_fields})

        index += 1

    mongo_client.close()

def main():
    setup_logging()
    load_dotenv()

    calculate_sentiment()

if __name__ == "__main__":
    main()
