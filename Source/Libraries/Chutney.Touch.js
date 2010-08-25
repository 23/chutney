// * Touch handler
Chutney.Library.Touch = function ($ATarget, AOptions) {
    this.Target = $ATarget[0];

    var _self = this;

    // Assign local events
    if (AOptions != undefined) {
        this.TargetDragStart = (AOptions.DragStart == undefined ? function () { } : AOptions.DragStart);
        this.TargetDragMove = (AOptions.DragMove == undefined ? function () { } : AOptions.DragMove);
        this.TargetDragEnd = (AOptions.DragEnd == undefined ? function () { } : AOptions.DragEnd);
    }
    else this.TargetDragStart = this.TargetDragMove = this.TargetDragEnd = function () { };

    // Setup event listening
    var TouchAvailable = ('ontouchstart' in window);

    this.Target.addEventListener(TouchAvailable ? 'touchstart' : 'mousedown', function (Event) { return _self.TouchStart(Event); }, false);
    this.Target.addEventListener(TouchAvailable ? 'touchmove' : 'mousemove', function (Event) { return _self.TouchMove(Event); }, true);
    this.Target.addEventListener(TouchAvailable ? 'touchend' : 'mouseup', function (Event) { return _self.TouchEnd(Event); }, false);
    this.Target.addEventListener('click', function (Event) { return _self.TouchClick(Event); }, true);
    this.Target.addEventListener(TouchAvailable ? 'touchcancel' : 'mouseout', function (Event) { return _self.TouchCancel(Event); }, false);

    // Setup touch listening
    this.TouchDragging = false;
    this.TouchHasMoved = false;
    this.TouchStartX = 0;
    this.TouchStartY = 0;
    this.TouchLatestX = 0;
    this.TouchLatestY = 0;

    this.TouchStart = function (Event) {
        this.TouchDragging = true;
        this.TouchHasMoved = false;

        this.TouchStartX = this.TouchLatestX = (TouchAvailable ? Event.changedTouches[0].pageX : Event.pageX);
        this.TouchStartY = this.TouchLatestY = (TouchAvailable ? Event.changedTouches[0].pageY : Event.pageY);

        this.TargetDragStart();

        return false;
    }

    this.TouchMove = function (Event) {
        if (!this.TouchDragging) return false;

        this.TouchHasMoved = true;

        this.TouchLatestX = (TouchAvailable ? Event.changedTouches[0].pageX : Event.pageX);
        this.TouchLatestY = (TouchAvailable ? Event.changedTouches[0].pageY : Event.pageY);

        var TouchDeltaX = this.TouchLatestX - this.TouchStartX;
        var TouchDeltaY = this.TouchLatestY - this.TouchStartY;

        this.TargetDragMove(TouchDeltaX, TouchDeltaY);

        Event.preventDefault();
        Event.stopPropagation();

        return false;
    }

    this.TouchClick = function (Event) {
        if (this.TouchHasMoved) { Event.stopPropagation(); return false; }
    }

    this.TouchEnd = function (Event) {
        if (this.TouchHasMoved) { Event.stopPropagation(); }
        Event.cancel = true;

        this.TouchDragging = false;

        var TouchDeltaX = (TouchAvailable ? Event.changedTouches[0].pageX : Event.pageX) - this.TouchStartX;
        var TouchDeltaY = (TouchAvailable ? Event.changedTouches[0].pageY : Event.pageY) - this.TouchStartY;

        this.TargetDragEnd(TouchDeltaX, TouchDeltaY);

        return false;
    }

    this.TouchCancel = function (Event) {
        if (!this.TouchDragging) return false;

        var ToElement = Event.relatedTarget;
        while (ToElement) {
            if (ToElement == this.Target) return;
            ToElement = ToElement.parentNode;
        }

        this.TouchDragging = false;

        var TouchDeltaX = (TouchAvailable ? Event.changedTouches[0].pageX : Event.pageX) - this.TouchStartX;
        var TouchDeltaY = (TouchAvailable ? Event.changedTouches[0].pageY : Event.pageY) - this.TouchStartY;

        this.TargetDragEnd(TouchDeltaX, TouchDeltaY);

        return false;
    }
}