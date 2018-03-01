import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, Modal, AlertController, LoadingController} from 'ionic-angular';

import {HttpClient} from '@angular/common/http';
import {Geolocation} from '@ionic-native/geolocation';
import L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';

import { ReportPage } from '../report/report';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public map : L.map;  
  public marker: L.marker; 
  public pos: number[];

  constructor(
    public navCtrl: NavController,    
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad(){
    this.loadMap();  
  }

  loadMap(){    
    this.map = L.map('map',{
      center: [13.00, 101.50],
      zoom: 5
    })

    var roads = L.gridLayer.googleMutant({
      type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    });

    var satellite = L.gridLayer.googleMutant({
      type: 'satellite' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    });

    var hybrid = L.gridLayer.googleMutant({
      type: 'hybrid' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    });

    var terrain = L.gridLayer.googleMutant({
      type: 'terrain' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    });
    
    let baseLayers = {   
      "แผนที่ถนน": roads,
      "แผนที่ภาพดาวเทียม": satellite,
      "แผนที่ผสม": hybrid.addTo(this.map),
      "แผนที่ภูมิประเทศ": terrain,
    };        
    L.control.layers(baseLayers).addTo(this.map);

    this.showLocation();
  }

  showLocation() {  
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    
    this.geolocation.getCurrentPosition().then((res) => {      
      // resp.coords.latitude
      // resp.coords.longitude
      //let pos=[res.coords.latitude, res.coords.longitude]; 
      
      this.pos=[res.coords.latitude, res.coords.longitude];
      //let pos = [res.coords.latitude, res.coords.longitude];
      this.map.setView(this.pos, 16);
      this.marker = L.marker(this.pos, {draggable: true}).addTo(this.map);
      loading.dismiss();

      // drage marker
      this.marker.on("dragend", function (e) {
        this.pos = [e.target._latlng.lat, e.target._latlng.lng];          
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });      
  }

  gotoReport1(){
    this.navCtrl.push(ReportPage, {
      pos: this.pos
    })
  }

  gotoReport(){
    const modalLeg: Modal =  this.modalCtrl.create('ReportPage',{
      lat: this.pos[0],
      lon: this.pos[1]
    });
    modalLeg.present();
  }

}
