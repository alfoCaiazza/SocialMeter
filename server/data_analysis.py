from nltk.sentiment.vader import SentimentIntensityAnalyzer
from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
import nltk
import logging

def calculate_comments_setiment(comments):
    sid = SentimentIntensityAnalyzer()
    tot_score = 0
    comments_sentiment = []

    for comment in comments:
        info = {}
        score = sid.polarity_scores(comment.get('text', ''))
        compound = score['compound']

        info['compound'] = compound
        
        if compound >= 0.05:
            sentiment = 'Positivo'
        elif compound <= -0.05:
            sentiment = 'Negativo'
        else:
            sentiment = 'Neutro'

        info['sentiment'] = sentiment

        tot_score += score['compound']
        comments_sentiment.append(info)

    avg_sentiment = tot_score / len(comments) if len(comments) > 0 else 0
    if avg_sentiment >= 0.05:
        sentiment = 'Positivo'
    elif avg_sentiment <= -0.05:
        sentiment = 'Negativo'
    else:
        sentiment = 'Neutro'
    
    compound = round(avg_sentiment, 3)
    return sentiment, compound, comments_sentiment

def calculate_setiment():
    setup_logging()
    load_dotenv()
    nltk.download('vader_lexicon')
    sid = SentimentIntensityAnalyzer()

    mongo_client, db = connect_to_mongo()

    collection = db['cleanedPosts']
    posts = collection.find({})
    data_analysis = db['dataAnalysis']

    index = 1

    for post in posts:
        logging.info(f"Analizing post {index} with ID: {post['id']}")
        
        sentiment_scores = sid.polarity_scores(post['text'])
        if sentiment_scores['compound'] >= 0.05:
            sentiment = 'Positivo'
        elif sentiment_scores['compound'] <= -0.05:
            sentiment = 'Negativo'
        else:
            sentiment = 'Neutro'
        
        comments = post.get('comments', [])
        avg_comments_sentiment, compound, comments_sentiment = calculate_comments_setiment(comments=comments)

        info = {
            'category' : post['category'],
            'id' : post['id'],
            'pub_date' : post['pub_date'],
            'year' : post['year'],
            'month' : post['month'],
            'day' : post['day'],
            'sentiment' : sentiment,
            'compound' : sentiment_scores['compound'],
            'score': post['score'],
            'tot_comments': len(post.get('comments', [])),
            'avg_comments_sentiment': avg_comments_sentiment,
            'avg_comments_compound': compound,
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


