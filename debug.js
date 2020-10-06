// debug.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/


/**
 * Debug()
 */
export const Debug = function (app) {
	const self = this;

	this.containerElement;
	this.data;


	/**
	 * updateStats()
	 */
	this.updateStats = function () {
		if (self.data.renderTimes.length > 10) self.data.renderTimes.shift();

		const average_render_time = self.data.renderTimes.reduce( (accumulator, currentValue)=>{
			return accumulator + currentValue;
		}, 0 )
		/ self.data.renderTimes.length
		* 1000
		;

		const frames_per_second = 1000 / average_render_time

		const html
		= self.data.frameCount + 'f, '
		+ average_render_time.toFixed(1) + 'ms/f, '
		+ frames_per_second.toFixed(1) + 'f/s'
		;

		self.containerElement.innerHTML = html;

	}; // updateStats


	/**
	 * init()
	 */
	function init () {
		self.containerElement = document.createElement( 'pre' );
		self.containerElement.className = 'debug';
		document.body.appendChild( self.containerElement );

		self.data = {
			renderTimes: [],
			frameCount: 0,
		};

		setInterval( self.updateStats, 1000 );

	} // init


	// CONSTRUCTOR

	init();

}; // Debug


//EOF