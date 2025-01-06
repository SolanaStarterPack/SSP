<script lang="ts" module>
	export type UniformFloatType = {
		type: 'f';
		value: number;
	};

	export type UniformBoolType = {
		type: 'i';
		value: boolean;
	};

	export type Uniforms = {
		perlins?: UniformFloatType;
		visible?: UniformBoolType;
		speed?: UniformFloatType;
		points?: UniformBoolType;
		time?: UniformFloatType;
		pointscale?: UniformFloatType;
		decay?: UniformFloatType;
		size?: UniformFloatType;
		displace?: UniformFloatType;
		complex?: UniformFloatType;
		waves?: UniformFloatType;
		eqcolor?: UniformFloatType;
		rcolor?: UniformFloatType;
		gcolor?: UniformFloatType;
		bcolor?: UniformFloatType;
		fragment?: UniformBoolType;
		redhell?: UniformBoolType;
	};
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';
	import gsap, { Quart } from 'gsap';
	import { onMount } from 'svelte';
	import { type SvelteHTMLElements } from 'svelte/elements';
	import * as THREE from 'three';

	const {
		class: className,
		uniforms: propUniforms,
		...restProps
	}: { uniforms: Uniforms; class?: string } & SvelteHTMLElements['div'] = $props();

	let scene: THREE.Scene | undefined;
	let camera: THREE.PerspectiveCamera | undefined;
	let renderer: THREE.WebGLRenderer;
	let _primitive: PrimitiveElement | undefined;
	let shapeGroup = new THREE.Group();
	let start = Date.now();
	let mat: any | undefined;
	let clientHeight = $state(0);
	let clientWidth = $state(0);
	let blobContainer: HTMLDivElement | undefined;
	let dat: any;
	const defaultUniforms: Required<Uniforms> = {
		perlins: {
			type: 'f',
			value: 1.0
		},
		speed: {
			type: 'f',
			value: 0.4
		},
		visible: {
			type: 'i',
			value: true
		},
		points: {
			type: 'i',
			value: false
		},
		time: {
			type: 'f',
			value: (0.4 / 1000) * (Date.now() - start)
		},
		pointscale: {
			type: 'f',
			value: 0.2
		},
		decay: {
			type: 'f',
			value: 1.2
		},
		size: {
			type: 'f',
			value: 1
		},
		displace: {
			type: 'f',
			value: 1
		},
		complex: {
			type: 'f',
			value: 0.5
		},
		waves: {
			type: 'f',
			value: 3.7
		},
		eqcolor: {
			type: 'f',
			value: 10.0
		},
		rcolor: {
			type: 'f',
			value: 1.5
		},
		gcolor: {
			type: 'f',
			value: 1.5
		},
		bcolor: {
			type: 'f',
			value: 1.5
		},
		fragment: {
			type: 'i',
			value: false
		},
		redhell: {
			type: 'i',
			value: true
		}
	};

	const uniforms = $derived(mergeOptions(defaultUniforms, propUniforms ?? {}));
	const sizeRatio = $derived(1 / uniforms.size.value);

	$effect(() => {
		if (sizeRatio) {
			gsap.to(controlOptions.perlin, {
				duration: 1,
				size: sizeRatio
			});
		}
	});

	const controlOptions = $derived({
		perlin: Object.entries(Object.assign({}, uniforms)).reduce(
			(r, [k, v]) => {
				(r as any)[k] = v.value;
				return r;
			},
			{} as { [k in keyof Uniforms]: Required<Uniforms>[k]['value'] }
		),
		perlinRandom: function () {
			gsap.to(this.perlin, {
				duration: 2,
				//decay: Math.random() * 1.0,
				waves: Math.random() * 20.0,
				complex: Math.random() * 1.0,
				displace: Math.random() * 2.5,
				ease: Elastic.easeOut
			});
		},
		random: function () {
			//this.perlin.redhell = Math.random() >= 0.5; // 10 1 0.1 1.2
			gsap.to(this.perlin, {
				duration: 1,
				eqcolor: 11.0,
				rcolor: Math.random() * 1.5,
				gcolor: Math.random() * 0.5,
				bcolor: Math.random() * 1.5,
				ease: Quart.easeInOut
			});
		},
		normal: function () {
			this.perlin.redhell = true; // 10 1 0.1 1.2
			gsap.to(this.perlin, {
				duration: 1,
				//speed: 0.12,
				eqcolor: 10.0,
				rcolor: 1.5,
				gcolor: 1.5,
				bcolor: 1.5,
				ease: Quart.easeInOut
			});
		},
		darker: function () {
			this.perlin.redhell = false; // 10 1 0.1 1.2
			gsap.to(this.perlin, {
				duration: 1,
				//speed: 0.5,
				eqcolor: 9.0,
				rcolor: 0.4,
				gcolor: 0.05,
				bcolor: 0.6,
				ease: Quart.easeInOut
			});
		},
		volcano: function () {
			this.perlin.redhell = false; // 10 1 0.1 1.2
			//this.perlin.speed = 0.83;

			gsap.to(this.perlin, {
				duration: 1,
				size: 0.7,
				waves: 0.6,
				complex: 1.0,
				displace: 0.3,
				eqcolor: 9.0,
				rcolor: 0.85,
				gcolor: 0.05,
				bcolor: 0.32,
				ease: Quart.easeInOut
			});
		},
		cloud: function () {
			this.perlin.redhell = true; // 10 1 0.1 1.2
			//this.perlin.speed = 0.1;

			gsap.to(this.perlin, {
				duration: 1,
				size: 1.0,
				waves: 20.0,
				complex: 0.1,
				displace: 0.1,
				eqcolor: 4.0,
				rcolor: 1.5,
				gcolor: 0.7,
				bcolor: 1.5,
				ease: Quart.easeInOut
			});
		},
		tornasol: function () {
			this.perlin.redhell = true; // 10 1 0.1 1.2
			//this.perlin.speed = 0.25;

			gsap.to(this.perlin, {
				duration: 1,
				size: 1.0,
				waves: 3.0,
				complex: 0.65,
				displace: 0.5,
				eqcolor: 9.5,
				rcolor: 1.5,
				gcolor: 1.5,
				bcolor: 1.5,
				ease: Quart.easeInOut
			});
		}
	});

	onMount(async () => {
		if (browser) {
			dat = await import('dat.gui');
		}

		init();
	});

	function init() {
		createWorld();
		createGUI();
		createPrimitive();
		animation();
	}

	function mergeOptions<T extends any, U extends Partial<T>>(base: T, obj: U): T {
		for (const key in base) {
			if (obj[key]) {
				base[key] = Object.assign({}, obj[key]) as any;
			}
		}

		return base;
	}

	function createWorld() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(35, clientWidth / clientHeight, 1, 1000);
		camera.position.set(0, 0, 16);

		renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
		renderer.setSize(clientWidth, clientHeight);
		renderer.shadowMap.enabled = true;

		blobContainer?.appendChild(renderer.domElement);
	}

	function onWindowResize(e: HTMLDivElement) {
		renderer.setSize(e.clientWidth, e.clientHeight);
		if (camera) {
			camera.aspect = e.clientWidth / e.clientHeight;
			camera.updateProjectionMatrix();
		}
	}

	class PrimitiveElement {
		mesh: THREE.Object3D;
		shape: THREE.Mesh;
		point: THREE.Points;

		constructor() {
			this.mesh = new THREE.Object3D();
			mat = new THREE.ShaderMaterial({
				side: THREE.DoubleSide,
				uniforms,
				vertexShader: document.getElementById('vertexShader')?.textContent ?? undefined,
				fragmentShader: document.getElementById('fragmentShader')?.textContent ?? undefined
			});

			var geo = new THREE.IcosahedronGeometry(2, 25);
			var wir = new THREE.IcosahedronGeometry(2.3, 2);
			this.shape = new THREE.Mesh(geo, mat);
			this.point = new THREE.Points(wir, mat);

			shapeGroup.add(this.point);
			shapeGroup.add(this.shape);

			scene?.add(shapeGroup);
		}
	}

	function createPrimitive() {
		_primitive = new PrimitiveElement();
	}

	function createGUI() {
		if (import.meta.env.DEV) {
			var gui = new dat.GUI();
			var perlinGUI = gui.addFolder('Shape Setup');
			perlinGUI.add(controlOptions, 'perlinRandom').name('• Random Shape');
			perlinGUI.add(controlOptions.perlin, 'speed', 0.1, 1.0).name('Speed').listen();
			perlinGUI.add(controlOptions.perlin, 'size', 0.0, 3.0).name('Size').listen();
			//perlinGUI.add(controlOptions.perlin, 'decay', 0.0, 1.0).name('Decay').listen();
			perlinGUI.add(controlOptions.perlin, 'waves', 0.0, 20.0).name('Waves').listen();
			perlinGUI.add(controlOptions.perlin, 'complex', 0.1, 1.0).name('Complex').listen();
			perlinGUI.add(controlOptions.perlin, 'displace', 0.1, 2.5).name('Displacement').listen();
			//perlinGUI.open();
			var colorGUI = gui.addFolder('Color');
			colorGUI.add(controlOptions, 'random').name('• Random colors');
			colorGUI.add(controlOptions, 'normal').name('• Normal colors');
			colorGUI.add(controlOptions, 'darker').name('• Dark colors');
			colorGUI.add(controlOptions.perlin, 'eqcolor', 0.0, 30.0).name('Hue').listen();
			colorGUI.add(controlOptions.perlin, 'rcolor', 0.0, 2.5).name('R').listen();
			colorGUI.add(controlOptions.perlin, 'gcolor', 0.0, 2.5).name('G').listen();
			colorGUI.add(controlOptions.perlin, 'bcolor', 0.0, 2.5).name('B').listen();
			colorGUI.add(controlOptions.perlin, 'redhell', true).name('Electroflow');
			//colorGUI.open();
			gui.add(controlOptions, 'volcano').name('• Volcano');
			gui.add(controlOptions, 'tornasol').name('• Tornasol');
			gui.add(controlOptions, 'cloud').name('• Cotton Candy');
			gui.add(controlOptions.perlin, 'points', true).name('Points');
		}
	}

	function animation() {
		//_primitive.shape.visible = !options.perlin.points;
		_primitive && (_primitive.point.visible = Boolean(controlOptions.perlin.points));

		mat.uniforms['time'].value =
			((controlOptions.perlin.speed ?? 0.4) / 1000) * (Date.now() - start);

		mat.uniforms['pointscale'].value = controlOptions.perlin.perlins;
		mat.uniforms['decay'].value = controlOptions.perlin.decay;
		mat.uniforms['size'].value = controlOptions.perlin.size;
		mat.uniforms['displace'].value = controlOptions.perlin.displace;
		mat.uniforms['complex'].value = controlOptions.perlin.complex;
		mat.uniforms['waves'].value = controlOptions.perlin.waves;
		mat.uniforms['fragment'].value = controlOptions.perlin.fragment;

		mat.uniforms['redhell'].value = controlOptions.perlin.redhell;
		mat.uniforms['eqcolor'].value = controlOptions.perlin.eqcolor;
		mat.uniforms['rcolor'].value = controlOptions.perlin.rcolor;
		mat.uniforms['gcolor'].value = controlOptions.perlin.gcolor;
		mat.uniforms['bcolor'].value = controlOptions.perlin.bcolor;

		requestAnimationFrame(animation);
		scene && camera && renderer.render(scene, camera);
	}
