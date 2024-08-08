FROM --platform=linux/amd64 node:bookworm

RUN apt-get update && \
    apt-get install -y python3-venv && \
    apt-get clean

ARG APP_DIR="/app"

COPY . ${APP_DIR}
WORKDIR ${APP_DIR}
# Important.  REMOVE the .venv copied in by the first COPY of . ABOVE!
RUN yarn install && \
    rm -rf .venv && \
    python3 -m venv .venv && \
    . .venv/bin/activate && \
    pip install -U pip && \
    pip3 install -r requirements.txt && \
    mkdir -p cypress/fixtures && \
    yarn build
ENV PATH="$APP_DIR/.venv/bin:$PATH"

# Run the application
CMD . .venv/bin/activate && python wsgi.py

LABEL org.opencontainers.image.source=https://github.com/code-genome/codegenome_ui
