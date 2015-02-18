'use strict';

var _      = require('lodash');
var exec   = require('ssh-exec');
var chalk  = require('chalk');
var config = require('config');

module.exports = function() {

  var self = this;

  /**
   * multi
   *
   * Execute a single command across
   * multiple hosts.
   * 
   * @param  {string} command Command or alias to execute.
   * @param  {array} hosts    Array of host names.
   * 
   * @return {void}
   */
  this.multi = function(command, hosts) {

    var names = [];

    _.forEach(config.get('hosts'), function(host, name) {
      names.push(name);
    });

    var hosts = hosts;

    _.forEach(hosts, function(host) {

      if(_.contains(names, host)) {

        var host = host;

        _.forEach(config.get('hosts'), function(hostInstance, name) {
          if(name === host) {
            self.fire(command, hostInstance);
          }
        });
      }
    });
  };

  /**
   * stream
   *
   * Open a streamed connection to a 
   * remote server.
   * 
   * @param  {Connection} connection SSH connection object.
   * @param  {string}     type       Shell type. I.e.
   * 
   * @return {void}
   */
  this.stream = function(connection) {

    // Set input to raw. 
    // Honestly I don't know what this is, but some lad on GitHub told me to do it.
    process.stdin.setRawMode(true);

    // Create stream to SSH connection
    var stream = process.stdin//.setRawMode(true)
                        .pipe(exec('/bin/bash --rcfile .bashrc -i', connection))
                        .pipe(process.stdout);

    // Kill stream
    process.stdin.on('data', function(key){
      if (key == '\u0003') { process.exit(); }    // ctrl-c
    });
  }

  /**
   * fire
   * 
   * @param  {String}     command    
   * @param  {Connection} connection
   * 
   * @return {void}     
   */
  this.fire = function(command, connection) {

    var command = command;

    _.forEach(config.get('aliases'), function(commandEntry, alias) {
      if(command === alias) {
        command = commandEntry;
      }
    });

    var stream = exec(command, connection).pipe(process.stdout);

    stream.on('error', function(err) {
      console.log('something went wrong');
    });

    stream.on('finish', function(res) {
      console.log(chalk.white.bgGreen('Complete.'));
    });
  }

  /**
   * resolveHost
   *
   * Resolves host from config file
   * by alias name.
   * 
   * @param  {String} hostInput
   * 
   * @return {Connection}   
   */
  this.resolveHost = function(hostInput) {

    var connection;

    _.forEach(config.get('hosts'), function(host, name) {
      if(name === hostInput) {
        connection = exec.connection(host);
      }
    });

    return connection;
  }
};