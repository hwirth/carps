// viewport.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { DEBUG, SETTINGS } from './constants.js';


/**
 * Viewport()
 */
export const Viewport = function (app, rpg) {
	const self = this;

	this.canvasScene;
	this.canvasColorCodes;
	this.currentContext;

	this.contextScene;
	this.contextColorCodes;

	this.renderTimes;

	this.maxX;
	this.maxY;
	this.midX;
	this.midY;

	this.centerLocation;

	this.drawList;


	/**
	 * location_to_screen_xy()
	 */
	const ground_tile_width  = SETTINGS.GROUND_TILES.TILE_WIDTH;
	const ground_tile_height = SETTINGS.GROUND_TILES.TILE_HEIGHT;

	function location_to_screen_xy (location) {
		const x = location.x - self.centerLocation.x;
		const y = location.y - self.centerLocation.y;

		return {
			x: self.midX + x * ground_tile_width  - y * ground_tile_width,
			y: self.midY + x * ground_tile_height + y * ground_tile_height
				// Offset subterranean part of ground sprites
				+ ground_tile_height,
		};

	} // location_to_screen_xy


	/**
	 * get_sprite_screen_coords()
	 */
	function get_sprite_screen_coords (params) {
		const sprite = params.sprite;
		const canvas = sprite.picture;  // picture or outline

		const horizontal_align = params.horizontalAlign || 'left';
		const vertical_align = params.verticalAlign || 'bottom';
		const position = params.position || { x:0, y:0 };
		const offset = params.offset || { x:0, y:0 };

		const location = {
			x: params.location.x - 0.5,
			y: params.location.y - 0.5,
		};

		const align_offset = { x:0, y:0 };

		switch (horizontal_align) {
		case 'center' :  align_offset.x = -canvas.width / 2;  break;
		case 'right'  :  align_offset.x = -canvas.width;      break;
		}

		switch (vertical_align) {
		case 'center' :  align_offset.y = -canvas.height / 2;  break;
		case 'bottom' :  align_offset.y = -canvas.height;      break;
		}

		const screen_coords = location_to_screen_xy({
			x: location.x + position.x,
			y: location.y + position.y,
		});

		const x = screen_coords.x + align_offset.x + offset.x;
		const y = screen_coords.y + align_offset.y + offset.y;

		return { x:x, y:y };

	} // get_sprite_screen_coords


	/**
	 * draw_sprite()
	 */
	function draw_sprite (params) {
		const ctx = self.currentContext;

		const sprite = params.sprite;
		const canvas = sprite[params.selectedCanvas];  // picture or outline

		const grayscale = params.grayscale || 0;
		const brightness = params.brightness || 1;

		const screen_coords = get_sprite_screen_coords( params );

		if ((params.selectedCanvas != 'code') && false) {
			ctx.filter
			= 'grayscale(' + String(grayscale) + ')'
			+ ' brightness(' + String(brightness) + ')'
			;
		}

		ctx.drawImage( canvas, screen_coords.x, screen_coords.y );

	}; // draw_sprite


	/**
	 * setVoice()
	 */
	this.setVoice = function (voice) {
		const ctx = self.currentContext;
		ctx.textAlign = 'center';
		ctx.font = 'bold ' + SETTINGS.FONT.SIZE + 'px "' + voice.font + '"';
		ctx.fillStyle = voice.color;
		ctx.strokeStyle = voice.outlineColor;
		ctx.lineWidth = 2;

	}; // setVoice


	/**
	 * draw_speech_bubble()
	 */
	function draw_speech_bubble (params) {
		const ctx = self.currentContext;

		const avatar = params.avatar;
		const voice = avatar.voice;
		const lines = avatar.sayingText;
		const nr_lines = Object.keys( lines ).length;

		const line_height = SETTINGS.FONT.SIZE;
		const screen_coords = get_sprite_screen_coords( params );
		screen_coords.x += params.sprite.picture.width / 2;
		screen_coords.y -= line_height * nr_lines;

		self.setVoice( voice );

		let i = 0;
		for (const key in lines) {
			const text = lines[key];
			const x = screen_coords.x;
			const y = screen_coords.y + i * line_height;

			ctx.strokeText( text, x, y );
			ctx.fillText( text, x, y );

			++i;
		}

	} // draw_speech_bubble


	/**
	 * find_obfuscation_axis()
	 */
	function find_obfuscation_axis (base_coords) {
		let left  = { x:Number.POSITIVE_INFINITY, y:null };
		let right = { x:Number.NEGATIVE_INFINITY, y:null };

		for (let i = 0; i < base_coords.length; i+=2) {
			const X = i;
			const Y = i + 1;

			if (base_coords[X] < left.x) {
				left = { x:base_coords[X], y:base_coords[Y] };
			}
			if (base_coords[X] > right.x) {
				right = { x:base_coords[X], y:base_coords[Y] };
			}
		}

		const delta_x = right.x - left.x;
		const delta_y = right.y - left.y;

		return {
			left   : left,
			right  : right,
			deltaX : delta_x,
			deltaY : delta_y,
		};

	} // find_obfuscation_axis


	/**
	 * draw_debug_grid()
	 */
	function draw_debug_grid () {
		const ctx = self.canvasScene.getContext( '2d' );

		const draw_radius = Math.round( self.canvasScene.width / SETTINGS.GROUND_TILES.TILE_WIDTH );

		const tile_width  = SETTINGS.GROUND_TILES.TILE_WIDTH;
		const tile_height = SETTINGS.GROUND_TILES.TILE_HEIGHT;

		const int_center_location = {
			x: Math.floor( self.centerLocation.x ) - 0.5,
			y: Math.floor( self.centerLocation.y ) - 0.5,
		};

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#fc0';
		ctx.beginPath();
		for (let i = -draw_radius; i <= draw_radius; ++i) {
			const x_from = location_to_screen_xy({
				x: int_center_location.x - draw_radius,
				y: int_center_location.y + i,
			});
			const x_to = location_to_screen_xy({
				x: int_center_location.x + draw_radius,
				y: int_center_location.y + i,
			});

			const y_from = location_to_screen_xy({
				x: int_center_location.x + i,
				y: int_center_location.y - draw_radius,
			});
			const y_to = location_to_screen_xy({
				x: int_center_location.x + i,
				y: int_center_location.y + draw_radius,
			});

			ctx.moveTo( x_from.x, x_from.y );
			ctx.lineTo( x_to.x, x_to.y );
			ctx.moveTo( y_from.x, y_from.y );
			ctx.lineTo( y_to.x, y_to.y );
		}
		ctx.stroke();

		/*
		 * Center cross
		 */
		ctx.strokeStyle = '#f00';
		ctx.beginPath();
		ctx.moveTo( self.midX + 0.5, 0 );
		ctx.lineTo( self.midX + 0.5, self.maxY + 0.5 );
		ctx.moveTo( 0, self.midY + 0.5 );
		ctx.lineTo( self.maxX + 0.5, self.midY + 0.5 );
		ctx.stroke();

	} // draw_debug_grid


	/**
	 * draw_debug_sprites()
	 */
	function draw_debug_sprites () {
		self.drawList.forEach( (params)=>{
			const sprite = params.sprite;
			const canvas = sprite.picture;

			const ctx = self.canvasScene.getContext( '2d' );
			const screen_coords = get_sprite_screen_coords( params );

			if (sprite.type != 'ground') {
				const location = {
					x: params.location.x - 0.5,
					y: params.location.y - 0.5,
				};

				const location_coords = location_to_screen_xy( location );

				ctx.lineWidth = 1;
				ctx.strokeStyle = '#fff';
				ctx.beginPath();
				ctx.rect( screen_coords.x, screen_coords.y, canvas.width, canvas.height );

				ctx.moveTo( location_coords.x, location_coords.y );
				ctx.arc( location_coords.x, location_coords.y, 3, 0, 2*Math.PI );
				ctx.moveTo( location_coords.x, location_coords.y );

				if (params.offset != undefined) {
					ctx.lineTo(
						screen_coords.x + canvas.width/2 - params.offset.x,
						screen_coords.y + canvas.height - params.offset.y,
					);
				}

				ctx.lineTo( screen_coords.x, screen_coords.y );

				ctx.stroke();

				const text = params.zIndex;
				ctx.font = '12px sans-serif';
				ctx.textAlign = 'left';
				ctx.textBaseline = 'top';
				ctx.fillStyle = '#fc0';
				ctx.fillText( text, screen_coords.x + 2, screen_coords.y + 2 );
			}

			if (sprite.baseCoords != undefined) {
				const axis = find_obfuscation_axis( sprite.baseCoords );

				ctx.lineWidth = 2;
				ctx.strokeStyle = '#f00';
				ctx.beginPath();
				const x0 = axis.left.x + screen_coords.x;
				const y0 = axis.left.y + screen_coords.y;
				const x1 = x0 + axis.deltaX;
				const y1 = y0 + axis.deltaY;
				ctx.moveTo( x0, y0 );
				ctx.lineTo( x1, y1 );
				ctx.stroke();

			}
		});

	} // draw_debug_sprites


	/**
	 * update()
	 */
	this.update = function (force = false, selected_canvas = 'picture') {

		/**
		 * add_vector()
		 */
		function add_vector (a, b) {
			return {
				x: a.x + b.x,
				y: a.y + b.y,
			};

		} // add_vector


		if ((self.updateRequested === true) || (force === true)) {
			const start_time = app.time();

			self.centerLocation = rpg.player.avatar.location;

			if (DEBUG.COLOR_CODES) selected_canvas = 'code';

			self.currentContext.clearRect( 0, 0, self.maxX, self.maxY );

			self.drawList = [];
			calc_ground( selected_canvas );
			calc_avatars( selected_canvas );

			self.drawList
			.sort( (a, b)=>{
				if( (a.sprite.baseCoords == undefined) && (b.sprite.baseCoords == undefined)
				||  (a.sprite.baseCoords != undefined) && (b.sprite.baseCoords != undefined)
				||  (a.avatar == undefined) && (b.avatar == undefined)
				) {
					// Either both or none have base coords.
					// Both have base coords? Treat as if no coords exists.
					const aZ = a.zIndex + a.offset.y / SETTINGS.GROUND_TILES.TILE_HEIGHT;
					const bZ = b.zIndex + b.offset.y / SETTINGS.GROUND_TILES.TILE_HEIGHT;

 					return Math.sign( aZ - bZ );

				} else {
					// One of the two hase base coords.

					var has_base, no_base;
					if (a.sprite.baseCoords == undefined) {
						has_base = b;
						no_base = a;
					} else {
						has_base = a;
						no_base = b;
					}

					const has_base_coords = get_sprite_screen_coords( has_base );
					const no_base_coords = get_sprite_screen_coords( no_base );

					const padding = SETTINGS.SPRITE_EDITOR.PADDING;
					const axis = find_obfuscation_axis( has_base.sprite.baseCoords );

					no_base_coords.y += no_base.sprite.picture.height;

					const OA = add_vector( has_base_coords, axis.left );
					const OB = add_vector( has_base_coords, axis.right );
					const AB = { x:axis.deltaX, y:axis.deltaY };
					const OD = no_base_coords;

					const d
					= (AB.x*OD.y - AB.x*OA.y - AB.y*OD.x + AB.y*OA.x)
					/ (AB.y*AB.y + AB.x*AB.x)
					;

					return Math.sign( -d );
				}
			})
			.forEach( (params)=>{
				draw_sprite( params, selected_canvas );
			});

			if (SETTINGS.AVATAR.OUTLINE) {
				rpg.avatars.forEach( (avatar)=>{
					const sprite = avatar.getCurrentSprite();
					draw_sprite({
						sprite: sprite,
						selectedCanvas: 'outline',
						location: avatar.location,
						offset: { x:0, y:5 },
						horizontalAlign: 'center',
						verticalAlign: 'bottom',
					});
				});
			}

			if (selected_canvas == 'picture') {
				self.drawList.forEach( (params)=>{
					if (params.avatar != undefined) {
						draw_speech_bubble( params );
					}
				});

				if (DEBUG.GRID) draw_debug_grid();
				if (DEBUG.SPRITES) draw_debug_sprites();
			}

			self.updateRequested = false;

			app.debug.data.renderTimes.push( app.time() - start_time );
			++app.debug.data.frameCount;
		}

	}; // update


	/**
	 * requestUpdate()
	 */
	this.requestUpdate = function () {
		self.updateRequested = true;

	}; // requestUpdate


	/**
	 * calc_ground()
	 */
	function calc_ground (selected_canvas = 'picture') {
		const draw_radius = Math.round( self.canvasScene.width / SETTINGS.GROUND_TILES.TILE_WIDTH );
		const view_radius = 2.75;

		for (let y = -draw_radius; y <= draw_radius; ++y) {
			for (let x = -draw_radius; x <= draw_radius; ++x) {
				if (Math.abs(x) + Math.abs(y) > draw_radius) continue;

				const tile_x = Math.floor( self.centerLocation.x ) + x;
				const tile_y = Math.floor( self.centerLocation.y ) + y;

				const location
				= (rpg.world.locationExists( tile_x, tile_y ))
				? rpg.world.locations[tile_x][tile_y]
				: rpg.world.emptyLocation
				;

				const distance_to_center = Math.sqrt( tile_x*tile_x + tile_y*tile_y );

				let grayscale = 1;
				if (distance_to_center <= view_radius) grayscale = 0.5;
				if (distance_to_center < view_radius*0.75) grayscale = 0;

				const brightness = (1-grayscale) / 2 + 0.5;

				draw_sprite({
					sprite: location.sprite,
					selectedCanvas: selected_canvas,
					location: { x: tile_x, y: tile_y },
					offset: { x:0, y:0 },
					horizontalAlign: 'center',
					verticalAlign: 'top',
					grayscale: grayscale,
					brightness: brightness,
				});

				location.props.forEach( (prop)=>{
					const z
					= tile_x + prop.position.x
					+ tile_y + prop.position.y
					+ (prop.offset.x / SETTINGS.GROUND_TILES.TILE_WIDTH )
					+ (prop.offset.y / SETTINGS.GROUND_TILES.TILE_HEIGHT)
					;

					self.drawList.push({
						sprite: prop.sprite,
						selectedCanvas: selected_canvas,
						location: { x: tile_x, y: tile_y },
						position: prop.position,
						offset: prop.offset,
						horizontalAlign: 'center',
						verticalAlign: 'bottom',
						grayscale: grayscale,
						brightness: brightness,
						zIndex: z,
					});
				});
			}
		}

	} // calc_ground


	/**
	 * calc_avatars()
	 */
	function calc_avatars (selected_canvas = 'picture') {
		rpg.avatars.forEach( (avatar)=>{
			const sprite = avatar.getCurrentSprite();
			const z = avatar.location.x + avatar.location.y - 0 / SETTINGS.GROUND_TILES.TILE_HEIGHT;
			self.drawList.push({
				sprite: sprite,
				selectedCanvas: selected_canvas,
				location: avatar.location,
				offset: { x:0, y:5 },
				horizontalAlign: 'center',
				verticalAlign: 'bottom',
				zIndex: z,
				avatar: avatar,
			});
		});

	} // calc_avatars


	/**
	 * getCodeColor()
	 */
	this.getCodeColor = function (x, y) {
		self.currentContext = self.canvasColorCodes.getContext( '2d' );
		self.update( /*force*/true, 'code' );

		const imageData = self.currentContext.getImageData( x, y, 1, 1 );
		const id
		= (imageData.data[0] << 24)
		+ (imageData.data[1] << 16)
		+ (imageData.data[2])
		;

		self.currentContext = self.canvasScene.getContext( '2d' );

		return id;

	}; // getCodeColor


	/**
	 * on_resize()
	 */
	function on_resize (first_call = true) {
		document.body.classList.add( 'hide_overflow' );

		self.maxX = document.body.offsetWidth;
		self.maxY = document.body.offsetHeight;
		self.midX = Math.floor( self.maxX / 2 );
		self.midY = Math.floor( self.maxY / 2 );

		self.canvasScene.setAttribute( 'width', self.canvasScene.width = self.maxX );
		self.canvasScene.setAttribute( 'height', self.canvasScene.height = self.maxY );

		self.canvasColorCodes.setAttribute( 'width', self.canvasColorCodes.width = self.maxX );
		self.canvasColorCodes.setAttribute( 'height', self.canvasColorCodes.height = self.maxY );

		if (first_call !== true) self.update( /*force*/true );

		setTimeout( ()=>{
			document.body.classList.remove( 'hide_overflow' );
		});


	}; // on_resize


	/**
	 * init()
	 */
	function init () {
		self.drawList = null;
		self.renderTimes = [];

		self.containerElement = document.createElement( 'div' );
		self.canvasScene = document.createElement( 'canvas' );
		self.canvasColorCodes = document.createElement( 'canvas' );

		self.containerElement.className = 'viewport';
		self.canvasScene.className = 'world';
		self.canvasColorCodes.className = 'hidden color_codes';

		self.currentContext = self.canvasScene.getContext( '2d' );

		self.containerElement.appendChild( self.canvasScene );
		self.containerElement.appendChild( self.canvasColorCodes );
		document.body.appendChild( self.containerElement );

		self.centerLocation = { x:0, y:0 };
		self.updateRequested = true;

		addEventListener( 'resize', on_resize );
		self.containerElement.addEventListener( 'contextmenu', app.eatEvent );

		on_resize();

	} // init


	// CONSTRUCTOR

	init();

}; // Viewport


//EOF