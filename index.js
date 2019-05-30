var getUserMedia = require('getusermedia')
const strip = document.querySelector('.strip');
var anchors = document.getElementsByClassName('emoji')
var filters = document.getElementsByClassName('filter')
var set_fgs = document.getElementsByClassName('set_fg')
var mom = document.getElementById('mother')

let width = 480;
let height = 0;

let streaming = false;
let vc = null;

let src = null;
let dstC1 = null;
let dstC3 = null;
let dstC4 = null;

var foreground = false;

var filterUse = null;

Array.prototype.forEach.call(filters, function(filter) {
    filter.addEventListener('click', function() {
        filterUse = filter.id;
        console.log('set filter' + filterUse)
    })
})

Array.prototype.forEach.call(set_fgs, function(set_fg) {
    set_fg.addEventListener('click', function() {
        insert_fg(set_fg.id.split("_")[1])
    })
})

function insert_fg(fg) {
    if (!foreground) {
        var section = document.createElement('section')
        mom.appendChild(section)
        section.className = "foreground"
        console.log("open_fg")
        section.id = fg
        foreground = true

    } else {
        console.log("close_fg")
        var tmp = document.getElementById('snow')
        tmp.parentNode.removeChild(tmp);
        delete tmp
        foreground = false

    }
}

function StartStream() {
    getUserMedia({ video: true, audio: true }, function(err, stream2) {
        if (err) return console.error(err)
        var Peer = require('simple-peer')
        var peer = new Peer({
            initiator: location.hash === '#init',
            trickle: false,
            stream: stream2
        })

        peer.on('signal', function(data) {
            document.getElementById('yourId').value = JSON.stringify(data)
        })

        document.getElementById('connect').addEventListener('click', function() {
            var otherId = JSON.parse(document.getElementById('otherId').value)
            peer.signal(otherId)
        })

        document.getElementById('send').addEventListener('click', function() {
            var yourMessage = document.getElementById('yourMessage').value
            peer.send(yourMessage)
            document.getElementById('yourMessage').value = "" // clear msg box
        })

        Array.prototype.forEach.call(anchors, function(anchor) {
            anchor.addEventListener('click', function() {
                peer.send("#" + anchor.id)
                console.log('send emoji')
            })
        })

        peer.on('data', function(data) {
            switch (data.toString()) {
                case '#circle':
                    explode('circle')
                    console.log('rec circle')
                    break;
                case '#heart':
                    explode('heart')
                    console.log('rec heart')
                    break;
                case '#star':
                    explode('star')
                    console.log('rec star')
                    break;
                case '#?':
                    explode('?')
                    console.log('rec ?')
                    break;
                case '#pause':
                    document.getElementById('large').pause()
                    break;
                case '#play':
                    document.getElementById('large').play()
                    break;
                default:
                    document.getElementById('messages').textContent += data + '\n'
            }
        })

        peer.on('stream', function(stream1) {

            var video1 = document.createElement('video')
            mom.appendChild(video1)
            video1.className = "bgphoto"
            video1.id = "large"
            video1.srcObject = stream1

            var video2 = document.createElement('video')
            mom.appendChild(video2)
            video2.className = "player"
            video2.id = "small"
            video2.srcObject = stream2

            document.getElementById('pause').addEventListener('click', function() {
                video2.pause()
                peer.send("#pause")
            })

            document.getElementById('play').addEventListener('click', function() {
                video2.play()
                peer.send("#play")
            })

            document.getElementById('snap').addEventListener('click', function() {
                const canvas = document.getElementById("canvasOutput");
                const data = canvas.toDataURL('image/png', 1);
                const link = document.createElement('a');
                link.href = data;
                link.setAttribute('download', 'image.png');
                link.innerHTML = `<img src="${data}" alt="image" />`;
                strip.insertBefore(link, strip.firstChild);

            })

            // ↓↓↓↓↓↓↓↓↓↓↓ CV ↓↓↓↓↓↓↓↓↓↓↓

            video1.addEventListener("canplay", function(ev) {
                if (!streaming) {
                    height = video1.videoHeight / (video1.videoWidth / width);
                    video1.setAttribute("width", width);
                    video1.setAttribute("height", height);
                    streaming = true;
                    vc = new cv.VideoCapture(video1);
                }
                startVideoProcessing();
            }, false);

            function startVideoProcessing() {
                if (!streaming) { console.warn("Please startup your webcam"); return; }
                stopVideoProcessing();
                src = new cv.Mat(height, width, cv.CV_8UC4);
                dstC1 = new cv.Mat(height, width, cv.CV_8UC1);
                dstC3 = new cv.Mat(height, width, cv.CV_8UC3);
                dstC4 = new cv.Mat(height, width, cv.CV_8UC4);
                requestAnimationFrame(processVideo);
            }

            function gray(src) {
                cv.cvtColor(src, dstC1, cv.COLOR_RGBA2GRAY);
                return dstC1;
            }

            function erosion(src) {
                let kernelSize = 15;
                let kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);
                cv.erode(src, dstC4, kernel, { x: -1, y: -1 }, 1);
                kernel.delete();
                return dstC4;
            }

            function processVideo() {
                vc.read(src);
                let result;
                switch (filterUse) {
                    case 'gray':
                        result = gray(src);
                        break;
                    case 'pass':
                        result = src;
                        break;
                    case 'erosion':
                        result = erosion(src);
                        break;
                    default:
                        result = src;
                }
                cv.imshow("canvasOutput", result);
                requestAnimationFrame(processVideo);
            }

            function stopVideoProcessing() {
                if (src != null && !src.isDeleted()) src.delete();
                if (dstC1 != null && !dstC1.isDeleted()) dstC1.delete();
                if (dstC3 != null && !dstC3.isDeleted()) dstC3.delete();
                if (dstC4 != null && !dstC4.isDeleted()) dstC4.delete();
            }
        })
    })
}

document.getElementById('cam').addEventListener('click', function() {
    StartStream()
})