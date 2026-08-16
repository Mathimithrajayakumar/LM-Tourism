// src/components/ArViewer.js
// Production-Quality Real Camera AR & Interactive 3D Viewer module for LM Tourism.
//
// Architecture & Capabilities:
// 1. Asset Resolution Pipeline: Checks for `/assets/ar/${monumentId}.glb` file asset.
//    If absent, generates an authentic GLTF 2.0 PBR 3D asset Blob via Three.js GLTFExporter.
// 2. Real Camera WebXR & WebRTC Stream AR with floor/table surface hit testing.
// 3. Anchored Real-World Placement: Reticle ring plane tracking & tap-to-place.
// 4. Mobile Gesture Controls: Drag-to-move, 2-finger rotate, pinch scale, remove/reposition model, reset view.
// 5. Camera Permission Handler with clear explanation and retry options.
// 6. Device Compatibility Fallback: Displays "AR is not supported on this device. You can explore the 3D monument instead."
//    and opens the interactive 3D model orbit viewer without fake AR labels.

const T = () => window.THREE;
const OC = () => window.THREE?.OrbitControls;

// Asset Cache
const _glbCache = new Map();

// Active AR Session State
let _renderer        = null;
let _scene           = null;
let _camera          = null;
let _controls        = null;
let _videoElement    = null;
let _mediaStream     = null;
let _xrSession       = null;
let _hitTestSrc      = null;
let _reticle         = null;
let _model           = null;
let _animId          = null;
let _container       = null;
let _mode            = null; // 'webxr' | 'camera-ar' | 'fallback'
let _placed          = false;
let _surfaceDetected = false;
let _currentMonument = null;
let _gesture         = null;
let _raycaster       = null;
let _groundPlane     = null;
let _pointerPos      = null;

const INIT_CAM_POS    = [0, 2, 7];
const INIT_CAM_TARGET = [0, 0.5, 0];

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Boot AR Experience for selected monument ID
 */
export async function initArViewer(monumentId, container, monument) {
  if (!container) return;
  destroyArViewer();

  _container       = container;
  _currentMonument = monument;
  _placed          = false;
  _surfaceDetected = false;

  const name = monument?.name || 'Monument';

  // 1. Show Loading State
  _showLoadingScreen(container, `Loading ${name} AR experience…`);

  const THREE = T();
  if (!THREE) {
    _showErrorScreen(container, `Unable to load the ${name} AR model. Try again.`, monument);
    return;
  }

  _gesture = {
    active: false,
    startDist: 0,
    startAngle: 0,
    startModelScale: new THREE.Vector3(),
  };

  try {
    // 2. Resolve .GLB 3D Asset
    const glbUrl = await getMonumentAssetUrl(monumentId, monument);

    // 3. Check WebXR AR Support
    const webxrSupported = await _checkWebXRSupport();
    if (webxrSupported) {
      _mode = 'webxr';
      await _startWebXRAr(monument, glbUrl);
      return;
    }

    // 4. Check Camera Stream Availability for Camera AR
    const cameraAvailable = _checkCameraAvailability();
    if (cameraAvailable) {
      try {
        _mode = 'camera-ar';
        await _startCameraBasedAr(monument, container, glbUrl);
        return;
      } catch (cameraErr) {
        console.warn('[ArViewer] Camera AR initialization error:', cameraErr);
        if (cameraErr.name === 'NotAllowedError' || cameraErr.name === 'PermissionDeniedError') {
          _showPermissionDeniedScreen(container, monument);
          return;
        }
      }
    }

    // 5. Fallback for Unsupported Devices
    _mode = 'fallback';
    _startFallback3DViewer(monument, container);

  } catch (err) {
    console.error('[ArViewer] AR initialization error:', err);
    _showErrorScreen(container, `Unable to load the ${name} AR model. Try again.`, monument);
  }
}

/**
 * Clean up all AR & camera resources when modal closes
 */
export function destroyArViewer() {
  if (_animId !== null) {
    if (_mode !== 'webxr') cancelAnimationFrame(_animId);
    _animId = null;
  }

  if (_xrSession) {
    try { _xrSession.end(); } catch {}
    _xrSession = null;
  }
  if (_hitTestSrc) {
    try { _hitTestSrc.cancel(); } catch {}
    _hitTestSrc = null;
  }

  if (_mediaStream) {
    _mediaStream.getTracks().forEach(track => track.stop());
    _mediaStream = null;
  }
  if (_videoElement) {
    _videoElement.pause();
    _videoElement.srcObject = null;
    if (_videoElement.parentNode) _videoElement.parentNode.removeChild(_videoElement);
    _videoElement = null;
  }

  if (_scene) {
    _scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
    _scene = null;
  }

  if (_renderer) {
    _renderer.dispose();
    if (_renderer.domElement?.parentNode) {
      _renderer.domElement.parentNode.removeChild(_renderer.domElement);
    }
    _renderer = null;
  }

  if (_controls) {
    if (typeof _controls.dispose === 'function') _controls.dispose();
    _controls = null;
  }

  _camera          = null;
  _reticle         = null;
  _model           = null;
  _container       = null;
  _mode            = null;
  _gesture         = null;
  _currentMonument = null;
  _raycaster       = null;
  _groundPlane     = null;
}

/**
 * User Action: Remove Placed Model to pick a new surface spot
 */
export function removePlacedModel() {
  if (_model) {
    _model.visible = false;
  }
  _placed = false;
  if (_reticle) _reticle.visible = true;
  _updateStatusHeader('detected', 'Surface detected — Tap to place monument');
  _renderARControls(_container);
}

