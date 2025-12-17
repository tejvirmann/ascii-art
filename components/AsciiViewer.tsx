import { useState, useEffect, useRef } from 'react';
import { Upload, RefreshCw } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face {
  vertices: number[];
}

interface Model3D {
  name: string;
  vertices: Point3D[];
  faces: Face[];
}

// Optimized ASCII character sets for better shading
const asciiPresets = {
  classic: ' .:-=+*#%@',
  blocks: ' ░▒▓█',
  detailed: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  minimal: ' .oO0',
  retro: ' .oO@',
  bold: ' █',
  gradient: ' .:;+=xX$&',
  matrix: ' .:-=+*#%@█',
  // Professional high-quality preset
  professional: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
};

// Only keep requested models
const builtInModels: Record<string, Model3D> = {
  pyramid: { name: 'Pyramid', vertices: [], faces: [] },
  cube: { name: 'Cube', vertices: [], faces: [] },
  diamond: { name: 'Diamond', vertices: [], faces: [] },
  donut: { name: 'Donut', vertices: [], faces: [] },
  star: { name: 'Star', vertices: [], faces: [] },
};

const generateCube = () => {
  const vertices: Point3D[] = [
    { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
  ];
  const faces: Face[] = [
    { vertices: [0, 1, 2, 3] }, { vertices: [4, 7, 6, 5] },
    { vertices: [0, 4, 5, 1] }, { vertices: [2, 6, 7, 3] },
    { vertices: [0, 3, 7, 4] }, { vertices: [1, 5, 6, 2] }
  ];
  builtInModels.cube.vertices = vertices;
  builtInModels.cube.faces = faces;
};

const generatePyramid = () => {
  const vertices: Point3D[] = [
    { x: 0, y: 1, z: 0 },
    { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
    { x: 1, y: -1, z: 1 }, { x: -1, y: -1, z: 1 }
  ];
  const faces: Face[] = [
    { vertices: [0, 1, 2] }, { vertices: [0, 2, 3] },
    { vertices: [0, 3, 4] }, { vertices: [0, 4, 1] },
    { vertices: [1, 2, 3, 4] }
  ];
  builtInModels.pyramid.vertices = vertices;
  builtInModels.pyramid.faces = faces;
};

const generateDiamond = () => {
  const vertices: Point3D[] = [
    { x: 0, y: 1.5, z: 0 },
    { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 },
    { x: -1, y: 0, z: 0 }, { x: 0, y: 0, z: -1 },
    { x: 0, y: -1.5, z: 0 }
  ];
  const faces: Face[] = [
    { vertices: [0, 1, 2] }, { vertices: [0, 2, 3] },
    { vertices: [0, 3, 4] }, { vertices: [0, 4, 1] },
    { vertices: [5, 2, 1] }, { vertices: [5, 3, 2] },
    { vertices: [5, 4, 3] }, { vertices: [5, 1, 4] }
  ];
  builtInModels.diamond.vertices = vertices;
  builtInModels.diamond.faces = faces;
};

const generateDonut = () => {
  const vertices: Point3D[] = [];
  const faces: Face[] = [];
  const majorRadius = 1.0;
  const minorRadius = 0.4;
  const majorSegments = 32; // Higher detail
  const minorSegments = 20;
  for (let i = 0; i <= majorSegments; i++) {
    const u = (i / majorSegments) * Math.PI * 2;
    for (let j = 0; j <= minorSegments; j++) {
      const v = (j / minorSegments) * Math.PI * 2;
      const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
      const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
      const z = minorRadius * Math.sin(v);
      vertices.push({ x, y, z });
    }
  }
  for (let i = 0; i < majorSegments; i++) {
    for (let j = 0; j < minorSegments; j++) {
      const a = i * (minorSegments + 1) + j;
      const b = a + minorSegments + 1;
      faces.push({ vertices: [a, b, b + 1, a + 1] });
    }
  }
  builtInModels.donut.vertices = vertices;
  builtInModels.donut.faces = faces;
};

const generateStar = () => {
  const vertices: Point3D[] = [];
  const faces: Face[] = [];
  const points = 5;
  const outerRadius = 1.0;
  const innerRadius = 0.5;
  vertices.push({ x: 0, y: 1.2, z: 0 });
  vertices.push({ x: 0, y: -1.2, z: 0 });
  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
      vertices.push({
      x: radius * Math.cos(angle),
      y: 0,
      z: radius * Math.sin(angle)
    });
  }
  for (let i = 0; i < points; i++) {
    const outer1 = 2 + i * 2;
    const inner = 2 + (i * 2 + 1) % (points * 2);
    const outer2 = 2 + ((i + 1) * 2) % (points * 2);
    faces.push({ vertices: [0, outer1, inner] });
    faces.push({ vertices: [1, inner, outer1] });
    faces.push({ vertices: [0, inner, outer2] });
    faces.push({ vertices: [1, outer2, inner] });
  }
  builtInModels.star.vertices = vertices;
  builtInModels.star.faces = faces;
};

generateCube();
generatePyramid();
generateDiamond();
generateDonut();
generateStar();

const DEFAULT_BG = '#ff6600';
const DEFAULT_FG = '#ffffff';
const DEFAULT_SCALE = 25; // Increased from 15
const DEFAULT_ROTATION_X = 0.3;
const DEFAULT_ROTATION_Y = 0;
const DEFAULT_RESOLUTION = 1.0;
const WIDTH = 200; // Increased from 140
const HEIGHT = 80; // Increased from 60

export function AsciiViewer() {
  const [mode, setMode] = useState<'3d' | 'image'>('3d');
  const [selectedModel, setSelectedModel] = useState<string>('pyramid');
  const [rotationX, setRotationX] = useState(DEFAULT_ROTATION_X);
  const [rotationY, setRotationY] = useState(DEFAULT_ROTATION_Y);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [zoom, setZoom] = useState(1.0);
  const [resolution, setResolution] = useState(DEFAULT_RESOLUTION);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BG);
  const [foregroundColor, setForegroundColor] = useState(DEFAULT_FG);
  const [asciiPreset, setAsciiPreset] = useState<keyof typeof asciiPresets>('professional');
  const [uploadedModel, setUploadedModel] = useState<Model3D | null>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [gifFrames, setGifFrames] = useState<ImageData[]>([]);
  const [currentGifFrame, setCurrentGifFrame] = useState(0);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageOffsetX, setImageOffsetX] = useState(0);
  const [imageOffsetY, setImageOffsetY] = useState(0);
  const [imageOffsetZ, setImageOffsetZ] = useState(0);
  const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
  const [lightX, setLightX] = useState(0.3);
  const [lightY, setLightY] = useState(0.5);
  const [lightZ, setLightZ] = useState(1.0);
  const [lightIntensity, setLightIntensity] = useState(1.0);
  const canvasRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const gifImageRef = useRef<HTMLImageElement | null>(null);
  const gifAnimationRef = useRef<number | null>(null);
  const gifFrameIndexRef = useRef<number>(0);

  useEffect(() => {
    if (!autoRotate || isDragging || mode !== '3d') return;
    const interval = setInterval(() => {
      setRotationY(y => y + 0.03);
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging, mode]);

  useEffect(() => {
    if (mode === '3d') {
      renderModel();
    } else {
      renderImage();
    }
  }, [selectedModel, rotationX, rotationY, scale, uploadedModel, resolution, asciiPreset, mode, uploadedImage, zoom, lightX, lightY, lightZ, lightIntensity, imageRotation, currentGifFrame, gifFrames, imageOffsetX, imageOffsetY, imageOffsetZ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - dragStart.x) * 0.01;
    const deltaY = (e.clientY - dragStart.y) * 0.01;
    if (mode === '3d') {
      setRotationY(y => y + deltaX);
      setRotationX(x => Math.max(0, Math.min(Math.PI, x + deltaY)));
    } else {
      // Rotate image
      setImageRotation(prev => prev + deltaX);
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.01, Math.min(50, prev * delta)));
  };

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setLastPinchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDistance !== null) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / lastPinchDistance;
      setZoom(prev => Math.max(0.01, Math.min(50, prev * scale)));
      setLastPinchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setLastPinchDistance(null);
  };

  const rotatePoint = (p: Point3D, rx: number, ry: number): Point3D => {
    let y = p.y * Math.cos(rx) - p.z * Math.sin(rx);
    let z = p.y * Math.sin(rx) + p.z * Math.cos(rx);
    let x = p.x;
    const x2 = x * Math.cos(ry) - z * Math.sin(ry);
    const z2 = x * Math.sin(ry) + z * Math.cos(ry);
    return { x: x2, y, z: z2 };
  };

  const project = (p: Point3D): { x: number; y: number; z: number } => {
    const distance = 5;
    const scale3d = distance / (distance + p.z);
    const effectiveScale = scale * zoom;
    return {
      x: Math.floor(WIDTH / 2 + p.x * effectiveScale * scale3d),
      y: Math.floor(HEIGHT / 2 - p.y * effectiveScale * scale3d * 0.5),
      z: p.z
    };
  };

  const renderModel = () => {
    if (!canvasRef.current) return;
    const model = uploadedModel || builtInModels[selectedModel];
    if (!model || !model.vertices.length) return;

    // Apply resolution (subsample faces for lower detail)
    const faceStep = Math.max(1, Math.floor(1 / resolution));
    const filteredFaces = model.faces.filter((_, idx) => idx % faceStep === 0);

    const buffer: string[][] = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(' '));
    const zBuffer: number[][] = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(-Infinity));
    const shadeChars = asciiPresets[asciiPreset];

    const rotated = model.vertices.map(v => rotatePoint(v, rotationX, rotationY));
    const projected = rotated.map(v => project(v));

    const facesWithDepth = filteredFaces.map((face) => {
      const avgZ = face.vertices.reduce((sum, vi) => sum + rotated[vi].z, 0) / face.vertices.length;
      return { face, avgZ, rotatedVerts: face.vertices.map(vi => rotated[vi]) };
    }).sort((a, b) => a.avgZ - b.avgZ);

    // Customizable light source
    const lightDir = { x: lightX, y: lightY, z: lightZ };
    const lightLength = Math.sqrt(lightDir.x ** 2 + lightDir.y ** 2 + lightDir.z ** 2);
    const normalizedLight = {
      x: lightDir.x / lightLength,
      y: lightDir.y / lightLength,
      z: lightDir.z / lightLength
    };

    facesWithDepth.forEach(({ face, rotatedVerts }) => {
      if (face.vertices.length >= 3) {
        const v0 = rotatedVerts[0];
        const v1 = rotatedVerts[1];
        const v2 = rotatedVerts[2];
        const edge1 = { x: v1.x - v0.x, y: v1.y - v0.y, z: v1.z - v0.z };
        const edge2 = { x: v2.x - v0.x, y: v2.y - v0.y, z: v2.z - v0.z };
        const normal = {
          x: edge1.y * edge2.z - edge1.z * edge2.y,
          y: edge1.z * edge2.x - edge1.x * edge2.z,
          z: edge1.x * edge2.y - edge1.y * edge2.x
        };
        const normalLength = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
        if (normalLength > 0) {
          normal.x /= normalLength;
          normal.y /= normalLength;
          normal.z /= normalLength;
        }
        if (normal.z > 0) {
          // Custom light source calculation
          const dotProduct = normal.x * normalizedLight.x + normal.y * normalizedLight.y + normal.z * normalizedLight.z;
          const brightness = Math.max(0.1, Math.min(1, (dotProduct * lightIntensity + 0.1))); // Add base ambient
          
          // Improved brightness mapping with gamma correction for smoother gradients
          const gamma = 1.5;
          const adjustedBrightness = Math.pow(brightness, 1 / gamma);
          
          // Use more characters for smoother transitions
          const charIndex = Math.floor(adjustedBrightness * (shadeChars.length - 1));
          const shadeChar = shadeChars[Math.max(0, Math.min(shadeChars.length - 1, charIndex))];
          const projectedFace = face.vertices.map(vi => projected[vi]);
          fillPolygon(buffer, zBuffer, projectedFace, shadeChar, rotatedVerts);
        }
      }
    });

    const ascii = buffer.map(row => row.join('')).join('\n');
    canvasRef.current.textContent = ascii;
  };

  const fillPolygon = (
    buffer: string[][],
    zBuffer: number[][],
    points: { x: number; y: number; z: number }[],
    char: string,
    rotatedVerts: Point3D[]
  ) => {
    if (points.length < 3) return;
    let minY = Math.floor(Math.min(...points.map(p => p.y)));
    let maxY = Math.ceil(Math.max(...points.map(p => p.y)));
    let minX = Math.floor(Math.min(...points.map(p => p.x)));
    let maxX = Math.ceil(Math.max(...points.map(p => p.x)));
    minY = Math.max(0, minY);
    maxY = Math.min(HEIGHT - 1, maxY);
    minX = Math.max(0, minX);
    maxX = Math.min(WIDTH - 1, maxX);

    for (let y = minY; y <= maxY; y++) {
      const intersections: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
          const t = (y - p1.y) / (p2.y - p1.y);
          const x = p1.x + t * (p2.x - p1.x);
          intersections.push(x);
        }
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i < intersections.length; i += 2) {
        if (i + 1 < intersections.length) {
          const x1 = Math.ceil(intersections[i]);
          const x2 = Math.floor(intersections[i + 1]);
          for (let x = Math.max(minX, x1); x <= Math.min(maxX, x2); x++) {
            const avgZ = rotatedVerts.reduce((sum, v) => sum + v.z, 0) / rotatedVerts.length;
            if (avgZ > zBuffer[y][x]) {
              buffer[y][x] = char;
              zBuffer[y][x] = avgZ;
            }
          }
        }
      }
    }
  };

  const parseGLB = async (arrayBuffer: ArrayBuffer): Promise<{ vertices: Point3D[]; faces: Face[] } | null> => {
    try {
      const view = new DataView(arrayBuffer);
      
      // Read GLB header (12 bytes)
      const magic = view.getUint32(0, true);
      if (magic !== 0x46546C67) { // "glTF" in little-endian
        return null;
      }
      
      const version = view.getUint32(4, true);
      const length = view.getUint32(8, true);
      
      let offset = 12;
      let jsonChunk: any = null;
      let binaryChunk: ArrayBuffer | null = null;
      
      // Read chunks
      while (offset < length) {
        const chunkLength = view.getUint32(offset, true);
        offset += 4;
        const chunkType = view.getUint32(offset, true);
        offset += 4;
        
        if (chunkType === 0x4E4F534A) { // "JSON"
          const jsonText = new TextDecoder().decode(
            arrayBuffer.slice(offset, offset + chunkLength)
          );
          jsonChunk = JSON.parse(jsonText);
        } else if (chunkType === 0x004E4942) { // "BIN "
          binaryChunk = arrayBuffer.slice(offset, offset + chunkLength);
        }
        
        offset += chunkLength;
      }
      
      if (!jsonChunk || !jsonChunk.meshes || jsonChunk.meshes.length === 0) {
        return null;
      }
      
      const vertices: Point3D[] = [];
      const faces: Face[] = [];
      
      // Process first mesh
      const mesh = jsonChunk.meshes[0];
      const primitive = mesh.primitives?.[0];
      if (!primitive || !binaryChunk) {
        return null;
      }
      
      // Get accessors
      const positionAccessor = jsonChunk.accessors[primitive.attributes.POSITION];
      const indicesAccessor = primitive.indices !== undefined 
        ? jsonChunk.accessors[primitive.indices] 
        : null;
      
      if (!positionAccessor) return null;
      
      // Get buffer views
      const positionBufferView = jsonChunk.bufferViews[positionAccessor.bufferView];
      const indicesBufferView = indicesAccessor 
        ? jsonChunk.bufferViews[indicesAccessor.bufferView] 
        : null;
      
      if (!binaryChunk) return null;
      const binaryView = new DataView(binaryChunk);
      
      // Read vertices
      const posOffset = positionBufferView.byteOffset || 0;
      const posStride = positionAccessor.byteStride || 12;
      const posCount = positionAccessor.count;
      
      for (let i = 0; i < posCount; i++) {
        const byteOffset = posOffset + (i * posStride);
        const x = binaryView.getFloat32(byteOffset, true);
        const y = binaryView.getFloat32(byteOffset + 4, true);
        const z = binaryView.getFloat32(byteOffset + 8, true);
        vertices.push({ x, y, z });
      }
      
      // Read indices
      if (indicesAccessor && indicesBufferView) {
        const idxOffset = indicesBufferView.byteOffset || 0;
        const idxCount = indicesAccessor.count;
        const componentType = indicesAccessor.componentType;
        
        const getIndex = (index: number) => {
          let byteOffset = idxOffset;
          if (componentType === 5123) { // UNSIGNED_SHORT (2 bytes)
            byteOffset += index * 2;
            return binaryView.getUint16(byteOffset, true);
          } else if (componentType === 5125) { // UNSIGNED_INT (4 bytes)
            byteOffset += index * 4;
            return binaryView.getUint32(byteOffset, true);
          } else if (componentType === 5121) { // UNSIGNED_BYTE (1 byte)
            byteOffset += index;
            return binaryView.getUint8(byteOffset);
          }
          return 0;
        };
        
        for (let i = 0; i < idxCount; i += 3) {
          if (i + 2 < idxCount) {
            const i0 = getIndex(i);
            const i1 = getIndex(i + 1);
            const i2 = getIndex(i + 2);
            faces.push({ vertices: [i0, i1, i2] });
          }
        }
      } else {
        // No indices, create faces from vertices (triangles)
        for (let i = 0; i < vertices.length; i += 3) {
          if (i + 2 < vertices.length) {
            faces.push({ vertices: [i, i + 1, i + 2] });
          }
        }
      }
      
      return { vertices, faces };
    } catch (error) {
      console.error('GLB parsing error:', error);
      return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.obj')) {
      const text = await file.text();
    const vertices: Point3D[] = [];
    const faces: Face[] = [];
    const lines = text.split('\n');
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts[0] === 'v') {
        vertices.push({
          x: parseFloat(parts[1]),
          y: parseFloat(parts[2]),
          z: parseFloat(parts[3])
        });
      } else if (parts[0] === 'f') {
        const faceVertices = parts.slice(1).map(p => {
          const idx = parseInt(p.split('/')[0]);
            return idx - 1;
        });
        faces.push({ vertices: faceVertices });
      }
    }
    if (vertices.length > 0) {
      setUploadedModel({ name: 'Uploaded Model', vertices, faces });
      setSelectedModel('uploaded');
        setMode('3d');
      }
    } else if (fileName.endsWith('.glb')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await parseGLB(arrayBuffer);
      if (result && result.vertices.length > 0) {
        setUploadedModel({ name: 'Uploaded Model', vertices: result.vertices, faces: result.faces });
        setSelectedModel('uploaded');
        setMode('3d');
      } else {
        alert('Failed to parse GLB file. Please ensure it contains mesh data.');
      }
    }
  };

  const extractGifFrames = async (file: File): Promise<ImageData[]> => {
    return new Promise((resolve) => {
      const frames: ImageData[] = [];
      const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve([]);
        return;
      }
      
      // Create img element to play the GIF (needs to be in DOM to animate)
      const hiddenImg = document.createElement('img');
      const url = URL.createObjectURL(file);
      hiddenImg.src = url;
      hiddenImg.style.position = 'fixed';
      hiddenImg.style.top = '0';
      hiddenImg.style.left = '0';
      hiddenImg.style.width = '1px';
      hiddenImg.style.height = '1px';
      hiddenImg.style.opacity = '0';
      hiddenImg.style.pointerEvents = 'none';
      hiddenImg.style.zIndex = '-9999';
      document.body.appendChild(hiddenImg);
      
      let animationFrameId: number;
      let isCapturing = true;
      
      hiddenImg.onload = () => {
        canvas.width = hiddenImg.naturalWidth || hiddenImg.width;
        canvas.height = hiddenImg.naturalHeight || hiddenImg.height;
        
        if (canvas.width === 0 || canvas.height === 0) {
          document.body.removeChild(hiddenImg);
          URL.revokeObjectURL(url);
          resolve([]);
          return;
        }
        
        let lastFrameHash = '';
        let frameCount = 0;
        let uniqueFrames = 0;
        const maxIterations = 1000;
        const maxUniqueFrames = 200;
        
        const captureFrame = () => {
          if (!isCapturing) return;
          
          try {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(hiddenImg, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Create a simple hash from a sample of pixels
            let hash = '';
            const sampleSize = Math.min(100, imageData.data.length / 4);
            for (let i = 0; i < sampleSize; i++) {
              const idx = i * 4;
              hash += `${imageData.data[idx]},${imageData.data[idx + 1]},${imageData.data[idx + 2]};`;
            }
            
            // Only add if frame changed
            if (hash !== lastFrameHash) {
              // Clone the ImageData
              const clonedData = new ImageData(
                new Uint8ClampedArray(imageData.data),
                imageData.width,
                imageData.height
              );
              frames.push(clonedData);
              lastFrameHash = hash;
              uniqueFrames++;
            }
            
            frameCount++;
            
            // Continue capturing - use requestAnimationFrame for better sync with GIF animation
            if (frameCount < maxIterations && uniqueFrames < maxUniqueFrames && isCapturing) {
              animationFrameId = requestAnimationFrame(captureFrame);
            } else {
              isCapturing = false;
              // Cleanup
              if (document.body.contains(hiddenImg)) {
                document.body.removeChild(hiddenImg);
              }
              URL.revokeObjectURL(url);
              
              // Ensure we have at least one frame
              if (frames.length === 0) {
                frames.push(imageData);
              }
              
              resolve(frames);
            }
          } catch (e) {
            console.error('Error capturing GIF frame:', e);
            isCapturing = false;
            if (document.body.contains(hiddenImg)) {
              document.body.removeChild(hiddenImg);
            }
            URL.revokeObjectURL(url);
            resolve(frames.length > 0 ? frames : []);
          }
        };
        
        // Start capturing after GIF loads - wait a bit for animation to start
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(captureFrame);
        }, 500);
      };
      
      hiddenImg.onerror = () => {
        isCapturing = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (document.body.contains(hiddenImg)) {
          document.body.removeChild(hiddenImg);
        }
        URL.revokeObjectURL(url);
        resolve([]);
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.gif')) {
      const isGif = file.name.toLowerCase().endsWith('.gif');
      
      if (isGif) {
        try {
          // Extract GIF frames
          const frames = await extractGifFrames(file);
          if (frames.length > 0) {
            console.log(`Extracted ${frames.length} GIF frames`);
            setGifFrames(frames);
            gifFrameIndexRef.current = 0;
            setCurrentGifFrame(0);
            setMode('image');
            
            // Animate through frames
            if (gifAnimationRef.current) {
              clearInterval(gifAnimationRef.current);
            }
            
            // Use a fixed delay for smoother animation (around 10fps)
            const frameDelay = 100; // 100ms = 10fps
            gifAnimationRef.current = window.setInterval(() => {
              if (frames.length > 1) {
                gifFrameIndexRef.current = (gifFrameIndexRef.current + 1) % frames.length;
                setCurrentGifFrame(gifFrameIndexRef.current);
              }
            }, frameDelay);
            
            console.log(`Started GIF animation with ${frames.length} frames`);
          } else {
            alert('Failed to extract GIF frames. Trying as regular image...');
            // Fallback to regular image
            const img = new Image();
            img.onload = () => {
              setUploadedImage(img);
              setGifFrames([]);
              setCurrentGifFrame(0);
              setMode('image');
            };
            img.src = URL.createObjectURL(file);
          }
        } catch (error) {
          console.error('GIF extraction error:', error);
          alert('Error processing GIF. Please try a different file.');
        }
      } else {
        // Regular image
        const img = new Image();
        img.onload = () => {
          setUploadedImage(img);
          setGifFrames([]);
          setCurrentGifFrame(0);
          setMode('image');
          if (gifAnimationRef.current) {
            clearInterval(gifAnimationRef.current);
            gifAnimationRef.current = null;
          }
        };
        img.onerror = () => {
          alert('Failed to load image. Please try a different file.');
        };
        img.src = URL.createObjectURL(file);
      }
    }
  };

  const renderImage = () => {
    if (!canvasRef.current) return;
    
    // Use GIF frame if available, otherwise use regular image
    const hasGifFrames = gifFrames.length > 0;
    if (!uploadedImage && !hasGifFrames) return;
    
    const shadeChars = asciiPresets[asciiPreset];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let sourceImageData: ImageData | null = null;
    let sourceWidth = 0;
    let sourceHeight = 0;
    
    if (hasGifFrames && gifFrames[currentGifFrame]) {
      // Use current GIF frame
      sourceImageData = gifFrames[currentGifFrame];
      sourceWidth = sourceImageData.width;
      sourceHeight = sourceImageData.height;
    } else if (uploadedImage) {
      // Use regular image
      sourceWidth = uploadedImage.naturalWidth || uploadedImage.width;
      sourceHeight = uploadedImage.naturalHeight || uploadedImage.height;
    }
    
    if ((!sourceImageData && !uploadedImage) || sourceWidth === 0 || sourceHeight === 0) return;
    
    // Calculate source region based on zoom, maintaining image aspect ratio
    const imageAspectRatio = sourceWidth / sourceHeight;
    const outputAspectRatio = WIDTH / HEIGHT;
    
    // Apply zoom offset (imageOffsetZ affects zoom level)
    const effectiveZoom = zoom * (1 + imageOffsetZ * 0.1);
    
    // Calculate the source region dimensions
    let regionWidth = sourceWidth / effectiveZoom;
    let regionHeight = sourceHeight / effectiveZoom;
    
    // Clamp to source dimensions
    regionWidth = Math.min(regionWidth, sourceWidth);
    regionHeight = Math.min(regionHeight, sourceHeight);
    
    // Maintain the image's aspect ratio, not force output aspect ratio
    // Fit the region to maintain image aspect ratio while fitting in output
    let outputWidth = WIDTH;
    let outputHeight = HEIGHT;
    
    if (imageAspectRatio > outputAspectRatio) {
      // Image is wider - fit to width
      outputHeight = WIDTH / imageAspectRatio;
            } else {
      // Image is taller - fit to height
      outputWidth = HEIGHT * imageAspectRatio;
    }
    
    // Apply position offsets to source region
    const baseSourceX = (sourceWidth - regionWidth) / 2;
    const baseSourceY = (sourceHeight - regionHeight) / 2;
    
    // Offset affects which part of the image we're viewing
    const offsetScale = Math.max(regionWidth, regionHeight) * 0.1;
    const sourceX = Math.max(0, Math.min(sourceWidth - regionWidth, baseSourceX - imageOffsetX * offsetScale));
    const sourceY = Math.max(0, Math.min(sourceHeight - regionHeight, baseSourceY - imageOffsetY * offsetScale));
    
    // Render at calculated output dimensions (maintaining aspect ratio)
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    // Clear with background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Apply rotation
    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.rotate(imageRotation);
    ctx.translate(-WIDTH / 2, -HEIGHT / 2);
    
    // Apply position offsets
    const drawX = (WIDTH - outputWidth) / 2 + imageOffsetX;
    const drawY = (HEIGHT - outputHeight) / 2 + imageOffsetY;
    
    if (hasGifFrames && sourceImageData) {
      // Draw from ImageData
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = sourceWidth;
      tempCanvas.height = sourceHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.putImageData(sourceImageData, 0, 0);
        ctx.drawImage(
          tempCanvas,
          sourceX, sourceY, regionWidth, regionHeight,
          drawX, drawY, outputWidth, outputHeight
        );
      }
    } else if (uploadedImage) {
      // Draw from Image element
      ctx.drawImage(
        uploadedImage,
        sourceX, sourceY, regionWidth, regionHeight,
        drawX, drawY, outputWidth, outputHeight
      );
    }
    
    ctx.restore();
    
    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    const data = imageData.data;
    
    const buffer: string[][] = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(' '));
    
    // Direct 1:1 mapping since canvas is already at ASCII dimensions
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const idx = (y * WIDTH + x) * 4;
        
        // Get RGB values
        const r = data[idx] || 0;
        const g = data[idx + 1] || 0;
        const b = data[idx + 2] || 0;
        
        // Calculate brightness (luminance)
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Map to ASCII character
        const charIndex = Math.floor(brightness * (shadeChars.length - 1));
        buffer[y][x] = shadeChars[charIndex];
      }
    }
    
    const ascii = buffer.map(row => row.join('')).join('\n');
    canvasRef.current.textContent = ascii;
  };

  const resetToDefaults = () => {
    setBackgroundColor(DEFAULT_BG);
    setForegroundColor(DEFAULT_FG);
    setScale(DEFAULT_SCALE);
    setZoom(1.0);
    setRotationX(DEFAULT_ROTATION_X);
    setRotationY(DEFAULT_ROTATION_Y);
    setImageRotation(0);
    setImageOffsetX(0);
    setImageOffsetY(0);
    setImageOffsetZ(0);
    setResolution(DEFAULT_RESOLUTION);
    setAsciiPreset('professional');
    setAutoRotate(true);
    setLightX(0.3);
    setLightY(0.5);
    setLightZ(1.0);
    setLightIntensity(1.0);
  };

  // Cleanup GIF animation on unmount
  useEffect(() => {
    return () => {
      if (gifAnimationRef.current) {
        clearInterval(gifAnimationRef.current);
      }
    };
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          {/* Main viewport */}
          <div 
            ref={containerRef}
            className="rounded-lg border-2 p-4 flex items-center justify-center min-h-[500px] cursor-grab active:cursor-grabbing"
            style={{ borderColor: foregroundColor + '40' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
              <pre
                ref={canvasRef}
              className="font-mono leading-tight select-none"
                style={{ 
                  fontFamily: 'Courier New, monospace',
                fontSize: '7px',
                letterSpacing: '0.01em',
                  color: foregroundColor,
                lineHeight: '7px'
              }}
            />
          </div>

          {/* Minimal control panel - scrollable */}
          <div className="space-y-3 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2">
            {/* Mode Toggle */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="mb-2 text-sm font-medium" style={{ color: foregroundColor }}>Mode</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                  onClick={() => setMode('3d')}
                  className="px-3 py-2 rounded text-xs transition-all"
                    style={{
                    backgroundColor: mode === '3d' ? foregroundColor : 'rgba(255,255,255,0.1)',
                    color: mode === '3d' ? backgroundColor : foregroundColor,
                    border: `1px solid ${foregroundColor}30`
                  }}
                >
                  3D Model
                  </button>
                  <button
                  onClick={() => setMode('image')}
                  className="px-3 py-2 rounded text-xs transition-all"
                    style={{
                    backgroundColor: mode === 'image' ? foregroundColor : 'rgba(255,255,255,0.1)',
                    color: mode === 'image' ? backgroundColor : foregroundColor,
                    border: `1px solid ${foregroundColor}30`
                  }}
                >
                  Image
                  </button>
                </div>
              </div>
              
            {/* Models */}
            {mode === '3d' && (
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="mb-2 text-sm font-medium" style={{ color: foregroundColor }}>Models</h3>
              <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(builtInModels).map(([key, model]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedModel(key);
                        setUploadedModel(null);
                      }}
                    className="px-2 py-1.5 rounded text-xs transition-all"
                      style={{
                        backgroundColor: selectedModel === key && !uploadedModel ? foregroundColor : 'rgba(255,255,255,0.1)',
                        color: selectedModel === key && !uploadedModel ? backgroundColor : foregroundColor,
                      border: `1px solid ${foregroundColor}30`
                      }}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".obj,.glb"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                className="w-full mt-2 px-3 py-2 rounded flex items-center justify-center gap-2 text-xs transition-all"
                  style={{
                    backgroundColor: uploadedModel ? foregroundColor : 'rgba(255,255,255,0.1)',
                    color: uploadedModel ? backgroundColor : foregroundColor,
                  border: `1px solid ${foregroundColor}30`
                  }}
                >
                <Upload size={14} />
                {uploadedModel ? 'Loaded' : 'Upload OBJ/GLB'}
                </button>
              </div>
            )}

            {/* Image Upload */}
            {mode === 'image' && (
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="mb-2 text-sm font-medium" style={{ color: foregroundColor }}>Image</h3>
                  <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*,.gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full px-3 py-2 rounded flex items-center justify-center gap-2 text-xs transition-all"
                  style={{
                    backgroundColor: uploadedImage ? foregroundColor : 'rgba(255,255,255,0.1)',
                    color: uploadedImage ? backgroundColor : foregroundColor,
                    border: `1px solid ${foregroundColor}30`
                  }}
                >
                  <Upload size={14} />
                  {uploadedImage ? 'Image Loaded' : 'Upload Image'}
                </button>
              </div>
            )}

            {/* Controls */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs" style={{ color: foregroundColor }}>Zoom</label>
                  <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{(zoom * 100).toFixed(0)}%</span>
                </div>
                  <input
                  type="range"
                  min="0.01"
                  max="50"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5"
                />
                <p className="text-[10px] opacity-75 mt-1" style={{ color: foregroundColor }}>Scroll or pinch to zoom</p>
              </div>

              {mode === 'image' && (
                <div className="pt-2 border-t" style={{ borderColor: `${foregroundColor}30` }}>
                  <h4 className="text-xs font-medium mb-2" style={{ color: foregroundColor }}>Image Position</h4>
                  <div className="space-y-2">
              <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs" style={{ color: foregroundColor }}>Position X</label>
                        <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{imageOffsetX.toFixed(1)}</span>
                      </div>
                <input
                  type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={imageOffsetX}
                        onChange={(e) => setImageOffsetX(parseFloat(e.target.value))}
                        className="w-full h-1.5"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs" style={{ color: foregroundColor }}>Position Y</label>
                        <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{imageOffsetY.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={imageOffsetY}
                        onChange={(e) => setImageOffsetY(parseFloat(e.target.value))}
                        className="w-full h-1.5"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs" style={{ color: foregroundColor }}>Position Z (Zoom)</label>
                        <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{imageOffsetZ.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                  step="0.1"
                        value={imageOffsetZ}
                        onChange={(e) => setImageOffsetZ(parseFloat(e.target.value))}
                        className="w-full h-1.5"
                />
              </div>
                  </div>
                </div>
              )}

              {mode === '3d' && (
                <>
              <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs" style={{ color: foregroundColor }}>Resolution</label>
                      <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{(resolution * 100).toFixed(0)}%</span>
                    </div>
                <input
                  type="range"
                      min="0.1"
                      max="1"
                  step="0.1"
                      value={resolution}
                      onChange={(e) => setResolution(parseFloat(e.target.value))}
                      className="w-full h-1.5"
                />
              </div>

              <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs" style={{ color: foregroundColor }}>Scale</label>
                      <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{scale}</span>
                    </div>
                <input
                  type="range"
                      min="10"
                      max="50"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                      className="w-full h-1.5"
                />
              </div>

                  <div className="pt-2 border-t" style={{ borderColor: `${foregroundColor}30` }}>
                    <h4 className="text-xs font-medium mb-2" style={{ color: foregroundColor }}>Light Source</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs" style={{ color: foregroundColor }}>Light X</label>
                          <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{lightX.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={lightX}
                          onChange={(e) => setLightX(parseFloat(e.target.value))}
                          className="w-full h-1.5"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs" style={{ color: foregroundColor }}>Light Y</label>
                          <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{lightY.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={lightY}
                          onChange={(e) => setLightY(parseFloat(e.target.value))}
                          className="w-full h-1.5"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs" style={{ color: foregroundColor }}>Light Z</label>
                          <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{lightZ.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={lightZ}
                          onChange={(e) => setLightZ(parseFloat(e.target.value))}
                          className="w-full h-1.5"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs" style={{ color: foregroundColor }}>Intensity</label>
                          <span className="text-xs opacity-75" style={{ color: foregroundColor }}>{lightIntensity.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={lightIntensity}
                          onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                          className="w-full h-1.5"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {mode === '3d' && (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: foregroundColor }}>
                    <input
                      type="checkbox"
                      checked={autoRotate}
                      onChange={(e) => setAutoRotate(e.target.checked)}
                      className="w-4 h-4"
                    />
                    Auto Rotate
                  </label>
                </div>
              )}

              <div>
                <label className="text-xs mb-1 block" style={{ color: foregroundColor }}>ASCII Preset</label>
                <select
                  value={asciiPreset}
                  onChange={(e) => setAsciiPreset(e.target.value as keyof typeof asciiPresets)}
                  className="w-full px-2 py-1.5 rounded text-xs"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: foregroundColor,
                    border: `1px solid ${foregroundColor}30`
                  }}
                >
                  {Object.keys(asciiPresets).map(key => (
                    <option key={key} value={key} style={{ backgroundColor, color: foregroundColor }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                  <div>
                  <label className="text-xs mb-1 block" style={{ color: foregroundColor }}>Background</label>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                  <div>
                  <label className="text-xs mb-1 block" style={{ color: foregroundColor }}>Foreground</label>
                      <input
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                      <button
                onClick={resetToDefaults}
                className="w-full px-3 py-2 rounded flex items-center justify-center gap-2 text-xs transition-all"
                        style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: foregroundColor,
                  border: `1px solid ${foregroundColor}30`
                }}
              >
                <RefreshCw size={14} />
                Reset
                      </button>
            </div>

            {/* Info */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 text-xs" style={{ color: foregroundColor }}>
              <div className="opacity-75 space-y-0.5">
                <p>Vertices: {(uploadedModel || builtInModels[selectedModel])?.vertices.length || 0}</p>
                <p>Faces: {(uploadedModel || builtInModels[selectedModel])?.faces.length || 0}</p>
                <p className="pt-2 text-[10px]">Drag to rotate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
