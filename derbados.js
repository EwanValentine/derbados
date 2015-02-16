#!/usr/bin/env node

'use strict';

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
var config = require('config');
var program = require('commander');
var chalk = require('chalk');

var Connect = require('./src/connect.js');
var connect = new Connect();

program
  .version('0.0.11')
  .option('-h, --host [otherHosts...]', 'Host name (Config reference only, not full host name).', '')
  .option('-c, --command [command]', 'Command or alias', '')
  .option('-m, --multi <hosts>', 'Multiple host names.')
  .option('-s, --stream <host>', 'Stream to host.')
  .option('-t, --type <type>', 'Stream type.')
  .parse(process.argv);

console.log(chalk.black.bgBlue('Derbados. Server management tool for lazy people.'));

// First attempt at multiple connections. Works kinda, but needs cleaning up.
// Example: derbados -m host_one,host_two -c 'tail -f /var/log/nginx/*'
// Should return error logs from two hosts
if(program.stream) {

  if(!program.type) {
    connect.stream(connect.resolveHost(program.stream));
  }

  connect.stream(connect.resolveHost(program.stream), program.type);
}

if(program.multi) {
  connect.multi(connect.resolveHost(program.stream), program.multi.split(":"));
}

if(program.host) {
  connect.fire(program.command, connect.resolveHost(program.host));
}

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});