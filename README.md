# UVic Environmental Engineering Club - usv-server

This is the software that is going to run inside a AWS.
WebSocket (Socket.io) server that communicates between ground station and USV.

To work properly, this needs to run on conjunction with the other repos:

- usv-pi
- usv-ground-station

[Project Structure for USV](https://github.com/UVic-Environmental-Engineering-Club/USV-Pi/wiki/Project-Structure)

## Running the server

_(Can be run without docker, just install yarn `npm install -g yarn`, `yarn install`, `yarn dev`)_

1. `yarn dev`

- To run in dev

2. `yarn prettier --write .`

- run prettier to clean up code

3. `yarn start`

- To run as production

Note: `yarn prettier` to clean up code

## Structure of Repo

This Socket.io project has two namespaces:

1. usvNamespace
2. groundstationNamespace

### groundstationNamespace

- On connection, it sends the current route that is set to update its state from before it was connected
- The route can be modified by sending certain events:
  - adding points
  - deleting points
  - clearing the points etc..
- Everytime the route is changed it is forwarded to any device connected to the `usvNamespace`

### usvNamespace

- On connection, it receives the current route
- Receives all updates from groundstationNamespace
- Forwards logs received from the usv to grounstationNamespace
