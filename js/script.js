let videoElement = document.getElementById('video');

function onResults(results) {
  if (results.multiHandLandmarks) {
    let marks = results.multiHandLandmarks;
    let hand = marks[0];
    if (hand) {
      let thumbTip = new Point(hand[4]) * view.size;
      let indexFingerTip = new Point(hand[8]) * view.size;
      let middleFingerTip = new Point(hand[12]) * view.size;
      let ringFingerTip = new Point(hand[16]) * view.size;
      let pinkyTip = new Point(hand[20]) * view.size;
      let tips = [
        thumbTip,
        indexFingerTip,
        middleFingerTip,
        ringFingerTip,
        pinkyTip
      ];
      
      let averageCenter = (
        thumbTip +
        indexFingerTip +
        middleFingerTip +
        ringFingerTip +
        pinkyTip
      ) / 5;

      let maxDistance = 0;
      for (let tip of tips) {
        let vector = tip - averageCenter;
        let distance = vector.length;
        if (distance > maxDistance) {
          maxDistance = distance;
        }
      }

      let point = averageCenter;

      new Path.Circle({
        center: point,
        radius: maxDistance / 2,
        fillColor: 'red'
      });
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
