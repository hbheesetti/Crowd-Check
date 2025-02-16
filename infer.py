from inference_sdk import InferenceHTTPClient
import cv2
import os
import time
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
CAM_PORT = 0

CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="mm2hH79xruPVWBquMOAz"
)

# This is my path
path = "images/input/"


def main():
    cam = cv2.VideoCapture(CAM_PORT)

    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    while True:
        # reading the input using the camera
        result, frame = cam.read()
        # img = np.asarray(Image.open(
        #    "images/input/WIN_20250215_14_15_10_Pro.jpg"))

        # If image is detected without any error, show result
        if result:
            try:
                result = CLIENT.infer(frame, model_id="head-detection-cctv/1")
                print(result)

                annotated_img, count = process_image(
                    frame, result.get('predictions', []))
                post(db, annotated_img, count)
            except Exception as e:
                print(f"Error during inference or processing: {e}")

            # cv2.imshow("annotated_img", annotated_img)

        else:
            print("No image detected. Please try again")

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        time.sleep(DELAY_SECONDS)
    cam.release()
    # cv2.destroyAllWindows()


def process_image(img, predictions):
    if predictions:
        detections = sv.Detections(
            xyxy=np.array([
                [
                    pred['x'] - (pred['width'] / 2),  # x1 (top-left)
                    pred['y'] - (pred['height'] / 2),  # y1 (top-left)
                    pred['x'] + (pred['width'] / 2),  # x2 (bottom-right)
                    pred['y'] + (pred['height'] / 2)  # y2 (bottom-right)
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

    # Convert OpenCV image to Base64 for storage
    _, buffer = cv2.imencode('.jpg', img)
    encoded_img = base64.b64encode(buffer).decode('utf-8')

    data = {
        "id": int_time,
        "count": count,
        "timestamp": firestore.SERVER_TIMESTAMP,
        "image": encoded_img,
    }

    try:
        db.collection('images').add(data)
        print(f"Data successfully posted: {data}")
    except Exception as e:
        print(f"Failed to post data: {e}")


main()
