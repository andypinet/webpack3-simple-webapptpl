function parseAlpha(alpha) {
    if (alpha === 255) {
        return "1";
    } else if (alpha === 0) {
        return "0";
    } else {
        return (alpha / 255).toFixed(2);
    }
}

function parseNumAlpha(alpha) {
    if (alpha === 255) {
        return 1;
    } else if (alpha === 0) {
        return 0;
    } else {
        return alpha / 255;
    }
}

class RGBA {
    constructor(rgbarr, alpha) {
        var self = this;
        self.rgbarr = rgbarr;
        self.s = rgbarr;
        if (rgbarr.length == 3) {
            self.r = self.rgbarr[0] + self.rgbarr[0];
            self.g = self.rgbarr[1] + self.rgbarr[1] ;
            self.b = self.rgbarr[2] + self.rgbarr[2];
        } else {
            self.r = self.rgbarr[0] + self.rgbarr[1];
            self.g = self.rgbarr[2] + self.rgbarr[3] ;
            self.b = self.rgbarr[4] + self.rgbarr[5];
        }
        if(self.rgbarr.length== 3){
            self.s= [self.rgbarr[0], self.rgbarr[0], self.rgbarr[1], self.rgbarr[1], self.rgbarr[2], self.rgbarr[2]];
        }        
        self.s= '0x'+self.s.join('');
        self.alpha = alpha;
        self.sa = parseAlpha(parseInt("0x" + self.alpha, 16));     
    }
    toRgbaObj() {
        var self = this;
        var r = parseInt(self.r, 16);
        var g = parseInt(self.g, 16);
        var b = parseInt(self.b, 16);
        var a = parseNumAlpha(parseInt("0x" + self.alpha, 16));
        return {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }
    toString() {   
        var self = this; 
        return 'rgba('+[(self.s>>16)&255, (self.s>>8)&255, self.s&255].join(',')+','+ self.sa +')';             
    }
    toValue() {
        var self = this; 
        return "0x" + self.alpha + self.r + self.g + self.b;
    }
}

export default class Color {
    static BLACK = "#000000";

    /**
     * parse hex to RGBA
     * 
     * @param {String} hex 
     */
    static hexToRGBA(hex){
        var c;
        var alpha;
        var l;
        if (/^#([A-Fa-f0-9]{3}){1}([A-Fa-f0-9]){1}$/.test(hex)) {
            l = hex.slice(hex.length - 1, hex.length);    
            c= hex.substring(1, hex.length - 1).split('');
            alpha = l + l;                      
            return Color._parseRGBarrToRGBA(c, alpha);
        }

        if (/^#([A-Fa-f0-9]{3}){2}([A-Fa-f0-9]){2}$/.test(hex)) {
            l = hex.slice(hex.length - 2, hex.length);    
            c= hex.substring(1, hex.length - 2).split('');
            alpha = l;                      
            return Color._parseRGBarrToRGBA(c, alpha);
        }

        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');            
            return Color._parseRGBarrToRGBA(c, "ff");
        }
        throw new Error('Bad Hex');
    }  

    static parseCssRgbToRgb(cssColor) {
        var m = cssColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if(m) {
            return [
                parseInt(m[1], 16),
                parseInt(m[2], 16),
                parseInt(m[3], 16)
            ];
        }
    }

