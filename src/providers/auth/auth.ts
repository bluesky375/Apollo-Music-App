import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable()
export class AuthProvider {

  constructor(private auth: AngularFireAuth) {
  }

  
  login(email, password){
    return  this.auth.auth.signInWithEmailAndPassword(email,password);
  }

  signup(email,password){
    return this.auth.auth.createUserWithEmailAndPassword(email,password);
  }

  sendVerificationEmail(){
    return this.auth.auth.currentUser.sendEmailVerification();
  }

  setPersistance(){
    return this.auth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  forgotPassword(email){
    return this.auth.auth.sendPasswordResetEmail(email);
  }

  resetPassword(password){
    const user = firebase.auth().currentUser;
    console.log(user);
    // user.updatePassword(password);
    // return user;
    // this.auth.auth.
  }

  logout(){
    this.auth.auth.signOut();
  }

  checkLoginStatus(){
    return this.auth.authState;
  }

}
