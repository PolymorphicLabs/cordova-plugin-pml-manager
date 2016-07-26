"use strict";        

var deviceId;
var hwDefs;

exports.setDeviceId = function(device){
    deviceId = device;
};

exports.setHwDefs = function(defs){
    hwDefs = defs;
};

//Connection managment
exports.connections = [];

exports.newConnection = function(deviceMAC){
    //Add device to connection list and return handle
    exports.connections.push(deviceMAC);
    return deviceMAC;
};

exports.termConnection = function(deviceMAC){
    //Remove device from list and deregister any callbacks
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
	 //AHRS Service Functions
	 //************************************************************************
	 var ahrsCallback;
	 var readAhrsConfig = function(callback){
		 ble.read(deviceId, hwDefs.ahrs.service, hwDefs.ahrs.configuration,callback,function(error){console.log(error);});
	 }
	 exports.registerAhrsCallback = function(callback){
		 ahrsCallback = callback;
	 };
	 exports.enableAhrsCallback = function(){
		 ble.startNotification(deviceId, hwDefs.ahrs.service, hwDefs.ahrs.data, ahrsCallback, function(error){console.log(error);});
	 };
	 exports.disableAhrsCallback = function(){
		 ble.stopNotification(deviceId, hwDefs.ahrs.service, hwDefs.ahrs.data, function(){console.log("AHRS Notifications Stopped");}, function(error){console.log(error);});
	 };
	 exports.setAhrsPeriod = function(period){
		 //TODO: Add math to calculate period value
		 var periodData = new Uint8Array(1);
		 periodData[0] = period;
		 ble.write(deviceId, hwDefs.ahrs.service, hwDefs.ahrs.period, periodData.buffer,
		     function() { console.log("Configured AHRS period."); },function(error){console.log(error);});
		 
	 };
	 exports.enableAhrs = function(){
		 var configData = new Uint8Array(1);
		 configData[0] = 1;	//Enable AHRS
         ble.write(deviceId, hwDefs.ahrs.service, hwDefs.ahrs.configuration, configData.buffer, 
                 function() { console.log("Enabled AHRS."); },function(error){console.log(error);});

	 };
	 exports.disableAhrs = function(){
		 var configData = new Uint8Array(1);
		 configData[0] = 0;	//Disable AHRS
         ble.write(deviceId, hwDefs.ahrs.service, hwDefs.ahrs.configuration, configData.buffer, 
                 function() { console.log("Disabled AHRS."); },function(error){console.log(error);});
	 };
	 
	 
	 //************************************************************************
	 //Barometer Service Functions
	 //************************************************************************
	 var baroCallback;
	 exports.registerBaroCallback = function(callback){
		 baroCallback = callback;
	 };
	 exports.enableBaroCallback = function(){
		 ble.startNotification(deviceId, hwDefs.barometer.service, hwDefs.barometer.data, baroCallback, function(error){console.log(error);});
	 };
	 exports.disableBaroCallback = function(){
		 ble.stopNotification(deviceId, hwDefs.barometer.service, hwDefs.barometer.data, function(){console.log("Barometer Notifications Stopped");}, function(error){console.log(error);});
	 };
	 exports.setBaroPeriod = function(period){
		 //TODO: Add math to calculate period value
		 var periodData = new Uint8Array(1);
		 periodData[0] = period;
		 ble.write(deviceId, hwDefs.barometer.service, hwDefs.barometer.period, periodData.buffer,
		     function() { console.log("Configured barometer period."); },function(error){console.log(error);});
		 
	 };
	 exports.enableBaro = function(){
		 var configData = new Uint8Array(1);
		 configData[0] = 1;
		 ble.write(deviceId, hwDefs.barometer.service, hwDefs.barometer.configuration, configData.buffer,
		     function() { console.log("Enabled barometer."); },function(error){console.log(error);});
	 };
	 exports.disableBaro = function(){
		 var configData = new Uint8Array(1);
		 configData[0] = 0;
		 ble.write(deviceId, hwDefs.barometer.service, hwDefs.barometer.configuration, configData.buffer,
		     function() { console.log("Disabled barometer."); },function(error){console.log(error);});
	 };
	 
	 //************************************************************************
	 //IR Thermometer Service Functions
	 //************************************************************************
	 var irThermCallback;
	 exports.registerThermCallback = function(callback){
		 irThermCallback = callback;
	 };
	 exports.enableThermCallback = function(){
		 ble.startNotification(deviceId, hwDefs.irTherm.service, hwDefs.irTherm.data, irThermCallback, function(error){console.log(error);});
	 };
	 exports.disableThermCallback = function(){
		 ble.stopNotification(deviceId, hwDefs.irTherm.service, hwDefs.irTherm.data, function(){console.log("irThermometer Notifications Stopped");}, function(error){console.log(error);});
	 };
	 exports.setThermPeriod = function(period){
		 //TODO: Add math to calculate period value
		 var periodData = new Uint8Array(1);
		 periodData[0] = period;
		 ble.write(deviceId, hwDefs.irTherm.service, hwDefs.irTherm.period, periodData.buffer,
		     function() { console.log("Configured irTherm period."); },function(error){console.log(error);});
	 };
	 exports.enableTherm = function(){
		 var configData = new Uint8Array(1);
		 configData[0] = 1;
		 ble.write(deviceId, hwDefs.irTherm.service, hwDefs.irTherm.configuration, configData.buffer,
		     function() { console.log("Enabled irTherm."); },function(error){console.log(error);});
	 };
	 exports.disableTherm = function(){
		 var configData = new Uint8Array(1);
		 configData[0] = 0;
		 ble.write(deviceId, hwDefs.irTherm.service, hwDefs.irTherm.configuration, configData.buffer,
		     function() { console.log("Disabled irTherm."); },function(error){console.log(error);});
	 };
	 
	 
	 //************************************************************************
	 //IO Service Functions
	 //************************************************************************
	 exports.enableLEDControl = function(){
	     var ioConfig = new Uint8Array(1);
	     ioConfig[0] = 1; //Enable LED Remote Control
	     ble.write(deviceId, hwDefs.io.service, hwDefs.io.configuration, ioConfig.buffer, 
	     	function() { console.log("Enabled LED Control."); }, app.onError);
	 };
	 exports.diableLEDControl = function(){
		 setLEDColor(0,0,0);
	     var ioConfig = new Uint8Array(1);
	     ioConfig[0] = 0; //Disable LED Remote Control
	     ble.write(deviceId, hwDefs.io.service, hwDefs.io.configuration, ioConfig.buffer, 
	     	function() { console.log("Disabled LED Control."); }, app.onError);
	 };
	 exports.setLEDColor = function(red, green, blue){
	        var ioValue = new Uint8Array(3);
	        ioValue[0] = red; //Set red value
	        ioValue[1] = green; //Set red value
	        ioValue[2] = blue; //Set red value
	        ble.write(deviceId, hwDefs.io.service, hwDefs.io.data, ioValue.buffer, 
	        		function(){console.log("Sent LED Color.");}, app.onError);
	 };
	 
	 //************************************************************************
	 //Button Service Functions
	 //************************************************************************
	 var buttonCallback;
	 exports.registerButtonCallback = function(callback){
		 buttonCallback = callback;
	 };
	 exports.enableButtonCallback = function(){
		 ble.startNotification(deviceId, hwDefs.button.service, hwDefs.button.data, buttonCallback, function(error){console.log(error);});
	 };
	 exports.disableButtonCallback = function(){
		 ble.stopNotification(deviceId, hwDefs.button.service, hwDefs.button.data, function(){console.log("Button Notifications Stopped");}, function(error){console.log(error);});
	 };

	


