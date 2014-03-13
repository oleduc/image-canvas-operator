/**
 * Created by Olivier Leduc on 13/03/14.
 */

'use strict';

var angularImgCOP = angular.module('image-canvas-operator', [
    'base64-to-blob'
]);

angularImgCOP.service('imgCOP', ['b64ToBlob',function(b64ToBlob) {
    console.log(b64ToBlob);
    var self = this;
    this.rotate = function(originalImg,degrees,callback){
        var oc = document.createElement('canvas');
        var octx = oc.getContext('2d');

        //Inverse height and width as canvas size -> Ignore IDE warnings, IDEs are dumb
        oc.width = originalImg.height;
        oc.height = originalImg.width;

        //Save original grid
        octx.save();
        //Set origin of canvas to center | 0,0 is now w/2 and h/2
        octx.translate(originalImg.height/2,originalImg.width/2);
        //Rotate the whole grid by X degrees
        octx.rotate(degrees*Math.PI/180);
        //Draw the image into the rotated grid
        octx.drawImage(originalImg, -originalImg.width/2, -originalImg.height/2, originalImg.width, originalImg.height);
        //Restore grid coordinates
        octx.restore();

        //Save to Base64 string and return
        self.generate(oc,"image/jpeg",false,function(file){
            callback(file);
        });
    };

    this.resize = function(originalImg, displayWidth, displayHeight, callback){
        var oc = document.createElement('canvas');
        var octx = oc.getContext('2d');

        //Convert blob into Base64
        var reader = new FileReader();
        reader.onload = function(event){
            //Base64 Image
            var img = new Image();
            img.src = event.target.result;

            //Once the image has been converted and loaded do resize
            img.onload = resizeBase64Image(img,displayWidth,displayHeight);
        };
        reader.readAsDataURL(originalImg);

        function resizeBase64Image(originalImg,currentWidth,currentHeight){
            //Set canvas size
            oc.width = currentWidth;
            oc.height = currentHeight;

            //Rotate if the height is larger than the width because of Ipad auto rotation (Fucking annoying)
            if(currentHeight > currentWidth){
                self.rotate(originalImg,-270,function(rotatedFile){
                    resizeAndReturn(rotatedFile, currentWidth, currentHeight);
                });
            } else {
                resizeAndReturn(originalImg,currentWidth,currentHeight);
            }
        }

        function resizeAndReturn(originalImg,currentWidth,currentHeight){
            octx.drawImage(originalImg, 0, 0, currentWidth, currentHeight);
            self.generate(oc,"image/jpeg",true,function(file){
                callback(file);
            });
        }
    };

    this.crop = function(originalImg,A,D,size,callback){
        var oc = document.createElement('canvas');
        var octx = oc.getContext('2d');
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = function(){
                oc.width = size.w;
                oc.height = size.h;
                octx.drawImage(img, A.x, A.y,size.w,size.h,0,0,size.w,size.h);
                self.generate(oc,"image/jpeg",true,function(file){
                    callback(file);
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(originalImg);
    };

    this.generate = function(canvas,type,blob,callback){
        var newImage = new Image();
        newImage.onload = function(){
            if(blob){
                var file = b64ToBlob.dataURLtoBlob(newImage.src);
                file.url = window.URL.createObjectURL(file);
                callback(file);
            } else {
                callback(newImage);
            }
        };
        newImage.src = canvas.toDataURL(type);
    };
}]);