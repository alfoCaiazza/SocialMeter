from nltk.sentiment.vader import SentimentIntensityAnalyzer
from scraping_reddit_data import setup_logging, connect_to_mongo
from dotenv import load_dotenv
from prettytable import PrettyTable
import nltk

def calculate_comments_setiment(comments):
    sid = SentimentIntensityAnalyzer()
    tot_score = 0

    for comment in comments:
        score = sid.polarity_scores(comment.get('text', ''))
        tot_score += score['compound']

    avg_sentiment = tot_score / len(comments) if len(comments) > 0 else 0
    if avg_sentiment >= 0.05:
        sentiment = 'Positivo'
    elif avg_sentiment <= -0.05:
        sentiment = 'Negativo'
    else:
        sentiment = 'Neutro'
    
    compound = round(avg_sentiment, 3)
    return sentiment, compound

def calculate_setiment():
    setup_logging()
    load_dotenv()
    nltk.download('vader_lexicon')
    sid = SentimentIntensityAnalyzer()

    mongo_client, db = connect_to_mongo()

    collection = db['cleanedPosts']
    posts = collection.find({})

    table = PrettyTable()
    table.field_names = ["ID", "Sentiment", "Pos", "Neu", "Neg", "Text Compound", "Comments Sentiment", "Comments Compound"]

    for post in posts:
        sentiment_scores = sid.polarity_scores(post['text'])
        if sentiment_scores['compound'] >= 0.05:
            sentiment = 'Positivo'
        elif sentiment_scores['compound'] <= -0.05:
            sentiment = 'Negativo'
        else:
            sentiment = 'Neutro'
        
        comments = post.get('comments', [])
        avg_comments_sentiment, compound = calculate_comments_setiment(comments=comments)
        
        table.add_row([post['id'], sentiment, sentiment_scores['pos'], sentiment_scores['neu'], sentiment_scores['neg'], sentiment_scores['compound'], avg_comments_sentiment, compound])

    return table

def main():
    setup_logging()
    load_dotenv()

    table = calculate_setiment()
    
    print(table)

        




if __name__ == "__main__":
    main()


