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
exports.readToolName = function(handle){


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
    function str2ab(str) {
        var buf = new ArrayBuffer(str.length); // 1 bytes for each char
        var bufView = new Uint8Array(buf);
        var j = 0;
        for (var i=0, strLen=str.length; i<strLen; i++) {
            if(str.charCodeAt(i) != 0){
                bufView[j] = str.charCodeAt(i);
                j++;
            }
        }
        //cut off any extraneous data
        buf = bufView.buffer.slice(0, j);
        //Pad with spaces
        
        var finalBuf = new Uint8Array(20);
        bufView = new Uint8Array(buf)

        for(i = 0; i<20; i++){
            if(i < j){
                finalBuf[i] = bufView[i];
            }else{
                finalBuf[i] = ' ';
            }
        }


        return finalBuf;
    }


		 //TODO: Add math to calculate period value
		 //var nameData = new Uint8Array(1);
		 //nameData[0] = name;
         var bufName = str2ab(name);
		 ble.write(handle, hwDefs.tool_name.service, hwDefs.tool_name.data, bufName.buffer,
		     function() { console.log("Set tool name."); },function(error){console.log(error);});
		 
	 };
