(function(App) {
    "use strict";

    var AlgorithmicOscillator = function() {
        this.script = 'result = 0;';
        this.octave = 0;
        this.tuning = 0;
        this.fineTuning = 0;
        this.pan = 0;
        this.gain = 1;

        this.param1 = 0;
        this.param2 = 0;
        this.param3 = 0;
        this.param4 = 0;
    };

    // main parameters

    AlgorithmicOscillator.prototype.script = null;
    AlgorithmicOscillator.prototype.octave = null;
    AlgorithmicOscillator.prototype.tuning = null;
    AlgorithmicOscillator.prototype.fineTuning = null;
    AlgorithmicOscillator.prototype.pan = null;
    AlgorithmicOscillator.prototype.gain = null;

    // arbitrary parameters

    AlgorithmicOscillator.prototype.param1 = null;
    AlgorithmicOscillator.prototype.param2 = null;
    AlgorithmicOscillator.prototype.param3 = null;
    AlgorithmicOscillator.prototype.param4 = null;

    AlgorithmicOscillator.prototype.createNodeFunction = function() {
        var script = [
            'return (function(t, params, note) {',
                '"use strict";',
                'var result = 0, window, document;',
                this.script,
                'return result;',
            '}(t, params, note));'
        ].join('');

        var func = new Function('t', 'params', 'note', script); // necessary evil

        return func.bind(func);
    };

    AlgorithmicOscillator.prototype.setProperties = function(properties) {
        if(properties.hasOwnProperty('script')) {
            this.script = properties.script;
        }
        if(properties.hasOwnProperty('octave')) {
            this.octave = properties.octave;
        }
        if(properties.hasOwnProperty('tuning')) {
            this.tuning = properties.tuning;
        }
        if(properties.hasOwnProperty('fineTuning')) {
            this.fineTuning = properties.fineTuning;
        }
        if(properties.hasOwnProperty('pan')) {
            this.pan = properties.pan;
        }
        if(properties.hasOwnProperty('gain')) {
            this.gain = properties.gain;
        }

        if(properties.hasOwnProperty('param1')) {
            this.param1 = properties.param1;
        }

        if(properties.hasOwnProperty('param2')) {
            this.param2 = properties.param2;
        }

        if(properties.hasOwnProperty('param1')) {
            this.param3 = properties.param3;
        }

        if(properties.hasOwnProperty('param1')) {
            this.param4 = properties.param4;
        }
    };

    AlgorithmicOscillator.prototype.createNoteParameterObject = function(note) {

        //TODO calculate frequency relatively to octave, tuning and fineTuning

        return {
            frequency : note.frequency
        };
    };

    AlgorithmicOscillator.prototype.createParameterObject = function(context) {
        return {
            sampleRate : context.sampleRate,
            val1 : this.param1,
            val2 : this.param2,
            val3 : this.param3,
            val4 : this.param4
        };
    };

    AlgorithmicOscillator.prototype.createNode = function(context, note) {
        var func = this.createNodeFunction();

        var osc = context.createScriptProcessor(4096, 1, 2);

        //TODO make sure the way stereo gain is calculated is "good"

        var t = 0,
            leftGain = Math.min(1, Math.max(0, this.gain - this.pan)),
            rightGain = Math.min(1, Math.max(0, this.gain + this.pan));

        osc.onaudioprocess = function(event) {
            var buffer = event.outputBuffer,
                leftData = buffer.getChannelData(0),
                rightData = buffer.getChannelData(1);

            var params = this.createParameterObject(context),
                noteParams = this.createNoteParameterObject(note);

            for (var sample = 0; sample < buffer.length; sample++) {
                var sampleData = func(++t, params, noteParams);

                leftData[sample] = sampleData * leftGain;
                rightData[sample] = sampleData * rightGain;
            }
        }.bind(this);

        return osc;
    };

    App.AlgorithmicOscillator = AlgorithmicOscillator;
}(App || {}));