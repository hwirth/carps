// world.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/


/**
 * Location()
 */
const Location = function (app, rpg, initial) {
	return {
		sprite: rpg.sprites.ground[initial.spriteName],
		props: [],
		buildings: [],
		items: [],
	};

}; // Location


/**
 * World()
 */
export const World = function (app, rpg) {
	const self = this;

	this.minX;
	this.maxX;
	this.minY;
	this.maxY;

	this.locations;
	this.emptyLocation;


	/**
	 * this.locationExists()
	 */
	this.locationExists = function (x, y) {
		return (x >= self.minX) && (x <= self.maxX) && (y >= self.minY) && (y <= self.maxY);

	}; // locationExists


	/**
	 * movementAllowed()
	 */
	this.movementAllowed = function (start_location, target_location) {
		const locations = [];

		const x0 = Math.floor( start_location.x );
		const y0 = Math.floor( start_location.y );
		const radius = 1;

		for (let x = x0 - radius; x <= x0 + radius; ++x) {
			for (let y = y0 - radius; y <= y0 + radius; ++y) {
				const x1 = x0 + x;
				const y1 = y0 + y;

				if (self.locationExists( x1, y1 )) {
					const props = self.locations[x1][y1].props;

					if (props.length > 0)
					console.log( props );
				}
			}
		}

	}; // movementAllowed


	/**
	 * init()
	 */
	function init () {
		return new Promise( (done)=>{
			self.minX = -3;
			self.minY = -3;
			self.maxX = 3;
			self.maxY = 3;

			self.locations = [];
			for (let x = self.minX; x <= self.maxX; ++x) {
				self.locations[x] = [];

				for (let y = self.minY; y <= self.maxY; ++y) {

					if ((x == self.minX) && (y == self.minY)) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'waterWithLandS',
						});
					}
					else if ((x == self.minX) && (y == self.maxY)) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'waterWithLandE',
						});
					}
					else if ((x == self.maxX) && (y == self.minY)) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'waterWithLandW',
						});
					}
					else if ((x == self.maxX) && (y == self.maxY)) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'waterWithLandN',
						});
					}

					else if (x == self.minX) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'waterWithLandSE',
						});
					}
					else if (x == self.maxX) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'waterWithLandNW',
						});
					}
					else if (y == self.minY) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'waterWithLandSW',
						});
					}
					else if (y == self.maxY) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'waterWithLandNE',
						});
					}

					else if ((x == 0) && (y == 0)) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'crossing',
						});
					}
					else if (x == 0) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'pathNESW',
						});
					}
					else if (y == 0) {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'pathSENW',
						});
					}
					else {
						self.locations[x][y] = new Location( app, rpg, {
							spriteName: 'grass',
						});
					}
				}
			}

			self.emptyLocation = new Location( app, rpg, {
				spriteName: 'water',
			});


			self.locations[0][-2] = new Location( app, rpg, {
				spriteName: 'pathNESWNW',
			});

			self.locations[2][-1].props.push({
				sprite: rpg.sprites.props.treeDeciduous,
				position: { x: 0.5, y:0.5 },
				offset:{ x:0, y:60 },
			});

			self.locations[0][0].props.push({
				sprite:rpg.sprites.props.treeConifer,
				position:{ x:0, y:0 },
				offset:{ x:0, y:40 },
			});

			self.locations[-1][0].props.push({
				sprite:rpg.sprites.props.treeConifer,
				position:{ x:0.9, y:0.9 },
				offset:{ x:0, y:40 },
			});

			self.locations[-1][-1].props.push({
				sprite:rpg.sprites.buildings.blueRoofMedium,
				position:{ x:0.5, y:0 },
				offset:{ x:0, y:40 },
			});

			self.locations[-1][2].props.push({
				sprite:rpg.sprites.buildings.blueRoofMedium,
				position:{ x:0.5, y:0 },
				offset:{ x:0, y:40 },
			});

			self.locations[2][0].props.push({
				sprite: rpg.sprites.buildings.blueRoofSmall1,
				position: { x:0, y:0 },
				offset: { x:0, y:0 },
			});

			done();
		});

	} // init


	// CONSTRUCTOR

	return init().then( ()=>self );

}; // World


//EOF