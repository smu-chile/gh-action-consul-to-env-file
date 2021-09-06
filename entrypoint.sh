#!/bin/sh
set -e

function main() {
    sanitize "${INPUT_CONSUL_ADDRESS}" "consul_address"
    sanitize "${INPUT_CONSUL_TOKEN}" "consul_token"
    sanitize "${INPUT_BASE_PATH}" "base_path"
    sanitize "${INPUT_EXCLUDED_KEYS}" "excluded_keys"
    sanitize "${INPUT_CONSUL_PORT}" "consul_port"
    sanitize "${INPUT_CONSUL_USE_SSL}" "consul_use_ssl"
    sanitize "${INPUT_ENV_FILENAME}" "env_filename"

    #########################
    # GENERATE ENV VARIABLES
    #########################

    export CONSUL_ADDR=$INPUT_CONSUL_ADDRESS
    export CONSUL_HTTP_ADDR=$INPUT_CONSUL_ADDRESS
    export CONSUL_HTTP_TOKEN=$INPUT_CONSUL_TOKEN
    export CONSUL_TOKEN=$INPUT_CONSUL_TOKEN
    export PLUGIN_PREFIX=$INPUT_BASE_PATH
    export PLUGIN_EXCLUDES=$INPUT_EXCLUDED_KEYS
    export CONSUL_PORT=$INPUT_CONSUL_PORT
    export CONSUL_SSL=$INPUT_CONSUL_USE_SSL
    export PLUGIN_FILENAME=$INPUT_ENV_FILENAME


    #Define variables needed for connection and storage
    export CONSUL_HTTP_SSL_VERIFY=false
    export PLUGIN_FOLDERNAME="/github/workflow"

    echo "========> START EXPORTING ENV FILE"
    /release/drone-consul
    echo "========> END EXPORTING ENV FILE"
    echo ""

}

function sanitize() {
  if [ -z "${1}" ]; then
    >&2 echo "Unable to find the ${2}. Did you set with.${2}?"
    exit 1
  fi
}


###Execute main
main