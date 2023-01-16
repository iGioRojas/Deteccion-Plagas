from flask import Flask, render_template, request, jsonify
from keras.models import load_model
import numpy as np
import cv2
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]
    file.save(file.filename)

    modelo = load_model("./static/modelo_plagas.h5")
    one_hot = ["Picudo Negro", "Nematodo", "No es plaga", "No existe insecto en la imagen"]
    imgDemo = cv2.imread("./"+file.filename)
    imgDemo = cv2.cvtColor(imgDemo, cv2.COLOR_BGR2RGB)
    imgDemo = cv2.resize(imgDemo, (224, 224))
    np_image = np.array(imgDemo)
    np_image = np.expand_dims(np_image,axis=0)
    predictions = modelo.predict(np_image)
    print(predictions)
    maximo = np.argmax(predictions)
    return jsonify({"message": one_hot[maximo]})

app.run(host="0.0.0.0", port=80)