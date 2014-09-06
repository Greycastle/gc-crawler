var scribe = require('scribe');     

// Configuration
// --------------
scribe.configure(function(){
    scribe.set('app', 'gc-crawler');                     // NOTE Best way learn about these settings is
    scribe.set('logPath', './logs'); // Doublecheck       // them out for yourself.
    scribe.set('defaultTag', 'UNTAGGED');
    scribe.set('divider', ':::');
    scribe.set('identation', 5);                          // Identation before console messages
    scribe.set('maxTagLength', 30);                       // Any tags that have a length greather than 30 characters will be ignore
    scribe.set('mainUser', 'root');                       // Username of the account which is running the NodeJS server
});

// Create Loggers
// --------------
scribe.addLogger("log", true , true, 'green');            // (name, save to file, print to console,
scribe.addLogger('realtime', true, true, 'underline');    // tag color)
scribe.addLogger('high', true, true, 'magenta');
scribe.addLogger('normal', true, true, 'white');
scribe.addLogger('low', true, true, 'grey');
scribe.addLogger('info', true, true, 'cyan');
