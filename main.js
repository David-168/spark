  import * as THREE from "three";
  import { SplatMesh } from "@sparkjsdev/spark";

  const scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement)

  var videoElement;
  var solutionOptions;
  
  function initMediaPipe() {
      console.log("Script loaded V67");
  
      console.log("Init Tag000");
  
  
      const PPI = 460;//460; // real screen PPI
  
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;
      console.log("Inner",cssWidth + " x " + cssHeight + " pixels");
  
      const ratio = window.devicePixelRatio;
      console.log("ratio",ratio);
  
      const physicalWidth = cssWidth * ratio;
      const physicalHeight = cssHeight * ratio;
  
      console.log("physicalHeight",physicalWidth + " x " + physicalHeight + " pixels");
      const widthInches = physicalWidth / PPI;
      const heightInches = physicalHeight / PPI;
  
      console.log("Window physical size:");
      console.log(widthInches + " x " + heightInches + " inches");
  
      console.log(widthInches + " x " + heightInches + " inches");
  
      console.log("Screen width:", screen.width,":", screen.height, " pixels");
  
      console.log("Visual Viewport width:", window.visualViewport?.width,":", window.visualViewport?.height, " pixels");
  
      const mpFaceMesh = window;
  
  
      //var camera;//virtual camera (=view point)
      const config = { locateFile: (file) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@` +
                  `${mpFaceMesh.VERSION}/${file}`;
          } };
              console.log("Init Tag001");
      // Our input frames will come from here.
          videoElement = document.getElementsByClassName('input_video')[0];
          console.log("Init Tag00",videoElement);
          console.log("Init Tag000");
  
          scene.addEventListener('loaded', () => {
              console.log("Loaded  Tag0 ");
              console.log("Loaded  Tag1 ");
          
          });
          console.log("Init Tag002");
      //    camera= scene.camera;  
          console.log("Init Tag003");
              //Accessing to virtual camera of a-frame 
  
              //const gsrenderer = new SPLAT.WebGLRenderer();
      //        document.body.appendChild(gsrenderer.domElement);
  
      //        camera= scene.camera;  
  
  
      solutionOptions = {
          selfieMode: true,
          enableFaceGeometry: false,
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
      };
          console.log("Init Tag004");
  
  
      // We'll add this to our control panel later, but we'll save it here so we can
      // call tick() each time the graph runs.
  
              console.log("Init Tag01");
  
      //    canvasCtx.restore();
              console.log("Init Tag02");
              console.log("Init Tag021");
              console.log("Init Tag022",config);
  
      const faceMesh = new mpFaceMesh.FaceMesh(config);
              console.log("Init Tag03");
  
      faceMesh.setOptions(solutionOptions);
              console.log("Init Tag04");
  
      faceMesh.onResults(onResults);
              console.log("Init Tag05");
  
          const cameraMediaPipe = new window.Camera(videoElement, {
          onFrame: async () => {
            console.log("onFrame Tag0");
              await faceMesh.send({ image: videoElement });
            console.log("onFrame Tag1");
              },
              width: 640,
              height: 480
          });
          
          console.log("Init Tag06");
          console.log("Video:",videoElement.width,":",videoElement.height);
  
          cameraMediaPipe.start();
  
          console.log("Init Tag07");
  }
  
  function onResults(results) {
      // Hide the spinner.
      // Update the frame rate.
  //    fpsControl.tick();
      // Draw the overlays.
//        console.log("onResults Tag00");
      if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
              if (solutionOptions.refineLandmarks) {
//        console.log("onResults Tag01",videoElement,videoElement.videoWidth,videoElement.videoHeight);
  //		        let landmarks =  results.landmarks[0];
                let distanceZ = estimateDepth(landmarks,videoElement.videoWidth,videoElement.videoHeight,76);
        //          console.log("Distance",distanceZ);
  //		console.log("onResults Tag011");
                const cx = videoElement.videoWidth / 2;
                const cy = videoElement.videoHeight / 2;
                let rightEye = landmarks[33];//263];
                const focalLength = videoElement.videoHeight;//1080;//460;//424;// (2.65-focal length/4-focal width)*640
                rightEye={ x:rightEye.x*videoElement.videoWidth, y:rightEye.y*videoElement.videoHeight, z:rightEye.z};
  
  //		console.log("onResults Tag012");
                const worldPoint = pixelToWorld(
                    rightEye.x,
                    rightEye.y,
                    distanceZ,
                    focalLength,
                    cx,
                    cy
                );
  
                const ppi = 460; // 
  //		console.log("onResults Tag013");
                worldPoint.x=worldPoint.x;
                worldPoint.y=worldPoint.y
                +(window.innerHeight*window.devicePixelRatio/ppi)*0.0254
                ;//-((heightInches)/2);
  //				console.log("LeftEye Meters:",worldPoint.x,",",worldPoint.y,",",worldPoint.z);
  
//                console.log("leftEye Pixel:",worldPoint.x.toFixed(2),",",worldPoint.y.toFixed(2),",",worldPoint.z.toFixed(2));
  
  //				camera.position.x=worldPoint.x; 
  //				camera.position.y=worldPoint.y;
  //				camera.position.z=worldPoint.z; //z position is fixed.    
                //camera.position= [0, 0, 0];
                camera.position.copy(new THREE.Vector3(worldPoint.x, worldPoint.y, worldPoint.z));
                //  camera.position = new THREE.Vector3(worldPoint.x, worldPoint.y, worldPoint.z);
//        console.log("onResults Tag014");
  //				camera.projectionMatrix = FrustumProjection(worldPoint);
                let projectionMatrix = FrustumProjection(worldPoint);
              //    camera.projectionMat(projectionMatrix);
                  //camera.projectionMatrix.fromArray(
                  //    projectionMatrix.elements
                  //);
//        console.log("onResults Tag015");
  
              }
          }
      }
  };
  
        function pixelToWorld(inx, iny, Z, f, cx, cy) {
            return {
                x: ((inx - cx) * Z) / f,
                y: ((iny - cy) * Z) / f,
                z: Z
            };
        };
  
        function getWidthHeight(){
          // Create a 1-inch div
          const div = document.createElement("div");
          div.style.width = "1in";  // 1 inch
          div.style.height = "1in";
          div.style.position = "absolute";
          div.style.left = "-1000px"; // hide it
          document.body.appendChild(div);
  
          // Measure pixels per inch
          const pxPerInch = div.offsetWidth;
  //        console.log("Estimated PPI:", pxPerInch);
  
          document.body.removeChild(div);
        }
        
        function focalLengthFromFOV(fovDeg, imageWidth) {
          const fovRad = fovDeg * Math.PI / 180;
          return imageWidth / (2 * Math.tan(fovRad / 2));
        }
      
        function estimateDepth(landmarks, imageWidth, imageHeight,fovDeg) {
  
//          console.log("Tag0");
          //console.log("landmarks",landmarks);
          //console.log("landmarks33",landmarks[33]);
          let leftEye = landmarks[33];
        leftEye={ x:leftEye.x*imageWidth, y:leftEye.y*imageHeight, z:leftEye.z*5};
  
          let rightEye = landmarks[263];
        rightEye={ x:rightEye.x*imageWidth, y:rightEye.y*imageHeight, z:rightEye.z*5};
  //        console.log("leftEye Pixel:",leftEye.x.toFixed(2)
  //		,":",leftEye.y.toFixed(2)
  //		,":",leftEye.z.toFixed(2)		
  //	);
          const dx = (leftEye.x - rightEye.x);
          const dy = (leftEye.y - rightEye.y);
  //        console.log("Tag1");
  
  //        console.log("dx:",dx," dy:",dy);
          const pixelDistance = Math.sqrt(dx * dx + dy * dy);
  
  //        console.log("pixelDistance",pixelDistance);
          let focalLength = focalLengthFromFOV(fovDeg, imageWidth);
  
  //        console.log("focalLength",focalLength);
  
  //        focalLength = 750; //424 (2.65-focal length/4-focal width)*640
          focalLength = videoElement.videoHeight;//1080;//320;//272;//424;// (2.65-focal length/4-focal width)*640
          const realIPD = 0.063; // meters
          //console.log("Tag3");
  
          const depthMeters = (focalLength * realIPD) / pixelDistance;
//          console.log("Video",videoElement.videoWidth,":",videoElement.videoHeight);
//          console.log("depthMeters",depthMeters);
          const cx = imageWidth / 2;
          const cy = imageHeight / 2;
  
          const worldPoint = pixelToWorld(
              rightEye.x,
              rightEye.y,
              depthMeters,
              focalLength,
              cx,
              cy
          );
  
  //        console.log("LeftEye Meters:",worldPoint.x,",",worldPoint.y,",",worldPoint.z);
          return depthMeters;
        };
      
        function CalculateDepth(left, right, bottom, top, near, far)
        {
        };
        
        function FrustumProjection(eyepos)
        {
  
  //        console.log("FrustumProjection tag00");
  
          const widthPx = window.innerWidth;//screen.width;              // CSS pixels
          const heightPx = window.innerHeight;//screen.height;            // CSS pixels
          const dpr = window.devicePixelRatio || 1; // pixels per CSS pixel
  
          const realWidthPx = widthPx * dpr;
          const realHeightPx = heightPx * dpr;
  
  //        console.log("Real pixels:", realWidthPx, realHeightPx);
  
          const ppi = 460; // replace with your device's PPI
          const widthInches = realWidthPx / ppi;
          const heightInches = realHeightPx / ppi;
  //        console.log("Real pixels:", realWidthPx, realHeightPx);
//          console.log("FrustumProjection tag01");
  
          const widthMeters = widthInches * 0.0254;
          const heightMeters = heightInches * 0.0254;
//          console.log("Real meters:", widthMeters, heightMeters);
  
          const EyePos = new THREE.Vector3(eyepos.x,eyepos.y,eyepos.z);
//          console.log("FrustumProjection tag02");
          const LeftTop =new THREE.Vector3(-0.032,0.05,0);
  //        const LeftTop =new THREE.Vector3(-1*widthMeters,heightMeters,0);
          const RightBottom =new THREE.Vector3(0.032,-0.05,0);
  //        const RightBottom =new THREE.Vector3(widthMeters,-1*heightMeters,0);
//          console.log("FrustumProjection tag03");
          const LeftTopCameraSpace = LeftTop.sub(EyePos);//LeftTop.clone().applyMatrix4(camera.matrixWorldInverse);
  //        console.log("LeftTop:", LeftTopCameraSpace);
//          console.log("FrustumProjection tag04");
  
          const RightBottomCameraSpace = RightBottom.sub(EyePos);//RightBottom.clone().applyMatrix4(camera.matrixWorldInverse);
  //        console.log("RightBottom:", RightBottomCameraSpace);
//          console.log("FrustumProjection tag040");
          //camera.position.copy(EyePos);
//          camera.lookAt(new THREE.Vector3(eyepos.x,eyepos.y,0));
//          console.log("FrustumProjection tag041");
          camera.projectionMatrix.makePerspective(LeftTopCameraSpace.x,
            RightBottomCameraSpace.x,
            RightBottomCameraSpace.y,
            LeftTopCameraSpace.y,
            -1*LeftTopCameraSpace.z,
            100
          ); 
//          console.log("FrustumProjection tag042");
          var m = PerspectiveOffCenter(LeftTopCameraSpace.x,
            RightBottomCameraSpace.x,
            RightBottomCameraSpace.y,
            LeftTopCameraSpace.y,
            -1*LeftTopCameraSpace.z,
            100
          ); 
  
//                  console.log("FrustumProjection tag05");
  
          return m;
    };
        function PerspectiveOffCenter(left, right, bottom, top, near, far)
        {
//                  console.log("PerspectiveOffCenter tag00");
  /*        var x = 2.0 * near / (right - left);
          var y = 2.0 * near / (top - bottom);
          var a = (right + left) / (right - left);
          var b = (top + bottom) / (top - bottom);
          var c = -(far + near) / (far - near);
          var d = -(2.0 * far * near) / (far - near);
          var e = -1.0;
          */
          var x = 2.0 * near / (right - left);
          var y = -2.0 * near / (top - bottom);
          var a = (right + left) / (right - left);
          var b = -1*(top + bottom) / (top - bottom);
          var c = -(far + near) / (far - near);
          var d = -(2.0 * far * near) / (far - near);
          var e = 1.0;
         
  //        var m = new SPLAT.Matrix4( x,0,a,0, 0,y,b,0, 0,0,c, d,0,0, e,0);
          var m = new THREE.Matrix4( x,0,0,0, 0,y,0,0, a,b,c,e, 0,0,d,0);
                  //        console.log("PerspectiveOffCenter tag01");
          return m;
        };
  

initMediaPipe();

const el = document.getElementById("splat");

// Parse the JSON string
const splatconfig = JSON.parse(el.dataset.config);

console.log(splatconfig.scene);              // "garden.splat"
console.log(splatconfig.position[0]);           // 0
console.log(splatconfig.scale);           // 1
console.log(splatconfig.rotation);                // 60
console.log(splatconfig.backgroundColor);    // "#000000"

//  const splatURL = "https://sparkjs.dev/assets/splats/butterfly.spz";
  const butterfly = new SplatMesh({ url: splatconfig.scene });

    butterfly.rotation.set((
    splatconfig.rotation[0] * Math.PI/180,
    splatconfig.rotation[1] * Math.PI/180,
    splatconfig.rotation[2] * Math.PI/180
  ));

  butterfly.quaternion.set(0, 0, 0, 0);
  butterfly.position.set(splatconfig.position[0],
     splatconfig.position[1], splatconfig.position[2]);
 // butterfly.rotation.set((
//    splatconfig.rotation[0] * Math.PI/180,
//    splatconfig.rotation[1] * Math.PI/180,
//    splatconfig.rotation[2] * Math.PI/180
//  ));
  scene.add(butterfly);
  renderer.setClearColor(0x000000, 1)
  butterfly.scale.set(splatconfig.scale[0], splatconfig.scale[1], splatconfig.scale[2]);
  renderer.setAnimationLoop(function animate(time) {
    renderer.render(scene, camera);
//    butterfly.rotation.y += 0.01;
  });
