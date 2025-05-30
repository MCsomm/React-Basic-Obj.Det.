This is a React-based web app for performing real-time object detection in images using transformers.js and the DETR ResNet-50 model from Hugging Face.
🔧 Tech Stack

    React + Vite – Modern frontend framework and build tool for fast development.

    transformers.js – Client-side inference library by Hugging Face that runs Transformer models directly in the browser via WebAssembly (WASM).

    DETR (DEtection TRansformer) – A powerful object detection model (Xenova/detr-resnet-50) from Hugging Face's model hub.

    JavaScript + Web APIs – For image processing, DOM manipulation, and rendering bounding boxes.

📦 Features

    Upload any image and run object detection entirely in the browser (no backend/API).

    Draws bounding boxes with labels for detected objects.

    Uses pure client-side inference with no data sent to any server.
