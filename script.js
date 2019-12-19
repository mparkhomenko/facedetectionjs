const imageUpload = document.getElementById('imageUpload')
let canvas;
let context;
let image;
let prefsize;

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    const detections = await faceapi.detectSingleFace(image)

    if (!detections) {
      throw new Error('no faces detected')
    }

    let proc = -10;
    proc = detections.box.width / 100 * proc;
    let resultX = detections.box.x + proc;

    proc = -25;
    proc = detections.box.height / 100 * proc;
    let resultY = detections.box.y + proc;

    proc = 30;
    proc = detections.box.width / 100 * proc;
    let resultW = detections.box.width + proc;

    proc = 35;
    proc = detections.box.height / 100 * proc;
    let resultH = detections.box.height + proc;

    prefsize = {
      x: Math.round(resultX),
      y: Math.round(resultY),
      w: Math.round(resultW),
      h: Math.round(resultH)
    };

    canvas = document.createElement('canvas');
    context = canvas.getContext("2d");

    canvas.width = prefsize.w;
    canvas.height = prefsize.h;
    context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 1, 1, canvas.width, canvas.height);
    let data = canvas.toDataURL();
    console.log(data)
  })
}
