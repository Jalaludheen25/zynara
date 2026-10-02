'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
  An abstract city at night with an illuminated route moving through it —
  a nod to the Zynara mark and the original hero artwork. Everything is
  procedural (no textures or models) and drawn with a handful of shaders.
*/

type Pointer = { x: number; y: number; active: number }

type SceneProps = {
  pointer: React.RefObject<Pointer>
  reducedMotion: boolean
  onReady: () => void
}

const ROUTE_POINTS: [number, number][] = [
  [-21, 11],
  [-14, 7.5],
  [-8.5, 6.8],
  [-4, 4.2],
  [-0.5, 0.6],
  [3.4, -1.6],
  [8.5, -2.4],
  [12.5, -6.2],
  [16.5, -10.5],
  [23, -13],
]

function createRoute() {
  return new THREE.CatmullRomCurve3(
    ROUTE_POINTS.map(([x, z]) => new THREE.Vector3(x, 0.04, z)),
    false,
    'catmullrom',
    0.5,
  )
}

// Deterministic PRNG so the skyline is identical on every visit.
function prng(seed: number) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function buildCity(curve: THREE.CatmullRomCurve3, compact: boolean) {
  const SAMPLES = 360
  const samples = curve.getSpacedPoints(SAMPLES)
  const cols = compact ? 30 : 44
  const rows = compact ? 26 : 26
  const rand = prng(20260)
  const towers: number[] = [] // x, z, w, d, h, proximity, routeT, random

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (i % 6 === 0 || j % 5 === 0) continue // street grid
      const x = (i - cols / 2) * 1.05 + 0.5
      const z = (j - rows / 2) * 1.05 + 0.5

      let best = Infinity
      let bestK = 0
      for (let k = 0; k <= SAMPLES; k++) {
        const dx = samples[k].x - x
        const dz = samples[k].z - z
        const d = dx * dx + dz * dz
        if (d < best) {
          best = d
          bestK = k
        }
      }
      const dist = Math.sqrt(best)
      if (dist < 1.15) continue // carve the route through the city
      if (rand() < 0.12) continue

      const skyline = THREE.MathUtils.smoothstep(x * 0.45 - z, -6, 14)
      const r = rand()
      const h = 0.22 + Math.pow(r, 2.2) * (0.9 + skyline * 5.4) + (dist < 2.6 ? 0.25 : 0)
      towers.push(
        x + (rand() - 0.5) * 0.12,
        z + (rand() - 0.5) * 0.12,
        0.48 + rand() * 0.32,
        0.48 + rand() * 0.32,
        h,
        Math.exp(-(dist - 1.15) * 0.5),
        bestK / SAMPLES,
        rand(),
      )
    }
  }
  return new Float32Array(towers)
}

