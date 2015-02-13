# Derbados
## Server management tool for lazy people.

### Install

``` npm install -g derbados ```

### Configure 

*On OS X:* 
Create a config folder, this can be anywhere node has access to:

```$ mkdir /Users/yourname/config```

Create global config file:

```$ sudo touch /Users/yourname/config/default.json```

Edit that file:

```$ sudo vim /Users/yourname/config/default.json```

Now add your hosts and aliases.

```
{
	"hosts": {
		"servername" : { "host": "11.11.11.11", "password": "yourpassword", "user": "root", "key": "~/.ssh/id_rsa" },
	},
	"aliases": {
		"test": "echo 'This is a test.'",
		"freemem": "free -m"
	}
}

```


Finally, Set your node config directory:

```$ export NODE_CONFIG_DIR='/Users/ewanvalentine/config' ```

Now if you run ```$ derbados -h servername -c test```

You should see 'This is a test.'. This has just ran on your remote server!