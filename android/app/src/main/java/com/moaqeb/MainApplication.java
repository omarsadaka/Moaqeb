package com.technosaab.moaqeb;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage; 
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; 
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // <-- Add this line
import com.reactnativecommunity.netinfo.NetInfoPackage;
 


import java.util.Arrays;
import java.util.List;



public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNVersionNumberPackage(),
            new RNDeviceInfo(),
            new ReactNativeRestartPackage(),
            new ImagePickerPackage(),
            new RNI18nPackage(),
            new RNFirebasePackage(),
           new RNFirebaseMessagingPackage(),
           new RNFirebaseNotificationsPackage() ,
           new NetInfoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
