/**
 * Polymorphic Labs AHRS Module
 * @module pmlAHRS
 */
"use strict";

var deviceId;
var hwDefs;

/** Set the version of hwdefs used for this device. 
 * @param {object} defs - Specific hardware defs for the version of the device being interacted with.
 */
exports.setHwDefs = function(defs) {
    hwDefs = defs;
};

/**
 * AHRS devices that are currently connected.
 */
exports.connections = [];

/** Adds device to the connected device array.
 * @param {object} device - Device object to add to connection array.
 */
exports.newConnection = function(device) {
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
var rawMoveCallbacks = [];
var orientationCallbacks = [];
var vectorCallbacks = [];
var readMoveConfig1 = function(handle, callback) {
    ble.read(handle, hwDefs.movement.service, hwDefs.movement.configuration1, callback, function(error) {
        console.log(error);
    });
}
var readMoveConfig2 = function(handle, callback) {
    ble.read(handle, hwDefs.movement.service, hwDefs.movement.configuration2, callback, function(error) {
        console.log(error);
    });
}
var readAxisMap = function(handle, callback) {
    ble.read(handle, hwDefs.movement.service, hwDefs.movement.axismap, callback, function(error) {
        console.log(error);
    });
}

/**
 * Registers a callback for when raw movement data is recieved.
 * @param {string} handle - MAC address string of the device you're registering the callback for.
 * @param {function} callback - Callback function to recieve data.
 */
exports.registerRawMoveCallback = function(handle, callback) {
    rawMoveCallbacks.push({
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
exports.enableRawMoveCallback = function(handle) {
    function findHandle(callbacks) {
        return callbacks.handle === handle;
    }

    var onRead = function(data) {
        var config1Data = new Uint8Array(data);
        config1Data[0] |= 0x10;
        ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer,
            function() {
                console.log("Enabled Raw Movement Data.");
            },
            function(error) {
                console.log(error);
            });
    };

    //turn on Data1
    readMoveConfig1(handle, onRead);
    //turn on Notifications for Data1
    ble.startNotification(handle, hwDefs.movement.service, hwDefs.movement.data1, rawMoveCallbacks.find(findHandle).callback, function(error) {
        console.log(error);
    });

};

/**
 * Disables the raw movement data being sent over bluetooth.
 * @param {string} handle - MAC address string of the device you're disabling the callback for.
 */
exports.disableRawMoveCallback = function(handle) {
    var onRead = function(data) {
        var config1Data = new Uint8Array(data);
        config1Data[0] &= ~0x10;
        ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer,
            function() {
                console.log("Disabled Raw Movement Data.");
            },
            function(error) {
                console.log(error);
            });
    };

    //turn off Data1
    readMoveConfig1(handle, onRead);
    //Stop nofications on data1
    ble.stopNotification(handle, hwDefs.movement.service, hwDefs.movement.data1, function() {
        console.log("Raw Movement Notifications Stopped");
    }, function(error) {
        console.log(error);
    });
};

/**
 * Registers a callback for when orientation (quaternion) data is recieved.
 * @param {string} handle - MAC address string of the device you're registering the callback for.
 * @param {function} callback - Callback function to recieve data.
 */
exports.registerOrientationCallback = function(handle, callback) {
    orientationCallbacks.push({
        handle,
        callback
    });
};

/**
 * Enables the orientation (quaternion) data to be sent over bluetooth. The device must also be in the correct operating mode in order to recieve non-zero data.  Note: calls to configuration functions should be spaced by a few miliseconds by calling them with setTimeout.
 * @param {string} handle - MAC address string of the device you're enabling the callback for.
 */
exports.enableOrientationCallback = function(handle) {
    function findHandle(callbacks) {
        return callbacks.handle === handle;
    }

    var onRead = function(data) {
        var config1Data = new Uint8Array(data);
        config1Data[0] |= 0x20;
        ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer,
            function() {
                console.log("Enabled Orientation Data.");
            },
            function(error) {
                console.log(error);
            });
    };

    //turn on Data2
    readMoveConfig1(handle, onRead);
    ble.startNotification(handle, hwDefs.movement.service, hwDefs.movement.data2, orientationCallbacks.find(findHandle).callback, function(error) {
        console.log(error);
    });
};

/**
 * Disables the orientation data being sent over bluetooth.
 * @param {string} handle - MAC address string of the device you're disabling the callback for.
 */
exports.disableOrientationCallback = function(handle) {
    var onRead = function(data) {
        var config1Data = new Uint8Array(data);
        config1Data[0] &= ~0x20;
        ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer,
            function() {
                console.log("Disabled Orientation Data.");
            },
            function(error) {
                console.log(error);
            });
    };

    //turn off Data1
    readMoveConfig1(handle, onRead);
    //Stop nofications on data2         
    ble.stopNotification(handle, hwDefs.movement.service, hwDefs.movement.data2, function() {
        console.log("Orientation Notifications Stopped");
    }, function(error) {
        console.log(error);
    });
};

