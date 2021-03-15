FROM envoyproxy/envoy-alpine:v1.17.1 as envoy_binaries

FROM frolvlad/alpine-glibc

RUN apk upgrade --no-cache \
  && apk add --no-cache nodejs yarn s6 \
  && rm -rf /var/cache/apk/*

COPY --from=envoy_binaries /usr/local/bin/envoy /usr/local/bin/envoy
COPY ./etc /etc

WORKDIR /app
COPY . .
ADD https://wartek-id.gitlab.io/api/image.bin image.bin
RUN yarn --production

ENV ENVOY_CONFIG=/etc/envoy/envoy.yaml
RUN node envoy
RUN cat /etc/envoy/envoy.yaml
ENTRYPOINT [ "/bin/s6-svscan", "/etc/s6" ]
