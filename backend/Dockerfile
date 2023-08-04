FROM python:latest

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y gcc
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 6969

CMD ["python", "server.py"]