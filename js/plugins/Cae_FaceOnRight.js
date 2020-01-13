//=========================================================
// Cae_FaceOnRight.js
//=========================================================

/*:
 * @plugindesc v1.3 - Permits showing faces on the right in message windows. Also allows left-right flipping of face images.
 * @author Caethyril
 *
 * @help Plugin Commands:
 *   ShowFaceOnRight	- faces will display on the right
 *   ShowFaceOnLeft	- faces will display on the left
 *   ShowFaceSideToggle	- toggles displaying face on left or right
 *   FaceFlipAutoLeft	- faces on the left will be flipped
 *   FaceFlipAutoRight	- faces on the right will be flipped
 *   FaceFlipOn	- flip all faces
 *   FaceFlipOff	- flip no faces
 * 
 * Game Message escape codes:
 *   \sfr		- same effect as ShowFaceOnRight
 *   \sfl		- same effect as ShowFaceOnLeft
 *   \sft		- same effect as ShowFaceSideToggle
 * Note that these will all immediately refresh the message to redraw the face.
 * This will remove any text displayed in the message at the time.
 *
 * Compatibility:
 *   Compatible with Yanfly Message Core's wordwrapping feature:
 *    - Place this plugin lower in the load order for it to take effect.
 *    - Overrides Yanfly's wordwrapWidth() function (Window_Base class).
 *   This plugin overrides the Window_Message class's NewLineX() function.
 *
 * Terms of use:
 *   Free to use and modify; if modified, credit would be nice.
 *   
 * Thanks to "baflink" of github.io for "jsRPGFaceFlip.js".
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Update log:
 *   1.3: Code rewrite for v1.5 update! =)
 *   1.2: Tidied things up; now more modular & with shorter plugin command names.
 *        Also added message escape codes! ^_^
 *   1.1: Added face-flipping! \o/
 *   1.0: Initial release.
 * 
 * @param FaceOnRight
 * @text Initial Face Position
 * @type boolean
 * @off Left
 * @on Right
 * @desc Determines the starting face position.
 * @default false
 *
 * @param FaceFlipMode
 * @text Face Flip Mode
 * @type select
 * @option always
 * @option never
 * @option auto-left
 * @option auto-right
 * @desc Determines starting mode for face-flipping.
 * Refer to the help for details.
 * @default auto-left
 */

var Imported = Imported || {};				// Import namespace, var can redefine
Imported.Cae_FaceOnRight = 1.3;				// Import declaration

var CAE = CAE || {};					// Author namespace, var can redefine
CAE.FaceOnRight = CAE.FaceOnRight || {};		// Plugin namespace

