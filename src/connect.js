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
  this.stream = function(connection, type) {

    if(type !== 'undefined') {
      
      if(type === 'sh' || 'bash') {

        var stream = process.stdin
            .pipe(exec(type, connection))
            .pipe(process.stdout);
        
      } else {

        console.log(type + ' is not a terminal program.');
        process.exit(1);
      }
    }
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