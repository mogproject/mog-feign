build:
	npm run build

install:
	npm install --force

clean:
	rm -rf ./node_modules

watch:
	npm run dev

open:
	open http://localhost:3000/

.PHONY: build install clean watch open

