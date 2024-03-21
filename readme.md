##### How to use

- url de base : http://127.0.0.1:8000/
- All data must be sent in JSON format

> | name                      |  type     | data                       |
> |-----------                |-----------|-----------------           |
> | /api/users/register/      |  POST     | email, password, username  | 
> | /api/auth/login/          |  POST     | usrename, password         |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `text/plain;charset=UTF-8`        | `Configuration created successfully`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example cURL

> ```javascript
>  curl -X POST -d 'username=louise&email=louise@example.com&password=crocodile237' "http://127.0.0.1:8000/api/users/register/" \
-H  "accept: application/json"
> ```