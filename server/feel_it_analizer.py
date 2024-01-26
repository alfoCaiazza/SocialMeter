def translate_emotion(emozione):
    traduzioni = {
        "joy": "Gioia",
        "anger": "Rabbia",
        "sadness": "Tristezza",
        "fear": "Paura",
    }
    return traduzioni.get(emozione, emozione)

def get_emotion(text, emotion_classifier):
    emotions = emotion_classifier.predict([text])

    return translate_emotion(emotions[0])

