/*
    A class for managing jobs, handling bot events and passing messages around.
*/


const { APP } = require('./data/managers/GlobalManager');
const { PlaceManager } = require('./data/managers/PlaceManager');
const { UserManager } = require('./data/managers/UserManager');
const { GroupManager } = require('./data/managers/GroupManager');
const { LogAdapter } = require('./io/adapters/LogAdapter');
const { BasicOutputAdapter } = require('./io/adapters/Basic/BasicOutputAdapter');
const { BasicInputAdapter } = require('./io/adapters/Basic/BasicInputAdapter');
const { ChatTheme } = require('./io/themes/ChatTheme');
const { SQLiteController } = require('./data/storage/controllers/SQLiteController');
const { JSONController } = require('./data/storage/controllers/JSONController');
const { MemoryController } = require('./data/storage/controllers/MemoryController');
const { Dispatcher } = require('./commands/Dispatcher');
const { CommandManager } = require('./commands/CommandManager');
const { BUIDManager } = require('./data/managers/BUIDManager');
const { ConfigManager } = require('./data/managers/ConfigManager');
const path = require('node:path');


class BotController {
    constructor() {
        APP.add('SQLITE', new SQLiteController());
        APP.add('JSON', new JSONController());
        APP.add('MEMORY', new MemoryController());
        APP.add('configs', new ConfigManager());
        APP.add('buids', new BUIDManager());
        APP.add('groups', new GroupManager());
        APP.add('users', new UserManager());
        APP.add('places', new PlaceManager());
        APP.add('commands', new CommandManager());
        APP.add('dispatcher', new Dispatcher());

        APP.add('logging', new LogAdapter());
        APP.add('output', new BasicOutputAdapter(ChatTheme));
        APP.add('input', new BasicInputAdapter());

        APP.get('events').on('inmessage', (message) => APP.get('dispatcher').parse(message));
        APP.get('events').on('shutdown', this.cleanup);
    }

    async start() {
        await APP.get('configs').setup();
        APP.add(
            'storage',
            APP.get(APP.get('configs').getProperty('global', 'datacontroller'))
        );
        
        await APP.get('storage').setup();
        await APP.get('buids').setup();
        await APP.get('groups').setup();
        await APP.get('users').setup();
        await APP.get('places').setup();
        APP.get('logging').init();
        APP.get('output').init();
        APP.get('input').init();
        APP.get('events').emit('logmessage', "");
    }

    cleanup() {
        APP.get('events').emit('logmessage', "Shutting down...");

        APP.get('input').cleanup();
        APP.get('output').cleanup();
        APP.get('logging').cleanup();
    }
}

module.exports = { BotController };