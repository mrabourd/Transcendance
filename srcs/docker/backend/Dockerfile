
#https://github.com/docker/awesome-compose/tree/master/official-documentation-samples/django/
#https://vsupalov.com/problem-django-development-workflow/




#https://www.codingforentrepreneurs.com/blog/django-on-docker/

# Avant de lancer le container creer le projet django dans le volume dedie au Backend
# python -m venv env
# source ./env/bin/activate
# pip install django
# pip freeze > requirements.txt
###### requirements est a copier dans docker/backend/tools pour avoir le mm env. 
# django-admin startproject transcendance
###### creation des fichiers de base
#
#

#FROM python:3.8.3-slim

#ENV PYTHONDONTWRITEBYTECODE=1
#ENV PYTHONUNBUFFERED=1

#RUN mkdir -p /code
#WORKDIR /code
#RUN python -m pip install --upgrade pip
#RUN python -m venv /opt/venv
#RUN source ./env/bin/activate

#RUN pip install django
#RUN pip freeze > requirements_srcs.txt
#RUN django-admin startproject transcendance
#COPY tools/requirements.txt /code/
#RUN pip install -r /code/requirements.txt

#EXPOSE 9000

#COPY ./tools/entrypoint.sh /code
#RUN chmod +x /code/entrypoint.sh

#ENTRYPOINT ["sh", "/code/entrypoint.sh"]



# pull official base image
FROM python:3.11.4-slim-buster

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update && apt-get install -y netcat

# install dependencies
RUN pip install --upgrade pip
COPY ./tools/requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./tools/entrypoint.sh /usr/src/app/entrypoint.sh
#RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Exposez le port sur lequel Django s'exécutera
EXPOSE 8001

# copy project

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]