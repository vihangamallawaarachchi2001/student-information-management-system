docker exec -it student-information-mysql mysql -uroot -proot

pnpm db:validate

pnpm db:format

pnpm db:generate

pnpm db:migrate --name init

pnpm db:studio

