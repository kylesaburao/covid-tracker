# COVID Tracker

## About

Uses the Canadian data API provided from `https://api.covid19tracker.ca/docs/1.0/overview`

![image](https://user-images.githubusercontent.com/20251568/129493761-5c368261-008c-43a9-8cbd-5471a865d8c9.png)

## Dependencies

- Docker
  - Support for Linux-based images

## Development

### Deployment

`docker compose up --build`

- Hosted on `localhost:80`
- All code changes on the host will automatically reflect inside the container.
- npm package changes require a rerun of docker compose.

#### Refresh node_modules after dependency update for an active deployement

`docker compose exec app npm install`

- Required when package*.json is changed. `npm install` on the host won't update the node_modules volume inside the container.

## Production

### Deployment

*Not configured*
