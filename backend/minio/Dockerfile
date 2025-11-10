# Start from the official MinIO image
FROM minio/minio:latest

# Copy our custom wrapper script into the image
COPY custom-entrypoint.sh /usr/bin/custom-entrypoint.sh

# Make it executable
RUN chmod +x /usr/bin/custom-entrypoint.sh

# Set our script as the new entrypoint
ENTRYPOINT ["/usr/bin/custom-entrypoint.sh"]

# The default command from the base image is "minio".
# This will be overridden by the 'command:' in docker-compose.yml.
CMD ["minio"]
