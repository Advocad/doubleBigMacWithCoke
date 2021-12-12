Нужно отдельно устанавливать и запускать сервер и клиент

# Установить и запустить сервер

```
yarn
yarn start
```

# Установить и запустить клиент

```
cd client
yarn
yarn start
```

# Для деплоя 
```
heroku login
git push heroku {branch-name}:master
```

Для проброса переменных окружения:
heroku config:set VARIABLE=VALUE

