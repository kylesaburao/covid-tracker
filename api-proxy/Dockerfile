FROM node:16-alpine
RUN npm install -g local-cors-proxy
EXPOSE 8010
CMD ["lcp", "--proxyUrl", "https://api.covid19tracker.ca/"]
