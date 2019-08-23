import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';

/*
Generated class for the ApiProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class ApiProvider 
{
    constructor(private afs: AngularFirestore) 
    {    
    }

    //::::::::::::::::::::::::::::::::::::::::::::::::: USER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    createUser(id,data)
    {
        return this.afs.doc('users/'+id).set(data);
    }

    getUserById(id)
    {
        return this.afs.doc('users/'+id).valueChanges();
    }

    updateUser(id,data)
    {
        return this.afs.doc('users/'+id).update(data);
    }

    getAllUsers()
    {
        return this.afs.collection('users').valueChanges();
    }

    getAllUsersData()
    {
        return this.afs.collection('users').snapshotChanges();
    }

    getUserByEmail(email)
    {
        return this.afs.collection('users', ref => ref.where('email','==', email)).valueChanges();
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::: Update Songs ::::::::::::::::::::::::::::::::::::::::::::

    updateSongs(id, data)
    {
        return this.afs.doc('songs/'+id).update(data);
    }

    //:::::::::::::::::::::::::::::::::::::::::::::::::: Feautured Songs ::::::::::::::::::::::::::::::::::::::::::

    getFeaturedSongs()
    {
        return this.afs.collection('featured', ref => ref.orderBy('upload', 'desc')).snapshotChanges();        
    }

    getMostPlayedSongs()
    {
        //return this.afs.collection('songs', ref => ref.orderBy('views', 'desc').limit(7)).snapshotChanges();
        return this.afs.collection('songs', ref => ref.where('originals','==','').orderBy('upload', 'desc').limit(7)).snapshotChanges();
    }

    getMostPlayedSongs1()
    {
        //return this.afs.collection('songs', ref => ref.orderBy('views', 'desc')).snapshotChanges();
        return this.afs.collection('songs', ref => ref.where('originals','==','').orderBy('upload', 'desc')).snapshotChanges();
    }

    getAllSongs()
    {
        return this.afs.collection('songs').snapshotChanges();
    }

    getNewSongs()
    {
        return this.afs.collection('songs', ref=>ref.orderBy('upload', 'desc').limit(7)).snapshotChanges();
    }

    getNewSongs1()
    {
        return this.afs.collection('songs', ref=>ref.orderBy('upload', 'desc')).snapshotChanges();
    }

    // :::::::::::::::::::::::::::::::::::::::::::::::: Playlist ::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getPlaylistById(id)
    {
        return this.afs.collection('playlist', ref => ref.where('uid', '==', id)).snapshotChanges();
    }

    updatePlaylist(id, data)
    {
        return this.afs.doc('playlist/'+id).update(data);
    }

    addToPlaylist(data)
    {
        return this.afs.collection('playlist').add(data);
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::: Ads ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getAds()
    {
        return this.afs.collection('ads', ref => ref.orderBy('views', 'asc')).snapshotChanges();
    }

    updateAdsSong(id,data)
    {
        return this.afs.doc('ads/'+id).update(data);
    }

    // :::::::::::::::::::::::::::::::::::::::::::::: Recently Played :::::::::::::::::::::::::::::::::::::::::::::::::::::

    getRecentlyPlayed(id)
    {
        return this.afs.collection('recently', ref => ref.where('uid','==',id)).snapshotChanges();
    }

    getRecentlyPlayed2(id)
    {
        return this.afs.collection('recently', ref => ref.where('uid','==',id).limit(5)).snapshotChanges();
    }

    updateRecentlyPlayed(id,data)
    {
        return this.afs.doc('recently/'+id).update(data);
    }

    addRecentPlayed(data)
    {
        return this.afs.collection('recently').add(data);
    }

    // :::::::::::::::::::::::::::::::::::::::::::::: Upload list :::::::::::::::::::::::::::::::::::::::::::::::::::::

    getUploadSongs(id)
    {
        return this.afs.collection('songs', ref => ref.where('uploadBy','==',id).orderBy('upload','desc')).snapshotChanges();
    }

    //  :::::::::::::::::::::::::::::::::::::::::: Popular Videos ::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getpopularVideos()
    {
        //return this.afs.collection('songs', ref=> ref.where('video','>', '').orderBy('video').orderBy('views','desc').limit(7)).snapshotChanges();
        return this.afs.collection('songs', ref=> ref.where('video','>', '').orderBy('video').orderBy('upload','desc').limit(7)).snapshotChanges();
    }

    getpopularVideos1()
    {
        //return this.afs.collection('songs', ref=> ref.where('video','>', '').orderBy('video').orderBy('views','desc')).snapshotChanges();
        return this.afs.collection('songs', ref=> ref.where('video','>', '').orderBy('video').orderBy('upload','desc')).snapshotChanges();
    }

    getOnlyVideos()
    {
        return this.afs.collection('songs', ref => ref.where('video', '>', '')).snapshotChanges();
    }

    getNewVideos()
    {
        return this.afs.collection('songs', ref => ref.where('video','>','').orderBy('video').orderBy('upload','asc').limit(4)).snapshotChanges();
    }

    getNewVideos1()
    {
        return this.afs.collection('songs', ref => ref.where('video','>','').orderBy('video').orderBy('upload','asc')).snapshotChanges();
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::: Liked Tracks ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getLikedSongs(uid)
    {
        return this.afs.collection('liked', ref => ref.where('uid','==', uid)).snapshotChanges();
    }

    updateLikedSongs(id,data)
    {
        return this.afs.doc('liked/'+id).update(data);
    }

    addLikedsong(data)
    {
        return this.afs.collection('liked').add(data);
    }

    // ::::::::::::::::::::::::::::::::::::::::::::: Upload songs :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    addSong(data)
    {
        return this.afs.collection('songs').add(data);
    }

    // :::::::::::::::::::::::::::::::::::::::::::::: Followers ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getFollowers(id)
    {
        return this.afs.collection('followers', ref => ref.where('uid', '==', id)).snapshotChanges();
    }

    updateFollowers(id,data)
    {
        return this.afs.doc('followers/'+id).update(data);
    }

    addFollowers(data)
    {
        return this.afs.collection('followers').add(data);
    }

    // :::::::::::::::::::::::::::::::::::::::::::::: Following ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getFollowings(id)
    {
        return this.afs.collection('following', ref => ref.where('uid', '==', id)).snapshotChanges();
    }

    updateFollowing(id,data)
    {
        return this.afs.doc('following/'+id).update(data);
    }

    addFollowing(data)
    {
        return this.afs.collection('following').add(data);
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::: get Artists :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getPopUp()
    {
        return this.afs.doc('popup/popup').valueChanges();
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::: Artist ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getArtistTracks(id)
    {
        return this.afs.collection('songs', ref => ref.where('uid', '==', id)).valueChanges();
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::::: Albums :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getAllAlbumsById(id)
    {
        return this.afs.collection('albums', ref => ref.where('createdBy','==',id)).snapshotChanges();
    }

    addAlbum(data)
    {
        return this.afs.collection('albums').add(data);
    }

    updateAlbum(id,data)
    {
        return this.afs.doc('albums/'+id).update(data);
    }

    // HOME-8 - video album
    getAllAlbums()
    {
        return this.afs.collection('albums').snapshotChanges();
    }

    getOriginals()
    {
        //return this.afs.collection('songs', ref => ref.where('originals','>','').limit(10)).snapshotChanges();
        return this.afs.collection('songs', ref => ref.where('originals','>','').orderBy('originals').orderBy('upload','desc').limit(10)).snapshotChanges();
    }

    getAllOriginals()
    {
        //return this.afs.collection('songs', ref => ref.where('originals','>','')).snapshotChanges();
        return this.afs.collection('songs', ref => ref.where('originals','>','').orderBy('originals').orderBy('upload','desc')).snapshotChanges();
    }

    getAllPublicPlaylist()
    {
        return this.afs.collection('publicplaylist').snapshotChanges();
    }

    getPayment()
    {
        return this.afs.doc('payments/amount').valueChanges();
    }

    getAllCoupons()
    {
        return this.afs.collection('payments').valueChanges();
    }
}
