FROM golang:1.24

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

WORKDIR /app/cmd/pagcore
RUN go build -o /pagcore .

CMD ["/pagcore"]
