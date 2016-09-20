/**
 * Polymorphic Labs dot Move Module
 * @module pmlDotMove
 */
"use strict";        

var deviceId;
var hwDefs;

/** Set the version of hwdefs used for this device. 
 * @param {object} defs - Specific hardware defs for the version of the device being interacted with.
 */
exports.setHwDefs = function(defs){
    hwDefs = defs;
};

/**
 * AHRS devices that are currently connected.
 */
exports.connections = [];

/** Adds device to the connected device array.
 * @param {object} device - Device object to add to connection array.
 */
exports.newConnection = function(device){
    //Add device to connection list and return handle
    exports.connections.push(device.id);
    return device;
};

/** Removes a device from the connected device array.
 * @param {object} device - Device object to remove from connection array.
 */
exports.termConnection = function(device) {
    //Remove device from list 
    var index = exports.connections.indexOf(device.id);
    if(index != -1)
    	exports.connections.splice(index, 1);

    //TODO: Deregister any callbacks
};

	 
	 //************************************************************************
	 //Movement Service Functions
	 //************************************************************************
	 var moveCallbacks = [];
	 var readMoveConfig = function(handle, callback){
		 ble.read(handle, hwDefs.movement.service, hwDefs.movement.configuration,callback,function(error){console.log(error);});
	 }
	 exports.registerMoveCallback = function(handle, callback){
		 moveCallbacks.push({handle, callback});
	 };
	 exports.enableMoveCallback = function(handle){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }
         
		 ble.startNotification(handle, hwDefs.movement.service, hwDefs.movement.data, moveCallbacks.find(findHandle).callback, function(error){console.log(error);});
	 };
	 exports.disableMoveCallback = function(handle){
		 ble.stopNotification(handle, hwDefs.movement.service, hwDefs.movement.data, function(){console.log("Movement Notifications Stopped");}, function(error){console.log(error);});
	 };
	 exports.setMovePeriod = function(handle, period){
		 //TODO: Add math to calculate period value
		 var periodData = new Uint8Array(1);
		 periodData[0] = period;
		 ble.write(handle, hwDefs.movement.service, hwDefs.movement.period, periodData.buffer,
		     function() { console.log("Configured movement period."); },function(error){console.log(error);});
		 
	 };
	 exports.enableAccel = function(handle){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] |= 0x38;	//Enable all accelerometers
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Enabled accelerometers."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
	 exports.disableAccel = function(handle){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] &= ~0x38;	//Disable all accelerometers
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Disabled accelerometers."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
	 //range
	 //0 = 2G
	 //1 = 4G
	 //2 = 8G
	 //3 = 16G
	 exports.setAccelRange = function(handle, range){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] &= ~0x300;	//clear range config
			 configData[0] |= (range << 8);
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Set accelerometer range."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
	 exports.enableGyro = function(handle){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] |= 0x07;	//Enable all gyroscopes
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Enabled gyroscopes."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
	 exports.disableGyro = function(handle){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] &= ~0x07;	//Disable all gyroscopes
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Disabled gyroscopes."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
//	 var setGyroRange = function(range){
//		 //TODO: Change config data
//         var configData = new Uint16Array(1);
//         configData[0] = 0x007F; 
//         ble.write(this.deviceId, this.hwDefs.movement.service, this.hwDefs.movement.configuration, configData.buffer, 
//             function() { console.log("Configured movement."); },function(error){console.log(error);});
//	 };
	 exports.enableMag = function(handle){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] |= 0x40;	//Enable all magnetometers
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Enabled magnetometers."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
	 exports.disableMag = function(handle){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] &= ~0x40;	//Disable all magnetometers
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Disabled magnetometers."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
	 exports.enableAllMove = function(handle){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] |= 0x7F;	//Enable all movement sensors
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Enabled movement sensors."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
	 exports.disableAllMove = function(handle){
		 var onRead = function(data){
			 var configData = new Uint16Array(data);
			 configData[0] &= ~0x7F;	//Disabled all movement sensors
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration, configData.buffer, 
	                 function() { console.log("Disabled movement sensors."); },function(error){console.log(error);});
		 };
		 readMoveConfig(handle, onRead);
	 };
	 
	 
	 //************************************************************************
	 //Barometer Service Functions
	 //************************************************************************
	 var baroCallbacks = [];

     /**
 * Registers a callback for when raw movement data is recieved.
 * @param {string} handle - MAC address string of the device you're registering the callback for.
 * @param {function} callback - Callback function to recieve data.
 */
	 exports.registerBaroCallback = function(handle, callback){
    baroCallbacks.push({
        handle,
        callback
    });
	 };

