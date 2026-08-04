# Etapa 1: Construcción
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: Producción
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
# Render necesita saber por qué puerto escuchar
ENV ASPNETCORE_HTTP_PORTS=8080
ENTRYPOINT ["dotnet", "FixTrackApp.API.dll"]