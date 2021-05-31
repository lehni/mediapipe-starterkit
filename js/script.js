let videoElement = document.getElementById('video');

let index = 0;

view.scale(-1, 1);

let paths = [];
for (let i = 0; i <= 5; i++) {
  paths[i] = new Path({
    strokeColor: {
      hue: 360 * i / 5,
      saturation: 1,
      brightness: 1
    }
  })
}

function onResults(results) {
  // console.log(results);
  if (results.multiHandedness) {
    let hands = {};
    let i = 0;
    for (let { label } of results.multiHandedness) {
      hands[label.toLowerCase()] = results.multiHandLandmarks[i++];
    }

    let hand = hands.left || hands.right;
    if (hand) {
      let scale = view.size;
      let tips = [hand[4], hand[8], hand[12], hand[16], hand[20]];
      for (let i = 0; i <= 5; i++) {
        let path = paths[i];
        let point = new Point(tips[i]);
        path.add(point * scale);
      }
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