/**
 * Enables the raw movement data to be sent over bluetooth. The device must also be in the correct 
 * operating mode in order to recieve non-zero data.  Note: calls to configuration functions should 
 * be spaced by a few miliseconds by calling them with setTimeout.
 * @param {string} handle - MAC address string of the device you're enabling the callback for.
 */
	 exports.enableBaroCallback = function(handle){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }

		 ble.startNotification(handle, hwDefs.barometer.service, hwDefs.barometer.data, baroCallbacks.find(findHandle).callback, function(error){console.log(error);});

         var configData = new Uint8Array(1);
		 configData[0] = 1;
		 ble.write(handle, hwDefs.barometer.service, hwDefs.barometer.configuration, configData.buffer,
		     function() { console.log("Enabled barometer."); },function(error){console.log(error);});
	 };


/**
 * Disables the raw movement data being sent over bluetooth.
 * @param {string} handle - MAC address string of the device you're disabling the callback for.
 */
	 exports.disableBaroCallback = function(handle){
		 ble.stopNotification(handle, hwDefs.barometer.service, hwDefs.barometer.data, function(){console.log("Barometer Notifications Stopped");}, function(error){console.log(error);});

         var configData = new Uint8Array(1);
		 configData[0] = 0;
		 ble.write(handle, hwDefs.barometer.service, hwDefs.barometer.configuration, configData.buffer,
		     function() { console.log("Disabled barometer."); },function(error){console.log(error);});
	 };

/**
 * Sets the movement data period of the AHRS device. 
 * @param {string} handle - MAC address string of the device you're changing the movement data period of.
 * @param {value} mode - Integer value between 10 and 255.  Resolution is 10ms with a minimum of 100ms period.  For example, passing 10 yields 10 * 10ms = 100ms period.
 */
	 exports.setBaroPeriod = function(handle, period){
		 //TODO: Add math to calculate period value
		 var periodData = new Uint8Array(1);
		 periodData[0] = period;
		 ble.write(handle, hwDefs.barometer.service, hwDefs.barometer.period, periodData.buffer,
		     function() { console.log("Configured barometer period."); },function(error){console.log(error);});
		 
	 };




	 
	 //************************************************************************
	 //IR Thermometer Service Functions
	 //************************************************************************
	 var irThermCallbacks = [];
     /**
 * Registers a callback for when raw movement data is recieved.
 * @param {string} handle - MAC address string of the device you're registering the callback for.
 * @param {function} callback - Callback function to recieve data.
 */
	 exports.registerThermCallback = function(handle, callback){
		 irThermCallbacks.push({
            handle,
            callback
        });
	 };

/**
 * Enables the raw movement data to be sent over bluetooth. The device must also be in the correct 
 * operating mode in order to recieve non-zero data.  Note: calls to configuration functions should 
 * be spaced by a few miliseconds by calling them with setTimeout.
 * @param {string} handle - MAC address string of the device you're enabling the callback for.
 */
exports.enableThermCallback = function(handle){
        function findHandle(callbacks) {
             return callbacks.handle === handle;
        }

		 ble.startNotification(handle, hwDefs.irTherm.service, hwDefs.irTherm.data, irThermCallbacks.find(findHandle).callback, function(error){console.log(error);});

         var configData = new Uint8Array(1);
		 configData[0] = 1;
		 ble.write(handle, hwDefs.irTherm.service, hwDefs.irTherm.configuration, configData.buffer,
		     function() { console.log("Enabled irTherm."); },function(error){console.log(error);});
	 };

