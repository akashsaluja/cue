// import { desktopCapturer, screen } from 'electron'
import { desktopCapturer, screen, shell, DesktopCapturerSource, NativeImage } from 'electron'

// /**
//  * Create a screenshot of the entire screen using the desktopCapturer module of Electron.
//  *
//  * @param callback {Function} callback receives as first parameter the base64 string of the image
//  * @param imageFormat {String} Format of the image to generate ('image/jpeg' or 'image/png')
//  **/
// export function fullscreenScreenshot(callback: any, imageFormat: any) {
//     var _this = this;
//     this.callback = callback;
//     imageFormat = imageFormat || 'image/jpeg';

//     this.handleStream = (stream) => {
//         // Create hidden video tag
//         var video = document.createElement('video');
//         video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
//         // Event connected to stream
//         video.onloadedmetadata = function () {
//             // Set video ORIGINAL height (screenshot)
//             video.style.height = this.videoHeight + 'px'; // videoHeight
//             video.style.width = this.videoWidth + 'px'; // videoWidth

//             // Create canvas
//             var canvas = document.createElement('canvas');
//             canvas.width = this.videoWidth;
//             canvas.height = this.videoHeight;
//             var ctx = canvas.getContext('2d');
//             // Draw video on canvas
//             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//             if (_this.callback) {
//                 // Save screenshot to base64
//                 _this.callback(canvas.toDataURL(imageFormat));
//             } else {
//                 console.log('Need callback!');
//             }

//             // Remove hidden video tag
//             video.remove();
//             try {
//                 // Destroy connect to stream
//                 stream.getTracks()[0].stop();
//             } catch (e) { }
//         }
//         video.src = URL.createObjectURL(stream);
//         document.body.appendChild(video);
//     };

//     this.handleError = function (e) {
//         console.log(e);
//     };

//     // Filter only screen type
//     desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
//         if (error) throw error;
//         // console.log(sources);
//         for (let i = 0; i < sources.length; ++i) {
//             console.log(sources);
//             // Filter: main screen
//             if (sources[i].name === "Entire screen") {
//                 navigator.webkitGetUserMedia({
//                     audio: false,
//                     video: {
//                         mandatory: {
//                             chromeMediaSource: 'desktop',
//                             chromeMediaSourceId: sources[i].id,
//                             minWidth: 1280,
//                             maxWidth: 4000,
//                             minHeight: 720,
//                             maxHeight: 4000
//                         }
//                     }
//                 }, this.handleStream, this.handleError);

//                 return;
//             }
//         }
//     });
// }

export function takeFullScreenshot(): Promise<NativeImage> {
    console.log("Hey there, consider it done");
    return new Promise<NativeImage>(
        function (resolve, reject) {
            const thumbSize = determineScreenShot();
            let options: Electron.SourcesOptions = { types: ['screen'], thumbnailSize: thumbSize };
            desktopCapturer.getSources(options, function (error, sources) {
                if (error) {
                    return console.log("Error in getting sources: " + error);
                }
                sources.forEach(function (source: DesktopCapturerSource) {
                    if (source.name === "Entire screen" || source.name === "Screen 1") {
                        resolve(source.thumbnail);
                        return;
                    }
                });
                reject("No source found as main screen");
                return;
            });
        });

}

function determineScreenShot() {
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    maxDimension * window.devicePixelRatio
    return {
        width: screenSize.width,
        height: screenSize.height
    };
}