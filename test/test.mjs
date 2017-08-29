import Color from "../src/aui/graphics/color";

var assert = require('assert');
describe('Color', function() {
  describe('#hexToCssRGBA(hex)', function() {
    it('should return rgba(0,0,0,1) when the value is #000000', function() {
      assert.equal('rgba(0,0,0,1)', Color.hexToCssRGBA("#000000"));
    });
  });
});