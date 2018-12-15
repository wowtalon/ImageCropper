# ImageCropper - Image Crop Tool Based On Canvas

## Requirement
+ IE 10+ or other modern browser(which support canvas as well as FileReader).

## Example
```HTML
<canvas id="avatar" width="300" height="300"></canvas>
```

```JS
// following code create an instance of imagecropper
var cropper = ImageCropper.init({
    el: 'avatar',               // the canvas element's id
    width: 300,                 // the width of canvas
    height: 300,                // the height of canvas
    mode: ImageCropper.MODE_DEVELOP,    // MODE_DEVELOP or MODE_PRODUCT, default MODE_PRODUCT
    onread: function() {},      // the function you want to call when loading file finish
    onload: function() {},      // the function called when loading image finish
    onscale: function() {},     // the function called when image is scaled
    onmoveTo: function() {},    // 
    onmoveBy: function() {},
    onrotate: function() {}
});

// now you can do whatever you want on it
cropper.loadFile(file); // read from file
cropper.loadDataURL(base64Str); // read dataURL

cropper.rotate(cropper.ROTATE_COUNTERCLOCKWISE);    // rotation
cropper.rotate(cropper.ROTATE_CLOCKWISE);           // rotation

cropper.scale(1.5, 1.5);    // scale to 1.5x

cropper.moveTo(10, 20);     // move to point(10, 20) of the origin image
cropper.moveBy(30, 10);     // move to point(x + 30, y + 10) of the origin image

var dataURL = cropper.getDataURL(); // get the dataURL of the image in canvas

```