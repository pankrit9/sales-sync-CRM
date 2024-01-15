FROM python:3.10.6-slim-buster

WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y gcc swig curl
# Install Rust Compiler for tiktoken
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Download required NLTK datasets
RUN python -m nltk.downloader punkt

COPY . .

EXPOSE 6969

CMD ["gunicorn", "--workers=4", "--bind=0.0.0.0:6969", "server:app"]
# CMD ["python", "server.py"]

# FROM python:3.10.6
# # FROM python:latest

# WORKDIR /app

# COPY requirements.txt requirements.txt
# RUN pip install --upgrade pip
# RUN apt-get update && apt-get install -y gcc
# RUN pip install --no-cache-dir -r requirements.txt
# COPY . .

# EXPOSE 6969

# CMD ["python", "server.py"]