/**
 * Registers a callback for when vector (gravity/linear acceleration) data is recieved.
 * @param {string} handle - MAC address string of the device you're registering the callback for.
 * @param {function} callback - Callback function to recieve data.
 */
exports.registerVectorCallback = function(handle, callback) {
    vectorCallbacks.push({
        handle,
        callback
    });
};

/**
 * Enables the vector (gravity/linear acceleration) data to be sent over bluetooth. The device must also be in the correct operating mode in order to recieve non-zero data.  Note: calls to configuration functions should be spaced by a few miliseconds by calling them with setTimeout.
 * @param {string} handle - MAC address string of the device you're enabling the callback for.
 */
exports.enableVectorCallback = function(handle) {
    function findHandle(callbacks) {
        return callbacks.handle === handle;
    }

    var onRead = function(data) {
        var config1Data = new Uint8Array(data);
        config1Data[0] |= 0x40;
        ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer,
            function() {
                console.log("Enabled Vector Data.");
            },
            function(error) {
                console.log(error);
            });
    };

    //turn on Data3
    readMoveConfig1(handle, onRead);
    ble.startNotification(handle, hwDefs.movement.service, hwDefs.movement.data3, vectorCallbacks.find(findHandle).callback, function(error) {
        console.log(error);
    });
};

/**
 * Disables the vector data being sent over bluetooth.
 * @param {string} handle - MAC address string of the device you're disabling the callback for.
 */
exports.disableVectorCallback = function(handle) {
    var onRead = function(data) {
        var config1Data = new Uint8Array(data);
        config1Data[0] &= ~0x40;
        ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer,
            function() {
                console.log("Disabled Vector Data.");
            },
            function(error) {
                console.log(error);
            });
    };

    //turn off Data1
    readMoveConfig1(handle, onRead);
    //Stop nofications on data3
    ble.stopNotification(handle, hwDefs.movement.service, hwDefs.movement.data3, function() {
        console.log("Vector Notifications Stopped");
    }, function(error) {
        console.log(error);
    });
};

/**
 * Sets the operating mode of the AHRS device. Note: calls to configuration functions should be spaced by a few miliseconds by calling them with setTimeout.
 * @param {string} handle - MAC address string of the device you're changing the operating mode of.
 * @param {value} mode - Integer value between 0 and 12: Config - 0, A - 1, M - 2, G - 3, AM - 4, AG - 5, MG - 6, AMG - 7, IMUPlus - 8, Compass - 9, M4G - 10, NDOF no cal - 11, NDOF - 12.
 */
exports.setOperatingMode = function(handle, mode) {
    var onRead = function(data) {
        var config1Data = new Uint8Array(data);
        config1Data[0] &= 0xF0; //Clear previous mode
        config1Data[0] |= (mode & 0x0F);
        ble.write(handle, hwDefs.movement.service, hwDefs.movement.configuration1, config1Data.buffer,
            function() {
                console.log("Configured operating mode.");
            },
            function(error) {
                console.log(error);
            });
    };
    readMoveConfig1(handle, onRead);
}


/**
 * Sets the axis mapping of the AHRS device.
 * @param {string} handle - MAC address string of the device you're changing the operating mode of.
 * @param {value} mapping 
 */
exports.setAxisMap = function(handle, mapping) {
    var mapData = new Uint16Array(1);
    mapData[0] = mapping;
    ble.write(handle, hwDefs.movement.service, hwDefs.movement.axismap, mapData.buffer,
        function() {
            console.log("Configured axis mapping.");
        },
        function(error) {
            console.log(error);
        });
}

/**
 * Sets the movement data period of the AHRS device. 
 * @param {string} handle - MAC address string of the device you're changing the movement data period of.
 * @param {value} mode - Integer value between 10 and 255.  Resolution is 10ms with a minimum of 100ms period.  For example, passing 10 yields 10 * 10ms = 100ms period.
 */
exports.setMovePeriod = function(handle, period) {
    //TODO: Add math to calculate period value
    var periodData = new Uint8Array(1);
    periodData[0] = period;
    ble.write(handle, hwDefs.movement.service, hwDefs.movement.period, periodData.buffer,
        function() {
            console.log("Configured movement period.");
        },
        function(error) {
            console.log(error);
        });

};

//************************************************************************
//Pressure Service Functions
//************************************************************************
var pressureCallbacks = [];

/**
 * Registers a callback for when pressure data is recieved.
 * @param {string} handle - MAC address string of the device you're registering the callback for.
 * @param {function} callback - Callback function to recieve data.
 */
exports.registerPressureCallback = function(handle, callback) {
    pressureCallbacks.push({
        handle,
        callback
    });
};

/**
 * Enables the pressure data to be sent over bluetooth. The device must also be in the correct operating mode in order to recieve non-zero data.  Note: calls to configuration functions should be spaced by a few miliseconds by calling them with setTimeout.
 * @param {string} handle - MAC address string of the device you're enabling the callback for.
 */
