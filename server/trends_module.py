from flask import Flask, jsonify, request
from calculate_trends import get_posts

# Definizione della funzione get_sentiments
def get_sentiments(app, db):
    @app.route('/api/get_trends', methods=['GET'])
    def inner_get_sentiments():
        try:
            category = request.args.get('category')

            if not category:
                return jsonify({'error': 'Category is required'}), 400

            sentiment_counts, yearly_sentiment = get_posts(category)

            # Impacchetta i risultati in un singolo oggetto JSON per la risposta
            results = {
                'sentiment_counts': sentiment_counts,
                'yearly_sentiment': yearly_sentiment
            }
            return jsonify(results)

        except Exception as e:
            app.logger.error(f'Error: {e}')
            return jsonify({'error': str(e)}), 500
