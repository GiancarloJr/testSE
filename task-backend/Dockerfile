## Build stage
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Cache dependencies first
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw

RUN chmod +x mvnw

RUN ./mvnw -q -DskipTests dependency:go-offline

# Build
COPY src src
RUN ./mvnw -q -DskipTests package


## Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]
