/**
 * Polymorphic Labs Proximity Tag Module
 * @module pmlProxTag
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

//Tool Name Service
var toolCallbacks = [];
var readToolName = function(handle, callback){


    var onRead = function(data){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }

        toolCallbacks.find(findHandle).callback(data);
    };

	 ble.read(handle, hwDefs.tool_name.service, hwDefs.tool_name.data, onRead, function(error){console.log(error);});
}

exports.registerToolCallback = function(handle, callback){
	 toolCallbacks.push({handle, callback});
};

exports.setToolName = function(handle, name){
		 //TODO: Add math to calculate period value
		 var nameData = new Uint8Array(1);
		 nameData[0] = name;
		 ble.write(handle, hwDefs.tool_name.service, hwDefs.tool_name.data, nameData.buffer,
		     function() { console.log("Set tool name."); },function(error){console.log(error);});
		 
	 };