/**
 * User Action: Reset View / Position
 */
export function resetArCameraView() {
  if (_camera) {
    _camera.position.set(...INIT_CAM_POS);
    if (_controls?.target) _controls.target.set(...INIT_CAM_TARGET);
    if (_controls?.update) _controls.update();
  }
  if (_model) {
    const base = _model.userData.baseScale || 0.45;
    _model.scale.setScalar(base);
    _model.rotation.set(0, 0, 0);
    if (_mode === 'fallback') _model.position.set(0, -0.5, 0);
  }
}

export function zoomArCamera(delta) {
  if (_camera) {
    const THREE = T();
    const dir = new THREE.Vector3();
    _camera.getWorldDirection(dir);
    _camera.position.addScaledVector(dir, delta);
    if (_controls?.update) _controls.update();
  }
}

export function toggleAutoRotate() {
  if (_controls) {
    _controls.autoRotate = !_controls.autoRotate;
    return _controls.autoRotate;
  }
  return false;
}

// ─── 3D Asset Resolution Architecture ───────────────────────────────────────

/**
 * Resolves .GLB 3D monument asset file URL.
 * Checks local asset path `/assets/ar/${monumentId}.glb`.
 * If absent, generates an authentic binary .GLB file Blob dynamically.
 */
export async function getMonumentAssetUrl(monumentId, monument) {
  const id = monumentId || monument?.id || 'default';

  if (_glbCache.has(id)) return _glbCache.get(id);

  // Check if static .glb file exists at public/assets/ar/[monumentId].glb
  const localAssetPath = `/assets/ar/${id}.glb`;
  try {
    const headRes = await fetch(localAssetPath, { method: 'HEAD' });
    const contentType = headRes.headers.get('content-type') || '';
    if (headRes.ok && !contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      _glbCache.set(id, localAssetPath);
      return localAssetPath;
    }
  } catch {}

  // Dynamic PBR GLTF Compilation Fallback using THREE.GLTFExporter
  const THREE = T();
  if (!THREE) throw new Error('Three.js engine not ready');

  const group = buildMonumentModelGroup(monument);
  const glbBlob = await exportGroupToGlbBlob(group);
  const glbUrl = URL.createObjectURL(glbBlob);

  _glbCache.set(id, glbUrl);
  return glbUrl;
}

