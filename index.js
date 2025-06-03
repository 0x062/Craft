const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bold: "\x1b[1m"
};

const logger = {
  info: (msg) => console.log(`${colors.green}[✓] ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}[⚠] ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}[✗] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}[✅] ${msg}${colors.reset}`),
  loading: (msg) => console.log(`${colors.cyan}[⟳] ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.white}[➤] ${msg}${colors.reset}`),
  banner: () => {
    console.log(`${colors.cyan}${colors.bold}`);
    console.log(`---------------------------------------------`);
    console.log(`  Craft World Auto Bot - Airdrop Insiders  `);
    console.log(`---------------------------------------------${colors.reset}`);
    console.log();
  }
};

const getRandomUserAgent = () => {
  const browsers = [
    { ua: '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"', platform: 'Windows' },
    { ua: '"Google Chrome";v="128", "Chromium";v="128", "Not;A=Brand";v="99"', platform: 'Macintosh' },
    { ua: '"Firefox";v="127", "Gecko";v="20100101", "Mozilla";v="5.0"', platform: 'Linux' },
    { ua: '"Safari";v="17.0", "AppleWebKit";v="605.1.15", "Version";v="17.0"', platform: 'Macintosh' }
  ];
  const selected = browsers[Math.floor(Math.random() * browsers.length)];
  return { 'sec-ch-ua': selected.ua, 'sec-ch-ua-platform': selected.platform };
};

