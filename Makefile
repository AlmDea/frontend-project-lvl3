install:
	npm install

dev:
	npx cross-env NODE_ENV=development webpack --mode development

build:
	npm run build

serve:
	npx cross-env NODE_ENV=development webpack serve --mode development --open

lint:
	npx eslint .
