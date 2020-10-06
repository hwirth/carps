// main_menu.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// TOUCH TYPER - copy(l)eft 2020 - http://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { SETTINGS } from './constants.js';


export const MENU_DEFINITION = {
	character: {
		caption: 'Character',
		subMenu: {
			stats: {
				caption: 'Stats',
			},
			skills: {
				caption: 'Skills',
			},
			paperdoll: {
				caption: 'Paperdoll',
			},
			inventory: {
				caption: 'Inventory',
			},
			voice: {
				caption: 'Voice',
			},
		},
	},
	jukebox: {
		caption: 'Jukebox',
		subMenu: {
			tracks: {
				caption: 'Tracks',
				subMenu: {},
			},
			'-separator1': {},
			pause: {
				caption: 'Play/Pause',
				shortcut: 'ctrl_alt_p',
			},
			next: {
				caption: 'Next Tracks',
				shortcut: 'ctrl_alt_n',
			},
			prev: {
				caption: 'Previous Track',
				shortcut: 'ctrl_alt_b',
			},
			'-separator2': {},
			mute: {
				caption: 'Mute',
				shortcut: 'ctrl_alt_m',
			},
			louder: {
				caption: 'Increase Volume',
				shortcut: 'ctrl_alt_+',
			},
			softer: {
				caption: 'Decrease Volume',
				shortcut: 'ctrl_alt_-',
			},
		},
	},
	admin: {
		caption: 'Admin',
		subMenu: {
			spriteEditor: {
				caption: 'Sprite Editor',
			},
			fontList: {
				caption: 'Fonts',
				checkMark: true,
				//selected: false,
			},
			debug: {
				caption: 'Debug',
				subMenu: {
					avatarOutline: {
						caption: 'Avatar Outline',
						checkMark: true,
						selected: SETTINGS.AVATAR.OUTLINE,
					},
				},
			},
		},
	},

}; // MENU_DEFINITION


const check_mark = '✓';
const sub_menu = '🞂';   //▷

const MENU_CSS = `
.main_menu:focus,
.main_menu :focus { outline:none; }
.main_menu {
	--menu-height:1.8em;
	--menu-border-bottom:solid 2px #304860;
	--menu-background:#506880;
	--menu-focus-background:#8098b0;
	--menu-separator-color:#708090;
	line-height:1.1;
	position:relative; z-index:8;
	width:100%; height:var(--menu-height);
	margin:0 0 1em; border-bottom:var(--menu-border-bottom); padding:0em 0.25em 0;
	background:var(--menu-background); box-shadow:0 0 5px 0 rgba(0,0,0, 1.15); white-space:nowrap;
	text-align:left; cursor:default; user-select:none; -moz-user-select:none;
}
.main_menu * { vertical-align:top; }
.main_menu ul         { list-style-type:none; background:var(--menu-background); color:#fff; }
.main_menu li:hover   { background:var(--menu-focus-background); }
.main_menu > ul       { position:relative; display:inline-block; overflow:hidden; }
.main_menu > ul:focus-within { overflow:visible; }
.main_menu > ul > li  { position:relative; padding:0.25em 0.5em; }
.main_menu > ul:focus-within > li { background:var(--menu-focus-background); }
.main_menu ul:focus ul,
.main_menu > ul:focus-within ul { display:block; height:auto; border:solid 1px rgba(255,255,255, 0.1); padding:2px; }
.main_menu > ul ul    {
	display:none; position:absolute; left:0; margin-top:0.15em; box-shadow:3px 3px 3px 0 rgba(0,0,0, 0.35);
}
.main_menu > ul ul li { position:relative; padding:0.25em 1.25em; }
.main_menu > ul ul.shortcuts > li { padding-right:5em; }
.main_menu .shortcut  {
	position:absolute; top:0; right:0; padding:0 1.25em 0 0; line-height:2em; color:#ccc; font-size:0.8em;
}
.main_menu > ul ul li:hover .shortcut  { background:var(--menu-focus-background); }
.main_menu .separator {
	height:1px; background:var(--menu-separator-color); margin:0.25em 0; padding:0; pointer-events:none;
}
.main_menu .sub_menu { position:relative; padding-right:1.5em; }
.main_menu .sub_menu::after {
	content:'${sub_menu}';
	position:absolute; right:0.25em;
	color: #ccc;
}
.main_menu .sub_menu:hover::after { color:#fff; }
.main_menu li.sub_menu ul { display:none; position:absolute; top:calc(-0.25em - 1px); left:calc(100% + 0.0em); }
.main_menu li.sub_menu:hover > ul { display:block; }
.main_menu .selected::before { display:block; content:'${check_mark}'; position:absolute; left:0.25em; }
`.trim();


/**
 * MainMenu()
 */
