from flask import Flask, jsonify

def get_sentiments(app, db):
    @app.route('/api/get_trends', methods=['GET'])
    def inner_get_sentiments():
        try:
            sentiments = db["dataAnalysis"].find({})
            result = [{
                'id': sentiment['id'],
                'score': sentiment['sentiment'],
                'compound' : sentiment['compound'],
                'date': sentiment['pub_date']
            } for sentiment in sentiments]

            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
