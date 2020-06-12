## Steps to start project
You need to have mongodb running to start it:
* nvm use
* npm install
* npm start

You can use this endpoint `http://localhost:8000/healthcheck` to validate that everything is ok.

It can also be started using docker-compose:
```
docker-compose up -d
```


##  Endpoints
-----

| Path| Request Type|params|Permissions
| ----- | ---- |---- |---- |
|http://localhost:8000/healthcheck|GET|none|ALL
|http://localhost:8000/api/v1/user/register|POST|{ firstName, dni, password, userType, lastName, phone, email}|ALL
|http://localhost:8000/api/v1/user/login|POST|{  dni, password}|ALL
|http://localhost:8000/api/v1/user/getAssignedTickets|GET|none|WORKER
|http://localhost:8000/api/v1/user/getWorkers|GET|none|ADMIN
|http://localhost:8000/api/v1/service/createService|POST|{ name, description }|ADMIN
|http://localhost:8000/api/v1/service/getServices|GET|none|ADMIN
|http://localhost:8000/api/v1/workerService/getWorkerServices|GET|none|WORKER
|http://localhost:8000/api/v1/workerService/createWorkerService|POST|{ workerId, serviceId }|ADMIN, WORKER
|http://localhost:8000/api/v1/ticket/createTicket|POST|{ serviceId, address, latitude, longitude, notes, date }|CLIENT
|http://localhost:8000/api/v1/ticket/updateTicket|POST|{ id, status, address, latitude,longitude,notes, date, workerId, serviceId, rating}|WORKER, ADMIN, CLIENT
|http://localhost:8000/api/v1/ticket/tracking/:token|GET|none|CLIENT
|http://localhost:8000/api/v1/ticket/rating/:token/:rating|GET|none|CLIENT



## Flow
The first thing to do is register the necessary users, in this case we will need 1 user type `ADMIN`, another type` CLIENT` and another type `WORKER`, this user is created with the following endpoint:

`http://localhost:8000/api/v1/user/register`

* params:
```json
{
  "firstName":"Admin",
  "userType": "ADMIN",
  "dni": "123456",
  "password": "123456"
}
```

Then we will need to login to obtain the accessToken, without this token it is not possible to use the other endpoints, we must login with an admin type user to be able to create the services:

`http://localhost:8000/api/v1/user/login`

* params:
```json
{
  "dni": "123456",
  "password": "123456"
}
```

This endpoint will return an `accessToken` this token is necessary to put it in the headers:

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWUyZTUyODViYzM2NjI0ZDU1OGQ2MTMiLCJuYW1lIjoiQ2FybG9zICIsInJvbGUiOiJDTElFTlQiLCJpYXQiOjE1OTE5NDE1MTcsImV4cCI6MTU5MjAyNzkxN30.pqZpkunzM9DX-xjwwiERh68FsRVio4cB6RYym9hexHU
```

Then we will need to create associate the services to the worker:

`http://localhost:8000/api/v1/workerService/createWorkerService`

* params:
```json
{
"workerId": "5ee3450c306d676cb40cb3da",
"serviceId": "5ee3459a306d676cb40cb3db"
}
```

when we have already associated services with the worker, we can create a request using the token of a user type `CLIENT`:

`http://localhost:8000/api/v1/ticket/createTicket`

* params:
```json
{
"serviceId": "5ee3459a306d676cb40cb3db",
"date": "2020-06-12T05:20:51-05:00",
"address": "Carrera 85A",
"latitude": 3.373132,
"longitude": -76.509749
}
```


## Models


### Service

| Field| Type| Required
| ----- | ---- | ---- |
|name|string|true|
|description|string|false|

----

### Ticket

| Field| Type| Required
| ----- | ---- | ---- |
|token|string|false|
|status|'CREATED', 'ASSIGNED', 'IN_PROGRESS', 'FINISHED'|false|
|clientId|string|true|
|workerId|string|false|
|serviceId|string|false|
|rating|number|false|
|address|string|false|
|latitude|number|false|
|longitude|number|false|
|date|Date|true|
|notes|number|false|

----

### Ticket

| Field| Type| Required
| ----- | ---- | ---- |
|firstName|string|true|
|lastName|string|false|
|status|'CLIENT', 'WORKER', 'ADMIN'|false|
|phone|string|true|
|email|string|false|
|password|string|false|
|dni|number|true|

----

### WorkerService

| Field| Type| Required
| ----- | ---- | ---- |
|workerId|string|true|
|serviceId|string|true|


## Data model
- https://app.diagrams.net/#G13QCN4TYbrngMTrdj4r8gueiKR87F6gPD

