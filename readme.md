# ImageCropper - Image Crop Tool Based On Canvas

## Requirement
+ IE 10+ or other modern browser.

## Example
```HTML
<canvas id="avatar" width="300" height="300"></canvas>
```

```JS
// following code create an instance of imagecropper
var cropper = ImageCropper.init({
    el: 'avatar', 
    width: 300, 
    height: 300
});

// now you can do whatever you want on it
cropper.loadFile(file); // read from file

cropper.rotate(cropper.ROTATE_COUNTERCLOCKWISE);    // rotation



```