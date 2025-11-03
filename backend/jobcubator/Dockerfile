FROM maven:3.9.11-eclipse-temurin-21-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml first to leverage Docker's layer caching
# If the pom.xml hasn't changed, Docker will reuse this layer
COPY pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline

# Copy the rest of your source code
COPY src ./src

# Package the application, skipping the tests
# This creates the .jar file in the /app/target/ directory
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# This is the magic. Copy *only* the built .jar file
# from the "builder" stage into this new image.
# We rename it to app.jar for a clean, predictable name.
#
# IMPORTANT: Update "my-app-name-0.0.1-SNAPSHOT.jar"
# to match the final .jar name in your 'target' directory!
# You can find this in your pom.xml <artifactId> and <version>.
#
# If you're not sure, you can use a wildcard:
# COPY --from=builder /app/target/*.jar app.jar
COPY --from=builder /app/target/jobcubator-0.0.1-SNAPSHOT.jar app.jar

# Expose the port that your Spring Boot application runs on
EXPOSE 8080

# The command to run your application
#ENTRYPOINT ["","java", "-jar", "app.jar"]
ENTRYPOINT  export JWT_SECRET_KEY=$(cat /run/secrets/jwt_secret_key) && export SPRING_DATASOURCE_PASSWORD=$(cat /run/secrets/db_app_password | tr -d '\n' | tr -d '\r') && exec java -jar app.jar
