var exec = cordova.require('cordova/exec');

function newProgressEvent(result) {
    var event = {
            loaded: result.loaded,
            total: result.total
    };
    return event;
}

exports.unzip = function(fileName, outputDirectory, callback, progressCallback) {
    const nameFunction = "progressCallbackZip" + Math.floor(Math.random() * 100000);
    if (progressCallback){
        window[nameFunction] = (result)=>progressCallback(newProgressEvent(result));
    }
 
    var win = function(result) {
        if (callback) {
            callback(0);
        }
        if(window[nameFunction]){
            delete window[nameFunction]
        }
    };
    var fail = function(result) {
        if (callback) {
            callback(-1);
        }
        if(window[nameFunction]){
            delete window[nameFunction]
        }
    };
    exec(win, fail, 'Zip', 'unzip', [fileName, outputDirectory,nameFunction]);
};