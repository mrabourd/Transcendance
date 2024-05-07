# pull official base image
FROM python:3.11.4-slim-buster

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update && apt-get install -y netcat openssl


RUN openssl \
	req \
	-newkey rsa:4096 \
	-x509 -sha256 \
	-days 365 \
	-nodes \
	-out /etc/ssl/sethomas.42.fr.cert \
	-keyout /etc/ssl/sethomas.42.fr.key \
	-subj "/C=FR/ST=Paris/L=Paris/O=42 School/OU=sethomas/CN=sethomas.42.fr"

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
 && pip install --no-cache-dir gunicorn \
 && apt-get purge -y --auto-remove gcc \
 && rm -rf /var/lib/apt/lists/*

# copy project
COPY . .

EXPOSE 8000

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["daphne -b localhost -p 8000 hello_django.asgi:application" \
	"--keyfile", "/etc/ssl/sethomas.42.fr.key", \
    "--certfile", "/etc/ssl/sethomas.42.fr.cert"]


# CMD ["gunicorn", \
#     "users.wsgi:application", \
#     "--bind", "0.0.0.0:8000", \
#     "--keyfile", "/etc/ssl/sethomas.42.fr.key", \
#     "--certfile", "/etc/ssl/sethomas.42.fr.cert"]