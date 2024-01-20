from flask import Flask, jsonify, request, current_app
from discords_analysis import startup

def get_matrix_profile(app):
    @app.route('/api/create_matrix_profile', methods=['POST'])
    def inner_get_matrix_profile():
        try:
            data = request.json
            startDate = data.get('startDate')
            endDate = data.get('endDate')
            category = data.get('category')
            index = data.get('index')

            print("Dati ricevuti:", data)

            # Controlla se tutti i campi necessari sono presenti
            if not all([startDate, endDate, category, index]):
                return jsonify({'error': 'Mancano alcuni dati necessari'}), 400

            result = startup(category, index)
            return jsonify(result)
        except Exception as e:
            current_app.logger.error(f"Errore: {e}")
            return jsonify({'error': str(e)}), 500
