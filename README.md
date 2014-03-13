image-canvas-operator
=====================

A simple angularJS module for client side image operations (resizing, croping, rotating)

Invocation
-------

### Invoke with DI

Example
    .controller('myController', ['$scope','imgCOP',function( $scope, imgCOP ) {
        //Do stuff
    }

Usage
-----------

### Rotate

    imgCOP.rotate(originalImg,degrees,function(base64Url)){
        //Do stuff
    };

### Resize

    imgCOP.resize(originalImg, displayWidth, displayHeight, function(blob){
        //Do stuff
    });

### Crop

    imgCOP.crop(originalImg,A,D,size,function(blob){
        //Do stuff
    };

Installation
-----------

    - Add image-canvas-operator.js & base64-to-blob.js to your index.html file.
    - Add "image-canvas-operator" as a module dependency
    - Invoke imgCOP with angularJS dependencies injection


TODO
------------

1. Reduce the number of conversion between blob and base64
2. Rewrite the b64 to blob conversion
3. Add stuff
4. Clean stuff