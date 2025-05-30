// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";

import "./App.css";

env.allowLocalModels = false;

function App() {
    const [status, setStatus] = useState("Loading model...");
    const [detector, setDetector] = useState(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    // Load the model once on mount
    useEffect(() => {
        async function loadModel() {
            try {
                const model = await pipeline("object-detection", "Xenova/detr-resnet-50");
                setDetector(() => model);
                setStatus("Ready");
            } catch (err) {
                console.error("Model load error:", err);
                setStatus("Failed to load model");
            }
        }

        loadModel();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                containerRef.current.innerHTML = ""; // Clear previous content
                img.ref = imageRef;
                img.style.width = "100%";
                containerRef.current.appendChild(img);
                detect(img);
            };
        };

        reader.readAsDataURL(file);
    };

    const detect = async (img) => {
        if (!detector) {
            console.warn("Model not loaded yet.");
            return;
        }

        try {
            setStatus("Analysing...");
            const output = await detector(img.src, { threshold: 0.5, percentage: true });
            output.forEach(renderBox);
            setStatus("");
        } catch (error) {
            console.error("Detection error:", error);
            setStatus("Error during detection");
        }
    };

    const renderBox = ({ box, label }) => {
        const { xmax, xmin, ymax, ymin } = box;
        const color = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");

        const boxElement = document.createElement("div");
        boxElement.className = "bounding-box";
        Object.assign(boxElement.style, {
            borderColor: color,
            left: `${100 * xmin}%`,
            top: `${100 * ymin}%`,
            width: `${100 * (xmax - xmin)}%`,
            height: `${100 * (ymax - ymin)}%`,
        });

        const labelElement = document.createElement("span");
        labelElement.className = "bounding-box-label";
        labelElement.textContent = label;
        labelElement.style.backgroundColor = color;

        boxElement.appendChild(labelElement);
        containerRef.current.appendChild(boxElement);
    };

    return (
        <main className="container">
            <label className="custom-file-upload">
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} />
                <img
                    className="upload-icon"
                    src="https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/upload-icon.png"
                    alt="Upload"
                />
                Upload image
            </label>

            <div id="image-container" ref={containerRef}></div>
            <p id="status">{status}</p>
        </main>
    );
}

export default App;