</script>

<div bind:this={blobContainer}></div>

{@html `<script id="vertexShader" type="x-shader/x-vertex">
  vec3 mod289(vec3 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise
  float cnoise(vec3 P)
  {
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 5.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 5.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 5.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 5.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep)
  {
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 5.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 5.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 5.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 5.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 1.5 * n_xyz;
  }

  varying vec2 vUv;
  varying float noise;
  varying float qnoise;
  varying float displacement;

  uniform float time;
  uniform float displace;
  uniform float pointscale;
  uniform float decay;
  uniform float size;
  uniform float complex;
  uniform float waves;
  uniform float eqcolor;
  uniform bool fragment;

  float turbulence( vec3 p) {
    float t = - 0.005;
    for (float f = 1.0 ; f <= 1.0 ; f++ ){
      float power = pow( 1.3, f );
      t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
  }

  void main() {

    vUv = uv;

    noise = (2.0 *  - waves) * turbulence( decay * abs(normal + time));
    qnoise = (0.3 *  - eqcolor) * turbulence( decay * abs(normal + time));
    float b = pnoise( complex * (position) + vec3( (decay * 2.0) * time ), vec3( 100.0 ) );

    displacement = - atan(noise) + tan(b * displace);

    vec3 newPosition = (position) + (normal * displacement);
    gl_Position = (projectionMatrix * modelViewMatrix) * vec4( newPosition, abs(size) );
    gl_PointSize = (3.0);
  }
</script>`}

{@html `<script id="fragmentShader" type="x-shader/x-vertex">
  varying float qnoise;
  varying float noise;

  uniform float time;
  uniform bool redhell;
  uniform float rcolor;
  uniform float gcolor;
  uniform float bcolor;

  void main() {
    float r, g, b;

    if (!redhell == true) {
      r = sin(qnoise + rcolor);
      g = normalize(qnoise + (gcolor / 2.0));
      b = tan(qnoise + bcolor);
    } else {
      r = normalize(qnoise + rcolor);
      g = cos(qnoise + gcolor);
      b = sin(qnoise + bcolor);
    }
    gl_FragColor = vec4(r, g, b, 1.0);
  }
</script>`}

<div
	bind:this={blobContainer}
	onresize={(e) => onWindowResize(e.currentTarget)}
	bind:clientWidth
	bind:clientHeight
	{...restProps}
	class={cn('h-full w-full overflow-visible')}
></div>
