'use strict';
var ReactNative = require('react-native');
var {
    NativeModules
} = ReactNative;
import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';

class CommandExecutor {
    constructor() {
        this.adjustCommandExecutor = new AdjustCommandExecutor();
    }

    executeCommand(className, methodName, params) {
        switch (className) {
            case "Adjust":
                this.adjustCommandExecutor.executeCommand(methodName, params);
                break;
        }
    }
}

class AdjustCommandExecutor {
    constructor() {
        this.savedInstances = {};
        this.DefaultConfigName = "defaultConfig";
        this.DefaultEventName = "defaultEvent";
        this.basePath = null;
    }

    executeCommand(methodName, params) {
        switch (methodName) {
            case "factory"                        : this.factory(params); break;
            case "config"                         : this.config(params); break;
            case "start"                          : this.start(params); break;
            case "event"                          : this.event(params); break;
            case "trackEvent"                     : this.trackEvent(params); break;
            case "resume"                         : this.resume(params); break;
            case "pause"                          : this.pause(params); break;
            case "setEnabled"                     : this.setEnabled(params); break;
            case "setReferrer"                    : this.setReferrer(params); break;
            case "setOfflineMode"                 : this.setOfflineMode(params); break;
            case "sendFirstPackages"              : this.sendFirstPackages(params); break;
            case "addSessionCallbackParameter"    : this.addSessionCallbackParameter(params); break;
            case "addSessionPartnerParameter"     : this.addSessionPartnerParameter(params); break;
            case "removeSessionCallbackParameter" : this.removeSessionCallbackParameter(params); break;
            case "removeSessionPartnerParameter"  : this.removeSessionPartnerParameter(params); break;
            case "resetSessionCallbackParameters" : this.resetSessionCallbackParameters(params); break;
            case "resetSessionPartnerParameters"  : this.resetSessionPartnerParameters(params); break;
            case "setPushToken"                   : this.setPushToken(params); break;
            case "teardown"                       : this.teardown(params); break;
            case "openDeeplink"                   : this.openDeeplink(params); break;
            case "testBegin"                      : this.testBegin(params); break;
            case "testEnd"                        : this.testEnd(params); break;
        }
    }

    factory(params) {
        if ('basePath' in params) {
            this.basePath = this.getFirstParameterValue(params, 'basePath');
        }
    }

    teardown(params) {
        if ('deleteState' in params) {
            var deleteState = (this.getFirstParameterValue(params, 'deleteState') == 'true');
            Adjust.teardown(deleteState);
        }
    }

    config(params) {
        var configName = "";
        if ('configName' in params) {
            configName = this.getFirstParameterValue(params, 'configName');
        } else {
            configName = this.DefaultConfigName;
        }

        var adjustConfig;
        if (configName in this.savedInstances) {
            var frozenAdjustConfig = this.savedInstances[configName];
            adjustConfig = new AdjustConfig(null, null);
            adjustConfig.clone(frozenAdjustConfig);
        } else {
            var environment = this.getFirstParameterValue(params, 'environment');
            var appToken = this.getFirstParameterValue(params, 'appToken');

            adjustConfig = new AdjustConfig(appToken, environment);
            this.savedInstances[configName] = adjustConfig;
        }

        if ('logLevel' in params) {
            var logLevelS = this.getFirstParameterValue(params, 'logLevel');
            var logLevel = null;
            switch (logLevelS) {
                case "verbose": logLevel = AdjustConfig.LogLevelVerbose;
                    break;
                case "debug": logLevel = AdjustConfig.LogLevelDebug;
                    break;
                case "info": logLevel = AdjustConfig.LogLevelInfo;
                    break;
                case "warn": logLevel = AdjustConfig.LogLevelWarn;
                    break;
                case "error": logLevel = AdjustConfig.LogLevelError;
                    break;
                case "assert": logLevel = AdjustConfig.LogLevelAssert;
                    break;
                case "suppress": logLevel = AdjustConfig.LogLevelSuppress;
                    break;
            }

            adjustConfig.setLogLevel(logLevel);
        }

        if ('defaultTracker' in params) {
            var defaultTracker = this.getFirstParameterValue(params, 'defaultTracker');
            adjustConfig.setDefaultTracker(defaultTracker);
        }

        if ('delayStart' in params) {
            var delayStartS = this.getFirstParameterValue(params, 'delayStart');
            var delayStart = parseFloat(delayStartS);
            adjustConfig.setDelayStart(delayStart);
        }

        if ('eventBufferingEnabled' in params) {
            var eventBufferingEnabledS = this.getFirstParameterValue(params, 'eventBufferingEnabled');
            var eventBufferingEnabled = (eventBufferingEnabledS == 'true');
            adjustConfig.setEventBufferingEnabled(eventBufferingEnabled);
        }

        if ('sendInBackground' in params) {
            var sendInBackgroundS = this.getFirstParameterValue(params, 'sendInBackground');
            var sendInBackground = (sendInBackgroundS == 'true');
            adjustConfig.setSendInBackground(sendInBackground);
        }

        if ('userAgent' in params) {
            var userAgent = this.getFirstParameterValue(params, 'userAgent');
            adjustConfig.setUserAgent(userAgent);
        }

        //resave the modified adjustConfig
        this.savedInstances[configName] = adjustConfig;
    }

    start(params) {
        this.config(params);
        var configName = null;
        if ('configName' in params) {
            configName = this.getFirstParameterValue(params, 'configName');
        } else {
            configName = this.DefaultConfigName;
        }

        var frozenAdjustConfig = this.savedInstances[configName];
        var adjustConfig = new AdjustConfig(null, null);
        adjustConfig.clone(frozenAdjustConfig);

        adjustConfig.setBasePath(this.basePath);

        //resave the modified adjustConfig
        this.savedInstances[configName] = adjustConfig;
        Adjust.create(adjustConfig);
    }

