// console.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { SETTINGS } from './constants.js';


/**
 * Console()
 */
export const Console = function (app, rpg, callbacks) {
	const self = this;

	this.containerElement;
	this.outputElement;
	this.inputElement;


	/**
	 * print()
	 */
	this.print = function (html, class_name = null, timeout = null) {
		const item = document.createElement( 'li' );
		if (class_name !== null) item.className = class_name;
		item.innerHTML = html;

		self.outputElement.appendChild( item );

		setTimeout( ()=>{
			item.classList.add( 'decayed' );
			setTimeout( ()=>item.parentNode.removeChild( item ), SETTINGS.CONSOLE.DECAY_INTERVAL );
		}, (timeout === null) ? SETTINGS.CONSOLE.STAY_INTERVAL : timeout );


	}; // print


	/**
	 * log()
	 */
	this.log = function (...objects) {
		let text = '';
		[...objects].forEach( (object)=>{
			if (typeof object != 'object') {
				text += object + ' ';
			}
		});

		text = text.trim();

		if (text != '') self.print( '<strong>Log:</strong> ' + text );

	}; // log


	/**
	 * onKeyDown()
	 */
	this.onKeyDown = function (event) {
		self.inputElement.focus();

		if (event.key == 'Enter') {
			const text = self.inputElement.value.trim();

			if (text != '') {
				callbacks.onInput( text );
				self.inputElement.value = '';
			}
		}

	}; // onKeyDown


	/**
	 * init()
	 */
	async function init () {
		self.containerElement = document.createElement( 'div' );
		self.outputElement = document.createElement( 'ul' );
		self.inputElement = document.createElement( 'input' );

		self.containerElement.className = 'console';
		self.outputElement.className = 'output text_shadow';
		self.inputElement.className = 'input text_shadow';
		self.inputElement.type = 'text';

		self.containerElement.appendChild( self.outputElement );
		self.containerElement.appendChild( self.inputElement );
		document.body.appendChild( self.containerElement );

	} // init


	init();

}; // Console


//EOF