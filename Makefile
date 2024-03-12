all: build up

build:
	docker compose -f ./srcs/docker-compose.yml build

up:
	docker compose -f ./srcs/docker-compose.yml up -d
	
down:
	docker compose -f ./srcs/docker-compose.yml down
	
logs:
	docker logs nginx

migration:
	docker exec backend python manage.py migrate --noinput 

clean: down
	docker rmi -f $$(docker images -qa);\
	docker volume rm $$(docker volume ls -q);
	docker system prune

fclean: clean

see_db:
	docker exec db psql --username=hello_django --dbname=hello_django_dev

re: clean up
	docker ps -a

.Phony: all logs clean fclean