# Introduction

This repository holds the front end code for an application that allows logged on members of a sailing club to control the pan / tilt / zoom of a webcam. Created for [Starcross Yacht Club](https://www.starcrossyc.org.uk), a short screencast of the functionality can be viewed [here](https://www.starcrossyc.org.uk/syc-webcam-functionality-for-yachties).

The overall functionality is dependant on a server side component that is not included in this repository meaning that this project is only likely to be of interest to people in contact with the repository owner about the options for implementing the server side component.

# Build

The following assumes you have a recent Node and NPM installed - see [here](https://nodejs.org/en/download/) for more details on this.

After checking out the code to your device, first run

`npm install`

from the top level directory

## Build for production

To create an optimised build for production (and assuming you plan to install the software in a sub-directory of your main site called /webcam)

`npm run build -- --base=/webcam`

# Running the code in development

To run the code in development run

`npm run dev`

You can then access the webpages at http://localhost:5173/ However, this is likely to be a slightly underwhelming experience as
1. You need to "point" to a real video stream
2. You need to "point" to an HTTP API that controls a webcam
3. You need to "subscribe" to a websocket API to receive status updates about the queue to use the webcam

# Edits required to code

As well as needing to point to a webcam video stream, this "front end code" is dependant on accessing the HTTP APIs from a server side implementation that implements the webcam queuing and control logic. It is also needs to subscribe to a websocket endpoint that is used for sending and receiving updates about the queue to control the webcam. Both of these are outside the scope of this "front end display" project. However, the "shape" of these APIs to be seen by the TypeScript definitions in the code referenced below.

1. Edit the URL in src/components/WebcamDisplay/WebcamDisplay.tsx to provide the URL that points to your webcam video stream
2. Edit the URL/paths in src/apis/HttpDataApis.tsx for the URLs to your back end implementation of the required HTTP APIs
3. Edit the URL path in the sendKeepAliveMessage() function in src/components/WebcamControls/WebCamControls.tsx for the URL path to the websocket subscribe endpoint on your back end implementation
4. Edit the URL path in src/App.tsx for the `StompSessionProvider` URL in your back end implementation. As per the name, this functionaility expects the use of the [Stomp](https://stomp.github.io/) protocol over the websocket connection
5. Assuming you are also running the required server side code on your device, you may need to tell this prohect where it is running. By default, this code (in `vite.config.ts`) expects the server side API and pictures to be available at http://localhost:8000/webcam/api and http://localhost:8080/webcam-pics. Edit vite.config.ts if required.
6. Edit the URL in src/components/ErrorMessage/ErrorMessage.tsx to point to a URL for a contact who can provide help for any problems
7. More generally, the code was originally written for Starcross Yacht Club (SYC) only and hasn't yet been genericised. Therefore, a search of the codebase for the strings "SYC" and "Starcross" is recommended so that you can decide which to change to something more appropriate for your usage.

At some point, I may pull all these values out to single config file to make editing easier! Maybe.

# Testing
Automated tests - there are none! This is sort of deliberate as there is very little application logic to be tested in this front end code and I'm not a big fan of stub and mock heavy front end tests. The server side code does have good coverage from both unit and integrations test.