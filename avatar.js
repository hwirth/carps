// avatar.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * Avatar()
 */
export const Avatar = function (app, rpg, initial) {
	const self = this;

	this.spriteName;
	this.location;
	this.facing;
	this.subSprite;
	this.voice;

	this.walkTimeout;
	this.sayingText;

	self.speed = 0.35;   // Tiles/second

	const stop_walking_interval = 150;
	const subsprite_change_interval = 0.15;


	/**
	 * getCurrentSprite()
	 */
	this.getCurrentSprite = function () {
		const sprite_code
		= ['NE', 'SE', 'SW', 'NW'][self.facing]
		+ '_'
		+ String( self.subSprite )
		;

		return rpg.sprites[self.spriteName][sprite_code];

	}; // getCurrentSprite


	/**
	 * turn()
	 */
	this.turn = function (new_direction) {
		self.facing = new_direction;
		rpg.viewport.requestUpdate();

	}; // stand


	/**
	 * stand()
	 */
	this.stand = function () {
		self.subSprite = 0;
		rpg.viewport.requestUpdate();

	}; // stand


	/**
	 * walk()
	 */
	this.walk = function (pressed_time) {
		const step_size = self.speed * rpg.elapsedSeconds;

		const target_location = {
			x: self.location.x,
			y: self.location.y,
		};

		switch (self.facing) {
		case 0:  target_location.y -= step_size;  break;
		case 1:  target_location.x += step_size;  break;
		case 2:  target_location.y += step_size;  break;
		case 3:  target_location.x -= step_size;  break;
		}

		rpg.world.movementAllowed( self.location, target_location );

		self.location = target_location;

		const animation_nr = Math.floor( pressed_time / subsprite_change_interval ) % 4;
		self.subSprite = [0, 1, 0, 2][animation_nr];

		if (self.walkTimeout !== null) {
			clearTimeout( self.walkTimeout );
		}

		self.walkTimeout = setTimeout( ()=>{
			clearTimeout( self.walkTimeout );
			self.walkTimeout = null;
			self.stand();

		}, stop_walking_interval );

		rpg.viewport.requestUpdate();

	}; // walk


	/**
	 * say()
	 */
	this.say = function (text) {
		rpg.viewport.setVoice( self.voice );
		const ctx = rpg.viewport.currentContext;

		const max_width = 300;
		const total_width = ctx.measureText( text ).width;
		const nr_required_lines = Math.ceil(total_width / max_width);

		function width (text) {
			return ctx.measureText( text ).width;
		}

		const words = text.split( ' ' );
		const lines = [];

		while (words.length > 0) {
			let current_line = '';
			while ((words.length > 0) && (width( current_line ) + width( words[0] ) < max_width)) {
				current_line += words[0] + ' ';
				words.shift();
			}

			lines.push( current_line.trim() );
		}

		const now = app.time();
		let line_nr = 0;

		lines.forEach( (line)=>{
			const index = now + '-' + line_nr;
			self.sayingText[index] = line;
			setTimeout( ()=>{
				delete self.sayingText[index];
				rpg.viewport.requestUpdate();

			}, 3000 + text.length*100 );
			++line_nr;
		});

		rpg.viewport.requestUpdate();

	}; // say


	/**
	 * init()
	 */
	function init () {
		initial.location = initial.location || { x:0, y:0 };

		self.spriteName = initial.spriteName || 'avatarWoman1',
		self.facing = initial.facing || 0;
		self.location   = {
			x: initial.location.x,
			y: initial.location.y,
		}
		self.subSprite = initial.subSprite || 0;
		self.voice = initial.voice || {
			font: 'sans-serif',
			color: '#08f',
			outlineColor: '#000',
		};

		self.walkTimeout = null;
		self.sayingText = {};

	} // init


	// CONSTRUCTOR

	init();

}; // Avatar


//EOF