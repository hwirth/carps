// constants.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

export const PROGRAM_NAME = document.title;
export const PROGRAM_VERSION = 'v0.0.2a';

export const DEBUG = {
	KEY_CODES   : false,
	JUKEBOX     : !false,
	COLOR_CODES : false,
	GRID        : false,
	SPRITES     : false,

}; // DEBUG

export const SETTINGS = {
	FONT: {
		FAMILY: 'berkshireswash-regular',
		SIZE: 17,
	},

	CONSOLE: {
		STAY_INTERVAL: 5000,
		DECAY_INTERVAL: 150,
	},

	GROUND_TILES: {
		SPRITE_WIDTH  : 372,
		SPRITE_HEIGHT : 330,
		TILE_WIDTH    : 160,
		TILE_HEIGHT   : 80,
	},

	SPRITE_EDITOR: {
		PADDING: 20,
	},

	AVATAR: {
		OUTLINE: true,
	},

	MUSIC: {
		VOLUME: 0.5,
		TRACKS: {
			'town1': 'in_his_own_way.mp3',
			'town2': 'sweet_lullaby.mp3',
			'town3': 'arthur-vyncke-red-forest.mp3',
			'town4': 'wombat-noises-audio-llanfair.mp3',
			'town5': 'peritune-otogi2.mp3',   // Asian
			'town6': 'peritune-market.mp3',   // Large town/market/fair
			'town7': 'alexander-nakarada-adventure.mp3',   // Gentle, castle
			'castle1': 'alexander-nakarada-prepare-for-war.mp3',
			'castle2': 'alexander-nakarada-battle-of-the-creek.mp3',
			'countryside1': 'peritune-minstrel.mp3',
			'countryside2': 'peritune-deep-woods3.mp3',
			'forest1': 'gentle_moments.mp3',
			'uncanny1': 'myuu-krampus-is-here.mp3',
			'enchanted1': 'triads.mp3',
			'offline1': 'alexander-nakarada-the-road-home.mp3',
			'battle1': 'alexander-nakarada-behind-the-sword.mp3',
			'a': 'alexander-nakarada-reaching-the-sky-long-version.mp3',  // Offline, logout
			'b': 'alexander-nakarada-tavern-loop-one.mp3',  // Offline, needs loop
			'c': 'alexander-nakarada-beyond-the-horizon.mp3', // Offline
			'i': 'alexander-nakarada-until-the-end.mp3',
			'j': 'alexander-nakarada-cold-journey.mp3',
			'k': 'alexander-nakarada-vetur-frosti.mp3',
			'l': 'alexander-nakarada-dungeons-and-dragons.mp3',
			'm': 'alexander-nakarada-vopna.mp3',
			'n': 'alexander-nakarada-gjallar.mp3',
			'o': 'alexander-nakarada-we-three-celtic-kings.mp3',
			'p': 'alexander-nakarada-now-we-ride.mp3',
			'q': 'alexander-nakarada-wintersong.mp3',
			'r': 'alexander-nakarada-pirates-of-the-quarantine.mp3',
		},
		SELECTIONS: {
			UNSORTED  : [
				'a', 'b', 'c', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
			],
			TOWN        : ['town1', 'town2', 'town3', 'town4', 'town5', 'town6', 'town7'],
			CASTLE      : ['castle1', 'castle2'],
			COUNTRYSIDE : ['countryside1', 'countryside2'],
			ENCHANTED   : ['enchanted1'],
			FOREST      : ['forest1'],
			BATTLE      : ['battle1'],
			OFFLINE     : ['offline1'],
			UNCANNY     : ['uncanny1'],
		},
	},

}; // SETTINGS


//EOF