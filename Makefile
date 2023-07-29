DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres

# .env をロードして上記デフォルト値と一致する環境変数をオーバーライドする
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: init
init: ## リポジトリを clone したら最初に叩くコマンド
	npm install -g ibm-openapi-validator
	pm install @redocly/cli -g
	go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest
	brew install golang-migrate
	go install github.com/volatiletech/sqlboiler/v4@latest
	go install github.com/volatiletech/sqlboiler/v4/drivers/sqlboiler-psql@latest
	make bridge
	make create

.PHONY: bridge
bridge: ## docker network を生成する
	@if [ -z "$$(docker network ls -q -f name='^xena-network$\')" ]; then docker network create xena-network; fi

.PHONY: up
up: ## バックグラウンドで起動
	@make bridge
	@docker compose up ${SERVICES} -d ${OPTS}

.PHONY: resetdb
resetdb: ## DB を再構築 -> マイグレーションを適用
	make dropdb
	make createdb
	make up
	make migrate-up

.PHONY: dropdb
dropdb: ## DB を破棄する
	@docker compose down db
	@docker compose up -d db
	@docker compose exec db sh -c "PGPASSWORD=$(DB_PASSWORD) dropdb $(DB_NAME) -h db -U $(DB_USER)"

.PHONY: createdb
createdb: ## DB を構築する
	@docker compose up -d db
	@docker compose exec db sh -c "PGPASSWORD=$(DB_PASSWORD) createdb $(DB_NAME) -h db -U $(DB_USER)"

.PHONY: migrate-up
migrate-up: ## マイグレーションを最新まで適用する
	migrate -database "postgresql://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?sslmode=disable" -path "server/migration" up
	make boiler

.PHONY: migrate-down
migrate-down: ## マイグレーションを巻き戻す
	migrate -database "postgresql://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?sslmode=disable" -path "server/migration" down
	make boiler

.PHONY: boiler
boiler: ## sqlboiler を実行する
	cd server && sqlboiler psql

.PHONY: migrate-redo
migrate-redo: ## マイグレーションを1世代戻してから1世代進める。冪等性の確認に使ってください
	migrate -database "postgresql://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?sslmode=disable" -path "server/migration" down 1
	migrate -database "postgresql://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?sslmode=disable" -path "server/migration" up 1
	@make migrate-status

.PHONY: migrate-status
migrate-status: ## マイグレーションのステータスを確認する
	@ls server/migration/ | grep up.sql | sed s/.up.sql//g | sed s/\_/\ /
	@echo "current version:"
	@migrate -database "postgresql://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?sslmode=disable" -path "server/migration" version

.PHONY: migrate-create
migrate-create: ## マイグレーションファイルを生成する
	@read -p "migration name: " name; \
	migrate create -ext sql -dir server/migration -seq $$name

.PHONY: go-mod-tidy
go-mod-tidy:
	cd server && go mod tidy

.PHONY: openapi
openapi: ## openapi の lint とサーバのコード生成
	cd server && \
		lint-openapi ./schema/root.yaml && \
		echo "= lint OK ====\n" && \
		redocly bundle ./schema/root.yaml -o ./schema/root.gen.yaml && \
		echo "= bundle OK ====\n" && \
		oapi-codegen -generate gin -package server -o api/server/server_gen.go ./schema/root.gen.yaml && \
		oapi-codegen -generate types -package component -o api/component/model_gen.go ./schema/root.gen.yaml && \
		echo "= codegen OK ====\n"
