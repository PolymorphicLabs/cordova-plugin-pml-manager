/**
 * Polymorphic Labs Over Air Download (OAD) Module
 * @module pmlOAD
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
 * @param {object} device - Device object to add to connection array.
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
var oadCallbacks = [];
exports.readToolName = function(handle){


    var onRead = function(data){
        function findHandle(callbacks) {
            return callbacks.handle === handle;
        }

        oadCallbacks.find(findHandle).callback(data);
    };

	ble.read(handle, hwDefs.tool_name.service, hwDefs.tool_name.data, onRead, function(error){console.log(error);});
}

exports.registerOADCallback = function(handle, callback){
	 oadCallbacks.push({handle, callback});
};


exports.startOAD = function(handle, fileEntry){
    var loadLoop = function(hexData){
        console.log("File Loaded");

        var lines = hexData.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
        for(var i = 0; i < lines.length; i++) { /* do something with lines[i] */ 
            var pos = 0;

            if(lines[i].charAt(pos++) != ":"){
			    console.log("Hex file invalid");
                break;
            }

		    //Number of bytes (hex digit pairs) in the data field
		    var dataLength = parseInt(lines[i].substr(pos, 2), 16);
		    pos += 2;
		    //Get 16-bit address (big-endian)
		    var lowAddress = parseInt(lines[i].substr(pos, 4), 16);
		    pos += 4;
		    //Record type
		    var recordType = parseInt(lines[i].substr(pos, 2), 16);
		    pos += 2;
		    //Data field (hex-encoded string)
		    var dataField = lines[i].substr(pos, dataLength * 2);
			    //dataFieldBuf = new Buffer(dataField, "hex");
            //Data field buf (int array)
            var dataFieldBuf;
            for(var j = 0; j < dataLength; j++){
                dataFieldBuf.push(parseInt(dataField.substr(j*2, 2), 16));
            }    

		    pos += dataLength * 2;
		    //Checksum
		    var checksum = parseInt(lines[i].substr(pos, 2), 16);
		    pos += 2;
		    //Validate checksum
		    var calcChecksum = (dataLength + (lowAddress >> 8) +
			    lowAddress + recordType) & 0xFF;
		    for(var i = 0; i < dataLength; i++)
			    calcChecksum = (calcChecksum + dataFieldBuf[i]) & 0xFF;
		    calcChecksum = (0x100 - calcChecksum) & 0xFF;
		    if(checksum != calcChecksum){
			    console.log("Invalid checksum on line " + lineNum +
				    ": got " + checksum + ", but expected " + calcChecksum);
                break;
            }
        
        }

    };

    //Config Image Identify Notifications
    //ble.startNotification(handle, hwDefs.oad.service, hwDefs.oad.imageIdentify, rawMoveCallbacks.find(findHandle).callback, function(error) {
    //    console.log(error);
    //});
    
    //Config Image Block Notifications
    //ble.startNotification(handle, hwDefs.oad.service, hwDefs.oad.imageBlock, rawMoveCallbacks.find(findHandle).callback, function(error) {
    //    console.log(error);
    //});
    
    //Write to image count char (only if downloading multiple images)
    //

    //Write meta data to image identify
    //

    //image identify notification if metadata invalid


    //otherwise image block notification with requested block number
    //
    //write no response first block of data
    //loop
    //if timeout exceeded break
    //else wait for notification and send next block
    //end loop


    //if all data sent status success
    //else read imageStatus


    //Read data from hex file
    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function (e) {
            loadLoop(this.result);
        };

        reader.readAsText(file);
    });

}

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
