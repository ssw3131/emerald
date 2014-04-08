"use strict";

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkPlugin
var DkPlugin;
( function() {
    DkPlugin = {
        css : function( $model, $obj ) {
            var style = $model.___style;
            for ( var key in $obj ) {
                style[ key ] = $obj[ key ];
            }
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// line
var DkLine;
( function() {
    var common = DkCommon;
    var mathSqrt = Math.sqrt;
    var mathAtan2 = Math.atan2;
    var mathPI = Math.PI;

    DkLine = function() {
        var me = this;
        var sprite = new DkSprite();

        // 기본 데이터
        me.data = sprite.data;
        // 부모
        me.parent = null;
        // 업데이트 반영 여부
        me.___updated = false;
        // 타입
        me.___type = sprite.___type;

        me.___element = sprite.___element;
        me.___style = sprite.___style;
        me.___element.___me = sprite.___element.___me;

        DkPlugin.css( sprite, {
            padding : "1px",
            backgroundClip : "content-box"
        } );
    };

    /**
     * 프로토타입
     * @type {{set: Function, sets: Function, get: Function, lineStyle: Function}}
     */
    var proto = {
        // 데이터 입력
        set : common.set,
        sets : common.sets,
        // 데이터 출력
        get : common.get,

        lineStyle : function( $thickness, $color, $alpha ) {
            var me = this;
            var data = me.data;

            data.height = $thickness;
            data.backgroundColor = $color;
            if ( $alpha ) data.alpha = $alpha;

            me.___updated = false;
        },

        draw : function( $pointA, $pointB ) {
            var me = this;
            var data = me.data;

            var x1 = $pointA.x;
            var x2 = $pointB.x;
            var y1 = $pointA.y;
            var y2 = $pointB.y;
            var dx = x2 - x1;
            var dy = y2 - y1;

            data.width = getDist();
            data.x = x1 - ( data.width - ( x2 - x1 ) ) / 2;
            data.y = y1 + ( y2 - y1 ) / 2;
            data.rotate = getRotate();

            me.___updated = false;

            function getDist() {
                return mathSqrt( dx * dx + dy * dy );
            };

            function getRotate() {
                return mathAtan2( dy, dx ) * 180 / mathPI;
            };
        }
    };

    // 프로토타입 연결
    common.setPrototype( DkLine, proto );

}() );