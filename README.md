# Craft World Auto Bot 🎮

An automated bot for Craft World game that handles mining, factory operations, and area claiming with multi-account support.

## Features ✨

- **Automated Mining**: Start and claim mines automatically
- **Factory Operations**: Automated factory management
- **Area Claiming**: Auto-claim areas for expansion
- **Multi-Account Support**: Process multiple accounts sequentially

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/vikitoshi/Craft-World-Auto-Bot.git
   cd Craft-World-Auto-Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create configuration files**
   ```bash
   touch token.txt
   touch config.json
   ```

4. **Add your tokens**
   Open `token.txt` and add your JWT tokens (one per line):
   ```
   your_jwt_token_1
   your_jwt_token_2
   your_jwt_token_3
   ```

5. **Configure account IDs**
   Create `config.json` with your mine, factory, and area IDs:
   ```json
   {
     "mineId_1": "your_mine_id_for_account_1",
     "factoryId_1": "your_factory_id_for_account_1",
     "areaId_1": "your_area_id_for_account_1",
     "mineId_2": "your_mine_id_for_account_2",
     "factoryId_2": "your_factory_id_for_account_2",
     "areaId_2": "your_area_id_for_account_2"
   }
   ```
   
   > **Note**: Each account needs its own set of IDs. Use the format `{type}Id_{number}` where number starts from 1.

## Usage 💻

### Quick Start
```bash
node index.js
```

## Getting Required IDs 🔍

You need to obtain three types of IDs for each account: Mine ID, Factory ID, and Area ID.

### Step-by-Step Tutorial:

1. **Open Craft World Game**
   - Go to [https://preview.craft-world.gg/](https://preview.craft-world.gg/)
   - Login to your account

2. **Open Developer Tools**
   - Press `F12` or right-click and select "Inspect Element"
   - Go to the **Network** tab
   - Make sure to check "Preserve log" option

3. **Get Mine ID**
   - In the game, click on any mine to start mining
   - In the Network tab, look for requests to `user-actions/ingest`
   - Click on the request and check the **Request Payload**
   - Look for `"actionType": "START_MINE"` and copy the `mineId` value
   
   ![Mine ID Location](https://github.com/vikitoshi/Craft-World-Auto-Bot/blob/main/1.PNG?raw=true)
   
4. **Get Factory ID**
   - Click on any factory in the game to start production
   - In the Network tab, find the request with `"actionType": "START_FACTORY"`
   - Copy the `factoryId` value from the payload
   
   ![Factory ID Location](https://github.com/vikitoshi/Craft-World-Auto-Bot/blob/main/2.PNG?raw=true)

5. **Get Area ID**
   - Click on any area to claim it
   - Look for requests with `"actionType": "CLAIM_AREA"`
   - Copy the `areaId` value from the payload
   
   ![Area ID Location](https://github.com/vikitoshi/Craft-World-Auto-Bot/blob/main/3.PNG?raw=true)

### Example Network Request:
```json
{
  "data": [{
    "id": "uuid-here",
    "actionType": "START_MINE",
    "payload": {
      "mineId": "06838603-fec0-7831-8000-01085828af7a"
    },
    "time": 1234567890
  }]
}
```

### Config.json Example:
```json
{
  "mineId_1": "06838603-fec0-7831-8000-01085828af7a",
  "factoryId_1": "0683ea27-51fb-7e76-8000-334a76e821ae", 
  "areaId_1": "0683e9f4-3f4f-7df3-8000-490a6d41be7e",
  "mineId_2": "different-mine-id-for-account-2",
  "factoryId_2": "different-factory-id-for-account-2",
  "areaId_2": "different-area-id-for-account-2"
}
```

## File Structure 📁

```
Craft-World-Auto-Bot/
├── index.js          # Main bot script
├── token.txt          # JWT tokens (one per line)
├── config.json        # Account IDs configuration
├── package.json       # Node.js dependencies
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## Security Notes 🔒

- ⚠️ **Never share your JWT tokens**
- 🔐 Keep your `token.txt` and `config.json` files secure and private
- 🚫 Don't commit tokens or sensitive IDs to version control
- 🔄 Tokens may expire and need refreshing
- 🔒 Each account has unique IDs - don't mix them up

## Troubleshooting 🔧

### Common Issues

1. **"No tokens found in token.txt"**
   - Make sure `token.txt` exists in the project directory
   - Ensure tokens are properly formatted (one per line)
   - Check that tokens don't have extra spaces

2. **"Missing IDs for account X in config.json"**
   - Make sure `config.json` exists and is properly formatted
   - Verify you have `mineId_X`, `factoryId_X`, and `areaId_X` for each account
   - Check that the JSON syntax is correct

3. **"Error: ENOTFOUND preview.craft-world.gg"**
   - Check your internet connection
   - Verify the game servers are online

4. **"Failed to start mine/factory/claim area"**
   - Token might be expired - get a fresh token
   - Check if your account has sufficient resources
   - Verify that your IDs are correct and not expired

5. **Bot stops unexpectedly**
   - Check console for error messages
   - Ensure stable internet connection
   - The bot now has retry mechanisms for failed requests

### Getting JWT Tokens

1. Open Craft World in your browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Perform any action in the game
5. Look for requests to `craft-world.gg/api`
6. Copy the JWT token from the Authorization header (it will be in format: `Bearer jwt_your_token_here`)
7. Only copy the part after `jwt_` for your token.txt file

### Getting Account IDs

Follow the detailed tutorial above in the "Getting Required IDs" section to obtain your Mine ID, Factory ID, and Area ID for each account.

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Disclaimer ⚠️

This bot is for educational purposes only. Use at your own risk. The developers are not responsible for any account suspensions or other consequences resulting from the use of this bot.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

If you find this project helpful, please give it a ⭐ on GitHub!

For issues and questions, please open an issue in the GitHub repository.

---

**Happy Botting!** 🎮✨
