

# ICN Project #

Video chatroom.

(Just a simple demonstration of some of functions that can be used in the project.)

## Feature ##

+ Video and audio duplex streaming
+ Message delivery
+ Downloadable snapshot image
+ Emoji popup
+ OpenCV image processing
+ Snowing foreground

## Preparation ##

1. Install `getusermedia`, `simple-peer`, `budo`.
2. Add `"start": "budo index.js:bundle.js",` to `"scripts"` in `package.json`.

## Guide for Connection ##

1. `npm start` to run the server.
2. (Use Mozilla Firefox, and use two browser windows to test with yourself.)
3. Click "Start WebCam" in `xxx.xxx.xxx.xxx:9966/#init` to turn on camera and microphone access.
4. Copy the ID in "Your ID:" in `xxx.xxx.xxx.xxx:9966/#init` and then paste it into "Other ID:" in `xxx.xxx.xxx.xxx:9966/`.
5. Click "connect" in `xxx.xxx.xxx.xxx:9966/`.
6. Copy the ID in "Your ID:" in `xxx.xxx.xxx.xxx:9966/` and then paste it into "Other ID:" in `xxx.xxx.xxx.xxx:9966/#init`.
7. Click "connect" in `xxx.xxx.xxx.xxx:9966/#init`.

## Guide for Test ##

1. Click "Play Video" to start video and audio streaming.
2. Click "Pause Video" to stop the stream from your side to the other.
3. Click "Snapshot" to take photos, and click the image you want at the right side to download as `.png` file.
4. Click "send" to deliver message to the other.
5. Click "Circle", "Heart", "Star", or "?" to show emoji  popup to the other.
6. Click "None", "Gray", or "Erosion" to set the filter to video.
7. Click "Snow" to show snowing foreground.

## Screenshot ##

![screenshot](C:\Users\JustusHr\Desktop\ICN\ICN-demo-0530\screenshot.png)

The above screenshot shows a snowing foreground and three downloadable images, each of which was taken while using image filter of "Erosion", "Gray", and "None", respectively.
