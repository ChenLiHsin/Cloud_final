let model = tf.loadGraphModel('./web_model/model.json');
let inputElement = document.getElementById('fileInput');
let imgElement = document.getElementById('original');
let result_list = [document.getElementById('original_result'),
                   document.getElementById('gaussian_result'),
                   document.getElementById('gamma_result'),
                   document.getElementById('sharpen_result')]

let class_name=['Not covid-19', 'Covid']

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    imgElement.style.visibility = "visible";
}, false);

imgElement.onload = function() {
    let img = tf.browser.fromPixels(imgElement);
    img = tf.image.resizeBilinear(img, [224, 224]);
    let test_data = tf.expandDims(img);
    test_data = test_data.div(tf.scalar(255));
    predict(test_data,0);
    
    let gamma_picture = adjust_gamma(1.5) ;
    gamma_picture = tf.image.resizeBilinear(gamma_picture, [224, 224]);
    test_data = tf.expandDims(img);
    test_data = test_data.div(tf.scalar(255));
    predict(test_data,1);
}

/* tensorflow predict API: https://js.tensorflow.org/api/latest/#tf.GraphModel.predict */
async function predict(test_data,id) {
    model.then(function(loadedModel) {
        const prediction = loadedModel.predict(test_data).flatten();
        /* dataSync() gets the value for tf tensor object */
        console.log(prediction.dataSync()) ;
        let str = class_name[prediction.argMax().dataSync()[0]];
        result_list[id].innerHTML = str;
    });
}

function adjust_gamma(gamma){
    let mat = cv.imread(imgElement);
    let gammaCorrection = 1 / gamma;

    for ( y = 0; y < mat.size().height; y++) {
      for ( x = 0; x < mat.size().width; x++) {
        let oldColor = mat.ucharPtr( x, y ) ;
                                 
        oldColor[0] = Math.pow((oldColor[0] / 255), gammaCorrection) * 255,
        oldColor[1] = Math.pow((oldColor[1] / 255), gammaCorrection) * 255,
        oldColor[2] = Math.pow((oldColor[2] / 255), gammaCorrection) * 255

      }
    }
    cv.imshow("gamma", mat);
    return mat ;
}

async function onOpenCvReady() {
    document.querySelector('#status').innerHTML = 'opencv.js & all models is ready.';
    
    /* enable the button */
    inputElement.disabled = false ;
}