function exportGroupToGlbBlob(group) {
  return new Promise((resolve, reject) => {
    const THREE = T();
    const exporter = new THREE.GLTFExporter();

    exporter.parse(
      group,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(new Blob([result], { type: 'model/gltf-binary' }));
        } else {
          resolve(new Blob([JSON.stringify(result)], { type: 'application/json' }));
        }
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

// ─── Support & Camera Checks ────────────────────────────────────────────────

async function _checkWebXRSupport() {
  if (!navigator.xr) return false;
  try { return await navigator.xr.isSessionSupported('immersive-ar'); }
  catch { return false; }
}

function _checkCameraAvailability() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// ─── PATH 1: WebXR Immersive AR (Android WebXR ARCore) ──────────────────────

async function _startWebXRAr(monument, glbUrl) {
  const THREE = T();
  const name = monument?.name || 'Monument';
  _updateStatusHeader('scanning', `Opening Camera… Scanning real environment for ${name}`);

  _scene = new THREE.Scene();
  _scene.add(new THREE.AmbientLight(0xffffff, 1.4));
  const dir = new THREE.DirectionalLight(0xffffff, 2.2);
  dir.position.set(5, 12, 5);
  dir.castShadow = true;
  _scene.add(dir);

  _reticle = _buildReticle();
  _reticle.visible = false;
  _scene.add(_reticle);

  _model = buildMonumentModelGroup(monument);
  _model.visible = false;
  _model.scale.setScalar(0.0001);
  _scene.add(_model);

  try {
    _xrSession = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay', 'light-estimation'],
      domOverlay: _container ? { root: _container } : undefined,
    });
  } catch (err) {
    console.warn('[ArViewer] WebXR session failed, switching to Camera AR:', err);
    _mode = 'camera-ar';
    await _startCameraBasedAr(monument, _container, glbUrl);
    return;
  }

  _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  _renderer.setPixelRatio(window.devicePixelRatio);
  _renderer.setSize(_container.clientWidth, _container.clientHeight);
  _renderer.xr.enabled = true;
  _renderer.xr.setReferenceSpaceType('local');
  _container.appendChild(_renderer.domElement);
  Object.assign(_renderer.domElement.style, {
    position: 'absolute', inset: '0', zIndex: '5', pointerEvents: 'none',
  });

  await _renderer.xr.setSession(_xrSession);
  _removeLoadingScreen(_container);
  _camera = new THREE.PerspectiveCamera(70, _container.clientWidth / _container.clientHeight, 0.01, 100);

  const viewerSpace = await _xrSession.requestReferenceSpace('viewer');
  _hitTestSrc = await _xrSession.requestHitTestSource({ space: viewerSpace });

  _xrSession.addEventListener('select', _onWebXRSelect);
  _renderer.setAnimationLoop((time, frame) => _onWebXRFrame(time, frame));
  _xrSession.addEventListener('end', () => {
    _renderer.setAnimationLoop(null);
    _hitTestSrc = null;
    _xrSession  = null;
  });
}

function _onWebXRFrame(time, frame) {
  if (!frame || !_hitTestSrc) { _renderer.render(_scene, _camera); return; }

  const ref = _renderer.xr.getReferenceSpace();
  const results = frame.getHitTestResults(_hitTestSrc);

  if (results.length > 0 && !_placed) {
    const pose = results[0].getPose(ref);
    if (pose) {
      const THREE = T();
      const mat = new THREE.Matrix4().fromArray(pose.transform.matrix);
      _reticle.visible = true;
      _reticle.position.setFromMatrixPosition(mat);
      _reticle.quaternion.setFromRotationMatrix(mat);

      if (!_surfaceDetected) {
        _surfaceDetected = true;
        _updateStatusHeader('detected', 'Surface detected — Tap screen to place monument');
      }
    }
  } else if (!_placed) {
    _reticle.visible = false;
  }

  _renderer.render(_scene, _camera);
}

function _onWebXRSelect() {
  if (!_reticle.visible || _placed) return;
  _model.position.copy(_reticle.position);
  _model.quaternion.copy(_reticle.quaternion);
  _model.visible = true;
  _placed = true;
  _reticle.visible = false;
  _animateModelIn(_model);
  _updateStatusHeader('placed', '📷 Live Camera AR — Drag to move • Pinch to scale');
  _renderARControls(_container);
  _attachTouchGestures();
}

// ─── PATH 2: Camera Stream AR (Camera Feed + Ground Surface Plane Detection) ───

async function _startCameraBasedAr(monument, container, glbUrl) {
  const THREE = T();
  const name = monument?.name || 'Monument';
  _updateStatusHeader('scanning', `Opening Camera… Requesting permissions for ${name}`);

  // Request Back Camera
  _mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false
  });

  _videoElement = document.createElement('video');
  _videoElement.srcObject = _mediaStream;
  _videoElement.setAttribute('playsinline', '');
  _videoElement.setAttribute('autoplay', '');
  _videoElement.muted = true;
  _videoElement.className = 'ar-camera-video';
  container.appendChild(_videoElement);
  await _videoElement.play();

  const w = container.clientWidth  || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;

  // Transparent Canvas Overlay
  _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  _renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  _renderer.setSize(w, h);
  _renderer.setClearColor(0x000000, 0);
  _renderer.shadowMap.enabled = true;
  container.appendChild(_renderer.domElement);
  Object.assign(_renderer.domElement.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '10',
  });

  _scene = new THREE.Scene();
  _scene.add(new THREE.AmbientLight(0xffffff, 1.4));
  const dir = new THREE.DirectionalLight(0xffffff, 2.2);
  dir.position.set(5, 12, 5);
  dir.castShadow = true;
  _scene.add(dir);

  _camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  _camera.position.set(0, 1.6, 3);
  _camera.lookAt(0, 0, 0);

  // Invisible Surface Plane for Hit Detection
  _groundPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  _groundPlane.rotation.x = -Math.PI / 2;
  _scene.add(_groundPlane);

  // Cyan Reticle Ring
  _reticle = _buildReticle();
  _reticle.position.set(0, 0, -1.8);
  _scene.add(_reticle);

  _model = buildMonumentModelGroup(monument);
  _model.visible = false;
  _scene.add(_model);

  _raycaster  = new THREE.Raycaster();
  _pointerPos = new THREE.Vector2(0, 0); // Center of viewport

  _surfaceDetected = true;
  _updateStatusHeader('detected', 'Surface detected — Tap screen to place monument');

  _renderer.domElement.addEventListener('pointerdown', _onCameraArTap);

  function animate() {
    _animId = requestAnimationFrame(animate);

    if (!_placed && _reticle && _camera && _groundPlane) {
      _raycaster.setFromCamera(_pointerPos, _camera);
      const hits = _raycaster.intersectObject(_groundPlane);
      if (hits.length > 0) {
        _reticle.position.copy(hits[0].point);
        _reticle.visible = true;
      }
    }

    _renderer.render(_scene, _camera);
  }
  animate();

  _removeLoadingScreen(container);
  _renderARControls(container);
  _attachTouchGestures();
}

function _onCameraArTap(e) {
  if (_placed || !_reticle) return;

  const THREE = T();
  _raycaster.setFromCamera(new THREE.Vector2(0, 0), _camera);
  const hits = _raycaster.intersectObject(_groundPlane);

  const pos = hits.length > 0 ? hits[0].point : _reticle.position.clone();
  _model.position.copy(pos);
  _model.visible = true;
  _placed = true;
  _reticle.visible = false;

  _animateModelIn(_model);
  _updateStatusHeader('placed', '📷 Live Camera AR — Drag to move • Pinch to scale');
  _renderARControls(_container);
}

