import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MathUtils } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export function PLYViewer() {
    const mountRef = useRef(null);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [showTouchHint, setShowTouchHint] = useState(false);
    const interactionRef = useRef(false);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(0, 0.5, 1.25);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 0.35);
        spotLight.position.set(5, 5, 5);
        scene.add(spotLight);

        let model = null;

        function parseHeader(textData) {
            let numVertices = 0;
            let hasColors = false;
            const lines = textData.split("\n");
            let headerEnded = false;
            let dataStartIndex = 0;

            lines.forEach((line, index) => {
                if (headerEnded) return;
                const tokens = line.split(" ");
                if (tokens[0] === "element" && tokens[1] === "vertex") {
                    numVertices = parseInt(tokens[2]);
                } else if (tokens[0] === "property" && tokens[2] === "red") {
                    hasColors = true;
                } else if (line === "end_header") {
                    headerEnded = true;
                    dataStartIndex = index + 1;
                }
            });

            return { numVertices, hasColors, dataStartIndex };
        }

        function loadPly(textData) {
            const { numVertices, hasColors, dataStartIndex } = parseHeader(textData);

            const lines = textData.split("\n").slice(dataStartIndex, dataStartIndex + numVertices);
            const positions = [];
            const colors = [];
            const color = new THREE.Color();

            lines.forEach((line, index) => {
                const tokens = line.split(" ");
                const x = parseFloat(tokens[0]);
                const y = parseFloat(tokens[1]);
                const z = parseFloat(tokens[2]);

                if (isNaN(x) || isNaN(y) || isNaN(z)) {
                    console.warn(`Skipping invalid vertex data at line ${index + dataStartIndex}:`, line);
                    return;
                }

                positions.push(x, y, z);

                if (hasColors) {
                    const r = parseInt(tokens[6]) / 255;
                    const g = parseInt(tokens[7]) / 255;
                    const b = parseInt(tokens[8]) / 255;

                    if (isNaN(r) || isNaN(g) || isNaN(b)) {
                        console.warn(`Skipping invalid color data at line ${index + dataStartIndex}:`, line);
                        colors.push(1, 1, 1);
                    } else {
                        color.setRGB(r, g, b);
                        colors.push(color.r, color.g, color.b);
                    }
                } else {
                    colors.push(1, 1, 1);
                }
            });

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            const material = new THREE.PointsMaterial({ size: 0.01, vertexColors: true });

            model = new THREE.Points(geometry, material);
            model.rotateOnAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(-90));
            model.rotateOnAxis(new THREE.Vector3(0, 0, 1), MathUtils.degToRad(90));
            scene.add(model);

            setModelLoaded(true);

            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        }

        fetch('/models/leo_chair_trimmed.ply')
            .then((response) => response.text())
            .then((text) => {
                loadPly(text);
            })
            .catch((error) => console.error("Failed to load PLY file:", error));

        const animate = () => {
            requestAnimationFrame(animate);

            if (model) {
                model.rotation.z += 0.005;
            }

            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (mountRef.current) {
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
            }
        };

        const handleUserInteraction = () => {
            interactionRef.current = true;
            setShowTouchHint(false);
        };

        const hintTimeout = setTimeout(() => {
            if (!interactionRef.current) setShowTouchHint(true);
        }, 5000);

        mountRef.current.addEventListener("mousedown", handleUserInteraction);
        mountRef.current.addEventListener("touchstart", handleUserInteraction);
        window.addEventListener('resize', handleResize);

        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
            clearTimeout(hintTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {!modelLoaded && <SkeletonViewer />}
            <div
                ref={mountRef}
                style={{
                    width: '100%',
                    height: '100%',
                    border: '2px solid #000',
                    borderRadius: '10px',
                    display: modelLoaded ? 'block' : 'none',
                    position: 'relative',
                }}
            >
                {showTouchHint && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            zIndex: 1,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <ArrowBackIcon sx={{ fontSize: 40, color: "white" }} />
                            <TouchAppIcon sx={{ fontSize: 50, color: "white" }} />
                            <ArrowForwardIcon sx={{ fontSize: 40, color: "white" }} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export function SkeletonViewer() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.2em',
                color: '#888',
                borderRadius: '10px',
            }}
        >
            Loading...
        </div>
    );
}