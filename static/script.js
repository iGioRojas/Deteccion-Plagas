const imgSeleccionada = document.getElementById("image"),
  canvas       = document.querySelector('#canvas'),
  tomarFotoBtn = document.getElementById("takePhoto"),
  previsualizar = document.getElementById("previsualizar"),
  enviarBtn = document.getElementById("submit");

var canvasIsEmpty = true;
var pred = document.getElementsByClassName("predicion")[0];

  
imgSeleccionada.addEventListener("change", () => {
  const archivos = imgSeleccionada.files;
  var img = new Image();
  canvas.width=canvas.width;
  var ctx = canvas.getContext("2d");
  if (!archivos || !archivos.length) {
      canvas.width=canvas.width;
      return;
    }
    const primerArchivo = archivos[0];
    const objectURL = URL.createObjectURL(primerArchivo);
    img.src = objectURL;
    img.onload = function(){
    let scale_factor = Math.min(canvas.width / img.width, canvas.height / img.height);
    
    let newWidth = img.width * scale_factor;
    let newHeight = img.height * scale_factor;
        
    let x = (canvas.width / 2) - (newWidth / 2);
    let y = (canvas.height / 2) - (newHeight / 2);

      ctx.drawImage(img, x, y, newWidth, newHeight);
      canvasIsEmpty = false;
      pred.innerHTML = "";
    }
});

tomarFotoBtn.addEventListener("click",(e)=>{
  e.preventDefault();
  previsualizar.innerHTML = `<video id='video' autoplay='true'></video><button id="changeCamera" class='bg-blue-700 rounded p-4 text-white'>Cambiar Cámara</button><button id="takePic" class='bg-blue-700 rounded p-4 text-white'>Tomar foto</button>`;
  previsualizar.appendChild(canvas);
  encenderCamara();
});

function encenderCamara(){
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    previsualizar.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong class="font-bold">Oh Rayos!</strong>
    <span class="block sm:inline">La cámara no está disponible, prueba en otro dispositivo o subiendo una imagen</span>
    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
      <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
    </span>
  </div>`;
    return;
}
  var video = document.getElementById("video"),
  btnTomarFoto  = document.querySelector('#takePic');
  navigator.mediaDevices.getUserMedia({video:true,audio:false})
  .then((stream)=>{
    navigator.mediaDevices.enumerateDevices().then((devices)=>console.log(devices));
    console.log(stream);
    video.srcObject = stream;
    video.play();
    btnTomarFoto.addEventListener("click",()=>{
      previsualizar.innerHTML = "";
      previsualizar.appendChild(canvas);
      var ctx = canvas.getContext("2d");
      canvas.width=canvas.width;//limpiar img anterior
      ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight);
      video.srcObject.getTracks()[0].stop();
      canvasIsEmpty = false;
      pred.innerHTML = "";
    })
  })
  .catch((e)=>{
    console.log(e);
  })
}

enviarBtn.addEventListener("click", ()=>{
  if(canvasIsEmpty){
    console.log("The canvas is empty");
    return;
  }

  canvas.toBlob(function(blob) {
    var formData = new FormData();
    formData.append("file", blob, "testImage.jpg");

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
      let pred = document.getElementsByClassName("predicion")[0];
      pred.innerHTML = `<h2 class="font-semibold text-4xl mb-4">
      Predicción: ${data.message}
    </h2>`
    })
    .catch(error => {
        console.error(error);
    });
  }, "image/jpg");

  
  console.log("The canvas is not empty");
});
