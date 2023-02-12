import { Component, OnInit } from '@angular/core';
import { BedlamService } from 'src/app/services/bedlam.service';
import { Item } from 'src/types/nuclino';
import * as THREE from 'three';
import { Object3D } from 'three';

// @ts-ignore
import * as TWEEN from 'three-tween';

// @ts-ignore
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

export enum ITEM_CONFIGURATION {
  "TABLE" = "TABLE",
  "SPHERE" = "SPHERE",
  "HELIX" = "HELIX",
  "GRID" = "GRID"
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  NO_IMG = 'https://static.wikia.nocookie.net/unanything/images/3/3b/4chanANON.png/revision/latest/scale-to-width-down/450?cb=20160902184223'
  itemsPerRow = 12
  characters: Item[] = []
  camera?: THREE.PerspectiveCamera
  scene?: THREE.Scene
  renderer?: CSS3DRenderer
  controls?: TrackballControls

  css3DObjects: CSS3DObject[] = []
  targets: Record<ITEM_CONFIGURATION, Object3D[]> = {
    GRID: [],
    TABLE: [],
    HELIX: [],
    SPHERE: [],
  }
  targetKeys = Object.keys(this.targets) as ITEM_CONFIGURATION[]


  constructor(private bedlam: BedlamService) {
    // console.log('Construction')
  }

  async ngOnInit() {
    const spaces = await this.bedlam.getContent()
    this.characters = await this.bedlam.nsc
    // console.log(this.characters[12])
    this.initThree()
    this.createElements()
    this.animate()
    this.transform(ITEM_CONFIGURATION.TABLE)
  }

  initThree = () => {
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 3000;

    this.scene = new THREE.Scene();

    //TODO: Initial Item Setup

    const mountPoint = document.getElementById('three-container')
    if (!mountPoint) {
      console.error('Missing Mount Point')
      return
    }
    this.renderer = new CSS3DRenderer()
    if (!this.renderer) {
      console.error('Whut? No Renderer?')
      return
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight); ''
    document.getElementById('three-container')?.appendChild(this.renderer.domElement);

    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 500;
    this.controls.maxDistance = 6000;
    this.controls.addEventListener('change', this.render);

    window.addEventListener('resize', this.onWindowResize);
  }

  createElements = async () => {
    if (!this.scene) {
      console.error('Missing Scene')
      return
    }
    const nsc = this.bedlam.nsc
    this.css3DObjects = await Promise.all(nsc.map(async (item, i, arr) => {
      const element = document.createElement('div');
      element.className = 'element';
      element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

      const number = document.createElement('div');
      number.className = 'number';
      number.textContent = i + '';
      element.appendChild(number);

      const symbol = document.createElement('div');
      // symbol.className = 'symbol';
      // symbol.textContent = "" + i;
      const img = document.createElement('img')
      const src = this.bedlam.extractImgSources(item)
      img.src = src[0] ?? this.NO_IMG
      img.classList.add('charImg')
      if (i === 107) {
        console.log(item.content, src)
      }

      symbol.appendChild(img)
      element.appendChild(symbol);

      const details = document.createElement('div');
      details.className = 'details';
      details.innerHTML = item.title
      element.appendChild(details);

      const objectCSS = new CSS3DObject(element);
      objectCSS.position.x = Math.random() * 4000 - 2000;
      objectCSS.position.y = Math.random() * 4000 - 2000;
      objectCSS.position.z = Math.random() * 4000 - 2000;
      this.scene!.add(objectCSS);



      this.addTabelTarget(i)
      const v = new THREE.Vector3
      this.addSphereTarget(i, arr.length, v)
      this.addHelixTarget(i, v)
      this.addGridTarget(i)

      return objectCSS

    }))
  }

  addTabelTarget(index: number) {
    const object = new THREE.Object3D();
    const y = Math.floor(index / this.itemsPerRow)
    const x = index % this.itemsPerRow
    object.position.x = (x * 140) - 1330;
    object.position.y = - (y * 180) + 990;
    this.targets.TABLE.push(object)

  }
  addSphereTarget(index: number, objCount: number, vector = new THREE.Vector3) {
    var phi = Math.acos(-1 + (2 * index) / objCount);
    var theta = Math.sqrt(objCount * Math.PI) * phi;

    var object = new THREE.Object3D();

    object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
    object.position.y = 800 * Math.sin(theta) * Math.sin(phi);
    object.position.z = 800 * Math.cos(phi);

    vector.copy(object.position).multiplyScalar(2);

    object.lookAt(vector);

    this.targets.SPHERE.push(object);

  }
  addHelixTarget(index: number, vector = new THREE.Vector3) {

    var phi = index * 0.175 + Math.PI;

    var object = new THREE.Object3D();

    object.position.x = 900 * Math.sin(phi);
    object.position.y = - (index * 8) + 450;
    object.position.z = 900 * Math.cos(phi);

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt(vector);

    this.targets.HELIX.push(object);
  }

  addGridTarget(index: number) {
    var object = new THREE.Object3D();

    object.position.x = ((index % 5) * 400) - 800;
    object.position.y = (- (Math.floor(index / 5) % 5) * 400) + 800;
    object.position.z = (Math.floor(index / 25)) * 1000 - 2000;

    this.targets.GRID.push(object);

  }

  transform(configuration: ITEM_CONFIGURATION, duration = 2000) {
    const targets = this.targets[configuration]
    const objects = this.css3DObjects
    TWEEN.removeAll();

    for (var i = 0; i < objects.length; i++) {

      var object = objects[i];
      var target = targets[i];

      new TWEEN.Tween(object.position)
        .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(object.rotation)
        .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    }

    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(this.render)
      .start();

  }

  animate = () => {
    requestAnimationFrame(this.animate);
    TWEEN.update();
    if (!this.controls) {
      console.error('Controls not Initialized')
      return
    }
    this.controls.update();
  }

  render = () => {
    if (!this.renderer || !this.scene || !this.camera) {
      console.error('Something Wrong. Missing Scene or camera or renderer')
      return
    }
    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize = () => {
    if (!this.camera || !this.renderer) {
      console.error('Missing Camera or Renderer on Resize')
      return
    }
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.render();

  }


}
