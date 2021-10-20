#!/bin/sh
readonly MAX_RETRIES=5

readonly HOST=$1
readonly PORT=$2
shift 2

i=0
while [ $i -lt $MAX_RETRIES ]; do
	printf '[%d/%d] waiting %d seconds...' "$((i + 1))" "$MAX_RETRIES" \
		"$((2 ** i))"

	# Wait before retrying
	sleep "$((2 ** i))"

	# Try to open a connection to $HOST:$PORT
	if nc -z -- "$HOST" "$PORT"; then
		exec "$@"
	fi

	i=$((i + 1))
done

# If we are here, then we could not reach the server. Return EXIT_FAILURE
echo "${HOST}:${PORT} did not respond in time, aborting"
exit 1
