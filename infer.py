from inference_sdk import InferenceHTTPClient
import cv2
import os
import supervision as sv
import numpy as np
from PIL import Image
import PIL
import datetime
import json
import base64
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

DELAY_SECONDS = 5
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="mm2hH79xruPVWBquMOAz"
)

# This is my path
path = "images/input/"


def main():
    cam_port = 0
    cam = cv2.VideoCapture(cam_port)

    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    while True:
        # reading the input using the camera
        result, frame = cam.read()

        # If image is detected without any error, show result
        if result:
            result = CLIENT.infer(frame, model_id="head-detection-cctv/1")
            print(result)

            # If 'q' key is pressed, break the loop
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

            annotated_img, count = process_image(frame, result['predictions'])
            post(db, annotated_img, count)

        else:
            print("No image detected. Please try again")


def process_image(img, predictions):
    if predictions:
        detections = sv.Detections(
            xyxy=np.array([
                [
                    pred['x'],
                    pred['y'],
                    pred['x'] + pred['width'],
                    pred['y'] + pred['height']
                ] for pred in predictions
            ]),
            class_id=np.array([pred['class_id']
                               for pred in predictions]),
            confidence=np.array([pred['confidence']
                                for pred in predictions])
        )
        bounding_box_annotator = sv.BoxAnnotator()
        annotated_frame = bounding_box_annotator.annotate(
            scene=img.copy(),
            detections=detections
        )
        count = len(predictions)
    else:
        annotated_frame = img.copy()
        count = 0
    return annotated_frame, count


def post(db, img, count):
    timestamp = datetime.datetime.now()
    int_time = int(timestamp.strftime("%Y%m%d%H%M%S"))
    # encoded_img = base64.b64encode(img)
    x = {
        "id": int_time,
        "count": count,
        "timestamp": str(timestamp),
        "image": str(img),
    }

    db.collection('images').add(x)


main()
