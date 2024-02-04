import torch

# Function to Classify Sentiment
def classify_sentiment(sentence, tokenizer, model):
    # Prepare input data
    inputs = tokenizer(sentence, return_tensors="pt", truncation=True, max_length=512)

    # Get model predictions
    outputs = model(**inputs)
    predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

    probability = predictions.detach().numpy()[0]

    # Convert predictions into sentiment strings
    compound = predictions.argmax().item()
    if compound == 0:
        sentiment = "Negativo"
    elif compound == 1:
        sentiment = "Neutrale"
    else:
        sentiment = "Positivo"

    return compound, sentiment, probability

