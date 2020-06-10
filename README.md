# chrome-os

Use the Node `os` API in Chrome Apps

## Usage 

This library can be used directly with your browserify builds with targeting Chrome Packaged Apps. 

```
$ npm install chrome-os --save
$ browserify -r chrome-os:os index.js -o bundle.js
```

## Test 

```
$ npm test
```

This will load the folder `test/chrome-app` as an unpacked extension in chrome.
Test currently designed for windows and Mac Canary support for others accepted

## Permissions 

The following permissions need to be added to your chrome packaged app for this module.

```
"permissions": [
	"system.memory",
	"system.cpu",
	"system.network"
]
```

## Mapping 

The chrome apis do not support sync calls for some of the corresponding features so the calls have been made async. 
However, if you make a call with a callback, it'll cache the result for the next sync call.
You can use this to pre-cache the result before the dependency using the APIs gets loaded up.

Currently these are 

1. cpus(callback(cpuinfo))

2. platform(callback(platform)) 
The platform string maps to the expected node value.

3. networkInterfaces(callback(interfaces))

There is currently a console warning and 'Not Supported' is returned if these functions are called without a callback. 
It should be noted that browserify doesn't fully support these either only returning placeholders. 
If users are interested in full cross platform support then an async-os implementation could be implemented. 
