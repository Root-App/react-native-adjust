'use strict';
var ReactNative = require('react-native');
var {
    NativeModules
} = ReactNative;
var AdjustAnalyzer = NativeModules.AdjustAnalyzer;
import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';

class AnalyzerDictionary {
    static getParam(params, paramName) {
        for(var i = 0; i < params.length; i++) {
            if(params[i].name == paramName) {
                return params[i].value;
            }
        }

        return null;
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async translateAndExecuteCommands(commands) {
        console.log("translateAndExecuteCommands(): >>>>>>>");
        console.log("translateAndExecuteCommands(): " + commands.length);

        for (var i = 0; i < commands.length; i++) {
            var className = commands[i].className;
            var functionName = commands[i].functionName;
            var params = commands[i].params;

            console.log("command #" + i + ": class: " + className);

            switch (className) {
                case "AdjustAnalyzer":
                    Dictionary_AdjustAnalyzer.receiveCommand(functionName, params);
                    break;
                    //case "AdjustFactory":
                    //Dictionary_AdjustFactory.receiveCommand(functionName, params);
                    //break;
                case "Adjust":
                    Dictionary_Adjust.receiveCommand(functionName, params);
                    break;
                case "System":
                    console.log("Dictionary_system: receivecommand: >>>>>>");
                    switch (functionName) {
                        case "sleep":
                            console.log("sleeping...")
                            var mills = parseInt(AnalyzerDictionary.getParam(params, "mills"));
                            await this.sleep(mills);
                            console.log("slept...")
                            break;
                    }
                    break;
                case "Foo":
                    Dictionary_Foo.receiveCommand(functionName, params);
                    break;
            }
        }
    }
}

class Dictionary_Foo {
    static receiveCommand(functionName, params) {
        console.log("Dictionary_foo: receivecommand: >>>>>>");
        switch (functionName) {
            case "fooTest":
                console.log("Footest is running successfully");
                break;
        }
    }
}

//class Dictionary_System {
//static sleep(ms) {
//return new Promise(resolve => setTimeout(resolve, ms));
//}

//static receiveCommand(functionName, params) {
//console.log("Dictionary_system: receivecommand: >>>>>>");
//switch (functionName) {
//case "sleep":
//console.log("sleeping...")
//var mills = parseInt(AnalyzerDictionary.getParam(params, "mills"));
//await this.sleep(5000);
//console.log("slept...")
//break;
//}
//}
//}



//class Dictionary_AdjustFactory {
//static receiveCommand(functionName, params) {
//console.log("Dictionary_adjustfactory: receivecommand: >>>>>>");
//switch (functionName) {
//case "tearDown":
//AdjustFactory.tearDown(callsite);
//break;
//}
//}
//}

class Dictionary_AdjustAnalyzer {
    static receiveCommand(functionName, params) {
        console.log("Dictionary_adjustAnalyzer: receivecommand: >>>>>>");
        switch (functionName) {
            case "reportState":
                var callsite = AnalyzerDictionary.getParam(params, "callSite");
                AdjustAnalyzer.reportState(callsite);
                break;
            case "terminate":
                AdjustAnalyzer.terminate();
                break;
        }
    }
}

class Dictionary_Adjust {
    static receiveCommand(functionName, params) {
        console.log("Dictionary_adjust: receivecommand: >>>>>>");
        switch (functionName) {
            case "onCreate":
                var appToken = AnalyzerDictionary.getParam(params, "appToken");
                var environment = AnalyzerDictionary.getParam(params, "environment");
                var adjustConfig = new AdjustConfig(appToken, environment);
                Adjust.create(adjustConfig);
                break;
            case "onResume":
                Adjust.onResume();
                break;
            case "onPause":
                Adjust.onPause();
                break;
        }
    }
}

export default AnalyzerDictionary;