#!/usr/bin/env node

/**    
 *   @licstart  The following is the entire license notice for the 
 *   JavaScript code in this application.
 *
 *   Copyright (C) 2015  Ewan Valentine
 *
 *   The JavaScript code in this application is free software: you can
 *   redistribute it and/or modify it under the terms of the GNU
 *   General Public License (GNU GPL) as published by the Free Software
 *   Foundation, either version 3 of the License, or (at your option)
 *   any later version.  The code is distributed WITHOUT ANY WARRANTY;
 *   without even the implied warranty of MERCHANTABILITY or FITNESS
 *   FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 *   As additional permission under GNU GPL version 3 section 7, you
 *   may distribute non-source (e.g., minimized or compacted) forms of
 *   that code without the copy of the GNU GPL normally required by
 *   section 4, provided you include this license notice and a URL
 *   through which recipients can access the Corresponding Source.   
 *
 *
 *   @licend  The above is the entire license notice
 *   for the JavaScript code in this application.
 */
var exec = require('ssh-exec');
var _ = require('lodash');
var config = require('config');
var program = require('commander');
var chalk = require('chalk');

program
  .version('0.0.8')
  .option('-h, --host [otherHosts...]', 'Host name (Config reference only, not full host name).', '')
  .option('-c, --command [command]', 'Command or alias', '')
  .option('-m, --multi <hosts>', 'Multiple host names.')
  .parse(process.argv);

console.log(chalk.black.bgBlue('Derbados. Server management tool for lazy people.'));

// First attempt at multiple connections. Works kinda, but needs cleaning up.
// Example: derbados -m host_one,host_two -c 'tail -f /var/log/nginx/*'
// Should return error logs from two hosts
if(program.multi) {

  var names = [];

  _.forEach(config.get('hosts'), function(host, name) {
    names.push(name);
  });

  var hosts = program.multi.split(',');
  var connection;

  _.forEach(hosts, function(host) {

    if(_.contains(names, host)) {

      var host = host;

      _.forEach(config.get('hosts'), function(hostInstance, name) {
        if(name == host) {
            console.log('Executing on host: ' + name);

            exec(program.command, hostInstance).pipe(process.stdout);
        }
      });
    }
  });
}

// Foreach host entry
_.forEach(config.get('hosts'), function(host, name) {

  // If host name equals host argument
  if(name === program.host) {

    var connection = exec.connection(host);

    // Foreach command alias
    _.forEach(config.get('aliases'), function(command, alias) {

      // If alias equals command
      if(program.command === alias) {

        console.log(chalk.black.bgBlue('Alias: %s found.'), alias);
        console.log(chalk.black.bgBlue('Running command: %s'), command);

        // Execute aliased command
        exec(command, connection).pipe(process.stdout);
      } else {

        // Execute raw command
        exec(program.command, connection).pipe(process.stdout);
      }
    });
  }
});