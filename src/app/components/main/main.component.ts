import { Component, OnInit } from '@angular/core';
import { BedlamService } from 'src/app/services/bedlam.service';
import { Item } from 'src/types/nuclino';
import * as THREE from 'three';
// @ts-ignore
import { TWEEN } from 'three-tween';
// @ts-ignore
import { TrackballControls } from 'three-trackballcontrols';
// @ts-ignore
import { CSS3DRenderer, CSS3DObject } from 'three-css3drenderer';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  itemsPerRow = 8

  characters: Item[] = []
  camera?: THREE.PerspectiveCamera
  scene?: THREE.Scene
  renderer?: THREE.Renderer
  controls?: TrackballControls
  constructor(private bedlam: BedlamService) {
    console.log('Construction')
  }

  async ngOnInit() {
    const spaces = await this.bedlam.getContent()
    this.characters = await this.bedlam.nsc
    this.initThree()
  }

  initThree() {
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 3000;

    this.scene = new THREE.Scene();

    //TODO: Initial Item Setup

    this.renderer = new CSS3DRenderer()
    if (!this.renderer) {
      console.error('Whut? No Renderer?')
      return
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container')?.appendChild(this.renderer.domElement);

    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 500;
    this.controls.maxDistance = 6000;
    this.controls.addEventListener('change', this.render);

    window.addEventListener('resize', this.onWindowResize);
  }

  createElements() {
    if (!this.scene) {
      console.error('Missing Scene')
      return
    }
    const nsc = this.bedlam.nsc
    nsc.forEach((item, i) => {
      const element = document.createElement('div');
      element.className = 'element';
      element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

      const number = document.createElement('div');
      number.className = 'number';
      number.textContent = i+'';
      element.appendChild(number);

      const symbol = document.createElement('div');
      symbol.className = 'symbol';
      symbol.textContent = item.title;
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

    

      //

      const object = new THREE.Object3D();
      const y = this.itemsPerRow / i
      const x = this.itemsPerRow % i 
      object.position.x = (x * 140) - 1330;
      object.position.y = - (y * 180) + 990;

      // targets.table.push(object);
    })
  }

  animate() {
    requestAnimationFrame(this.animate);
    TWEEN.update();
    this.controls.update();
  }

  render() {
    if (!this.renderer || !this.scene || !this.camera) {
      console.error('Something Wrong. Missing Scene or camera or renderer')
      return
    }
    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize() {
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
