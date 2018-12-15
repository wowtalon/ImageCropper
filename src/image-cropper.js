(function() {

    var MODE_PRODUCT = 'product';
    var MODE_DEVELOP = 'develop';
    var ACTION_ROTATE_CLOCKWISE = 0;
    var ACTION_ROTATE_COUNTERCLOCKWISE = 1;
    var ACTION_SCALE = 2;
    var ACTION_MOVE_BY = 3;
    var ACTION_MOVE_TO = 4;

    var _mode_ = 'product'
    var _element_, _ctx_;
    var _img_ = new Image();
    var _state_ = {
        x: 0,
        y: 0,
        sx: 0,
        sy: 0,
        rotate: 0,
        scalex: 1,
        scaley: 1,
        sw: 0,
        sh: 0,
        movex: 0,
        movey: 0
    };
    // origin scale: imgsize / canvassize
    var _origin_scale_ = {
        x: 1,
        y: 1
    };
    // canvas size
    var _canvas_size_ = {
        width: 0,
        height: 0
    };
    // image size
    var _img_size_ = {
        width: 0,
        height: 0
    };
    // store the state of routation
    var _rotate_state_ = {
        x: 0,
        y: 0
    };
    // callbacks
    var _callback_ = {};

    _img_.onload = function() {
        if (typeof _callback_.onload != "undefined") {
            _callback_.onload();
        }
        _mode_ != MODE_PRODUCT && console.log('Load image success.');
        // get the size of img
        _img_size_.width = _img_.width;
        _img_size_.height = _img_.height;
        
        if (_img_size_.width > _img_size_.height) {
            _state_.sw = _state_.sh = _img_size_.height;
            _state_.sy = 0;
            _state_.sx = (_img_size_.width - _img_size_.height) * 0.5;
            // get the init scale
            _origin_scale_.y = _origin_scale_.x = _img_size_.height / _canvas_size_.height;
        } else {
            _state_.sw = _state_.sh = _img_size_.width;
            _state_.sx = 0;
            _state_.sy = (_img_size_.height - _img_size_.width) * 0.5;
            // get the init scale
            _origin_scale_.y = _origin_scale_.x = _img_size_.width / _canvas_size_.width;
        }
        drawImage();
    };

    var init = function(config) {
        if (!config.el) {
            _mode_ != MODE_PRODUCT && console.error('Canvas element cannot be null');
            return false;
        }
        _mode_ = config.mode || MODE_PRODUCT;
        _element_ = document.getElementById(config.el);
        _canvas_size_.width = config.width;
        _canvas_size_.height = config.height;
        _ctx_ = _element_.getContext("2d");
        typeof config.onload != "undefined" && (_callback_.onload = config.onload);
        typeof config.onread != "undefined" && (_callback_.onread = config.onread);
        typeof config.onscale != "undefined" && (_callback_.onscale = config.onscale);
        typeof config.onmoveTo != "undefined" && (_callback_.onmoveTo = config.onmoveTo);
        typeof config.onmoveBy != "undefined" && (_callback_.onmoveBy = config.onmoveBy);
        typeof config.onrotate != "undefined" && (_callback_.onrotate = config.onrotate);
        return this;
    };

    /**
     * Read data from the file selected, e.g. by input:file
     * file: the file to load, e.g. files[0]
     */
    var loadFile = function(file) {
        reset();
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            if (typeof _callback_.onread != "undefined") {
                _callback_.onread(reader.result);
            }
            _mode_ != MODE_PRODUCT && console.log('Load data success.\nfilename:', file.name, '\nfilesize:', file.size, '\ntype:', file.type);
            _img_.src = reader.result;
        };
    };

    var getDataURL = function() {
        return _element_.toDataURL();
    };

    /**
     * Load dataurl
     * @param {string} data 
     */
    var loadDataURL = function(data) {
        _img_.src = data;
    };

    /**
     * Zoom in or zoom out img
     * scaleX: the rate to zoom, e.g. canvas: 100*100, then 0.8 will zoom out to 80
     */
    var scale = function(scaleX, scaleY) {
        if (typeof _callback_.onscale != "undefined") {
            _callback_.onscale(scaleX, scaleY);
        }
        _img_.src || _mode_ != MODE_PRODUCT && console.error("No image loaded!");
        scalex = scaleX || 1;
        scaley = scaleY || scalex;
        _state_.scalex = scalex;
        _state_.scaley = scaley;
        var sw = _state_.sw;
        var sh = _state_.sh;
        _state_ = updateState(ACTION_SCALE, _state_);
        _mode_ != MODE_PRODUCT && console.log("movex:", _state_.sw - sw, "movey:", _state_.sh - sh);
        moveBy((sw - _state_.sw) * 0.5, (sh - _state_.sh) * 0.5);
    };

    var moveBy = function(x, y) {
        if (typeof _callback_.onmoveBy != "undefined") {
            _callback_.onmoveBy(x, y);
        }
        _state_.movex = parseFloat(x);
        _state_.movey = parseFloat(y);
        _state_ = updateState(ACTION_MOVE_BY, _state_);
        drawImage();
    };

    var moveTo = function(x, y) {
        if (typeof _callback_.onmoveTo != "undefined") {
            _callback_.onmoveTo(x, y);
        }
        _state_.movex = parseFloat(x);
        _state_.movey = parseFloat(y);
        _state_ = updateState(ACTION_MOVE_TO, _state_);
        drawImage();
    };

    var rotate = function(direction) {
        if (typeof _callback_.onrotate != "undefined") {
            _callback_.onrotate(direction);
        }
        _state_ = updateState(direction, _state_);
        drawImage();
    };

    /**
     * draw the img to the canvas
     */
    var drawImage = function() {
        _state_.rotate && _ctx_.rotate(_state_.rotate);
        _state_.rotate = 0;
        _ctx_.drawImage(_img_, _state_.sx, _state_.sy, _state_.sw, _state_.sh, _state_.x, _state_.y, _canvas_size_.width, _canvas_size_.height);
    };

    /**
     * Get the next state of rotation based on current state
     * @param {*} action 
     * @param {*} state 
     */
    var rotateState = function(action, state) {
        switch(action) {
            case ACTION_ROTATE_CLOCKWISE:
                if (state.x == state.y) {
                    state.y = (state.y == -1 ? 0 : -1);
                    state.x = state.x;
                } else {
                    state.x = state.y = state.y;
                }
                break;
            case ACTION_ROTATE_COUNTERCLOCKWISE:
                if (state.x == state.y) {
                    state.y = state.y;
                    state.x = (state.x == 0 ? -1 : 0);
                } else {
                    state.y = state.x = state.x;
                }
                break;
            default:
                state = {
                    x: 0,
                    y: 0
                };
        }
        return state;
    };

    var updateState = function(action, state) {
        switch(action) {
            case ACTION_ROTATE_CLOCKWISE:
                _rotate_state_ = rotateState(ACTION_ROTATE_CLOCKWISE, _rotate_state_);
                state.x = _canvas_size_.width * _rotate_state_.x;
                state.y = _canvas_size_.height * _rotate_state_.y;
                state.rotate = 90 * Math.PI / 180;
                break;
            case ACTION_ROTATE_COUNTERCLOCKWISE:
                _rotate_state_ = rotateState(ACTION_ROTATE_COUNTERCLOCKWISE, _rotate_state_);
                state.x = _canvas_size_.width * _rotate_state_.x;
                state.y = _canvas_size_.height * _rotate_state_.y;
                state.rotate = -90 * Math.PI / 180;
                break;
            case ACTION_SCALE:
                var sw, sh;
                sw = _origin_scale_.x * _canvas_size_.width / state.scalex;
                sh = _origin_scale_.y * _canvas_size_.height / state.scaley;
                state.sw = sw;
                state.sh = sh;
                break;
            case ACTION_MOVE_BY:
                state.sx += state.movex;
                if (state.sx + state.sw > _img_size_.width) {
                    state.sx = _img_size_.width - state.sw;
                } else if (state.sx <= 0) {
                    state.sx = 0;
                }

                state.sy += state.movey;
                if (state.sy + state.sh > _img_size_.height) {
                    state.sy = _img_size_.height - state.sh;
                } else if (state.sy <= 0) {
                    state.sy = 0;
                }
                break;
            case ACTION_MOVE_TO:
                state.sx = state.movex;
                state.sy = state.movey;
                break;
            default:
        }
        _mode_ != MODE_PRODUCT && console.log("New state:", state);
        return state;
    };

    var reset = function() {
        _state_ = {
            x: 0,
            y: 0,
            sx: 0,
            sy: 0,
            rotate: 0,
            scalex: 1,
            scaley: 1,
            sw: 0,
            sh: 0,
            movex: 0,
            movey: 0
        };
        // origin scale: imgsize / canvassize
        _origin_scale_ = {
            x: 1,
            y: 1
        };
        // image size
        _img_size_ = {
            width: 0,
            height: 0
        };
        // store the state of routation
        _rotate_state_ = {
            x: 0,
            y: 0
        };
    };

    window.ImageCropper = {
        getDataURL: getDataURL,
        init: init,
        loadFile: loadFile,
        moveBy: moveBy,
        moveTo: moveTo,
        reset: reset,
        rotate: rotate,
        scale: scale,
        MODE_PRODUCT: MODE_PRODUCT,
        MODE_DEVELOP: MODE_DEVELOP,
        ROTATE_CLOCKWISE: ACTION_ROTATE_CLOCKWISE,
        ROTATE_COUNTERCLOCKWISE: ACTION_ROTATE_COUNTERCLOCKWISE
    };
})();
