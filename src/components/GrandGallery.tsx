import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../lib/types'
import { viewsOf } from '../lib/products'
import { maisonOf } from '../lib/maisons'
import { Link } from 'react-router-dom'
import { useMoney } from '../lib/currency'
import { useSeckillCountdown } from '../lib/hooks'
import ProductImage from './ProductImage'

/**
 * 大画廊：今日沙龙的六件，挂进一间白雾房间。拖动环视，悬停读展签，点击走近（进详情页）。
 *
 * 三维的用法必须服从冷调单色：纯白虚空 + 白雾造景深，画作按 3:4 装墨黑细框挂在弧线上，
 * 相机站在弧心。没有墙——墙是雾暗示出来的（本店连房间也只送到「暗示」为止）。
 * 动效遵家规：昂贵地慢（阻尼 lerp，无弹跳），reduced-motion 关掉待机漂移与视差，拖动照常。
 *
 * 工程约束：three (~160KB gz) 绝不进主包——IntersectionObserver 进入视口才动态 import；
 * DPR 封顶 2；卸载时全量 dispose（几何/材质/纹理/renderer）。
 * 贴图走 SRGBColorSpace（.claude/skills/threejs-textures 的第一条军规）。
 */

export default function GrandGallery({ pieces }: { pieces: Product[] }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()
  const money = useMoney()
  const [hovered, setHovered] = useState<Product | null>(null)
  const hoveredRef = useRef<Product | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const countdown = useSeckillCountdown()

  useEffect(() => {
    const el = wrap.current
    const canvas = canvasRef.current
    if (!el || !canvas || pieces.length === 0) return

    let disposed = false
    let cleanup: (() => void) | null = null

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        void init()
      },
      { rootMargin: '300px' },
    )
    io.observe(el)

    async function init() {
      try {
        await initScene()
      } catch {
        // WebGL 不可用（老设备/被禁用）：整节安静退场，同样的六件就在下面的沙龙里
        setFailed(true)
      }
    }

    async function initScene() {
      const THREE = await import('three')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (disposed || !el || !canvas) return

      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xffffff)
      // 雾仍在，但推远一档：先让墙被读到，再让它沉进纸白
      scene.fog = new THREE.Fog(0xffffff, 9, 22)

      const camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 0.1, 40)
      // 站姿：视线略低于画心，微微仰视——看画的人本来就该这么站
      camera.position.set(0, -0.15, 0)

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(el.clientWidth, el.clientHeight)
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      // ACES + 环境光照（IBL）：skills/procedural-3d-realism 的第一军规——
      // 「3D 资产」与「被拍下来的物体」之间隔着的就是这一步
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.12
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      const pmrem = new THREE.PMREMGenerator(renderer)
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      scene.environment = envTex

      // 灯光：三灯制冷调版——近乎不可察的暖主光 + 冷灰半球补光（自然的冷暖对比，
      // 幅度压到单色体系察觉不到的程度），影子交给主光
      const hemi = new THREE.HemisphereLight(0xffffff, 0xcfd4da, 0.55)
      const key = new THREE.DirectionalLight(0xfff4ea, 1.35)
      key.position.set(4, 7, 6)
      key.castShadow = true
      key.shadow.mapSize.set(2048, 2048)
      key.shadow.bias = -0.0004
      key.shadow.camera.near = 1
      key.shadow.camera.far = 30
      key.shadow.camera.left = -10
      key.shadow.camera.right = 10
      key.shadow.camera.top = 8
      key.shadow.camera.bottom = -6
      scene.add(hemi, key)

      // 弧形展墙：画挂在真实的墙上，影子落在墙上——悬浮的框是纸片，落影的框是房间
      const WALL_R = 6.5
      const wall = new THREE.Mesh(
        new THREE.CylinderGeometry(WALL_R, WALL_R, 7, 64, 1, true, Math.PI * 0.5, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0xfbfbfb, roughness: 0.95, side: THREE.BackSide }),
      )
      wall.receiveShadow = true
      scene.add(wall)

      // 地面：浅石灰,一点点反射感（roughness 0.55 刚好从环境里借到一丝光泽）
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.MeshStandardMaterial({ color: 0xededed, roughness: 0.55, metalness: 0 }),
      )
      floor.rotation.x = -Math.PI / 2
      floor.position.y = -1.6
      floor.receiveShadow = true
      scene.add(floor)

      const loader = new THREE.TextureLoader()
      const hung: { product: Product; group: InstanceType<typeof THREE.Group>; art: InstanceType<typeof THREE.Mesh> }[] = []
      const disposables: { dispose: () => void }[] = []

      const R = 6
      const SPREAD = Math.PI * 0.72 // 弧线摊开约 130°
      pieces.forEach((p, i) => {
        const angle = -SPREAD / 2 + (SPREAD * i) / (pieces.length - 1)
        const group = new THREE.Group()
        group.position.set(Math.sin(angle) * R, 0, -Math.cos(angle) * R)
        group.lookAt(0, 0, 0)

        // 博物馆装裱三层，材质按 PBR 军规：漆面黑框（clearcoat 从环境里借高光，
        // 「为什么看起来贵」多半是这道反光）、粗面白卡纸、亚光画心
        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(1.72, 2.24, 0.07),
          new THREE.MeshPhysicalMaterial({
            color: 0x101010,
            roughness: 0.32,
            metalness: 0,
            clearcoat: 0.5,
            clearcoatRoughness: 0.25,
          }),
        )
        frame.castShadow = true
        const mat = new THREE.Mesh(
          new THREE.PlaneGeometry(1.62, 2.14),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92 }),
        )
        mat.position.z = 0.041
        // 贴图就位前画心先呈素卡纸色，免得首帧挂着一块深灰空板（评审 minor #4）
        const artMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.85, metalness: 0 })
        const texture = loader.load(viewsOf(p)[0], (t) => {
          t.colorSpace = THREE.SRGBColorSpace
          artMat.map = t
          artMat.color.set(0xffffff)
          artMat.needsUpdate = true
        })
        const art = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4 * (4 / 3)), artMat)
        art.position.z = 0.043
        art.userData.productId = p.id
        group.add(frame, mat, art)
        scene.add(group)

        // 射灯：从上前方打向画心，penumbra 拉满——墙上那滩柔和的光池就是美术馆的签名
        const spot = new THREE.SpotLight(0xffffff, 9, 14, 0.38, 0.95, 1.2)
        spot.position.set(group.position.x * 0.72, 2.6, group.position.z * 0.72)
        spot.target = art
        scene.add(spot)
        disposables.push({ dispose: () => scene.remove(spot) })
        hung.push({ product: p, group, art })
        disposables.push(frame.geometry, frame.material, mat.geometry, mat.material, art.geometry, art.material, texture)
      })

      // 视角状态：拖动改 yaw，鼠标移动给一点视差，全部阻尼收敛（家规：昂贵地慢，绝不弹跳）
      let yaw = 0
      let yawTarget = 0
      let pitchPar = 0
      let yawPar = 0
      let parX = 0
      let parY = 0
      const clampYaw = SPREAD / 2 + 0.12

      let dragging = false
      let dragMoved = 0
      let lastX = 0

      const onPointerDown = (e: PointerEvent) => {
        dragging = true
        dragMoved = 0
        lastX = e.clientX
        canvas!.setPointerCapture(e.pointerId)
      }
      const onPointerMove = (e: PointerEvent) => {
        const rect = canvas!.getBoundingClientRect()
        parX = ((e.clientX - rect.left) / rect.width) * 2 - 1
        parY = ((e.clientY - rect.top) / rect.height) * 2 - 1
        if (dragging) {
          const dx = e.clientX - lastX
          dragMoved += Math.abs(dx)
          lastX = e.clientX
          yawTarget = THREE.MathUtils.clamp(yawTarget - dx * 0.004, -clampYaw, clampYaw)
        } else {
          pick(e)
        }
      }
      const onPointerUp = (e: PointerEvent) => {
        dragging = false
        if (dragMoved < 6) {
          const hit = pick(e)
          if (hit) navigate(`/product/${hit.id}`)
        }
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') yawTarget = Math.max(yawTarget - 0.22, -clampYaw)
        if (e.key === 'ArrowRight') yawTarget = Math.min(yawTarget + 0.22, clampYaw)
      }

      const raycaster = new THREE.Raycaster()
      const ndc = new THREE.Vector2()
      function pick(e: PointerEvent): Product | null {
        const rect = canvas!.getBoundingClientRect()
        // 归一化坐标必须相对画布，不是窗口（skills/threejs-interaction 的示例是全屏画布，这里不是）
        ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
        raycaster.setFromCamera(ndc, camera)
        const hits = raycaster.intersectObjects(hung.map((h) => h.art))
        const found = hits.length > 0 ? hung.find((h) => h.art === hits[0].object) : null
        canvas!.style.cursor = found ? 'pointer' : dragging ? 'grabbing' : 'grab'
        hoveredRef.current = found?.product ?? null
        setHovered(found?.product ?? null)
        return found?.product ?? null
      }

      canvas.addEventListener('pointerdown', onPointerDown)
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('pointerup', onPointerUp)
      canvas.addEventListener('keydown', onKey)

      const onResize = () => {
        if (!el) return
        camera.aspect = el.clientWidth / el.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(el.clientWidth, el.clientHeight)
      }
      window.addEventListener('resize', onResize)

      const clock = new THREE.Clock()
      let raf = 0
      const animate = () => {
        raf = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        // 待机时房间自己极慢地环视（约 40 秒一个往返）；reduced-motion 下静止
        const idle = reduced || dragging ? 0 : Math.sin(t * 0.16) * 0.10
        if (!reduced) {
          yawPar += (parX * 0.045 - yawPar) * 0.04
          pitchPar += (-parY * 0.03 - pitchPar) * 0.04
        }
        yaw += (yawTarget + idle - yaw) * 0.055
        camera.rotation.set(pitchPar, -yaw + yawPar, 0, 'YXZ')
        // 悬停的那张极轻地迎向你（位移不缩放，禁过冲的家规下位移最稳）
        for (const h of hung) {
          const lift = (h.art.userData.lift as number) ?? 0
          const next = lift + ((h.product.id === hoveredRef.current?.id ? 0.06 : 0) - lift) * 0.08
          h.art.userData.lift = next
          h.art.position.z = 0.043 + next
        }
        renderer.render(scene, camera)
      }
      animate()
      setReady(true)

      cleanup = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        window.removeEventListener('resize', onResize)
        canvas.removeEventListener('pointerdown', onPointerDown)
        canvas.removeEventListener('pointermove', onPointerMove)
        canvas.removeEventListener('pointerup', onPointerUp)
        canvas.removeEventListener('keydown', onKey)
        for (const d of disposables) d.dispose()
        floor.geometry.dispose()
        ;(floor.material as { dispose: () => void }).dispose()
        wall.geometry.dispose()
        ;(wall.material as { dispose: () => void }).dispose()
        envTex.dispose()
        pmrem.dispose()
        renderer.dispose()
      }
    }

    return () => {
      disposed = true
      io.disconnect()
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieces.map((p) => p.id).join(',')])

  if (pieces.length === 0) return null

  // 评审共识：3D 展厅与「今日沙龙」原是同一批六件、前后两节——房间自己就是沙龙。
  // 合并后：房间 + 一条可购的小卡条（触屏的展签、WebGL 缺席时的墓碑、读屏的正文）
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6 lg:mt-40">
      <h2 className="font-lux text-2xl text-ivory lg:text-4xl">Today's Salon</h2>
      <p className="mt-4 max-w-md text-[11px] leading-loose text-fog">
        The booking window closes in <span className="text-ivory">{countdown}</span>; every refresh, we
        quietly reserve it for you again. Six pieces, hung in a room that renders on arrival. Drag to look around;
        the wall is rehung at midnight.
      </p>
      {!failed && (
      <div ref={wrap} className="relative mt-10 h-[62vh] min-h-[380px] overflow-hidden bg-panel">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label="A three-dimensional gallery of today's salon. The same pieces are listed below."
          className={`h-full w-full touch-pan-y transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
          style={{ cursor: 'grab' }}
        />
        {!ready && (
          <p className="absolute inset-0 flex items-center justify-center text-[10px] tracking-wider text-fog">
            The room is being prepared. It has never been used.
          </p>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.045) 100%)' }}
        />
        {/* 展签浮层：走 DOM 不走 3D 文本（可读可及，还免了字体加载） */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent px-5 pb-4 pt-10">
          {hovered ? (
            <p className="text-[10px] leading-relaxed text-ivory">
              <span className="text-fog">{maisonOf(hovered).name}</span>
              <span className="font-lux ml-3">{hovered.name.split('·')[0].trim()}</span>
              <span className="font-price ml-3">{money(hovered.price)}</span>
            </p>
          ) : (
            <p className="text-[10px] leading-relaxed text-fog">
              Handling is permitted here. It is the only room where it is.
            </p>
          )}
        </div>
      </div>
      )}

      {/* 沙龙小卡条：触屏的展签、WebGL 缺席时的墓碑。卡不重复大图（房间已经挂了），只报名与价 */}
      <div className="mt-6 flex snap-x gap-6 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        {pieces.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="group w-40 shrink-0 snap-start">
            {failed && (
              <div className="mb-3 overflow-hidden bg-panel">
                <ProductImage product={p} className="aspect-[3/4] w-full" emojiClass="text-4xl" plaque />
              </div>
            )}
            <p className="font-lux truncate text-[12px] leading-snug text-ivory group-hover:opacity-60">
              {p.name.split('·')[0].trim()}
            </p>
            <p className="font-price mt-1 text-[11px] text-ivory">{money(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
