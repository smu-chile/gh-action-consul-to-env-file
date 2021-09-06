'use strict';

const Consul = require('consul');
const logger = require('winston');
const _ = require('lodash');
const fs = require('fs');
const { exec } = require('child_process');

class App {
  constructor() {
    this._folderName = process.env.PLUGIN_FOLDERNAME || '/github/workspace';
    this._fileName = process.env.PLUGIN_FILENAME || '.env';
    this._destFile = this._folderName+"/"+this._fileName
    this._prefix = process.env.PLUGIN_PREFIX || '';
    this._excludes = _(process.env.PLUGIN_EXCLUDES).split(',').compact().value();
    this._printConsulKeys = process.env.PLUGIN_PRINT_CONSUL_KEYS || process.env.PRINT_CONSUL_KEYS || false;
    this._consul = Consul({
      secure: process.env.PLUGIN_CONSUL_SSL || process.env.CONSUL_SSL || false,
      host: process.env.PLUGIN_CONSUL_ADDR || process.env.CONSUL_ADDR || 'localhost',
      port: process.env.PLUGIN_CONSUL_PORT || process.env.CONSUL_PORT || 8500,
      defaults: {
        token: process.env.PLUGIN_CONSUL_TOKEN || process.env.CONSUL_TOKEN || '',
      },
      promisify: true,
    });
  }

  run() {
    return new Promise((resolve, reject) => {
      this._consul.kv.keys(this._prefix).then((data) => {
        return _.map(data, (item) => {
          return this._processKey(item);
        });
      }).then(() => {
        resolve();
      }).catch((err) => {
        logger.error(err);
        reject(err);
      });
    });
  }

  _processKey(key) {
    return new Promise((resolve, reject) => {
      if (_.some(this._excludes, (item) => {
        return new RegExp(item).test(key);
      })) {
        logger.warn('ignore key: %s', key);
        return;
      }

      this._consul.kv.get(key).then((data) => {
        if (!data.Value) {
          logger.warn('folder key ignored: %s', key);
          return;
        }

        let envVar = this._format(key);
        fs.appendFileSync(this._destFile, `export ${envVar}=\'${data.Value}\'\n`);
        if (!this._printConsulKeys) {
          logger.info('%s: %s', key, '<sanitized>');
        } else {
          logger.info('%s: %s', key, data.Value);
          
        }
        resolve();
      }).catch((err) => {
        logger.error(err);
        reject(err);
      });
    });
  }


  _format(key) {
    let envVar = /^.*\/(.*)$/.exec(key)[1];
    envVar = _.snakeCase(envVar);
    envVar = _.toUpper(envVar);
    return envVar;
  }
}

module.exports = App;
