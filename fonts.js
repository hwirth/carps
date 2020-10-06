// fonts.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ISOMETRIC RPG - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { SETTINGS } from './constants.js';


const all_file_names = [
	'Augusta-Shadow.ttf',
	'Augusta.ttf',
	//'Ayuma2yk.ttf',
	'Baldur Shadow.ttf',
	'Baldur.ttf',
	//'BayreuthFraktur.ttf',
	'Behrensschrift.ttf',
	'BerkshireSwash-Regular.ttf',
	'Bertholdr Mainzer Fraktur.ttf',
	'Blackwood Castle.ttf',
	'BlackwoodCastleShadow.ttf',
	//'CIMBRIAN.TTF',
	//'COLCBL__.TTF',
	'CantaraGotica.ttf',
	'Canterbury.ttf',
	'Cardinal-Alternate.ttf',
	'Cardinal.ttf',
	'Carmen-Shadow.ttf',
	'Carmen.ttf',
	'CelticHand.ttf',
	//'Chancery Cursive.ttf',
	'ComicRunes.otf',
	//'Coralines Cat.otf',
	//'Coralines Cat.ttf',
	//'Curlholi.ttf',
	//'Curlholl.ttf',
	//'Curlital.ttf',
	//'Curlwide.ttf',
	//'CyberCaligraphic.ttf',
	'DdlyBrkfst.ttf',
	//'Deutsch.ttf',
	'EagleLake-Regular.ttf',
	'EhmckeFederfraktur.ttf',
	'EileenCaps-Black.ttf',
	'EileenCaps-Regular.ttf',
	'Evernight-Stargazer.ttf',
	'FetteNationalFraktur.ttf',
	//'FifthCenturyCaps.ttf',
	'Fraenkisch.otf',
	'Fraenkisch.ttf',
	//'GoldenSwing.ttf',
	'Goudament.ttf',
	'Goudy Mediaeval DemiBold.ttf',
	'Goudy Mediaeval Regular.ttf',
	'Goudy Medieval Alternate.ttf',
	'Grange Regular.ttf',
	'Griffy-Regular.ttf',
	'HandTextur.ttf',
	'Headline Text.ttf',
	'Hentimps_Circlet.ttf',
	'Hofstaetten.ttf',
	'INSULA__.ttf',
	//'IrishUncialfabeta-Bold.ttf',
	//'Jellyka_Estrya_Handwriting.ttf',
	'JenaGotisch.ttf',
	//'JuniusIrish.ttf',
	'Kanzler.ttf',
	//'King Arthur Special Normal.ttf',
	'Kingthings Calligraphica Italic.ttf',
	'Kingthings Foundation.ttf',
	'Kingthings Italique.ttf',
	'Kingthings Petrock.ttf',
	'Kingthings Xander.ttf',
	'Kleinsemmering.ttf',
	//'LOMBARDI.TTF',
	'Laila-Bold.ttf',
	'Laila-Light.ttf',
	'Laila-Medium.ttf',
	'Laila-Regular.ttf',
	'Laila-Semibold.ttf',
	'Leipzig Fraktur Bold LF.ttf',
	'Leipzig Fraktur Bold.ttf',
	'Leipzig Fraktur Heavy.ttf',
	'Leipzig Fraktur Normal LF.ttf',
	'Leipzig Fraktur Normal.ttf',
	//'Livingst.ttf',
	'Merienda-Bold.ttf',
	'Merienda-Regular.ttf',
	'MorrisRoman-Black.ttf',
	'MorrisRomanAlternate-Black.ttf',
	'Ostrich_Hand.ttf',
	'Paganini Light.ttf',
	'Paganini Narrow .ttf',
	'Paganini SemiBold.ttf',
	'Paprika-Regular.ttf',
	'PenguinAttack.ttf',
	'PinyonScript-Regular.ttf',
	'PirataOne-Regular.ttf',
	//'PiratiquaVertical.ttf',
	'Plakat-Fraktur Black.ttf',
	'Prince Valiant.ttf',
	'Quintessential-Regular.ttf',
	'Rancho-Regular.ttf',
	'RedivivaUNZ1.ttf',
	'Risaltyp_024.otf',
	'Risaltyp_024.ttf',
	'Rostock Kaligraph.ttf',
	//'RottenScript.ttf',
	'RougeScript-Regular.ttf',
	//'Smoking Tequila.ttf',
	'SpecialElite.ttf',
	'UncialAntiqua-Regular.ttf',
	'Washington Text Alternates.ttf',
	'Washington Text Regular.ttf',
	'WernickeSchwabacher.ttf',
	'_aeiou2U.ttf',
	'akaFrivolity.otf',
	'akaFrivolity.ttf',
	'cantebriggia.ttf',
	//'dum1.ttf',
	//'dum13d.ttf',
	//'dum1ReIt.ttf',
	//'dum1cud.ttf',
	//'dum1cup.ttf',
	//'dum1ital.ttf',
	//'dum1out.ttf',
	//'dum1shad.ttf',
	//'dum1thin.ttf',
	//'dum1wide.ttf',
	'evernight.ttf',
	'fine_fraktur_B.ttf',
	'here comes the sun.ttf',
	//'ofc_____.ttf',
]; // all_file_names