class CraftWorldBot {
  constructor() {
    this.baseURL = 'https://preview.craft-world.gg/api/1/user-actions/ingest';
    this.authToken = null;
    this.mineId = '06838603-fec0-7831-8000-01085828af7a';
    this.factoryId = '0683ea27-51fb-7e76-8000-334a76e821ae';
    this.areaId = '0683e9f4-3f4f-7df3-8000-490a6d41be7e';
    this.isRunning = false;
    this.previousResources = {};

    const userAgent = getRandomUserAgent();

    this.headers = {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.7",
      "content-type": "application/json",
      "priority": "u=1, i",
      "sec-ch-ua": userAgent['sec-ch-ua'],
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": userAgent['sec-ch-ua-platform'],
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-app-version": "0.33.7",
      "Referer": "https://preview.craft-world.gg/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };
  }

  setAuthToken(token) {
    this.authToken = `Bearer jwt_${token}`;
    this.headers.authorization = this.authToken;
    logger.success('Auth token set successfully');
  }

  setFactoryId(factoryId) {
    this.factoryId = factoryId;
    logger.info(`Factory ID set: ${factoryId}`);
  }

  setAreaId(areaId) {
    this.areaId = areaId;
    logger.info(`Area ID set: ${areaId}`);
  }

  generateActionId() {
    return uuidv4();
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getResourceEmoji(symbol) {
    const emojiMap = {
      'EARTH': '🌍', 'WATER': '💧', 'FIRE': '🔥', 'MUD': '🟤',
      'CLAY': '🧱', 'SAND': '🏖️', 'COPPER': '🟠', 'SEAWATER': '🌊',
      'HEAT': '🌡️', 'ALGAE': '🌿', 'LAVA': '🌋', 'CERAMICS': '🏺',
      'STEEL': '⚙️', 'OXYGEN': '💨', 'GLASS': '🪟', 'GAS': '💨',
      'STONE': '🪨', 'STEAM': '♨️', 'SCREWS': '🔩', 'FUEL': '⛽',
      'CEMENT': '🏗️', 'OIL': '🛢️', 'ACID': '🧪', 'SULFUR': '💛',
      'PLASTICS': '♻️', 'FIBERGLASS': '🪟', 'ENERGY': '⚡', 'HYDROGEN': '💨',
      'DYNAMITE': '💥', 'COIN': '🪙'
    };
    return emojiMap[symbol] || '📦';
  }

  displayResourceInfo(account) {
    logger.step('=== RESOURCE INFORMATION ===');
    logger.info(`Power: ${this.formatNumber(account.power || 0)}`);
    logger.info(`Experience Points: ${this.formatNumber(account.experiencePoints || 0)}`);
    logger.info(`Wallet: ${account.walletAddress || 'N/A'}`);
    if (account.skillPoints !== undefined) {
      logger.info(`Skill Points: ${this.formatNumber(account.skillPoints)}`);
    }

    logger.step('Resources:');
    if (account.resources && Array.isArray(account.resources)) {
      const availableResources = account.resources.filter(resource => resource.amount > 0);
      if (availableResources.length > 0) {
        availableResources.forEach(resource => {
          const emoji = this.getResourceEmoji(resource.symbol);
          logger.info(`${emoji} ${resource.symbol}: ${this.formatNumber(resource.amount)}`);
        });
      } else {
        logger.info('No resources available');
      }
    }
  }

  storeCurrentResources(account) {
    this.previousResources = {};
    if (account.resources && Array.isArray(account.resources)) {
      account.resources.forEach(resource => {
        this.previousResources[resource.symbol] = resource.amount;
      });
    }
    this.previousResources.power = account.power || 0;
    this.previousResources.experiencePoints = account.experiencePoints || 0;
    this.previousResources.skillPoints = account.skillPoints || 0;
  }

  displayClaimSummary(account) {
    const updates = [];
    if (account.resources && Array.isArray(account.resources)) {
      account.resources
        .filter(resource => resource.amount > 0)
        .forEach(resource => {
          const emoji = this.getResourceEmoji(resource.symbol);
          updates.push(`[✓] ${emoji} ${resource.symbol}: ${this.formatNumber(resource.amount)}`);
        });
    }
    if (account.experiencePoints !== undefined) {
      updates.push(`[✓] Experience Points: ${this.formatNumber(account.experiencePoints)}`);
    }
    return updates.join(' , ');
  }

  async startFactory() {
    try {
      const actionId = this.generateActionId();
      const payload = {
        data: [{
          id: actionId,
          actionType: "START_FACTORY",
          payload: { factoryId: this.factoryId },
          time: Date.now()
        }]
      };

      const response = await axios.post(this.baseURL, payload, { headers: this.headers });
      if (response.data.data.processed.includes(actionId)) {
        return true;
      }
      logger.error('Failed to start factory');
      return false;
    } catch (error) {
      logger.error('Error starting factory: ' + (error.response?.data || error.message));
      return false;
    }
  }

  async claimArea(amountToClaim = 1) {
    try {
      const actionId = this.generateActionId();
      const payload = {
        data: [{
          id: actionId,
          actionType: "CLAIM_AREA",
          payload: { areaId: this.areaId, amountToClaim },
          time: Date.now()
        }]
      };

      const response = await axios.post(this.baseURL, payload, { headers: this.headers });
      if (response.data.data.processed.includes(actionId)) {
        return true;
      }
      logger.error('Failed to claim area');
      return false;
    } catch (error) {
      logger.error('Error claiming area: ' + (error.response?.data || error.message));
      return false;
    }
  }

  async startMine() {
    try {
      const actionId = this.generateActionId();
      const payload = {
        data: [{
          id: actionId,
          actionType: "START_MINE",
          payload: { mineId: this.mineId },
          time: Date.now()
        }]
      };

      const response = await axios.post(this.baseURL, payload, { headers: this.headers });
      if (response.data.data.processed.includes(actionId)) {
        this.storeCurrentResources(response.data.data.account);
        return response.data.data.account;
      }
      logger.error('Failed to start mine');
      return null;
    } catch (error) {
      logger.error('Error starting mine: ' + (error.response?.data || error.message));
      return null;
    }
  }

  async claimMine() {
    try {
      const actionId = this.generateActionId();
      const payload = {
        data: [{
          id: actionId,
          actionType: "CLAIM_MINE",
          payload: { mineId: this.mineId },
          time: Date.now()
        }]
      };

      const response = await axios.post(this.baseURL, payload, { headers: this.headers });
      if (response.data.data.processed.includes(actionId)) {
        return response.data.data.account;
      }
      logger.error('Failed to claim mine');
      return null;
    } catch (error) {
      logger.error('Error claiming mine: ' + (error.response?.data || error.message));
      return null;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async startCombinedLoop(mineInterval = 30000, claimInterval = 60000, enableFactory = false, enableArea = false) {
    if (this.isRunning) {
      logger.warn('Bot is already running!');
      return;
    }

    if (!this.authToken) {
      logger.error('Please set auth token first using setAuthToken()');
      return;
    }

    this.isRunning = true;
    let mineCount = 0;

    while (this.isRunning) {
      try {
        logger.step(`=== CYCLE ${mineCount + 1} ===`);
        logger.loading('Starting mine and factory...');

        const mineAccount = await this.startMine();
        if (mineAccount) {
          logger.success('Mine started successfully');
        }

        if (enableFactory) {
          await this.sleep(2000);
          const factorySuccess = await this.startFactory();
          if (factorySuccess) {
            logger.success('Factory started successfully');
          }
        }

        logger.loading(`Waiting ${mineInterval/1000}s before claiming...`);
        await this.sleep(mineInterval);

        const claimAccount = await this.claimMine();
        if (claimAccount) {
          logger.success(`Mine claimed successfully - ${this.displayClaimSummary(claimAccount)}`);
        }

        if (enableArea) {
          await this.sleep(2000);
          const areaSuccess = await this.claimArea(1);
          if (areaSuccess) {
            logger.success('Area claimed successfully');
          }
        }

        mineCount++;
        logger.loading(`Waiting ${claimInterval/1000}s before next cycle...`);
        await this.sleep(claimInterval);
      } catch (error) {
        logger.error('Error in combined loop: ' + error.message);
        await this.sleep(5000);
      }
    }
  }

  async startFactoryLoop(interval = 60000) {
    if (this.isRunning) {
      logger.warn('Bot is already running!');
      return;
    }

    if (!this.authToken) {
      logger.error('Please set auth token first using setAuthToken()');
      return;
    }

    this.isRunning = true;
    let factoryCount = 0;

    while (this.isRunning) {
      try {
        logger.step(`=== FACTORY CYCLE ${factoryCount + 1} ===`);
        const factorySuccess = await this.startFactory();
        if (factorySuccess) {
          logger.success('Factory started successfully');
        }

        logger.loading(`Waiting ${interval/1000}s before next factory start...`);
        await this.sleep(interval);
        factoryCount++;
      } catch (error) {
        logger.error('Error in factory loop: ' + error.message);
        await this.sleep(5000);
      }
    }
  }

  async startAreaLoop(interval = 30000, amountToClaim = 1) {
    if (this.isRunning) {
      logger.warn('Bot is already running!');
      return;
    }

    if (!this.authToken) {
      logger.error('Please set auth token first using setAuthToken()');
      return;
    }

    this.isRunning = true;
    let areaCount = 0;

    while (this.isRunning) {
      try {
        logger.step(`=== AREA CYCLE ${areaCount + 1} ===`);
        const areaSuccess = await this.claimArea(amountToClaim);
        if (areaSuccess) {
          logger.success('Area claimed successfully');
        }

        logger.loading(`Waiting ${interval/1000}s before next area claim...`);
        await this.sleep(interval);
        areaCount++;
      } catch (error) {
        logger.error('Error in area loop: ' + error.message);
        await this.sleep(5000);
      }
    }
  }

  async startMiningLoop(mineInterval = 30000, claimInterval = 60000) {
    if (this.isRunning) {
      logger.warn('Bot is already running!');
      return;
    }

    if (!this.authToken) {
      logger.error('Please set auth token first using setAuthToken()');
      return;
    }

    this.isRunning = true;
    let mineCount = 0;

    while (this.isRunning) {
      try {
        logger.step(`=== CYCLE ${mineCount + 1} ===`);
        logger.loading('Starting mine...');

        const mineAccount = await this.startMine();
        if (mineAccount) {
          logger.success('Mine started successfully');
        }

        logger.loading(`Waiting ${mineInterval/1000}s before claiming...`);
        await this.sleep(mineInterval);

        const claimAccount = await this.claimMine();
        if (claimAccount) {
          logger.success(`Mine claimed successfully - ${this.displayClaimSummary(claimAccount)}`);
        }

        mineCount++;
        logger.loading(`Waiting ${claimInterval/1000}s before next cycle...`);
        await this.sleep(claimInterval);
      } catch (error) {
        logger.error('Error in mining loop: ' + error.message);
        await this.sleep(5000);
      }
    }
  }

  stopBot() {
    this.isRunning = false;
    logger.warn('Bot stopped');
  }

  async getAccountInfo() {
    try {
      const actionId = this.generateActionId();
      const payload = {
        data: [{
          id: actionId,
          actionType: "START_MINE",
          payload: { mineId: this.mineId },
          time: Date.now()
        }]
      };

      const response = await axios.post(this.baseURL, payload, { headers: this.headers });
      return response.data.data.account;
    } catch (error) {
      logger.error('Error getting account info: ' + (error.response?.data || error.message));
      return null;
    }
  }

  async displayAccountStatus() {
    logger.loading('Fetching current account status...');
    const account = await this.getAccountInfo();
    if (account) {
      this.displayResourceInfo(account);
    } else {
      logger.error('Failed to fetch account status');
    }
  }
}

async function readTokens() {
  try {
    const data = await fs.readFile('token.txt', 'utf8');
    return data.split('\n').map(token => token.trim()).filter(token => token.length > 0);
  } catch (error) {
    logger.error('Error reading token.txt: ' + error.message);
    return [];
  }
}

async function main() {
  logger.banner(); 
  const tokens = await readTokens();

  if (tokens.length === 0) {
    logger.error('No tokens found in token.txt');
    return;
  }

  logger.info(`Found ${tokens.length} tokens in token.txt`);

  for (let i = 0; i < tokens.length; i++) {
    const bot = new CraftWorldBot();
    logger.step(`=== Processing Account ${i + 1}/${tokens.length} ===`);

    bot.setAuthToken(tokens[i]);
    await bot.displayAccountStatus();
    await bot.startCombinedLoop(30000, 60000, true, true);

    if (i < tokens.length - 1) {
      logger.loading(`Waiting 5 seconds before processing next account...`);
      await bot.sleep(5000);
    }

    bot.stopBot();
  }

  logger.success('All accounts processed!');
}

process.on('SIGINT', () => {
  logger.warn('Shutting down bot...');
  process.exit(0);
});

module.exports = CraftWorldBot;

if (require.main === module) {
  main().catch(error => logger.error('Main error: ' + error.message));
}