    static parseCssRgbaToRgba(cssColor) {
        var m = cssColor.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i);
        if(m) {
            return [
                parseInt(m[1], 16),
                parseInt(m[2], 16),
                parseInt(m[3], 16),
                parseInt(m[4] * 255)
            ]
        }
    }

    static parseCssHslToRgb(cssColor) {
        var m = cssColor.match(/^hls\s*\(\s*(\d+)\s*,\s*([\d\%]+)\s*,\s*([\d\%]+)\s*\)$/i);

        if (m) {
            return Color.hslToRgb.apply(Color, [
                parseInt(m[1]),
                parseFloat(m[2]) / 100,
                parseFloat(m[3]) / 100
            ]);
        }
    }

    static parseCssHslaToRgba(cssColor) {
        var m = cssColor.match(/^hlsa\s*\(\s*(\d+)\s*,\s*([\d\%]+)\s*,\s*([\d\%]+)\s*,\s*([\d.]+)\s*\)$/i);
        if (m) {
            return Color.hslaToRgba.apply(Color, [
                parseInt(m[1]),
                parseFloat(m[2]) / 100,
                parseFloat(m[3]) / 100,
                parseFloat(m[4])
            ]);
        }
    }

    /**
     * rgb to hsl
     * 
     * @param {Int} r 
     * @param {Int} g 
     * @param {Int} b 
     */
    static rgbToHsl(r, g, b){
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) { h = s = 0; } 
		else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			
			h /= 6;
		}
		
		return [(h*100+0.5)|0, ((s*100+0.5)|0) + '%', ((l*100+0.5)|0) + '%'];
    }

    static rgbaToHsla(r, g, b, a){	
		return Color.rgbToHsl(r, g, b).concat([parseAlpha(a)]);
    }
    
    static rgbToCssHsl(r, g, b){	
		return  'hsl(' + Color.rgbToHsl(r, g, b).join(",") + ')';
	}

    static rgbaToCssHsla(r, g, b, a){	
		return  'hsla(' + Color.rgbaToHsla(r, g, b, a).join(",") + ')';
    }

    static _hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }
    
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    static hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else { 
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = Color._hue2rgb(p, q, h + 1/3);
            g = Color._hue2rgb(p, q, h);
            b = Color._hue2rgb(p, q, h - 1/3);
        }
    
        return [ r * 255, g * 255, b * 255 ];
    }    

    static hslaToRgba(h, s, l, a) {
        return Color.hslToRgb(h, s, l).concat([a * 255]);
    } 

    /**
     * parse hex to rgb [0,0,0]
     * 
     * @param {String} hex 
     */
    static hexToRgb(hex){
        var rgba = Color.hexToRGBA(hex).toRgbaObj();
        return [rgba.r, rgba.g, rgba.b];    
    }      

    /**
     * parse hex to rgb Array<Int> [0,0,0,1]
     * css is rgba(0,0,0,1)
     * so alpha is not 255
     * 
     * @param {String} hex 
     */
    static hexToRgba(hex){
        var rgba = Color.hexToRGBA(hex).toRgbaObj();
        return [rgba.r, rgba.g, rgba.b, rgba.a];    
    }  
    
    static hexToHls(hex) {
        return Color.rgbToHsl.apply(Color, Color.hexToRgb(hex));
    }

    static hexToHlsa(hex) {
        return Color.rgbaToHsla.apply(Color, Color.hexToRgba(hex));
    }
    
    static hexToCssHls(hex) {
        return Color.rgbToCssHsl.apply(Color, Color.hexToRgb(hex));
    }

    static hexToCssHlsa(hex) {
        return Color.rgbaToCssHsla.apply(Color, Color.hexToRgba(hex));
    }

    /**
     * return RGBA class
     * 
     * @param {Array<String>} rgbarr  [r, g, b]
     * @param {String} alpha  "ff"
     */
    static _parseRGBarrToRGBA(rgbarr, alpha) {
        return new RGBA(rgbarr, alpha);
    }

    /**
     * return css rgba format
     * 
     * @param {String} hex 
     */
    static hexToCssRGBA(hex) {
        return Color.hexToRGBA(hex).toString();
    }

    static _parseDecToHexString(dec) {
        var s = dec.toString(16);
        if (s.length === 1) {
            return s + s;
        }
        return s;
    }

    static rgbToCssHex(r, g, b) {
        return '#'+[
            Color._parseDecToHexString(r), Color._parseDecToHexString(g), Color._parseDecToHexString(b)].join('');            
    }

    static _LightenDarkenColorFromRgb(r, g, b, percent) {
        var amt = Math.round(2.55 * Math.abs(percent));

        if (percent < 0) {
            amt = -amt;
        }

        var r = parseInt(r, 16) + amt;
        var g = parseInt(g, 16) + amt;
        var b = parseInt(b, 16) + amt;
    
        if (r > 255) {
            r = 255;
        } else if (r < 0) {
            r = 0;
        }
        if (b > 255) {
            b = 255;
        } else if (b < 0) {
            b = 0;
        }
        if (g > 255) {
            g = 255;
        } else if (g < 0) {
            g = 0;
        }

        return Color.rgbToCssHex(r, g, b);
    }

    static lightenFromHex(hex, percent) {
        var RGBA = Color.hexToRGBA(hex);
        return Color._LightenDarkenColorFromRgb(RGBA.r, RGBA.g, RGBA.b, percent);
    }

    static darkenFromHex(hex, percent) {
        var RGBA = Color.hexToRGBA(hex);
        return Color._LightenDarkenColorFromRgb(RGBA.r, RGBA.g, RGBA.b, -percent);
    }

    static mixFromHex(color1, color2, amount = 50) {   
        var a = 100 - amount;     
        var rgba1 = Color.hexToRGBA(color1).toRgbaObj();
        var rgba2 = Color.hexToRGBA(color2).toRgbaObj();

        var p = a / 100;
    
        var rgba = [
            Math.floor(((rgba2.r - rgba1.r) * p) + rgba1.r),
            Math.floor(((rgba2.g - rgba1.g) * p) + rgba1.g),
            Math.floor(((rgba2.b - rgba1.b) * p) + rgba1.b),
            Math.floor(((rgba2.a - rgba1.a) * p) + rgba1.a)
        ];
    
        return Color.rgbToCssHex.apply(Color, rgba);
    };
    
}