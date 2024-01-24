from flask import Flask, jsonify, request
from calculate_trends import get_posts

# Definizione della funzione get_sentiments
def get_sentiments(app, db):
    @app.route('/api/get_trends', methods=['GET'])
    def inner_get_sentiments():
        try:
            category = request.args.get('category')

            if not category:
                return jsonify({'error' : 'Category is required'}), 400

            results = get_posts(category)
            return jsonify(results)

        except Exception as e:
            app.logger.error(f'Error: {e}')
            return jsonify({'error': str(e)}), 500
