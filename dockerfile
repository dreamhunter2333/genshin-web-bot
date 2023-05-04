FROM debian:stable AS resource

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y wget xz-utils dos2unix \
    && wget https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-$(dpkg --print-architecture)-static.tar.xz \
    && mkdir -p /res/ffmpeg \
    && tar -xvf ./ffmpeg-git-$(dpkg --print-architecture)-static.tar.xz -C /res/ffmpeg --strip-components 1

FROM node:lts-slim AS runtime

COPY --from=resource /res/ffmpeg/ffmpeg /usr/bin/ffmpeg

COPY --from=resource /res/ffmpeg/ffprobe /usr/bin/ffprobe

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y curl wget fonts-wqy-microhei xfonts-utils chromium fontconfig libxss1 libgl1 \
    && apt-get autoremove \
    && apt-get clean \
    && fc-cache -f -v \
    && npm install pnpm -g && rm -rf /var/cache/* && rm -rf /tmp/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app/Yunzai-Bot
COPY Yunzai-Bot /app/Yunzai-Bot
RUN pnpm install
COPY dist/ /app/Yunzai-Bot/web-data/
COPY config /app/Yunzai-Bot/config

ENTRYPOINT ["pnpm", "index"]
