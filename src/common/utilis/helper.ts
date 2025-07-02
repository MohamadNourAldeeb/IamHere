// import { IpService } from '../services/ip.service';

export const commonArrayElements = (firstArray: any, secondArray: any) => {
  return firstArray.filter((element: any) => secondArray.includes(element));
};
export const uncommonArrayElements = (firstArray: any, secondArray: any) => {
  return firstArray.filter((element: any) => !secondArray.includes(element));
};

function capitalizeFirstLetter(str: string): string {
  if (!str) return str; // Handle empty string
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ensureArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  } else if (value === null || value === undefined) {
    return [];
  } else if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return [value]; // Not valid JSON, treat as single item
    }
  } else {
    return [value];
  }
}

export function generatePassword(userName: string): string {
  const symbols = ['@', '#', '$', '&'];
  const randomSymbols = symbols[Math.floor(Math.random() * 4)];

  const numberPart = Math.floor(Math.random() * 9000) + 1000;

  userName = capitalizeFirstLetter(userName);
  return `${userName}${randomSymbols}${numberPart}`;
}

export const welcomeLog = async (port: string) => {
  console.log(
    '\x1b[33m%s\x1b[0m',
    '┌─────────────────────────────────────────────┐',
  );
  console.log(
    '\x1b[33m%s\x1b[0m',
    `│ Welcome to the I am here backend project 🆗 │`,
  );
  console.log(
    '\x1b[33m%s\x1b[0m',
    `│ This project is built using nest js      🔃 │`,
  );
  console.log(
    '\x1b[33m%s\x1b[0m',
    `│ and Mysql database with redis NoSql      🔛 │`,
  );
  console.log(
    '\x1b[33m%s\x1b[0m',
    `│ This is the development version ,        🔃 │`,
  );
  console.log(
    '\x1b[33m%s\x1b[0m',
    `│ server Run on PORT :${port}                    │`,
  );
  console.log(
    '\x1b[33m%s\x1b[0m',
    `│ database Run on PORT :${process.env.DB_PORT}                  │`,
  );
  console.log(
    '\x1b[33m%s\x1b[0m',
    `│ Developer : Eng Mohamed Nour El-Deeb     😊 │`,
  );
  console.log(
    '\x1b[33m%s\x1b[0m',
    '└─────────────────────────────────────────────┘',
  );
};

export const timeToMilliseconds = (timeString: string) => {
  const parts: any = timeString.split(' ');
  let totalMilliseconds = 0;

  for (const part of parts) {
    const [value, unit] = part.match(/(\d+)([dhm])/).slice(1);

    switch (unit.toLowerCase()) {
      case 'h':
        totalMilliseconds += parseInt(value) * 3600000; // Convert hours to milliseconds
        break;
      case 'd':
        totalMilliseconds += parseInt(value) * 86400000; // Convert days to milliseconds
        break;
      case 'm':
        totalMilliseconds += parseInt(value) * 60000; // Convert minutes to milliseconds
        break;
      default:
        console.error(`Unknown unit: ${unit}`);
    }
  }

  return totalMilliseconds;
};

export const timeToSeconds = (timeString: string) => {
  const parts: any = timeString.split(' ');
  let totalSeconds = 0;

  for (const part of parts) {
    const [value, unit] = part.match(/(\d+)([dhm])/).slice(1);

    switch (unit.toLowerCase()) {
      case 'h':
        totalSeconds += parseInt(value) * 3600; // Convert hours to seconds
        break;
      case 'd':
        totalSeconds += parseInt(value) * 86400; // Convert days to seconds
        break;
      case 'm':
        totalSeconds += parseInt(value) * 60; // Convert minutes to seconds
        break;
      default:
        console.error(`Unknown unit: ${unit}`);
    }
  }

  return totalSeconds;
};
