.DELETE_ON_ERROR:
.ONESHELL:

src/activity.json: activity.graphql
	gh api graphql -f query="$$(cat $<)" > $@
