from scraping_reddit_data import connect_to_mongo, setup_logging
from dotenv import load_dotenv
import logging
import re
import emoji
import string


def clean_text(text):
    #Eliminazione dei caratteri speciali e degli spazi in eccesso
    cleaned_text = re.sub(r'[^\w\s]', ' ', text).strip()

    #Eliminazione delle emoji
    cleaned_text = emoji.demojize(cleaned_text)

    #Eliminazione dei link
    cleaned_text = re.sub(r'http\S+', ' ', cleaned_text)

    #Eliminazione del tag "[meta]" --> devono essere rimossi direttamente i post e i commenti non solo il tag
    #cleaned_text = cleaned_text.replace('[meta]', '')

    #Eliminazione degli spazi multipli
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)

    #Resa delle parole in minuscolo
    cleaned_text = cleaned_text.lower()

    return cleaned_text

def main():
    setup_logging()
    load_dotenv()
    mongo_client, db = connect_to_mongo()

    collection = db['posts']
    reddit_posts = collection.find({})
    clean_reddit_posts = db['cleanedPosts']

    for post in reddit_posts:
        cleaned_text = clean_text(post['text'])

        post_comments = post.get('comments', [])
        cleaned_comments = []
        for comment in post_comments:
            comment['text'] = clean_text(comment.get('text', ''))
            comment['score'] = comment.get('score', '')

            cleaned_comments.append(comment)
        
        post['text'] = cleaned_text
        post['comments'] = cleaned_comments
        clean_reddit_posts.insert_one(post)

    mongo_client.close()

if __name__ == "__main__":
    main()