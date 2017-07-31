
var convert = require("color-convert")
var async = require("async")

var Color = function(name, r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.name = name;
	var lab = computeLAB(r,g,b);
	//console.log(lab);
	this.L = lab[0];
	this.A = lab[1];
	this.B = lab[2];
}



var computeLAB = function(pixR, pixG, pixB) {
	var color = [pixR, pixG, pixB];
	return convert.rgb.lab(color);
        	
}
Color.prototype.computeMSE = function(l, a, b) {
	
        return ((l - this.L) * (l- this.L) + (a-this.A)*(a-this.A) +  (b-this.B)*(b-this.B));
	// 0.3, 0.59, 0.11
}




Color.prototype.getName = function() {
        return this.name.toLowerCase();
}

module.exports.Color = Color;

var ColorUtils = function() {
	this.colors = init();

}

function init() {
	var colors = []
	////console.log(Color);
	//console.time("Color")
	colors.push(new Color("Blue", 0xF0, 0xF8, 0xFF));
        colors.push(new Color("White", 0xFA, 0xEB, 0xD7));
        colors.push(new Color("Blue", 0x00, 0xFF, 0xFF));
        colors.push(new Color("Blue", 0x7F, 0xFF, 0xD4));
        colors.push(new Color("Blue", 0xF0, 0xFF, 0xFF));
        colors.push(new Color("Yellow", 0xF5, 0xF5, 0xDC));
        colors.push(new Color("Pink", 0xFF, 0xE4, 0xC4));
        colors.push(new Color("Black", 0x00, 0x00, 0x00));
        colors.push(new Color("White", 0xFF, 0xEB, 0xCD));
        colors.push(new Color("Blue", 0x00, 0x00, 0xFF));
        colors.push(new Color("Violet", 0x8A, 0x2B, 0xE2));
        colors.push(new Color("Brown", 0xA5, 0x2A, 0x2A));
        colors.push(new Color("Brown", 0xDE, 0xB8, 0x87));
        colors.push(new Color("Blue", 0x5F, 0x9E, 0xA0));
        colors.push(new Color("Green", 0x7F, 0xFF, 0x00));
        colors.push(new Color("Brown", 0xD2, 0x69, 0x1E));
        colors.push(new Color("orange", 0xFF, 0x7F, 0x50));
        colors.push(new Color("Blue", 0x64, 0x95, 0xED));
        colors.push(new Color("yellow", 0xFF, 0xF8, 0xDC));
        colors.push(new Color("red", 0xDC, 0x14, 0x3C));
        colors.push(new Color("Cyan", 0x00, 0xFF, 0xFF));
        colors.push(new Color("Blue", 0x00, 0x00, 0x8B));
        colors.push(new Color("Cyan", 0x00, 0x8B, 0x8B));
        colors.push(new Color("Gold", 0xB8, 0x86, 0x0B));
        colors.push(new Color("Gray", 0xA9, 0xA9, 0xA9));
        colors.push(new Color("Green", 0x00, 0x64, 0x00));
        colors.push(new Color("Green", 0xBD, 0xB7, 0x6B));
        colors.push(new Color("pink", 0x8B, 0x00, 0x8B));
        colors.push(new Color("Green", 0x55, 0x6B, 0x2F));
        colors.push(new Color("Orange", 0xFF, 0x8C, 0x00));
        colors.push(new Color("violet", 0x99, 0x32, 0xCC));
        colors.push(new Color("Red", 0x8B, 0x00, 0x00));
        colors.push(new Color("Orange", 0xE9, 0x96, 0x7A));
        colors.push(new Color("Green", 0x8F, 0xBC, 0x8F));
        colors.push(new Color("Blue", 0x48, 0x3D, 0x8B));
        colors.push(new Color("Gray", 0x2F, 0x4F, 0x4F));
        colors.push(new Color("blue", 0x00, 0xCE, 0xD1));
        colors.push(new Color("Violet", 0x94, 0x00, 0xD3));
        colors.push(new Color("Pink", 0xFF, 0x14, 0x93));
        colors.push(new Color("Blue", 0x00, 0xBF, 0xFF));
        colors.push(new Color("Gray", 0x69, 0x69, 0x69));
        colors.push(new Color("Blue", 0x1E, 0x90, 0xFF));
        colors.push(new Color("brown", 0xB2, 0x22, 0x22));
        colors.push(new Color("White", 0xFF, 0xFA, 0xF0));
        colors.push(new Color("Green", 0x22, 0x8B, 0x22));
        colors.push(new Color("pink", 0xFF, 0x00, 0xFF));
        colors.push(new Color("grey", 0xDC, 0xDC, 0xDC));
        colors.push(new Color("White", 0xF8, 0xF8, 0xFF));
        colors.push(new Color("yellow", 0xFF, 0xD7, 0x00));
        colors.push(new Color("yellow", 0xDA, 0xA5, 0x20));
        colors.push(new Color("Gray", 0x80, 0x80, 0x80));
        colors.push(new Color("Green", 0x00, 0x80, 0x00));
        colors.push(new Color("Yellow", 0xAD, 0xFF, 0x2F));
        colors.push(new Color("green", 0xF0, 0xFF, 0xF0));
        colors.push(new Color("Pink", 0xFF, 0x69, 0xB4));
        colors.push(new Color("Red", 0xCD, 0x5C, 0x5C));
        colors.push(new Color("violet", 0x4B, 0x00, 0x82));
        colors.push(new Color("white", 0xFF, 0xFF, 0xF0));
/*khaki*/ colors.push(new Color("brown", 0xF0, 0xE6, 0x8C));
        colors.push(new Color("violet", 0xE6, 0xE6, 0xFA));
        colors.push(new Color("violet", 0xFF, 0xF0, 0xF5));
        colors.push(new Color("Green", 0x7C, 0xFC, 0x00));
        colors.push(new Color("yellow", 0xFF, 0xFA, 0xCD));
        colors.push(new Color("Blue", 0xAD, 0xD8, 0xE6));
        colors.push(new Color("orange", 0xF0, 0x80, 0x80));
        colors.push(new Color("Cyan", 0xE0, 0xFF, 0xFF));
        colors.push(new Color("Yellow", 0xFA, 0xFA, 0xD2));
        colors.push(new Color("Gray", 0xD3, 0xD3, 0xD3));
        colors.push(new Color("Green", 0x90, 0xEE, 0x90));
        colors.push(new Color("Pink", 0xFF, 0xB6, 0xC1));
        colors.push(new Color("orange", 0xFF, 0xA0, 0x7A));
        colors.push(new Color("Green", 0x20, 0xB2, 0xAA));
        colors.push(new Color("Blue", 0x87, 0xCE, 0xFA));
        colors.push(new Color("Gray", 0x77, 0x88, 0x99));
        colors.push(new Color("Blue", 0xB0, 0xC4, 0xDE));
        colors.push(new Color("Yellow", 0xFF, 0xFF, 0xE0));
        colors.push(new Color("green", 0x00, 0xFF, 0x00));
        colors.push(new Color("Green", 0x32, 0xCD, 0x32));
        colors.push(new Color("white", 0xFA, 0xF0, 0xE6));
        colors.push(new Color("pink", 0xFF, 0x00, 0xFF));
        colors.push(new Color("Maroon", 0x80, 0x00, 0x00));
        colors.push(new Color("Blue", 0x66, 0xCD, 0xAA));
        colors.push(new Color("Blue", 0x00, 0x00, 0xCD));
        colors.push(new Color("Orchid", 0xBA, 0x55, 0xD3));
        colors.push(new Color("Violet", 0x93, 0x70, 0xDB));
        colors.push(new Color("Green", 0x3C, 0xB3, 0x71));
        colors.push(new Color("Blue", 0x7B, 0x68, 0xEE));
        colors.push(new Color("Green", 0x00, 0xFA, 0x9A));
        colors.push(new Color("blue", 0x48, 0xD1, 0xCC));
        colors.push(new Color("Violet", 0xC7, 0x15, 0x85));
        colors.push(new Color("Blue", 0x19, 0x19, 0x70));
        colors.push(new Color("green", 0xF5, 0xFF, 0xFA));
        colors.push(new Color("pink", 0xFF, 0xE4, 0xE1));
        colors.push(new Color("brown", 0xFF, 0xE4, 0xB5));
        colors.push(new Color("White", 0xFF, 0xDE, 0xAD));
        colors.push(new Color("blue", 0x00, 0x00, 0x80));
        colors.push(new Color("white", 0xFD, 0xF5, 0xE6));
        colors.push(new Color("green", 0x80, 0x80, 0x00));
        colors.push(new Color("Olive", 0x6B, 0x8E, 0x23));
        colors.push(new Color("Orange", 0xFF, 0xA5, 0x00));
        colors.push(new Color("Orange", 0xFF, 0x45, 0x00));
        colors.push(new Color("pink", 0xDA, 0x70, 0xD6)); /*orchid */
        colors.push(new Color("yellow", 0xEE, 0xE8, 0xAA));
        colors.push(new Color("green", 0x98, 0xFB, 0x98));
        colors.push(new Color("blue", 0xAF, 0xEE, 0xEE));
        colors.push(new Color("Violet", 0xDB, 0x70, 0x93));
        colors.push(new Color("yellow", 0xFF, 0xEF, 0xD5));
        colors.push(new Color("pink", 0xFF, 0xDA, 0xB9));
        colors.push(new Color("brown", 0xCD, 0x85, 0x3F));
        colors.push(new Color("Pink", 0xFF, 0xC0, 0xCB));
        colors.push(new Color("violet", 0xDD, 0xA0, 0xDD)); /* plum */
        colors.push(new Color("Blue", 0xB0, 0xE0, 0xE6));
        colors.push(new Color("Purple", 0x80, 0x00, 0x80));
        colors.push(new Color("Red", 0xFF, 0x00, 0x00));
        colors.push(new Color("Brown", 0xBC, 0x8F, 0x8F));
        colors.push(new Color("Blue", 0x41, 0x69, 0xE1));
        colors.push(new Color("Brown", 0x8B, 0x45, 0x13));
        colors.push(new Color("orange", 0xFA, 0x80, 0x72));
        colors.push(new Color("Brown", 0xF4, 0xA4, 0x60));
        colors.push(new Color("Green", 0x2E, 0x8B, 0x57));
        colors.push(new Color("white", 0xFF, 0xF5, 0xEE));
        colors.push(new Color("brown", 0xA0, 0x52, 0x2D));
        colors.push(new Color("gray", 0xC0, 0xC0, 0xC0));
        colors.push(new Color("Blue", 0x87, 0xCE, 0xEB));
        colors.push(new Color("Blue", 0x6A, 0x5A, 0xCD));
        colors.push(new Color("Gray", 0x70, 0x80, 0x90));
        colors.push(new Color("white", 0xFF, 0xFA, 0xFA));
        colors.push(new Color("Green", 0x00, 0xFF, 0x7F));
        colors.push(new Color("Blue", 0x46, 0x82, 0xB4));
        colors.push(new Color("brown", 0xD2, 0xB4, 0x8C));
        colors.push(new Color("blue", 0x00, 0x80, 0x80));
        colors.push(new Color("violet", 0xD8, 0xBF, 0xD8));
        colors.push(new Color("Red", 0xFF, 0x63, 0x47));
        colors.push(new Color("blue", 0x40, 0xE0, 0xD0));
        colors.push(new Color("Violet", 0xEE, 0x82, 0xEE));
        colors.push(new Color("brown", 0xF5, 0xDE, 0xB3)); /* wheat */
        colors.push(new Color("White", 0xFF, 0xFF, 0xFF));
        colors.push(new Color("White", 0xF5, 0xF5, 0xF5));
        colors.push(new Color("Yellow", 0xFF, 0xFF, 0x00));
        colors.push(new Color("Yellow", 0x9A, 0xCD, 0x32));
	/*
	colors.push(new Color("Black",0,0,0));
  	colors.push(new Color("White",255,255,255));
  	colors.push(new Color("Red",255,0,0));
  	colors.push(new Color("Lime",0,255,0));
  	colors.push(new Color("Blue",0,0,255));
  	colors.push(new Color("Yellow", 255,255,0));
  	colors.push(new Color("Cyan",0,255,255));
  	colors.push(new Color("Magenta",255,0,255));
  	//colors.push(new Color("Silver",192,192,192));
  	//colors.push(new Color("grey",128,128,128));
  	//colors.push(new Color("maroon",128,0,0));
  	//colors.push(new Color("olive",128,128,0));
  	colors.push(new Color("green", 0,128,0));
  	colors.push(new Color("purple",128,0,128));
  	//colors.push(new Color("teal",0,128,128));
  	//colors.push(new Color("navy",0,0,128));
	colors.push(new Color("orange",255,165,0));
	*/
	//console.timeEnd("Color")
	return colors;
}

ColorUtils.prototype.getColorNameFromRgb = function(r, g,b) {
        var min_mse = 1000000000;
        var closest_color = null;
        var mse =0;
        var lab = computeLAB(r,g, b);	
	////console.log(colors);
        for(var cnt=0;cnt< this.colors.length; cnt++) {
                mse = this.colors[cnt].computeMSE(lab[0],lab[1],lab[2]);
                if(mse < min_mse) {
                        min_mse = mse;
                        closest_color = this.colors[cnt];
                }
        }

        if(closest_color != null) {
                return closest_color.getName();
        } else {
                return null;
        }
}

module.exports.ColorUtils = ColorUtils
