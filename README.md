# UVic Environmental Engineering Club - usv-server

This is the software that is going to run inside a cloud service.
WebSocket (Socket.io) server that communicates between ground station and USV.

[Project Structure for USV](https://github.com/UVic-Environmental-Engineering-Club/USV-Pi/wiki/Project-Structure)

## Docker

- To build the docker image
  - `docker build -t usv-server .`
- To run the docker container and open the shell
  - On Unix: `docker run -it --name usv-server --rm --volume $(pwd):/app -p 4000:4000 usv-server:latest sh`
  - On Windows: `docker run -it --name usv-server --rm --volume ${pwd}:/app -p 4000:4000 usv-server:latest sh`
  - Then in the shell use `yarn dev` to start the docker shell

## Running the server

_(Can be run without docker, just install yarn `npm install -g yarn`, `yarn install`, `yarn dev`)_

1. `yarn dev`

- To run in dev

2. `yarn start`

- To run as production

Note: `yarn prettier` to clean up code
