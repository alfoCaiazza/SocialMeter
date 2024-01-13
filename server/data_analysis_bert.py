from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from ita_BERT import classify_sentiment
import logging

def calculate_comments_setiment(comments):
    tot_score = 0
    comments_sentiment = []
    values = []

    for comment in comments:
        info = {}
        compound, sentiment, probability = classify_sentiment(comment['text'])

        info['compound'] = compound
        info['sentiment'] = sentiment

        values.append(compound)
        comments_sentiment.append(info)

    avg_sentiment = sum(values) / len(comments) if len(comments) > 0 else 0
    if avg_sentiment < 0.66:
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
        logging.info(f"Analizing post {index} with ID: {post['id']}")
        
        compound, sentiment, probability = classify_sentiment(post['text'])
        
        comments = post.get('comments', [])
        avg_comments_sentiment, comments_compound, comments_sentiment = calculate_comments_setiment(comments=comments)

        info = {
            'category' : post['category'],
            'id' : post['id'],
            'title' : post['title'],
            'text' : post['text'],
            'pub_date' : post['pub_date'],
            'year' : post['year'],
            'month' : post['month'],
            'day' : post['day'],
            'sentiment' : sentiment,
            'compound' : compound,
            'positivity' : round(probability[2].item(), 3),
            'neutrality' : round(probability[1].item(), 3),
            'negativity' : round(probability[0].item(), 3),
            'score': post['score'],
            'tot_comments': len(post.get('comments', [])),
            'avg_comments_sentiment': avg_comments_sentiment,
            'avg_comments_compound': comments_compound,
            'comments': comments_sentiment
        }

        data_analysis.insert_one(info)
        index += 1

    mongo_client.close()


def main():
    setup_logging()
    load_dotenv()

    calculate_setiment()


if __name__ == "__main__":
    main()
