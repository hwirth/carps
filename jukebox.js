// jukebox.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { DEBUG, SETTINGS } from './constants.js';


/**
 * Jukebox()
 */
export const Jukebox = function (app, rpg, callbacks) {
	const self = this;

	this.audio;
	this.sources;

	this.autoStart;
	this.playingTracks;
	this.currentTrackNr;
	this.currentFileName;
	this.nextTrackTimeout;


	/**
	 * clear_timeout()
	 */
	function clear_timeout () {
		if (self.nextTrackTimeout !== null) {
			clearTimeout( self.nextTrackTimeout );
			self.nextTrackTimeout = null;
		}

	} // clear_timeout


	/**
	 * play()
	 */
	this.play = async function (new_track_names = null, selected_track = null) {
		clear_timeout();

		if (new_track_names === null) {
			self.currentTrackNr = (self.currentTrackNr + 1) % self.playingTracks.length;

		} else {
			self.playingTracks
			= (typeof new_track_names == 'string')
			? [new_track_names]
			: new_track_names
			;

			self.currentTrackNr = 0;

			if (DEBUG.JUKEBOX) app.log( 'Jukebox.playingTracks: New track list:', self.playingTracks );
		}

		if (selected_track !== null) {
			const index = self.playingTracks.indexOf( selected_track );
			if (index >= 0) {
				self.currentTrackNr = index;
			} else {
				throw new Error( 'Track "' + selected_track + ' not found in current playlist' );
			}
		}

		const current_track_name = self.playingTracks[self.currentTrackNr];

		if (self.sources[current_track_name] == undefined) {
			if (SETTINGS.MUSIC.TRACKS[current_track_name] == undefined) {
				throw new Error( 'Unknown track: ' + current_track_name );
			}

			const file_name = 'music/' + SETTINGS.MUSIC.TRACKS[current_track_name];

			if (DEBUG.JUKEBOX) app.log( 'Jukebox: Loading', file_name );

			await fetch (file_name).then( (response)=>{
				if (!response.ok) {
					throw new Error( 'Failed to fetch ' + file_name );
				}

				return response.blob();

			}).then( (blob)=>{
				//if (DEBUG.JUKEBOX) console.log( 'Jukebox: ', blob );

				self.sources[current_track_name] = {
					fileName: file_name,
					blob: URL.createObjectURL( blob ),
				};
			})
		}

		self.currentTrackName = self.playingTracks[self.currentTrackNr];
		const source = self.sources[self.currentTrackName];
		self.audio.src = source.blob;
		self.currentFileName = source.fileName;

	}; // play


	/**
	 * goto
	 */
	this.goto = function (track_name) {
		const index = self.playingTracks.indexOf( track_name );

		if (index >= 0) self.currentTrackNr = index - 1;
		self.play();

	}; // goto


	/**
	 * load()
	 */
	this.load = function (new_track_names, auto_start = false) {
		self.autoStart = auto_start;
		self.play( new_track_names );

	}; // load


	/**
	 * next()
	 */
	this.next = function () {
		self.play();

	}; // next


	/**
	 * prev()
	 */
	this.prev = function () {
		self.currentTrackNr += self.playingTracks.length - 2;
		self.play();

	}; // prev


	/**
	 * pause()
	 */
	this.pause = function () {
		if (self.audio.paused) {
			self.audio.play();
			if (DEBUG.JUKEBOX) app.log( 'Jukebox unpaused.' );
		} else {
			self.audio.pause();
			if (DEBUG.JUKEBOX) app.log( 'Jukebox paused.' );
		}

	}; // pause


	/**
	 * mute()
	 */
	this.mute = function (new_state = null) {
		if (new_state === null) {
			self.audio.muted = !self.audio.muted;
		} else {
			self.audio.muted = new_state;
		}

		if (self.audio.muted) {
			if (DEBUG.JUKEBOX) app.log( 'Jukebox muted.' );
		} else {
			if (DEBUG.JUKEBOX) app.log( 'Jukebox unmuted.' );
		}

	}; // mute


	/**
	 * volume()
	 */
	this.volume = function (new_volume) {
		if (typeof new_volume == 'string') {
			switch (new_volume) {
			case 'louder':  new_volume = Math.min( 1, self.audio.volume + 0.1 );  break;
			case 'softer':  new_volume = Math.max( 0, self.audio.volume - 0.1 );  break;
			default: throw new Error( 'Jukebox.volume(): Unknown command: "' + new_volume + '"' );
			}
			new_volume = Math.floor( new_volume * 100 ) / 100;
		}

		self.audio.volume = new_volume;
		if (DEBUG.JUKEBOX) app.log( 'Jukebox: volume =', self.audio.volume );

	}; // volume


	/**
	 * on_can_play()
	 */
	function on_can_play () {
		if (DEBUG.JUKEBOX) {
			app.log(
				'Jukebox: Playing track "'
				+ self.currentTrackName
				+ '" (' + self.currentFileName + ')'
			);
		}

		if (self.autoStart === true) {
			if (app.audioContext.state == 'suspended') {
				app.audioContext.resume();
			}

			self.audio.play();
		} else {
			self.autoStart = true;
		}

	} // on_can_play


	/**
	 * on_ended()
	 */
	function on_ended () {
		//clear_timeout();
		//self.nextTrackTimeout = setTimeout( self.next, 1000 );
		callbacks.onTrackEnded();

	} // on_ended


	/**
	 * init()
	 */
	function init (new_avatar) {
		self.currentTrackName = null;
		self.nextTrackTimeout = null;
		self.autoStart = false;

		self.audio = new Audio();
		self.sources = {};

		//self.audio.addEventListener( 'canplaythrough', on_can_play );
		self.audio.addEventListener( 'canplay', on_can_play );
		self.audio.addEventListener( 'ended', on_ended );

		self.volume( SETTINGS.MUSIC.VOLUME );

	} // init


	// CONSTRUCTOR

	init();

}; // Jukebox


//EOF