export const MainMenu = function (app, callbacks) {
	const self = this;

	this.containerElement;
	this.styleElement;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// HELPERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * closeMenu()
	 */
	this.closeMenu = function () {
		document.body.focus();

	}; // closeMenu


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// EVENTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * on_item_activate()
	 */
	function on_item_activate (clicked_item) {
		if (clicked_item.dataset.checkMark !== "false") {
			clicked_item.classList.toggle( 'selected' );
		}
		else if (clicked_item.dataset.radioGroup !== "false") {
			const selector = '[data-radio-group=' + clicked_item.dataset.radioGroup + ']';
			const group_items = clicked_item.parentNode.querySelectorAll( selector );

			group_items.forEach( (test_item)=>{
				test_item.classList.toggle( 'selected', (test_item === clicked_item) );
			});
		}

		if (callbacks.onItemClick) {
			callbacks.onItemClick(
				clicked_item.dataset.path,
				clicked_item.classList.contains( 'selected' ),
			);
		}

	} // on_item_activate


	/**
	 * on_mouse_move()
	 */
	function on_mouse_move (event) {
		if (event.target.classList.contains( "main_entry" )) {
			if (document.activeElement.parentNode.parentNode === self.containerElement) {
				event.target.focus();
			}
		}

	} // on_mouse_move


	/**
	 * on_mouse_up()
	 */
	function on_mouse_up (event) {
		const clicked_item = event.target;
		if (! clicked_item.classList.contains( 'menu_item' )) return;

		on_item_activate( clicked_item );
		self.closeMenu();

	} // on_mouse_up


	/**
	 * on_key_down()
	 */
	function on_key_down (event) {
		if (callbacks.onItemClick === null) return;

		const shortcut
		= (event.shiftKey ? 'shift_' : '')
		+ (event.ctrlKey ? 'ctrl_' : '')
		+ (event.altKey ? 'alt_' : '')
		+ event.code
		;

		const selector = '.menu_item[data-shortcut=' + shortcut.toLowerCase() + ']';
		const matching_items = self.containerElement.querySelectorAll( selector );

		matching_items.forEach( (clicked_item)=>{
			on_item_activate( clicked_item );
		});

		if (matching_items.length > 0) {
			event.preventDefault();
			return false;
		}

	} // on_key_down

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// CONSTRUCTOR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * captionToId()
	 */
	this.captionToId = function (caption) {
		self.closeMenu();
		const id = caption.replace( /\s/g, '_' ).replace( /:/g, '' );
		return id;

	}; // captionToId


	/**
	 * init()
	 */
	this.init = function () {

		function add_menu_item (menu_element, entry_name, entry, path ) {
			var item, span;

			if (entry_name.charAt( 0 ) == '-') {
				menu_element.appendChild( item = document.createElement( 'li' ) );
				item.className = 'separator';

			} else {
				item = document.createElement( 'li' );
				item.className = 'menu_item';
				item.innerText = entry.caption;
				item.tabIndex  = '0';
				if (entry.title) item.title = entry.title;
				item.addEventListener( 'mouseup', entry.callback );

				item.dataset.radioGroup = entry.radioGroup || false;
				item.dataset.checkMark = entry.checkMark || false;
				item.dataset.path = path;

				if( (entry.checkMark || entry.radioGroup)
				&&  (entry.selected != undefined) && (entry.selected == true)
				) {
					item.classList.add( 'selected' );
				}

				menu_element.appendChild( item );

				if (entry.shortcut != undefined) {
					const shortcut = entry.shortcut.toLowerCase();
					item.dataset.shortcut = shortcut;

					item.appendChild( span = document.createElement( 'span' ) );


					const parts = shortcut
					.replace( /Key/g, '' )
					.split( '_' )
					;

					for (let i = 0; i < parts.length; ++i) {
						parts[i]
						= parts[i] .charAt( 0 ).toUpperCase()
						+ parts[i] .substr( 1 )
						;
					}
					const shortcut_html = parts.join( '+' );

					span.innerText = shortcut_html;
					span.className = 'shortcut';
					item.parentNode.classList.add( 'shortcuts' );
				}
			}

			return item;

		} // add_menu_item


		/**
		 * make_menu()
		 */
		function make_menu (menu_name, menu_entries) {
			const ul_entries = document.createElement( 'ul' );
			for (const entry_name in menu_entries) {
				const entry = menu_entries[entry_name];
				const path = menu_name + '/' + entry_name;
				const item = add_menu_item( ul_entries, entry_name, entry, path );

				if (entry.subMenu != undefined) {
					item.classList.add( 'sub_menu' );
					const sub_menu = make_menu(
						path,
						entry.subMenu,
					);
					item.appendChild( sub_menu );
				}
			}

			return ul_entries;
		}

		document.body.tabIndex = '0';

		self.containerElement = document.createElement( 'div' );
		self.containerElement.className = 'main_menu';
		self.containerElement.tabIndex = '0';

		for (const menu_name in MENU_DEFINITION) {
			const ul_menu = document.createElement( 'ul' );
			const li_entry = document.createElement( 'li' );

			li_entry.tabIndex = '0';
			li_entry.className = 'main_entry';
			li_entry.innerHTML = MENU_DEFINITION[menu_name].caption;
			if (MENU_DEFINITION[menu_name].title) {
				li_entry.title = MENU_DEFINITION[menu_name].title;
			}

			const ul_entries = make_menu(
				menu_name,
				MENU_DEFINITION[menu_name].subMenu,
			);

			ul_menu.appendChild( li_entry );
			ul_menu.appendChild( ul_entries );
			self.containerElement.appendChild( ul_menu );
		}

		self.containerElement.addEventListener( 'mousemove', on_mouse_move );
		self.containerElement.addEventListener( 'mouseup', on_mouse_up );

		self.styleElement = document.createElement( 'style' );
		self.styleElement.id = 'menu_styles';
		self.styleElement.innerHTML = MENU_CSS;

		//document.querySelector( 'head' ).appendChild( self.styleElement );
		//document.body.appendChild( self.containerElement );

		addEventListener( 'keydown', on_key_down, false );

	}; // init


	// CONSTRUCTOR

	self.init();

}; // MainMenu


//EOF