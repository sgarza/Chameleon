/**
Chameleon is a color manipulation library, that provides color palette functions
and legibility comparison among other common functionality found in other color management libraries
found across the web.

In this case its exposed as Chameleon for Easier coding.

@namespace none
@type Object
@requires Neon http://github.com/azendal/neon

Example:
  color = new Cameleon('#FF0000');
Returns Chameleon Object
**/
Class('Chameleon')({
    RGBRegExp : /^\s*rgba?\s*\((\d+)\,\s*(\d+)\,\s*(\d+)(,\s*(\d+))?\)\s*$/,

    HTMLRegExp : /^\#([0-9A-Fa-f]{6})$/,

    RGBToHSV : function(r,g,b){
        r = r/255,
        g = g/255,
        b = b/255;

        var h,s,v;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);

        if(max === min){
            h = 0;
        } else if (max === r){
            h = (60 * ( (g - b)/ (max - min) ) + 360) % 360;
        } else if (max === g){
            h = (60 * ( (b - r)/ (max - min) ) + 120);
        } else if (max === b){
            h = (60 * ( (r - g)/ (max - min) ) + 240);
        }

        if(max == 0){
            s = 0;
        } else {
            s = (max - min) / max;
        }

        v = max;

        h = Math.round(h);
        s = Math.round(s * 100);
        v = Math.round(v * 100);

        return {
            h : h,
            s : s,
            v : v
        }
    },

    HexStringToHSV : function(hexString){
        var r = parseInt(hexString.substr(0, 2), 16);
        var g = parseInt(hexString.substr(2, 2), 16);
        var b = parseInt(hexString.substr(4, 2), 16);

        if (!isNaN(r) && !isNaN(g) && !isNaN(b)){
            return this.RGBToHSV(r,g,b);
        }
    },

    HSVToRGB : function(h,s,v){
        var r,g,b;

        if(s == 0){
            r = g = b = Math.round(v * 2.55);
        } else {
            h /= 60;
            s /= 100;
            v /= 100;

            var i = Math.floor(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

            switch(i){
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                default: r = v; g = p; b = q;
            }

            r = Math.round(r * 255);
            g = Math.round(g * 255);
            b = Math.round(b * 255);
        }

        return {
            r : r,
            g : g,
            b : b
        }
    },

    prototype : {
        _h : 0,
        _s : 0,
        _v : 0,

        isAchromatic : false,

        init : function(config){
            if(config instanceof Chameleon){
                this._h = config.getHue();
                this._s = config.getSaturation();
                this._v = config.getValue();
            } else if(typeof(config) == 'string' && this.constructor.RGBRegExp.test(config)){
                var hsv = this.constructor.RGBToHSV(parseInt(RegExp.$1), parseInt(RegExp.$2), parseInt(RegExp.$3));
                this._h = hsv.h;
                this._s = hsv.s;
                this._v = hsv.v;
            } else if (typeof(config) == 'string' && this.constructor.HTMLRegExp.test(config)){
                var hsv = this.constructor.HexStringToHSV(RegExp.$1);
                this._h = hsv.h;
                this._s = hsv.s;
                this._v = hsv.v;
            } else if ((config instanceof Object) && config.hasOwnProperty('r') && config.hasOwnProperty('g') && config.hasOwnProperty('b')){
                var hsv = this.constructor.RGBToHSV(config.r, config.g, config.b);
                this._h = hsv.h;
                this._s = hsv.s;
                this._v = hsv.v;
            } else if ((config instanceof Object) && config.hasOwnProperty('h') && config.hasOwnProperty('s') && config.hasOwnProperty('v')){
                this._h = config.h;
                this._s = config.s;
                this._v = config.v;
            } else {
                console.log('color could not be parsed')
                console.log('color', typeof config)
                console.log(config)
                throw "unparseable color"
            }

            if(this._s == 0){
                this.isAchromatic = true;
            }
        },

        getHue : function(){
            return this._h;
        },

        getSaturation : function(){
            return this._s;
        },

        getValue : function(){
            return this._v;
        },

        setHue : function(value){
            this._h = value;
            return this;
        },

        setSaturation : function(value){
            this._s = value;
            if (this._s == 0) {
                this.isAchromatic = true
            }else{
                this.isAchromatic = false
            }
            return this;
        },

        setValue : function(value){
            this._v = value;
            return this;
        },

        iluminateBy : function(value){
            this._v = this._v + value;
            return this;
        },

        obscureBy : function(value){
            this._v = this._v - value;
            return this;
        },

        saturateBy: function(value){
            this.setSaturation(this._s + value);
            return this;
        },

        desaturateBy: function(value){
            this.setSaturation(this._s - value);
            return this;
        },

        rotateBy: function(shift){
            var rotated = this.copy();

            rotated._h += shift;

            if(rotated._h >= 360.0){
                rotated._h -= 360.0;
            }

            if(rotated._h < 0.0){
                rotated._h += 360.0;
            }
            return rotated;
        },

        warmBy : function(value){
            //implement
        },

        coolBy : function(value){
            //implement
        },

        transform : function(h,s,v){
            if(h > -1){ this._h = h }
            if(s > -1){ this._s = s }
            if(v > -1){ this._v = v }
            return this;
        },

        copy : function(){
            return new this.constructor(this);
        },

        // seems that 30 is a cool value, 25 is on the edge on my monitor
        isLegible : function(color){
            var c1 = color.toGray();
            var c2 = this.toGray();

            if( Math.abs(c1.getValue() - c2.getValue()) > 30 ){
                return true
            }

            return false;
        },

        getLegibles : function getLegibles(color){
            var legibleColors = [];
            if(this.isLegible(color)){
                legibleColors.push(color);
            }

            var currentColor;
            var h = color.getHue();

            if(color.isAchromatic){
                for(var v = 0; v < 100; v += 1){
                    currentColor = new this.constructor({h:h,s:0,v:v});
                    if(this.isLegible(currentColor)){
                        legibleColors.push(currentColor);
                    }
                }
            } else {
                for(var s = 0; s < 100; s += 10){
                    for(var v = 0; v < 100; v += 10){
                        currentColor = new this.constructor({h:h,s:s,v:v});
                        if(this.isLegible(currentColor)){
                            legibleColors.push(currentColor);
                        }
                    }
                }
            }

            var _legibles = {};

            for(var i = 0; i < legibleColors.length; i++){
                _legibles[legibleColors[i].toHTML()] = true;
            }

            var legibles = [];

            for(var i in _legibles){
                legibles.push(i);
            }

            var withColor = []
            var withoutColor = []

            $.each(legibles, function(){
                var color = new Chameleon(this.toString());
                var sum   = color._s + color._v;

                if(sum <= 130){
                    withoutColor.push(this);
                }else{
                    withColor.push(this);
                }
            });

            withColor.sort(function(a,b){
                return parseInt(a.substr(1, a.length - 2), 16) - parseInt(b.substr(1, b.length - 2), 16);
            });

            withoutColor.sort(function(a,b){
                return parseInt(a.substr(1, a.length - 2), 16) - parseInt(b.substr(1, b.length - 2), 16);
            });

            legibles = withoutColor.concat(withColor);

            if(legibles <= 10){
                filteredColors = legibles;
            } else {
                var filteredColors = [];
                var colorsLength  = Math.round(legibles.length / 10);

                for (var i=0; i <= 9; i++) {
                    filteredColors.push(legibles[colorsLength * i]);
                }
            }

            return filteredColors;
        },

        toGray : function(){
            var r,g,b,hsv;
            var rgb = this.toRGB();
            r = g = b = Math.round((11*rgb.r + 16*rgb.g + 5*rgb.b) /32);
            return new this.constructor({r:r,g:g,b:b});
        },

        toRGB : function(){
            return this.constructor.HSVToRGB(this._h, this._s, this._v);
        },

        toHSV : function(){
            return {
                h : this._h,
                s : this._s,
                v : this._v
            };
        },

        toHex : function(){
            var rgb = this.toRGB();
            var rStr = rgb.r.toString(16);
            var gStr = rgb.g.toString(16);
            var bStr = rgb.b.toString(16);
            return parseInt(rStr + gStr + bStr, 16);
        },

        toHTML : function(){
            var rgb = this.toRGB()
            var rStr = rgb.r.toString(16);
            var gStr = rgb.g.toString(16);
            var bStr = rgb.b.toString(16);

            if(rStr.length === 1){ rStr = '0' + rStr; }
            if(gStr.length === 1){ gStr = '0' + gStr; }
            if(bStr.length === 1){ bStr = '0' + bStr; }

            return "#" + rStr.toString() + gStr.toString() + bStr.toString();
        },

        // Color Themes

        // Complementary
        complementary : function(){
            return this.rotateBy(180);
        },

        // Triadic
        triadic       : function(position, angle){
            position = position || "1";
            angle    = angle    || 120;

            if (position == "1") {
                return this.rotateBy(angle);
            }else {
                return this.rotateBy((angle * -1));
            }
        },

        // Analogous
        analogous     : function(position, angle){
            position = position || "1";
            angle    = angle    || 30;

            if(position == "1"){
                return this.rotateBy(angle);
            }else{
                return this.rotateBy((angle * -1));
            }
        },

        // Split Complementary
        split     : function(position, angle){
            position = position || "1";
            angle    = angle    || 150;

            if(position == "1"){
                return this.rotateBy(angle);
            }else{
                return this.rotateBy((angle * -1));
            }
        }
    }
});
