
from config import db
import os
from flask import app, jsonify, request, Blueprint, current_app
import requests
import textwrap
import pickle
from langchain.document_loaders import UnstructuredPDFLoader, UnstructuredURLLoader
from langchain.indexes import VectorstoreIndexCreator
# Embeddings
from langchain.embeddings import HuggingFaceEmbeddings
# vector stores
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS
from langchain.text_splitter import CharacterTextSplitter
# Creating QA chain
from langchain.chains.question_answering import load_qa_chain
from langchain.chains import RetrievalQA
from langchain import HuggingFaceHub
from dotenv import load_dotenv
import os   # access to env variables using os.getenv
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI

chatbot = Blueprint('chatbot', __name__)
# HUGGING_FACE_API_KEY = os.getenv("HUGGINGFACEHUB_API_TOKEN")

def getDataFromDocuments(docs):
    loaders = [UnstructuredPDFLoader(os.path.join(docs, fn)) for fn in os.listdir(docs)]
    # print("\nloaders\n", loaders)
    data = []
    for loader in loaders:
        data.extend(loader.load())
    # print(f'\nprinting data length ...')
    return data

def splitDocuments(data):
    text_splitter = CharacterTextSplitter(separator='\n', chunk_size=1000, chunk_overlap=200)
    return text_splitter.split_documents(data)

def createOrLoadVectorstore(docs, embeddings):
    vectorstore_filename = "faiss_store_openai.pkl"
    if os.path.exists(vectorstore_filename):
        with open(vectorstore_filename, "rb") as f:
            VectorStore_openAI_obj = pickle.load(f)
    else:
        VectorStore_openAI_obj = FAISS.from_documents(docs, embeddings)
        with open(vectorstore_filename, "wb") as f:
            pickle.dump(VectorStore_openAI_obj, f)
    # print(f'\nprinting VectorStore_openAI ... {VectorStore_openAI}')
    return VectorStore_openAI_obj
    

def setupQAChain(retriever):
    llm = ChatOpenAI(temperature=0, model_name='gpt-3.5-turbo')
    return RetrievalQAWithSourcesChain.from_llm(llm=llm, retriever=retriever)

# setting up the chatbot
def setupChatbot():
    print("###########   SETTING UP CHATBOT   ###########\n")
    docs_folder = '../docs'
    # load and split the docs
    data = getDataFromDocuments(docs_folder)
    print("########### COLLECTING INFORMATION ###########")
    docs = splitDocuments(data)
    print("###########       SPLITTING        ###########")
    # create or load the vector store
    embeddings = OpenAIEmbeddings()
    print("###########   CREATING EMBEDDINGS  ###########")
    vector_store = createOrLoadVectorstore(docs, embeddings)
    print("########### CREATING VECTOR STORE  ###########")
    # setup the QA chain
    chain = setupQAChain(vector_store.as_retriever())
    print("###########  SETTING UP QA CHAIN   ###########")
    current_app.chain = chain
    print("########### CHATBOT SETUP COMPLETE ###########\n")

    # print(chain({'question': "Who are the developer``s in this project"}, return_only_outputs=True))

@chatbot.route('/ask', methods=['POST'])
def chatbot_ask():
    # chain = setupChatbot()
    # Get the question from the request body
    data = request.get_json()
    question = data.get('question')
    chain = current_app.chain
    # Use the chatbot to get the answer
    answer = chain({'question': question}, return_only_outputs=True)

    # Return the answer as a JSON response
    return jsonify(answer)


# print("Current Working Directory:", os.getcwd())
# pdf_folder_path = '../docs'
# print(os.listdir(pdf_folder_path))    # prints all the pdfs in the dir

# loaders = [UnstructuredPDFLoader(os.path.join(pdf_folder_path, fn)) for fn in os.listdir(pdf_folder_path)]
# print("\nloaders\n", loaders)

# # Load data for each PDF using the loaders
# data = []
# for loader in loaders:
#     data.extend(loader.load())  # Use extend instead of append to flatten the list

# print(f'\nprinting data length ... {len(data)}')
# # print("\ndata\n", data)

# # Text Splitter
# text_splitter = CharacterTextSplitter(separator='\n',
#                                       chunk_size=1000,  # token size of 1000
#                                       chunk_overlap=200)

# docs = text_splitter.split_documents(data)
# print(f'printing docs length ... {len(docs)}')

# # embeddings = HuggingFaceEmbeddings()
# embeddings = OpenAIEmbeddings()
# print(f'embeddings = {embeddings}')

# # storing the embeddings into vector stores
# # writing them to the disk so we don't have to recompute them
# # Check if the file already exists before reading or writing
# if os.path.exists("faiss_store_openai.pkl"):
#     with open("faiss_store_openai.pkl", "rb") as f:
#         VectorStore_openAI = pickle.load(f)
# else:
#     VectorStore_openAI = FAISS.from_documents(docs, embeddings)
#     with open("faiss_store_openai.pkl", "wb") as f:
#         pickle.dump(VectorStore_openAI, f)

# print(f'\nprinting VectorStore_openAI ... {VectorStore_openAI}')

# # retreiving information -
# llm=ChatOpenAI(temperature=0, model_name='gpt-3.5-turbo')  # using the default model
# print(f'\nllm = {llm}')

# chain = RetrievalQAWithSourcesChain.from_llm(llm=llm, retriever=VectorStore_openAI.as_retriever())

# print(chain({'question': "who are the developers in this project"}, return_only_outputs=True))