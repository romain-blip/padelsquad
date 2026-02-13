import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.padelsquad.app',
  appName: 'PadelSquad',
  webDir: 'dist',
  server: {
    // En dev, tu peux décommenter ça pour pointer vers ton serveur local
    // url: 'http://192.168.1.XX:5173',
    // cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#163020',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#163020',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
