# Etap 1: Budowanie aplikacji przy użyciu Mavena i JDK 17 (lub 21)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etap 2: Uruchamianie aplikacji (chudszy obraz, tylko JRE)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
