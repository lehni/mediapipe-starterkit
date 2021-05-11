let videoElement = document.getElementById('video');

let index = 0;

view.scale(-1, 1);

function onResults(results) {
  // console.log(results);
  if (results.multiHandedness) {
    let hands = {};
    for (let { index, label } of results.multiHandedness) {
      hands[label.toLowerCase()] = results.multiHandLandmarks[index];
    }

    let hand = hands.left;
    if (hand) {
      let scale = view.size;
      let thumbTip = new Point(hand[4]) * scale;
      let indexFingerTip = new Point(hand[8]) * scale;
      let middleFingerTip = new Point(hand[12]) * scale;
      let ringFingerTip = new Point(hand[16]) * scale;
      let pinkyTip = new Point(hand[20]) * scale;

      let point = (thumbTip + indexFingerTip) / 2;
      let distance = (thumbTip - indexFingerTip).length;

      let circle = new Path.Circle({
        center: point,
        radius: distance / 2,
        fillColor: {
          hue: index,
          saturation: 1,
          brightness: 1
        },
      });

      let lifeTime = 0;
      circle.onFrame = function() {
        circle.fillColor.hue++;
        lifeTime++;
        if (lifeTime > 360) {
          circle.remove();
        }
      }

      index++;
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
