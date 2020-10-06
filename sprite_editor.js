// sprite_editor.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { SETTINGS } from './constants.js';


/**
 * SpriteEditor()
 */
export const SpriteEditor = function (app, rpg) {
	const self = this;

	this.containerElement;
	this.canvasPicture;
	this.canvasData;

	this.selectGroup;
	this.selectSprite;

	this.nrSprites;
	this.currentSpriteNr;
	this.currentSpriteName;
	this.currentSprite;

	this.vertices;


	/**
	 * update_output()
	 */
	function update_output () {
		let data = self.currentSpriteName + ': [';
		self.vertices.forEach( (vertex)=>{
			data += String( vertex.x ) + ',' + String( vertex.y ) + ',';
		});
		if (self.vertices.length > 0) data = data.slice( 0, -1 );
		self.preOutput.innerHTML = data + ']';

	} // update_output


	/**
	 * load_vertices()
	 */
	function load_vertices (base_coords) {
		self.vertices = [];

		if (base_coords != undefined) {
			for (let i = 0; i < base_coords.length; i+=2) {
				self.vertices.push({
					x: base_coords[i],
					y: base_coords[i + 1],
				});
			}
		}

	} // load_vertices


	/**
	 * save_vertices()
	 */
	function save_vertices () {
		const base_coords = [];

		self.vertices.forEach( (vertex)=>{
			base_coords.push(
				vertex.x,
				vertex.y,
			);
		});

		self.currentSprite.baseCoords = base_coords;

	} // save_vertices


	/**
	 * find_obfuscation_axis()
	 */
	function find_obfuscation_axis () {
		let left = { x:Number.POSITIVE_INFINITY, y:null };
		let right = { x:Number.NEGATIVE_INFINITY, y:null };

		self.vertices.forEach( (vertex)=>{
			if (vertex.x < left.x) {
				left = vertex;
			}
			if (vertex.x > right.x) {
				right = vertex;
			}
		});

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
	 * draw_base()
	 */
	function draw_base () {
		const padding = SETTINGS.SPRITE_EDITOR.PADDING;

		const ctx = self.canvasData.getContext( '2d' );
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#00f';

		ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
		if (self.vertices.length == 0) return;

		const last = self.vertices.length - 1;

		ctx.beginPath();
		ctx.moveTo( self.vertices[last].x + padding, self.vertices[last].y + padding );
		self.vertices.forEach( (vertex)=>{
			ctx.lineTo( vertex.x + padding, vertex.y + padding );
		});
		ctx.stroke();

		ctx.strokeStyle = '#00f';
		ctx.beginPath();
		ctx.arc(
			self.vertices[0].x + padding - 0.5,
			self.vertices[0].y + padding - 0.5,
			2,
			0, 2*Math.PI,
		);
		ctx.stroke();


		/*
		 * Obfuscation axis
		 */
		const axis = find_obfuscation_axis();

		ctx.strokeStyle = '#f00';
		ctx.beginPath();
		ctx.moveTo(
			axis.left.x - axis.deltaX * 100 + padding,
			axis.left.y - axis.deltaY * 100 + padding,
		);
		ctx.lineTo(
			axis.left.x + axis.deltaX * 100 + padding,
			axis.left.y + axis.deltaY * 100 + padding,
		);
		ctx.stroke();

	} // draw_base


	/**
	 * draw_guide()
	 */
	function draw_guide (event) {
		const x = event.layerX;
		const y = event.layerY;

		const delta_x = SETTINGS.GROUND_TILES.TILE_WIDTH * 10;
		const delta_y = SETTINGS.GROUND_TILES.TILE_HEIGHT * 10;

		const ctx = self.canvasData.getContext( '2d' );
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#fc0';
		ctx.beginPath();
		ctx.moveTo( x - delta_x, y - delta_y );
		ctx.lineTo( x + delta_x, y + delta_y );
		ctx.moveTo( x - delta_x, y + delta_y );
		ctx.lineTo( x + delta_x, y - delta_y );
		ctx.stroke();


		const padding = SETTINGS.SPRITE_EDITOR.PADDING;
		const axis = find_obfuscation_axis( self.vertices );
		const OA = axis.left;
		const OB = axis.right;
		const AB = { x:axis.deltaX, y:axis.deltaY };
		const OD = { x:x - padding, y:y - padding };

		const d
		= (AB.x*OD.y - AB.x*OA.y - AB.y*OD.x + AB.y*OA.x)
		/ (AB.y*AB.y + AB.x*AB.x)
		;

		const n = { x: AB.y, y:-AB.x };
		const OC = { x:OD.x + d*n.x, y:OD.y + d*n.y };

		ctx.strokeStyle = '#08a';
		ctx.beginPath();
		ctx.moveTo( OC.x + padding, OC.y + padding );
		ctx.lineTo( OD.x + padding, OD.y + padding );
		ctx.stroke();

	} // draw_guide


	/**
	 * load_sprite()
	 */
	function load_sprite (index) {
		const padding = SETTINGS.SPRITE_EDITOR.PADDING;

		self.selectSprite.selectedIndex = index;

		self.currentSpriteName = Object.keys( self.currentGroup )[index];
		self.currentSprite = self.currentGroup[self.currentSpriteName];

		const width = self.currentSprite.picture.width;
		const height = self.currentSprite.picture.height;

		self.canvasPicture.setAttribute( 'width', self.canvasPicture.width = width );
		self.canvasPicture.setAttribute( 'height', self.canvasPicture.height = height );

		self.canvasData.setAttribute( 'width', self.canvasData.width = width + 2*padding );
		self.canvasData.setAttribute( 'height', self.canvasData.height = height + 2*padding );

		const ctx = self.canvasPicture.getContext( '2d' );
		ctx.drawImage( self.currentSprite.picture, 0, 0 );

		self.canvasPicture.style.marginTop = String( -height / 2 ) + 'px';
		self.canvasPicture.style.marginLeft = String( -width / 2 ) + 'px';

		self.canvasData.style.marginTop = String( -height / 2 ) + 'px';
		self.canvasData.style.marginLeft = String( -width / 2 ) + 'px';

		load_vertices( self.currentSprite.baseCoords );

		draw_base();
		update_output();

	} // load_sprite


	/**
	 * on_group_change()
	 */
	function on_group_change () {
		const group_name = self.selectGroup[self.selectGroup.selectedIndex].innerText;
		self.currentGroup = rpg.sprites[group_name];

		self.selectSprite.innerHTML = '';

		for (const key in self.currentGroup) {
			const option = document.createElement( 'option' );
			option.innerHTML = key;
			self.selectSprite.appendChild( option );
		}

		self.nrSprites = Object.keys( self.currentGroup ).length;
		load_sprite( self.currentSpriteNr = 0 );

	} // on_group_change


	/**
	 * on_sprite_change()
	 */
	function on_sprite_change () {
		load_sprite( self.selectSprite.selectedIndex );

	} // on_sprite_change


	/**
	 * on_next_sprite()
	 */
	function on_next_sprite () {
		self.currentSpriteNr = (self.currentSpriteNr + 1) % self.nrSprites;
		load_sprite( self.currentSpriteNr );

	} // on_next_sprite


	/**
	 * on_prev_sprite()
	 */
	function on_prev_sprite () {
		self.currentSpriteNr = (self.currentSpriteNr + self.nrSprites - 1) % self.nrSprites;
		load_sprite( self.currentSpriteNr );

	} // on_prev_sprite


	/**
	 * on_save_sprite()
	 */
	function on_save_sprite () {
		save_vertices();

	} // on_save_sprite


	/**
	 * on_undo_sprite()
	 */
	function on_undo_sprite () {
		load_sprite( self.currentSpriteNr );

	} // on_undo_sprite


	/**
	 * on_mouse_move()
	 */
	function on_mouse_move (event) {
		draw_base();
		draw_guide( event )

	} // on_mouse_move


	/**
	 * on_mouse_up()
	 */
	function on_mouse_up (event) {
		const padding = SETTINGS.SPRITE_EDITOR.PADDING;

		switch (event.button) {
		case 0:
			self.vertices.push({
				x: event.layerX - padding,
				y: event.layerY - padding,
			});
			break;

		case 2:
			if (self.vertices.length > 0) {
				self.vertices.pop();
			}
			break;
		}

		draw_base();
		draw_guide( event )
		update_output();

	} // on_mouse_up


	/**
	 * on_key_down()
	 */
	function on_key_down (event) {
		if (event.code == 'Escape') self.hide();

	} // on_key_down


	/**
	 * show()
	 */
	this.show = function () {
		self.containerElement.classList.remove( 'hidden' );
		//addEventListener( 'keydown', on_key_down );

	}; // show


	/**
	 * hide()
	 */
	this.hide = function () {
		self.containerElement.classList.add( 'hidden' );
		//removeEventListener( 'keydown', on_key_down );

	}; // hide


	/**
	 * init()
	 */
	function init () {
		self.containerElement = document.createElement( 'div' );
		self.canvasPicture = document.createElement( 'canvas' );
		self.canvasData = document.createElement( 'canvas' );
		self.selectGroup = document.createElement( 'select' );
		self.selectSprite = document.createElement( 'select' );
		self.preOutput = document.createElement( 'pre' );

		const button_prev = document.createElement( 'button' );
		const button_next = document.createElement( 'button' );
		const button_save = document.createElement( 'button' );
		const button_undo = document.createElement( 'button' );
		const button_exit = document.createElement( 'button' );

		for (const key in rpg.sprites) {
			if (typeof rpg.sprites[key] != 'function') {
				const option = document.createElement( 'option' );
				option.innerHTML = key;
				self.selectGroup.appendChild( option );
			}
		}

		button_prev.innerHTML = 'Prev';
		button_next.innerHTML = 'Next';
		button_save.innerHTML = 'Save';
		button_undo.innerHTML = 'Undo';
		button_exit.innerHTML = 'Exit';

		self.containerElement.className = 'sprite_editor hidden';
		self.canvasPicture.className = 'picture';
		self.canvasData.className = 'data';

		self.containerElement.appendChild( self.canvasPicture );
		self.containerElement.appendChild( self.canvasData );

		self.containerElement.appendChild( self.selectGroup );
		self.containerElement.appendChild( self.selectSprite );

		self.containerElement.appendChild( button_prev );
		self.containerElement.appendChild( button_next );
		self.containerElement.appendChild( button_save );
		self.containerElement.appendChild( button_undo );
		self.containerElement.appendChild( button_exit );

		self.containerElement.appendChild( self.preOutput );

		document.body.appendChild( self.containerElement );

		self.selectGroup.addEventListener( 'change', on_group_change );
		self.selectSprite.addEventListener( 'change', on_sprite_change );

		button_prev.addEventListener( 'mouseup', on_prev_sprite );
		button_next.addEventListener( 'mouseup', on_next_sprite );
		button_save.addEventListener( 'mouseup', on_save_sprite );
		button_undo.addEventListener( 'mouseup', on_undo_sprite );
		button_exit.addEventListener( 'mouseup', self.hide );

		self.canvasData.addEventListener( 'mouseup', on_mouse_up );
		self.canvasData.addEventListener( 'mousemove', on_mouse_move );
		self.canvasData.addEventListener( 'contextmenu', app.eatEvent );

		for (let i = 0; i < self.selectGroup.children.length; ++i) {
			if (self.selectGroup[i].innerText == 'buildings') {
				self.selectGroup.selectedIndex = i;
				break;
			}
		}

		on_group_change();

	} // init


	// CONSTRUCTOR

	init();

}; // SpriteEditor


//EOF