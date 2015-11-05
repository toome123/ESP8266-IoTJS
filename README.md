# ESP8266-IoTJS
Package for control ESP8266-EVB (with loaded ESP8266 olimex IoT firmware ) over WebSocket.
 ## Requirements

To use this demo you have to

1. Use Olimex IoT Firmware on your ESP8266-EVB - [Link](https://github.com/OLIMEX/ESP8266/tree/master/IoT%20Firmware)
2. Configure your computer as IoT Server using ESP-Sample-Application.html-[link](https://github.com/OLIMEX/ESP8266/tree/master/IoT%20Firmware/document)
	* Select IoT tab
	* Check WebSocket
	* Uncheck SSL
	* Set Server to your computer IP address
	* Leave everything else blank
3.Type following commands , but make sure you have already installed NPM and NodeJS
```
npm install esp8266-iotjs

```

4. Add some code to your project folder , add index.js and write it this:
```
var esp8266 = require('esp8266-iotjs');
var board = new esp8266(true);

board.on("push",function(){
    console.log("button is pushed");


});

```

####Or 
```
var test = require('esp8266-iotjs');

var board  = new test();

board.on('relayStateIsChange',function(data){
   console.log(data); 
});

board.on('push',function(){
    this.relayToggle();
});

