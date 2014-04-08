"use strict";

//----------------------------------------------------------------------------------------------------------------------------------------------//
// dk
var Dk;
( function() {
    /**
     * dk 정보
     * @type {{information: {name: string, version: string, contact: string}, frameRate: number}}
     */
    Dk = {
        information : {
            name : "Dk emerald",
            version : "v1.0.0",
            contact : "ssw3131@daum.net"
        },
        frameRate : 60
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// detector
var DkDetector;
( function() {
    var navigator, agent, platform, appVersion, os, osVersion, browser, browserVersion, cssPrefix, stylePrefix, transform3D, render, result, div;

    /**
     * 디텍터
     * @type {{init: Function}}
     */
    DkDetector = {
        /**
         * 디텍터 초기화
         */
        init : function() {
            navigator = window.navigator;

            checkAgent();
            function checkAgent() {
                agent = navigator.userAgent.toLowerCase();
            };

            checkPlatform();
            function checkPlatform() {
                platform = navigator.platform;
            };

            checkAppVersion();
            function checkAppVersion() {
                appVersion = navigator.appVersion.toLowerCase();
            }

            checkBrowser();
            function checkBrowser() {
                function checkIe() {
                    if ( agent.indexOf( "msie" ) > -1 ) {
                        browser = "ie";
                        browserVersion = /msie ([\d]+)/.exec( agent )[1];
                        return true;
                    } else {
						if ( agent.indexOf( "trident" ) > -1 ) {
							browser = "ie";
							browserVersion = 11;
							return true;
						}
					}
                };

                function checkChrome() {
                    if ( agent.indexOf( "chrome" ) > -1 ) {
                        browser = "chrome";
                        browserVersion = /chrome\/([\d]+)/.exec( agent )[1];
                        return true;
                    }
                };

                function checkSafari() {
                    if ( agent.indexOf( "safari" ) > -1 ) {
                        browser = "safari";
                        browserVersion = /safari\/([\d]+)/.exec( agent )[1];
                        return true;
                    }
                };

                function checkFirefox() {
                    if ( agent.indexOf( "firefox" ) > -1 ) {
                        browser = "firefox";
                        browserVersion = /firefox\/([\d]+)/.exec( agent )[1];
                        return true;
                    }
                };

                function checkOpera() {
                    if ( agent.indexOf( "opera" ) > -1 ) {
                        browser = "opera";
                        browserVersion = /opera\/([\d]+)/.exec( agent )[1];
                        return true;
                    }
                };

                checkIe() || checkChrome() || checkSafari() || checkFirefox() || checkOpera();
            };

            checkOs();
            function checkOs() {
                if ( agent.indexOf( 'iemobile' ) > -1 ) {
                    os = 'winMobile';
                }

                var i;
                if ( agent.indexOf( 'android' ) > -1 ) {
                    browser = os = 'android';
                    i = /android ([\d.]+)/.exec( agent );
                    if ( i ) {
                        i = i[1].split( '.' );
                        osVersion = parseFloat( i[0] + '.' + i[1] );
                    } else {
                        osVersion = 0;
                    }
                } else if ( agent.indexOf( i = 'iphone' ) > -1 || agent.indexOf( i = 'ipad' ) > -1 ) {
                    browser = os = i;
                    i = /os ([\d_]+)/.exec( agent );
                    if ( i ) {
                        i = i[1].split( '_' );
                        osVersion = parseFloat( i[0] + '.' + i[1] );
                    } else {
                        osVersion = 0;
                    }
                } else {
                    if ( platform.indexOf( 'win' ) > -1 ) {
                        os = 'win';
                        if ( agent.indexOf( 'windows nt 5.1' ) > -1 || agent.indexOf( 'windows xp' ) > -1 ) {
                            osVersion = 'xp';
                        } else if ( agent.indexOf( 'windows nt 6.1' ) > -1 || agent.indexOf( 'windows nt 7.0' ) > -1 ) {
                            osVersion = '7';
                        } else if ( agent.indexOf( 'windows nt 6.2' ) > -1 || agent.indexOf( 'windows nt 8.0' ) > -1 ) {
                            osVersion = '8';
                        }
                    } else if ( platform.indexOf( 'mac' ) > -1 ) {
                        os = 'mac';
                        i = /os x ([\d._]+)/.exec( agent )[1].replace( '_', '.' ).split( '.' );
                        osVersion = parseFloat( i[0] + '.' + i[1] );
                    } else {
                        os = appVersion.indexOf( 'x11' ) > -1 ? 'unix' : appVersion.indexOf( 'linux' ) > -1 ? 'linux' : 0;
                    }
                }
            }

            checkPrefix();
            function checkPrefix() {
                switch ( browser ) {
                    case "ie":
                        cssPrefix = "-ms-";
                        stylePrefix = "ms";
                        transform3D = browserVersion > 9;
                        if ( browserVersion < 9 ) {
                            render = "IeOld";
                        } else if ( browserVersion == 9 ) {
                            render = "Transform2D";
                        } else if ( browserVersion > 9 ) {
                            render = "Transform3D";
                        }
                        break;
                    case "firefox":
                        cssPrefix = "-moz-";
                        stylePrefix = "Moz";
                        transform3D = true;
                        render = "Transform3D";
                        break;
                    case "opera":
                        cssPrefix = "-o-";
                        stylePrefix = "O";
                        transform3D = false;
                        render = "Transform2D";
                        break;
                    default:
                        cssPrefix = "-webkit-";
                        stylePrefix = "webkit";
                        transform3D = (!( os == 'android' && osVersion < 4 ));
                        render = "Transform3D";
                }
            };

            div = document.createElement("div");

            result = {
                navigator : navigator,
                agent : agent,
                platform : platform,
                browser : browser,
                browserVersion : browserVersion,
                cssPrefix : cssPrefix,
                stylePrefix : stylePrefix,
                transform3D : transform3D,
                render : render,

                touchBool : window.ontouchstart !== undefined,
                text : ( browser == "ie" && browserVersion < 10 ) ? "innerText" : "innerHTML",

                prefixFilter : stylePrefix + "Filter",
                prefixTransform : stylePrefix + "Transform",
                prefixPerspective : stylePrefix + "Perspective",
                prefixTransition : stylePrefix + "Transition"
            };
            return result;
        }
    }.init();
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// 보정패치
( function() {
    // setTimeout, setInterval
    (function( f ) {
        window.setTimeout = f( window.setTimeout );
        window.setInterval = f( window.setInterval );
    })( function( f ) {
        return function( $a, $b ) {
            var a = [].slice.call( arguments, 2 );
            return f( function() {
                $a.apply( this, a );
            }, $b );
            a
        };
    } );

    // Date
    ( function() {
        Date.now = Date.now * 1 || function() {
            return +new Date;
        };
    }() );

    // splice
    ( function() {
        if ( DkDetector.browser == "ie" && DkDetector.browserVersion < 9 ) {
            var originalSpliceF = Array.prototype.splice;
            Array.prototype.splice = function() {
                var arr = [].slice.call( arguments, 0 );
                if ( arr.length == 1 ) {
                    arr.push( this.length - arr[ 0 ] );
                }
                return originalSpliceF.apply( this, arr );
            };
        }
    }() );
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// util
var DkUtil;
( function() {
    var mathRoundF = Math.round;
    var mathRandomF = Math.random;

    DkUtil = {
        /**
         * 랜덤 컬러생성 (Hex Code)
         * @returns {string}
         */
        randomColorHex : function() {
            var letters = "0123456789ABCDEF".split( "" );
            var color = "#";
            for ( var i = 0; i < 6; i++ ) {
                color += letters[ mathRoundF( mathRandomF() * 15 ) ];
            }
            return color;
        },

        /**
         * 랜덤 컬러생성
         * @returns {string}
         */
        randomColor : function() {
            var r = mathRoundF( mathRandomF() * 256 - 0.00001 );
            var g = mathRoundF( mathRandomF() * 256 - 0.00001 );
            var b = mathRoundF( mathRandomF() * 256 - 0.00001 );
            var color = "rgb(" + r + ", " + g + ", " + b + ")";
            return color;
        },

        /**
         * 랜덤 범위지정
         * @param $max {number}
         * @param $min {number}
         * @returns {number}
         */
        random : function( $max, $min ) {
            $min = $min || 0;
            var result = $min + ( $max - $min ) * mathRandomF();
            return result;
        },

        /**
         * 윈도우 내부 가로값을 가져온다
         * @returns {number}
         */
        getWindowWidth : function() {
            if ( window.innerWidth ) {
                return window.innerWidth;
            } else {
                return document.documentElement.clientWidth;
            }
        },

        /**
         * 윈도우 내부 세로값을 가져온다
         * @returns {number}
         */
        getWindowHeight : function() {
            if ( window.innerHeight ) {
                return window.innerHeight;
            } else {
                return document.documentElement.clientHeight;
            }
        },

        /**
         * 모니터 가로값을 가져온다
         * @returns {number}
         */
        getScreenWidth : function() {
            return screen.width;
        },

        /**
         * 모니터 세로값을 가져온다
         * @returns {number}
         */
        getScreenHeight : function() {
            return screen.height;
        },

        /**
         * 돔 엘리먼트 가로값을 가져온다
         * @param $element {element}
         * @returns {number}
         */
        elementWidth : function( $element ) {
            // return $element.getBoundingClientRect().width;
            // return $element.getBoundingClientRect().right - this.element.getBoundingClientRect().left;
            return $element.offsetWidth;
        },

        /**
         * 돔 엘리먼트 세로값을 가져온다
         * @param $element {element}
         * @returns {number}
         */
        elementHeight : function( $element ) {
            // return $element.getBoundingClientRect().height;
            // return $element.getBoundingClientRect().bottom - this.element.getBoundingClientRect().top;
            return $element.offsetHeight;
        },

        /**
         * true, false 사이 시간 퍼포먼스 테스트
         * @param $toggle {boolen}
         */
        performanceTest : function( $toggle ) {
            var thisF = DkUtil.performanceTest;
            if ( $toggle ) {
                thisF.startDate = Date.now();
            } else {
                thisF.endDate = Date.now();
                var time = thisF.endDate - thisF.startDate;
                trace( "DK : " + "performanceTest : " + time + " : millisecond" );
            }
        },

        /**
         * 객체의 타입이 맞는지 체크
         * @param $type {string}
         * @param $obj {all}
         * @returns {boolean}
         */
        is : function( $type, $obj ) {
            var type;
            if ( $type == "function" ) {
                type = "[object Function]";
            } else if ( $type == "array" ) {
                type = "[object Array]";
            } else if ( $type == "string" ) {
                type = "[object String]";
            } else if ( $type == "number" ) {
                type = "[object Number]";
            } else if ( $type == "object" ) {
                type = "[object Object]";
            }
            var objType = Object.prototype.toString.call( $obj );
            return $obj !== undefined && $obj !== null && objType === type;
        },

        /**
         * 객체의 길이를 반환
         * @param $obj {object}
         * @returns {number}
         */
        getObjectLength : function( $obj ) {
            var num = 0;
            for ( var obj in $obj ) {
                num++
            }
            return num;
        },

        /**
         * onLoad 확인
         * @param $element {element}
         * @param $complete {function}
         */
        onLoad : function( $element, $complete ) {
            var detector = DkDetector;
            var util = DkUtil;
            if ( detector.browser == "ie" && detector.browserVersion < 9 ) {
                // ie8 이하
                util.onLoad = function( $element, $complete ) {
                    util.onLoad.count++;
                    var thisCount = util.onLoad.count;
                    DkManagerLoop.add( "onLoadComplete" + thisCount, onComplete );
                    function onComplete() {
                        if ( $element.complete ) {
                            DkManagerLoop.del( "onLoadComplete" + thisCount );
                            $complete();
                        }
                    };
                }
                util.onLoad.count = 0;
                util.onLoad( $element, $complete );
            } else {
                // ie9 이상, 그 외
                util.onLoad = function( $element, $complete ) {
                    $element.onload = function() {
                        $complete();
                    };
                }
                util.onLoad( $element, $complete );
            }
        },

        /**
         * addEventListener
         * @param $element {element}
         * @param $eventType {string}
         * @param $listener {function}
         */
        addEventListener : function( $element, $eventType, $listener ) {
            var util = DkUtil;
            if ( $element.addEventListener ) {
                // ie9 이상, 그 외
                util.addEventListener = function( $element, $eventType, $listener ) {
                    if ( DkDetector.touchBool ) {
                        if ( $eventType == "mousedown" ) {
                            $eventType = "touchstart";
                        } else if ( $eventType == "mousemove" ) {
                            $eventType = "touchmove";
                        } else if ( $eventType == "mouseup" ) {
                            $eventType = "touchend";
                        }
                    }
                    $element.addEventListener( $eventType, $listener, false );
                };
                util.addEventListener( $element, $eventType, $listener );
            } else if ( $element.attachEvent ) {
                // ie8 이하
                util.addEventListener = function( $element, $eventType, $listener ) {
                    $element.attachEvent( "on" + $eventType, $listener );
                };
                util.addEventListener( $element, $eventType, $listener );
            }
        },

        /**
         * removeListener
         * @param $element {element}
         * @param $eventType {string}
         * @param $listener {function}
         */
        removeEventListener : function( $element, $eventType, $listener ) {
            var util = DkUtil;
            if ( $element.removeEventListener ) {
                // ie9 이상, 그 외
                util.removeEventListener = function( $element, $eventType, $listener ) {
                    if ( DkDetector.touchBool ) {
                        if ( $eventType == "mousedown" ) {
                            $eventType = "touchstart";
                        } else if ( $eventType == "mousemove" ) {
                            $eventType = "touchmove";
                        } else if ( $eventType == "mouseup" ) {
                            $eventType = "touchend";
                        }
                    }
                    $element.removeEventListener( $eventType, $listener, false );
                };
                util.removeEventListener( $element, $eventType, $listener );
            } else if ( $element.detachEvent ) {
                // ie8 이하
                util.removeEventListener = function( $element, $eventType, $listener ) {
                    $element.detachEvent( "on" + $eventType, $listener );
                };
                util.removeEventListener( $element, $eventType, $listener );
            }
        },

        disableContextMenu : function() {
            document.oncontextmenu = function() {
                //trace( "오른쪽 마우스를 사용할 수 없습니다." )
                return false;
            };
        },

        disableDrag : function() {
            DkUtil.addEventListener( document, "touchmove", function( $e ) {
                $e.preventDefault();
                //trace( "드래그를 사용할 수 없습니다." )
                return false;
            } );
        },

        disableSelect : function( $model ) {
            var target = $model.___element;
            if ( typeof target.onselectstart != "undefined" ) {
                // For IE This code will work
                target.onselectstart = function() {
                    return false;
                };
            } else if ( typeof target.style.MozUserSelect != "undefined" ) {
                // For Firefox This code will work
                target.style.MozUserSelect = "none";
            } else {
                // All other  (ie: Opera) This code will work
                target.onmousedown = function() {
                    return false;
                };
            }
        }
    }
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// trace, traceDir, traceLine
var trace, traceDir, traceLine;
( function() {
    var debuger;
    var log = "";

    // debuger view
    ( function() {
        debuger = document.createElement( "textarea" );
        var style = debuger.style;
        style.position = "fixed";
        style.display = "none";
        style.width = "800px";
        style.height = "400px";
        style.backgroundColor = "#000";
        style.fontFamily = "돋움, sans-serif";
        style.fontSize = "12px";
        style.lineHeight = "20px";
        style.color = "#FFF";
        style.borderStyle = "solid";
        style.borderColor = "#FFF";
        style.borderWidth = "1px";
        style.opacity = 0.8;
        style.zIndex = 888;
        document.body.appendChild( debuger );
    }() );

    // debug event
    ( function() {
        var bool = false;
        DkUtil.addEventListener( document, "keydown", debugClick );

        function debugClick( $e ) {
            // F8
            if ( $e.keyCode == 119 ) {
                if ( bool ) {
                    debuger.style.display = "none";
                } else {
                    debuger.style.display = "block";
                }
                bool = !bool;
            }
        }
    }() );

    /**
     * 트레이스
     * @param arguments {all}
     */
    trace = function() {
        var msg = "";
        var i = arguments.length;
        var leng = i;
        while ( i-- ) {
            var id = leng - 1 - i;
            msg += arguments[ leng - 1 - i ];
            if ( leng - i < leng ) {
                msg += ", ";
            }
        }
        debug( msg );
    };

    /**
     * 구분라인 트레이스
     */
    traceLine = function() {
        debug( "//-------------------------------------------------------------------------------------------//" );
    };

    /**
     * 디렉토리 트레이스
     * @param $param {all}
     * @param $recursive {boolean}
     */
    traceDir = function( $param, $recursive ) {
        traceLine();
        if ( typeof console == "undefined" ) {
            forIn( $param );
        } else {
            if ( console.dir ) {
                console.dir( $param );
            } else {
                forIn( $param );
            }
        }
        traceLine();

        function forIn( $param ) {
            for ( var key in $param ) {
                trace( key, $param[ key ] );
                if ( $recursive ) {
                    if ( $param[ key ] instanceof Object ) {
                        forIn( $param[ key ] );
                    }
                }
            }
        };
    };

    /**
     * debug
     * @param $msg {string}
     */
    function debug( $msg ) {
        if ( DkDetector.browser == "ie" && DkDetector.browserVersion < 10 ) {
            var debugOldF = function( $msg ) {
                log += "\n" + $msg;
                debuger[ DkDetector.text ] = log;
            };
            debugOldF( $msg );
            debug = debugOldF;
        } else {
            var debugNewF = function( $msg ) {
                console.log( $msg );
                log += "\n" + $msg;
                debuger[ DkDetector.text ] = log;
            };
            debugNewF( $msg );
            debug = debugNewF;
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// common
var DkCommon;
( function() {
    DkCommon = {
        /**
         * 데이터 입력
         * @param $name {string}
         * @param $val {number}
         */
        set : function( $name, $val ) {
            var me = this;
            var data = me.data;
            ( data[ $name ] == undefined ) ? trace( "DK : " + $name + " : 지원하지않는 프로퍼티" ) : data[ $name ] = $val;

            me.___updated = false;
        },

        /**
         * 데이터 중복 입력
         * @param $obj {object}
         */
        sets : function( $obj ) {
            var me = this;
            var data = me.data;
            for ( var key in $obj ) {
                ( data[ key ] == undefined ) ? trace( "DK : " + data[ key ] + " : 지원하지않는 프로퍼티" ) : data[ key ] = $obj[ key ];
            }

            me.___updated = false;
        },

        /**
         * 데이터 출력
         * @param $name {string}
         * @returns {number}
         */
        get : function( $name ) {
            return this.data[$name];
        },

        /**
         * 프로토타입 연결
         * @param $model {displayObject}
         * @param $getObj {object}
         */
        setPrototype : function( $model, $getObj ) {
            for ( var key in $getObj ) {
                $model.prototype[ key ] = $getObj[ key ];
            }
        },

        /**
         * 이벤트 리스너
         * @param $eventType {string}
         * @param $handler {function}
         */
        addListener : function( $eventType, $handler ) {
            if ( DkDetector.touchBool ) {
                if ( $eventType == "mousedown" ) {
                    $eventType = "touchstart";
                } else if ( $eventType == "mousemove" ) {
                    $eventType = "touchmove";
                } else if ( $eventType == "mouseup" ) {
                    $eventType = "touchend";
                }
            }
            this.___eventList[ $eventType ] = $handler;
            this.___style.cursor = "pointer";
        },

        /**
         * 이벤트 리무브 리스너
         * @param $eventType {string}
         */
        delListener : function( $eventType ) {
            if ( DkDetector.touchBool ) {
                if ( $eventType == "mousedown" ) {
                    $eventType = "touchstart";
                } else if ( $eventType == "mousemove" ) {
                    $eventType = "touchmove";
                } else if ( $eventType == "mouseup" ) {
                    $eventType = "touchend";
                }
            }
            var eventList = this.___eventList;
            delete eventList[ $eventType ];
            if ( DkUtil.getObjectLength( eventList ) < 1 ) {
                this.___style.cursor = "auto";
            }
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// display container
var DkDisplayContainer;
( function() {
    /**
     * 디스플레이 컨테이너
     * @type {{numChildren: Function, addChild: Function, addChildAt: Function, getChildAt: Function, getChildIndex: Function, removeChild: Function, removeChildAt: Function, removeChildren: Function, innerHTML: Function}}
     */
    DkDisplayContainer = {
        /**
         * 자식객체 숫자
         * @returns {number}
         */
        numChildren : function() {
            return this.children.length;
        },

        /**
         * 자식객체 추가
         * @param $child {displayObject}
         */
        addChild : function( $child ) {
            if ( $child.parent ) {
                $child.parent.removeChild( $child );
            }
            $child.parent = this;
            this.children.push( $child );
            // dom
            this.___element.appendChild( $child.___element );
        },

        /**
         * 자식객체 해당 인덱스에 추가
         * @param $child {displayObject}
         * @param $index {number}
         */
			addChildAt : function( $child, $index ) {
            var children = this.children;
            var element = this.___element;
            var leng = children.length;
            var childElement = $child.___element;

            if ( $index < 0 ) {
                throw new Error( "DK : 제공된 인덱스가 범위를 벗어났습니다." );
                return;
            } else if ( $index > leng ) {
                $index = leng;
            }

            if ( $child.parent ) {
                $child.parent.removeChild( $child );
            }
            $child.parent = this;

            var spliceArr = children.splice( $index );
            children.push( $child );
            this.children = children.concat( spliceArr );
            children = this.children;

            // dom
            if ( $index >= leng ) {
                element.appendChild( childElement );
            } else {
                element.insertBefore( childElement, children[ ++$index ].___element );
            }
        },

        /**
         * 해당 인덱스의 객체 반환
         * @param $index {number}
         * @returns {displayObject}
         */
        getChildAt : function( $index ) {
            var element = this.element;
            var leng = this.children.length;
            if ( $index < 0 || $index >= leng ) {
                throw new Error( "DK : 제공된 인덱스가 범위를 벗어났습니다." );
                return;
            }
            return this.children[ $index ];
        },

        /**
         * 해당 객체의 인덱스 반환
         * @param $child {displayObject}
         * @returns {number}
         */
        getChildIndex : function( $child ) {
            if ( !$child ) {
                throw new Error( "DK : 제공된 파라미터 값이 존재하지 않습니다." );
                return;
            }
            var children = this.children;
            var i = children.length;
            while ( i-- ) {
                if ( $child == children[ i ] ) {
                    return i;
                }
            }
            throw new Error( "DK : 제공된 DisplayObject는 호출자의 자식이어야 합니다." );
        },

        /**
         * 자식객체 제거
         * @param $child {displayObject}
         */
        removeChild : function( $child ) {
            if ( $child.parent != this ) {
                throw new Error( "DK : 제공된 DisplayObject는 호출자의 자식이어야 합니다." );
                return;
            }
            var children = this.children;
            var i = children.length;
            while ( i-- ) {
                if ( children[ i ] === $child ) {
                    $child.parent = null;
                    children.splice( i, 1 );
                    // dom
                    this.___element.removeChild( $child.___element );
                    break;
                }
            }
        },

        /**
         * 해당 인덱스의 객체 제거
         * @param $index {number}
         */
        removeChildAt : function( $index ) {
            var leng = this.children.length;
            if ( $index < 0 || $index >= leng ) {
                throw new Error( "DK : 제공된 인덱스가 범위를 벗어났습니다." );
                return;
            }

            var children = this.children;
            var child = children.splice( $index, 1 );
            child[ 0 ].parent = null;

            // dom
            this.___element.removeChild( child[ 0 ].___element );
        },

        /**
         * 자식객체 모두 제거 or 해당 인덱스 범위 제거 (slice 개념)
         * @param $beginIndex {number}
         * @param $endIndex {number}
         */
        removeChildren : function( $beginIndex, $endIndex ) {
            var element = this.___element;
            var children = this.children;
            var leng = children.length;

            if ( $beginIndex < 0 || $endIndex < 0 || $beginIndex >= $endIndex || $beginIndex >= leng ) {
                throw new Error( "DK : 제공된 인덱스가 범위를 벗어났습니다." );
                return;
            }

            if ( $beginIndex == undefined ) {
                $beginIndex = 0;
            }
            if ( $endIndex == undefined ) {
                $endIndex = leng;
            }
            var spliceArr = children.splice( $beginIndex, $endIndex - $beginIndex );
            var i = spliceArr.length;
            while ( i-- ) {
                spliceArr[ i ].parent = null;
                // dom
                element.removeChild( spliceArr[ i ].___element );
            }
        },

        /**
         * html 태그 추가
         * @param $msg {string}
         */
        innerHTML : function( $msg ) {
            // dom
            if ( $msg == undefined ) {
                return this.___element[ DkDetector.text ];
            } else {
                return this.___element[ DkDetector.text ] = $msg;
            }
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// sprite
var DkSprite;
( function() {
    var common = DkCommon;

    DkSprite = function() {
        var me = this;
        // 기본 데이터
        me.data = new DataElementF();
        // 타입
        me.___type = "sprite";
        // 부모
        me.parent = null;
        // 자식
        me.children = [];
        // 업데이트 반영 여부
        me.___updated = false;
        // 이벤트 리스트
        me.___eventList = {};

        // 뷰 모드 별 추가정보
        createDom.call( me );
    };

    /**
     * DkSprite 기본 데이터
     */
    var DataElementF = function() {
        this.visible = "";
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.rotate = 0;
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.backgroundColor = "";
    };

    /**
     * 돔 생성
     */
    function createDom() {
        var me = this;
        var element = document.createElement( "div" );
        var style = element.style;
        style.position = "absolute";
        style.display = "";
        style.margin = "0px";
        style.padding = "0px";
//        style.overflow = "hidden";

        me.___element = element;
        me.___style = style;
        me.___element.___me = me;
    };

    /**
     * 프로토타입
     * @type {{set: Function, sets: Function, get: Function, addListener: Function, delListener: Function}}
     */
    var proto = {
        // 데이터 입력
        set : common.set,
        sets : common.sets,
        // 데이터 출력
        get : common.get,
        // 이벤트 리스너
        addListener : common.addListener,
        delListener : common.delListener
    };

    // 프로토타입 연결
    common.setPrototype( DkSprite, proto );

    // 디스플레이 컨테이너 프로토타입 연결
    common.setPrototype( DkSprite, DkDisplayContainer );
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// text
var DkText;
( function() {
    var common = DkCommon;

    DkText = function() {
        var me = this;
        // 기본 데이터
        me.data = new DataElementF();
        // 타입
        me.___type = "text";
        // 부모
        me.parent = null;
        // 자식
        // me.children = [];
        // 업데이트 반영 여부
        me.___updated = false;
        // 이벤트 리스트
        me.___eventList = {};

        // 뷰 모드 별 추가정보
        createDom.call( me );
    };

    /**
     * DkText 기본 데이터
     */
    var DataElementF = function() {
        this.visible = "";
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.rotate = 0;
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.backgroundColor = "";

        // text
        this.text = "";
        this.size = 0;
        this.color = "";
        this.font = "";
        this.fontWeight = "";
        this.widthReal = 0;
        this.heightReal = 0;
    };

    /**
     * 돔 생성
     */
    function createDom() {
        var me = this;
        var element = document.createElement( "div" );
        var style = element.style;
        style.position = "absolute";
        style.display = "";
        style.margin = "0px";
        style.padding = "0px";

        me.___element = element;
        me.___style = style;
        me.___element.___me = me;
    };

    /**
     * 프로토타입
     * @type {{set: Function, sets: Function, get: Function, addListener: Function, delListener: Function, text: Function}}
     */
    DkText.prototype = {
        // 데이터 입력
        set : common.set,
        sets : common.sets,
        // 데이터 출력
        get : common.get,
        // 이벤트 리스너
        addListener : common.addListener,
        delListener : common.delListener,

        /**
         * 텍스트 정보입력
         * @param $msg {string}
         * @param $size {number}
         * @param $color {string}
         * @param $font {string}
         * @param $fontWeight {number}
         */
        text : function( $msg, $size, $color, $font, $fontWeight ) {
            var me = this;
            var data = me.data;
            data.text = $msg;
            data.size = $size;
            data.color = $color;
            data.font = $font || "";
            data.fontWeight = $fontWeight || "";

            // 돔 적용
            setDom();

            /**
             * 돔 적용
             */
            function setDom() {
                var util = DkUtil;
                var element = me.___element;
                var style = me.___style;
                var data = me.data;
                element[ DkDetector.text ] = data.text;
                style.fontSize = data.size + "px";
                style.fontFamily = data.font;
                style.color = data.color;
                style.fontWeight = data.fontWeight;

                data.widthReal = util.elementWidth( element );
                data.heightReal = util.elementHeight( element );
            };
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// bitmap
var DkBitmap;
( function() {
    var common = DkCommon;
    var util = DkUtil;

    DkBitmap = function() {
        var me = this;
        // 기본 데이터
        me.data = new DataElementF();
        // 타입
        me.___type = "bitmap";
        // 부모
        me.parent = null;
        // 자식
        // me.children = [];
        // 업데이트 반영 여부
        me.___updated = false;
        // 이벤트 리스트
        me.___eventList = {};

        // 뷰 모드 별 추가정보
        createDom.call( me );
    };

    /**
     * DkBitmap 기본 데이터
     */
    var DataElementF = function() {
        this.visible = "";
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.rotate = 0;
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;

        // bitmap
        this.url = "";
        this.widthReal = 0;
        this.heightReal = 0;
    };

    /**
     * 돔 생성
     */
    function createDom() {
        var me = this;
        var element = document.createElement( "img" );
        var style = element.style;
        style.position = "absolute";
        style.display = "";
        style.margin = "0px";
        style.padding = "0px";
//        style.overflow = "hidden";

        me.___element = element;
        me.___style = style;
        me.___element.___me = me;

        // bitmap
        element.border = 0;
    };

    /**
     * 프로토타입
     * @type {{set: Function, sets: Function, get: Function, addListener: Function, delListener: Function, load: Function}}
     */
    DkBitmap.prototype = {
        // 데이터 입력
        set : common.set,
        sets : common.sets,
        // 데이터 출력
        get : common.get,
        // 이벤트 리스너
        addListener : common.addListener,
        delListener : common.delListener,

        /**
         * 비트맵 정보입력
         * @param $url {string}
         * @param $real {boolean}
         * @param $loadComplete {function}
         */
        load : function( $url, $real, $loadComplete ) {
            var me = this;
            var data = me.data;
            data.url = $url;

            if ( $real == undefined ) {
                $real = true;
            }

            // 돔 적용
            setDom();

            /**
             * 돔 적용
             */
            function setDom() {
                var img = document.createElement( "img" );
                img.src = data.url;

                // 로드완료
                util.onLoad( img, onComplete );
                function onComplete() {
                    var element = me.___element;
                    element.src = data.url;
                    element.style.width = "0px";
                    element.style.height = "0px";
                    var widthReal = img.width;
                    var heightReal = img.height;
                    data.widthReal = widthReal;
                    data.heightReal = heightReal;
                    if ( $real ) {
                        data.width = widthReal;
                        data.height = heightReal;
                    }
                    me.___updated = false;
                    if ( $loadComplete ) {
                        $loadComplete( me );
                    }
                };
            };
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// media
var DkMedia;
( function() {
    var common = DkCommon;

    DkMedia = function( $type ) {
        var me = this;
        // 기본 데이터
        me.data = new DataElementF();
        // 타입
        me.___type = $type;
        // 부모
        me.parent = null;
        // 자식
        // me.children = [];
        // 업데이트 반영 여부
        me.___updated = false;
        // 이벤트 리스트
        me.___eventList = {};

        // 뷰 모드 별 추가정보
        createDom.call( me );
    };

    /**
     * DkMedia 기본 데이터
     */
    var DataElementF = function() {
        this.visible = "";
        this.x = 0;
        this.y = 0;
        this.width = 400;
        this.height = 300;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.rotate = 0;
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.backgroundColor = "";

        // video, audio
        this.url = "";
        this.controls = false;
        this.autoplay = false;
        this.muted = true;
        this.loop = false;
    };

    /**
     * 돔 생성
     */
    function createDom() {
        var me = this;
        var type = me.___type;
        var element = document.createElement( type );
        var style = element.style;
        style.position = "absolute";
        style.display = "";
        style.margin = "0px";
        style.padding = "0px";
//        style.overflow = "hidden";

        me.___element = element;
        me.___style = style;
        me.___element.___me = me;

        // video, audio
        var sourceArr = [];
        var i = 3;
        while ( i-- ) {
            var source = document.createElement( "source" );
            sourceArr[ i ] = source;
        }
        me.___sourceArr = sourceArr;
    };

    /**
     * 프로토타입
     * @type {{set: Function, sets: Function, get: Function, addListener: Function, delListener: Function, load: Function}}
     */
    DkMedia.prototype = {
        // 데이터 입력
        set : common.set,
        sets : common.sets,
        // 데이터 출력
        get : common.get,
        // 이벤트 리스너
        addListener : common.addListener,
        delListener : common.delListener,

        /**
         * 미디어 정보입력
         * @param $url {string}
         * @param $controls {boolean}
         * @param $autoplay {boolean}
         * @param $muted {boolean}
         * @param $loop {boolean}
         */
        load : function( $url, $controls, $autoplay, $muted, $loop ) {
            var me = this;
            var data = me.data;
            data.url = $url;
            data.controls = $controls;
            data.autoplay = $autoplay;
            data.muted = $muted;
            data.loop = $loop;

            // 돔 적용
            setDom();

            /**
             * 돔 적용
             */
            function setDom() {
                var data = me.data;
                var element = me.___element;
                element.controls = data.controls;
                element.autoplay = data.autoplay;
                element.muted = data.muted;
                element.loop = data.loop;
                var sourceArr = me.___sourceArr;
                var type = {
                    video : [ "ogg", "webm", "mp4" ],
                    audio : [ "ogg", "wav", "mp3" ]
                };
                var i = 3;
                while ( i-- ) {
                    var source = sourceArr[ i ];
                    element.appendChild( source );
                    source.src = data.url + "." + type[ me.___type ][ i ];
                }
            };
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// sprite sheet
var DkSpriteSheet;
( function() {
    var common = DkCommon;
    var util = DkUtil;

    DkSpriteSheet = function() {
        var me = this;
        // 기본 데이터
        me.data = new DataElementF();
        // 타입
        me.___type = "sheet";
        // 부모
        me.parent = null;
        // 자식
        // me.children = [];
        // 업데이트 반영 여부
        me.___updated = false;
        // 이벤트 리스트
        me.___eventList = {};
        // 시트 렌더링
        me.___sheetRender = "stop";
        // 시트 주기
        me.___sheetRate = 0;

        // 뷰 모드 별 추가정보
        createDom.call( me );
    };

    /**
     * DkSpriteSheet 기본 데이터
     */
    var DataElementF = function() {
        this.visible = "";
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.rotate = 0;
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;

        // sheet
        this.url = "";
        this.widthReal = 0;
        this.heightReal = 0;
        this.xNum = 0;
        this.yNum = 0;
        this.currentFrame = 1;
        this.totalFrames = 1;
        this.startFrame = 1;
        this.endFrame = 1;
        this.frameRate = 30;
    };

    /**
     * 돔 생성
     */
    function createDom() {
        var me = this;
        var element = document.createElement( "div" );
        var style = element.style;
        style.position = "absolute";
        style.display = "";
        style.margin = "0px";
        style.padding = "0px";
//        style.overflow = "hidden";

        me.___element = element;
        me.___style = style;
        me.___element.___me = me;

        // sheet
        style.backgroundRepeat = "no-repeat";
    };

    /**
     * 프로토타입
     * @type {{set: Function, sets: Function, get: Function, addListener: Function, delListener: Function, load: Function, play: Function, stop: Function, gotoAndStop: Function, gotoAndPlay: Function, gotoAndRepeat: Function}}
     */
    DkSpriteSheet.prototype = {
        // 데이터 입력
        set : common.set,
        sets : common.sets,
        // 데이터 출력
        get : common.get,
        // 이벤트 리스너
        addListener : common.addListener,
        delListener : common.delListener,

        /**
         * 스프라이트시트 정보입력
         * @param $url {string}
         * @param $xNum {number}
         * @param $yNum {number}
         * @param $totalFrames {number}
         * @param $frameRate {number}
         */
        load : function( $url, $xNum, $yNum, $totalFrames, $frameRate ) {
            var me = this;
            var data = me.data;
            data.url = $url;
            data.xNum = $xNum;
            data.yNum = $yNum;
            data.totalFrames = $totalFrames;
            data.endFrame = $totalFrames;
            data.frameRate = $frameRate;

            // 돔 적용
            setDom();

            /**
             * 돔 적용
             */
            function setDom() {
                var style = me.___style;
                var img = document.createElement( "img" );
                img.src = data.url;

                // 로드완료
                util.onLoad( img, onComplete );
                function onComplete() {
                    style.backgroundImage = "url(" + data.url + ")";
                    var widthReal = img.width;
                    var heightReal = img.height;
                    data.widthReal = widthReal;
                    data.heightReal = heightReal;
                    data.width = Math.floor( widthReal / data.xNum );
                    data.height = Math.floor( heightReal / data.yNum );
                    me.___updated = false;
                    // me.___sheetRender = "start";
                };
            };
        },

        /**
         * 스프라이트시트 재생
         */
        play : function() {
            var me = this;
            var data = me.data;
            data.startFrame = 1;
            data.endFrame = data.totalFrames;
            if ( me.___sheetRender !== "start" ) {
                me.___updated = false;
                me.___sheetRender = "start";
            }
        },

        /**
         * 스프라이트시트 멈춤
         */
        stop : function() {
            var me = this;
            me.___sheetRender = "stop";
        },

        /**
         * 스프라이트시트 해당프레임 멈춤
         * @param {number}
         */
        gotoAndStop : function( $frame ) {
            var me = this;
            var data = me.data;
            data.currentFrame = $frame;
            me.___updated = false;
            me.___sheetRender = "still";
        },

        /**
         * 스프라이트시트 해당프레임부터 재생
         * @param $frame {number}
         */
        gotoAndPlay : function( $frame ) {
            var me = this;
            var data = me.data;
            data.startFrame = 1;
            data.endFrame = data.totalFrames;
            data.currentFrame = $frame - 1;
            if ( me.___sheetRender !== "start" ) {
                me.___updated = false;
                me.___sheetRender = "start";
            }
        },

        /**
         * 스프라이트시트 구간반복
         * @param $startFrame {number}
         * @param $endFrame {number}
         */
        gotoAndRepeat : function( $startFrame, $endFrame ) {
            var me = this;
            var data = me.data;
            data.startFrame = $startFrame;
            data.endFrame = $endFrame;
            data.currentFrame = $startFrame - 1;
            if ( me.___sheetRender !== "start" ) {
                me.___updated = false;
                me.___sheetRender = "start";
            }
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// view
var DkViewList = [];
var DkView;
( function() {
    var doc = document;
    var body = doc.body;
    var common = DkCommon;

    DkView = function() {
        var me = this;
        // 기본 데이터
        me.data = new DataElementF();
        // 자식
        me.children = [];
        // 업데이트 반영 여부
        me.___updated = false;
        // 뷰 모드
        me.mode = "Nothing";
        // 이벤트 리스트
        me.___eventList = {};

        // 뷰 리스트에 각 뷰를 포함시킨다.
        DkViewList.push( me );

        // 뷰 모드 별 스테이지 생성
        createStageDom.call( me );
        createStageCanvas.call( me );

        // 마우스 터치 좌표
        setMousePosition.call( me );
    };

    /**
     * DkView 기본 데이터
     */
    var DataElementF = function() {
        this.visible = "";
        this.x = 0;
        this.y = 0;
        this.width = 800;
        this.height = 600;
        this.backgroundColor = "";
        this.mouseX = 0;
        this.mouseY = 0;
        this.touchList;
    };

    /**
     * 돔 모드를 준비한다.
     */
    function createStageDom() {
        var me = this;
        if ( !me.___element ) {
            var element = document.createElement( "div" );
            var style = element.style;
            style.position = "absolute";
            style.display = "";
            style.margin = "0px";
            style.padding = "0px";
//            style.overflow = "hidden";
            style.perspective = 500;
            style[ DkDetector.prefixPerspective ] = 500;

            me.___element = element;
            me.___style = style;
            me.___element.___me = me;
            // body.appendChild( me.___element );
        }
    };

    /**
     * 캔버스 모드를 준비한다.
     */
    function createStageCanvas() {
        var me = this;
        // 캔버스 생성
    }

    /**
     * 마우스 터치 좌표
     */
    function setMousePosition() {
        var me = this;
        var data = me.data;

        // 도큐먼트 이벤트 리스너
        DkUtil.addEventListener( doc, "mousedown", mouseMove );
        DkUtil.addEventListener( doc, "mousemove", mouseMove );
        DkUtil.addEventListener( doc, "mouseup", mouseMove );

        /**
         * 도큐먼트 이벤트 핸들러
         * @param $e {event}
         */
        function mouseMove( $e ) {
            // view x, y 좌표
            var viewX = divX( me.___element );
            var viewY = divY( me.___element );

            var mouseX;
            var mouseY;
            if ( DkDetector.touchBool ) {
                mouseX = $e.touches[ 0 ].pageX - viewX;
                mouseY = $e.touches[ 0 ].pageY - viewY;

                var touchList = [];
                var leng = $e.touches.length;
                for ( var i = 0; i < leng; i++ ) {
                    var touch = $e.touches[ i ];
                    var obj = {
                        touchX : touch.pageX - viewX,
                        touchY : touch.pageY - viewY
                    }
                    touchList[ i ] = obj;
                }
                data.touchList = touchList;
            } else {
                // scroll 갭 체크
                var gapX = body.scrollLeft + doc.documentElement.scrollLeft;
                var gapY = body.scrollTop + doc.documentElement.scrollTop;

                mouseX = $e.clientX - viewX + gapX;
                mouseY = $e.clientY - viewY + gapY;
            }
            data.mouseX = mouseX;
            data.mouseY = mouseY;
        };

        function divX( obj ) {
            var result = obj.offsetLeft;
            if ( obj.offsetParent ) {
                result += divX( obj.offsetParent );
            }
            return result;
        };

        function divY( obj ) {
            var result = obj.offsetTop;
            if ( obj.offsetParent ) {
                result += divY( obj.offsetParent );
            }
            return result;
        };
    }

    /**
     * 프로토타입
     * @type {{set: Function, sets: Function, get: Function, addListener: Function, delListener: Function, start: Function, save: Function, load: Function, render: Function, renderNothing: Function, renderDom: Function, renderCanvas: Function}}
     */
    var proto = {
        // 데이터 입력
        set : common.set,
        sets : common.sets,
        // 데이터 출력
        get : common.get,
        // 이벤트 리스너
        addListener : common.addListener,
        delListener : common.delListener,

        /**
         * 뷰 모드 별 스타트
         * @param $mode {string}
         */
        start : function( $mode ) {
            var me = this;
            var style = me.___style;
            me.mode = $mode;

            // 모든 모드별 visible 감추기
            style.display = "none";

            if ( $mode == "Dom" ) {
                var data = me.data;
                style.width = data.width + "px";
                style.height = data.height + "px";
                style.backgroundColor = data.backgroundColor;
                data.display = "block";
                style.display = "block";
            } else if ( $mode == "Canvas" ) {

            }
        },

        save : function() {
        },
        load : function() {
        },

        /**
         * 뷰 렌더
         */
        render : function() {
            // 뷰 모드 별 render ( renderNothing, renderDom, renderCanvas )
            this[ "render" + this.mode ]();
        },

        /**
         * 렌더 없음
         */
        renderNothing : function() {
        },

        /**
         * 렌더 돔
         */
        renderDom : function() {
            var me = this;

            // prefix
            var detector = DkDetector;
            var detectorFilter = detector.prefixFilter;
            var detectorTransform = detector.prefixTransform;
            var detectorRender = detector.render;

            /**
             * 드로우 베이직 버전선택
             * @type {{drawOld: Function, drawModern: Function, drawModern3D: Function}}
             */
            var drawBasicFunc = { drawIeOld : drawBasicIeOld, drawTransform2D : drawBasicTransform2D, drawTransform3D : drawBasicTransform3D };
            var drawBasicF = drawBasicFunc[ "draw" + detectorRender ];

            /**
             * 드로우 스테이지
             */
            drawStage();
            function drawStage() {
                if ( !me.___updated ) {
                    var data = me.data;
                    var style = me.___style;

                    // visible
                    style.display = data.visible;

                    // position
                    style.left = data.x + "px";
                    style.top = data.y + "px";

                    // width, height
                    style.width = data.width + "px";
                    style.height = data.height + "px";

                    // backgroundColor
                    style.backgroundColor = data.backgroundColor;

                    data = null;
                    style = null;

                    me.___updated = true;
                }
            };

            drawCall( me.children );

            /**
             * 드로우콜
             * @param $children {array}
             */
            function drawCall( $children ) {
                /**
                 * 드로우 타입 설정
                 * @type {{sprite: Function, text: Function, bitmap: Function, video: Function, audio: Function, sheet: Function}}
                 */
                var drawType = { sprite : drawBasicF, text : drawBasicF, bitmap : drawBasicF, video : drawBasicF, audio : drawBasicF, sheet : drawSheet };
                var children = $children;
                var i = children.length;
                var leng = i;
                var model;

                // 업데이트 리스트를 정한다.
                while ( i-- ) {
                    model = children[ leng - 1 - i ];
                    if ( !model.___updated ) {
                        // 업데이트 완료
                        model.___updated = true;
                        // drawBasicF, drawSheet
                        drawType[ model.___type ]( model );
                    }

                    // 자식객체 렌더 추가
                    if ( model.children ) {
                        drawCall( model.children );
                    }
                }
            };

            //---------------------------------------------------------------------------------------------------------------------------------------------------//

            /**
             * 드로우 베이직 ie8 이하
             * @param $model {displayObject}
             */
            function drawBasicIeOld( $model ) {
                var model = $model;
                var data = model.data;
                var style = model.___style;

                // visible
                style.display = data.visible;

                // position
                style.left = data.x + "px";
                style.top = data.y + "px";

                // width, height
                style.width = data.width + "px";
                style.height = data.height + "px";

                // alpha
                /*var filterStr = "";
                 filterStr = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + data.alpha * 100 + ")";
                 style.prefixFilter = filterStr;
                 style[ detector_filter ] = filterStr;*/

                // backgroundColor
                style.backgroundColor = data.backgroundColor;
            };

            /**
             * 드로우 베이직 Transform2D
             * @param $model {displayObject}
             */
            function drawBasicTransform2D( $model ) {
                var model = $model;
                var data = model.data;
                var style = model.___style;

                // visible
                style.display = data.visible;

                // width, height
                style.width = data.width + "px";
                style.height = data.height + "px";

                // alpha
                style.opacity = data.alpha;

                // backgroundColor
                style.backgroundColor = data.backgroundColor;

                // position, scale, rotate
                var transformStr = "";
                transformStr = "translate(" + data.x + "px, " + data.y + "px)";
                transformStr += "rotate(" + data.rotate + "deg)";
                transformStr += "scale(" + data.scaleX + ", " + data.scaleY + ")";
                style.prefixTransform = transformStr;
                style[ detectorTransform ] = transformStr;
            };

            /**
             * 드로우 베이직 Transform3D
             * @param $model {displayObject}
             */
            function drawBasicTransform3D( $model ) {
                var model = $model;
                var data = model.data;
                var style = model.___style;

                // visible
                style.display = data.visible;

                // width, height
                style.width = data.width + "px";
                style.height = data.height + "px";

                // alpha
                style.opacity = data.alpha;

                // backgroundColor
                style.backgroundColor = data.backgroundColor;

                // position, scale, rotate
                var transformStr = "";
                transformStr = "translate3d(" + data.x + "px, " + data.y + "px, 0px )";
                transformStr += " rotate(" + data.rotate + "deg)";
                transformStr += " rotateX(" + data.rotateX + "deg)";
                transformStr += " rotateY(" + data.rotateY + "deg)";
                transformStr += " rotateZ(" + data.rotateZ + "deg)";
                transformStr += " scale(" + data.scaleX + ", " + data.scaleY + ")";
                style.prefixTransform = transformStr;
                style[ detectorTransform ] = transformStr;
            };

            /**
             * 드로우 시트
             * @param $model {displayObject}
             */
            function drawSheet( $model ) {
                var model = $model;
                var data = model.data;
                var style = model.___style;

                // 드로우 베이직
                drawBasicF( model );

                /**
                 * 스프라이트 렌더 함수
                 * @type {{start: Function, stop: Function, still: Function}}
                 */
                var renderFunc = { start : sheetStart, stop : sheetStop, still : sheetStill };
                renderFunc[ model.___sheetRender ]();

                /**
                 * 시트 시작
                 */
                function sheetStart() {
                    // 업데이트 완료취소
                    model.___updated = false;

                    var rate = model.___sheetRate++;
                    if ( rate % ( Dk.frameRate / data.frameRate ) < 1 ) {
                        goFrame();
                        data.currentFrame++;
                        if ( data.currentFrame > data.endFrame ) {
                            data.currentFrame = data.startFrame;
                        }
                    }
                };

                /**
                 * 시트 멈춤
                 */
                function sheetStop() {
                    // 업데이트 완료
                    model.___updated = true;
                };

                /**
                 * 시트 정지컷
                 */
                function sheetStill() {
                    model.___sheetRender = "stop";
                    goFrame();
                }

                /**
                 * 현재프레임으로 이동
                 */
                function goFrame() {
                    var sheetX = ( data.currentFrame - 1 ) % data.xNum * -data.width;
                    var sheetY = Math.floor( ( data.currentFrame - 1 ) / data.xNum ) * -data.height;
                    style.backgroundPosition = sheetX + "px " + sheetY + "px";
                }

            };
        },

        /**
         * 렌더 캔버스
         */
        renderCanvas : function() {
            var me = this;

            // 캔버스 세팅초기화
            resetCvsCtx();
            function resetCvsCtx() {
            };

            // 드로우콜
            drawCall();
            function drawCall() {
            };

            // 드로우 베이직
            function drawBasic() {
            };
        }
    };

    // 프로토타입 연결
    common.setPrototype( DkView, proto );

    // 디스플레이 컨테이너 프로토타입 연결
    common.setPrototype( DkView, DkDisplayContainer );
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkManagerMouseEvent
( function() {
    var doc = document;
    var util = DkUtil;

    // 도큐먼트 이벤트 리스너
    util.addEventListener( doc, "click", mouseFunc );
    util.addEventListener( doc, "mousedown", mouseFunc );
    util.addEventListener( doc, "mouseup", mouseFunc );
    util.addEventListener( doc, "mouseover", mouseFunc );
    util.addEventListener( doc, "mouseout", mouseFunc );
    util.addEventListener( doc, "mousemove", mouseFunc );

    /**
     * 도큐먼트 이벤트 핸들러
     * @param $e {event}
     */
    function mouseFunc( $e ) {
        cancelBubbling( $e );
        var target = getSource( $e );
        if ( target ) {
            var obj = {
                type : $e.type,
                currentTarget : target
            }
            dispatchEvent( obj );
        }
    };

    /**
     *
     * @param $e {event}
     */
    function cancelBubbling( $e ) {
        if ( $e.stopPropagation ) {
            cancelBubbling = function( $e ) {
                $e.stopPropagation();
            }
            cancelBubbling( $e );
        } else if ( window.event ) {
            cancelBubbling = function() {
                window.event.cancelBubble = true;
            }
            cancelBubbling();
        }
    }

    /**
     * 이벤트 타겟
     * @param $e {event}
     * @returns {displayObject}
     */
    function getSource( $e ) {
        if ( $e.target ) {
            getSource = function( $e ) {
                return $e.target.___me;
            };
            return $e.target.___me;
        } else if ( window.event ) {
            getSource = function( $e ) {
                return window.event.srcElement.___me;
            };
            return window.event.srcElement.___me;
        }
    };

    /**
     * 이벤트 발생
     * @param $eventObj {object}
     */
    function dispatchEvent( $eventObj ) {
        // $eventObj.type : $e.type,
        // $eventObj.currentTarget : target
        var target = $eventObj.currentTarget;
        if ( target.___eventList[ $eventObj.type ] ) {
            target.___eventList[ $eventObj.type ]( $eventObj );
        }
    }
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkManagerResize
var DkManagerResize;
( function() {
    var list = [];
    var total = 0;

    /**
     * 리사이즈 매니저
     * @type {{add: Function, del: Function, getList: Function}}
     */
    DkManagerResize = {
        /**
         * 리사이즈 발생 시 실행 할 함수를 추가합니다.
         * @param $key {string}
         * @param $func {function}
         */
        add : function( $key, $func ) {
            if ( list[ $key ] !== undefined ) {
                trace( "DK : " + "DkManagerResize list에 이미 " + $key + "값이 존재합니다." );
                return;
            } else {
                list[ $key ] = list.length;
                list[ list[ $key ] ] = {
                    key : $key,
                    handler : $func
                };

                total++;
                if ( total == 1 ) {
                    startUpdate();
                }
            }
        },

        /**
         * 리사이즈 매니저에서 함수 삭제
         * @param $key {string}
         */
        del : function( $key ) {
            if ( list[ $key ] === undefined ) {
                trace( "DK : " + "DkManagerResize list에 " + $key + "값이 존재하지 않습니다." );
                return;
            } else {
                var deleteIndex = list[ $key ];
                list.splice( list[ $key ], 1 );
                delete list[ $key ];
                for ( var key in list ) {
                    if ( list[ key ] >= deleteIndex ) {
                        list[ key ] -= 1;
                    }
                }

                total--;
                if ( total == 0 ) {
                    stopUpdate();
                }
            }
        },

        /**
         * 리사이즈 매니저 리스트를 반환합니다
         * @returns {array}
         */
        getList : function() {
            return list;
        }
    };

    /**
     * 리사이즈 업데이터
     * @param $e {event}
     */
    function update( $e ) {
        // $e : resize event
        // list[ i ].key : key
        var i = list.length;
        while ( i-- ) {
            list[ i ].handler( $e, list[ i ].key );
        }
    };

    /**
     * list 갯수가 하나 이상일 때 이벤트리스너 등록
     */
    function startUpdate() {
        DkUtil.addEventListener( window, "resize", update );
    };

    /**
     * list 갯수가 0일때 이벤트리스너 제거
     */
    function stopUpdate() {
        DkUtil.removeEventListener( window, "resize", update );
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkManagerWheel
var DkManagerWheel;
( function() {
    var list = [];
    var total = 0;
    // FF doesn't recognize mousewheel as of FF3.x
    var mouseWheelEvt = ( DkDetector.browser == "firefox" ) ? "DOMMouseScroll" : "mousewheel";

    /**
     * 휠 매니저
     * @type {{add: Function, del: Function, getList: Function}}
     */
    DkManagerWheel = {
        /**
         * 휠 발생 시 실행 할 함수를 추가합니다.
         * @param $key {string}
         * @param $func {function}
         */
        add : function( $key, $func ) {
            if ( list[ $key ] !== undefined ) {
                trace( "DK : " + "DkManagerWheel list에 이미 " + $key + "값이 존재합니다." );
                return;
            } else {
                list[ $key ] = list.length;
                list[ list[ $key ] ] = {
                    key : $key,
                    handler : $func
                };

                total++;
                if ( total == 1 ) {
                    startUpdate();
                }
            }
        },

        /**
         * 휠 매니저에서 함수 삭제
         * @param $key {string}
         */
        del : function( $key ) {
            if ( list[ $key ] === undefined ) {
                trace( "DK : " + "DkManagerWheel list에 " + $key + "값이 존재하지 않습니다." );
                return;
            } else {
                var deleteIndex = list[ $key ];
                list.splice( list[ $key ], 1 );
                delete list[ $key ];
                for ( var key in list ) {
                    if ( list[ key ] >= deleteIndex ) {
                        list[ key ] -= 1;
                    }
                }

                total--;
                if ( total == 0 ) {
                    stopUpdate();
                }
            }
        },

        /**
         * 휠 매니저 리스트를 반환합니다
         * @returns {array}
         */
        getList : function() {
            return list;
        }
    };

    /**
     * 휠 업데이터
     * @param $e {event}
     */
    function update( $e ) {
        // delta : 휠 값
        // e : wheel event
        // list[ i ].key : key
        var e = window.event || $e;
        var delta = e.detail ? e.detail * -30 : e.wheelDelta;
        var i = list.length;
        while ( i-- ) {
            list[ i ].handler( delta, e, list[ i ].key );
        }
    };

    /**
     * list 갯수가 하나 이상일 때 이벤트리스너 등록
     */
    function startUpdate() {
        DkUtil.addEventListener( document, mouseWheelEvt, update );

    };

    /**
     * list 갯수가 0일때 이벤트리스너 제거
     */
    function stopUpdate() {
        DkUtil.removeEventListener( document, mouseWheelEvt, update );
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkManagerKeyboard
var DkManagerKeyboard;
( function() {
    var list = [];
    var total = 0;

    /**
     * 키보드 매니저
     * @type {{add: Function, del: Function, getList: Function}}
     */
    DkManagerKeyboard = {
        /**
         * 키보드 발생 시 실행 할 함수를 추가합니다.
         * @param $key {string}
         * @param $func {function}
         */
        add : function( $key, $func ) {
            if ( list[ $key ] !== undefined ) {
                trace( "DK : " + "DkManagerKeyboard list에 이미 " + $key + "값이 존재합니다." );
                return;
            } else {
                list[ $key ] = list.length;
                list[ list[ $key ] ] = {
                    key : $key,
                    handler : $func
                };

                total++;
                if ( total == 1 ) {
                    startUpdate();
                }
            }
        },

        /**
         * 키보드 매니저에서 함수 삭제
         * @param $key {string}
         */
        del : function( $key ) {
            if ( list[ $key ] === undefined ) {
                trace( "DK : " + "DkManagerKeyboard list에 " + $key + "값이 존재하지 않습니다." );
                return;
            } else {
                var deleteIndex = list[ $key ];
                list.splice( list[ $key ], 1 );
                delete list[ $key ];
                for ( var key in list ) {
                    if ( list[ key ] >= deleteIndex ) {
                        list[ key ] -= 1;
                    }
                }

                total--;
                if ( total == 0 ) {
                    stopUpdate();
                }
            }
        },

        /**
         * 키보드 매니저 리스트를 반환합니다
         * @returns {array}
         */
        getList : function() {
            return list;
        }
    };

    /**
     * 키보드 업데이터
     * @param $e {event}
     */
    function update( $e ) {
        // $e.type : $e.type
        // $e.keyCode : $e.keyCode
        // $e : keyboard event
        // list[ i ].key : key
        var i = list.length;
        while ( i-- ) {
            list[ i ].handler( $e.type, $e.keyCode, $e, list[ i ].key );
        }
    };

    /**
     * list 갯수가 하나 이상일 때 이벤트리스너 등록
     */
    function startUpdate() {
        DkUtil.addEventListener( document, "keydown", update );
        DkUtil.addEventListener( document, "keyup", update );

    };

    /**
     * list 갯수가 0일때 이벤트리스너 제거
     */
    function stopUpdate() {
        DkUtil.removeEventListener( document, "keydown", update );
        DkUtil.removeEventListener( document, "keyup", update );
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkManagerLoop
var DkManagerLoop;
( function() {
    var list = [];

    /**
     * 루프 매니저
     * @type {{add: Function, del: Function, update: Function, getList: Function}}
     */
    DkManagerLoop = {
        /**
         * 매프레임마다 실행할 함수를 추가합니다.
         * @param $key {string}
         * @param $func {functin}
         */
        add : function( $key, $func ) {
            if ( list[ $key ] !== undefined ) {
                trace( "DK : " + "DkManagerLoop list에 이미 " + $key + "값이 존재합니다." );
                return;
            } else {
                list[ $key ] = list.length;
                list[ list[ $key ] ] = {
                    key : $key,
                    handler : $func
                };
            }
        },

        /**
         * 루프 매니저에서 함수 삭제
         * @param $key {string}
         */
        del : function( $key ) {
            if ( list[ $key ] === undefined ) {
                trace( "DK : " + "DkManagerLoop list에 " + $key + "값이 존재하지 않습니다." );
                return;
            } else {
                var deleteIndex = list[ $key ];
                list.splice( list[ $key ], 1 );
                delete list[ $key ];
                for ( var key in list ) {
                    if ( list[ key ] >= deleteIndex ) {
                        list[ key ] -= 1;
                    }
                }
            }
        },

        /**
         * 업데이터
         * -- 사용자는 사용하지 않습니다 --
         */
        update : function() {
            var i = list.length;
            while ( i-- ) {
                list[ i ].handler( list[ i ].key );
            }
        },

        /**
         * 루프 매니저 리스트를 반환합니다
         * @returns {array}
         */
        getList : function() {
            return list;
        }
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkRender
( function() {
    var stats;

    initStats();

    /**
     * Stats 생성
     */
    function initStats() {
        stats = new Stats();
        stats.setMode( 0 );
        stats.domElement.style.position = "fixed";
        stats.domElement.style.zIndex = 2;
        stats.domElement.style.left = "350px";
        document.body.appendChild( stats.domElement );
    };

    /**
     * 프레임 반복실행 함수
     */
    var render = function() {
        // stats
        if ( stats ) {
            stats.begin();
        }

        // 뷰 리스트에 각 뷰를 렌더링
        var i = DkViewList.length;
        while ( i-- ) {
            // 뷰 렌더 ( DkView.render / renderNothing, renderDom, renderCanvas )
            DkViewList[ i ].render();
        }

        // 매니저 루프 업데이트
        DkManagerLoop.update();

        // tween
        DkTween.update();
//        DkTween2.update();

        // stats
        if ( stats ) {
            stats.end();
        }
    };

    setInterval( render, 1000 / Dk.frameRate );
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkLoader
var DkLoader;
( function() {
    var util = DkUtil;
    var assetList = {};

    /**
     * 로더
     * @type {{js: Function, asset: Function, ajax: Function, xmlParser: Function}}
     */
    DkLoader = {

        /**
         * js 파일 로드
         * @param $jsArr {array}
         * @param $jsCallBack {function}
         */
        js : function( $jsArr, $jsCallBack ) {
            var head = document.getElementsByTagName( "head" )[ 0 ];
            var script;
            var jsLoadCount = 0;
            var jsArr = $jsArr;
            var jsTotalNum = jsArr.length;
            var jsCallBackF;

            if ( $jsCallBack && DkUtil.is( "function", $jsCallBack ) ) {
                jsCallBackF = $jsCallBack;
            } else {
                jsCallBackF = null;
            }

            loadJs( jsArr[ jsLoadCount ], loadJsComplete );

            /**
             * js 개별 파일 로드
             * @param $url {string}
             * @param $jsCallBack {function}
             */
            function loadJs( $url, $jsCallBack ) {
                script = document.createElement( "script" );
                script.type = "text/javascript";
                script.charset = "utf-8";

                if ( window.addEventListener ) {
                    script.onload = function() {
                        // TODO 버그테스트
                        $jsCallBack();
                    }
                } else {
                    script.onreadystatechange = function() {
                        if ( this.readyState == "loaded" || this.readyState == "complete" ) {
                            this.onreadystatechange = null;
                            $jsCallBack();
                        }
                    }
                }
                script.src = $url;
                head.appendChild( script );
            };

            /**
             * js 개별 로드 완료
             */
            function loadJsComplete() {
                jsLoadCount++;
                head.removeChild( script );
                script = null;
                if ( jsLoadCount == jsTotalNum ) {
                    loadJsAllComplete();
                } else {
                    loadJs( jsArr[ jsLoadCount ], loadJsComplete );
                }
            };

            /**
             * js 전체 로드 완료
             */
            function loadJsAllComplete() {
                trace( "DK : " + jsArr );
                trace( "DK : " + "DkLoader js : 로드완료" );
                if ( jsCallBackF ) {
                    jsCallBackF();
                }
            };
        },

        /**
         * asset 파일 로드
         * @param $assetArr {array}
         * @param $complete {function}
         */
        asset : function( $assetArr, $complete, $progress ) {
            var list = assetList;
            var leng = $assetArr.length;
            var count = 0;

            for ( var i = 0; i < leng; i++ ) {
                imgLoad( $assetArr[ i ].url, imgLoadComplete, $assetArr[ i ].linkage );
            }

            /**
             * asset 개별 파일 로드
             * @param $url {string}
             * @param $imgLoadComplete {function}
             * @param $linkage {string}
             */
            function imgLoad( $url, $imgLoadComplete, $linkage ) {
                var img = document.createElement( "img" );
                img.src = $url;

                // 로드완료
                util.onLoad( img, onComplete );
                function onComplete() {
                    $imgLoadComplete( img, $linkage );
                }
            }

            /**
             * asset 개별 로드 완료
             * @param $img {element}
             * @param $linkage {string}
             */
            function imgLoadComplete( $img, $linkage ) {
                if ( list[ $linkage ] ) {
                    trace( "DK : " + "assetKeyList에 이미 " + $linkage + "값이 존재합니다." );
                    throw new Error( "assetKeyList에 이미 " + $linkage + "값이 존재합니다." );
                    return;
                } else {
                    list[ $linkage ] = $img.src;
                }

                count++;
                if ( $progress ) {
                    trace( "DK : " + "asset loading : " + count / leng * 100 + "%" );
                    $progress( count / leng );
                }
                if ( count == leng ) {
                    trace( "DK : " + "asset load complete" );
                    $complete( list );
                }
            }
        },

        /**
         * ajax 로드
         * @param $obj {object}
         */
        ajax : function( $obj ) {
            var url = $obj.url;
            var dataType = $obj.dataType || "xml";
            var completeF = $obj.complete;
            var type = $obj.type || "GET";
            var postParam = $obj.postParam;
            var errorF = $obj.error;
            var cache = true;
            if ( $obj.cache == false ) {
                cache = false
            }

            // XMLHttpRequest 생성
            var req = getXHR();

            // XMLHttpRequest 상태변화
            req.onreadystatechange = function() {
                if ( req.readyState == 4 ) {
                    // 통신 완료 시
                    if ( req.status == 200 ) {
                        // 통신 성공 시
                        trace( "DK : " + url + ", 통신 완료" );
                        var data;
                        if ( dataType == "xml" ) {
                            data = req.responseXML;
                        } else if ( dataType == "json" ) {
                            data = eval( "(" + req.responseText + ")" );
                        } else if ( dataType == "text" ) {
                            data = req.responseText;
                        }
                        completeF( data );
                    } else {
                        // 통신 실패 시
                        trace( "DK : " + url + ", " + req.status + ", 서버 에러가 발생하였습니다." );
                        if ( errorF ) {
                            errorF();
                        }
                    }
                } else {
                    // 통신 완료 전
                    trace( "DK : " + url + ", 통신 중.." );
                }
            };

            // XMLHttpRequest 연결
            req.open( type, url, true );

            // 캐시 사용여부
            if ( !cache ) {
                var d = new Date( 1970, 0, 1 );
                req.setRequestHeader( "If-Modified-Since", d.toGMTString() );
            }

            if ( type == "GET" ) {
                req.send( null );
            } else if ( type == "POST" ) {
                // TODO post 서버 405, 로컬 500 에러남
                req.setRequestHeader( "Content-type", "application/x-www-form-urlencoded; charset=UTF-8" );
                req.send( postParam );
                // encodeURIComponent
            }
        },

        /**
         * xml 파서
         * @param $xml
         * @returns {object}
         */
        xmlParser : function( $xml ) {
            var data = $xml;
            var result = {};
            var rootChildNodes = data.childNodes;

            // 1 ELEMENT_NODE
            // 2 ATTRIBUTE_NODE
            // 3 TEXT_NODE
            // 4 CDATA_SECTION_NODE
            // 5 ENTITY_REFERENCE_NODE
            // 6 ENTITY_NODE
            // 7 PROCESSING_INSTRUCTION_NODE
            // 8 COMMENT_NODE
            // 9 DOCUMENT_NODE
            // 10 DOCUMENT_TYPE_NODE
            // 11 DOCUMENT_FRAGMENT_NODE
            // 12 NOTATION_NODE

            // 최종 xml 오브젝트객체
            var resultXmlObj = {};
            parse( rootChildNodes, resultXmlObj );

            // 파싱함수
            function parse( $childNodes, $result ) {
                var childNodes = $childNodes;
                var node;

                for ( var i = 0; i < childNodes.length; i++ ) {
                    node = childNodes[ i ];
                    var type = node.nodeType;
                    // 엘리먼트 노드파싱
                    if ( type == 1 ) {
                        var t = node.tagName;
                        // 속성 먼저파싱
                        var result = parseAttributes( node );
                        // 엘리먼트노드가 몇개있는지파악해서 오브젝트에 적용
                        var checkLength = function( result ) {
                            var num = 0;
                            for ( var i = 0; i < node.childNodes.length; i++ ) {
                                if ( node.childNodes[ i ].nodeType == 1 ) {
                                    num++;
                                }
                                result.length = num;
                            }
                        }
                        checkLength( result );
                        // 결과 Obj 만들기
                        if ( $result[ t ] == undefined ) {
                            $result[ t ] = result;
                        } else {
                            if ( $result[ t ].concat == undefined ) {
                                var preObj = $result[ t ];

                                $result[ t ] = [ ];
                                $result[ t ].push( preObj );
                            }
                            $result[ t ].push( result );
                        }
                    } else if ( type == 3 || type == 4 ) {
                        // 공백제거
                        var txt = trim( node.nodeValue );
                        if ( type == 4 ) {
                            // rcTrace( txt );
                        }
                        // 텍스트노드파싱
                        if ( txt == "" ) {
                        } else {
                            $result[ "text" ] = txt;
                        }

                    }
                    // 서브파싱
                    parse( node.childNodes, result );
                }
            };

            // 공백짜르기
            function trim( $text ) {
                return $text.replace( /^\s+|\s+$/g, '' );
            };

            // 속성 해석
            function parseAttributes( $node ) {
                var result = { };
                var property, i, j;
                property = $node.attributes;
                if ( property ) {
                    for ( i = 0, j = property.length; i < j; i++ ) {
                        // rcTrace( "attr : " + node.tagName + "." + attr[i].name + "=" + attr[i].value );
                        result[ '@' + property[ i ].name ] = property[ i ].value;
                    }
                }
                return result;
            };

            return resultXmlObj;
        }
    };

    /**
     * XMLHttpRequest 생성
     * @returns {XMLHttpRequest}
     */
    function getXHR() {
        var req;
        try {
            // ie7 이후, 그외
            req = new XMLHttpRequest();
        } catch ( $e ) {
            try {
                // ie6
                req = new ActiveXObject( "Msxml2.XMLHTTP" );
            } catch ( $e ) {
                // ie5.5 이하
                req = new ActiveXObject( "Microsoft.XMLHTTP" );
            }
        }
        getXHR = function() {
            return req;
        }
        return req;
    };
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkTween
var DkTween;
var DkLinear, DkQuad, DkCubic, DkQuart, DkQuint, DkSine, DkExpo, DkCirc, DkElastic, DkBack, DkBounce;
( function() {
    var list = [];
    var delayList = [];
    var dateNowF = Date.now;

    DkTween = {
        to : function( $target, $duration, $property, $ease, $option ) {
            // 딜레이
            var isDelay = ( $option && $option.delay ) ? true : false;
            if ( isDelay ) {
                var delayObj = {
                    startTime : dateNowF() + $option.delay * 1000,
                    $target : $target,
                    $duration : $duration,
                    $property : $property,
                    $ease : $ease,
                    $option : $option
                }
                delayList.push( delayObj );
                return;
            }

            // 기존 리스트에 타겟, 속성 유무 체크
            var equalResult = equalCheck( $target, $property );
            if ( equalResult ) {
                // 프로퍼티 제거 후 새로생성
                var targetId = equalResult.targetId;
                var equalTweenArr = list[ targetId ];
                setTweenObj( equalTweenArr, $property );
            } else {
                // 리스트 추가 후 프로퍼티 생성
                var tweenArr = [];
                tweenArr[ 0 ] = $target;
                setTweenObj( tweenArr, $property );
                list.push( tweenArr );
            }

            // 기존 리스트 타겟 체크
            function equalCheck( $target, $property ) {
                var result = {};
                var i = list.length;
                while ( i-- ) {
                    // 타겟이 있을때
                    if ( list[ i ][ 0 ] === $target ) {
                        result.targetId = i;
                        // 프로퍼티 순환
                        for ( var key in $property ) {
                            // 트윈 오브젝트 프로퍼티 제거
                            var j = list[ i ].length - 1;
                            while ( j-- ) {
                                if ( list[ i ][ j + 1 ].property == key ) {
                                    list[ i ].splice( j + 1, 1 );
                                }
                            }
                        }
                        return result;
                    }
                }
                return false;
            };

            // 트윈 오브젝트 생성
            function setTweenObj( $arr, $property ) {
                var isFirst = true;
                for ( var key in $property ) {
                    var tweenObj = {
                        property : key,
                        value : $property[ key ],
                        begin : $target.get( key ),
                        finish : $property[ key ],
                        change : $property[ key ] - $target.get( key ),
                        startTime : dateNowF(),
                        duration : $duration,
                        ease : $ease || DkLinear.easeNone
                    }

                    // 한번 실행
                    if ( isFirst ) {
                        if ( $option && $option.onComplete ) {
                            tweenObj.onComplete = $option.onComplete;
                            tweenObj.onCompleteParams = $option.onCompleteParams;
                        } else {
                            tweenObj.onComplete = function() {
                            };
                        }
                        isFirst = false;
                    } else {
                        tweenObj.onComplete = function() {
                        };
                    }

                    $arr.push( tweenObj );
                }
            };
        },

        update : function() {
            var currentTime = dateNowF();
            var deleteArr = [];

            var i = list.length;
            while ( i-- ) {
                var tweenArr = list[ i ];
                var target = tweenArr[ 0 ];

                var leng = tweenArr.length - 1;
                var j = leng;
                while ( j-- ) {
                    var id = leng - j;
                    var tweenObj = tweenArr[ id ];
                    var time = ( currentTime - tweenObj.startTime ) / 1000;
                    var duration = tweenObj.duration;
                    if ( time < 0 ) {
                    } else if ( time < duration ) {
                        // 진행
                        target.set( tweenObj.property, tweenObj.ease( time, tweenObj.begin, tweenObj.change, duration ) );
                    } else {
                        // 완료
                        target.set( tweenObj.property, tweenObj.finish );
                        deleteArr.push( [ i, id ] );
                        // 완료 함수 실행
                        setTimeout( tweenObj.onComplete, 0, tweenObj.onCompleteParams )
                    }
                }
            }

            // 트윈 완료 리스트 프로퍼티 제거
            delTweenObj();
            function delTweenObj() {
                var i = deleteArr.length;
                while ( i-- ) {
                    var delI = deleteArr[ i ][ 0 ];
                    var delJ = deleteArr[ i ][ 1 ];
                    list[ delI ].splice( delJ, 1 );
                }
            };

            // 트윈 완료 리스트 제거
            delTweenArr();
            function delTweenArr() {
                var i = list.length;
                while ( i-- ) {
                    if ( list[ i ].length == 1 ) {
                        list.splice( i, 1 );
                    }
                }
            };

            // 딜레이
            delayUpdate();
            function delayUpdate() {
                var i = delayList.length;
                while ( i-- ) {
                    var delayObj = delayList[ i ];
                    var time = currentTime - delayObj.startTime;
                    if ( time > 0 ) {
                        delayList.splice( i, 1 );
                        var option = delayObj.$option;
                        delete option[ "delay" ];
                        DkTween.to( delayObj.$target, 1, delayObj.$property, delayObj.$ease, option );
                    }
                }
            }
        },

        killTweenOf : function( $target ) {
            var i = list.length;
            while ( i-- ) {
                // 타겟이 있을때
                if ( list[ i ][ 0 ] === $target ) {
                    list.splice( i, 1 );
                    break;
                }
            }

            var j = delayList.length;
            while ( j-- ) {
                // 타겟이 있을때
                if ( delayList[ j ].$target === $target ) {
                    delayList.splice( j, 1 );
                }
            }
        }
    };

    //------------------------------------------------------------------------------------------------------------------------------------//

    ( function() {
        DkLinear = {
            easeNone : function( t, b, c, d ) {
                return b + c * t / d;
            }
        }

        DkQuad = {
            easeIn : function( t, b, c, d ) {
                return c * ( t /= d ) * t + b;
            },
            easeOut : function( t, b, c, d ) {
                return -c * ( t /= d ) * ( t - 2 ) + b;
            },
            easeInOut : function( t, b, c, d ) {
                if ( ( t /= d / 2 ) < 1 ) {
                    return c / 2 * t * t + b;
                }
                return -c / 2 * ( ( --t ) * ( t - 2 ) - 1 ) + b;
            }
        }

        DkCubic = {
            easeIn : function( t, b, c, d ) {
                return c * ( t /= d ) * t * t + b;
            },
            easeOut : function( t, b, c, d ) {
                return c * ( ( t = t / d - 1 ) * t * t + 1 ) + b;
            },
            easeInOut : function( t, b, c, d ) {
                if ( ( t /= d / 2 ) < 1 ) {
                    return c / 2 * t * t * t + b;
                }
                return c / 2 * ( ( t -= 2 ) * t * t + 2 ) + b;
            }
        }

        DkQuart = {
            easeIn : function( t, b, c, d ) {
                return c * ( t /= d ) * t * t * t + b;
            },
            easeOut : function( t, b, c, d ) {
                return -c * ( ( t = t / d - 1 ) * t * t * t - 1 ) + b;
            },
            easeInOut : function( t, b, c, d ) {
                if ( ( t /= d / 2 ) < 1 ) {
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ( ( t -= 2 ) * t * t * t - 2 ) + b;
            }
        }

        DkQuint = {
            easeIn : function( t, b, c, d ) {
                return c * ( t /= d ) * t * t * t * t + b;
            },
            easeOut : function( t, b, c, d ) {
                return c * ( ( t = t / d - 1 ) * t * t * t * t + 1 ) + b;
            },
            easeInOut : function( t, b, c, d ) {
                if ( ( t /= d / 2 ) < 1 ) {
                    return c / 2 * t * t * t * t * t + b;
                }
                return c / 2 * ( ( t -= 2 ) * t * t * t * t + 2 ) + b;
            }
        }

        DkSine = {
            easeIn : function( t, b, c, d ) {
                return -c * Math.cos( t / d * ( Math.PI / 2 ) ) + c + b;
            },
            easeOut : function( t, b, c, d ) {
                return c * Math.sin( t / d * ( Math.PI / 2 ) ) + b;
            },
            easeInOut : function( t, b, c, d ) {
                return -c / 2 * ( Math.cos( Math.PI * t / d ) - 1 ) + b;
            }
        }

        DkExpo = {
            easeIn : function( t, b, c, d ) {
                return ( t == 0 ) ? b : c * Math.pow( 2, 10 * ( t / d - 1 ) ) + b;
            },
            easeOut : function( t, b, c, d ) {
                return ( t == d ) ? b + c : c * ( -Math.pow( 2, -10 * t / d ) + 1 ) + b;
            },
            easeInOut : function( t, b, c, d ) {
                if ( t == 0 ) {
                    return b;
                }
                if ( t == d ) {
                    return b + c;
                }
                if ( ( t /= d / 2 ) < 1 ) {
                    return c / 2 * Math.pow( 2, 10 * ( t - 1 ) ) + b;
                }
                return c / 2 * ( -Math.pow( 2, -10 * --t ) + 2 ) + b;
            }
        }

        DkCirc = {
            easeIn : function( t, b, c, d ) {
                return -c * ( Math.sqrt( 1 - ( t /= d ) * t ) - 1 ) + b;
            },
            easeOut : function( t, b, c, d ) {
                return c * Math.sqrt( 1 - ( t = t / d - 1 ) * t ) + b;
            },
            easeInOut : function( t, b, c, d ) {
                if ( ( t /= d / 2 ) < 1 ) {
                    return -c / 2 * ( Math.sqrt( 1 - t * t ) - 1 ) + b;
                }
                return c / 2 * ( Math.sqrt( 1 - ( t -= 2 ) * t ) + 1 ) + b;
            }
        }

        DkElastic = {
            easeIn : function( t, b, c, d ) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if ( t == 0 ) {
                    return b;
                }
                if ( ( t /= d ) == 1 ) {
                    return b + c;
                }
                if ( !p ) {
                    p = d * .3;
                }
                if ( a < Math.abs( c ) ) {
                    a = c;
                    var s = p / 4;
                } else {
                    var s = p / ( 2 * Math.PI ) * Math.asin( c / a );
                }
                return -( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
            },
            easeOut : function( t, b, c, d ) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if ( t == 0 ) {
                    return b;
                }
                if ( ( t /= d ) == 1 ) {
                    return b + c;
                }
                if ( !p ) {
                    p = d * .3;
                }
                if ( a < Math.abs( c ) ) {
                    a = c;
                    var s = p / 4;
                } else {
                    var s = p / ( 2 * Math.PI ) * Math.asin( c / a );
                }
                return a * Math.pow( 2, -10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) + c + b;
            },
            easeInOut : function( t, b, c, d ) {
                var s = 1.70158;
                var p = 0;
                var a = c;
                if ( t == 0 ) {
                    return b;
                }
                if ( ( t /= d / 2 ) == 2 ) {
                    return b + c;
                }
                if ( !p ) {
                    p = d * ( .3 * 1.5 );
                }
                if ( a < Math.abs( c ) ) {
                    a = c;
                    var s = p / 4;
                } else {
                    var s = p / ( 2 * Math.PI ) * Math.asin( c / a );
                }
                if ( t < 1 ) {
                    return -.5 * ( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
                }
                return a * Math.pow( 2, -10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) * .5 + c + b;
            }
        }

        DkBack = {
            easeIn : function( t, b, c, d ) {
                if ( s == undefined ) {
                    s = 1.70158;
                }
                return c * ( t /= d ) * t * ( ( s + 1 ) * t - s ) + b;
            },
            easeOut : function( t, b, c, d ) {
                if ( s == undefined ) {
                    s = 1.70158;
                }
                return c * ( ( t = t / d - 1 ) * t * ( ( s + 1 ) * t + s ) + 1 ) + b;
            },
            easeInOut : function( t, b, c, d ) {
                if ( s == undefined ) {
                    s = 1.70158;
                }
                if ( ( t /= d / 2 ) < 1 ) {
                    return c / 2 * ( t * t * ( ( ( s *= ( 1.525 ) ) + 1 ) * t - s ) ) + b;
                }
                return c / 2 * ( ( t -= 2 ) * t * ( ( ( s *= ( 1.525 ) ) + 1 ) * t + s ) + 2 ) + b;
            }
        }

        DkBounce = {
            easeIn : function( t, b, c, d ) {
                return c - DkBounce.easeOut( d - t, 0, c, d ) + b;
            },
            easeOut : function( t, b, c, d ) {
                if ( ( t /= d ) < ( 1 / 2.75 ) ) {
                    return c * ( 7.5625 * t * t ) + b;
                } else if ( t < ( 2 / 2.75 ) ) {
                    return c * ( 7.5625 * ( t -= ( 1.5 / 2.75 ) ) * t + .75 ) + b;
                } else if ( t < ( 2.5 / 2.75 ) ) {
                    return c * ( 7.5625 * ( t -= ( 2.25 / 2.75 ) ) * t + .9375 ) + b;
                } else {
                    return c * ( 7.5625 * ( t -= ( 2.625 / 2.75 ) ) * t + .984375 ) + b;
                }
            },
            easeInOut : function( t, b, c, d ) {
                if ( t < d / 2 ) {
                    return DkBounce.easeIn( t * 2, 0, c, d ) * .5 + b;
                }
                return DkBounce.easeOut( t * 2 - d, 0, c, d ) * .5 + c * .5 + b;
            }
        }
    }() );
}() );

//----------------------------------------------------------------------------------------------------------------------------------------------//
// DkTween2
var DkTween2;
//var DkLinear, DkQuad, DkCubic, DkQuart, DkQuint, DkSine, DkExpo, DkCirc, DkElastic, DkBack, DkBounce;
( function() {
    var list = [];

    DkTween2 = {
        to : function( $target, $duration, $property, $ease, $option ) {
        },

        update : function() {
        },


        killTweenOf : function( $target ) {
        }
    };

}() );