function buildRibbon(curve: THREE.CatmullRomCurve3, segments: number, halfWidth: number) {
  const positions = new Float32Array((segments + 1) * 6)
  const uvs = new Float32Array((segments + 1) * 4)
  const index: number[] = []
  const p = new THREE.Vector3()
  const tan = new THREE.Vector3()
  for (let s = 0; s <= segments; s++) {
    const t = s / segments
    curve.getPointAt(t, p)
    curve.getTangentAt(t, tan)
    const nx = -tan.z
    const nz = tan.x
    const len = Math.hypot(nx, nz) || 1
    positions.set([p.x + (nx / len) * halfWidth, 0.012, p.z + (nz / len) * halfWidth], s * 6)
    positions.set([p.x - (nx / len) * halfWidth, 0.012, p.z - (nz / len) * halfWidth], s * 6 + 3)
    uvs.set([t, 0, t, 1], s * 4)
    if (s < segments) {
      const a = s * 2
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(index)
  return geometry
}

/* --------------------------------- Shaders -------------------------------- */

const common = /* glsl */ `
  uniform float uTime;
  uniform float uGrow;
  uniform vec3 uPointer;
  uniform vec3 uViolet;
  uniform vec3 uCyan;
  uniform vec3 uFog;
  float pulseAt(float t) {
    float d = abs(t - fract(uTime * 0.045));
    d = min(d, 1.0 - d);
    return exp(-d * d * 520.0);
  }
`

const towerVertex = /* glsl */ `
  ${common}
  attribute vec4 aData; // height, proximity, routeT, random
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vScale;
  varying vec2 vUv;
  varying vec4 vData;
  varying float vLocalY;
  void main() {
    float delay = aData.z * 0.55 + aData.w * 0.25;
    float g = clamp((uGrow * 1.8 - delay) / 0.9, 0.0, 1.0);
    g = 1.0 - pow(1.0 - g, 3.0);
    vec3 pos = position;
    pos.y *= max(g, 0.002);
    vec4 world = modelMatrix * instanceMatrix * vec4(pos, 1.0);
    vWorld = world.xyz;
    vScale = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz) * g, length(instanceMatrix[2].xyz));
    vNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
    vUv = uv;
    vData = aData;
    vLocalY = position.y;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const towerFragment = /* glsl */ `
  ${common}
  uniform vec3 uBase;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vScale;
  varying vec2 vUv;
  varying vec4 vData;
  varying float vLocalY;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    vec3 n = abs(vNormal);
    bool isTop = n.y > 0.5;
    vec2 size = isTop ? vScale.xz : (n.x > 0.5 ? vScale.zy : vScale.xy);
    vec2 p = vUv * size;
    vec2 e = min(p, size - p);
    float d = min(e.x, e.y);
    float edge = 1.0 - smoothstep(0.0, 0.012 + fwidth(d) * 1.5, d);

    float prox = vData.y;
    float routeT = vData.z;
    vec3 tint = mix(uViolet, uCyan, clamp(routeT * 1.15, 0.0, 1.0));

    float light = dot(vNormal, normalize(vec3(-0.45, 0.75, 0.6))) * 0.5 + 0.5;
    vec3 col = uBase * (0.45 + 0.55 * light) * mix(0.5, 1.2, vLocalY);

    // window grid on the facades
    float floorIdx = floor(p.y * 6.0);
    float colIdx = floor(p.x * 5.0);
    float win = step(0.42, fract(p.y * 6.0)) * step(0.38, fract(p.x * 5.0));
    float lit = step(0.7, hash(floorIdx * 7.13 + colIdx * 3.7 + vData.w * 91.7));
    float flicker = 0.75 + 0.25 * sin(uTime * 0.8 + vData.w * 40.0);
    float facade = isTop ? 0.0 : win * lit * flicker;

    float pulse = pulseAt(routeT) * prox;
    float hover = exp(-pow(distance(vWorld.xz, uPointer.xz), 2.0) * 0.09) * uPointer.y;
    float glow = prox * 0.32 + pulse * 1.6 + hover * 1.1;

    col += tint * edge * (0.14 + glow * 0.9);
    col += mix(vec3(0.55, 0.65, 1.0), tint, 0.5) * facade * (0.09 + glow * 0.35);
    col += tint * (isTop ? 0.05 + glow * 0.2 : 0.0);
    col += tint * prox * pow(1.0 - vLocalY, 3.0) * 0.35 * (isTop ? 0.0 : 1.0);

    float fog = smoothstep(13.0, 36.0, distance(vWorld, cameraPosition));
    gl_FragColor = vec4(mix(col, uFog, fog), 1.0);
  }
`

const groundVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const groundFragment = /* glsl */ `
  ${common}
  varying vec3 vWorld;
  void main() {
    vec2 coord = vWorld.xz / 1.05;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);
    float hover = exp(-pow(distance(vWorld.xz, uPointer.xz), 2.0) * 0.05) * uPointer.y;
    vec3 col = uFog + vec3(0.32, 0.36, 0.95) * line * (0.05 + hover * 0.22);
    col += mix(uViolet, uCyan, 0.5) * hover * 0.05;
    float fog = smoothstep(12.0, 34.0, distance(vWorld, cameraPosition));
    gl_FragColor = vec4(mix(col, uFog, fog), 1.0);
  }
`

const routeVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const routeFragment = /* glsl */ `
  ${common}
  uniform float uIntensity;
  uniform float uSoft;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    if (vUv.x > uGrow * 1.25) discard;
    float flow = fract(vUv.x * 5.0 - uTime * 0.18);
    float streak = smoothstep(0.0, 0.2, flow) * (1.0 - smoothstep(0.2, 0.3, flow));
    float pulse = pulseAt(vUv.x);
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float soft = mix(1.0, pow(facing, 2.5), uSoft);
    vec3 col = mix(uViolet, uCyan, vUv.x);
    float a = (0.6 + streak * 0.55 + pulse * 2.6) * soft * uIntensity;
    gl_FragColor = vec4(col * a + vec3(pulse * 0.35 * uIntensity), 1.0);
  }
`

const ribbonFragment = /* glsl */ `
  ${common}
  varying vec2 vUv;
  void main() {
    if (vUv.x > uGrow * 1.25) discard;
    float across = exp(-pow((vUv.y - 0.5) * 5.0, 2.0));
    float pulse = pulseAt(vUv.x);
    vec3 col = mix(uViolet, uCyan, vUv.x);
    gl_FragColor = vec4(col * across * (0.24 + pulse * 0.6), 1.0);
  }
