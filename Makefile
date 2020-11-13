install:
	docker run -it -v `pwd`:/usr/src/app -w /usr/src/app node:12 npm install

clean:
	docker-compose down

run: clean
	docker-compose up

start:
	docker run -it -v ".:/usr/src/app" -w "/usr/src/app" -p "1337:1337" --entrypoint="node forever.js" node:12

bash:
	docker run -it --rm -v `pwd`:/usr/src/app -w "/usr/src/app" --entrypoint=bash node:12

push:
	git push origin master && git push heroku master