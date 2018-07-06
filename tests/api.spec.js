const o = require("ospec");
const {AppShell} = require('../bundle');

new function(o) {
	let clone = o.new()

	clone.spec("lazyioc API", function() {
        const appShell = new AppShell();
        o.beforeEach(function() {
            acc = 0
        })
    
		clone("expect appShell to have a global property object 'config' ", function() {
            clone(typeof appShell.config === 'object').equals(
                true
            )('appShell should be an object')
		});
		clone('expect config.strict to be a bool property', function() {
			clone(appShell.config.strict).equals(false)('Should be boolean');
        });

        clone('expect appShell to expose a constant which is a function', () => { 
            clone(typeof appShell.constant).equals('function')
        });
        clone('expect appShell to expose a decorator which is a function', () => { 
            clone(typeof appShell.decorator).equals('function')
        });
        clone('expect appShell to expose a defer which is a function', () => { 
            clone(typeof appShell.defer).equals('function')
        });
        clone('expect appShell to expose a digest which is a function', () => { 
            clone(typeof appShell.digest).equals('function')
        });
        clone('expect appShell to expose a factory which is a function', () => { 
            clone(typeof appShell.factory).equals('function')
        });
        clone('expect appShell to expose a provider which is a function', () => { 
            clone(typeof appShell.provider).equals('function')
        });

        clone('expect appShell to expose a instanceFactory which is a function', () => {
            clone(typeof appShell.instanceFactory).equals('function');
        });

        clone('expect appShell to expose a list which is a function', () => {
            clone(typeof appShell.list).equals('function');
        });

        clone("expect appShell to expose a middleware which is a function", () => {
            clone(typeof appShell.middleware).equals('function')
        });

        clone('expect appShell to expose a register function', () => {
            clone(typeof appShell.register).equals('function');
        });

        clone('expect appShell to expose a resolve function', () => {
            clone(typeof appShell.resolve).equals('function');
        });

        clone('epect appShell to expose a service function', () => {
            clone(typeof appShell.service).equals('function');
        });

        clone("expose value", function() {
            clone(typeof appShell.value).equals('function');
        });

        clone("expose container on the instance", ()  => {
            clone(typeof appShell.container).equals('object');
        });
	});
	clone.run();
}(o);
