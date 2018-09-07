import camera from './camera';
import config from './config';
import Database from './database';
import recognize from './recognize';

const db = new Database();

async function captureAndRecognize() {
  if (!db.isOpen()) {
    await db.init();
  }
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

setInterval(captureAndRecognize, config.captureDelay);
