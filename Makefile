test:
	@NODE_ENV=test ./node_modules/.bin/mocha $(TESTS) 

test-watch: 
	@NODE_ENV=test ./node_modules/.bin/mocha $(TESTS) --watch

.PHONY: test test-watch
