# Social Media Analysis Web App

This project, developed as a bachelor's thesis in Computer Science, is a web application that utilizes scraping techniques combined with a sentiment classifier for the Italian language based on BERT (neuraly/bert-base-italian-cased-sentiment). It allows users to explore Reddit posts on controversial topics such as sexism, racism, and climate change. Additionally, it provides details on sentiment analysis of the posts, visualization of sentiment trends over time, and hot topics for each category and sentiment.

## Main Functionalities

1. **Post Exploration:** Navigate through posts related to various controversial topics, utilizing detailed sentiment analysis insights.

2. **Sentiment Trends:** View the trends of sentiments over time to better understand the evolution of discussions.

3. **Hot Topics by Category:** Discover the most discussed themes in relation to each category and sentiment.

## Installation and Usage

To launch the application, ensure that you have installed:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

## Startup instructions

1. Open the terminal in React client directory:
    ```bash
    cd path/Redditanalysis/redditanalysis/client
    ```

2. Install client dependencies:
    ```bash
    npm install
    ```

3. Launch React client:
    ```bash
    npm start
    ```

4. Open a second terminal in Flask server directory:
    ```bash
    cd path/Redditanalysis/redditanalysis/server
    ```

5. Install server dependencies:
    ```bash
    pip install -r requirements.txt
    ```

6. Launch Flask server:
    ```bash
    python app.py
    ```

7. Access the web app through the browser at the address [http://localhost:3000/](http://localhost:3000/)

## Third Part Dependencies

This project uses several third-party dependencies, including:

- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) to handle cross-origin requests.
- [Axios](https://axios-http.com/) to perform HTTP requests..
- [Bootstrap](https://getbootstrap.com/) for style and layout.
- [Pymongo](https://pymongo.readthedocs.io/) for connecting to the MongoDB database.
- [React Router DOM](https://reactrouter.com/web/guides/quick-start) for managing routes in the React client.
- [Pandas](https://pandas.pydata.org/) for data manipulation and analysis.
- [PyTorch](https://pytorch.org/) for machine learning and deep learning applications.
- [BERT](https://huggingface.co/transformers/model_doc/bert.html )as a pre-trained model for natural language processing tasks.
- [Transformers](https://huggingface.co/transformers/ )for state-of-the-art natural language processing, including utilities for working with models like BERT.
- [Matrix Profile](https://matrixprofile.org/ )for advanced time series analysis.



---

*Note: The versions of the dependencies are managed considering Python 3.9.*
