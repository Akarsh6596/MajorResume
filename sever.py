import os
import torch
import nltk
import sys
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS  
from transformers import BartTokenizer, BartForConditionalGeneration, BertTokenizer
import PyPDF2
from summarizer import Summarizer

from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Set upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Download NLTK tokenizer
nltk.download("punkt")

# ✅ Load BART Model (for Abstractive Summarization)
bart_model_name = "facebook/bart-large-cnn"
bart_tokenizer = BartTokenizer.from_pretrained(bart_model_name)
bart_model = BartForConditionalGeneration.from_pretrained(bart_model_name)

# ✅ Load BERT Model (for Extractive Summarization)
# bert_model_name = "bert-base-uncased"  
# bert_tokenizer = BertTokenizer.from_pretrained(bert_model_name)



@app.route("/", methods=["GET"])
def home():
    return "Flask server is running!", 200

# Step 1: Extract text from PDF
def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, "rb") as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                extracted_text = page.extract_text()
                if extracted_text:
                    text += extracted_text + "\n"
        return text.strip()
    except Exception as e:
        return f"Error reading PDF: {e}"

# Step 2: Preprocess text
def split_text_into_sentences(text):
    return sent_tokenize(text)

# Step 3: BART Summarization (Abstractive)
def summarize_text_bart(text, max_length=260, min_length=250):
    inputs = bart_tokenizer(
        [text], max_length=1024, return_tensors="pt", truncation=True
    )
    summary_ids = bart_model.generate(
        inputs["input_ids"],
        num_beams=4,
        length_penalty=2.0,
        max_length=max_length,
        min_length=min_length,
        early_stopping=True,
    )
    summary = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

# Step 4: BERT Summarization (Extractive)
bert_model = Summarizer()
def summarize_text_bert(text):
    summary = bert_model(text, ratio=0.6,)  # Adjust ratio (e.g., 0.3 = 30% of the text)
    return summary
# def summarize_text_bert(text):
#     sentences = split_text_into_sentences(text)
#     if not sentences:
#         return "Error: No text to summarize."

#     inputs = bert_tokenizer(
#         sentences, padding=True, truncation=True, return_tensors="pt"
#     )

#     with torch.no_grad():  # ✅ Disable gradient tracking for inference
#         outputs = bert_model(**inputs)

#     scores = outputs.logits.detach().numpy().flatten()
    
#     sorted_indices = scores.argsort()[::-1][:5]  # Top 5 sentences
#     summary = " ".join([sentences[i] for i in sorted_indices])
    
#     return summary    

# API for BART Summarization
@app.route("/upload-pdf", methods=["POST"])
def upload_pdf_bart():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        extracted_text = extract_text_from_pdf(file_path)
        summary = summarize_text_bart(extracted_text)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API for BERT Summarization
@app.route("/upload-pdf-bert", methods=["POST"])
def upload_pdf_bert():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        extracted_text = extract_text_from_pdf(file_path)
        summary = summarize_text_bert(extracted_text)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def compute_cosine_similarity(text1, text2):
    vectorizer = TfidfVectorizer().fit_transform([text1, text2])
    vectors = vectorizer.toarray()
    return cosine_similarity([vectors[0]], [vectors[1]])[0][0] * 100
@app.route("/rank-resume", methods=["POST"])
def rank_resume():
    if "file" not in request.files or "job_description" not in request.form:
        return jsonify({"error": "File and job description are required"}), 400

    file = request.files["file"]
    job_description = request.form["job_description"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        extracted_text = extract_text_from_pdf(file_path)

        # Generate summaries
        bart_summary = summarize_text_bart(extracted_text)
        bert_summary = summarize_text_bert(extracted_text)

        # Compute similarity scores
        bart_similarity = compute_cosine_similarity(job_description, bart_summary)
        bert_similarity = compute_cosine_similarity(job_description, bert_summary)
        actual_text_similarity= compute_cosine_similarity(job_description,extracted_text)

        return jsonify({
            "name": request.form["name"],
            "job_description":job_description,
            "bart_similarity": round(bart_similarity),
            "bert_similarity": round(bert_similarity),
            "bart_summary"   : bart_summary,
            "bert_summary": bert_summary,
            "actual_text": extracted_text,
            "actual_text_similarity":actual_text_similarity,


        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
