#!/bin/bash
# docker network create nginx-proxy-network

# Constants
export COMPOSE_VERSION=1.29.2

pwd=$(pwd)

# docker-compose up -d
# docker exec nginx-proxy_nginx-proxy_1 /bin/bash -c "{ echo 'add_header X-Frame-Options SAMEORIGIN;'; echo 'client_max_body_size 512m;'; } > /etc/nginx/conf.d/my_proxy.conf" 

ask() {
  # https://djm.me/ask
  local prompt default reply

  while true; do

    if [[ "${2:-}" == "Y" ]]; then
      prompt="Y/n"
      default=Y
    elif [[ "${2:-}" == "N" ]]; then
      prompt="y/N"
      default=N
    else
      prompt="y/n"
      default=
    fi

    # Ask the question (not using "read -p" as it uses stderr not stdout)
    echo -n "$1 [$prompt] "

    read reply

    # Default?
    if [[ -z "$reply" ]]; then
      reply=${default}
    fi

    # Check if the reply is valid
    case "$reply" in
    Y* | y*) return 0 ;;
    N* | n*) return 1 ;;
    esac

  done
}

version-number() {
  echo "$@" | awk -F. '{ printf("%03d%03d%03d\n", $1,$2,$3); }'
}

install-docker() {
  curl -fsSL get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh

  if [[ $EUID -ne 0 ]]; then
    sudo usermod -aG docker "$(whoami)"

    echo "You must log out or restart to apply necessary Docker permissions changes."
    echo "Restart, then continue installing using this script."
    exit
  fi
}

install-docker-compose() {
  if [[ $EUID -ne 0 ]]; then
    sudo sh -c "curl -fsSL https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose"
    sudo chmod +x /usr/local/bin/docker-compose
    sudo sh -c "curl -fsSL https://raw.githubusercontent.com/docker/compose/${COMPOSE_VERSION}/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose"
  else
    curl -fsSL https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    curl -fsSL https://raw.githubusercontent.com/docker/compose/${COMPOSE_VERSION}/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose
  fi
}

#
# Run the initial installer of Docker.
# Usage: ./start.sh install
#
docker-install() {
  # check-install-requirements

  if [[ $(command -v docker) && $(docker --version) ]]; then
    echo "Docker is already installed! Continuing..."
  else
    if ask "Docker does not appear to be installed. Install Docker now?" Y; then
      install-docker
    fi
  fi

  if [[ $(command -v docker-compose) && $(docker-compose --version) ]]; then
    # Check for update to Docker Compose
    local CURRENT_COMPOSE_VERSION
    CURRENT_COMPOSE_VERSION=$(docker-compose version --short)

    if [ "$(version-number "$COMPOSE_VERSION")" -gt "$(version-number "$CURRENT_COMPOSE_VERSION")" ]; then
      if ask "Your version of Docker Compose is out of date. Attempt to update it automatically?" Y; then
        install-docker-compose
      fi
    else
      echo "Docker Compose is already installed and up to date! Continuing..."
    fi
  else
    if ask "Docker Compose does not appear to be installed. Install Docker Compose now?" Y; then
      install-docker-compose
    fi
  fi
}

install-git() {
  if [[ $(command -v git) && $(git --version) ]]; then
    echo "Git is already installed! Continuing..."
  else
    if ask "Git does not appear to be installed. Install Git now?" Y; then
      apt-get update
      apt-get install -y git
    fi
  fi
}

#
# Run the initial installer of Docker.
# Usage: ./start.sh env-setup
#
env-setup() {

    read -p "Enter the admin password: " AdminPassword
  
    echo " "
    # echo "##########################################"
    # echo "### Your .env file will look like this ###"
    # echo "##########################################"
    echo " "
    echo " "

    if ask "Do you wish to create the .env?" Y; then   
        { echo "PASSWORD=$AdminPassword"; } > ./.env
        echo "Thank you! Your .env file was successfully written!"
        else
          echo "I feel sorry for you. Do you wish to make another try?"
          set -e
      fi  
}

update() {
  ./git_pull.sh
  docker-compose build
  docker-compose up -d
}

pipe() {
  mkfifo mypipe
  echo -e '#!/bin/bash\nwhile true; do eval "$(cat '$pwd'/mypipe)" &> '$pwd'/output.txt; done' > $pwd/execpipe.sh
  chmod +x $pwd/execpipe.sh
  (crontab -l ; echo "@reboot $pwd/execpipe.sh")| crontab -
  $pwd/execpipe.sh &
}

misc() {
  cp ./app/config-example.json ./app/config.json
}

install() {
  docker-install
  env-setup #will create the .env file
  pipe
  misc
  docker-compose build
  docker network create nginx-proxy-network
  docker-compose up -d
}

help() {
    
    echo " "
    echo "##########################################"
    echo "### Thank you for choosing help        ###"
    echo "### Run ./start COMMAND                ###"
    echo "###                                    ###"
    echo "### COMMANDS:                          ###"
    echo "### - install                          ###"
    echo "### - docker-install                   ###"
    echo "### - env-setup                        ###"
    echo "### - new-radio                        ###"
    echo "### - update                           ###"
    echo "### - --help                           ###"
    echo "##########################################"
    echo " "

}
#
# Selector to run command
# Run ./start COMMAND ( install, env-setup, --help)

if [[ $1 == "install" || $1 == "env-setup" || $1 == "update" || $1 == "help" || $1 == "pipe" ]];
  then
    $1
  else
    echo "invalid option"
    exit
  fi