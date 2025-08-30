build:
	npm run build

install:
	npm install --force

watch:
	npm run dev

open:
	open http://localhost:3000/

publish: build
	rm -rf docs
	mv -f build docs
	/bin/echo -n 'feign.mogproject.com' > docs/CNAME

.PHONY: build install watch open publish

