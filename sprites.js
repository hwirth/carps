// sprites.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { SETTINGS } from './constants.js';


/**
 * Sprites()
 */
export const Sprites = function (app, rpg) {
	const self = this;


	/**
	 * outline_from_image()
	 */
	function outline_from_image (source_canvas, left, top, width, height) {
		const sprite = sprite_from_image( source_canvas, left, top, width, height );
		const canvas = sprite.picture;
		let imageData = canvas.getContext( '2d' ).getImageData( 0, 0, width, height );

		const new_canvas = document.createElement( 'canvas' );
		new_canvas.width = width;
		new_canvas.height = height;
		const ctx = new_canvas.getContext( '2d' );

		const ofs = 1;

		ctx.scale( (width - 2*ofs) / width, (height - 2*ofs) / height );

		ctx.globalCompositeOperation = "hard-light";
		for (let x = -0.5; x <= 0.5; ++x) {
			for (let y = -0.5; y <= 0.5; ++y) {
				ctx.drawImage( canvas, x, y );
			}
		}

		ctx.globalCompositeOperation = 'source-in';
		ctx.fillStyle = 'rgba(0,0,0, 0.25)';
		ctx.fillRect( 0, 0, width, height );

		ctx.globalCompositeOperation = "destination-out";
		ctx.drawImage( canvas, 0, 0 );

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		imageData = ctx.getImageData( 0, 0, width-ofs, height-ofs );
		ctx.putImageData( imageData, ofs, ofs );

		return new_canvas;

	} // outline_from_image


	/**
	 * sprite_from_image()
	 */
	function sprite_from_image (source_canvas, left, top, width, height, create_outline = false) {
		var ctx;

		const scenery_canvas = document.createElement( 'canvas' );
		scenery_canvas.width = width;
		scenery_canvas.height = height;

		const imageData = source_canvas.getContext( '2d' ).getImageData( left, top, width, height );

		ctx = scenery_canvas.getContext( '2d' );
		ctx.putImageData( imageData, 0, 0 );

		return {
			picture: scenery_canvas,
			outline: (
				(create_outline)
				? outline_from_image( source_canvas, left, top, width, height )
				: null
			),
			code: null,
		};

	} // sprite_from_image


	/**
	 * code_from_image()
	 */
	function code_from_image (source_canvas, id) {
		var ctx;

		const width = source_canvas.width;
		const height = source_canvas.height;

		const code_canvas = document.createElement( 'canvas' );
		code_canvas.width = width;
		code_canvas.height = height;

		const imageData = source_canvas.getContext( '2d' ).getImageData( 0, 0, width, height );

		ctx = code_canvas.getContext( '2d' );
		ctx.putImageData( imageData, 0, 0 );

		const code = parseInt( id );
		const r = (code & 0xFF0000) >> 16;
		const g = (code & 0x00FF00) >> 8;
		const b = (code & 0x0000FF);

		ctx.globalCompositeOperation = 'source-in';
		ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
		ctx.fillRect( 0, 0, width, height );

		return code_canvas;

	} // code_from_image


	/**
	 * load_image()
	 */
	function load_image (file_name) {
		return new Promise( (done)=>{
			const image = new Image();
			image.src = file_name;
			image.addEventListener( 'load', ()=>{
				const canvas = document.createElement( 'canvas' );
				canvas.width = image.naturalWidth;
				canvas.height = image.naturalHeight;
				const context = canvas.getContext( '2d' );
				context.drawImage( image, 0, 0 );

				done( canvas );
			});

		}).catch( (error)=>{
			app.log( 'Sprites.load_image:', error );
		});
	};


	/**
	 * cursors()
	 */
	function cursors () {
		return load_image( 'images/ui/directional_cursors.png' )
		.then( (canvas)=>{
			return {
				name: 'cursors',
				sprites: {
					NE: sprite_from_image( canvas, 18,  0, 18, 18 ),
					SE: sprite_from_image( canvas, 18, 18, 18, 18 ),
					SW: sprite_from_image( canvas,  0, 18, 18, 18 ),
					NW: sprite_from_image( canvas,  0,  0, 18, 18 ),
				},
			};
		});

	} // cursors


	/**
	 * avatar()
	 */
	function avatar (file_name) {
		return load_image( 'images/avatars/' + file_name + '.png' )
		.then( (canvas)=>{
			return {
				name: 'avatar' + file_name.charAt(0).toUpperCase() + file_name.substr(1),
				sprites: {
					SW_0: sprite_from_image( canvas, 32, 0, 32, 48, /*create_outline*/true ),
					SW_1: sprite_from_image( canvas, 64, 0, 32, 48, /*create_outline*/true ),
					SW_2: sprite_from_image( canvas,  0, 0, 32, 48, /*create_outline*/true ),
					SE_0: sprite_from_image( canvas, 32, 48, 32, 48, /*create_outline*/true ),
					SE_1: sprite_from_image( canvas, 64, 48, 32, 48, /*create_outline*/true ),
					SE_2: sprite_from_image( canvas,  0, 48, 32, 48, /*create_outline*/true ),
					NW_0: sprite_from_image( canvas, 32, 96, 32, 48, /*create_outline*/true ),
					NW_1: sprite_from_image( canvas, 64, 96, 32, 48, /*create_outline*/true ),
					NW_2: sprite_from_image( canvas,  0, 96, 32, 48, /*create_outline*/true ),
					NE_0: sprite_from_image( canvas, 32, 144, 32, 48, /*create_outline*/true ),
					NE_1: sprite_from_image( canvas, 64, 144, 32, 48, /*create_outline*/true ),
					NE_2: sprite_from_image( canvas,  0, 144, 32, 48, /*create_outline*/true ),
				},
			};
		});

	} // avatar


	/**
	 * ground()
	 */
	function ground () {
		return load_image( 'images/scenery/village/ground-sprite-sheet.png' )
		.then( (canvas)=>{
			const definitions = [
				{ x:0, y:0, name:'waterWithLandSE' },
				{ x:1, y:0, name:'waterWithLandSW' },
				{ x:2, y:0, name:'waterWithLandNW' },
				{ x:3, y:0, name:'pathNESWNW' },
				{ x:4, y:0, name:'pathNESENW' },

				{ x:0, y:1, name:'pathSESW' },
				{ x:1, y:1, name:'waterWithLandS' },
				{ x:2, y:1, name:'waterWithLandNE' },
				{ x:3, y:1, name:'water' },
				{ x:4, y:1, name:'pathNESESW' },

				{ x:0, y:2, name:'pathNESE' },
				{ x:1, y:2, name:'pathSWNW' },
				{ x:2, y:2, name:'waterWithLandW' },
				{ x:3, y:2, name:'waterWithLandNENW' },
				{ x:4, y:2, name:'waterWithLandNESE' },

				{ x:0, y:3, name:'dirt' },
				{ x:1, y:3, name:'pathNENW' },
				{ x:2, y:3, name:'pathNESW' },
				{ x:3, y:3, name:'waterWithLandE' },
				{ x:4, y:3, name:'waterWithLandN' },

				{ x:0, y:4, name:'crossing' },
				{ x:1, y:4, name:'grass' },
				{ x:2, y:4, name:'pathSENW' },
				{ x:3, y:4, name:'waterWithLandSWNW' },
				{ x:4, y:4, name:'waterWithLandSESW' },
			];

			const sprites = {};
			const sprite_width = SETTINGS.GROUND_TILES.SPRITE_WIDTH;
			const sprite_height = SETTINGS.GROUND_TILES.SPRITE_HEIGHT;
			definitions.forEach( (definition)=>{
				sprites[definition.name] = sprite_from_image(
					canvas,
					definition.x * sprite_width,
					definition.y * sprite_height,
					sprite_width,
					sprite_height,
				);
			});

			return {
				name: 'ground',
				sprites: sprites,
			};
		});

	} // ground


	/**
	 * props()
	 */
	function props () {
		return load_image( 'images/scenery/village/props-sprite-sheet.png' )
		.then( (canvas)=>{
			const definitions = [
				{ x:  0, y:  0, w:528, h:415, name:'bridgeNESW' },
				{ x: 14, y:418, w:528, h:408, name:'bridgeSENW' },
				{ x:542, y:389, w:344, h:441, name:'treeDeciduous' },
				{ x:888, y:390, w:231, h:436, name:'treeConifer' },
			];

			const sprites = {};
			definitions.forEach( (definition)=>{
				sprites[definition.name] = sprite_from_image(
					canvas,
					definition.x,
					definition.y,
					definition.w,
					definition.h,
				);
			});

			return {
				name: 'props',
				sprites: sprites,
			};
		});

	} // ground


	/**
	 * buildings()
	 */
	function buildings () {
		return load_image( 'images/scenery/village/buildings-sprite-sheet.png' )
		.then( (canvas)=>{
			const source_coords = {
				windMill       : { x:514, y:   7, w:341, h:475 },
				blueRoofMedium : { x:  6, y: 360, w:474, h:351 },
				blueRoofSmall1 : { x:646, y: 486, w:330, h:338 },
				blueRoofSmall2 : { x:684, y:1475, w:308, h:340 },
				blueRoofLarge1 : { x: 14, y:1262, w:643, h:542 },
				blueRoofLarge2 : { x: 22, y: 729, w:615, h:520 },
				barn           : { x:646, y: 853, w:301, h:376 },
				marketStand    : { x:685, y:1234, w:235, h:225 },
			};

			const base_coords = {
				windMill       : [52,398,165,433,259,372,148,346],
				blueRoofMedium : [34,240,112,274,152,256,336,346,451,287,177,186],
				blueRoofSmall1 : [41,269,173,322,270,269,146,232],
				blueRoofSmall2 : [39,273,147,319,259,266,149,230],
				blueRoofLarge1 : [47,364,116,395,109,449,265,521,315,493,417,543,637,424,277,244],
				blueRoofLarge2 : [12,406,120,459,201,418,422,519,570,454,224,316],
				barn           : [31,291,164,350,254,293,123,246],
				marketStand    : [-5,167,7,177,29,166,116,204,99,212,115,221,209,166,98,109],
			}

			const sprites = {};
			for (const name in source_coords) {
				const coords = source_coords[name];
				sprites[name] = sprite_from_image(
					canvas,
					coords.x,
					coords.y,
					coords.w,
					coords.h,
				);

				sprites[name].baseCoords = base_coords[name];
			}

			return {
				name: 'buildings',
				sprites: sprites,
			};
		});

	} // buildings


	/**
	 * findById()
	 */
	this.findById = function (find_id) {
		let found_sprite = null;

		for (const key in self) {
			const sprite_set = self[key];

			if (typeof sprite_set != 'function') {
				for (const name in sprite_set) {
					if (sprite_set[name].id == find_id) {
						found_sprite = sprite_set[name];
					}
				}
			}
		}

		return found_sprite;

	}; // findById


	/**
	 * init()
	 */
	function init () {
		const assets_loaded = [
			cursors(),
			ground(),
			props(),
			buildings(),
			avatar( 'man1' ),
			avatar( 'man2' ),
			avatar( 'man3' ),
			avatar( 'woman1' ),
			avatar( 'woman2' ),
			avatar( 'woman3' ),
		];

		let next_id = 0;
		return Promise.all( assets_loaded ).then( (assets)=>{
			assets.forEach( (asset)=>{
				self[asset.name] = asset.sprites;

				for (const key in asset.sprites) {
					asset.sprites[key].type = asset.name;
					asset.sprites[key].name = asset.name + '.' + key;
					asset.sprites[key].id = next_id;

					asset.sprites[key].code = code_from_image(
						asset.sprites[key].picture,
						next_id
					);

					++next_id;
				}
			});
		});

	} // init


	// CONSTRUCTOR

	return init().then( ()=>self );

}; // Sprites


//EOF