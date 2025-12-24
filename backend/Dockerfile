# ===== BUILD STAGE =====
FROM maven:3.9.6-amazoncorretto-17 AS build
WORKDIR /app

# Copie d'abord les fichiers Maven pour profiter du cache
COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw mvnw
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline

# Puis le code
COPY src src
RUN ./mvnw -q -DskipTests package

# ===== RUN STAGE =====
FROM amazoncorretto:17-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
