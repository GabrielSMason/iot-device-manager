const API_BASE_URL = 'http://localhost:3000';

const deviceUnits = [
  { code: 1, unit: '°C', min: -10, max: 40 },
  { code: 2, unit: '%', min: 0, max: 100 },
  { code: 3, unit: 'hPa', min: 900, max: 1100 },
];

function getRandomValueForUnit(code) {
  const deviceUnit = deviceUnits.find((device) => device.code === code);
  if (!deviceUnit) return 0;
  const { min, max } = deviceUnit;
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendDeviceData(deviceId, password, value) {
  const response = await fetch(`${API_BASE_URL}/devices/value`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deviceId,
      password,
      value,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, message: ${data.message}`);
  }

  console.log(`Data sent successfully for ${deviceId}:`, data);
  return data;
}

async function getDeviceInfo(deviceId, password) {
  const response = await fetch(`${API_BASE_URL}/devices/info?deviceId=${encodeURIComponent(deviceId)}&password=${encodeURIComponent(password)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, message: ${data.message}`);
  }

  return data;
}

async function runDeviceLoop(deviceId, password, unitCode, intervalMs = 5000) {
  while (true) {
    const value = getRandomValueForUnit(unitCode);
    try {
      await sendDeviceData(deviceId, password, value);
    } catch (error) {
      console.error(`Failed to send data for ${deviceId}:`, error.message || error);
    }
    await delay(intervalMs);
  }
}

function printUsage() {
  console.log('Usage: node src/deviceClient.js <deviceId> <devicePwd>');
  console.log('The unit will be automatically retrieved from the database.');
}

const deviceId = process.argv[2];
const devicePwd = process.argv[3];

if (!deviceId || !devicePwd) {
  console.error('Error: deviceId and devicePwd are required.');
  printUsage();
  process.exit(1);
}

(async () => {
  try {
    const deviceInfo = await getDeviceInfo(deviceId, devicePwd);
    const unitCode = deviceInfo.unit;
    console.log(`Device ${deviceId} has unit code: ${unitCode}`);
    await runDeviceLoop(deviceId, devicePwd, unitCode);
  } catch (error) {
    console.error('Failed to get device info or run loop:', error.message || error);
    process.exit(1);
  }
})();