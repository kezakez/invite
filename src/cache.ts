import NodeCache from 'node-cache';

export const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
export default cache;