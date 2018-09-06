import nodeWebcam from 'node-webcam';
import config from './config';

export default nodeWebcam.create(config.camera);
