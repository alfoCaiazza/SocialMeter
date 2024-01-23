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
def scrape_reddit(subreddit, limit=None, category_keywords=None, existing_df=None):
    category = category_keywords['category']
    keywords = category_keywords['keywords']
    titles, texts, scores, ids, pub_dates, posts_data = [], [], [], [], [], []
    query = ' OR '.join(keywords)

    for iteration, submission in enumerate(subreddit.search(query, limit=limit)):
        logging.info(f"Processing post {iteration + 1}/{limit}")
        time.sleep(5)
        
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
            submission.comments.replace_more(limit=999)
            comments_data = []
            for comment in submission.comments.list():
                if comment.body == "":
                    continue

                comment_data = {
                    "id": comment.id,
                    "score": comment.score,
                    "estimated_upvotes": int(comment.score * (comment.upvote_ratio if hasattr(comment, 'upvote_ratio') else 1)),
                    "estimated_downvotes": int(comment.score * (1 - (comment.upvote_ratio if hasattr(comment, 'upvote_ratio') else 1))),
                    "text": comment.body,
                    "author": str(comment.author),
                    "created_utc": comment.created_utc,
                    "is_gilded": comment.gilded > 0,
                    "parent_id": comment.parent_id,
                    "is_submitter": comment.is_submitter,
                    "distinguished": comment.distinguished,
                    "depth": comment.depth,  # Indica il livello di annidamento del commento
                    "num_replies": len(comment.replies),  # Numero di risposte dirette al commento
                    "controversiality": comment.controversiality,
                    "location": comment.location if hasattr(comment, 'location') else None,
                }

                comments_data.append(comment_data)

            pub_date = datetime.fromtimestamp(submission.created_utc, timezone.utc)

            post_data = {
                "category": category,
                "title": submission.title,
                "text": submission.selftext,
                "score": submission.score,
                "upvote_ratio": submission.upvote_ratio,
                "id": submission.id,
                "url": submission.url,
                "author": str(submission.author),
                "tot_comments": submission.num_comments,
                "subreddit": str(submission.subreddit),
                "pub_date": pub_date,  # Data e ora UTC della creazione
                "flair": submission.link_flair_text,
                "is_nsfw": submission.over_18,
                "is_sticky": submission.stickied,
                "gilded": submission.gilded,
                "edited": submission.edited,
                "is_deleted": submission.author is None,  # Assumendo che post cancellati non abbiano autore
                "is_archived": submission.archived,
                "distinguished": submission.distinguished,
                "media_content": submission.url if submission.is_reddit_media_domain else None,
                "crosspost_status": [cp.title for cp in submission.crosspost_parent_list] if hasattr(submission, 'crosspost_parent_list') else None,
                "awards": {award.name: award.count for award in submission.all_awardings},
                "comments": comments_data,  # Assumendo che comments_data sia già stato raccolto
                "year": pub_date.year,
                "month": pub_date.month,
                "day": pub_date.day,
                "location": submission.location if hasattr(submission, 'location') else None,
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
    targeted_subreddits = ["italy", "italia", "napoli", "milano", "torino", "venezia", "oknotizie", "xxitaly"]
    categories_keywords = {
        'woman_condition' : ["Femminicidio", "Molestie", "Stupro", "MeToo","Femminismo", "GenderEquality", "Sessismo", "Misoginia", "Maschilismo", "Giulia", "Violenza", "Donna", "Donne"],
        'racism' : ["Negro", "Razzismo", "Raziale", "Africa", "Immigrato"],
        'climate_change': ["Cambiamento", "Climatico", "Temperature", "Caldo", "Estremo"],
    }

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
        time.sleep(30)
        subreddit = reddit.subreddit(sub)

        for category, keywords in categories_keywords.items():
            logging.info(f"Processing category: {category} in subreddit: {subreddit.display_name}")

            time.sleep(30)

            titles, texts, scores, ids, pub_dates, posts_data, new_df = scrape_reddit( subreddit, limit = 250, category_keywords={'category': category, 'keywords': keywords}, existing_df=existing_df)

            if posts_data: 
                existing_df = pd.concat([existing_df, new_df]).drop_duplicates()
                db.posts.insert_many(posts_data)
    
    elapsed_time = time.time() - start_time
    print(f"Execution time: {elapsed_time} sec")

    # Salvataggio del DataFrame esistente
    save_existing_df(existing_df)

    # Close MongoDB connection
    mongo_client.close()

if __name__ == "__main__":
    main()
