
/**
 * Defines the audio provider contract
 * 
 * @export
 * @interface IAudioProvider
 */
export interface IAudioProvider {
  current: number;
  tracks: IAudioTrack[];
  
  create(track: ITrackConstraint): IAudioTrack;
  replace(oldAudioTrack: IAudioTrack, newTrack: ITrackConstraint): IAudioTrack;
  add(track: IAudioTrack);
  play(index: number);
  pause(index?: number);
  stop(index?: number);
} 

/**
 * Defines the properties for JSON objects representing tracks to be played
 * 
 * @export
 * @interface ITrackConstraint
 */
export interface ITrackConstraint {
  id?:number;
  src: string;
  title?: string;
  artist?: string;
  art?: string;  
  preload?: string;
  isLiked: boolean;
}

/**
 * Defines the audio track contract 
 * 
 * @export
 * @interface IAudioTrack
 * @extends {ITrackConstraint}
 */
export interface IAudioTrack extends ITrackConstraint {
  src: string;
  id: number;
  isPlaying: boolean; 
  isLoading: boolean;
  isFinished: boolean;
  hasLoaded: boolean
  duration: number;
  progress: number;
  completed: number;
  canPlay:  boolean;
  error: MediaError;
  songId: string;
  artistId: string;
  albumId: string;
  
  play();
  pause();
  stop();
  seekTo(time: number);
  destroy();
}


