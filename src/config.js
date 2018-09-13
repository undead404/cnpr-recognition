import path from 'path';

export default {
  camera: {
    // Picture related
    width: 1280,
    height: 720,
    quality: 100,

    // Delay to take shot
    // delay: 2,
    // Number of frames to skip
    // for a camera to self-adjust
    skip: 30,

    saveShots: true,

    // [jpeg, png] support varies
    // Webcam.OutputTypes
    output: 'jpeg',

    // Which camera to use
    // Use Webcam.list() for results
    // false for default device
    device: false,

    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: 'location',

    // Logging
    verbose: true,
  },
  captureDelay: 5000, // ms
  country: 'ua',
  currentViewJpgPath: path.resolve('.', 'tmp', 'current.jpg'),
  dbFileName: path.resolve('..', 'recognition.db'),
  region: 'eu',
};
