from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from ita_BERT import classify_sentiment
import logging

def calculate_comments_setiment(comments):
    comments_sentiment = []
    values = []

    for comment in comments:
        compound, sentiment, probability = classify_sentiment(comment['text'])

        comment['compound'] = compound
        comment['sentiment'] = sentiment

        values.append(compound)
        comments_sentiment.append(comment)

    avg_sentiment = sum(values) / len(comments) if len(comments) > 0 else -1
    if avg_sentiment < 0:
        sentiment = ''
    elif avg_sentiment < 0.66:
        sentiment = 'Negativo'
    elif avg_sentiment < 1.33:
        sentiment = 'Neutrale'
    else:
        sentiment = 'Positivo'
    
    compound = round(avg_sentiment, 3)
    return sentiment, compound, comments_sentiment

def calculate_setiment():
    setup_logging()
    load_dotenv()

    mongo_client, db = connect_to_mongo()

    collection = db['cleanedPosts']
    posts = collection.find({})
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
        
        compound, sentiment, probability = classify_sentiment(post['text'])
        
        comments = post.get('comments', [])
        avg_comments_sentiment, comments_compound, comments_sentiment = calculate_comments_setiment(comments=comments)

        post['sentiment'] = sentiment
        post['compound'] = compound
        post['positivity'] = round(probability[2].item(), 3)
        post['neutrality'] =round(probability[1].item(), 3)
        post['negativity'] = round(probability[0].item(), 3)
        post['avg_comments_sentiment'] = avg_comments_sentiment
        post['abg_comments_compound'] = comments_compound
        
        data_analysis.insert_one(post)
        index += 1

    mongo_client.close()


def main():
    setup_logging()
    load_dotenv()

    calculate_setiment()


if __name__ == "__main__":
    main()
