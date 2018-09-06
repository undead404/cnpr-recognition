import childProcess from 'child_process';
import fs from 'fs';
import moment from 'moment';
import config from './config';

let busy = false;
let lastResult;

export default async function recognize(imagePath) {
  if (busy) return Promise.reject(new Error('Recognition is busy'));
  if (imagePath && !fs.existsSync(imagePath)) {
    throw new Error(`File ${imagePath} doesn't exist`);
  }
  const cmd = `alpr -c ${config.region} -p ${config.country} ${imagePath} -j`;
  const result = await new Promise((resolve, reject) => {
    childProcess.exec(cmd, (err, stdout) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(stdout));
    });
  });
  if (
    result.results.length &&
    result.results[0].plate.length >= config.minNumberLength &&
    result.results[0].confidence > config.minConfidence
  ) {
    result.dateTime = moment(result.epoch_time).format('DD.MM.YYYY hh:mm:ss');
    if (lastResult && lastResult.results[0].plate === result.results[0].plate) {
      const diff = result.epoch_time - lastResult.epoch_time;
      console.info(`Last result delay: ${diff}`);
      if (diff < config.recognitionDelay) {
        return Promise.reject(new Error('Wait a little to recognize again'));
      }
    }
    console.info(result.results[0].plate);
    lastResult = result;
  }
  busy = false;
  return Promise.resolve(result);
}
