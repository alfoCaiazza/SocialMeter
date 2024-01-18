from flask import Flask, jsonify, request

# Definizione della funzione get_sentiments
def get_sentiments(app, db):
    @app.route('/api/get_trends', methods=['GET'])
    def inner_get_sentiments():
        try:
            category = request.args.get('category')

            if not category:
                return jsonify({'error' : 'Category is required'}), 400

            posts = db['dataAnalysis'].find({"category": category})

            if db['dataAnalysis'].count_documents({"category": category}) == 0:
                return jsonify({'error': 'Post not found'}), 404

            results = [{
                'category': post['category'],
                'id': post['id'],
                'title': post['title'],
                'text': post['text'],
                'pub_date': post['pub_date'],
                'year': post['year'],
                'month': post['month'],
                'day': post['day'],
                'sentiment': post['sentiment'],
                'compound': post['compound'],
                'positivity': post['positivity'],
                'neutrality': post['neutrality'],
                'negativity': post['negativity'],
                'score': post['score'],
                'tot_comments': post['tot_comments'],
                'avg_comments_sentiment': post['avg_comments_sentiment'],
                'avg_comments_compound': post['avg_comments_compound'],
                'comments': post['comments'],
            } for post in posts]

            return jsonify(results)

        except Exception as e:
            app.logger.error(f'Error: {e}')
            return jsonify({'error': str(e)}), 500
