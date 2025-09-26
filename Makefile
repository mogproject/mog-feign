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

publish: build
	rm -rf docs
	mv -f dist docs
	/bin/echo -n 'feignv1.mogproject.com' > docs/CNAME

.PHONY: build install clean watch open publish