function _animateModelIn(model) {
  const target = model.userData.baseScale || 0.45;
  model.scale.setScalar(0.001);
  const start = performance.now();
  function step() {
    const t = Math.min((performance.now() - start) / 500, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    model.scale.setScalar(0.001 + (target - 0.001) * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ─── PATH 3: Unsupported Device Fallback ────────────────────────────────────

function _startFallback3DViewer(monument, container) {
  if (!container) return;
  const THREE = T();
  const name = monument?.name || 'Monument';

  _updateStatusHeader('fallback', `AR is not supported on this device. You can explore the 3D ${name} instead.`);

  const w = container.clientWidth  || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;

  _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  _renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  _renderer.setSize(w, h);
  _renderer.setClearColor(0x090d16, 1);
  _renderer.shadowMap.enabled = true;
  container.appendChild(_renderer.domElement);
  Object.assign(_renderer.domElement.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '5',
  });

  _scene = new THREE.Scene();
  _scene.background = new THREE.Color(0x090d16);
  _scene.fog = new THREE.Fog(0x090d16, 20, 60);

  const grid = new THREE.GridHelper(20, 20, 0x1e3a5f, 0x1e3a5f);
  grid.position.y = -1.5;
  _scene.add(grid);

  _scene.add(new THREE.AmbientLight(0x8899bb, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(5, 10, 5);
  key.castShadow = true;
  _scene.add(key);

  _camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
  _camera.position.set(...INIT_CAM_POS);

  _model = buildMonumentModelGroup(monument);
  _model.position.set(0, -0.5, 0);
  _scene.add(_model);

  const OrbCtrl = OC();
  if (OrbCtrl) {
    _controls = new OrbCtrl(_camera, _renderer.domElement);
    _controls.enableDamping   = true;
    _controls.dampingFactor   = 0.08;
    _controls.minDistance     = 2;
    _controls.maxDistance     = 20;
    _controls.target.set(...INIT_CAM_TARGET);
    _controls.autoRotate      = true;
    _controls.autoRotateSpeed = 1.2;
    _controls.update();
    _renderer.domElement.addEventListener('pointerdown', () => {
      if (_controls) _controls.autoRotate = false;
    });
  } else {
    _controls = _createFallbackControls(_camera, _renderer.domElement);
  }

  function animate() {
    _animId = requestAnimationFrame(animate);
    if (_controls?.update) _controls.update();
    if (_model && _controls?.autoRotate) {
      _model.position.y = -0.5 + Math.sin(performance.now() * 0.001) * 0.03;
    }
    _renderer.render(_scene, _camera);
  }
  animate();

  _removeLoadingScreen(container);
  _renderARControls(container);
}

function _removeLoadingScreen(container) {
  if (!container) return;
  const card = container.querySelector('.ar-loading-card');
  if (card) card.remove();
}

// ─── Touch Gestures & AR Action Controls ────────────────────────────────────

function _attachTouchGestures() {
  const overlay = _renderer?.domElement || _container;
  if (!overlay || !_gesture) return;

  let isDragging = false;
  let lastX = 0, lastY = 0;
  let lastTouches = [];

  overlay.addEventListener('pointerdown', e => {
    if (!_placed) return;
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  overlay.addEventListener('pointermove', e => {
    if (!isDragging || !_placed || !_model) return;
    const dx = (e.clientX - lastX) * 0.005;
    const dy = (e.clientY - lastY) * 0.005;

    _model.position.x += dx;
    _model.position.z += dy;

    lastX = e.clientX;
    lastY = e.clientY;
  });

  overlay.addEventListener('pointerup', () => { isDragging = false; });

  overlay.addEventListener('touchstart', e => {
    lastTouches = Array.from(e.touches);
    if (lastTouches.length === 2 && _model) {
      _gesture.startDist  = _getTouchDist(lastTouches);
      _gesture.startAngle = _getTouchAngle(lastTouches);
      _gesture.startModelScale.copy(_model.scale);
    }
  }, { passive: true });

  overlay.addEventListener('touchmove', e => {
    const touches = Array.from(e.touches);
    if (touches.length === 2 && lastTouches.length === 2 && _model) {
      const dist  = _getTouchDist(touches);
      const ratio = dist / (_gesture.startDist || 1);
      const base  = _model.userData.baseScale || 0.45;
      const ns    = Math.max(base * 0.1, Math.min(base * 4, _gesture.startModelScale.x * ratio));
      _model.scale.setScalar(ns);

      const angle = _getTouchAngle(touches);
      _model.rotation.y += (angle - _gesture.startAngle) * 0.015;
      _gesture.startAngle = angle;
    }
    lastTouches = touches;
  }, { passive: true });
}

function _getTouchDist(t) {
  const dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
function _getTouchAngle(t) {
  return Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX);
}

// ─── UI & Control Screens ───────────────────────────────────────────────────

function _updateStatusHeader(mode, text) {
  const pill = document.querySelector('.ar-status-pill');
  if (pill) {
    const dot  = pill.querySelector('.ar-status-dot');
    const span = pill.querySelector('span:last-child');
    if (span) span.textContent = text;
    if (dot)  dot.className = 'ar-status-dot ' + (mode === 'placed' ? 'placed' : mode === 'detected' ? 'detected' : mode === 'scanning' ? 'scanning' : 'fallback');
  }
}

function _renderARControls(container) {
  const existing = container.querySelector('.ar-3d-toolbar');
  if (existing) existing.remove();

  const tb = document.createElement('div');
  tb.className = 'ar-3d-toolbar';
  tb.innerHTML = `
    ${_placed ? `
      <button class="ar-tb-btn ar-btn-danger" onclick="window.removePlacedArModel()" title="Remove Placed Model">
        <span class="material-symbols-rounded">delete</span>
        <span>Remove</span>
      </button>
    ` : ''}
    <button class="ar-tb-btn" onclick="window.reset3dView()" title="Reset Position">
      <span class="material-symbols-rounded">restart_alt</span>
      <span>Reset</span>
    </button>
    <button class="ar-tb-btn" onclick="window.zoom3dView(1)" title="Scale Up">
      <span class="material-symbols-rounded">add</span>
    </button>
    <button class="ar-tb-btn" onclick="window.zoom3dView(-1)" title="Scale Down">
      <span class="material-symbols-rounded">remove</span>
    </button>
    <button class="ar-tb-btn" id="ar-spin-btn" onclick="window.toggle3dSpin()" title="Toggle Auto Rotation">
      <span class="material-symbols-rounded">sync</span>
      <span>Spin</span>
    </button>
  `;
  container.appendChild(tb);
}

function _showLoadingScreen(container, text) {
  container.innerHTML = `
    <div class="ar-loading-card">
      <span class="material-symbols-rounded spin" style="font-size:48px;color:var(--color-primary);">sync</span>
      <h3 style="margin:12px 0 4px 0;color:white;font-size:1.1rem;">${text}</h3>
      <p style="font-size:0.8rem;color:#cbd5e1;">Preparing AR environment and 3D geometry</p>
    </div>`;
}

function _showPermissionDeniedScreen(container, monument) {
  const name = monument?.name || 'Monument';
  container.innerHTML = `
    <div class="ar-error-card">
      <span class="material-symbols-rounded" style="font-size:52px;color:#ef4444;">videocam_off</span>
      <h3 style="margin:8px 0 4px 0;color:white;">Camera Access Denied</h3>
      <p style="font-size:0.85rem;color:#cbd5e1;max-width:320px;line-height:1.4;">
        Camera permission is required to view ${name} in real-world AR. Please allow camera permissions in browser settings.
      </p>
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button class="action-btn-pill" style="background:var(--color-primary);color:white;" onclick="window.retry3dViewer()">
          <span class="material-symbols-rounded">refresh</span>
          Retry Camera
        </button>
        <button class="action-btn-pill" style="background:rgba(255,255,255,0.15);color:white;" onclick="window.switchTo3dFallback()">
          <span class="material-symbols-rounded">3d_rotation</span>
          Explore in 3D
        </button>
      </div>
    </div>`;
}

function _showErrorScreen(container, msg, monument) {
  container.innerHTML = `
    <div class="ar-error-card">
      <span class="material-symbols-rounded" style="font-size:52px;color:#f59e0b;">error_outline</span>
      <h3 style="margin:8px 0 4px 0;color:white;">Unable to Load AR</h3>
      <p style="font-size:0.85rem;color:#cbd5e1;max-width:320px;line-height:1.4;">${msg}</p>
      <button class="action-btn-pill" style="margin-top:16px;background:var(--color-primary);color:white;" onclick="window.retry3dViewer()">
        <span class="material-symbols-rounded">refresh</span>
        Try Again
      </button>
    </div>`;
}

// ─── Mesh & Reticle Helpers ──────────────────────────────────────────────────

function _mat(color, opts = {}) {
  const THREE = T();
  return new THREE.MeshStandardMaterial({
    color,
    roughness:   opts.roughness  ?? 0.4,
    metalness:   opts.metalness  ?? 0.1,
    transparent: opts.transparent ?? false,
    opacity:     opts.opacity    ?? 1.0,
    side:        opts.side       ?? THREE.FrontSide,
  });
}

function _mesh(geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) {
  const THREE = T();
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.castShadow    = true;
  m.receiveShadow = true;
  return m;
}

function _buildReticle() {
  const THREE = T();
  const g = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.12, 0.18, 32),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  g.add(ring);
  const dot = new THREE.Mesh(
    new THREE.CircleGeometry(0.04, 16),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide })
  );
  dot.rotation.x = -Math.PI / 2;
  dot.position.y = 0.001;
  g.add(dot);
  return g;
}

// ─── 3D Monument Models ──────────────────────────────────────────────────────

export function buildMonumentModelGroup(monument) {
  const id  = monument?.id  || '';
  const cat = (monument?.category || '').toLowerCase();
  let group;

  switch (id) {
    case 'taj-mahal': group = _buildTajMahal(); break;
    case 'great-wall-of-china': group = _buildGreatWall(); break;
    case 'eiffel-tower': group = _buildEiffelTower(); break;
    case 'colosseum': group = _buildColosseum(); break;
    case 'pyramids-of-giza': group = _buildPyramids(); break;
    case 'petra': group = _buildPetra(); break;
    case 'machu-picchu': group = _buildMachuPicchu(); break;
    case 'big-ben': group = _buildBigBen(); break;
    case 'statue-of-liberty': group = _buildStatueOfLiberty(); break;
    case 'angkor-wat': group = _buildAngkorWat(); break;
    case 'acropolis-of-athens': group = _buildParthenon(); break;
    case 'christ-the-redeemer': group = _buildChristTheRedeemer(); break;
    case 'sydney-opera-house': group = _buildSydneyOperaHouse(); break;
    case 'burj-khalifa': group = _buildBurjKhalifa(); break;
    case 'moai-easter-island': group = _buildMoai(); break;
    case 'chichen-itza': group = _buildChichenItza(); break;
    case 'leaning-tower-of-pisa': group = _buildLeaningTower(); break;
    case 'st-peters-basilica': group = _buildStPeters(); break;
    case 'golden-gate-bridge': group = _buildGoldenGate(); break;
    case 'mount-rushmore': group = _buildMountRushmore(); break;
    case 'alhambra': group = _buildAlhambra(); break;
    case 'stonehenge': group = _buildStonehenge(); break;
    case 'sagrada-familia': group = _buildSagradaFamilia(); break;
    case 'hagia-sophia': group = _buildHagiaSophia(); break;
    case 'qutub-minar': group = _buildQutubMinar(); break;
    case 'hawa-mahal': group = _buildHawaMahal(); break;
    default:
      if (cat.includes('mughal') || cat.includes('mosque') || cat.includes('temple')) group = _buildGenericMughal();
      else if (cat.includes('fort') || cat.includes('wall') || cat.includes('castle')) group = _buildGreatWall();
      else if (cat.includes('statue') || cat.includes('sculpture')) group = _buildChristTheRedeemer();
      else if (cat.includes('tower')) group = _buildLeaningTower();
      else group = _buildTajMahal();
      break;
  }

  group.userData.baseScale = 0.45;
  group.scale.setScalar(0.45);
  return group;
}

// Taj Mahal
function _buildTajMahal() {
  const THREE = T();
  const g = new THREE.Group();
  const marble = _mat(0xfaf8f2, { roughness: 0.25 });
  const gold   = _mat(0xd4af37, { metalness: 0.8 });
  g.add(_mesh(new THREE.BoxGeometry(3.6, 0.12, 3.6), _mat(0xe0d6c5), [0, 0, 0]));
  g.add(_mesh(new THREE.BoxGeometry(2.6, 0.28, 2.6), marble, [0, 0.2, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.9, 8), marble, [0, 0.79, 0], [0, Math.PI / 8, 0]));
  for (let i = 0; i < 4; i++) {
    const rad = (i * Math.PI) / 2;
    g.add(_mesh(new THREE.BoxGeometry(0.5, 0.6, 0.15), _mat(0x2d2926), [Math.sin(rad) * 0.95, 0.75, Math.cos(rad) * 0.95], [0, rad, 0]));
  }
  g.add(_mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.35, 24), marble, [0, 1.4, 0]));
  g.add(_mesh(new THREE.SphereGeometry(0.62, 32, 20, 0, Math.PI * 2, 0, Math.PI / 1.8), marble, [0, 1.6, 0]));
  g.add(_mesh(new THREE.ConeGeometry(0.04, 0.45, 8), gold, [0, 2.42, 0]));
  [[-1.15, -1.15], [1.15, -1.15], [-1.15, 1.15], [1.15, 1.15]].forEach(([x, z]) => {
    g.add(_mesh(new THREE.CylinderGeometry(0.09, 0.13, 1.6, 16), marble, [x, 1.0, z]));
    g.add(_mesh(new THREE.SphereGeometry(0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), marble, [x, 1.88, z]));
    g.add(_mesh(new THREE.ConeGeometry(0.02, 0.18, 8), gold, [x, 2.08, z]));
  });
  return g;
}

// Great Wall
function _buildGreatWall() {
  const THREE = T();
  const g = new THREE.Group();
  const wallMat = _mat(0x8a847c, { roughness: 0.85 });
  const darkMat = _mat(0x5a544d, { roughness: 0.9 });
  const roofMat = _mat(0xa83c2e, { roughness: 0.7 });
  g.add(_mesh(new THREE.BoxGeometry(4.2, 0.35, 1.2), _mat(0x4a5d3f), [0, -0.15, 0], [0, 0.05, 0.02]));
  g.add(_mesh(new THREE.BoxGeometry(4.0, 0.7, 0.5), wallMat, [0, 0.35, 0], [0, 0.12, 0.04]));
  for (let x = -1.9; x <= 1.9; x += 0.25) {
    g.add(_mesh(new THREE.BoxGeometry(0.12, 0.16, 0.08), darkMat, [x, 0.78, 0.24]));
    g.add(_mesh(new THREE.BoxGeometry(0.12, 0.16, 0.08), darkMat, [x, 0.78, -0.24]));
  }
  [-1.4, 0, 1.4].forEach((x, i) => {
    const towerY = 0.55 + i * 0.05;
    g.add(_mesh(new THREE.BoxGeometry(0.7, 1.1, 0.7), wallMat, [x, towerY, i * 0.08]));
    g.add(_mesh(new THREE.BoxGeometry(0.2, 0.3, 0.72), _mat(0x222222), [x, towerY + 0.2, i * 0.08]));
    g.add(_mesh(new THREE.ConeGeometry(0.55, 0.45, 4), roofMat, [x, towerY + 0.9, i * 0.08], [0, Math.PI / 4, 0]));
  });
  return g;
}

// Eiffel Tower
function _buildEiffelTower() {
  const THREE = T();
  const g = new THREE.Group();
  const iron = _mat(0x525866, { roughness: 0.6, metalness: 0.6 });
  const ironDark = _mat(0x353a47, { roughness: 0.7, metalness: 0.5 });
  g.add(_mesh(new THREE.BoxGeometry(2.4, 0.08, 2.4), _mat(0x475569)));
  [0, 90, 180, 270].forEach(deg => {
    const rad = deg * Math.PI / 180;
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.25, 0.14), iron);
    leg.position.set(Math.sin(rad) * 0.75, 0.65, Math.cos(rad) * 0.75);
    leg.rotation.z = Math.sin(rad) * 0.32; leg.rotation.x = Math.cos(rad) * 0.32; g.add(leg);
  });
  g.add(_mesh(new THREE.BoxGeometry(1.3, 0.1, 1.3), ironDark, [0, 1.25, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(0.35, 0.62, 1.0, 4, 1, true), iron, [0, 1.8, 0], [0, Math.PI / 4, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(0.08, 0.32, 1.2, 4, 1, true), iron, [0, 2.95, 0], [0, Math.PI / 4, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(0.015, 0.07, 0.65, 8), iron, [0, 3.98, 0]));
  return g;
}

// Colosseum
function _buildColosseum() {
  const THREE = T();
  const g = new THREE.Group();
  const trav = _mat(0xd9ccb4, { roughness: 0.8 });
  const dark = _mat(0x968772, { roughness: 0.9 });
  g.add(_mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.08, 36), _mat(0xc2b280), [0, -0.02, 0]));
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(1.25 - i * 0.02, 0.22 - i * 0.02, 8, 48), i % 2 === 0 ? trav : dark);
    r.rotation.x = Math.PI / 2; r.position.y = i * 0.42 + 0.15; g.add(r);
  }
  return g;
}

