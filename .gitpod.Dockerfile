FROM gitpod/workspace-postgres

RUN sudo apt-get update \
    && sudo apt-get install -y \
        imagemagick ffmpeg libpq-dev libxml2-dev libxslt1-dev file git-core \
        g++ libprotobuf-dev protobuf-compiler pkg-config nodejs gcc autoconf \
        bison build-essential libssl-dev libyaml-dev libreadline6-dev \
        zlib1g-dev libncurses5-dev libffi-dev libgdbm-dev \
        redis-server redis-tools \
        libidn11-dev libicu-dev libjemalloc-dev \
    && sudo rm -rf /var/lib/apt/lists/*
