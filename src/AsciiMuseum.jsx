import React from 'react';
import * as THREE from 'three';

const FONT_SIZE = 8;
const MIN_FONT_SIZE = 6;
const LINE_HEIGHT = 0.58;
// the ticks are SLIGHTLY different and allow for VERY slight differences which is nice when looking at large
// patterns, this might be worth expanding with some more nerd 
const RAMP = '  ..\'\'``::,,--~~==++**xx##%%@@█';
const DITHER_4X4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

// NOTE: Most of these don't work well in ascii as they have intricate details
// so i probably need to find new ones other than snor.png
const SIDE_ART = [
  '/art/beachcastle.png',
  '/art/brightsky.png',
  '/art/city.png',
  '/art/greenhills.png',
  '/art/island.jpg',
  '/art/snor.png',
];

// this one is TRASH at being displayed in ascii lmao
//
// TODO: change
const CENTERPIECE_ART = '/art/villawall.png';

export function AsciiMuseum({ color = '#ebdbb2', progress = 0 }) {
  const wrapRef = React.useRef(null);
  const preRef = React.useRef(null);
  const progressRef = React.useRef(progress);

  React.useEffect(() => { progressRef.current = progress; }, [progress]);

  React.useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.left = '-10000px';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.06);

    const camera = new THREE.PerspectiveCamera(58, 2, 0.1, 100);

		// wall consts move to top?
    const HALL_W = 6;
    const HALL_H = 3.25;
    const HALL_LEN = 26;
    const HALL_Z_END = -HALL_LEN / 2;
    const HALL_Z_START = HALL_LEN / 2;
    const HALL_Z_MID = (HALL_Z_START + HALL_Z_END) / 2;

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x4f4942, roughness: 0.95 });
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x050403 });

    const floorGeo = new THREE.PlaneGeometry(HALL_W, HALL_LEN);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = HALL_Z_MID;
    scene.add(floor);

    const sideZs = [-1.5, -5.5, -9.5];
    const panelGeo = new THREE.PlaneGeometry(3.25, HALL_H);
    const wallFillMat = new THREE.MeshBasicMaterial({
      color: 0x7c7062,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

		// shitty and horrible way of making lights i should be killed for this,
		// TODO: please find a better way of doing this
    const wallRingGeo = new THREE.CircleGeometry(1, 32);
    const wallRings = [];
    const addWallRings = ({ x, y, z, ry = 0, baseScale = 1, seed = 0 }) => {
      const ringDefs = [
        { color: 0xf7d29a, opacity: 0.18, scale: [1.2, 0.72] },
        { color: 0xffe0aa, opacity: 0.13, scale: [0.82, 0.5] },
        { color: 0xffc77b, opacity: 0.08, scale: [1.55, 0.92] },
      ];
      ringDefs.forEach((def, i) => {
        const mat = new THREE.MeshBasicMaterial({
          color: def.color,
          transparent: true,
          opacity: def.opacity,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(wallRingGeo, mat);
        ring.rotation.y = ry;
        ring.position.set(x, y - i * 0.04, z);
        ring.scale.set(def.scale[0] * baseScale, def.scale[1] * baseScale, 1);
        scene.add(ring);
        wallRings.push({
          mesh: ring,
          baseOpacity: def.opacity,
          baseX: def.scale[0] * baseScale,
          baseY: def.scale[1] * baseScale,
          phase: seed + i * 1.7,
          speed: 0.42 + i * 0.17,
        });
      });
    };
    sideZs.forEach((z) => {
      const leftPanel = new THREE.Mesh(panelGeo, wallMat);
      leftPanel.rotation.y = Math.PI / 2;
      leftPanel.position.set(-HALL_W / 2, HALL_H / 2, z);
      scene.add(leftPanel);
      const leftFill = new THREE.Mesh(panelGeo, wallFillMat.clone());
      leftFill.rotation.y = Math.PI / 2;
      leftFill.position.set(-HALL_W / 2 + 0.004, HALL_H / 2, z);
      scene.add(leftFill);
      addWallRings({ x: -HALL_W / 2 + 0.008, y: 1.84, z, ry: Math.PI / 2, seed: z * 0.6 - 0.2 });

      const rightPanel = new THREE.Mesh(panelGeo, wallMat);
      rightPanel.rotation.y = -Math.PI / 2;
      rightPanel.position.set(HALL_W / 2, HALL_H / 2, z);
      scene.add(rightPanel);
      const rightFill = new THREE.Mesh(panelGeo, wallFillMat.clone());
      rightFill.rotation.y = -Math.PI / 2;
      rightFill.position.set(HALL_W / 2 - 0.004, HALL_H / 2, z);
      scene.add(rightFill);
      addWallRings({ x: HALL_W / 2 - 0.008, y: 1.84, z, ry: -Math.PI / 2, seed: z * 0.6 + 0.2 });
    });

    const farWall = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W * 0.9, HALL_H), wallMat);
    farWall.position.set(0, HALL_H / 2, HALL_Z_END);
    scene.add(farWall);
    const farFill = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W * 0.9, HALL_H), wallFillMat.clone());
    farFill.position.set(0, HALL_H / 2, HALL_Z_END + 0.004);
    scene.add(farFill);
    addWallRings({ x: 0, y: 1.95, z: HALL_Z_END + 0.008, baseScale: 1.45, seed: 2.1 });

    const carpetMat = new THREE.MeshBasicMaterial({ color: 0x6e2631 });
    const carpet = new THREE.Mesh(new THREE.PlaneGeometry(1.9, HALL_LEN - 1), carpetMat);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.003, HALL_Z_MID);
    scene.add(carpet);

    const carpetTrimMat = new THREE.MeshBasicMaterial({ color: 0xae7d3d });
    [-1, 1].forEach((side) => {
      const trim = new THREE.Mesh(new THREE.PlaneGeometry(0.08, HALL_LEN - 1), carpetTrimMat);
      trim.rotation.x = -Math.PI / 2;
      trim.position.set(side * 0.92, 0.006, HALL_Z_MID);
      scene.add(trim);
    });

		// night sky because day time is hard to make with chars
		// NOTE: If i feel like making it look cooler add daytime
    const skyGeo = new THREE.SphereGeometry(60, 18, 10);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x000000, side: THREE.BackSide, fog: false, depthWrite: false,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

		// should this be a mesh? Constellations can be made + steam happy constellation?? TODO:
    const starPositions = [];
    for (let i = 0; i < 260; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random());
      const r = 50;
      starPositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        Math.abs(r * Math.cos(phi)) + 4,
        r * Math.sin(phi) * Math.sin(theta),
      );
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.45, color: 0xeef0ff, fog: false, sizeAttenuation: true,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    const moonGeo = new THREE.CircleGeometry(2.2, 24);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xe8e4c8, fog: false });
    const moonCutMat = new THREE.MeshBasicMaterial({ color: 0x000000, fog: false });
    const moon = new THREE.Group();
    const moonDisc = new THREE.Mesh(moonGeo, moonMat);
    const moonCut = new THREE.Mesh(new THREE.CircleGeometry(2.05, 24), moonCutMat);
    moonCut.position.set(0.78, 0.12, 0.01);
    moon.add(moonDisc);
    moon.add(moonCut);
    moon.position.set(-18, 16, -30);
    moon.lookAt(0, 3, 0);
    scene.add(moon);

    // lighting for the horizon, should i bake shadowing into the walls and trees while lighting the ground?
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x030711, fog: false });
    const horizon = new THREE.Mesh(new THREE.PlaneGeometry(48, 2.2), horizonMat);
    horizon.position.set(0, 3.2, HALL_Z_END - 10);
    scene.add(horizon);

		// these will literally never been seen unless i add color
    const waveMats = [
      new THREE.MeshBasicMaterial({ color: 0x111a2c, fog: false }),
      new THREE.MeshBasicMaterial({ color: 0x273247, fog: false }),
      new THREE.MeshBasicMaterial({ color: 0x080d19, fog: false }),
    ];
    const waveBands = [];
    for (let i = 0; i < 7; i++) {
      const wave = new THREE.Mesh(new THREE.PlaneGeometry(24 - i * 1.8, 0.035), waveMats[i % waveMats.length]);
      wave.position.set(0, 2.62 + i * 0.13, HALL_Z_END - 8.5 - i * 0.75);
      scene.add(wave);
      waveBands.push({ mesh: wave, baseX: (i % 2 ? -0.25 : 0.25), phase: i * 0.8 });
    }

    const moonLight = new THREE.DirectionalLight(0x8ea8cf, 0.08);
    moonLight.position.set(-6, 10, 14);
    scene.add(moonLight);
    scene.add(moonLight.target);

    const frameMat = new THREE.MeshBasicMaterial({ color: 0x2b2118 });

    const disposables = [];

    // Downscale source images to small textures bcz ASCII output is
    // ~140x70 chars max (i think), so we don't need 1080p. i think 96 is enough
    const TEX_MAX = 96;
    const loadArtDownscaled = (url) => {
      const tex = new THREE.Texture();
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;
        const s = Math.min(1, TEX_MAX / Math.max(srcW, srcH));
        const w = Math.max(1, Math.round(srcW * s));
        const h = Math.max(1, Math.round(srcH * s));
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, w, h);
        tex.image = c;
        tex.needsUpdate = true;
      };
      img.src = url;
      return tex;
    };

    const addFrame = ({ x, y, z, ry = 0, w, h, thick = 0.12, artUrl }) => {
      const g = new THREE.Group();
      const outer = new THREE.Mesh(new THREE.PlaneGeometry(w + thick * 2, h + thick * 2), frameMat);
      const artMat = new THREE.MeshBasicMaterial({
        map: artUrl ? loadArtDownscaled(artUrl) : null,
        color: artUrl ? 0xffffff : 0xb8a078,
      });
      disposables.push(artMat);
      if (artMat.map) disposables.push(artMat.map);
      const inner = new THREE.Mesh(new THREE.PlaneGeometry(w, h), artMat);
      inner.position.z = 0.005;
      g.add(outer);
      g.add(inner);
      g.position.set(x, y, z);
      g.rotation.y = ry;
      scene.add(g);
      return g;
    };

		// shuffle pictures because i really can't decide where to put what
    const shuffled = SIDE_ART.slice();
		// hi + lcg fisher yates
    let seed = 0x6869;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const WALL_EPS = 0.02;
    let artIdx = 0;
    sideZs.forEach((z) => {
      addFrame({
        x: -HALL_W / 2 + WALL_EPS, y: 1.78, z, ry: Math.PI / 2,
        w: 1.7, h: 1.25, artUrl: shuffled[artIdx++ % shuffled.length],
      });
      addFrame({
        x: HALL_W / 2 - WALL_EPS, y: 1.78, z, ry: -Math.PI / 2,
        w: 1.7, h: 1.25, artUrl: shuffled[artIdx++ % shuffled.length],
      });
    });

    const plaqueMat = new THREE.MeshBasicMaterial({
      color: 0xc0a066,
    });
    const plaqueGeo = new THREE.PlaneGeometry(0.52, 0.12);
    sideZs.forEach((z) => {
      const leftPlaque = new THREE.Mesh(plaqueGeo, plaqueMat);
      leftPlaque.position.set(-HALL_W / 2 + WALL_EPS * 1.5, 0.92, z);
      leftPlaque.rotation.y = Math.PI / 2;
      scene.add(leftPlaque);

      const rightPlaque = new THREE.Mesh(plaqueGeo, plaqueMat);
      rightPlaque.position.set(HALL_W / 2 - WALL_EPS * 1.5, 0.92, z);
      rightPlaque.rotation.y = -Math.PI / 2;
      scene.add(rightPlaque);
    });

    addFrame({
      x: 0, y: 1.9, z: HALL_Z_END + WALL_EPS, ry: 0,
      w: 2.7, h: 1.85, thick: 0.18, artUrl: CENTERPIECE_ART,
    });

		// these should really move to the top
    const centerPlaque = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.16), plaqueMat);
    centerPlaque.position.set(0, 0.78, HALL_Z_END + WALL_EPS * 1.5);
    scene.add(centerPlaque);

    scene.add(new THREE.AmbientLight(0xffffff, 0.01));

    const lanternPostMat = new THREE.MeshBasicMaterial({ color: 0x2d2117 });
    const lanternGlowMat = new THREE.MeshBasicMaterial({ color: 0xffd88a, fog: false });
    const lanternPostGeo = new THREE.CylinderGeometry(0.04, 0.055, 0.8, 6);
    const lanternGlowGeo = new THREE.SphereGeometry(0.12, 8, 6);
    const polePoolMat = new THREE.MeshBasicMaterial({
      color: 0x8d5f2e,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const poleInnerPoolMat = new THREE.MeshBasicMaterial({
      color: 0xd6964c,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const polePoolGeo = new THREE.CircleGeometry(0.44, 20);
    const poleInnerPoolGeo = new THREE.CircleGeometry(0.26, 18);
    const pathLights = [];
    [-3.5, 0, 3.5, 7.0, 10.5].forEach((z) => {
      [-1, 1].forEach((side) => {
        const post = new THREE.Mesh(lanternPostGeo, lanternPostMat);
        post.position.set(side * 1.35, 0.4, z);
        scene.add(post);
        const glow = new THREE.Mesh(lanternGlowGeo, lanternGlowMat);
        glow.position.set(side * 1.35, 0.84, z);
        scene.add(glow);
        const pool = new THREE.Mesh(polePoolGeo, polePoolMat.clone());
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(side * 1.35, 0.011, z);
        pool.scale.set(1.0, 0.58, 1);
        scene.add(pool);
        const innerPool = new THREE.Mesh(poleInnerPoolGeo, poleInnerPoolMat.clone());
        innerPool.rotation.x = -Math.PI / 2;
        innerPool.position.set(side * 1.35, 0.014, z);
        innerPool.scale.set(1.0, 0.62, 1);
        scene.add(innerPool);
        pathLights.push({ glow, pool, innerPool, phase: z * 0.9 + side });
      });
    });

    sideZs.forEach((z) => {
      [-1, 1].forEach((side) => {
        if (z === -9.5) return;
        const post = new THREE.Mesh(lanternPostGeo, lanternPostMat);
        post.position.set(side * 2.2, 0.4, z + 0.85);
        scene.add(post);
        const glow = new THREE.Mesh(lanternGlowGeo, lanternGlowMat);
        glow.position.set(side * 2.2, 0.84, z + 0.85);
        scene.add(glow);
        const pool = new THREE.Mesh(polePoolGeo, polePoolMat.clone());
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(side * 2.2, 0.011, z + 0.85);
        pool.scale.set(0.95, 0.52, 1);
        scene.add(pool);
        const innerPool = new THREE.Mesh(poleInnerPoolGeo, poleInnerPoolMat.clone());
        innerPool.rotation.x = -Math.PI / 2;
        innerPool.position.set(side * 2.2, 0.014, z + 0.85);
        innerPool.scale.set(0.95, 0.58, 1);
        scene.add(innerPool);
        pathLights.push({ glow, pool, innerPool, phase: z * 0.6 + side });
      });
    });

    const trunkMat = new THREE.MeshBasicMaterial({ color: 0x4b321d });
    const leafMat = new THREE.MeshBasicMaterial({
      color: 0x3f7f45,
      side: THREE.DoubleSide,
    });
		// these are soooooo shit
    const leafShadeMats = [
      new THREE.MeshBasicMaterial({ color: 0x2e6237, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0x24502f, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0x183620, side: THREE.DoubleSide }),
    ];
    const makeLeafGeo = (len, width, curve) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(len * 0.38, width * (0.75 + curve), len, 0);
      shape.quadraticCurveTo(len * 0.38, -width * (0.55 - curve * 0.25), 0, 0);
      return new THREE.ShapeGeometry(shape, 8);
    };
    const leafGeo = makeLeafGeo(2.35, 0.34, 0.12);
    const longLeafGeo = makeLeafGeo(3.1, 0.3, 0.2);

    const addPalm = (x, z, tilt = 0) => {
      const g = new THREE.Group();
      const bend = x < 0 ? 0.55 : -0.55;
      const trunkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.1, 0),
        new THREE.Vector3(bend * 0.18, 2.0, 0.05),
        new THREE.Vector3(bend * 0.46 + tilt * 2.2, 4.45, -0.08),
        new THREE.Vector3(bend * 0.7 + tilt * 3.0, 6.35, 0.08),
      ]);
      const trunk = new THREE.Mesh(new THREE.TubeGeometry(trunkCurve, 9, 0.15, 6, false), trunkMat);
      g.add(trunk);
      const crownX = bend * 0.7 + tilt * 3.0;
      const crownY = 6.35;
      for (let i = 0; i < 8; i++) {
        const leaf = new THREE.Mesh(leafGeo, leafShadeMats[Math.min(2, Math.floor(i / 3))]);
        const a = (i / 8) * Math.PI * 2;
        leaf.position.set(
          crownX + Math.cos(a) * 0.35,
          crownY - Math.abs(Math.sin(i * 1.3)) * 0.14,
          Math.sin(a) * 1.0,
        );
        leaf.rotation.y = a;
        leaf.rotation.z = -0.75 - (i % 3) * 0.16;
        leaf.rotation.x = Math.sin(a) * 0.22;
        g.add(leaf);
      }
      const leanTowardHall = x < 0 ? 1 : -1;
      for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(longLeafGeo, leafMat);
        leaf.position.set(crownX + leanTowardHall * (0.55 + i * 0.22), crownY - 0.38 - i * 0.12, -0.55 + i * 0.35);
        leaf.rotation.y = leanTowardHall > 0 ? Math.PI / 2 : -Math.PI / 2;
        leaf.rotation.z = leanTowardHall * (0.12 + i * 0.08) - 0.45;
        leaf.rotation.x = -0.18 + i * 0.05;
        g.add(leaf);
      }
      g.position.set(x, 0, z);
      scene.add(g);
    };
    addPalm(-4.6, -2.5, 0.08);
    addPalm(4.8, -6.0, -0.05);
    addPalm(-5.0, -9.5, 0.12);
    addPalm(5.2, -12.0, -0.1);
    addPalm(-4.4, 2.0, 0.06);
    addPalm(4.6, 4.5, -0.04);
    addPalm(-5.3, 8.4, 0.1);
    addPalm(5.1, 9.5, -0.08);
    addPalm(5.45, -2.4, -0.22);
    addPalm(5.75, -8.2, -0.24);
    addPalm(5.55, 6.6, -0.2);
    addPalm(5.65, 2.6, -0.24);

    // ——— People silhouettes standing in front of some paintings ———
    const personMat = new THREE.MeshBasicMaterial({ color: 0x000000, fog: false });
    const personBodyGeo = new THREE.CylinderGeometry(0.22, 0.3, 1.4, 8);
    const personHeadGeo = new THREE.SphereGeometry(0.16, 8, 6);
    const armGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.85, 6);
    const personPoolMat = new THREE.MeshBasicMaterial({
      color: 0xb8864c,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const personPoolGeo = new THREE.CircleGeometry(0.42, 18);

    const addPerson = (x, z, ry = 0, scale = 1) => {
      const pool = new THREE.Mesh(personPoolGeo, personPoolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(x, 0.012, z);
      pool.scale.set(0.8 * scale, 0.42 * scale, 1);
      scene.add(pool);

      const g = new THREE.Group();
      const body = new THREE.Mesh(personBodyGeo, personMat);
      body.position.y = 0.8;
      g.add(body);
      const head = new THREE.Mesh(personHeadGeo, personMat);
      head.position.y = 1.65;
      g.add(head);
      [-1, 1].forEach((side) => {
        const arm = new THREE.Mesh(armGeo, personMat);
        arm.position.set(side * 0.25, 1.05, 0.02);
        arm.rotation.z = side * 0.28;
        g.add(arm);
      });
      g.position.set(x, 0, z);
      g.rotation.y = ry;
      g.scale.setScalar(scale);
      scene.add(g);
    };
    addPerson(-1.1, -5.4, Math.PI / 2, 1.0);
    addPerson(1.0, -1.3, -Math.PI / 2, 0.92);
    addPerson(-1.35, -1.7, Math.PI / 2, 0.82);
    addPerson(1.4, -9.2, -Math.PI / 2, 1.06);
    addPerson(-1.0, -9.8, Math.PI / 2, 0.9);
    addPerson(0.25, 1.4, 0.15, 0.8);
    addPerson(-1.05, HALL_Z_END + 1.35, 0.08, 0.95);
    addPerson(1.0, HALL_Z_END + 1.55, -0.08, 0.88);
    addPerson(0.15, HALL_Z_END + 2.05, 0, 0.76);

    const pebbleMat = new THREE.MeshBasicMaterial({ color: 0x211b14 });
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x3a2e20 });
    const pebbleGeo = new THREE.SphereGeometry(0.06, 6, 4);
    const shellGeo = new THREE.CapsuleGeometry(0.045, 0.13, 3, 6);
    for (let i = 0; i < 20; i++) {
      const side = i % 2 ? 1 : -1;
      const z = HALL_Z_START - 1.2 - (i * 1.05) % (HALL_LEN - 2.5);
      const x = side * (1.35 + ((i * 1.73) % 1.25));
      const detail = new THREE.Mesh(i % 4 === 0 ? shellGeo : pebbleGeo, i % 4 === 0 ? shellMat : pebbleMat);
      detail.position.set(x, 0.045, z);
      detail.rotation.set((i * 0.8) % Math.PI, (i * 1.4) % Math.PI, (i * 0.3) % Math.PI);
      detail.scale.setScalar(0.75 + (i % 5) * 0.1);
      scene.add(detail);
    }

		// TODO: these look like shit and i need to change these to maybe be angled dif? idk
    const birdMat = new THREE.MeshBasicMaterial({ color: 0xc4c9d6, fog: false });
    const birdGeo = new THREE.BufferGeometry();
    birdGeo.setAttribute('position', new THREE.Float32BufferAttribute([
      // two wings as triangles meeting at body center
      -0.32, 0.00, 0.00,
       0.00, 0.00, 0.00,
      -0.18, 0.09, 0.04,
       0.32, 0.00, 0.00,
       0.00, 0.00, 0.00,
       0.18, 0.09, 0.04,
    ], 3));
    const BIRD_COUNT = 13;
    const birds = [];
    for (let i = 0; i < BIRD_COUNT; i++) {
      const mesh = new THREE.Mesh(birdGeo, birdMat);
      const scale = 0.7 + (i % 5) * 0.16;
      mesh.scale.setScalar(scale);
      scene.add(mesh);
      birds.push({
        mesh,
        offset: i / BIRD_COUNT,
        lane: (i % 5) - 2,
        yJit: (i * 0.37) % 1,
        speed: 0.028 + (i % 4) * 0.008,
      });
    }

    let cols = 140;
    let rows = 70;
    let responsiveFov = 70;
    let lastFontSize = FONT_SIZE;
    let pixelBuffer = new Uint8Array(cols * rows * 4);
    renderer.setSize(cols, rows, false);

    const gl = renderer.getContext();

    const resize = () => {
      if (!wrapRef.current) return;
      const W = wrapRef.current.clientWidth;
      const H = wrapRef.current.clientHeight;
      if (W <= 0 || H <= 0) return;
      const p = progressRef.current;
      const shrinkT = Math.max(0, Math.min(1, (p - 0.25) / 0.75));
      const easedShrink = shrinkT * shrinkT * (3 - 2 * shrinkT);
      const fontSize = FONT_SIZE + (MIN_FONT_SIZE - FONT_SIZE) * easedShrink;
      const charW = fontSize * 0.6;
      const charH = fontSize * LINE_HEIGHT;
      if (Math.abs(fontSize - lastFontSize) > 0.02 && preRef.current) {
        lastFontSize = fontSize;
        preRef.current.style.fontSize = `${fontSize}px`;
        preRef.current.style.lineHeight = `${charH}px`;
      }
      const newCols = Math.max(20, Math.min(340, Math.floor(W / charW)));
      const newRows = Math.max(10, Math.min(340, Math.floor(H / charH)));
      const viewAspect = (newCols * charW) / (newRows * charH);
      const desiredFov = Math.max(70, Math.min(112, 70 + Math.max(0, 1.25 - viewAspect) * 84));
      const sizeChanged = newCols !== cols || newRows !== rows;
      if (sizeChanged) {
        cols = newCols;
        rows = newRows;
        pixelBuffer = new Uint8Array(cols * rows * 4);
        renderer.setSize(cols, rows, false);
      }
      camera.aspect = viewAspect;
      responsiveFov = desiredFov;
      camera.fov = responsiveFov;
      camera.updateProjectionMatrix();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current);

    const smoothstep = (a, b, v) => {
      const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    const rampLen = RAMP.length;

    let rafId;
    const tick = (timeMs) => {
      const t = timeMs * 0.001;
      const p = progressRef.current;
      resize();

      const walkT = smoothstep(0, 0.75, p);
      const aspect = camera.aspect || 1;
      const finalT = smoothstep(0.72, 1.0, p);
      const tallViewPullback = Math.max(0, 0.95 - aspect) * 5.6 * (1 - finalT * 0.65);
      const startZ = 5.8;
      const endZ = HALL_Z_END + 3.0;
      const settledT = smoothstep(0.93, 1.0, p);
      const finalBreath = Math.sin(t * 0.75) * 0.045 * settledT;
      const camZ = startZ + tallViewPullback + (endZ - startZ) * walkT + finalBreath;
      const bobDamp = 1 - smoothstep(0.6, 1, p);
      const camY = 1.36 + Math.max(0, 0.9 - aspect) * 0.18 + Math.sin(t * 3.0) * 0.04 * bobDamp + Math.sin(t * 0.62 + 1.2) * 0.018 * settledT;
      const camX = Math.sin(t * 1.4) * 0.05 * bobDamp + Math.sin(t * 0.5) * 0.012 * settledT;
      camera.position.set(camX, camY, camZ);

      const targetY = 1.3 + (1.9 - 1.3) * finalT;
      const targetZ = HALL_Z_END + 0.35 * (1 - finalT);
      camera.fov = responsiveFov;
      camera.updateProjectionMatrix();
      camera.lookAt(0, targetY, targetZ);

      for (let i = 0; i < waveBands.length; i++) {
        const w = waveBands[i];
        w.mesh.position.x = w.baseX + Math.sin(t * 0.7 + w.phase) * 0.55;
        w.mesh.scale.x = 1 + Math.sin(t * 0.9 + w.phase) * 0.04;
      }

      for (let i = 0; i < wallRings.length; i++) {
        const r = wallRings[i];
        const breath = 1 + Math.sin(t * r.speed + r.phase) * 0.08;
        r.mesh.scale.set(r.baseX * breath, r.baseY * (1 + Math.sin(t * (r.speed * 0.87) + r.phase + 0.6) * 0.07), 1);
        r.mesh.material.opacity = r.baseOpacity * (0.82 + Math.sin(t * (r.speed * 1.2) + r.phase) * 0.18);
      }

      for (let i = 0; i < pathLights.length; i++) {
        const l = pathLights[i];
        const glow = 0.7 + Math.sin(t * 2.2 + l.phase) * 0.18;
        l.glow.scale.setScalar(glow);
        const pool = 0.92 + Math.sin(t * 1.25 + l.phase) * 0.12;
        l.pool.scale.set(1.0 * pool, 0.58 * pool, 1);
        l.pool.material.opacity = 0.2 + glow * 0.08;
        l.innerPool.scale.set(1.0 * pool, 0.62 * pool, 1);
        l.innerPool.material.opacity = 0.34 + glow * 0.1;
      }

      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];
        const phase = ((p * 1.15 + t * b.speed + b.offset) % 1 + 1) % 1;
        const x = -7.2 + phase * 14.4;
        const z = 2.5 - b.lane * 0.7 + Math.sin(t * 0.45 + i) * 0.45;
        const y = HALL_H + 0.85 + Math.sin(t * 1.8 + i * 1.3) * 0.28 + b.yJit * 0.28;
        b.mesh.position.set(x, y, z);
        b.mesh.rotation.z = Math.sin(t * 7 + i) * 0.5;
        b.mesh.rotation.y = Math.PI / 2 + Math.sin(t * 0.7 + i) * 0.2;
      }

      renderer.render(scene, camera);

			// i should lowkey add color here i don't think it's horrible
      gl.readPixels(0, 0, cols, rows, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuffer);

      const parts = new Array(rows);
      for (let y = rows - 1; y >= 0; y--) {
        const rowStart = y * cols * 4;
        let line = '';
        for (let x = 0; x < cols; x++) {
          const i = rowStart + x * 4;
          const lum = (0.299 * pixelBuffer[i] + 0.587 * pixelBuffer[i + 1] + 0.114 * pixelBuffer[i + 2]) / 255;
          const dither = (DITHER_4X4[(x & 3) + ((y & 3) << 2)] - 7.5) / 255;
          const lifted = lum < 0.035 ? 0 : Math.pow(Math.max(0, lum + 0.035 + dither), 0.56) * 0.84;
          const idx = Math.min(rampLen - 1, Math.max(0, Math.floor(lifted * rampLen)));
          line += RAMP[idx];
        }
        parts[rows - 1 - y] = line;
      }
      if (preRef.current) preRef.current.textContent = parts.join('\n');

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <pre
        ref={preRef}
        style={{
          color,
          fontFamily: 'var(--mono)',
          fontSize: FONT_SIZE,
          lineHeight: `${FONT_SIZE * LINE_HEIGHT}px`,
          margin: 0,
          padding: 0,
          letterSpacing: 0,
          whiteSpace: 'pre',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
