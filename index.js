// Initialization
var express = require('express');
var app = express();
var http = require('http').Server(app);
var ws = require('websocket').server;
var events = require('events');



/*
* Constructor of ESP8266IoT 
*/
function ESP8266IoT(debug){
	that = this;
	that.options = {'button_URL':'/button','relay_URL':'/relay','modtcmk2_URL':'/mod-tc-mk2','fingerPrint_URL':"/mod-finger"};
	that.options.debug = debug ? debug : false;
	events.EventEmitter.call(this);
	that.connection;
	that.relayState = 0;
	if (that.options.debug == true) {
		console.log("Init Board...");
	};
	that.init();
};

ESP8266IoT.prototype.__proto__ = events.EventEmitter.prototype;


ESP8266IoT.prototype.init = function() {
	/*
	 * Initialize WebSocket Server
	 */
	var websocket = new ws({
	    httpServer: http,
	    autoAcceptConnections: false
	});

	/*
	 * Listen on default HTTP port
	 */
	http.listen( 80, function() {
        if (that.options.debug == true) {
    	    console.log('Listening on *:80');   
		};
    });

	/*
	 * Handle WebSocket requests
	 */
	websocket.on('request', function(request) {
			if (that.options.debug == true) {
	        console.log('WEBSOCKET: Connection request ['+request.resource+']');
			};

	        if (!originIsAllowed(request.origin)) {
	            // Make sure we only accept requests from an allowed origin 
	            request.reject();
        		if (that.options.debug == true) {
	            	console.log('WEBSOCKET: Connection from origin [' + request.origin + '] rejected.');
				};

	            return;
	        }
			that.connection = request.accept();
			that.emit('ready');
	        if (that.options.debug == true) {
	        	console.log('WEBSOCKET: Connection accepted');
			};
			that.connection.on('message',function(message){
				if (message.type ===  'utf8') {
					try {
						var data = JSON.parse(message.utf8Data);
						if (that.options.debug == true) {
							console.log(data);
						};
						if (typeof data.EventData != 'undefined') {
							if (typeof data.EventData.Device != 'undefined') {
								switch(data.EventURL){
									case that.options.relay_URL :
										if (that.options.debug == true) {
											console.log('Relay event is ' + data.EventData.Data.Relay);
	            						}
									break;
									case that.options.button_URL :
										if (data.EventData.Data.Button == 'Press') {
											if (that.options.debug == true) {
												console.log('Event is ' + data.EventData.Data.Button);
											}
											that.emit('push');
										}
									break;
									case that.options.modtcmk2_URL : 
										if (that.options.debug == true) {
												console.log('Event is ' + data.EventData.Data.Temperature);
											}
										that.emit('temperature', data.EventData.Data.Temperature);
									break;
									case that.options.fingerPrint_URL :
										if (that.options.debug == true) {
											console.log('Finger Print event is ' + data.EventData.Data);
	            						}
	            						that.emit('onFingerPrintDetected', data.EventData);
									break;
								}
							}
						}
					} catch (err) {
						if (that.options.debug == true) {
							console.log(err);
                        	console.log(message.utf8Data);
						};
					}
				}else if(message.type === 'binary'){
					if (that.options.debug == true) {
	        			console.log('WEBSOCKET: Received Binary Message of ' + message.binaryData.length + ' bytes');
					};
				}
			});

	        
	    }
	);    
};

ESP8266IoT.prototype.setRelayState = function(state) {
	// Send message to ESP8266 to change the state
		that.connection.sendUTF(
        JSON.stringify(
            {
                URL: that.options.relay_URL,
                Method: 'POST',
                Data: {
                Relay: state
                }
            }
        )
    );
};


ESP8266IoT.prototype.relayOn = function() {
	that.setRelayState(1);
	that.emit('relayStateIsChange',{"relay":1});
	that.relayState = 1;
};

ESP8266IoT.prototype.relayOff = function() {
	that.setRelayState(0);
	that.emit('relayStateIsChange', {"relay":0});
	that.relayState = 0;
};

ESP8266IoT.prototype.relayToggle = function() {
	
	that.relayState == 1 ? that.relayOff() : that.relayOn();
};

ESP8266IoT.prototype.getTemperature = function() {
	// Send message to ESP8266 to emit temperature event
		that.connection.sendUTF(
        JSON.stringify(
            {
                URL: that.options.modtcmk2_URL,
                Method: 'GET'
            }
        )
    );
};


// export the class
module.exports = ESP8266IoT;


/*
 * Check if origin is allowed
 */
function originIsAllowed(origin) {
    // FIX THIS TO USE IN PRODUCTION ENVIRONMENT
    return true;
}
