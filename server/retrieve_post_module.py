from flask import Flask, jsonify, request
from bson.json_util import dumps

def get_post(app, db):
    @app.route('/get_post_by_id', methods=['GET'])
    def inner_get_posts():
        try:
            id = request.args.get('postId')

            # Controlla se l'ID è fornito
            if not id:
                return jsonify({'error': 'postId is required'}), 400

            result = db["analisedPosts"].find_one({"id": id})

            # Gestisci il caso in cui il documento non sia trovato
            if result is None:
                return jsonify({'error': 'Post not found'}), 404

            # Converte il risultato in un formato JSON serializzabile
            return dumps(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
