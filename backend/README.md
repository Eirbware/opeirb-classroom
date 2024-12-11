# Pocketbase server

## Initialization

Download and copy the `pocketbase` [portable executable](https://pocketbase.io/docs/) into this directory.

Then, create your pocketbase instance (database tables + collection rules) with
this command

```sh
./pocketbase migrate up
```

Next, add your superuser credentials

```sh
./pocketbase superuser create $SUPERUSER_EMAIL $SUPERUSER_PASSWORD
```

Run, your pocketbase server

```sh
./pocketbase serve
```

Finally, go into the admin interface at `http://127.0.0.1:8090/_` and setup into
the `users` collection the `oidc` and `github` client.