/**
 * Disables the raw movement data being sent over bluetooth.
 * @param {string} handle - MAC address string of the device you're disabling the callback for.
 */
	 exports.disableThermCallback = function(handle){
		 ble.stopNotification(handle, hwDefs.irTherm.service, hwDefs.irTherm.data, function(){console.log("irThermometer Notifications Stopped");}, function(error){console.log(error);});

         var configData = new Uint8Array(1);
		 configData[0] = 0;
		 ble.write(handle, hwDefs.irTherm.service, hwDefs.irTherm.configuration, configData.buffer,
		     function() { console.log("Disabled irTherm."); },function(error){console.log(error);});
	 };

/**
 * Sets the movement data period of the AHRS device. 
 * @param {string} handle - MAC address string of the device you're changing the movement data period of.
 * @param {value} mode - Integer value between 10 and 255.  Resolution is 10ms with a minimum of 100ms period.  For example, passing 10 yields 10 * 10ms = 100ms period.
 */
	 exports.setThermPeriod = function(handle, period){
		 //TODO: Add math to calculate period value
		 var periodData = new Uint8Array(1);
		 periodData[0] = period;
		 ble.write(handle, hwDefs.irTherm.service, hwDefs.irTherm.period, periodData.buffer,
		     function() { console.log("Configured irTherm period."); },function(error){console.log(error);});
	 };
	 
	 
	 //************************************************************************
	 //IO Service Functions
	 //************************************************************************
/**
 * Enables app control of the LED onboard the Polymorphic.Move
 * @param {string} handle - MAC address string of the device you're changing the movement data period of.
 */
exports.enableLEDControl = function(handle) {
    var ioConfig = new Uint8Array(1);
    ioConfig[0] = 1; //Enable LED Remote Control
    ble.write(handle, hwDefs.io.service, hwDefs.io.configuration, ioConfig.buffer,
        function() {
            console.log("Enabled LED Control.");
        }, app.onError);
};

/**
 * Disables app control of the LED onboard the Polymorphic.Move
 * @param {string} handle - MAC address string of the device you're changing the movement data period of.
 */
exports.disableLEDControl = function(handle) {
    exports.setLEDColor(handle, 0, 0, 0);
    var ioConfig = new Uint8Array(1);
    ioConfig[0] = 0; //Disable LED Remote Control
    ble.write(handle, hwDefs.io.service, hwDefs.io.configuration, ioConfig.buffer,
        function() {
            console.log("Disabled LED Control.");
        }, app.onError);
};

/**
 * Sets the color of teh LED onboard the Polymorphic.Move
 * @param {string} handle - MAC address string of the device you're changing the movement data period of.
 * @param {value} red - 1 or 0
 * @param {value} green - 1 or 0;
 * @param {value} blue - 1 or 0;
 */
exports.setLEDColor = function(handle, red, green, blue) {
    var ioValue = new Uint8Array(1);
    ioValue[0] = red | (green << 1) | (blue << 2);
    ble.write(handle, hwDefs.io.service, hwDefs.io.data, ioValue.buffer,
        function() {
            console.log("Sent LED Color.");
        }, app.onError);
};
	 
	 //************************************************************************
	 //Button Service Functions
	 //************************************************************************
var buttonCallbacks = [];

/**
 * Registers a callback for when button data is recieved.
 * @param {string} handle - MAC address string of the device you're registering the callback for.
 * @param {function} callback - Callback function to recieve data.
 */
exports.registerButtonCallback = function(handle, callback) {
    buttonCallbacks.push({
        handle,
        callback
    });
};

/**
 * Enables the button data to be sent over bluetooth. The device must also be in the correct operating mode in order to recieve non-zero data.  
 * @param {string} handle - MAC address string of the device you're enabling the callback for.
 */
exports.enableButtonCallback = function(handle) {
    function findHandle(callbacks) {
        return callbacks.handle === handle;
    }

    //Start notifications
    ble.startNotification(handle, hwDefs.button.service, hwDefs.button.data, buttonCallbacks.find(findHandle).callback, function(error) {
        console.log(error);
    });
};

/**
 * Disables the button data being sent over bluetooth.
 * @param {string} handle - MAC address string of the device you're disabling the callback for.
 */
exports.disableButtonCallback = function(handle) {
    ble.stopNotification(handle, hwDefs.button.service, hwDefs.button.data, function() {
        console.log("Button Notifications Stopped");
    }, function(error) {
        console.log(error);
    });
};

	


