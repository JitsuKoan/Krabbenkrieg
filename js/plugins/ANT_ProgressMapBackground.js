/*:
 * @plugindesc Allows developers to set a map to be used as the background of their title screen
 * depending on their game progress.
 * @author Antula
 *
 * @param Map ID
 * @desc The ID of the map used in the Title Screen.
 * @default 1
 *
 * @help
 *
 * Progress Title Map Background
 * Version 1.01
 * Antula
 *
 *
*/

var ANT = ANT || {};
ANT.ProgressTitleMapBackground = ANT.ProgressTitleMapBackground || {};

var Imported = Imported || {};
Imported["Antula Progress Title Map Background"] = 1.01;

//function Scene_TitleMapBackground() {
//	this.initialize.apply(this, arguments);
//}

(function(_) {

	"use strict";

	var params = PluginManager.parameters('SRD_TitleMapBackground');

	_.mapId = parseInt(params['Map ID']);
	//-----------------------------------------------------------------------------
	// Scene_Title
	//-----------------------------------------------------------------------------

	var _Scene_Title_create = Scene_Title.prototype.create;
	Scene_Title.prototype.create = function() {
		_Scene_Title_create.apply(this, arguments);
		this.removeChild(this._backSprite1);
		this.removeChild(this._backSprite2)
		var progress = DataManager.highestTitleProgress();
		if (progress > 0)
			DataManager.loadMapData(progress);
		else
			DataManager.loadMapData(_.mapId);
	};
	Scene_Title.prototype.createBackground = function() {
		this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
		this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
		this.addChild(this._backSprite1);
		this.addChild(this._backSprite2);
	};
})(ANT.ProgressTitleMapBackground);