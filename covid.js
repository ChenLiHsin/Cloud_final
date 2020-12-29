let model_covid = tf.loadGraphModel('./web_model_covid/model.json');
let model_14 = tf.loadGraphModel('./web_model_14/model.json');
let inputElement = document.getElementById('fileInput');
let imgElement = document.getElementById('original');
let result_list = document.getElementById('original_result')


inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    imgElement.style.visibility = "visible";
}, false);

let need_14 = false ;

imgElement.onload = function() {
    need_14 = false ;
    let img = tf.browser.fromPixels(imgElement);
    img = tf.image.resizeBilinear(img, [224, 224]);
    let test_data = tf.expandDims(img);
    test_data = test_data.div(tf.scalar(255));
    
    predict_covid(test_data) ;
    
    setTimeout(1000);
    
    predict_14(test_data) ;
    
}

async function predict_covid(test_data) {
    model_covid.then(function(loadedModel) {
        const prediction = loadedModel.predict(test_data).flatten();
        console.log( "covid test" )
        console.log( prediction.dataSync() )
        
        if ( prediction.dataSync()[0] <= prediction.dataSync()[1] ) {
            result_list.innerHTML = "This images might has \"Covid\".";
        }
        else {
            need_14 = true ;
            result_list.innerHTML = "This images might \"NOT\" has Covid.";
        }
    });
}

async function predict_14(test_data) {
    model_14.then(function(loadedModel) {
        const prediction = loadedModel.predict(test_data).flatten();
        console.log( "14 test" )
        console.log( prediction.dataSync() )
                  
        if ( need_14 ) {
            result_list.innerHTML = "1.";
        }
    });
}

async function onOpenCvReady() {
    document.querySelector('#status').innerHTML = 'opencv.js & all models is ready.';
    inputElement.disabled = false ;
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
