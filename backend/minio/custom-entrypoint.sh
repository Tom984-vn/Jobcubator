#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Define the paths to the secret files
MINIO_USER_FILE="/run/secrets/spring_aws_s3_access_key"
MINIO_PASS_FILE="/run/secrets/spring_aws_s3_secret_key"

# Check if the user secret file exists, read it, and export the env var
if [ -f "$MINIO_USER_FILE" ]; then
    export MINIO_ROOT_USER=$(cat "$MINIO_USER_FILE")
fi

# Check if the password secret file exists, read it, and export the env var
if [ -f "$MINIO_PASS_FILE" ]; then
    export MINIO_ROOT_PASSWORD=$(cat "$MINIO_PASS_FILE")
fi

# Now, execute the original command passed to the container
# (which will be "server /data --console-address :9001" from our compose file)
# The minio process will inherit the exported variables.
exec minio "$@"
