#!/bin/sh
#python manage.py makemigrations --noinput
#python manage.py migrate --noinput

# Ajouter les utilisateurs par défaut
#python manage.py add_default_data
#python manage.py collectstatic --noinput

# Enlever le watch_file à la fin du projet srcs/app/transcendence/management/commands/watch_file.py
#python manage.py watch_file &
#python manage.py runserver
#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# python manage.py flush --no-input
# python manage.py migrate

exec "$@"