/**
Chameleon is a color manipulation library, that provides color palette functions
and legibility comparison among other common functionality found in other color management libraries
found across the web.

@type Object
@requires Neon (http://github.com/azendal/neon), jQuery (http://jquery.com)
**/
Class('Chameleon')({
    COLOR_NAMES : {
        "aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"
    },
    RGBRegExp : /^\s*rgba?\s*\((\d+)\,\s*(\d+)\,\s*(\d+)(,\s*(\d+(\.\d+)?))?\)\s*$/,

    HTMLRegExp : /^\#([0-9A-Fa-f]{6})$/,

    HTMLShortRegExp : /^\#([0-9A-Fa-f]{3})$/,

    RGBToHSV : function RGBToHSV(r,g,b){
        r = r/255;
        g = g/255;
        b = b/255;

        var h,s,v;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);

        if (max === min) {
            h = 0;
        } else if (max === r){
            h = (60 * ( (g - b)/ (max - min) ) + 360) % 360;
        } else if (max === g){
            h = (60 * ( (b - r)/ (max - min) ) + 120);
        } else if (max === b){
            h = (60 * ( (r - g)/ (max - min) ) + 240);
        }

        if (max === 0) {
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
        };
    },

    HexStringToHSV : function HexStringToHSV(hexString){
        var r = parseInt(hexString.substr(0, 2), 16);
        var g = parseInt(hexString.substr(2, 2), 16);
        var b = parseInt(hexString.substr(4, 2), 16);

        if (!isNaN(r) && !isNaN(g) && !isNaN(b)){
            return this.RGBToHSV(r,g,b);
        }
    },

    HSVToRGB : function HSVToRGB(h,s,v){
        var r,g,b;

        if (s === 0) {
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
        };
    },

    prototype : {
        _h : 0,
        _s : 0,
        _v : 0,
        _a : 100,
        _o : 1,

        isAchromatic : false,

        init : function init(config){
            if (config instanceof Chameleon) {
                this._h = config.getHue();
                this._s = config.getSaturation();
                this._v = config.getValue();
            } else if (config === 'transparent') {
                this._a = 0;
            } else if (typeof(config) == 'string' && this.constructor.RGBRegExp.test(config)) {
                var hsv = this.constructor.RGBToHSV(parseInt(RegExp.$1), parseInt(RegExp.$2), parseInt(RegExp.$3));
                this._h = hsv.h;
                this._s = hsv.s;
                this._v = hsv.v;
                this._o = RegExp.$5;
            } else if (typeof(config) == 'string' && this.constructor.HTMLRegExp.test(config)){
                var hsv = this.constructor.HexStringToHSV(RegExp.$1);
                this._h = hsv.h;
                this._s = hsv.s;
                this._v = hsv.v;
            } else if (typeof(config) == 'string' && this.constructor.HTMLShortRegExp.test(config)){
                var split = config.match(this.constructor.HTMLShortRegExp)[1].split('');
                var longVersion = [];
                for (var i=0; i < split.length; i++) {
                    longVersion.push(split[i]);
                    longVersion.push(split[i]);
                }
                var hex = longVersion.join('');
                var hsv = this.constructor.HexStringToHSV(hex);
                this._h = hsv.h;
                this._s = hsv.s;
                this._v = hsv.v;
            } else if (typeof(config) == 'string' && this.constructor.COLOR_NAMES[config.toLowerCase()]){
                var color = this.constructor.COLOR_NAMES[config.toLowerCase()].replace('#', '');
                var hsv = this.constructor.HexStringToHSV(color);
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
                console.log('color could not be parsed');
                console.log('color', typeof config);
                console.log(config);
                // console.trace();
                // debugger;
                throw new Error ("unparseable color");
                console.exception(this, config);
            }

            if (this._s === 0) {
                this.isAchromatic = true;
            }
        },

        getHue : function getHue(){
            return this._h;
        },

        getSaturation : function getSaturation(){
            return this._s;
        },

        getValue : function getValue(){
            return this._v;
        },

        setHue : function setHue(value){
            this._h = value;
            return this;
        },

        setSaturation : function setSaturation(value){
            this._s = value;

            if (this._s === 0) {
                this.isAchromatic = true;
            } else {
                this.isAchromatic = false;
            }

            return this;
        },

        setValue : function setValue(value){
            this._v = value;
            return this;
        },

        iluminateBy : function iluminateBy(value){
            this._v = this._v + value;
            if (this._v > 100) {
              this._v = 100;
            }
            return this;
        },

        obscureBy : function obscureBy(value){
            this._v = this._v - value;
            if (this._v < 0) {
              this._v = 0;
            }
            return this;
        },

        saturateBy: function saturateBy(value){
            if (this._s === 0) {
                this.isAchromatic = true;
            } else {
                this.setSaturation(this._s + value);
            }

            if (this._s > 100) {
              this._s = 100;
            }

            if (this.isAchromatic === true) {
                this._s = 0;
            }
            return this;
        },

        desaturateBy: function desaturateBy(value){
            this.setSaturation(this._s - value);

            if (this._s < 0) {
                this._s = 0;
                this.isAchromatic = true;
            }

            if (this.isAchromatic == true) {
              this._s = 0;
            }

            return this;
        },

        rotateBy: function rotateBy(shift){
            var rotated = this.copy();

            rotated._h += shift;

            if (rotated._h >= 360.0) {
                rotated._h -= 360.0;
            }

            if (rotated._h < 0.0) {
                rotated._h += 360.0;
            }

            return rotated;
        },

        warmBy : function warmBy(value){
            //implement
        },

        coolBy : function coolBy(value){
            //implement
        },

        transform : function transform(h,s,v){
            if (h > -1) { this._h = h; }
            if (s > -1) { this._s = s; }
            if (v > -1) { this._v = v; }

            if (this._s === 0) {
                this.isAchromatic = true;
            }

            if (this.isAchromatic === true) {
                this._s = 0;
            }

            return this;
        },

        setSV : function setSV(s,v){
            this.transform(-1, s, v);
            return this;
        },

        setBalancedSV : function setBalancedSV(s,v){
            var grayscale = this.toGray();

            if (grayscale._v > 50) {
                if (s > -1) {
                    this.desaturateBy(s);
                }

                if (v > -1) {
                    this.obscureBy(v);
                }
            } else {
                if (s > -1) {
                    this.saturateBy(s);
                }
                if (v > -1) {
                    this.iluminateBy(v);
                }
            }
            return this;
        },

        gradientSV : function gradientSV(s,v){
            if (this._v > 50) {
                if (s > -1 && this.saturation == 100 ) {
                    this.desaturateBy(s);
                } else if (s > -1 && this.saturation === 0) {
                    this.saturateBy(s);
                }

                if (v > -1) {
                    this.obscureBy(v);
                }
            } else {
                if (s > -1 && this.saturation === 0) {
                    this.saturateBy(s);
                } else if (s > -1 && this.saturation == 100 ) {
                    this.desaturateBy(s);
                }
                if (v > -1) {
                    this.iluminateBy(v);
                }
            }
            return this;
        },

        copy : function copy(){
            return new this.constructor(this);
        },

        // seems that 30 is a cool value, 25 is on the edge on my monitor
        isLegible : function isLegible(color){
            var c1 = color.toGray();
            var c2 = this.toGray();

            if (Math.abs(c1.getValue() - c2.getValue()) > 30) {
                return true;
            }

            return false;
        },

        getLegibles : function getLegibles(color){
            var legibleColors = [];

            if (this.isLegible(color)) {
                legibleColors.push(color);
            }

            var currentColor;
            var h = color.getHue();

            if (color.isAchromatic) {
                for (var v = 0; v <= 100; v += 1) {
                    currentColor = new this.constructor({h:h,s:0,v:v});
                    if (this.isLegible(currentColor)) {
                        legibleColors.push(currentColor);
                    }
                }
            } else {
                for(var s = 0; s <= 100; s += 10) {
                    for(var v = 0; v <= 100; v += 10) {
                        currentColor = new this.constructor({h:h,s:s,v:v});
                        if (this.isLegible(currentColor)) {
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

            for (var i in _legibles) {
                legibles.push(i);
            }

            var withColor = [];
            var withoutColor = [];

            var legiblesLen = legibles.length;
            for (var i = 0; i < legiblesLen; i++) {
                var color = new Chameleon(legibles[i]);
                var sum   = color._s + color._v;

                if (sum <= 130) {
                    withoutColor.push(legibles[i]);
                } else {
                    withColor.push(legibles[i]);
                }
            }

            withColor.sort(function(a,b){
                return parseInt(a.substr(1, a.length - 2), 16) - parseInt(b.substr(1, b.length - 2), 16);
            });

            withoutColor.sort(function(a,b){
                return parseInt(a.substr(1, a.length - 2), 16) - parseInt(b.substr(1, b.length - 2), 16);
            });

            legibles = withoutColor.concat(withColor);

            var filteredColors = [];
            var colorsLength  = Math.round(legibles.length / 10);

            for (var i=0; i < 9; i++) {
                filteredColors.push(legibles[colorsLength * i]);
            }

            return filteredColors;
        },

        getLegible : function getLegible(color){
            if (this.isLegible(color)) {
                return this;
            }

            var legibles = this.getLegibles(color);

            var legibleColors = [];

            for (var i=0; i < legibles.length; i++) {
                legibleColors.push(new Chameleon(legibles[i].toString()));
            };

            return this.byNearestColor(legibleColors)[0];
        },

        byNearestColor : function byNearestColor(colors){
            var that = this;
            return colors.sort(function(a,b){
                return Math.abs(a.toHex() - that.toHex()) - Math.abs(b.toHex() - that.toHex());
            });
        },

        toGray : function toGray(){
            var r,g,b;
            var rgb = this.toRGB();
            r = g = b = Math.round((11*rgb.r + 16*rgb.g + 5*rgb.b) /32);
            return new this.constructor({r:r,g:g,b:b});
        },

        toRGB : function toRGB(){
            return this.constructor.HSVToRGB(this._h, this._s, this._v);
        },

        toHSV : function toHSV(){
            return {
                h : this._h,
                s : this._s,
                v : this._v
            };
        },

        toHex : function toHex(){
            var toHex = Number(this.toHTML().toString().replace('#', '0x'));
            return toHex;
        },

        toHTML : function toHTML(){
            if ( this._a === 0 ) {
                return 'transparent';
            }

            var rgb = this.toRGB();
            var rStr = rgb.r.toString(16);
            var gStr = rgb.g.toString(16);
            var bStr = rgb.b.toString(16);

            if(rStr.length === 1){ rStr = '0' + rStr; }
            if(gStr.length === 1){ gStr = '0' + gStr; }
            if(bStr.length === 1){ bStr = '0' + bStr; }

            return "#" + rStr.toString() + gStr.toString() + bStr.toString();

        },

        toHTMLRGB : function toHTMLRGB(){
            if ( this._a === 0 ) {
                return 'transparent';
            }

            var rgb = this.toRGB();

            if ( (!this._o && this._o !== 0) || this._o == 1){
                return 'rgb('+ rgb.r +', '+ rgb.g +',' + rgb.b +')';
            } else {
                return 'rgba('+ rgb.r +', '+ rgb.g +',' + rgb.b +', ' + this._o / 100 +')';
            }
        },

        // Color Themes

        // Complementary
        complementary : function complementary(){
            return this.rotateBy(180);
        },

        // Triadic
        triadic       : function triadic(position, angle){
            position = position || "1";
            angle    = angle    || 120;

            if (position == "1") {
                return this.rotateBy(angle);
            } else {
                return this.rotateBy((angle * -1));
            }
        },

        // Analogous
        analogous     : function analogous(position, angle){
            position = position || "1";
            angle    = angle    || 30;

            if (position == "1") {
                return this.rotateBy(angle);
            } else {
                return this.rotateBy((angle * -1));
            }
        },

        // Split Complementary
        split     : function split(position, angle){
            position = position || "1";
            angle    = angle    || 150;

            if (position == "1") {
                return this.rotateBy(angle);
            } else {
                return this.rotateBy((angle * -1));
            }
        },

        balanceChoose : function balanceChoose(colorLight, colorDark) {
            var grayscale = this.toGray();
            return (grayscale._v > 50) ? colorDark : colorLight;
        }
    }
});
