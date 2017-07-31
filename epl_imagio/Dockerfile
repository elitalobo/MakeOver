FROM node:argon

RUN mkdir -p /usr/src/app
RUN mkdir -p /var/log/app_engine && mkdir -p /var/log/app_engine/custom_logs
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
EXPOSE 8000
EXPOSE 9000
ENTRYPOINT ["npm"]
CMD ["start"]

