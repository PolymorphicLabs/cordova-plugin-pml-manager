/**
 * Polymorphic Labs Manager Module
 * @module pmlManager
 */

"use strict";

/** Polymorphic Labs Manager Module Version. */
exports.version = "0.0.1";


        
        //Polymorphic Hardware Definitions
        var hwDefs = {
        	version : "1",
	        pmDotMove : [
	        	{
	        			version: "1",
		        		//Polymorphic Dot Service definitions
		        		//http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User%27s_Guide
		        		movement : {
		        		    service: "F000AA80-0451-4000-B000-000000000000",
		        		    data: "F000AA81-0451-4000-B000-000000000000", //GyroX[0:7], GyroX[8:15], GyroY[0:7], GyroY[8:15], GyroZ[0:7], GyroZ[8:15], AccX[0:7], AccX[8:15], AccY[0:7], AccY[8:15], AccZ[0:7], AccZ[8:15], MagX[0:7], MagX[8:15], MagY[0:7], MagY[8:15], MagZ[0:7], MagZ[8:15]
		        		    notification:"F0002902-0451-4000-B000-000000000000",//Write 0x0001 to enable notifications, 0x0000 to disable.
		        		    configuration: "F000AA82-0451-4000-B000-000000000000", //One bit for each gyro and accelerometer axis (6), magnetometer (1), wake-on-motion enable (1), accelerometer range (2). Write any bit combination top enable the desired features. Writing 0x0000 powers the unit off.
		        		    period: "F000AA83-0451-4000-B000-000000000000" //Resolution 10 ms. Range 100 ms (0x0A) to 2.55 sec (0xFF). Default 1 second (0x64).
		        		},
		        		ahrs : {
		        				service: "F000AA20-0451-4000-B000-000000000000",
		        				data: "F000AA21-0451-4000-B000-000000000000",
		        				configuration: "F000AA22-0451-4000-B000-000000000000",
		        				period: "F000AA23-0451-4000-B000-000000000000"
		        					
		        		},
		
		        		barometer : {
		        		    service: "F000AA40-0451-4000-B000-000000000000",
		        		    data: "F000AA41-0451-4000-B000-000000000000", //(float) pressure [0:31], (float) temperature [32:63]
		        		    notification: "F0002902-0451-4000-B000-000000000000", //Write 0x0001 to enable notifications, 0x0000 to disable.
		        		    configuration: "F000AA42-0451-4000-B000-000000000000",//Write 0x01 to enable data collection, 0x00 to disable.
		        		    period: "F000AA43-0451-4000-B000-000000000000" //Resolution 10 ms. Range 100 ms (0x0A) to 2.55 sec (0xFF). Default 1 second (0x64).
		
		        		},
		
		        		irTherm : {
	        			    service: "F000AA00-0451-4000-B000-000000000000", //
	        			    data: "F000AA01-0451-4000-B000-000000000000", //Object[0:7], Object[8:15], Ambience[0:7], Ambience[8:15]
	        			    notification: "F0002902-0451-4000-B000-000000000000", //Write 0x0001 to enable notifications, 0x0000 to disable.
	        			    configuration: "F000AA02-0451-4000-B000-000000000000", //Write 0x01 to enable data collection, 0x00 to disable.
	        			    period: "F000AA03-0451-4000-B000-000000000000" //Resolution 10 ms. Range 300 ms (0x1E) to 2.55 sec (0xFF). Default 1 second (0x64)
		        				
		        		},
		        		
		        		io : {
		        				service: "F000AA64-0451-4000-B000-000000000000",
		        				data: "F000AA65-0451-4000-B000-000000000000",
		        				configuration: "F000AA66-0451-4000-B000-000000000000"
		        				
		        		},
		
		        		//http://processors.wiki.ti.com/index.php/SensorTag_User_Guide#Simple_Key_Service
		        		button : {
		        		    service: "FFE0",
		        		    data: "FFE1", // Bit 2: side key, Bit 1- right key, Bit 0 –left key
		        		},
		        		
		        		oad : {
		        			service : "F000FFC0-0451-4000-B000-000000000000",
		        			imageId: "F000FFC1-0451-4000-B000-000000000000",
		        			imageBlock: "F000FFC2-0451-4000-B000-000000000000"	
		        		},
		        		connection : {
		        			service : "F000CCC0-0451-4000-B000-000000000000",
		        			conParams : "F000CCC1-0451-4000-B000-000000000000",
		        			reqConParams: "F000CCC2-0451-4000-B000-000000000000",
		        			reqDisconnect: "F000CCC3-0451-4000-B000-000000000000"
		        		}
	        	}
	        ],
            pmAHRS : [
	        	{
	        			version: "1",
		        		//Polymorphic AHRS Service definitions
		        		movement : {
		        		    service: "F000AA80-0451-4000-B000-000000000000",
		        		    data1: "F000AA81-0451-4000-B000-000000000000", 
		        		    data2: "F000AA82-0451-4000-B000-000000000000", 
		        		    data3: "F000AA83-0451-4000-B000-000000000000", 
		        		    notification:"F0002902-0451-4000-B000-000000000000",//Write 0x0001 to enable notifications, 0x0000 to disable.
		        		    configuration1: "F000AA84-0451-4000-B000-000000000000", 
		        		    configuration2: "F000AA85-0451-4000-B000-000000000000", 
		        		    axismap: "F000AA86-0451-4000-B000-000000000000", 
		        		    period: "F000AA87-0451-4000-B000-000000000000" //Resolution 10 ms. Range 100 ms (0x0A) to 2.55 sec (0xFF). Default 1 second (0x64).
		        		},
		
		        		pressure : {
		        		    service: "F000AA40-0451-4000-B000-000000000000",
		        		    data: "F000AA41-0451-4000-B000-000000000000", //(float) pressure [0:31], (float) temperature [32:63]
		        		    notification: "F0002902-0451-4000-B000-000000000000", //Write 0x0001 to enable notifications, 0x0000 to disable.
		        		    configuration: "F000AA42-0451-4000-B000-000000000000",//Write 0x01 to enable data collection, 0x00 to disable.
		        		    period: "F000AA43-0451-4000-B000-000000000000" //Resolution 10 ms. Range 100 ms (0x0A) to 2.55 sec (0xFF). Default 1 second (0x64).
		
		        		},

                        humidity : {
	        			    service: "F000AA20-0451-4000-B000-000000000000", //
	        			    data: "F000AA21-0451-4000-B000-000000000000", //Object[0:7], Object[8:15], Ambience[0:7], Ambience[8:15]
	        			    notification: "F0002902-0451-4000-B000-000000000000", //Write 0x0001 to enable notifications, 0x0000 to disable.
	        			    configuration: "F000AA22-0451-4000-B000-000000000000", //Write 0x01 to enable data collection, 0x00 to disable.
	        			    period: "F000AA23-0451-4000-B000-000000000000" //Resolution 10 ms. Range 300 ms (0x1E) to 2.55 sec (0xFF). Default 1 second (0x64)
		        				
		        		},
		        		
		        		io : {
		        				service: "F000AA64-0451-4000-B000-000000000000",
		        				data: "F000AA65-0451-4000-B000-000000000000",
		        				configuration: "F000AA66-0451-4000-B000-000000000000"
		        				
		        		},
		
		        		//http://processors.wiki.ti.com/index.php/SensorTag_User_Guide#Simple_Key_Service
		        		button : {
		        		    service: "FFE0",
		        		    data: "FFE1", // Bit 2: side key, Bit 1- right key, Bit 0 –left key
		        		},
		        		
		        		oad : {
		        			service : "F000FFC0-0451-4000-B000-000000000000",
		        			imageId: "F000FFC1-0451-4000-B000-000000000000",
		        			imageBlock: "F000FFC2-0451-4000-B000-000000000000"	
		        		},
		        		connection : {
		        			service : "F000CCC0-0451-4000-B000-000000000000",
		        			conParams : "F000CCC1-0451-4000-B000-000000000000",
		        			reqConParams: "F000CCC2-0451-4000-B000-000000000000",
		        			reqDisconnect: "F000CCC3-0451-4000-B000-000000000000"
		        		}
	        	}
	        ]                
        };

        //var foundDevices = [];
        var connectedDevices = [];
        var scanCallback;
        var connectCallback;
        
        //*********************************************************************
        //Private OAD PML Manager functions go here
        //*********************************************************************
        var oadConnect = function(){
        	console.log("OAD TEST");
        };
        
        //*********************************************************************
        //Private PML Manager functions go here
        //*********************************************************************
        var lastColor = "blue";
        var updateHwDefs = function(){
        	//Check for hwDefs in indexDB
        	//If found, grab version number and compare to latest on PML.com, download new copy as neccessary and store in indexDB
        	//If not found, try to grab latest version from PML.com
        	console.log("HWDEFS TEST");
        };
        var onError = function(reason){
        	console.log(reason);
        };
        var getNewColor = function(){
            if(lastColor == "blue"){
                lastColor = "red";
                return "red";
            }else if(lastColor == "red"){
                lastColor = "green";
                return "green";
            }else{
                lastColor = "blue";
                return "blue";

            }
        };
        var onDiscoverDevice = function(device){
            if(device.name === "Polymorphic AHRS"){

                var onConnect = function(device){
                                    //Turn on LED
                                    pmlAHRS.enableLEDControl(device.id);
                                    var color = getNewColor();
                                    if(color == "red"){
                                        pmlAHRS.setLEDColor(device.id, 1, 0, 0);
                                    }else if(color == "green"){
                                        pmlAHRS.setLEDColor(device.id, 0, 1, 0);
                                    }else{
                                        pmlAHRS.setLEDColor(device.id, 0, 0, 1);
                                    }

                                    //Add device to our list
                                    connectedDevices.push(device);

                                    //Call back application
                                    scanCallback(pmlAHRS.newConnection(device), color);
                }
                
                //Set HW Definitions
        	    pmlAHRS.setHwDefs(hwDefs.pmAHRS[0]);
                //Connect
                ble.connect(device.id, onConnect, onError);

            }else if(device.name === "Polymorphic Dot"){

                var onConnect = function(device){
                                    //Turn on LED
                                    pmlDotMove.enableLEDControl(device.id);
                                    pmlDotMove.setLEDColor(device.id, 1, 0, 0);

                                    //Add device to our list
                                    connectedDevices.push(device);

                                    //Call back application
                                    scanCallback(pmlDotMove.newConnection(device),"red");
                }

                //Set HW Definitions
        	    pmlDotMove.setHwDefs(hwDefs.pmDotMove[0]);
                //Connect
                ble.connect(device.id, onConnect, onError);

            }


        };


        //*********************************************************************
        //Public PML Manager functions go here
        //*********************************************************************

        /** 
         * Update hardware definitions. Currently not implemented. 
         */
        exports.update = function(){
        	updateHwDefs();
        };

        /**
         * Starts a bluetooth scan for Polymorphic Labs devices.
         * @param {function} callback - function to be called when a device is found.
         */
        exports.startScan = function(callback){
        	scanCallback = callback;
        	ble.startScan([], onDiscoverDevice, onError);
        };

        /**
         * Stop a bluetooth scan.
         */
        exports.stopScan = function(){
        	ble.stopScan(function(){console.log("Scan Complete");}, onError);
        };

        /**
         * Returns a list of Polymorphic Labs devices found by the bluetooth scan.
         */
        //TODO: remove?
        exports.getFoundDevices = function(){
        	return foundDevices;
        };

        /**
         * Returns a list of Polymorphic Labs devices that are currently connected.
         */
        exports.getConnectedDevices = function(){
        	return connectedDevices;
        };

        /**
         * Connects to bluetooth devices.
         * @param {array} devices - Array of strings that contain the device MAC addresses to connect to.
         * @param {function} callback - Function to call once a device has been connected.  The same function will be called for each connection.  A device object will be passed to the function so that the function knows which device it must configure.
         */
        exports.connect = function(devices, callback){

            //Register callback
        	connectCallback = callback;

            //Search through the foundDevices array and disconnect from the devices we don't want
            for(var i = 0; i < connectedDevices.length; i++){

                if(connectedDevices[i].name == "Polymorphic AHRS"){

                    //Put LED under local control
                    pmlAHRS.disableLEDControl(foundDevices[i].id);

                }else if(connectedDevices[i].name == "Polymorphic Dot"){

                    //Put LED under local control
                    pmlDotMove.disableLEDControl(connectedDevices[i].id);
                }

                //Will we be connecting to this device we found?
                var index = devices.indexOf(connectedDevices[i].id);
                if(index == -1){
                    //If not, lets disconnect
                    exports.disconnect(connectedDevices[i].id);
                }

        	}


            //Callback the application with the devices it wants
            for(var i = 0; i < connectedDevices.length; i++){
                    connectCallback(connectedDevices[i]);
        	}

            

        };

        /**
         * Disconnects from a bluetooth device.
         * @param {array} devices - Array of strings that contain the device MAC addresses to disconnect from.
         */
        exports.disconnect = function(devices){

            var removalIndex = [];

            for(var i = 0; i < devices.length; i++){
                for(var j = 0; j < connectedDevices.length; j++){
                    if(device[i] == connectedDevices[j].id){
                        //Found a device to remove
                        //Remove lower layer connection
                        if(connectedDevices[j].name == "Polymorphic AHRS"){
                            //Remove this connection from the lower layer
    	                    pmlAHRS.termConnection(connectedDevices[j]);
                        }else if(connectedDevices[j].name == "Polymorphic Dot"){
                            //Remove this connection from the lower layer
    	                    pmlDotMove.termConnection(connectedDevices[j]);
                        }


                        //Terminate BT Connection
                        ble.disconnect(connectedDevices[j].id, function(){console.log("Disconnected");}, onError);
                        //Remove from connectedDevices array
                        connectedDevices.splice(j, 1);
                        break;
                    }
                }
            }

        };
        
        /**
         * Returns the pmlManager version.
         */
        exports.getVersion = function(){
            return exports.version;
        };



