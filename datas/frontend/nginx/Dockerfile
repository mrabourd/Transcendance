FROM nginx:stable-alpine AS nginx_installation

#RUN openssl \
#	req \
#	-newkey rsa:4096 \
#	-x509 -sha256 \
#	-days 365 \
#	-nodes \
#	-out /etc/ssl/sethomas.42.fr.pem \
#	-keyout /etc/ssl/sethomas.42.fr.key \
#	-subj "/C=FR/ST=Paris/L=Paris/O=42 School/OU=sethomas/CN=sethomas.42.fr"

RUN mkdir -p /var/run/nginx
COPY ./conf/mime.types /etc/nginx/mime.types
COPY ./conf/nginx.conf /etc/nginx/nginx.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir -p /var/www/html
RUN chown -R nginx:nginx /var/www/* \
&& chmod -R 755 /var/www/*

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]