let model_covid = tf.loadGraphModel('./web_model_covid/model.json');
let model_14 = tf.loadGraphModel('./web_model_14/model.json');
let inputElement = document.getElementById('fileInput');
let imgElement = document.getElementById('original');
let result_list = document.getElementById('original_result')
let result_list2 = document.getElementById('original_result2')
const checkCorrectBottom = document.querySelector('#checkCorrect');
const checkWrongBottom = document.querySelector('#checkWrong');


inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    imgElement.style.visibility = "visible";
}, false);

let need_14 = false;

document.getElementById("checkCorrect").addEventListener('click', (e) => addHistory(e, true));
document.getElementById("checkWrong").addEventListener('click', (e) => addHistory(e, false));

imgElement.onload = function () {
    need_14 = false;
    let img = tf.browser.fromPixels(imgElement);
    img = tf.image.resizeBilinear(img, [224, 224]);
    let test_data = tf.expandDims(img);
    test_data = test_data.div(tf.scalar(255));

    predict_covid(test_data);

    setTimeout(1000);

    predict_14(test_data);

    checkCorrectBottom.disabled = false;
    checkWrongBottom.disabled = false;

}

function addHistory(event, correct) {
    checkCorrectBottom.disabled = true;
    checkWrongBottom.disabled = true;
    let image = document.getElementById("original");
    console.log("Add History");
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', image.width * 0.8);
    canvas.setAttribute('height', image.height * 0.8);
    canvas.setAttribute('float', "left");
    const ctx = canvas.getContext('2d');
    var pictures = document.getElementById("pictures");
    pictures.insertBefore(canvas, pictures.childNodes[0]);
    ctx.drawImage(image, 0, 0, image.width * 0.8, image.height * 0.8);
    ctx.font = "30px Arial";
    if (!need_14 && correct) {
        ctx.fillText("Covid-19", 100, 150, 100);
        canvas.style.border = "green 10px solid"
    } // if()
    else if (need_14 && correct) {
        ctx.fillText("Not Covid-19", 100, 150, 100);
        canvas.style.border = "green 10px solid"
    } // else if()
    else if (!need_14 && !correct) {
        ctx.fillText("Covid-19", 100, 150, 100);
        canvas.style.border = "red 10px solid"
    } // else if()
    else if (need_14 && !correct) {
        ctx.fillText("Not Covid-19", 100, 150, 100);
        canvas.style.border = "red 10px solid"
    } // else if()
}

async function predict_covid(test_data) {
    model_covid.then(function (loadedModel) {
        const prediction = loadedModel.predict(test_data).flatten();
        console.log("covid test")
        console.log(prediction.dataSync())

        if (prediction.dataSync()[0] <= prediction.dataSync()[1]) {
            result_list.innerHTML = "This image might has \"Covid\".";
        }
        else {
            need_14 = true;
            result_list.innerHTML = "This image might \"NOT\" has Covid.";
        }
    });
}

async function predict_14(test_data) {
    model_14.then(function (loadedModel) {
        const prediction = loadedModel.predict(test_data).flatten();
        console.log("14 test")
        console.log(prediction.dataSync())
        let result_str = "But this image has high percentage with";
        if (need_14) {
            if (prediction.dataSync()[0] > 0.107) result_str = result_str + " \"Atelectasis\"";
            if (prediction.dataSync()[1] > 0.029) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Cardiomegaly\"";
            }

            if (prediction.dataSync()[2] > 0.122) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Effusion\"";
            }

            if (prediction.dataSync()[3] > 0.192) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Infiltration\"";
            }

            if (prediction.dataSync()[4] > 0.052) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Mass\"";
            }

            if (prediction.dataSync()[5] > 0.059) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Nodule\"";
            }

            if (prediction.dataSync()[6] > 0.013) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Pneumonia\"";
            }

            if (prediction.dataSync()[7] > 0.047) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Pneumothorax\"";
            }

            if (prediction.dataSync()[8] > 0.043) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Consolidation\"";
            }

            if (prediction.dataSync()[9] > 0.023) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Edema\"";
            }

            if (prediction.dataSync()[10] > 0.018) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Emphysema\"";
            }

            if (prediction.dataSync()[11] > 0.012) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Fibrosis\"";
            }

            if (prediction.dataSync()[12] > 0.026) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Pleural_Thickening\"";
            }

            if (prediction.dataSync()[13] > 0.0018) {
                if (result_str != "But this image has high percentage with") result_str = result_str + ","
                result_str = result_str + " \"Hernia\"";
            }

            if (result_str == "But this image has high percentage with") result_str = "";

            // result_list.innerHTML = "This image might \"NOT\" has Covid.\n" + result_str;
            result_list2.innerHTML = result_str;
        }
    });
}

async function onOpenCvReady() {
    document.querySelector('#status').innerHTML = 'opencv.js & all models is ready.';
    inputElement.disabled = false;
}

function adjust_gamma(gamma) {
    let mat = cv.imread(imgElement);
    let gammaCorrection = 1 / gamma;

    for (y = 0; y < mat.size().height; y++) {
        for (x = 0; x < mat.size().width; x++) {
            let oldColor = mat.ucharPtr(x, y);

            oldColor[0] = Math.pow((oldColor[0] / 255), gammaCorrection) * 255,
                oldColor[1] = Math.pow((oldColor[1] / 255), gammaCorrection) * 255,
                oldColor[2] = Math.pow((oldColor[2] / 255), gammaCorrection) * 255

        }
    }
    cv.imshow("gamma", mat);
    return mat;
}
