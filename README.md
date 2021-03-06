# ESP8266-IoTJS
Package for control ESP8266-EVB (with loaded ESP8266 olimex IoT firmware ) over WebSocket.
[Npm package link](https://www.npmjs.com/package/esp8266-iotjs)


#### Use at your own risk, it is Beta 0.0.1
#### Work properly with only one board connected to host at the time
only work with 
* Relay
* Button
* MOD-TC-MK2-31855 - temperature sensor (K-TYPE THERMOCOUPLE)
* more comming soon ++

 ## Events
 * Board:
     * ready (when web socket is open for requests)
     * push (Is triggered when button is pressed)
 * Relay:
     * relayStateIsChange (Is triggered when relay state is change)
 * MOD-TC-MK2-31855 - temperature sensor
     * temperature (Return temperature value of MOD-TC-MK2-31855 module.Event trriger is based on your Poll settings on web based config page of the firmware)
 * Finger Print Sensor
     * onFingerPrintDetected - When finger print is detected.


 ## Methods
 * Relay module:
     * setRelayState(param) - Change relay state with giving param, accept (1 or 0)
     * relayOn() - TurnOn the relay
     * relayOff() - TurnOff the relay
     * relayToggle() - Toggle relay state
 * MOD-TC-MK2-31855 - temperature sensor
     * getTemperature() - Force emit temperature event to handle temperature.


 ## Requirements

To use this you have to

1. Use Olimex IoT Firmware on your ESP8266-EVB - [Link](https://github.com/OLIMEX/ESP8266/tree/master/IoT%20Firmware)
2. Configure your computer as IoT Server using ESP-Sample-Application.html-[link](https://github.com/OLIMEX/ESP8266/tree/master/IoT%20Firmware/document)
    * Select IoT tab
    * Check WebSocket
    * Uncheck SSL
    * Set Server to your computer IP address
    * Leave everything else blank
    * (optimal) Fill name -- required for next updates 
    * (optimal) Fill token -- required for next updates  

3.Type following commands , but make sure you have already installed NPM and NodeJS
```
npm install esp8266-iotjs

```

4. Require 'esp8266-iotjs' in your code:
```
var esp8266 = require('esp8266-iotjs');
var board = new esp8266();

board.on("push",function(){
    console.log("button is pushed");
});
```

####Or 
```
var esp8266 = require('esp8266-iotjs');
var board = new esp8266();

board.on('push',function(){
    this.relayToggle();
});
```
####Or if you wish make a termostat: 
```
var ESP8266EVB = require('esp8266-iotjs');
var board = new ESP8266EVB();
var targetTemperature = 31;
var relayState = 0;
board.on('ready,function(){
    board.on('temperature',function(temperature){
        if(temperature < targetTemperature && relayState == 0){
            board.relayOn();
        }else if (temperature > targetTemperature && relayState == 1){
            board.relayOff();
        }
    });
});
```

