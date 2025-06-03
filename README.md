# Craft World Auto Bot 🎮

An automated bot for Craft World game that handles mining, factory operations, and area claiming with multi-account support.

## Features ✨

-  **Automated Mining**: Start and claim mines automatically
-  **Factory Operations**: Automated factory management
-  **Area Claiming**: Auto-claim areas for expansion
-  **Multi-Account Support**: Process multiple accounts sequentially
-  **Secure**: Uses proper authentication headers

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

3. **Create token file**
   ```bash
   touch token.txt
   ```

4. **Add your tokens**
   Open `token.txt` and add your JWT tokens (one per line):
   ```
   your_jwt_token_1
   your_jwt_token_2
   your_jwt_token_3
   ```

## Usage 💻

### Quick Start
```bash
node index.js
```
## File Structure 📁

```
Craft-World-Auto-Bot/
├── index.js          # Main bot script
├── token.txt          # JWT tokens (one per line)
├── package.json       # Node.js dependencies
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## Security Notes 🔒

- ⚠️ **Never share your JWT tokens**
- 🔐 Keep your `token.txt` file secure and private
- 🚫 Don't commit tokens to version control
- 🔄 Tokens may expire and need refreshing

## Troubleshooting 🔧

### Common Issues

1. **"No tokens found in token.txt"**
   - Make sure `token.txt` exists in the project directory
   - Ensure tokens are properly formatted (one per line)
   - Check that tokens don't have extra spaces

2. **"Error: ENOTFOUND preview.craft-world.gg"**
   - Check your internet connection
   - Verify the game servers are online

3. **"Failed to start mine/factory/claim area"**
   - Token might be expired - get a fresh token
   - Check if your account has sufficient resources
   - Verify factory/area IDs are correct

4. **Bot stops unexpectedly**
   - Check console for error messages
   - Ensure stable internet connection
   - Restart the bot if needed

### Getting JWT Tokens

1. Open Craft World in your browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Perform any action in the game
5. Look for requests to `craft-world.gg/api`
6. Copy the JWT token from the Authorization header

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