`

const ribbonVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const pointsVertex = /* glsl */ `
  ${common}
  attribute float aSeed;
  uniform float uSize;
  uniform float uRise;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec3 pos = position;
    pos.y = mod(pos.y + uTime * uRise * (0.3 + aSeed), 7.5) + 0.2;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.5 + aSeed) * (14.0 / -mv.z);
    vAlpha = (0.35 + 0.65 * sin(uTime * (0.6 + aSeed) + aSeed * 30.0) * 0.5 + 0.5) * uGrow;
    vAlpha *= 1.0 - smoothstep(14.0, 34.0, -mv.z);
    vSeed = aSeed;
    gl_Position = projectionMatrix * mv;
  }
`

const pointsFragment = /* glsl */ `
  ${common}
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uViolet, uCyan, vSeed);
    gl_FragColor = vec4(col * a * vAlpha + vec3(a * a * vAlpha * 0.3), 1.0);
  }
`

/* ---------------------------------- Scene --------------------------------- */

function City({ pointer, reducedMotion, onReady }: SceneProps) {
  const { size, camera } = useThree()
  const compact = size.width < 768
  const curve = useMemo(createRoute, [])
  const towers = useMemo(() => buildCity(curve, compact), [curve, compact])
  const count = towers.length / 8

  const uniforms = useMemo(
    () => ({
      uTime: { value: reducedMotion ? 6 : 0 },
      uGrow: { value: reducedMotion ? 1 : 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
      uViolet: { value: new THREE.Color('#5a3bff') },
      uCyan: { value: new THREE.Color('#22d0fc') },
      uFog: { value: new THREE.Color('#080d1b') },
    }),
    [reducedMotion],
  )

  const materials = useMemo(() => {
    const base = { uniforms, depthWrite: true }
    return {
      tower: new THREE.ShaderMaterial({
        ...base,
        uniforms: { ...uniforms, uBase: { value: new THREE.Color('#141c3a') } },
        vertexShader: towerVertex,
        fragmentShader: towerFragment,
      }),
      ground: new THREE.ShaderMaterial({ ...base, vertexShader: groundVertex, fragmentShader: groundFragment }),
      routeCore: new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uIntensity: { value: 1.7 }, uSoft: { value: 0 } },
        vertexShader: routeVertex,
        fragmentShader: routeFragment,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      routeHalo: new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uIntensity: { value: 0.34 }, uSoft: { value: 1 } },
        vertexShader: routeVertex,
        fragmentShader: routeFragment,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      ribbon: new THREE.ShaderMaterial({
        uniforms,
        vertexShader: ribbonVertex,
        fragmentShader: ribbonFragment,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      motes: new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uSize: { value: 2.6 }, uRise: { value: 0.12 } },
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
      cars: new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uSize: { value: 7 }, uRise: { value: 0 } },
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    }
  }, [uniforms])

  const geometries = useMemo(() => {
    const box = new THREE.BoxGeometry(1, 1, 1)
    box.translate(0, 0.5, 0)
    const data = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) data.set([towers[i * 8 + 4], towers[i * 8 + 5], towers[i * 8 + 6], towers[i * 8 + 7]], i * 4)
    box.setAttribute('aData', new THREE.InstancedBufferAttribute(data, 4))

    const moteCount = compact ? 110 : 220
    const motes = new THREE.BufferGeometry()
    const motePos = new Float32Array(moteCount * 3)
    const moteSeed = new Float32Array(moteCount)
    const rand = prng(7)
    for (let i = 0; i < moteCount; i++) {
      motePos.set([(rand() - 0.5) * 40, rand() * 7.5, (rand() - 0.5) * 30], i * 3)
      moteSeed[i] = rand()
    }
    motes.setAttribute('position', new THREE.BufferAttribute(motePos, 3))
    motes.setAttribute('aSeed', new THREE.BufferAttribute(moteSeed, 1))

    const carCount = 16
    const cars = new THREE.BufferGeometry()
    cars.setAttribute('position', new THREE.BufferAttribute(new Float32Array(carCount * 3), 3))
    cars.setAttribute('aSeed', new THREE.BufferAttribute(Float32Array.from({ length: carCount }, (_, i) => i / carCount), 1))

    return {
      box,
      motes,
      cars,
      carCount,
      routeCore: new THREE.TubeGeometry(curve, 700, 0.035, 6, false),
      routeHalo: new THREE.TubeGeometry(curve, 400, 0.24, 10, false),
      ribbon: buildRibbon(curve, 400, 1.1),
      ground: new THREE.PlaneGeometry(90, 70).rotateX(-Math.PI / 2),
    }
  }, [curve, towers, count, compact])

  const instRef = useRef<THREE.InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = instRef.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const pos = new THREE.Vector3()
    const scale = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const o = i * 8
      pos.set(towers[o], 0, towers[o + 1])
      scale.set(towers[o + 2], towers[o + 4], towers[o + 3])
      mesh.setMatrixAt(i, m.compose(pos, q, scale))
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [towers, count])

  useEffect(
    () => () => {
      Object.values(materials).forEach((mat) => mat.dispose())
      Object.values(geometries).forEach((geo) => typeof geo === 'object' && 'dispose' in geo && geo.dispose())
    },
    [materials, geometries],
  )

  // Camera framing per aspect ratio
  const rig = useMemo(() => {
    const portrait = size.width / size.height < 1
    return {
      base: portrait ? new THREE.Vector3(0.5, 8.2, 13.5) : new THREE.Vector3(-0.5, 7.4, 15.5),
      look: portrait ? new THREE.Vector3(1.5, -1.2, 0.5) : new THREE.Vector3(2.6, 0.2, -1.5),
      fov: portrait ? 50 : 34,
    }
  }, [size.width, size.height])

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.fov = rig.fov
    cam.position.copy(rig.base)
    cam.lookAt(rig.look)
    cam.updateProjectionMatrix()
  }, [camera, rig])

  const ready = useRef(false)
  const target = useMemo(() => new THREE.Vector3(), [])
  const lookAt = useMemo(() => new THREE.Vector3(), [])
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])
  const carPoint = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20)
    const p = pointer.current ?? { x: 0, y: 0, active: 0 }

    if (!reducedMotion) {
      uniforms.uTime.value += delta
      uniforms.uGrow.value = Math.min(1, uniforms.uGrow.value + delta / 2.6)
    }

    // Scroll + pointer parallax
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.2)
    target.set(rig.base.x + p.x * 1.5, rig.base.y + p.y * 0.8 + scroll * 2.4, rig.base.z - scroll * 3.5)
    const k = reducedMotion ? 1 : 1 - Math.exp(-delta * 2.4)
    state.camera.position.lerp(target, k)
    lookAt.set(rig.look.x + p.x * 0.5, rig.look.y - scroll * 0.6, rig.look.z)
    state.camera.lookAt(lookAt)

    // Light the city beneath the cursor
    ndc.set(p.x, p.y)
    ray.setFromCamera(ndc, state.camera)
    if (ray.ray.intersectPlane(plane, hit)) {
      uniforms.uPointer.value.x += (hit.x - uniforms.uPointer.value.x) * Math.min(1, delta * 8)
      uniforms.uPointer.value.z += (hit.z - uniforms.uPointer.value.z) * Math.min(1, delta * 8)
    }
    uniforms.uPointer.value.y += (p.active - uniforms.uPointer.value.y) * Math.min(1, delta * 3)

    // Lights travelling along the route
    const attr = geometries.cars.getAttribute('position') as THREE.BufferAttribute
    for (let i = 0; i < geometries.carCount; i++) {
      const dir = i % 2 === 0 ? 1 : -1
      const t = (((uniforms.uTime.value * 0.018 * (0.8 + (i % 5) * 0.12) * dir + i / geometries.carCount) % 1) + 1) % 1
      curve.getPointAt(t, carPoint)
      attr.setXYZ(i, carPoint.x, 0.12, carPoint.z)
    }
    attr.needsUpdate = true

    if (!ready.current) {
      ready.current = true
      requestAnimationFrame(onReady)
    }
  })

  return (
    <>
      <mesh geometry={geometries.ground} material={materials.ground} />
      <mesh geometry={geometries.ribbon} material={materials.ribbon} renderOrder={1} />
      <instancedMesh ref={instRef} args={[geometries.box, materials.tower, count]} frustumCulled={false} />
      <mesh geometry={geometries.routeHalo} material={materials.routeHalo} renderOrder={2} />
      <mesh geometry={geometries.routeCore} material={materials.routeCore} renderOrder={3} />
      <points geometry={geometries.cars} material={materials.cars} renderOrder={4} frustumCulled={false} />
      <points geometry={geometries.motes} material={materials.motes} renderOrder={4} frustumCulled={false} />
    </>
  )
}

export default function HeroScene({
  active,
  pointer,
  reducedMotion,
  onReady,
}: SceneProps & { active: boolean }) {
  return (
    <Canvas
      flat
      linear
      dpr={[1, 1.6]}
      frameloop={reducedMotion ? 'demand' : active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 34, near: 0.5, far: 80, position: [-0.5, 7.4, 15.5] }}
      onCreated={({ gl }) => gl.setClearColor('#080d1b')}
      aria-hidden="true"
    >
      <City pointer={pointer} reducedMotion={reducedMotion} onReady={onReady} />
    </Canvas>
  )
}
