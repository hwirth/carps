// main.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { PROGRAM_NAME, PROGRAM_VERSION } from './constants.js';
import { Debug } from './debug.js';
import { RolePlayingGame } from './rpg.js';


/**
 * Application()
 */
const Application = function () {
	const self = this;

	this.debug;
	this.audioContext;
	this.rpg;


	/**
	 * eatEvent()
	 */
	this.eatEvent = function (event) {
		event = event || window.event;
		event.cancelBubble = true;
		event.stopPropagation();
		event.preventDefault();
		return false;

	}; // eatEvent


	/**
	 * time()
	 */
	this.time = function () {
		const now = new Date();
		return now.getTime() / 1000;

	}; // time


	/**
	 * log()
	 */
	this.log = function (...objects) {
		console.log( ...objects );

		if (self.rpg && self.rpg.console) self.rpg.console.log( ...objects );

	}; // log


	/**
	 * init()
	 */
	async function init () {
		document.title = PROGRAM_NAME + ' - ' + PROGRAM_VERSION;

		self.debug = new Debug();

		self.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		self.rpg = await new RolePlayingGame( self );

		self.log( 'app.rpg:', self.rpg );

		document.querySelectorAll( '.noscript' ).forEach( (element)=>{
			element.parentNode.removeChild( element );
		});

		document.querySelector( 'html' ).classList.remove( 'initializing' );

	} // init


	init();

}; // Application


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// PROGRAM ENTRY POINT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * onLoad
 */
addEventListener("load", async ()=>{
	new Application();

}); // onLoad


//EOF