.PHONY: test

all:

test:
	node ./node_modules/mocha/bin/mocha  test/*/*.js
