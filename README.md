# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


YouTube Comment Sentiment Analysis Using Multiple Algorithms
This project aims to perform sentiment analysis on YouTube comments using a variety of machine learning algorithms, including Support Vector Machine (SVM), Random Forest, Naive Bayes, and deep learning models such as Recurrent Neural Networks (RNN) and Long Short-Term Memory (LSTM). The goal is to classify YouTube comments as either positive, negative, or neutral based on the content of the text.

Project Overview
With the growing amount of content being uploaded on YouTube, sentiment analysis plays a key role in understanding user feedback, analyzing viewer sentiments, and enhancing user experiences. This project applies different machine learning and deep learning algorithms to classify YouTube comments into three categories:

Positive Sentiment
Negative Sentiment
Neutral Sentiment
The model employs a range of techniques, from traditional machine learning models like SVM and Naive Bayes to more advanced models like RNNs and LSTMs.

Features
Text Preprocessing: Cleans the raw YouTube comment data, including tokenization, stopwords removal, and text normalization.
Feature Extraction: Converts text data into numerical format using techniques like TF-IDF (Term Frequency-Inverse Document Frequency) and word embeddings.
Machine Learning Models:
Support Vector Machine (SVM)
Random Forest
Naive Bayes
Deep Learning Models:
Recurrent Neural Networks (RNN)
Long Short-Term Memory (LSTM)
Evaluation Metrics: Accuracy, precision, recall, and F1-score for evaluating model performance.

Key Libraries:
pandas
numpy
scikit-learn
nltk
keras or tensorflow
matplotlib
seaborn

Dataset
The dataset used in this project consists of YouTube comments. It contains a variety of comments, and each comment is labeled with one of the sentiment categories (positive, negative, or neutral). You can find the dataset in the data/ directory (or you can use your own dataset).

The dataset should be in CSV format with at least two columns:

comment: The text of the YouTube comment.
sentiment: The sentiment label (positive, negative, or neutral).
Example:

comment	sentiment
"I love this video! It was really helpful."	positive
"This was the worst tutorial I have seen."	negative
"I didn't find this video useful."	neutral


Usage
1. Data Preprocessing:
The preprocess_data.py script handles tokenization, stopword removal, and text normalization.
This script prepares the data for feature extraction.
2. Feature Extraction:
The feature_extraction.py script converts text data into numerical representations using TF-IDF or word embeddings (Word2Vec, GloVe, etc.).
3. Training the Models:
Train different models on the preprocessed and feature-extracted dataset.
The train_model.py script trains the following algorithms:
Support Vector Machine (SVM)
Random Forest
Naive Bayes
Recurrent Neural Network (RNN)
Long Short-Term Memory (LSTM)

