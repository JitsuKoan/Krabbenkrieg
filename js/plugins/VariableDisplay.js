//=============================================================================
// VariableDisplay.js v1.0.0
//=============================================================================

/*:
 * @plugindesc Displays the specified variable value and icon.
 * @author Derek Chestnut (dbchest)
 *
 * @param X
 * @desc The x-coordinate for the window.
 * Default: 576
 * @default 576
 *
 * @param Y
 * @desc The y-coordinate for the window.
 * Default: 0
 * @default 0
 *
 * @param Width
 * @desc The width of the window.
 * Default: 240
 * @default 240
 *
 * @param Variable Id
 * @desc the variable id for the display value.
 * Default: 1
 * @default 1
 *
 * @param Draw Icon
 * @desc Enables/Disables icon display.
 * OFF - false     ON - true
 * Default: OFF
 * @default false
 *
 * @param Icon Index
 * @desc The index for the icon within the IconSet.
 * Default: 0
 * @default 0
 *
 * @param Alignment
 * @desc The alignment of the window's contents.
 * Default: right
 * @default right
 *
 * @help
 *
 * Plugin Commands:
 *   VariableDisplay x 576          # Sets the x coordinate to 576.
 *   VariableDisplay y 372          # Sets the y coordinate to 372.
 *   VariableDisplay width 816      # Sets the width to 816.
 *   VariableDisplay id 3           # Sets the variable id to 3.
 *   VariableDisplay iDraw false    # Sets draw icon to false.
 *   VariableDisplay iIndex 187     # Sets the icon index to 187.
 *   VariableDisplay Align left     # Sets the alignment to left.
 *   VariableDisplay open           # Opens the window.
 *   VariableDisplay close          # Closes the window.
 */

var Dbchest = Dbchest || {};
Dbchest.VariableDisplay = {};
Dbchest.VariableDisplay.Parameters = PluginManager.parameters('VariableDisplay');

Dbchest.VariableDisplay.X = Number(Dbchest.VariableDisplay.Parameters["X"]) || 576;
Dbchest.VariableDisplay.Y = Number(Dbchest.VariableDisplay.Parameters["Y"]) || 0;
Dbchest.VariableDisplay.Width = Number(Dbchest.VariableDisplay.Parameters["Width"]) || 240;
Dbchest.VariableDisplay.VariableId = Number(Dbchest.VariableDisplay.Parameters["Variable Id"]) || 1;
Dbchest.VariableDisplay.OptDrawIcon = JSON.parse(Dbchest.VariableDisplay.Parameters["Draw Icon"]);
Dbchest.VariableDisplay.IconIndex = Number(Dbchest.VariableDisplay.Parameters["Icon Index"]) || 0;
Dbchest.VariableDisplay.Alignment = String(Dbchest.VariableDisplay.Parameters["Alignment"]) || 'right';

//-----------------------------------------------------------------------------
// Window_Variable
//
// This is a constructor, implementation is performed within the inner scope.

function Window_Variable() {
    this.initialize.apply(this, arguments);
}

(function(){
    
    //-------------------------------------------------------------------------
    // Game_Interpreter
    //
    // The interpreter for running event commands.
    
    var _Game_Interpreter_pluginCommand_VariableDisplay = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand_VariableDisplay.call(this, command, args);
        if (command === 'VariableDisplay') {
            var window = SceneManager._scene._variableWindow;
            switch (args[0]) {
            case 'x':
                window.x = args[1];
                break;
            case 'y':
                window.y = args[1];
                break;
            case 'width':
                window.width = args[1];
                window.createContents();
                break;
            case 'id':
                window.setVariableId(args[1]);
                break;
            case 'iDraw':
                window.setDrawIcon(JSON.parse(args[1]));
                break;
            case 'iIndex':
                window.setIconIndex(args[1]);
                break;
            case 'align':
                window.setAlignment(args[1]);
                break;
            case 'open':
                window.refresh();
                window.open();
                break;
            case 'close':
                window.close();
                break;
            }
        }
    };
    
    //-------------------------------------------------------------------------
    // Scene_Map
    //
    // The scene class of the map screen.
    
    var _Scene_Map_createAllWindows_VariableDisplay = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows_VariableDisplay.call(this);
        this._variableWindow = new Window_Variable();
        this.addWindow(this._variableWindow);
    };
    
    //-------------------------------------------------------------------------
    // Window_Variable
    //
    // This window class for displaying the value of a variable and its icon.
    
    Window_Variable.prototype = Object.create(Window_Base.prototype);
    Window_Variable.prototype.constructor = Window_Variable;
    
    Window_Variable.prototype.initialize = function() {
        var x = Dbchest.VariableDisplay.X;
        var y = Dbchest.VariableDisplay.Y;
        var width = Dbchest.VariableDisplay.Width;
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._variableId = Dbchest.VariableDisplay.VariableId;
        this._drawIcon = Dbchest.VariableDisplay.OptDrawIcon;
        this._iconIndex = Dbchest.VariableDisplay.IconIndex;
        this._alignment = Dbchest.VariableDisplay.Alignment;
        this.openness = 0;
        this.refresh();
    };
    
    Window_Variable.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };
    
    Window_Variable.prototype.variableId = function() {
        return this._variableId;
    };
    
    Window_Variable.prototype.optDrawIcon = function() {
        return this._drawIcon;
    };
    
    Window_Variable.prototype.iconIndex = function() {
        return this._iconIndex;
    };
    
    Window_Variable.prototype.alignment = function() {
        return this._alignment;
    };
    
    Window_Variable.prototype.refresh = function() {
        this.contents.clear();
        this.drawVariableIcon();
        this.drawVariableValue();
    };
    
    Window_Variable.prototype.drawVariableIcon = function() {
        if (this.optDrawIcon()) {
            var iconIndex = this.iconIndex();
            var alignment = this.alignment();
            var cw = this.contentsWidth();
            var iw = Window_Base._iconWidth;
            var x = alignment === 'right' ? cw - iw : 0;
            this.drawIcon(iconIndex, x, 0);
        }
    };
    
    Window_Variable.prototype.drawVariableValue = function() {
        var value = $gameVariables.value(this.variableId());
        var alignment = this.alignment();
        var iconWidth = Window_Base._iconWidth;
        var textPadding = this.textPadding();
        var x = this.optDrawIcon() ? iconWidth + textPadding : 0;
        x = alignment === 'right' ? -x : x;
        this.drawText(value, x, 0, this.contentsWidth(), alignment);
    };
    
    Window_Variable.prototype.setVariableId = function(variableId) {
        if (this._variableId !== variableId) {
            this._variableId = variableId;
        }
    };
    
    Window_Variable.prototype.setDrawIcon = function(drawIcon) {
        this._drawIcon = drawIcon;
    };
    
    Window_Variable.prototype.setIconIndex = function(iconIndex) {
        this._iconIndex = iconIndex;
    };
    
    Window_Variable.prototype.setAlignment = function(alignment) {
        this._alignment = alignment;
    };
    
})();