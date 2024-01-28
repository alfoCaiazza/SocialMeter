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

def calculate_setiment():
    setup_logging()
    load_dotenv()
    
    ids = ['se6xev', '15b6xgq', 'uzlr9m', 'ys6f72', '12jjfar', 'ish0l4', '15mbkgk', 'o38ukp', 'wk32gf', '1136xpy', 'gdamfe', 'jfwnzi', 'cy8kk1', 'kv6wps', '186tr8v', '17p5bm6', '175dbvu', '17wjq5e', '13pwj3z', '14ecqss', '1721pnk', 'y82hu5', '1598mwj', 'w13t6y', '18i6hpj', 'o4ndgp', '16lpjoh', 'pfu2vz', 'wsd088', 'usykdu', 'c72o9e', 'sl8723', '17p087x', 'ov2nn6', '13feyvr', 'hzch89', '11fcswe', '14ypza6', '16lr67j', 'vdq4r7', 'wg2dwq', 'or6k76', '17yunvd', '178lafn', '15owq9o', '14jeqjj', '16buiu3', '103ulpc', '14ucn82', '17jkecb', '15z46c4', '18creez', '180s23q', 'uln8d9', '17hl0i5', 'vmwmt9', 'yxx02l', 'o6uhfo', '113xcyc', '17fzifq', 'c48rr9', 'iggkvm', 'q3tyt6', '15097id', '1ht6ph', '16hq4u4', 'hjpfbc', 'cpzw45', '1125id7', 'c0p9xa', 'thts6x', '11h5d8t', 'gs4owo', '119z1pi', '17ysqsh', '16g211y', '11kc8oe']
    mongo_client, db = connect_to_mongo()

    collection = db['dataAnalysis']
    posts = collection.find()
    data_analysis = db['analisedPosts']

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
        
        post['emotion'] = get_emotion(post['text'], emotion_classifier)
        
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
