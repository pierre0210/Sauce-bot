# Sauce discord bot

## Commands
* saucenao link
* saucenao attachment
* ascii2d link
* ascii2d attachment

## Feature
* automatic sauce search

## Usage
```
npm run build
```
The build result will be stored in `prod` folder.
```
npm start
```
When the bot is first started, it will generate an `example.config.json` file.
```json
{
  "DevGuildId": "",
  "SauceKey": "your-saucenao-api-key",
  "SauceChannels": [],
  "IsGlobal": false,
  "SauceMaxNRMS": 0.03,
  "SauceMinPSNR": 27.5
}
```
Rename it `config.json`.
The meaning of each value is shown as follows:
* DevGuildId: the guild id of the bot owner, if IsGlobal is set to false then the slash command will only be registered to this guild.
* SauceKey: saucenao api key, go to [SauceNAO](https://saucenao.com/user.php) to login or register a new account.
* SauceChannels: channels that want to enable automatic sauce detection.
* IsGlobal: set to true to enable global slash command which according to discord.js guide should take no more than an hour to register to every guild.
* SauceMaxNRMS: normalize root mean square error, this value should be set between 0 and 1, lower this value means increase the automatic sauce detection accuracy.
* SauceMinPSNR: peak single-to-soise ratio, the higher value will result in a more accurate sauce detection system.
> A higher automatic sauce detection accuracy will leads to a lower possibility to get a result.

> SauceChannels, SauceMaxNRMS and SauceMinPSNR only affect the automatic sauce search service.
