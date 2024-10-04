package com.genefied.modenik;


import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class AppRestartModule extends ReactContextBaseJavaModule {

    public AppRestartModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AppRestart";
    }

    @ReactMethod
    public void restart(Promise promise) {
        if (getCurrentActivity() != null) {
            Intent intent = getCurrentActivity().getIntent();
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            // Copy any extras from the current intent to the new intent if needed
            Bundle extras = intent.getExtras();
            if (extras != null) {
                intent.putExtras(extras);
            }
            getCurrentActivity().startActivity(intent);
            getCurrentActivity().finish();
            promise.resolve("App restarted successfully");
        } else {
            promise.reject("ERROR", "Current activity is null. Cannot restart the app.");
        }
    }
}