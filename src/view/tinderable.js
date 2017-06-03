import React from "react";
import ReactDOM from "react-dom";
import Hammer from "hammerjs";
import merge from "merge";
import classnames from "classnames";

class Card extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initialPosition: {
                x: 0,
                y: 0,
            },
        }
    }

    setInitialPosition() {
        var screen = document.getElementById("root"),
            card = ReactDOM.findDOMNode(this),

            initialPosition = {
                x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
                y: Math.round((screen.offsetHeight - card.offsetHeight) / 2)
            };

        this.setState({
            initialPosition: initialPosition
        });
    }

    componentDidMount() {
        this.setInitialPosition();

        window.addEventListener("resize", this.setInitialPosition);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.setInitialPosition);
    }

    render() {
        var initialTranslate = "".concat(
            "translate3d(",
            this.state.initialPosition.x + "px,",
            this.state.initialPosition.y + "px,",
            "0px)"
        );

        var style = merge({
            msTransform: initialTranslate,
            WebkitTransform: initialTranslate,
            transform: initialTranslate,
            zIndex: this.props.index,
            width: "90%",
            height: "90%",
            backgroundImage: "url(\"" + this.props.image + "\")",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
        }, this.props.style);

        var classes = classnames({
            card: true,
        }, this.props.classes);

        return (
            <div style={style} className={classes}>
                <h1>{this.props.title}</h1>
            </div>
        );
    }
}

const draggableCardInitialState = {
    x: 0,
    y: 0,
    initialPosition: {
        x: 0,
        y: 0
    },
    startPosition: {
        x: 0,
        y: 0
    },
    animation: null,
};

class DraggableCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = draggableCardInitialState;

        this.panHandlers = {
            panstart: function() {
                this.setState({
                    animation: false,
                    startPosition: {
                        x: this.state.x,
                        y: this.state.y
                    }
                });
            },
            panend: function(ev) {
                var screen = document.getElementById("root"),
                    card = ReactDOM.findDOMNode(this);

                if (this.state.y > 350) {
                    this.props.onOutScreenBottom(this.props.cardId);
                } else if (this.state.x < -50) {
                    this.props.onOutScreenLeft(this.props.cardId);
                } else if ((this.state.x + (card.offsetWidth - 50)) > screen.offsetWidth) {
                    this.props.onOutScreenRight(this.props.cardId);
                } else {
                    this.resetPosition();
                    this.setState({
                        animation: true
                    });
                }
            },
            panmove: function(ev) {
                this.setState(this.calculatePosition(
                    ev.deltaX, ev.deltaY
                ));
            },
            pancancel: function(ev) {
                console.log(ev.type);
            },
        };
    }

    resetPosition = () => {
        var screen = document.getElementById("root"),
            card = ReactDOM.findDOMNode(this);

        var initialPosition = {
            x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
            y: Math.round((screen.offsetHeight - card.offsetHeight) / 2)
        };

        var initialState = draggableCardInitialState;
        this.setState(
            {
                x: initialPosition.x,
                y: initialPosition.y,
                initialPosition: initialPosition,
                startPosition: initialState.startPosition
            }
        );
    }

    handlePan = (ev) => {
        ev.preventDefault();
        this.panHandlers[ev.type].call(this, ev);
        return false;
    }

    handleSwipe = (ev) => {
        console.log(ev.type);
    }

    calculatePosition(deltaX, deltaY) {
        return {
            x: (this.state.initialPosition.x + deltaX),
            y: (this.state.initialPosition.y + deltaY)
        };
    }

    componentDidMount() {
        this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this));
        this.hammer.add(new Hammer.Pan({threshold: 0}));

        var events = [
            ["panstart panend pancancel panmove", this.handlePan],
            ["swipestart swipeend swipecancel swipemove",
             this.handleSwipe]
        ];

        events.forEach(function(data) {
            if (data[0] && data[1]) {
                this.hammer.on(data[0], data[1]);
            }
        }, this);

        this.resetPosition();
        window.addEventListener("resize", this.resetPosition);
    }

    componentWillUnmount() {
	this.hammer.stop();
	this.hammer.destroy();
	this.hammer = null;

        window.removeEventListener("resize", this.resetPosition);
    }

    render() {
        var translate = "".concat(
            "translate3d(",
            this.state.x + "px,",
            this.state.y + "px,",
            "0px)"
        );

        var style = {
            msTransform: translate,
            WebkitTransform: translate,
            transform: translate
        };

        var classes = {
            animate: this.state.animation
        };

        return (<Card {...this.props}
                      style={style}
                      classes={classes}></Card>);
    }
}

class Tinderable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: this.props.initialCardsData,
        };
    }

    removeCard(side, cardId) {
        setTimeout(function(){
            if (side === "left") {
                this.props.onSwipeLeft();
            } else if (side === "right") {
                this.props.onSwipeRight();
            } else if (side === "bottom") {
                this.props.onSwipeBottom();
            }
        }.bind(this), 0);

        this.setState({
            cards: this.state.cards.filter(function(c) {
                return c.id !== cardId;
            }),
        });
    }

    render() {
        var cards = this.state.cards.map(function(c, index, coll) {
            var props = {
                cardId: c.id,
                index: index,
                onOutScreenLeft: this.removeCard.bind(this, "left"),
                onOutScreenRight: this.removeCard.bind(this, "right"),
                onOutScreenBottom: this.removeCard.bind(this, "bottom"),
                title: c.title,
                text: c.text,
                image: c.image,
                key: c.id,
            };

            var component = (index === 0) ?
                            DraggableCard:
                            Card;

            return React.createElement(component, props);
        }, this);

        return (
            <div id="cards">
                {cards}
            </div>
        );
    }
}

export default Tinderable;
