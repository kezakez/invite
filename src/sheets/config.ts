import fs from 'fs';
import path from 'path';
import util from 'util';

export async function getConfig() {
  // Load client secrets from a local file.
  const readFile = util.promisify(fs.readFile);
  try {
    console.log('reading config file');
    const content = await readFile(
      path.join(process.cwd(), 'config/config.json'),
    );
    return JSON.parse(content.toString());
  } catch (err) {
    console.log('Error loading config file:', err);
  }
}
export default getConfig;
