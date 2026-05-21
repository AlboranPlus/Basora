.PHONY: up down build backend-dev frontend-dev test lint clean

up:
	docker compose up --build

down:
	docker compose down

build:
	docker compose build

backend-dev:
	cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

frontend-dev:
	cd frontend && npm run dev

test:
	cd backend && ./mvnw test
	cd frontend && npm run test

lint:
	cd frontend && npm run lint

clean:
	cd backend && ./mvnw clean
	cd frontend && rm -rf dist node_modules/.cache
