build:
	npm run build

install:
	npm install --force

clean:
	rm -rf ./node_modules

watch:
	npm run dev -- --host 0.0.0.0

test:
	npx playwright install 
	NODE_NO_WARNINGS=1 npx vitest run
	npx playwright test

coverage:
	NODE_NO_WARNINGS=1 npm run coverage

open:
	open http://localhost:3000/

.PHONY: build install clean watch test coverage open