const font_file_names = [
	'akaFrivolity.ttf',
	'Augusta.ttf',
	'BerkshireSwash-Regular.ttf',
	'EagleLake-Regular.ttf',
	'Goudy Medieval Regular.ttf',
	'Kingthings Foundation.ttf',
	'Laila-Medium.ttf',
	'PirataOne-Regular.ttf',
	'Washington Text Regular.ttf',

]; // font_file_names


/**
 * FontManager()
 */
export const FontManager = function (app, rpg) {
	const self = this;

	this.containerElement;

	this.knownFonts = {};
	this.loadedFonts = [];


	/**
	 * load()
	 */
	this.load = function (family_name, target_elements = null) {
		var style;

		if (self.knownFonts[family_name] == undefined) {
			throw new Error( 'Unknown font family: ' + family_name );
		}

		if (self.loadedFonts[family_name] == undefined) {
			self.loadedFonts[family_name] = self.knownFonts[family_name];

			let css = '';

			for (const family_name in self.loadedFonts) {
				const url = 'fonts/' + self.loadedFonts[family_name];

				css
				+= '\n@font-face {'
				+  '\n\tfont-family:"' + family_name + '";'
				+  '\n\tsrc:url("' + url + '");'
				+  '\n}'
				;
			}

			self.containerElement.innerHTML = css;
		}

		if (target_elements !== null) {
			if (typeof target_elements == 'string') target_elements = [target_elements];

			target_elements.forEach( (element)=>{
				element.style.fontFamily = family_name;
				element.style.fontSize = SETTINGS.FONT.SIZE + 'px';
			});
		}

	}; // load


	/**
	 * init()
	 */
	function init () {
		self.containerElement = document.createElement( 'style' );
		self.containerElement.type = 'text/css';
		self.containerElement.id = 'dynamic_fonts';
		document.querySelector( 'head' ).appendChild( self.containerElement );

		font_file_names.forEach( (file_name)=>{
			const family_name = file_name.slice( 0, -4 ).toLowerCase().replace( / /g, '-' );
			self.knownFonts[family_name] = file_name;
		});

	} // init


	// CONSTRUCTOR

	init();

}; // FontManager


/**
 * FontSelector()
 */
export const FontSelector = function (app, rpg) {
	const self = this;

	this.containerElement;


	/**
	 * exit()
	 */
	this.exit = function () {
		self.containerElement.parentNode.removeChild( self.containerElement );

	}; // exit


	/**
	 * init()
	 */
	function init () {
		self.containerElement = document.createElement( 'ul' );
		self.containerElement.className = 'font_list';
		document.body.appendChild( self.containerElement );

		let css = '';

		font_file_names.forEach( (file_name)=>{
			const font_name = file_name.slice( 0, -4 ).toLowerCase().replace( / /g, '-' );
			const url = 'fonts/' + file_name;

			console.log( font_name, url );

			css
			+= '\n@font-face {'
			+  '\n\tfont-family:"' + font_name + '";'
			+  '\n\tsrc:url("' + url + '");'
			+  '\n}'
			;

			const item = document.createElement( 'li' );
			item.innerText = font_name +': The quick brown fox jumps over the lazy dog';
			item.style.fontFamily = font_name;
			item.style.fontSize = SETTINGS.FONT.SIZE + 'px';
			self.containerElement.appendChild( item );
		});

		const style = document.createElement( 'style' );
		style.type = 'text/css';
		style.innerHTML = css;
		document.querySelector( 'head' ).appendChild( style );

	} // init


	// CONSTRUCTOR
console.log('#######');
	init();

}; // FontSelector


//EOF