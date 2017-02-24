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


    //Contains hex file data after file is loaded
    var hexLines;

    //Total number of lines in hex file
    var hexLength;

    //Current hex line in memory
    var currentLine = 0;

    //Contains data from the last hex line that was parsed
    var dataLength;
    var lowAddress;
    var recordType;
    var dataField;
    var dataFieldBuf = [];
    var checksum;
    var calcChecksum;

    var parseHexLine = function(hexLine){
        var pos = 0;

        if(hexLine.charAt(pos++) != ":"){
    	    console.log("Hex file invalid");
            return -1;
            
        }

		//Number of bytes (hex digit pairs) in the data field
		dataLength = parseInt(hexLine.substr(pos, 2), 16);
		pos += 2;
		//Get 16-bit address (big-endian)
		lowAddress = parseInt(hexLine.substr(pos, 4), 16);
		pos += 4;
		//Record type
		recordType = parseInt(hexLine.substr(pos, 2), 16);
		pos += 2;
		//Data field (hex-encoded string)
		dataField = hexLine.substr(pos, dataLength * 2);
        //Data field buf (int array)
        dataFieldBuf = [];
        for(var j = 0; j < dataLength; j++){
            dataFieldBuf.push(parseInt(dataField.substr(j*2, 2), 16));
        }    

		pos += dataLength * 2;
		//Checksum
		checksum = parseInt(hexLine.substr(pos, 2), 16);
		pos += 2;
		//Validate checksum
		calcChecksum = (dataLength + (lowAddress >> 8) +
		    lowAddress + recordType) & 0xFF;
		for(var i = 0; i < dataLength; i++)
		    calcChecksum = (calcChecksum + dataFieldBuf[i]) & 0xFF;
		calcChecksum = (0x100 - calcChecksum) & 0xFF;
		if(checksum != calcChecksum){
		    console.log("Invalid checksum" +
			    ": got " + checksum + ", but expected " + calcChecksum);
            return -1;
            
        }
        return 0;

    }

    var onIdentifyNotification = function(data){
        console.log("Metadata rejected:" + data);

    }

    var onBlockNotification = function(data){
        console.log("Metadata accepted:" + data);

    }


    var onFileLoaded = function(fileData){
        //hexData = fileData;

        console.log("File Loaded");
        
        //Split up the hex file into lines
        var hexLines = fileData.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
        hexLength = hexLines.length;

        //Config Image Identify Notifications
        ble.startNotification(handle, hwDefs.oad.service, hwDefs.oad.imageIdentify, onIdentifyNotification, function(error) {
            console.log(error);
        });
    
        //Config Image Block Notifications
        ble.startNotification(handle, hwDefs.oad.service, hwDefs.oad.imageBlock, onBlockNotification, function(error) {
            console.log(error);
        });

        //Grab Metadata
        parseHexLine(hexLines[0]);
        var metaData = new Uint8Array(dataFieldBuf);

        //Write Metadata
        ble.writeWithoutResponse(handle, hwDefs.oad.service, hwDefs.oad.imageIdentify, metaData.buffer,
		     function() { console.log("Sent Image Metadata."); },function(error){console.log(error);});


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
            onFileLoaded(this.result);
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
