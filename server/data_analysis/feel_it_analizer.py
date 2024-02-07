def translate_emotion(emozione):
    traduzioni = {
        "joy": "Gioia",
        "anger": "Rabbia",
        "sadness": "Tristezza",
        "fear": "Paura",
    }
    return traduzioni.get(emozione, emozione)

def translate_sentiment(sentimento):
    traduzioni = {
        "negative": "Negativo",
        "positive": "Positivo",
    }
    return traduzioni.get(sentimento, sentimento)

def get_emotion(text, emotion_classifier):
    emotions = emotion_classifier.predict([text])

    return translate_emotion(emotions[0])

def get_sentiment(text, sentiment_classifier):
    sentiments = sentiment_classifier.predict([text])

    return translate_sentiment(sentiments[0])