const o = require("ospec");
const {AppShell} = require('../bundle');


new function(o) {
    let clone = o.new();
    let describe = clone.spec;
    let it = clone;
    let expect = clone;
    let spyOn = clone.spy;    

    /**
     * lazyIoc Factory test suite
     */
    describe('AppShell#factory', function() {
        describe('when the same key is used twice', function() {
            clone.beforeEach(function() {
                let logger = {};
                logger.count = 0;
                logger.error = (err) => {
                        console.count++
                        console.log(err);
                }
                Object.assign(console, logger);
                this.b = new AppShell();
                let spy = spyOn(console.error);
                spy();
                this.b.factory('same.name', function() {
                    return function() { };
                });
            });
            describe('when the service has not yet been instantiated', function() {
                it('doesn\'t log an error', function() {
                    this.b.factory('same.name', function() { });
                    expect(console.count).equals(1);
                });
            });
            describe('when the service has already been instantiated', function() {
                clone.beforeEach(function() {
                    this.b.container.same.name();
                });
                it('logs an error', function(){
                    this.b.factory('same.name', function(){ });
                    expect(console.count).equals(3);
                });
            });
        });
        it('creates a provider instance on the container', function() {
            let inst = new AppShell();
            const ThingFactory = function() { };
            inst.factory('Thing', ThingFactory);
            expect(inst.container.ThingProvider).notEquals(undefined);
        });
        it('creates services, and gets passesed a container', function() {
            let inst = new AppShell();
            let invoked = 0;
            let spy = clone.spy(()=> {
                invoked++;
                return {active: true};
            });
            inst.factory('Thing', spy);
            expect(inst.container.Thing.active).equals(true);
            expect(invoked).equals(1);
        });

        it('will nest AppShell containers if the service name uses dot notation', function() {
            let b = new AppShell();
            let Thing = function() {};
            let ThingFactory = function() { return new Thing(); };
            b.factory('Util.Thing', ThingFactory);
            expect(b.container.Util).notEquals(undefined);
            expect(b.container.Util.ThingProvider).notEquals(undefined);
            expect(b.container.Util.Thing).notEquals(undefined);
        });
    });
    
    clone.run();
}(o);


