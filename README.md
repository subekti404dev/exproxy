# exproxy
very simple proxy to encrypt (aes-256-cbc) your rest api

![exproxy](images/exproxy1.png)

Running with docker

```yaml
version: "3.6"
services:
  proxy:
    container_name: "exproxy"
    image: "subekti13/exproxy:latest"
    ports:
      - 3000:3000
    restart: "unless-stopped"
    environment:
      - USERNAME=urip
      - PASSWORD=urip
```

dashboard: `http://localhost:3000/_admin`
now you can access your api over :
`http://localhost:3000/?url=<real-api-url>`
