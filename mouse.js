// mouse.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * MouseCursor()
 */
export const MouseCursor = function (app, rpg, callbacks) {
	const self = this;

	this.image;
	this.buttonPressed;


	/**
	 * update()
	 */
	this.update = function (event) {
		var direction;

		const delta_x = event.layerX - rpg.viewport.midX;
		const delta_y = event.layerY - rpg.viewport.midY;

		if (delta_x < 0) {
			if (delta_y < 0) {
				direction = 'NW';
			} else {
				direction = 'SW';
			}
		} else {
			if (delta_y < 0) {
				direction = 'NE';
			} else {
				direction = 'SE';
			}
		}

		self.image.classList.remove( 'NE', 'SE', 'SW', 'NW' );
		self.image.classList.add( direction );
		self.image.src = rpg.sprites.cursors[direction].toDataURL();

		const vp_rect = rpg.viewport.canvas.getBoundingClientRect();

		self.image.style.left = String( vp_rect.x + event.layerX ) + 'px';
		self.image.style.top  = String( vp_rect.y + event.layerY ) + 'px';

	}; // update


	/**
	 * on_mouse_move()
	 */
	function on_mouse_move (event) {
		self.update( event );
		callbacks.onMouseMove( event );

	} // on_mouse_move


	/**
	 * on_mouse_down()
	 */
	function on_mouse_down (event) {
		self.buttonPressed[event.button] = true;
		callbacks.onMouseDown( event );
		return app.eatEvent( event );

	} // on_mouse_down


	/**
	 * on_mouse_up()
	 */
	function on_mouse_up (event) {
		self.buttonPressed[event.button] = true;
		callbacks.onMouseUp( event );
		return app.eatEvent( event );

	} // on_mouse_up


	/**
	 * init()
	 */
	function init () {
		self.buttonPressed = [false, false, false];

		return new Promise( (done)=>{
			self.image = document.createElement( 'img' );
			self.image.src = 'images/ui/directional_cursors.png';
			self.image.className = 'directional_cursor NE';

			self.image.addEventListener( 'load', ()=>{
				document.body.appendChild( self.image );

				rpg.viewport.canvas.addEventListener( 'mousemove', on_mouse_move );
				rpg.viewport.canvas.addEventListener( 'mousedown', on_mouse_down );
				rpg.viewport.canvas.addEventListener( 'mouseup',   on_mouse_up );

				done();
			});
		});

	} // init


	// CONSTRUCTOR

	init().then( ()=>self );

}; // MouseCursor


/**
 * MouseController()
 */
export const MouseController = function (app, rpg, callbacks) {
	const self = this;

	this.image;
	this.buttons;
	this.direction;

	this.moveTimeout
	const mouse_stop_interval = 0;


	/**
	 * toggleCursor()
	 */
	this.toggleCursor = function (visible) {
		//document.querySelector( '.viewport' ).classList.toggle( 'custom_cursor', visible );
		//document.querySelector( '.cursor' ).classList.toggle( 'hidden', !visible );
		rpg.viewport.containerElement.classList.toggle( 'custom_cursor', visible );
		self.image.classList.toggle( 'hidden', !visible );

	}; // toggleCursor


	/**
	 * update()
	 */
	this.update = function (event) {
		var direction;

		const delta_x = event.layerX - rpg.viewport.midX;
		const delta_y = event.layerY - rpg.viewport.midY;

		if (delta_x < 0) {
			if (delta_y < 0) {
				self.direction = 3;
			} else {
				self.direction = 2;
			}
		} else {
			if (delta_y < 0) {
				self.direction = 0;
			} else {
				self.direction = 1;
			}
		}

		const direction_name = ['NE', 'SE', 'SW', 'NW'][self.direction];

		self.image.classList.remove( 'NE', 'SE', 'SW', 'NW' );
		self.image.classList.add( direction_name );
		self.image.src = rpg.sprites.cursors[direction_name].picture.toDataURL();

		const vp_rect = rpg.viewport.canvasScene.getBoundingClientRect();

		self.image.style.left = String( vp_rect.x + event.layerX ) + 'px';
		self.image.style.top  = String( vp_rect.y + event.layerY ) + 'px';

	}; // update


	/**
	 * on_mouse_move()
	 */
	function on_mouse_move (event) {
		self.update( event );
		callbacks.onMouseMove( event );

		if (self.moveTimeout !== null) {
			clearTimeout( self.moveTimeout );
		}

		self.moveTimeout = setTimeout( ()=>{
			callbacks.onMouseStop( event );

		}, mouse_stop_interval );

	} // on_mouse_move


	/**
	 * on_mouse_down()
	 */
	function on_mouse_down (event) {
		self.buttons[event.button] = rpg.now;
		callbacks.onMouseDown( event );
		//return app.eatEvent( event );

	} // on_mouse_down


	/**
	 * on_mouse_up()
	 */
	function on_mouse_up (event) {
		self.buttons[event.button] = false;
		callbacks.onMouseUp( event );
		//return app.eatEvent( event );

	} // on_mouse_up


	/**
	 * init()
	 */
	function init () {
		self.moveTimeout = null;

		self.buttons = [false, false, false];
		self.direction = 0;

		self.image = document.createElement( 'img' );
		self.image.width = 18;
		self.image.height = 18;
		self.image.src = rpg.sprites.cursors.NW.picture.toDataURL();
		self.image.className = 'cursor hidden';

		document.body.appendChild( self.image );

		rpg.viewport.containerElement.addEventListener( 'mousemove', on_mouse_move );
		rpg.viewport.containerElement.addEventListener( 'mousedown', on_mouse_down );
		rpg.viewport.containerElement.addEventListener( 'mouseup',   on_mouse_up );

		rpg.viewport.containerElement.addEventListener( 'mouseout', ()=>{
			self.toggleCursor( false );
		});


	} // init


	// CONSTRUCTOR

	init();

}; // MouseController


//EOF