
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



# Utilisez une image de base avec Python et votre version préférée
FROM python:3

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

#PYTHONDONTWRITEBYTECODE
#If this is set to a non-empty string, Python won’t try to write .pyc files
#on the import of source modules. This is equivalent to specifying the -B optio
ENV PYTHONDONTWRITEBYTECODE=1

#PYTHONUNBUFFERED
#Force the stdout and stderr streams to be unbuffered. This option has no effect on the stdin stream.
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip
# Copiez le fichier requirements.txt dans le conteneur
COPY tools/requirements.txt .

# Installez les dépendances Python
RUN pip install -r requirements.txt
RUN pip install django-cors-headers

# Exposez le port sur lequel Django s'exécutera
EXPOSE 8001

# Commande pour exécuter votre application Django
CMD ["python", "transcendance/manage.py", "runserver", "0.0.0.0:8001"]
