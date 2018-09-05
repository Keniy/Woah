FROM nginx
MAINTAINER liugy
RUN rm /usr/local/nginx/conf/nginx.conf
ADD default.conf /usr/local/nginx/conf/
COPY dist/ /usr/share/nginx/html/