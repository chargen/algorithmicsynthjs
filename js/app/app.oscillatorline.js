(function(App) {
    "use strict";

    var OscillatorLine = function(properties) {
        this.filter = this.createFilter();
        this.oscillator = this.createAlgorithmicOscillator();
        this.enabled = true;

        if(properties) {
            this.setProperties(properties);
        }
    };

    OscillatorLine.prototype.setProperties = function(properties) {
        if(properties.hasOwnProperty('enabled')) {
            this.enabled = !!properties.enabled;
        }

        if(properties.hasOwnProperty('filter')) {
            this.setFilter(properties.filter);
        }

        if(properties.hasOwnProperty('oscillator')) {
            this.setOscillator(properties.oscillator);
        }
    };

    OscillatorLine.prototype.setFilter = function(properties) {
        this.filter.setProperties(properties);
    };

    OscillatorLine.prototype.setOscillator = function(properties) {
        this.oscillator.setProperties(properties);
    };

    OscillatorLine.prototype.createFilter = function() {
        return new App.Filter();
    };

    OscillatorLine.prototype.createAlgorithmicOscillator = function() {
        return new App.AlgorithmicOscillator();
    };

    OscillatorLine.prototype.createNode = function(context, note) {
        note = note.copy();

        var oscillator = this.oscillator.createNode(context, note);
        var filter = this.filter.createNode(context, note);

        oscillator.connect(filter);

        return {
            filter : filter,
            oscillator : oscillator,
            output : filter
        };
    };

    OscillatorLine.prototype.isEnabled = function() {
        return this.enabled;
    };

    OscillatorLine.prototype.oscillator = null;
    OscillatorLine.prototype.filter = null;
    OscillatorLine.prototype.enabled = null;

    App.OscillatorLine = OscillatorLine;
}(App || {}));