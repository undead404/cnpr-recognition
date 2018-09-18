import readline from 'readline';
import camera from './camera';
import config from './config';
import db from './database';
import recognize from './recognize';

async function captureAndRecognize() {
  try {
    const imageFileName = await new Promise((resolve, reject) => {
      camera.capture(config.currentViewJpgPath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    const recognitionResult = await recognize(imageFileName);
    if (recognitionResult.results.length === 0) {
      console.info('No plates found');
      return;
    }
    const { plate, confidence, region } = recognitionResult.results[0];
    const matchedPlate = await db.getPlateByNumber(plate);
    const report = {
      dateTime: recognitionResult.dateTime,
      plate,
      isAllowed: matchedPlate ? matchedPlate.isAllowed : false,
      confidence,
      region,
      id: matchedPlate ? matchedPlate.id : null,
    };
    console.info(report);
  } catch (err) {
    console.error(err);
  }
}
const timer = setInterval(captureAndRecognize, config.captureDelay);

if (process.platform === 'win32') {
  readline
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .on('SIGINT', () => {
      process.emit('SIGINT');
    });
}

process.on('SIGINT', async () => {
  clearInterval(timer);
  if (db.isOpen()) {
    await db.close();
  }
  process.exit();
});
