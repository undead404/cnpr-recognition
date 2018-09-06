import camera from './camera';
import config from './config';
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
    console.info(recognitionResult);
    if (recognitionResult.results.length === 0) {
      return;
    }
    const { plate, confidence, region } = recognitionResult.results[0];
    const matchedPlate = [
      {
        plate: 'AK 9265 AK',
      },
    ].find(
      plateItem => plateItem && plateItem.plate.replace(' ', '') === plate,
    );
    if (matchedPlate) {
      console.info('Matched plate is ');
      console.info(matchedPlate);
    }
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
