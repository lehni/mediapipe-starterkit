let videoElement = document.getElementById('video');

let path = new Path({
  strokeColor: 'black'
})

function onResults(results) {
  if (results.multiHandLandmarks) {
    let hand = results.multiHandLandmarks[0];
    if (hand) {
      let indexFingerTip = new Point(hand[8]);
      path.add(indexFingerTip * view.size);
    }
  }
}

let hands = new Hands({
  locateFile: file => `node_modules/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

let camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();
