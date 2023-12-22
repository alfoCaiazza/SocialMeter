from flask import request, jsonify
from datetime import datetime
from pymongo import MongoClient

def get_trends(reddit, app, database):
    @app.route('/trends', methods=['GET'])
    def inner_get_trends():
        try:
            #Inserimento dei documenti nel db

            collection = database['posts']
            for post in filtered_posts:
                try:
                    collection.insert_one(post)
                    print(f"Post inserted successfully: {post['title']}")
                except Exception as e:
                    print(f"Error inserting post into the database: {str(e)}")

        except Exception as e:
            return jsonify({'error': str(e)}), 500
