FROM gitpod/workspace-postgres

RUN sudo apt-get update \
    && sudo apt-get install -y \
        imagemagick ffmpeg libpq-dev libxml2-dev libxslt1-dev file git-core \
        g++ libprotobuf-dev protobuf-compiler pkg-config gcc autoconf \
        bison build-essential libssl-dev libyaml-dev libreadline6-dev \
        zlib1g-dev libncurses5-dev libffi-dev libgdbm-dev \
        redis-server redis-tools \
        libidn11-dev libicu-dev libjemalloc-dev \
    && sudo rm -rf /var/lib/apt/lists/*

USER gitpod

RUN printf "\n# Auto-set mastodon env vars.\n" >> ~/.bashrc && \
    echo 'export RAILS_ENV=development'  >> ~/.bashrc && \
    echo 'export LOCAL_HTTPS=true'  >> ~/.bashrc && \
    echo 'export LOCAL_DOMAIN=$(gp url 3000 | sed -e "s/^https\?:\/\///")'  >> ~/.bashrc && \
    echo 'export STREAMING_API_BASE_URL="wss://$(gp url 4000 | sed -e "s/^https\?:\/\///")"' >> ~/.bashrc && \
    echo 'MASTODON_WDS_DOMAIN=$(gp url 3035 | sed -e "s/^https\?:\/\///")'  >> ~/.bashrc && \
    echo 'export WEBPACKER_DEV_SERVER_PUBLIC="wss://$MASTODON_WDS_DOMAIN"' >> ~/.bashrc && \
    echo 'export ADDITIONAL_CONNECT_SRC="https://$MASTODON_WDS_DOMAIN,wss://$MASTODON_WDS_DOMAIN"' >> ~/.bashrc && \
    printf "# Auto-set mastodon env vars end.\n" >> ~/.bashrc

# Install Ruby and set it as default
# https://www.gitpod.io/docs/languages/ruby
RUN echo "rvm_gems_path=/home/gitpod/.rvm" > ~/.rvmrc
COPY .ruby-version /tmp/.ruby-version-mastodon-docker
RUN bash -lc 'rvm install "ruby-$(cat /tmp/.ruby-version-mastodon-docker)" && rvm use "ruby-ruby-$(cat /tmp/.ruby-version-mastodon-docker)" --default'
RUN echo "rvm_gems_path=/workspace/.rvm" > ~/.rvmrc
RUN echo "rvm_gems_path=/workspace/.rvm" > ~/.rvmrc && \
    echo "rvm_silence_path_mismatch_check_flag=1" >> ~/.rvmrc && \
    echo "rvm use ruby-ruby-$(cat /tmp/.ruby-version-mastodon-docker)" >> ~/.bashrc
RUN bash -lc 'gem install foreman --no-document'
