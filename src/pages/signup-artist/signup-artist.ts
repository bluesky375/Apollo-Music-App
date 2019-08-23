import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { HelperProvider } from '../../providers/helper/helper';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the SignupArtistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup-artist',
  templateUrl: 'signup-artist.html',
})
export class SignupArtistPage {
  
  Acc_profile: string = 'artist';
  form1: FormGroup;
  base64Image;
  sourcex;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  image='';
  uploadImageId;
  countries;
  data;
  users: Array<any>;
  usernameError: boolean = false;
  error;

  constructor(public navCtrl: NavController, public navParams: NavParams,private fb: FormBuilder, private camera: Camera, 
    private androidPermissions: AndroidPermissions, private helper: HelperProvider,    private fireStorage: AngularFireStorage,
    private auth: AuthProvider, private api: ApiProvider, private menu: MenuController) {
      //Second Form
    this.form1 = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(6)])],
      username: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_]*$")])],
      mobile: ['', Validators.required],
      gender: ['male', Validators.required],
      country: ['', Validators.required],
      fb: [''],
      insta: [''],
      youtube: ['']
    });

    //get countries

    this.helper.getCountries()
      .subscribe(res =>{
        this.countries = res;
      });
    
    // User data

    this.api.getAllUsers()
      .subscribe(res =>{
        this.users  = res;
      });


    //Camera Permissions
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
    ).catch(err=> console.log(err))
  }

  get f() { return this.form1.controls; }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupArtistPage');
  }

  choosePicture(){
    let myfunc = () => {
      this.takePhoto('library');
    };
    let myfunc1 = () => {
      this.takePhoto('camera');
    };
    this.helper.presentActionSheet('Choose an option.','Gallery','Camera',myfunc,myfunc1);
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

  submit(form){
        if(this.professions.length !== 0 && !this.usernameError){
          this.data ={
            password: form.value.password,
            name: form.value.name,
             email: form.value.email,
             dob: form.value.dob,
             city: form.value.city,
             mobile: form.value.mobile,
             gender: form.value.gender,
             imageURL: '',
             imageId: '',
             country: form.value.country,
             facebook: form.value.fb,
             instagram: form.value.insta,
             youtube: form.value.youtube,
             professions: [''],
             type: this.Acc_profile,
             isVerified: false,
             username: form.value.username,
             signupType: 'signup'
           }
   
   
         this.uploadImageId = Math.floor(Date.now() / 1000);
         this.helper.presentLoadingDefault();
         if(this.base64Image)
           this.upload();
          else
           this.create();
        }
      else{
        this.helper.presentToast('Please select a profession.');
      }
  }

  upload() {

    this.ref = this.fireStorage.ref(`users/${this.uploadImageId}`);
    let task = this.ref.putString(this.base64Image, 'data_url');
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.image = url;
          if (this.image !== '') {
            this.create();
          }
        });
      })).subscribe();
  }

  create(){
    this.data.imageURL = this.image;
    this.data.imageId = this.uploadImageId;
    this.data.type = this.Acc_profile;
    this.auth.signup(this.data.email, this.data.password)
      .then(res =>{
        this.api.createUser(res.user.uid, this.data)
          .then(resp =>{
            localStorage.setItem('uid',res.user.uid);
            localStorage.setItem('type',this.data.type);
            this.helper.closeLoading();
            this.navCtrl.popToRoot();
            this.helper.presentToast('Profile Created. Once Authorized by Admin, you can login.');
            this.helper.setUid(res.user.uid);
          }, err =>{
            this.helper.presentToast(err.message);
            this.helper.closeLoading();
          })
      }, errr =>{
        this.helper.presentToast(errr.message);
        this.helper.closeLoading();
      })
  }

  professions=[];

  selectProfession(val){
    if(this.professions.length === 0){
      this.professions.push(val);
    }
    else if(this.professions.indexOf(val)> -1){
      this.professions = this.professions.filter(function(item) {
        return item !== val
      });
    }
    else{
      this.professions.push(val);
    }
  }

  back(){
    this.navCtrl.pop();
  }

  checkUsername(event){
    let x =[];
    if(event.value.length > 4){
          x = this.users.filter(data => data.username === event.value);
      if(x.length !== 0){
        this.usernameError = true;
        this.error = 'Username Exists, try another one.';
      }
      else{
        this.usernameError = false;
      }
    }
    else{
      this.usernameError = true;
      this.error = 'Username too short.';
    }
  
  }

}
