from prawcore.exceptions import PrawcoreException
from praw.exceptions import RedditAPIException
from pymongo import MongoClient
from datetime import datetime, timezone
from dotenv import load_dotenv
import praw
import os
import logging
import pandas as pd
import time

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

def connect_to_mongo():
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("MONGO_DB_NAME")

    try:
        mongo_client = MongoClient(mongo_uri)
        db = mongo_client.get_database(db_name)
        logging.info(f"Connected to '{db_name}' database")
        return mongo_client, db
    except Exception as e:
        logging.error(f"Error connecting to database: {str(e)}")
        raise

def load_existing_df(file_path="existing_posts.csv"):
    try:
        existing_df = pd.read_csv(file_path)
        logging.info(f"Loaded existing DataFrame from {file_path}")
        return existing_df
    except FileNotFoundError:
        logging.info(f"No existing DataFrame found at {file_path}. Creating a new one.")
        return pd.DataFrame(columns=["id"])

def save_existing_df(existing_df, file_path="existing_posts.csv"):
    existing_df.to_csv(file_path, index=False)
    logging.info(f"Saved existing DataFrame to {file_path}")

#Cambia il limit successivamente
def scrape_reddit(subreddit, limit=None, existing_df=None, keywords=None, max_posts=None, category= None):
    titles, texts, scores, ids, pub_dates, posts_data = [], [], [], [], [], []
    query = ' OR '.join(keywords)

    for iteration, submission in enumerate(subreddit.search(query, limit=limit)):
        logging.info(f"Processing post {iteration + 1}/{limit}")

        # Check for duplicate submissions using existing_df
        if existing_df is None or submission.id not in existing_df["id"].values:
            if submission.selftext == "":
                print("Skipping post due to empty self text.")
                continue
            titles.append(submission.title)
            texts.append(submission.selftext)
            scores.append(submission.score)
            ids.append(submission.id)
            pub_dates.append(datetime.fromtimestamp(submission.created_utc, timezone.utc))

            # Retrieve comments for the current submission
            time.sleep(2)
            submission.comments.replace_more(limit=None)
            comments_data = []
            for comment in submission.comments.list():
                if comment.body == "":
                    continue

                comment_data = {
                    "score": comment.score,
                    "text": comment.body
                }
                comments_data.append(comment_data)

            pub_date = datetime.utcfromtimestamp(submission.created_utc)

            post_data = {
                "category" : category,
                "title": submission.title,
                "text": submission.selftext,
                "score": submission.score,
                "id": submission.id,
                "pub_date": pub_date,
                "year" : pub_date.year,
                "month" : pub_date.month,
                "day" : pub_date.day,
                "comments": comments_data
            }
            posts_data.append(post_data) 

            time.sleep(5)
        else:
            print("Skipping post: already in DataFrame.")
            continue

    # Creazione di un DataFrame per gestire gli ID
    new_df = pd.DataFrame({"id": ids})

    return titles, texts, scores, ids, pub_dates, posts_data, new_df

def main():
    setup_logging()
    load_dotenv()

    targeted_subreddits = ["italy", "italia", "napoli", "milano", "torino", "venezia", "oknotizie"]
    keywords = ["Femminicidio", "Molestie", "Stupro", "MeToo","Femminismo",
                "GenderEquality", "Sessismo", "Misoginia", "Maschilismo",
                "Giulia", "Violenza", "Donna", "Donne"]

    reddit = praw.Reddit(
        client_id=os.getenv('REDDIT_CLIENT_ID'),
        client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
        user_agent=os.getenv('REDDIT_USER_AGENT')
    )

    mongo_client, db = connect_to_mongo()

    # Caricamento del DataFrame esistente
    existing_df = load_existing_df()

    start_time = time.time()

    for sub in targeted_subreddits:
        subreddit = reddit.subreddit(sub)
        logging.info(f"Processing subreddit: {subreddit.display_name}")

        #time.sleep(60)

        titles, texts, scores, ids, pub_dates, posts_data, new_df = scrape_reddit(subreddit, limit=250, existing_df=existing_df, keywords=keywords, category="woman_condition")

        #Verifica se la lista dei post recuperati è non vuota
        if posts_data: 
            # Aggiornamento del DataFrame con gli ID dei nuovi post
            existing_df = pd.concat([existing_df, new_df]).drop_duplicates()

            # Perform bulk insert for posts into MongoDB
            db.posts.insert_many(posts_data)
    
    elapsed_time = time.time() - start_time
    print(f"Execution time: {elapsed_time} sec")

    # Salvataggio del DataFrame esistente
    save_existing_df(existing_df)

    # Close MongoDB connection
    mongo_client.close()

if __name__ == "__main__":
    main()
