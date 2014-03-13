/*
 * JavaScript Canvas to Blob 2.0.5
 * https://github.com/blueimp/JavaScript-Canvas-to-Blob
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on stackoverflow user Stoive's code snippet:
 * http://stackoverflow.com/q/4998908
 *
 * Wrapped for angular for imgCOP
 */

'use strict';

var angularB64toB = angular.module('base64-to-blob', []);

angularB64toB.service('b64ToBlob', [function() {

    var hasBlobConstructor = window.Blob && (function () {
        try {
            return Boolean(new Blob());
        } catch (e) {
            return false;
        }
    }());

    var hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array && (function () {
        try {
            return new Blob([new Uint8Array(100)]).size === 100;
        } catch (e) {
            return false;
        }
    }());

    var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

    this.dataURLtoBlob = (hasBlobConstructor || BlobBuilder) && window.atob && window.ArrayBuffer && window.Uint8Array && function (dataURI) {
        var byteString,
            arrayBuffer,
            intArray,
            i,
            mimeString,
            bb;

        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            // Convert base64 to raw binary data held in a string:
            byteString = atob(dataURI.split(',')[1]);
        } else {
            // Convert base64/URLEncoded data component to raw binary data:
            byteString = decodeURIComponent(dataURI.split(',')[1]);
        }
        // Write the bytes of the string to an ArrayBuffer:
        arrayBuffer = new ArrayBuffer(byteString.length);
        intArray = new Uint8Array(arrayBuffer);
        for (i = 0; i < byteString.length; i += 1) {
            intArray[i] = byteString.charCodeAt(i);
        }
        // Separate out the mime component:
        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // Write the ArrayBuffer (or ArrayBufferView) to a blob:
        if (hasBlobConstructor) {
            return new Blob(
                [hasArrayBufferViewSupport ? intArray : arrayBuffer],
                {type: mimeString}
            );
        }
        bb = new BlobBuilder();
        bb.append(arrayBuffer);
        return bb.getBlob(mimeString);
    };
}]);