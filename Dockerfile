FROM node

RUN mkdir /var/web

WORKDIR /var/web

COPY ./web /var/web

EXPOSE 3000

CMD npm i \
	&& npm run build \
	&& npm run start
