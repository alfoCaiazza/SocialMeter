from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy

# Carica il tokenizer e il modello
tokenizer = AutoTokenizer.from_pretrained("neuraly/bert-base-italian-cased-sentiment")
model = AutoModelForSequenceClassification.from_pretrained("neuraly/bert-base-italian-cased-sentiment")

# Funzione per classificare il sentiment
def classify_sentiment(sentence):
    # Prepara i dati di input
    inputs = tokenizer(sentence, return_tensors="pt", truncation=True, max_length=512)

    # Ottieni le previsioni del modello
    outputs = model(**inputs)
    predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

    probability = predictions.detach().numpy()[0]

    # Converte le previsioni in sentimenti
    compound = predictions.argmax().item()
    if compound == 0:
        sentiment = "Negativo"
    elif compound == 1:
        sentiment = "Neutrale"
    else:
        sentiment = "Positivo"

    return compound, sentiment, probability

