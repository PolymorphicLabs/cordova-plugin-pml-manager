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

exports.newConnection = function(device){
    //Add device to connection list and return handle
    exports.connections.push(device.id);
    return device;
};

exports.termConnection = function(device){
    //Remove device from list and deregister any callbacks
};

	 
	 //************************************************************************
	 //Movement Service Functions
	 //************************************************************************
	 var rawMoveCallbacks = [];
	 var orientationCallbacks = [];
	 var vectorCallbacks = [];
	 var readMoveConfig1 = function(handle, callback){
		 ble.read(handle, hwDefs.movement.service, hwDefs.movement.configuration1,callback,function(error){console.log(error);});
	 }
	 var readMoveConfig2 = function(handle, callback){
		 ble.read(handle, hwDefs.movement.service, hwDefs.movement.configuration2,callback,function(error){console.log(error);});
	 }
	 var readAxisMap = function(handle, callback){
		 ble.read(handle, hwDefs.movement.service, hwDefs.movement.axismap,callback,function(error){console.log(error);});
	 }

     //raw movement data
	 exports.registerRawMoveCallback = function(handle, callback){
		 rawMoveCallbacks.push({handle, callback});
	 };
	 exports.enableRawMoveCallback = function(handle){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }
        
        var onRead = function(data){
			 var config1Data = new Uint8Array(data);
             config1Data[0] |= 0x10;
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Enabled Raw Movement Data."); },function(error){console.log(error);});
		 };

         //turn on Data1
         readMoveConfig1(handle, onRead);
         //turn on Notifications for Data1
		 ble.startNotification(handle, hwDefs.movement.service, hwDefs.movement.data1, rawMoveCallbacks.find(findHandle).callback, function(error){console.log(error);});

         
	 };
	 exports.disableRawMoveCallback = function(handle){
         var onRead = function(data){
			 var config1Data = new Uint8Array(data);
             config1Data[0] &= ~0x10;
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Disabled Raw Movement Data."); },function(error){console.log(error);});
		 };

         //turn off Data1
         readMoveConfig1(handle, onRead);
         //Stop nofications on data1
		 ble.stopNotification(handle, hwDefs.movement.service, hwDefs.movement.data1, function(){console.log("Raw Movement Notifications Stopped");}, function(error){console.log(error);});
	 };

     //orientation  data
	 exports.registerOrientationCallback = function(handle, callback){
		 orientationCallbacks.push({handle, callback});
	 };
	 exports.enableOrientationCallback = function(handle){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }

        var onRead = function(data){
			 var config1Data = new Uint8Array(data);
             config1Data[0] |= 0x20;
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Enabled Orientation Data."); },function(error){console.log(error);});
		 };

         //turn on Data2
         readMoveConfig1(handle, onRead); 
		 ble.startNotification(handle, hwDefs.movement.service, hwDefs.movement.data2, orientationCallbacks.find(findHandle).callback, function(error){console.log(error);});
	 };
	 exports.disableOrientationCallback = function(handle){
         var onRead = function(data){
			 var config1Data = new Uint8Array(data);
             config1Data[0] &= ~0x20;
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Disabled Orientation Data."); },function(error){console.log(error);});
		 };

         //turn off Data1
         readMoveConfig1(handle, onRead);
         //Stop nofications on data2         
		 ble.stopNotification(handle, hwDefs.movement.service, hwDefs.movement.data2, function(){console.log("Orientation Notifications Stopped");}, function(error){console.log(error);});
	 };

     //linear acceleration and gravity vector data
	 exports.registerVectorCallback = function(handle, callback){
		 vectorCallbacks.push({handle, callback});
	 };
	 exports.enableVectorCallback = function(handle){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }

        var onRead = function(data){
			 var config1Data = new Uint8Array(data);
             config1Data[0] |= 0x40;
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Enabled Vector Data."); },function(error){console.log(error);});
		 };

         //turn on Data3
         readMoveConfig1(handle, onRead);
		 ble.startNotification(handle, hwDefs.movement.service, hwDefs.movement.data3, vectorCallbacks.find(findHandle).callback, function(error){console.log(error);});
	 };
	 exports.disableVectorCallback = function(handle){
         var onRead = function(data){
			 var config1Data = new Uint8Array(data);
             config1Data[0] &= ~0x40;
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Disabled Vector Data."); },function(error){console.log(error);});
		 };

         //turn off Data1
         readMoveConfig1(handle, onRead);
         //Stop nofications on data3
		 ble.stopNotification(handle, hwDefs.movement.service, hwDefs.movement.data3, function(){console.log("Vector Notifications Stopped");}, function(error){console.log(error);});
	 };



    //Configuration 1
    exports.setOperatingMode = function(handle, mode){
		 var onRead = function(data){
			 var config1Data = new Uint8Array(data);
			 config1Data[0] &= 0xF0;	//Clear previous mode
             config1Data[0] |= (mode & 0x0F);
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Configured operating mode."); },function(error){console.log(error);});
		 };
		 readMoveConfig1(handle, onRead);
    }

    



	 exports.setMovePeriod = function(handle, period){
		 //TODO: Add math to calculate period value
		 var periodData = new Uint8Array(1);
		 periodData[0] = period;
		 ble.write(handle, hwDefs.movement.service, hwDefs.movement.period, periodData.buffer,
		     function() { console.log("Configured movement period."); },function(error){console.log(error);});
		 
	 };

	 
	 
	 //************************************************************************
	 //Barometer Service Functions
	 //************************************************************************
	 var baroCallbacks = [];


     //raw movement data
	 exports.registerRawMoveCallback = function(handle, callback){
		 rawMoveCallbacks.push({handle, callback});
	 };
	 exports.enableRawMoveCallback = function(handle){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }
        
        var onRead = function(data){
			 var config1Data = new Uint8Array(data);
             config1Data[0] |= 0x10;
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Enabled Raw Movement Data."); },function(error){console.log(error);});
		 };

         //turn on Data1
         readMoveConfig1(handle, onRead);
         //turn on Notifications for Data1
		 ble.startNotification(handle, hwDefs.movement.service, hwDefs.movement.data1, rawMoveCallbacks.find(findHandle).callback, function(error){console.log(error);});

         
	 };
	 exports.disableRawMoveCallback = function(handle){
         var onRead = function(data){
			 var config1Data = new Uint8Array(data);
             config1Data[0] &= ~0x10;
	         ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer, 
	                 function() { console.log("Disabled Raw Movement Data."); },function(error){console.log(error);});
		 };

         //turn off Data1
         readMoveConfig1(handle, onRead);
         //Stop nofications on data1
		 ble.stopNotification(handle, hwDefs.movement.service, hwDefs.movement.data1, function(){console.log("Raw Movement Notifications Stopped");}, function(error){console.log(error);});
	 };


	 exports.registerBaroCallback = function(handle, callback){
		 baroCallbacks.push({handle, callback});
	 };
	 exports.enableBaroCallback = function(handle){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }

        //Start notifications
		 ble.startNotification(handle, hwDefs.barometer.service, hwDefs.barometer.data, baroCallbacks.find(findHandle).callback, function(error){console.log(error);});
         var configData = new Uint8Array(1);
         //Enable Data
		 configData[0] = 1;
		 ble.write(handle, hwDefs.barometer.service, hwDefs.barometer.configuration, configData.buffer,
		     function() { console.log("Enabled barometer."); },function(error){console.log(error);});
	 };
	 exports.disableBaroCallback = function(handle){
		 ble.stopNotification(handle, hwDefs.barometer.service, hwDefs.barometer.data, function(){console.log("Barometer Notifications Stopped");}, function(error){console.log(error);});

         var configData = new Uint8Array(1);
		 configData[0] = 0;
		 ble.write(handle, hwDefs.barometer.service, hwDefs.barometer.configuration, configData.buffer,
		     function() { console.log("Disabled barometer."); },function(error){console.log(error);});
	 };
	 exports.setBaroPeriod = function(handle, period){
		 //TODO: Add math to calculate period value
		 var periodData = new Uint8Array(1);
		 periodData[0] = period;
		 ble.write(handle, hwDefs.barometer.service, hwDefs.barometer.period, periodData.buffer,
		     function() { console.log("Configured barometer period."); },function(error){console.log(error);});
		 
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

	