(function(_) {

'use strict';

	_.params = PluginManager.parameters('Cae_FaceOnRight');		// Process user parameters
  
	_.FaceOnRight = _.params['FaceOnRight'] === true		// Show face on the right if true
	_.FlipFaceX = false;						// Flip face horizontally if true
	_.FlipFaceXAuto = true;						// Automatic: works in conjunction with var below
	_.FlipFaceXAutoLeft = true;					// Determines whether automatic flipping occurs for faces on left (true) or right (false)
  
	// For auto-update of face-flipping
	_.FaceFlipAutoRefresh = function() {
		if (_.FlipFaceXAuto) {
			_.FlipFaceX = _.FlipFaceXAutoLeft ? !_.FaceOnRight : _.FaceOnRight;
		}
	};

	// Modularity!
	_.ShowFaceRight = function() {
		_.FaceOnRight = true;
		_.FaceFlipAutoRefresh();
	};
  
	_.ShowFaceLeft = function() {
		_.FaceOnRight = false;
		_.FaceFlipAutoRefresh();
	};

	_.ShowFaceSideToggle = function() {
		_.FaceOnRight = !_.FaceOnRight;
		_.FaceFlipAutoRefresh();
	};

	_.FaceFlipOn = function() {
		_.FlipFaceXAuto = false;
		_.FlipFaceX = true;
	};

	_.FaceFlipOff = function() {
		_.FlipFaceXAuto = false;
		_.FlipFaceX = false;
	};

	_.FaceFlipAutoRight = function() {
		_.FlipFaceXAuto = true;
		_.FlipFaceXAutoLeft = false;
		_.FlipFaceX = _.FaceOnRight;
	};

	_.FaceFlipAutoLeft = function() {
		_.FlipFaceXAuto = true;
		_.FlipFaceXAutoLeft = true;
		_.FlipFaceX = !_.FaceOnRight;
	};

	// Parameter parsing
	switch (_.params['FaceFlipMode']) {
		case 'always':
			_.FaceFlipOn();
			break;
		case 'never':
			_.FaceFlipOff();
			break;
		case 'auto-left':
			_.FaceFlipAutoLeft();
			break;
		case 'auto-right':
			_.FaceFlipAutoRight();
			break;
	};

	// Plugin commands
	_.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_.Game_Interpreter_pluginCommand.call(this, command, args);
		switch (command) {
			case 'ShowFaceOnRight':
				_.ShowFaceRight();
				break;
			case 'ShowFaceOnLeft':
				_.ShowFaceLeft();
				break;
			case 'ShowFaceSideToggle':
				_.ShowFaceSideToggle();
				break;
			case 'FaceFlipImage_ON':			// back-compatibility
			case 'FaceFlipOn':
				_.FaceFlipOn();
				break;
			case 'FaceFlipImage_OFF':			// back-compatibility
			case 'FaceFlipOff':
				_.FaceFlipOff();
				break;
			case 'FaceFlipImage_AUTO_Right':		// back-compatibility
			case 'FaceFlipAutoRight':
				_.FaceFlipAutoRight();
				break;
			case 'FaceFlipImage_AUTO_Left':		// back-compatibility
			case 'FaceFlipAutoLeft':
				_.FaceFlipAutoLeft();
				break;
		}
	};

	// Message escape codes! *.*
	_.Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;	// Alias for callback
	Window_Message.prototype.processEscapeCharacter = function(code, textState) {
		switch (code) {
			case 'SFL':
				_.ShowFaceLeft();
				this.newPage(textState);		// Force new page so the face is redrawn in the new position
				break;
			case 'SFR':
				_.ShowFaceRight();
				this.newPage(textState);
				break;
			case 'SFT':
				_.ShowFaceSideToggle();
				this.newPage(textState);			
				break;
			default:
				_.Window_Message_processEscapeCharacter.call(this, code, textState);	// Continue checking other possibles
				break;
		}
	};

	// Mirror face horizontally if option is set. This is an edit of snippet "jsRPGFaceFlip.js" found on github.io.
	// =====================================================================================
	Bitmap.prototype.blt_FaceFlip = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
		dw = dw || sw;			// Initialising
		dh = dh || sh;
		this._context.save();		// goes with the restore() at the end
		this._context.scale(-1, 1);	// flip horizontally
		dx = -dx - dw;			// scale affects x-offset on destination canvas; reset and offset it appropriately

		if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
		    sx + sw <= source.width && sy + sh <= source.height) {
			this._context.globalCompositeOperation = 'source-over';
			this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
			this._setDirty();
		}
    
		this._context.restore();	// tells code not to remember changes?
	};
  	// =====================================================================================

	// Extra function (to minimise overrides) to interface with faceflip code - carbon copy except for the function name and last line
	Window_Base.prototype.drawFace_Flipped = function(faceName, faceIndex, x, y, width, height) {
		width = width || Window_Base._faceWidth;
		height = height || Window_Base._faceHeight;
		let bitmap = ImageManager.loadFace(faceName);
		let pw = Window_Base._faceWidth;
		let ph = Window_Base._faceHeight;
		let sw = Math.min(width, pw);
		let sh = Math.min(height, ph);
		let dx = Math.floor(x + Math.max(width - pw, 0) / 2);
		let dy = Math.floor(y + Math.max(height - ph, 0) / 2);
		let sx = faceIndex % 4 * pw + (pw - sw) / 2;
		let sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
		this.contents.blt_FaceFlip(bitmap, sx, sy, sw, sh, dx, dy);
	};

	// Remove text indent if face is being shown on the right
	Window_Message.prototype.newLineX = function() {			// Override!
		return $gameMessage.faceName() === '' || _.FaceOnRight ? 0 : 168;
	};

	// Change face-render position if face should be on the right
	_.Window_Message_drawMessageFace = Window_Message.prototype.drawMessageFace;
	Window_Message.prototype.drawMessageFace = function() {
		if (_.FlipFaceX) {
			this.drawFace_Flipped($gameMessage.faceName(), $gameMessage.faceIndex(), 
					      _.FaceOnRight ? (this.width - this.standardPadding() * 2 - Window_Base._faceWidth) : 0, 0);
		} else if (_.FaceOnRight) {
			this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(),
				      this.width - this.standardPadding() * 2 - Window_Base._faceWidth, 0);
		} else {
			_.Window_Message_drawMessageFace.call(this);		// Default to callback
		}
	};

	// Yanfly Message Core wordwrapping compatibility
	Window_Base.prototype.wordwrapWidth = function() {			// Override!
		return (this.contents.width - (_.FaceOnRight ? Window_Base._faceWidth : 0));
	};

})(CAE.FaceOnRight);