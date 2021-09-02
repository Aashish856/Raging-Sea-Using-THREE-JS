import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import waterVertexShader from './shaders/sea/vetex.glsl'
import waterFragmentShader from './shaders/sea/fragments.glsl'



/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



//Ambient light
const ambientLight= new THREE.AmbientLight('white')
// scene.add(ambientLight)

//
const debugObject = {}
//AxesHelper
const axesHelper = new THREE.AxesHelper(1)
// scene.add(axesHelper)

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(4, 4, 512, 512)

debugObject.depthcolor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    fog:true,
    vertexShader: waterVertexShader,
    fragmentShader:waterFragmentShader,
    uniforms:{
        uBigWaveSpeed :{value:0.75},
        uTime : {value :0.0},
        uBigWaveElevation:{value:0.2},
        uBigWaveFrequency:{value: new THREE.Vector2(4,1.5)},
        uDepthColor:{value:new THREE.Color(debugObject.depthcolor)},
        uSurfaceColor:{value:new THREE.Color(debugObject.surfaceColor)},
        uColorOffSet : {value:0.08},
        uColorMultiplier:{value:5},

        uSmallWaveElevation :{value:0.15},
        uSmallWaveFrequency: {value:3},
        uSmallWaveSpeed : {value:0.2},
        uSmallWaveIteration : {value : 4.0}


    }
})




gui.add(waterMaterial.uniforms.uBigWaveElevation , 'value').min(0).max(1).step(0.001).name('uBigWaveElevation')
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value , 'x').min(0).max(10).step(0.1).name('uBigWaveFrequencyX')
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value , 'y').min(0).max(10).step(0.1).name('uBigWaveFrequencyY')
gui.add(waterMaterial.uniforms.uBigWaveSpeed , 'value').min(0).max(4.0).step(0.01).name('uBigWaveSpeed')

gui.addColor(debugObject,'depthcolor').name('depthColor').onChange(()=>{waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthcolor)})
gui.addColor(debugObject,'surfaceColor').name('SurfaceColor').onChange(()=>{waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)})

gui.add(waterMaterial.uniforms.uColorOffSet , 'value').min(0).max(4.0).step(0.01).name('uColorOffset')

gui.add(waterMaterial.uniforms.uColorMultiplier , 'value').min(0).max(10).step(0.01).name('uColorMutiplier')

gui.add(waterMaterial.uniforms.uSmallWaveElevation , 'value').min(0).max(1).step(0.001).name('uSmallWaveElevation')
gui.add(waterMaterial.uniforms.uSmallWaveFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWaveFrequency')
gui.add(waterMaterial.uniforms.uSmallWaveIteration , 'value').min(0).max(5).step(1).name('uSmallWaveIteration')
gui.add(waterMaterial.uniforms.uSmallWaveSpeed , 'value').min(0).max(4).step(0.01).name('uSmallWaveSpeed')
// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

console.log(waterMaterial)



/**
 * 
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
camera.updateProjectionMatrix();


scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
// controls.maxZoom(110)
// controls.minZoom(10)
console.log(controls)
controls.minDistance = 0.8
controls.maxDistance = 1.5
controls.maxPolarAngle = Math.PI / 2 - 0.5
// controls.maxZoom = 0
controls.update()
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor('#186691')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //uTime
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()