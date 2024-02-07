from RedditAnalysis.server.data_analysis.scraping_reddit_data import connect_to_mongo, setup_logging
from dotenv import load_dotenv
import logging
import re
import emoji


def clean_text(text):
    #Eliminazione dei link
    cleaned_text = re.sub(r'http\S+', ' ', text)

    #Eliminazione delle emoji
    cleaned_text = emoji.demojize(cleaned_text)

    #Eliminazione degli spazi multipli
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)

    # Eliminazione di parole specifiche come 'x200b'
    cleaned_text = re.sub(r'\bx200b\b', ' ', cleaned_text)

    #Eliminazione dei caratteri speciali e degli spazi in eccesso
    cleaned_text = re.sub(r'[^\w\s]', ' ', cleaned_text).strip()

    #Resa delle parole in minuscolo
    cleaned_text = cleaned_text.lower()

    return cleaned_text

def main():
    setup_logging()
    load_dotenv()
    mongo_client, db = connect_to_mongo()

    collection = db['posts']
    reddit_posts = collection.find({})

    index = 1

    for post in reddit_posts:
        logging.info(f"Cleaning post {index} with ID: {post['id']}")
        cleaned_text = clean_text(post['text'])

        post_comments = post.get('comments', [])
        cleaned_comments = []
        for comment in post_comments:
            cleaned_comment_text = clean_text(comment.get('text', ''))
            cleaned_comments.append({**comment, 'text': cleaned_comment_text})

        update_fields = {
            'og_text': post['text'],
            'text': cleaned_text,
            'comments': cleaned_comments
        }

        collection.update_one({'_id': post['_id']}, {'$set': update_fields})

        index += 1

    mongo_client.close()


if __name__ == "__main__":
    main()