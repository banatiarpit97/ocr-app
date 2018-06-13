import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import { NgProgress } from '@ngx-progressbar/core';
import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedImage:string;
  imageText:string;

  constructor(public navCtrl: NavController, private actionSheetCtrl:ActionSheetController, private camera : Camera, public progress : NgProgress) {

  }

  selectImage(){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'From Gallery',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA)            
          }
        }
      ]
    });

    actionSheet.present();
  }

  getPicture(src: PictureSourceType){
    this.camera.getPicture({
      quality:100,
      destinationType:this.camera.DestinationType.DATA_URL,
      sourceType:src,
      allowEdit:true,
      saveToPhotoAlbum:false,
      correctOrientation:true
    }).then(imgData => {
      this.selectedImage = `data:image/jpeg;base64,${imgData}`;
    })
  }

  recoganizeImage(){
    Tesseract.recognize(this.selectedImage)
    .progress(message => {
      if(message.status === 'recognizing text'){
        this.progress.set(message.progress);
      }
    })
    .catch(err => {console.log(err)})
    .then(result => {
      this.imageText = result.text;
    })
    .finally(resultorError => {
      this.progress.complete();
    })
  }

}
