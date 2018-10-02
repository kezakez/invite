import { DateTime } from 'luxon';

export default function nowToString(): string {
  const value = DateTime.local().toFormat(`yyyy-MM-dd HH:mm:ss`);
  console.log(value);
  return value;
}