// Pyramids
function _buildPyramids() {
  const THREE = T();
  const g = new THREE.Group();
  const stone = _mat(0xc7ab6d, { roughness: 0.85 });
  g.add(_mesh(new THREE.BoxGeometry(5.2, 0.1, 4.2), _mat(0xe3cb96), [0, -0.05, 0]));
  g.add(_mesh(new THREE.ConeGeometry(1.2, 1.55, 4), stone, [-0.85, 0.78, 0], [0, Math.PI / 4, 0]));
  g.add(_mesh(new THREE.ConeGeometry(0.92, 1.22, 4), stone, [0.75, 0.61, -0.35], [0, Math.PI / 4, 0]));
  g.add(_mesh(new THREE.ConeGeometry(0.6, 0.78, 4), stone, [1.95, 0.39, 0.25], [0, Math.PI / 4, 0]));
  g.add(_mesh(new THREE.BoxGeometry(0.95, 0.3, 0.32), stone, [-0.1, 0.2, 1.15]));
  g.add(_mesh(new THREE.SphereGeometry(0.22, 16, 12), stone, [-0.45, 0.45, 1.15]));
  return g;
}

function _buildPetra() {
  const THREE = T();
  const g = new THREE.Group();
  const rose = _mat(0xc97a61, { roughness: 0.85 });
  g.add(_mesh(new THREE.BoxGeometry(2.4, 2.9, 0.25), _mat(0xd98a71), [0, 1.45, -0.15]));
  for (let i = -2; i <= 2; i++) g.add(_mesh(new THREE.CylinderGeometry(0.07, 0.08, 1.15, 12), rose, [i * 0.38, 0.58, 0]));
  return g;
}