exports.enablePressureCallback = function(handle) {
    function findHandle(callbacks) {
        return callbacks.handle === handle;
    }

    //Start notifications
    ble.startNotification(handle, hwDefs.pressure.service, hwDefs.pressure.data, pressureCallbacks.find(findHandle).callback, function(error) {
        console.log(error);
    });
    var configData = new Uint8Array(1);
    //Enable Data
    configData[0] = 1;
    ble.write(handle, hwDefs.pressure.service, hwDefs.pressure.configuration, configData.buffer,
        function() {
            console.log("Enabled pressure Notifications.");
        },
        function(error) {
            console.log(error);
        });
};

/**
 * Disables the pressure data being sent over bluetooth.
 * @param {string} handle - MAC address string of the device you're disabling the callback for.
 */
exports.disablePressureCallback = function(handle) {
    ble.stopNotification(handle, hwDefs.pressure.service, hwDefs.pressure.data, function() {
        console.log("Pressure Notifications Stopped");
    }, function(error) {
        console.log(error);
    });

    var configData = new Uint8Array(1);
    configData[0] = 0;
    ble.write(handle, hwDefs.pressure.service, hwDefs.pressure.configuration, configData.buffer,
        function() {
            console.log("Disabled barometer.");
        },
        function(error) {
            console.log(error);
        });
};

/**
 * Sets the pressure data period of the AHRS device. 
 * @param {string} handle - MAC address string of the device you're changing the movement data period of.
 * @param {value} mode - Integer value between 10 and 255.  Resolution is 10ms with a minimum of 100ms period.  For example, passing 10 yields 10 * 10ms = 100ms period.
 */
exports.setPressurePeriod = function(handle, period) {
    //TODO: Add math to calculate period value
    var periodData = new Uint8Array(1);
    periodData[0] = period;
    ble.write(handle, hwDefs.pressure.service, hwDefs.pressure.period, periodData.buffer,
        function() {
            console.log("Configured barometer period.");
        },
        function(error) {
            console.log(error);
        });

};

//************************************************************************
//Humidity Service Functions
//************************************************************************
var humidityCallbacks = [];

/**
 * Registers a callback for when humity data is recieved.
 * @param {string} handle - MAC address string of the device you're registering the callback for.
 * @param {function} callback - Callback function to recieve data.
 */
exports.registerHumidityCallback = function(handle, callback) {
    humidityCallbacks.push({
        handle,
        callback
    });
};

/**
 * Enables the humidity data to be sent over bluetooth. The device must also be in the correct operating mode in order to recieve non-zero data.  Note: calls to configuration functions should be spaced by a few miliseconds by calling them with setTimeout.
 * @param {string} handle - MAC address string of the device you're enabling the callback for.
 */
exports.enableHumidityCallback = function(handle) {
    function findHandle(callbacks) {
        return callbacks.handle === handle;
    }

    //Start notifications
    ble.startNotification(handle, hwDefs.humidity.service, hwDefs.humidity.data, humidityCallbacks.find(findHandle).callback, function(error) {
        console.log(error);
    });
    var configData = new Uint8Array(1);
    //Enable Data
    configData[0] = 1;
    ble.write(handle, hwDefs.humidity.service, hwDefs.humidity.configuration, configData.buffer,
        function() {
            console.log("Enabled humditiy Notifications.");
        },
        function(error) {
            console.log(error);
        });
};

/**
 * Disables the humidity data being sent over bluetooth.
 * @param {string} handle - MAC address string of the device you're disabling the callback for.
 */
exports.disableHumidityCallback = function(handle) {
    ble.stopNotification(handle, hwDefs.humidity.service, hwDefs.humidity.data, function() {
        console.log("Humidity Notifications Stopped");
    }, function(error) {
        console.log(error);
    });

    var configData = new Uint8Array(1);
    configData[0] = 0;
    ble.write(handle, hwDefs.humidity.service, hwDefs.humidity.configuration, configData.buffer,
        function() {
            console.log("Disabled hygrometer.");
        },
        function(error) {
            console.log(error);
        });
};

/**
 * Sets the humidity data period of the AHRS device. 
 * @param {string} handle - MAC address string of the device you're changing the movement data period of.
 * @param {value} mode - Integer value between 10 and 255.  Resolution is 10ms with a minimum of 100ms period.  For example, passing 10 yields 10 * 10ms = 100ms period.
 */
exports.setHumidityPeriod = function(handle, period) {
    //TODO: Add math to calculate period value
    var periodData = new Uint8Array(1);
    periodData[0] = period;
    ble.write(handle, hwDefs.humidity.service, hwDefs.humidity.period, periodData.buffer,
        function() {
            console.log("Configured hygrometer period.");
        },
        function(error) {
            console.log(error);
        });

};

//************************************************************************
//IO Service Functions
//************************************************************************
/**
 * Enables app control of the LED onboard the AHRS
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
 * Disables app control of the LED onboard the AHRS
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
 * Sets the color of teh LED onboard the AHRS
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


