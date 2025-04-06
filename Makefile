.DELETE_ON_ERROR:
.ONESHELL:

.PHONY: all
all: dist/index.html

dist/index.html: src/activity.json
	npm run build

src/activity.json: activity.graphql
	gh api graphql -f query="$$(cat $<)" > $@