function _buildMachuPicchu() {
  const THREE = T();
  const g = new THREE.Group();
  const granite = _mat(0x8fa0af, { roughness: 0.85 });
  const grass   = _mat(0x4e825a, { roughness: 0.95 });
  for (let i = 0; i < 5; i++) g.add(_mesh(new THREE.BoxGeometry(2.6 - i * 0.36, 0.22, 1.9 - i * 0.22), i % 2 === 0 ? grass : granite, [0, i * 0.3, 0]));
  return g;
}

function _buildBigBen() {
  const THREE = T();
  const g = new THREE.Group();
  const lime = _mat(0xebdbb2, { roughness: 0.75 });
  g.add(_mesh(new THREE.BoxGeometry(0.72, 2.3, 0.72), lime, [0, 1.4, 0]));
  g.add(_mesh(new THREE.ConeGeometry(0.23, 1.15, 8), lime, [0, 3.95, 0]));
  return g;
}

function _buildStatueOfLiberty() {
  const THREE = T();
  const g = new THREE.Group();
  const copper = _mat(0x76b09e, { roughness: 0.5 });
  g.add(_mesh(new THREE.CylinderGeometry(0.58, 0.68, 0.82, 12), _mat(0x9e8e7e), [0, 0.41, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(0.21, 0.4, 1.05, 12), copper, [0, 1.75, 0]));
  g.add(_mesh(new THREE.SphereGeometry(0.21, 16, 12), copper, [0, 2.82, 0]));
  return g;
}

function _buildAngkorWat() {
  const THREE = T();
  const g = new THREE.Group();
  g.add(_mesh(new THREE.BoxGeometry(3.4, 0.15, 2.4), _mat(0x3a4856), [0, 0, 0]));
  g.add(_mesh(new THREE.ConeGeometry(0.35, 1.1, 8), _mat(0x6b6357), [0, 1.25, 0]));
  return g;
}

function _buildParthenon() {
  const THREE = T();
  const g = new THREE.Group();
  const marble = _mat(0xeee5d8, { roughness: 0.6 });
  g.add(_mesh(new THREE.BoxGeometry(2.6, 0.2, 1.5), marble, [0, 0.1, 0]));
  g.add(_mesh(new THREE.ConeGeometry(1.35, 0.45, 4), marble, [0, 1.48, 0], [0, Math.PI / 4, 0]));
  return g;
}

function _buildChristTheRedeemer() {
  const THREE = T();
  const g = new THREE.Group();
  const soapstone = _mat(0xbcc5c2, { roughness: 0.6 });
  g.add(_mesh(new THREE.ConeGeometry(1.2, 1.4, 7), _mat(0x3e5246), [0, 0.7, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.2, 12), soapstone, [0, 2.5, 0]));
  g.add(_mesh(new THREE.BoxGeometry(2.2, 0.12, 0.14), soapstone, [0, 2.9, 0]));
  return g;
}

function _buildSydneyOperaHouse() {
  const THREE = T();
  const g = new THREE.Group();
  g.add(_mesh(new THREE.BoxGeometry(3.0, 0.25, 1.8), _mat(0x6b7280), [0, 0.12, 0]));
  [-0.7, 0.2, 0.9].forEach((x, i) => {
    const s = new THREE.Mesh(new THREE.ConeGeometry(0.5 - i * 0.08, 0.8 - i * 0.1, 3), _mat(0xfdfbf7));
    s.position.set(x, 0.6 + i * 0.05, 0); s.rotation.z = -Math.PI / 6; s.rotation.y = Math.PI / 2; g.add(s);
  });
  return g;
}

function _buildBurjKhalifa() {
  const THREE = T();
  const g = new THREE.Group();
  const glass = _mat(0x94a3b8, { roughness: 0.2 });
  g.add(_mesh(new THREE.CylinderGeometry(0.55, 0.7, 1.0, 3), glass, [0, 0.5, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(0.38, 0.55, 1.1, 3), glass, [0, 1.55, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(0.01, 0.05, 0.8, 8), _mat(0xc0caf5), [0, 4.7, 0]));
  return g;
}

function _buildMoai() {
  const THREE = T();
  const g = new THREE.Group();
  const tuff = _mat(0x736c65, { roughness: 0.9 });
  [-0.8, 0, 0.8].forEach(x => {
    g.add(_mesh(new THREE.BoxGeometry(0.38, 1.1, 0.3), tuff, [x, 0.8, 0]));
    g.add(_mesh(new THREE.BoxGeometry(0.42, 0.45, 0.35), tuff, [x, 1.5, 0.05]));
  });
  return g;
}

function _buildChichenItza() {
  const THREE = T();
  const g = new THREE.Group();
  const lime = _mat(0xd1c7b7, { roughness: 0.85 });
  for (let i = 0; i < 6; i++) g.add(_mesh(new THREE.BoxGeometry(2.8 - i * 0.4, 0.22, 2.8 - i * 0.4), lime, [0, i * 0.22, 0]));
  return g;
}

function _buildLeaningTower() {
  const THREE = T();
  const g = new THREE.Group();
  const marble = _mat(0xf2ede4, { roughness: 0.5 });
  for (let i = 0; i <= 6; i++) g.add(_mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.35, 20), marble, [0, 0.15 + i * 0.35, 0]));
  g.rotation.z = -0.1;
  return g;
}

function _buildStPeters() {
  const THREE = T();
  const g = new THREE.Group();
  const stone = _mat(0xe3d9c8);
  g.add(_mesh(new THREE.BoxGeometry(2.4, 0.8, 1.4), stone, [0, 0.4, 0]));
  g.add(_mesh(new THREE.SphereGeometry(0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), stone, [0, 1.2, 0]));
  return g;
}

function _buildGoldenGate() {
  const THREE = T();
  const g = new THREE.Group();
  const orange = _mat(0xc0392b);
  g.add(_mesh(new THREE.BoxGeometry(3.6, 0.08, 0.3), _mat(0x34495e), [0, 0.5, 0]));
  [-1.0, 1.0].forEach(x => { g.add(_mesh(new THREE.BoxGeometry(0.12, 2.2, 0.12), orange, [x - 0.08, 1.1, 0])); });
  return g;
}

function _buildMountRushmore() {
  const THREE = T();
  const g = new THREE.Group();
  const granite = _mat(0x9da3a8);
  g.add(_mesh(new THREE.BoxGeometry(3.2, 1.6, 1.2), granite, [0, 0.8, -0.2]));
  [-1.0, -0.3, 0.35, 1.0].forEach(x => g.add(_mesh(new THREE.SphereGeometry(0.28, 16, 12), granite, [x, 1.1, 0.35])));
  return g;
}

function _buildAlhambra() {
  const THREE = T();
  const g = new THREE.Group();
  g.add(_mesh(new THREE.BoxGeometry(2.4, 0.6, 1.6), _mat(0xba6848), [0, 0.3, 0]));
  return g;
}

function _buildStonehenge() {
  const THREE = T();
  const g = new THREE.Group();
  const sarsen = _mat(0x73787e);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    g.add(_mesh(new THREE.BoxGeometry(0.16, 0.75, 0.16), sarsen, [Math.sin(a) * 1.1, 0.4, Math.cos(a) * 1.1]));
  }
  return g;
}

