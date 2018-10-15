import NodeCache from 'node-cache';

import {
  getData as getDataReal,
  updateData as updateDataReal,
} from './sheet-data';
import { default as getConfigReal } from './config';
import { default as getTokenReal } from './auth';
import { Result } from './result';

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export async function getData(spreadsheetId, auth): Promise<any> {
  const cacheKey = `data-${spreadsheetId}-${auth}`;
  let data = cache.get(cacheKey);
  if (!data) {
    console.log('data cache miss');
    data = await getDataReal(spreadsheetId, auth);
    cache.set(cacheKey, data);
  }
  return data;
}

export async function updateData(
  spreadsheetId,
  auth,
  rowsFiltered,
  updateDataArray,
  ipAddress,
): Promise<Result> {
  const cacheKey = `data-${spreadsheetId}-${auth}`;

  cache.del(cacheKey);

  return updateDataReal(
    spreadsheetId,
    auth,
    rowsFiltered,
    updateDataArray,
    ipAddress,
  );
}

export async function getConfig(): Promise<any> {
  const cacheKey = `config`;
  let data = cache.get(cacheKey);
  if (!data) {
    console.log('config cache miss');
    data = await getConfigReal();
    cache.set(cacheKey, data);
  }
  return data;
}

export async function getToken(): Promise<any> {
  const cacheKey = `token`;
  let data = cache.get(cacheKey);
  if (!data) {
    console.log('token cache miss');
    data = await getTokenReal();
    cache.set(cacheKey, data);
  }
  return data;
}
