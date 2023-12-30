#Cambia il limit successivamente
def scrape_reddit(subreddit, limit=None, existing_df=None, keywords=None, max_posts=None):
    titles, texts, scores, ids, pub_dates, posts_data = [], [], [], [], [], []
    last_post_id = None
    tot_posts_for_subreddit = 0

    while tot_posts_for_subreddit < max_posts:

        for iteration, submission in enumerate(subreddit.hot(limit=limit, params={'after': last_post_id})):
            logging.info(f"Processing post {iteration + 1}/{limit}")
            # Check for kewywords in the title or text
            contains_keyword = any(keyword.lower() in submission.title.lower() or
                                keyword.lower() in submission.selftext.lower()
                                for keyword in keywords) if keywords else True
            
            print(f"Post ID: {submission.id}, Contains Keyword: {contains_keyword}")
            last_post_id = submission.id
            tot_posts_for_subreddit += 1

            # Skip to the next iteration if keywords are specified and not present
            if keywords and not contains_keyword:
                print("Skipping post due to missing keywords.")
                continue

            # Check for duplicate submissions using existing_df
            if existing_df is None or submission.id not in existing_df["id"].values:
                titles.append(submission.title)
                texts.append(submission.selftext)
                scores.append(submission.score)
                ids.append(submission.id)
                pub_dates.append(datetime.utcfromtimestamp(submission.created_utc))

                # Retrieve comments for the current submission
                submission.comments.replace_more(limit=None)
                comments_data = []
                for comment in submission.comments.list():
                    comment_data = {
                        "score": comment.score,
                        "text": comment.body
                    }
                    comments_data.append(comment_data)

                post_data = {
                    "title": submission.title,
                    "text": submission.selftext,
                    "score": submission.score,
                    "id": submission.id,
                    "pub_date": datetime.utcfromtimestamp(submission.created_utc),
                    "comments": comments_data
                }

                posts_data.append(post_data)

        logging.info(f"Starting with second iteration: total analyzed posts: {tot_posts_for_subreddit}")
        time.sleep(5)

    time.sleep(5)
    print(f"Total ids in function scraping: {len(ids)}")
    print(ids)
    # Creazione di un DataFrame per gestire gli ID
    new_df = pd.DataFrame({"id": ids})

    return titles, texts, scores, ids, pub_dates, posts_data, new_df