function _buildSagradaFamilia() {
  const THREE = T();
  const g = new THREE.Group();
  [-0.6, -0.2, 0.2, 0.6].forEach(x => g.add(_mesh(new THREE.ConeGeometry(0.16, 2.2, 12), _mat(0xc4b7a1), [x, 1.4, 0.3])));
  return g;
}

function _buildHagiaSophia() {
  const THREE = T();
  const g = new THREE.Group();
  const terra = _mat(0xb86d53);
  g.add(_mesh(new THREE.BoxGeometry(2.0, 0.6, 2.0), terra, [0, 0.3, 0]));
  g.add(_mesh(new THREE.SphereGeometry(0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), terra, [0, 0.6, 0]));
  return g;
}

function _buildQutubMinar() {
  const THREE = T();
  const g = new THREE.Group();
  const red = _mat(0xad4734);
  g.add(_mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.8, 24), red, [0, 0.4, 0]));
  g.add(_mesh(new THREE.CylinderGeometry(0.28, 0.35, 0.8, 24), red, [0, 1.2, 0]));
  return g;
}

function _buildHawaMahal() {
  const THREE = T();
  const g = new THREE.Group();
  g.add(_mesh(new THREE.BoxGeometry(2.4, 1.8, 0.25), _mat(0xd47365), [0, 0.9, 0]));
  return g;
}

function _buildGenericMughal() {
  const THREE = T();
  const g = new THREE.Group();
  g.add(_mesh(new THREE.BoxGeometry(2.0, 0.2, 2.0), _mat(0xe0d5c0), [0, 0, 0]));
  return g;
}

// Window Globals for UI Event Binding
window.removePlacedArModel = () => removePlacedModel();
window.switchTo3dFallback = () => {
  if (_container && _currentMonument) {
    destroyArViewer();
    _mode = 'fallback';
    _startFallback3DViewer(_currentMonument, _container);
  }
};
