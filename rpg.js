// rpg.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { DEBUG, SETTINGS } from './constants.js';

import { FontManager, FontSelector } from './fonts.js';
import { Jukebox } from './jukebox.js';
import { Sprites } from './sprites.js';
import { Viewport } from './viewport.js';
import { MouseController } from './mouse.js';
import { KeyboardController } from './keyboard.js';
import { MENU_DEFINITION, MainMenu } from './main_menu.js';

import { Console } from './console.js';
import { Avatar } from './avatar.js';
import { World } from './world.js';
import { Player } from './player.js';

import { SpriteEditor } from './sprite_editor.js';


/**
 * RolePlayingGame()
 */
export const RolePlayingGame = function (app) {
	const self = this;

	this.mouse;
	this.console;
	this.sprites;
	this.avatars;
	this.world;
	this.player;

	this.spriteEditor;

	this.elapsedSeconds;
	this.running;

	const game_loop_interval = 0;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * start_animation_loop()
	 */
	function start_animation_loop () {
		let previous_update_time = null;

		function loop (timestamp) {
			self.now = timestamp / 1000;
			self.elapsedSeconds = (previous_update_time === null) ? 0 : self.now - previous_update_time;
			previous_update_time = self.now;

			if (self.mouse.buttons[2] !== false) {
				const pressed_time = self.now - self.mouse.buttons[2];

				if (pressed_time > 0.15) {
					self.player.avatar.walk( pressed_time );
				}
			}

			self.viewport.update();

			if (self.running) requestAnimationFrame( loop );
		}

		requestAnimationFrame( loop );

	} // start_animation_loop


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// EVENTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * on_mouse_move()
	 */
	function on_mouse_move (event) {
		if (self.mouse.buttons[2]) {
			self.player.avatar.turn( self.mouse.direction );
		}

	} // on_mouse_move


	/**
	 * on_mouse_stop()
	 */
	function on_mouse_stop (event) {
		if (self.mouse == undefined) return;

		const code = self.viewport.getCodeColor( event.layerX, event.layerY );
		const sprite = self.sprites.findById( code );
		const name = sprite.name;
		//...app.log( code, name );

		const custom_cursor = (self.mouse.buttons[2] !== false) || (name.substr(0, 6) == 'ground');
		self.mouse.toggleCursor( custom_cursor );

	} // on_mouse_stop


	/**
	 * on_mouse_down()
	 */
	function on_mouse_down (event) {
		switch (event.button) {
		case 0:
			const code = self.viewport.getCodeColor( event.layerX, event.layerY );
			const sprite = self.sprites.findById( code );
			const name = sprite.name;
			app.log( code, name );
			break;

		case 2:
			self.player.avatar.turn( self.mouse.direction );
			break;
		}

	} // on_mouse_down


	/**
	 * on_mouse_up()
	 */
	function on_mouse_up (event) {
		//self.console.inputElement.focus();

	} // on_mouse_up


	/**
	 * on_key_down()
	 */
	function on_key_down (event) {
		let handled = false;

		if (DEBUG.KEY_CODES) app.log( 'code:', event.code, 'key:', event.key );

		if (event.ctrlKey && event.altKey) {
			switch (event.key.toLowerCase()) {
			case 'm':
				self.jukebox.mute();
				handled = true;
				break;

			case 'n':
				self.jukebox.next();
				handled = true;
				break;

			case 'b':
				self.jukebox.prev();
				handled = true;
				break;

			case 'o':
				handled = true;
				break;

			case 'p':
				self.jukebox.pause();
				handled = true;
				break;

			case 's':
				DEBUG.SPRITES = !DEBUG.SPRITES;
				self.viewport.requestUpdate();
				handled = true;
				break;

			case '+':
				self.jukebox.volume( 'louder' );
				self.handled = true;
				break;

			case '-':
				self.jukebox.volume( 'softer' );
				self.handled = true;
				break;

			} // switch
		}

		if (handled) {
			event.preventDefault();
			event.stopPropagation();
			return false;

		} else {
			self.console.onKeyDown( event );
		}

	} // on_key_down


	/**
	 * on_menu_click()
	 */
	function on_menu_click (path, selected) {
		console.log( 'MENU>', path, selected );

		const path_debug = 'admin/debug/';
		const path_tracks = 'jukebox/tracks/';

		if ((path.substr( 0, path_debug.length ) == path_debug) && (path != 'admin/debug/avatarOutline')) {
			const key = path.substr( path_debug.length );
			DEBUG[key] = selected;
			self.viewport.requestUpdate();
		}

		if (path.substr( 0, path_tracks.length ) == path_tracks) {
			const keys = path.substr( path_tracks.length ).split( '/' );
			self.jukebox.play( SETTINGS.MUSIC.SELECTIONS[keys[0]], keys[1] );
			return;
		}

		switch (path) {
		case 'jukebox/next':
			self.jukebox.next();
			break;

		case 'jukebox/prev':
			self.jukebox.prev();
			break;

		case 'jukebox/pause':
			self.jukebox.pause();
			break;

		case 'jukebox/mute':
			self.jukebox.mute();
			break;

		case 'jukebox/louder':
			self.jukebox.volume( 'louder' );
			self.handled = true;
			break;

		case 'jukebox/softer':
			self.jukebox.volume( 'softer' );
			self.handled = true;
			break;

		case 'admin/spriteEditor':
			self.spriteEditor.show();
			break;

		case 'admin/debug/COLOR_CODES':
			document.querySelector( '.color_codes' ).classList.toggle( 'hidden', !DEBUG.COLOR_CODES );
			break;

		case 'admin/fontList':
			if (self.fontSelector !== null) {
				self.fontSelector.exit();
			} else {
				self.fontSelector = new FontSelector( app, self );
			}
			break;

		case 'admin/debug/avatarOutline':
			SETTINGS.AVATAR.OUTLINE = !SETTINGS.AVATAR.OUTLINE;
			self.viewport.requestUpdate();
			break;

		} // case

	} // on_menu_click


	/**
	 * on_text_input()
	 */
	function on_text_input (text) {
		self.avatars[0].say( text );

	} // on_text_input


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// CONSTRUCTOR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * add_properties_to_self()
	 */
	function add_properties_to_self (initialized_objects) {
		initialized_objects.forEach( (object)=>{
			const proto_name = object.constructor.name;
			const prop_name = proto_name.charAt(0).toLowerCase() + proto_name.substr(1);
			self[prop_name] = object;
		});

	} // add_properties_to_self


	/**
	 * init()
	 */
	function init () {
		self.console = new Console( app, self, { onInput: on_text_input } );
		self.console.log( document.title );

		self.jukebox = new Jukebox( app, self, {
				onTrackEnded: ()=>{ setTimeout( self.jukebox.next, 5000 ); },
		});
		self.jukebox.load(
			SETTINGS.MUSIC.SELECTIONS.UNSORTED,
			/*auto_start*/(app.audioContext.state != 'suspended'),
		);
		self.console.log( 'rpg.audioContext.state =', app.audioContext.state );

		function format (name) {
			name
			= (name + '.mp3').split( '.mp3' )[0]
			.replace( /-/g, ' ' )
			.replace( /_/g, ' ' )
			;

			const words = name.split( ' ' );
			let formatted = '';
			words.forEach( (word)=>{
				formatted += word.charAt( 0 ).toUpperCase() + word.substr( 1 ).toLowerCase() + ' ';
			});

			return formatted.trim();
		}

		for (const key in DEBUG) {
			const parts = key.split( '_' );

			let caption = '';
			parts.forEach( (part)=>{
				caption += part.charAt( 0 ) + part.substr( 1 ).toLowerCase() + ' ';
			});
			caption = caption.slice( 0, -1 );

			MENU_DEFINITION.admin.subMenu.debug.subMenu[key] = {
				caption: caption,
				checkMark: true,
				selected: DEBUG[key],
			};
		}
		for (const selection_key in SETTINGS.MUSIC.SELECTIONS) {
			const selection = SETTINGS.MUSIC.SELECTIONS[selection_key];
			const selection_menu = MENU_DEFINITION.jukebox.subMenu.tracks.subMenu;

			selection_menu[selection_key] = {
				caption: format( selection_key ),
				subMenu: {},
			};

			selection.forEach( (track_key)=>{
				const file_name = SETTINGS.MUSIC.TRACKS[track_key];
				const track_menu = selection_menu[selection_key].subMenu;
				track_menu[track_key] = { caption: format( file_name ) };
			});
		}
		self.menu = new MainMenu( app, { onItemClick: on_menu_click } );
		document.querySelector( 'head' ).appendChild( self.menu.styleElement );
		document.body.appendChild( self.menu.containerElement );

		const assets_loaded = [
			new Sprites( app, self ),
			//new Sounds( app, self ),
		];

		return Promise.all( assets_loaded ).then( add_properties_to_self )
		.then( async ()=>{
			self.world = await new World( app, self );

			self.avatars = [
				new Avatar( app, self, {
					spriteName: 'avatarWoman1',
					facing: 1,
					location: { x: 0.5, y: 0.5 },
					subSprite: 0,
					voice: {
						font: SETTINGS.FONT.FAMILY,
						color: '#8cf',
						outlineColor: '#000',
					},
				}),
				new Avatar( app, self, {
					spriteName: 'avatarMan1',
					facing: 3,
					location: { x: 1.5, y: 0.5 },
					subSprite: 0,
					voice: {
						font: SETTINGS.FONT.FAMILY,
						color: '#08f',
						outlineColor: '#000',
					},
				}),
			];

			self.viewport     = new Viewport( app, self );
			self.player       = new Player( app, self, self.avatars[0] );
			self.fonts        = new FontManager( app, self );
			self.fontSelector = new FontSelector( app, self );
			self.spriteEditor = new SpriteEditor( app, self );

			self.fonts.load( SETTINGS.FONT.FAMILY, [document.body, self.console.inputElement] );

			self.mouse = new MouseController( app, self, {
				onMouseMove: on_mouse_move,
				onMouseStop: on_mouse_stop,
				onMouseDown: on_mouse_down,
				onMouseUp:   on_mouse_up,
			});

			self.viewport.update();

			addEventListener( 'keydown', on_key_down );

			self.running = true;
			start_animation_loop();

		}).catch( (error)=>{
			app.log( error );
		});

	} // init


	// CONSTRUCTOR

	return init().then( ()=>self );

}; // RolePlayingGame


//EOF