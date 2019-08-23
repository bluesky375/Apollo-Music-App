import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { HelperProvider } from '../../providers/helper/helper';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { ModalService } from '../../services/ModalService';
import { FileChooser } from '@ionic-native/file-chooser';
import { ApiProvider } from '../../providers/api/api';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

/**
 * Generated class for the SongUploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-song-upload',
  templateUrl: 'song-upload.html',
})
export class SongUploadPage implements OnInit {

  form: FormGroup;
  base64Image;
  sourcex;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadImageId;
  image;
  songUri: string;
  data;
  blob: Blob;
  songname;

  albumData;
  type;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,private camera: Camera, 
    private androidPermissions: AndroidPermissions, private helper: HelperProvider, private fireStorage: AngularFireStorage,
     public modalService: ModalService, private fileChooser: FileChooser, private api: ApiProvider,private file: File, private filePath: FilePath) {
      //Camera Permissions
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
    ).catch(err=> console.log(err))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SongUploadPage');
  }

  ngOnInit(){
    this.type = this.navParams.get('type');
    this.albumData = this.navParams.get('data');
    console.log(this.albumData)
    this.form = this.fb.group({
      title: ['', Validators.required],
      oartist: ['', Validators.required],
      artist: ['', Validators.required],
      movie: ['', Validators.required],
      album: ['', Validators.required],
      video: [''],
      mood: ['']
    });

    setTimeout( () =>{
      if(this.type === 'album'){
      this.form.controls['album'].setValue( this.albumData.name);
    }
    }, 500);
    
  }

  close(){
    this.modalService.dismiss();
  }

  submit(form){
   if(this.base64Image !== '' && this.songUri !== ''){
    this.data = {
      title: form.value.title,
      oartist: form.value.oartist,
      artist: [
        {
          display: form.value.artist,
          value: form.value.artist
        }
      ],
      movie: form.value.movie,
      album: form.value.album,
      video: form.value.video + '?controls=0&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;loop=0&amp;fs=0&amp;hl=en&amp;enablejsapi=1&amp;widgetid=1',
      imageId: '',
      imageURL: '',
      songId: '',
      songURL: '',
      views: 0,
      mood: form.value.mood,
      uploadBy: localStorage.getItem('uid')
    }
    this.helper.presentLoadingDefault();
    this.upload();
   }
   else{
     this.helper.presentToast('Please choose right image and song to continue.')
   }
  }

  choosePicture(){
    let myfunc = () => {
      this.takePhoto('library');
    };
    let myfunc1 = () => {
      this.takePhoto('camera');
    };
    this.helper.presentActionSheet('Choose an option.','Gallery','Camera',myfunc,myfunc1);
    this.uploadImageId = Math.floor(Date.now() / 1000);
  }

  
  takePhoto(source){
    if(source === 'camera'){
      this.sourcex =this.camera.PictureSourceType.CAMERA;
      
    }else if(source === 'library'){
      this.sourcex =this.camera.PictureSourceType.PHOTOLIBRARY;

    }
    
      const options: CameraOptions = {
        sourceType: this.sourcex,
        quality: 30,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
 
      }, (err) => {
      // Handle error
      console.log(err);
      });
  }


  upload() {
    this.ref = this.fireStorage.ref(`Thumbnails/${this.uploadImageId}`);
    let task = this.ref.putString(this.base64Image, 'data_url');
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.image = url;
          if(this.image !== ''){
            this.uploadSong();
          }
        });
      })).subscribe();
  }

  uploadSong() {
      this.ref = this.fireStorage.ref(`Songs/${this.uploadImageId}`);
      let task = this.ref.put(this.blob);
      task.snapshotChanges()
        .pipe(finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.data.songURL = url;
            if(this.data.songURL !== ''){
              this.createSong();
            }
          });
        })).subscribe();
   
  }

  createSong(){
    this.data.imageId = this.uploadImageId;
    this.data.songId = this.songname;
    this.data.imageURL = this.image;
    if(this.type === 'album')
      this.data.albumId = this.albumData.did;
    this.api.addSong(this.data)
      .then(res =>{
        if(this.type !== 'album'){
           this.helper.closeLoading();
        this.helper.presentToast('Song Uploaded');
        this.modalService.dismiss();
        }
        else  
          this.updateAlbum(res);
       
      }, err =>{
        this.helper.closeLoading();
        this.helper.presentToast(err.message);
      })
  }

  updateAlbum(res){
    let x = this.albumData.songs;
    x.push(res.id)
    this.albumData.songs = x;
    this.api.updateAlbum(this.albumData.did,this.albumData)
      .then(res =>{
        this.helper.closeLoading();
        this.helper.presentToast('Song Uploaded');
        this.modalService.dismiss();
      }, err =>{
        this.helper.closeLoading();
        this.helper.presentToast(err.message);
      })
  }

  openFile(){
    this.fileChooser.open()
     .then( (res) =>{
      this.filePath.resolveNativePath(res)
      .then(resp => {
          let dirPath = resp;
           let dirPathSegment = dirPath.split('/');
          let x = dirPathSegment.pop();
           dirPath = dirPathSegment.join('/');
           this.file.readAsArrayBuffer(dirPath, x)
          .then( (buffer)=>{
            this.blob = new Blob([buffer], {type: "audio/mp3" });
            this.songname = x;
          }, err =>{
            alert(err)
          })
        
      })
     }, err =>{
       alert(err);
     })
  }

}
