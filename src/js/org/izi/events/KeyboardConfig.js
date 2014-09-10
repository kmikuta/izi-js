/**
 * @requires EventConfig.js
 */
!function (module) {

    /**
     * @class Izi.events.KeyboardConfig
     * @extends Izi.events.EventConfig
     * @constructor
     * @private
     * @param {String} eventType
     */
    var KeyboardConfig = function Izi_events_KeyboardConfig(eventType) {
        module.events.EventConfig.apply(this, arguments);
        this.expectedKeyCode = 0;
    };
    KeyboardConfig.prototype = new module.events.EventConfig();
    KeyboardConfig.prototype.constructor = KeyboardConfig;

    /**
     * @member Izi.events.KeyboardConfig
     * @private
     * @type {Boolean}
     */
    KeyboardConfig.prototype.isKeyboardEventConfig = true;

    /**
     * Setup custom expected keyCode. Use it only when you can't find desired key in methods below:
     * <code>izi.events.keyDown().ENTER()</code> etc.
     * @member Izi.events.KeyboardConfig
     * @param {Number} value
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.keyCode = function (value) {
        this.expectedKeyCode = value;
        return this;
    };

    /**
     * Returns expected key code
     * @member Izi.events.KeyboardConfig
     * @private
     * @return {Number}
     */
    KeyboardConfig.prototype.getExpectedKeyCode = function () {
        return this.expectedKeyCode;
    };

    /**
     * Setup BACKSPACE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.BACKSPACE = function () {
        return this.keyCode(8);
    };
    
    /**
     * Setup TAB key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.TAB = function () {
        return this.keyCode(9);
    };
    
    /**
     * Setup NUM_CENTER key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_CENTER = function () {
        return this.keyCode(12);
    };

    /**
     * Setup ENTER key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ENTER = function () {
        return this.keyCode(13);
    };
    
    /**
     * Setup RETURN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.RETURN = function () {
        return this.keyCode(13);
    };
    
    /**
     * Setup SHIFT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.SHIFT = function () {
        this.shift(); // If you press SHIFT key - event modifier will be set to true, so we need to also expect that.
        return this.keyCode(16);
    };
    
    /**
     * Setup CTRL key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.CTRL = function () {
        this.ctrl(); // If you press CTRL key - event modifier will be set to true, so we need to also expect that.
        return this.keyCode(17);
    };
    
    /**
     * Setup ALT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ALT = function () {
        this.alt(); // If you press ALT key - event modifier will be set to true, so we need to also expect that.
        return this.keyCode(18);
    };
    
    /**
     * Setup PAUSE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.PAUSE = function () {
        return this.keyCode(19);
    };
    
    /**
     * Setup CAPS_LOCK key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.CAPS_LOCK = function () {
        return this.keyCode(20);
    };
    
    /**
     * Setup ESC key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ESC = function () {
        return this.keyCode(27);
    };
    
    /**
     * Setup SPACE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.SPACE = function () {
        return this.keyCode(32);
    };
    
    /**
     * Setup PAGE_UP key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.PAGE_UP = function () {
        return this.keyCode(33);
    };
    
    /**
     * Setup PAGE_DOWN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.PAGE_DOWN = function () {
        return this.keyCode(34);
    };
    
    /**
     * Setup END key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.END = function () {
        return this.keyCode(35);
    };
    
    /**
     * Setup HOME key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.HOME = function () {
        return this.keyCode(36);
    };
    
    /**
     * Setup LEFT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.LEFT = function () {
        return this.keyCode(37);
    };
    
    /**
     * Setup UP key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.UP = function () {
        return this.keyCode(38);
    };
    
    /**
     * Setup RIGHT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.RIGHT = function () {
        return this.keyCode(39);
    };
    
    /**
     * Setup DOWN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.DOWN = function () {
        return this.keyCode(40);
    };
    
    /**
     * Setup PRINT_SCREEN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.PRINT_SCREEN = function () {
        return this.keyCode(44);
    };
    
    /**
     * Setup INSERT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.INSERT = function () {
        return this.keyCode(45);
    };
                                                                //
    /**
     * Setup DELETE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.DELETE = function () {
        return this.keyCode(46);
    };
    
    /**
     * Setup ZERO key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ZERO = function () {
        return this.keyCode(48);
    };
    
    /**
     * Setup ONE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ONE = function () {
        return this.keyCode(49);
    };
    
    /**
     * Setup TWO key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.TWO = function () {
        return this.keyCode(50);
    };
    
    /**
     * Setup THREE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.THREE = function () {
        return this.keyCode(51);
    };
    
    /**
     * Setup FOUR key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.FOUR = function () {
        return this.keyCode(52);
    };
    
    /**
     * Setup FIVE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.FIVE = function () {
        return this.keyCode(53);
    };
    
    /**
     * Setup SIX key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.SIX = function () {
        return this.keyCode(54);
    };
    
    /**
     * Setup SEVEN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.SEVEN = function () {
        return this.keyCode(55);
    };
    
    /**
     * Setup EIGHT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.EIGHT = function () {
        return this.keyCode(56);
    };
    
    /**
     * Setup NINE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NINE = function () {
        return this.keyCode(57);
    };

    /**
     * Setup A key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.A = function () {
        return this.keyCode(65);
    };

    /**
     * Setup B key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.B = function () {
        return this.keyCode(66);
    };

    /**
     * Setup C key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.C = function () {
        return this.keyCode(67);
    };

    /**
     * Setup D key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.D = function () {
        return this.keyCode(68);
    };

    /**
     * Setup E key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.E = function () {
        return this.keyCode(69);
    };

    /**
     * Setup F key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F = function () {
        return this.keyCode(70);
    };

    /**
     * Setup G key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.G = function () {
        return this.keyCode(71);
    };

    /**
     * Setup H key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.H = function () {
        return this.keyCode(72);
    };

    /**
     * Setup I key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.I = function () {
        return this.keyCode(73);
    };

    /**
     * Setup J key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.J = function () {
        return this.keyCode(74);
    };

    /**
     * Setup K key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.K = function () {
        return this.keyCode(75);
    };

    /**
     * Setup L key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.L = function () {
        return this.keyCode(76);
    };

    /**
     * Setup M key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.M = function () {
        return this.keyCode(77);
    };

    /**
     * Setup N key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.N = function () {
        return this.keyCode(78);
    };

    /**
     * Setup O key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.O = function () {
        return this.keyCode(79);
    };

    /**
     * Setup P key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.P = function () {
        return this.keyCode(80);
    };

    /**
     * Setup Q key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.Q = function () {
        return this.keyCode(81);
    };

    /**
     * Setup R key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.R = function () {
        return this.keyCode(82);
    };

    /**
     * Setup S key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.S = function () {
        return this.keyCode(83);
    };

    /**
     * Setup T key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.T = function () {
        return this.keyCode(84);
    };

    /**
     * Setup U key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.U = function () {
        return this.keyCode(85);
    };

    /**
     * Setup V key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.V = function () {
        return this.keyCode(86);
    };

    /**
     * Setup W key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.W = function () {
        return this.keyCode(87);
    };

    /**
     * Setup X key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.X = function () {
        return this.keyCode(88);
    };

    /**
     * Setup Y key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.Y = function () {
        return this.keyCode(89);
    };

    /**
     * Setup Z key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.Z = function () {
        return this.keyCode(90);
    };

    /**
     * Setup NUM_ZERO key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_ZERO = function () {
        return this.keyCode(96);
    };

    /**
     * Setup NUM_ONE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_ONE = function () {
        return this.keyCode(97);
    };

    /**
     * Setup NUM_TWO key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_TWO = function () {
        return this.keyCode(98);
    };

    /**
     * Setup NUM_THREE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_THREE = function () {
        return this.keyCode(99);
    };

    /**
     * Setup NUM_FOUR key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_FOUR = function () {
        return this.keyCode(100);
    };

    /**
     * Setup NUM_FIVE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_FIVE = function () {
        return this.keyCode(101);
    };

    /**
     * Setup NUM_SIX key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_SIX = function () {
        return this.keyCode(102);
    };

    /**
     * Setup NUM_SEVEN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_SEVEN = function () {
        return this.keyCode(103);
    };

    /**
     * Setup NUM_EIGHT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_EIGHT = function () {
        return this.keyCode(104);
    };

    /**
     * Setup NUM_NINE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_NINE = function () {
        return this.keyCode(105);
    };

    /**
     * Setup NUM_MULTIPLY key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_MULTIPLY = function () {
        return this.keyCode(106);
    };

    /**
     * Setup NUM_PLUS key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_PLUS = function () {
        return this.keyCode(107);
    };

    /**
     * Setup NUM_MINUS key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_MINUS = function () {
        return this.keyCode(109);
    };

    /**
     * Setup NUM_PERIOD key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_PERIOD = function () {
        return this.keyCode(110);
    };

    /**
     * Setup NUM_DIVISION key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_DIVISION = function () {
        return this.keyCode(111);
    };

    /**
     * Setup F1 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F1 = function () {
        return this.keyCode(112);
    };

    /**
     * Setup F2 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F2 = function () {
        return this.keyCode(113);
    };

    /**
     * Setup F3 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F3 = function () {
        return this.keyCode(114);
    };

    /**
     * Setup F4 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F4 = function () {
        return this.keyCode(115);
    };

    /**
     * Setup F5 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F5 = function () {
        return this.keyCode(116);
    };

    /**
     * Setup F6 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F6 = function () {
        return this.keyCode(117);
    };

    /**
     * Setup F7 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F7 = function () {
        return this.keyCode(118);
    };

    /**
     * Setup F8 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F8 = function () {
        return this.keyCode(119);
    };

    /**
     * Setup F9 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F9 = function () {
        return this.keyCode(120);
    };

    /**
     * Setup F10 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F10 = function () {
        return this.keyCode(121);
    };

    /**
     * Setup F11 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F11 = function () {
        return this.keyCode(122);
    };

    /**
     * Setup F12 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F12 = function () {
        return this.keyCode(123);
    };

    module.events.KeyboardConfig = KeyboardConfig;
}(Izi);