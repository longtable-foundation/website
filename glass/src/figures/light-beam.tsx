import { useEffect, useRef } from 'react'

// A horizontal light beam: a wide warm cone from the left edge pinches to a hot point,
// and a thin cool streak runs on to the right. After the "Lights BG" Unicorn Studio scene.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uFocus;
uniform float uSpread;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}

void main(){
  float aspect=uRes.x/uRes.y;
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(uv-uFocus)*vec2(aspect,1.);
  float t=uTime;
  float breathe=.92+.08*sin(t*.7)+.03*sin(t*2.3);

  // Left cone: opens toward the left edge, rays shimmer along its angle.
  float dx=max(-p.x,0.);
  float w=dx*uSpread+.012;
  float ang=p.y/(dx+.05);
  float rays=.72+.28*fbm(vec2(ang*5.,t*.25))+.12*(fbm(vec2(ang*22.,t*.6))-.5);
  float cone=exp(-pow(abs(p.y)/w,1.6))*(1.-exp(-dx*6.))*rays;
  float haze=exp(-pow(abs(p.y)/(w*2.6+.05),1.2))*smoothstep(0.,.9,dx)*.2;

  // The hot point where the cone pinches.
  float d2=dot(p,p);
  float core=.0025/(d2+.0009);
  float flare=exp(-abs(p.y)*70.)*exp(-abs(p.x)*5.)*.9;

  // Right streak: thin, cool, fading out.
  float rx=max(p.x,0.);
  float streak=exp(-pow(abs(p.y)/(.004+rx*.045),1.4))*exp(-rx*1.1)*step(0.,p.x);
  float sheen=exp(-pow(abs(p.y)/(.03+rx*.18),1.2))*exp(-rx*2.2)*step(0.,p.x)*.18;

  vec3 warm=vec3(1.,.95,.88);
  vec3 hot=vec3(1.,.78,.5);
  vec3 cool=vec3(.78,.88,1.);
  vec3 col=warm*(cone*.75+haze)*breathe;
  col+=hot*core*breathe+warm*flare;
  col+=cool*(streak*1.4+sheen)*breathe;

  col=1.-exp(-col*1.25);
  col+=(hash(gl_FragCoord.xy+fract(t)*91.)-.5)*.035;
  gl_FragColor=vec4(max(col,0.),1.);
}`

type Props = { className?: string; focus?: [number, number]; spread?: number }

export function LightBeam({ className = '', focus = [0.66, 0.56], spread = 0.42 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [fx, fy] = focus

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!canvas || !gl) return

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uFocus = gl.getUniformLocation(prog, 'uFocus')
    const uSpread = gl.getUniformLocation(prog, 'uSpread')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // The beam is soft, so it renders below device resolution and is scaled up by CSS.
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6
    const aim = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    let raf = 0
    let visible = true
    let start = performance.now()

    const draw = (now: number) => {
      eased.x += (aim.x - eased.x) * 0.04
      eased.y += (aim.y - eased.y) * 0.04
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, reduce ? 4 : (now - start) / 1000)
      // On tall, narrow screens the beam moves above the headline and opens wider.
      const narrow = canvas.width / canvas.height < 0.8
      gl.uniform2f(uFocus, (narrow ? 0.78 : fx) + eased.x * 0.03, (narrow ? 0.86 : fy) - eased.y * 0.03)
      gl.uniform1f(uSpread, narrow ? spread * 1.6 : spread)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const loop = (now: number) => {
      raf = 0
      if (!visible || document.hidden) return
      draw(now)
      if (!reduce) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop)
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(r.width * scale))
      canvas.height = Math.max(1, Math.round(r.height * scale))
      draw(performance.now())
    }
    const onMove = (e: PointerEvent) => {
      aim.x = e.clientX / window.innerWidth - 0.5
      aim.y = e.clientY / window.innerHeight - 0.5
    }
    const onVisibility = () => {
      start = start || performance.now()
      wake()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting)
      wake()
    })
    io.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    resize()
    wake()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [fx, fy, spread])

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 -z-10 block size-full ${className}`} />
}
