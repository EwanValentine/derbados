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

console.log(config.util.getEnv('NODE_CONFIG_DIR'));

// program
//   .version('0.0.1')
//   .option('-h, --host [host]', 'Host name (Config reference only, not full host name).', '')
//   .option('-c, --command [command]', 'Command or alias', '')
//   .parse(process.argv);

// console.log(chalk.black.bgBlue('Derbados. Server management tool for lazy people.'));

// // Foreach host entry
// _.forEach(config.get('hosts'), function(host, name) {e

//   // If host name equals host argument
//   if(name === program.host) {

//   	// Foreach command alias
//     _.forEach(config.get('aliases'), function(command, alias) {

//       // If alias equals command
//       if(program.command === alias) {

//         console.log(chalk.black.bgBlue('Alias: %s found.'), alias);
//         console.log(chalk.black.bgBlue('Running command: %s'), command);

//       	// Execute aliased command
//         exec(command, host).pipe(process.stdout);
//       } else {

//       	// Execute raw command
//         exec(program.command, host).pipe(process.stdout);
//       }
//     });
//   }
// });