    event(params) {
        var eventName = null;
        if ('eventName' in params) {
            eventName = this.getFirstParameterValue(params, 'eventName');
        } else {
            eventName = this.DefaultEventName;
        }

        var adjustEvent;
        if (eventName in this.savedInstances) {
            var frozenAdjustEvent = this.savedInstances[eventName];
            adjustEvent = new AdjustEvent(null);
            adjustEvent.clone(frozenAdjustEvent);
        } else {
            var eventToken = this.getFirstParameterValue(params, 'eventToken');
            adjustEvent = new AdjustEvent(eventToken);
            this.savedInstances[eventName] = adjustEvent;
        } 

        if ('revenue' in params) {
            var revenueParams = this.getValueFromKey(params, 'revenue');
            var currency = revenueParams[0];
            var revenue = parseFloat(revenueParams[1]);
            adjustEvent.setRevenue(revenue, currency);
        }

        if ('callbackParams' in params) {
            var callbackParams = this.getValueFromKey(params, "callbackParams");
            for (var i = 0; i < callbackParams.length; i = i + 2) {
                var key = callbackParams[i];
                var value = callbackParams[i + 1];
                adjustEvent.addCallbackParameter(key, value);
            }
        }
        if ('partnerParams' in params) {
            var partnerParams = this.getValueFromKey(params, "partnerParams");
            for (var i = 0; i < partnerParams.length; i = i + 2) {
                var key = partnerParams[i];
                var value = partnerParams[i + 1];
                adjustEvent.addPartnerParameter(key, value);
            }
        }
        //TODO: Add JS wrapper for order Id
        //if ('orderId' in params) {
        //var orderId = this.getFirstParameterValue(params, 'orderId');
        //adjustEvent.setOrderId(orderId);
        //}

        //resave the modified adjustEvent
        this.savedInstances[eventName] = adjustEvent;

        Adjust.trackEvent(adjustEvent);
    }

    trackEvent(params) {
        this.event(params);
        var eventName = null;
        if ('eventName' in params) {
            eventName = this.getFirstParameterValue(params, 'eventName');
        } else {
            eventName = this.DefaultEventName;
        }
        var adjustEvent = this.savedInstances[eventName];
        Adjust.trackEvent(adjustEvent);
    }

    setReferrer(params) {
        var referrer = this.getFirstParameterValue(params, 'referrer');
        Adjust.setReferrer(referrer);
    }

    pause(params) {
        Adjust.onPause();
    }

    resume(params) {
        Adjust.onResume();
    }

    setEnabled(params) {
        var enabled = this.getFirstParameterValue(params, "enabled") == 'true';
        Adjust.setEnabled(enabled);
    }

    setOfflineMode(params) {
        var enabled = this.getFirstParameterValue(params, "enabled") == 'true';
        Adjust.setOfflineMode(enabled);
    }

    sendFirstPackages(params) {
        Adjust.sendFirstPackages();
    }

    addSessionCallbackParameter(params) {
        for (var param in this.getValueFromKey(params, "KeyValue")) {
            var key = param[0];
            var value = param[1];
            console.log(`[*RN*] addSessionCallbackParameter: key ${key} value ${value}`);
            Adjust.addSessionCallbackParameter(key, value);
        }
    }

    addSessionPartnerParameter(params) {
        for (var param in this.getValueFromKey(params, "KeyValue")) {
            var key = param[0];
            var value = param[1];
            console.log(`[*RN*] addSessionPartnerParameter: key ${key} value ${value}`);
            Adjust.addSessionPartnerParameter(key, value);
        }
    }

    removeSessionCallbackParameter(params) {
        var key = this.getFirstParameterValue(params, 'key');
        Adjust.removeSessionCallbackParameter(key);
    }

    removeSessionPartnerParameter(params) {
        var key = this.getFirstParameterValue(params, 'key');

        Adjust.removeSessionPartnerParameter(key);
    }

    resetSessionCallbackParameters(params) {
        Adjust.resetSessionCallbackParameters();
    }

    resetSessionPartnerParameters(params) {
        Adjust.resetSessionPartnerParameters();
    }

    setPushToken(params) {
        var token = this.getFirstParameterValue(params, 'pushToken');
        Adjust.setPushToken(token);
    }

    openDeeplink(params) {
        console.log("[*RN*] openDeeplink");
        var deeplink = this.getFirstParameterValue(params, "deeplink");
        Adjust.appWillOpenUrl(deeplink);
    }

    testBegin(params) {
        console.log("[*RN*] testBegin");
        if ('basePath' in params) {
            this.basePath = this.getFirstParameterValue(params, "basePath");
        }

        Adjust.teardown(true);
        Adjust.setTimerInterval(-1);
        Adjust.setTimerStart(-1);
        Adjust.setSessionInterval(-1);
        Adjust.setSubsessionInterval(-1);
        for (var member in this.savedInstances) delete this.savedInstances[member];
    }

    testEnd(params) {
        console.log("[*RN*] testEnd");
        Adjust.teardown(true);
    }

    getValueFromKey(params, key) {
        if (key in params) {
            return params[key];
        }

        return null;
    }

    getFirstParameterValue(params, key) {
        if (key in params) {
            var param = params[key];
            if(param != null || param.length >= 1) {
                return param[0];
            }
        }

        return null;
    }
}

export default CommandExecutor;
