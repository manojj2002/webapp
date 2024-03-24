from flask import Flask, request, jsonify
import cv2
import numpy as np
import os

app = Flask(__name__)

# Define a route for image upload
@app.route('/upload', methods=['POST'])
def upload_image():
    # Check if request contains file
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    # Check if file name is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read the uploaded image
        img_np = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

        # Perform image processing (e.g., convert to grayscale)
        processed_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Save processed image to temporary directory
        temp_dir = 'temp_images'
        os.makedirs(temp_dir, exist_ok=True)
        temp_file_path = os.path.join(temp_dir, 'processed_image.jpg')
        cv2.imwrite(temp_file_path, processed_img)

        # Return path to processed image
        return jsonify({'processed_image': temp_file_path}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
