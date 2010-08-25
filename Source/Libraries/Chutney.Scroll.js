// * Scroller
Chutney.Library.Scroller = function (ASection, $AContainer) {
    var _self = this;

    var Section = ASection;
    var $Container = $AContainer;

    // Create a scroll object
    this.ScrollbarContainer = document.createElement('aside');
    this.ScrollbarContainer.className = 'scrollbar';
    this.Scrollbar = document.createElement('meter');
    this.Scrollbar.className = 'hidden';
    this.$Scrollbar = $(this.Scrollbar);
    this.ScrollbarContainer.appendChild(this.Scrollbar);
    this.$ScrollbarContainer = $(this.ScrollbarContainer);
    Section.$Controller.append(this.ScrollbarContainer);
    this.ScrollbarStyle = this.$Scrollbar[0].style;

    this.ScrollbarTop = 0;
    this.ScrollbarBottom = 0;
    this.ScrollbarHeight = 0;
    this.ScrollbarPosition = 0;
    this.ScrollbarSpan = 0;
    this.ScrollbarTimeout = null;
    this.IsSmall = false;

    // Add a touch listener
    this.ScrollPos = 0;
    this.ScrollMomentum = [];
    this.ScrollMomentumPeriod = 400;
    this.ScrollBounceBack = undefined;
    this.ContainerStyle = $Container[0].style;

    this.ShowScrollbar = function () {
        if (this.ScrollbarTimeout != null) {
            clearTimeout(this.ScrollbarTimeout);
            this.ScrollbarTimeout = null;
        }

        // Calculate scrollbar parameters
        this.ScrollbarTop = Section.HeaderHeight + 4;
        this.ScrollbarBottom = Section.HeaderHeight + Section.Height - 4;
        this.ScrollbarSpan = (this.ScrollbarBottom - this.ScrollbarTop);
        this.ScrollbarHeight = (Section.Height / this.ScrollHeight) * this.ScrollbarSpan;

        this.ScrollbarStyle.webkitTransitionDuration = '0ms';

        // Show scrollbar
        this.$ScrollbarContainer.css({
            height: this.ScrollbarSpan,
            top: this.ScrollbarTop
        });

        this.$Scrollbar.css({
            height: this.ScrollbarHeight
        }).removeClass('hidden');
    }

    this.HideScrollbar = function () {
        this.$Scrollbar.addClass('hidden');
    }

    this.CalculateScrollbarPos = function (ScrollY) {
        var Pos = -this.ScrollbarHeight * ScrollY / Section.Height;
        var TempScrollbarHeight = null;
        if (ScrollY > 0) {
            return (Pos > -2 ? -4 : Pos * 2);
        }
        else if (ScrollY < this.ScrollLimit) {
            Pos = this.ScrollbarHeight * (1 + (ScrollY - this.ScrollLimit) / Section.Height * 2);
            return this.ScrollbarSpan - (Pos < 4 ? 4 : Pos);
        }

        return Pos;
    }

    this.GetScrollAmountY = function (dY) {
        if (this.IsSmall) return (this.ScrollPos + dY / 2);

        var ScrollY = this.ScrollPos + dY;

        if (ScrollY > 0) return ScrollY / 2;
        else if (ScrollY < this.ScrollLimit) return (this.ScrollLimit + ScrollY) / 2; //this.ScrollHeight + (ScrollY + this.ScrollHeight) / 2;
        else return ScrollY;
    }

    this.TrackMomentum = function () {
        var TimeStamp = new Date();

        this.ScrollMomentum.push({ dY: this.ScrollDeltaY, Time: TimeStamp.getTime() });
    }

    this.GetMomentum = function () {
        var TimeStamp = new Date();
        var Time = TimeStamp.getTime()
        TimeLimit = Time - this.ScrollMomentumPeriod
        MomentumStart = Time,
				MomentumEnd = TimeLimit;

        var TotalMomentum = 0;
        var MomentumI = 0;
        while (MomentumI < this.ScrollMomentum.length) {
            if (this.ScrollMomentum[MomentumI].Time >= TimeLimit) {
                if (this.ScrollMomentum[MomentumI].Time < MomentumStart) MomentumStart = this.ScrollMomentum[MomentumI].Time;
                else if (this.ScrollMomentum[MomentumI].Time > MomentumEnd) MomentumEnd = this.ScrollMomentum[MomentumI].Time;

                TotalMomentum += this.ScrollMomentum[MomentumI].dY;
            }

            MomentumI++;
        }

        // Reset momentum
        this.ScrollMomentum = [];

        var MomentumTime = MomentumEnd - MomentumStart;

        // If there is no momentum...
        if (MomentumTime <= 0) return 0;
        else return TotalMomentum / MomentumTime;
    }

    this.DragStart = function () {
        // Reset any transition events
        $Container[0].removeEventListener('webkitTransitionEnd', this.ScrollBounceBack);

        // Save initial drag position
        this.ScrollPos = $Container.offset().top - Section.HeaderHeight;
        this.ScrollStart = this.ScrollPos;
        this.ScrollDeltaY = 0;
        this.ScrollLastDeltaY = 0;
        this.ScrollHeight = $Container.height();
        this.ScrollLimit = -(this.ScrollHeight - Section.Height);

        this.IsSmall = (this.ScrollHeight <= Section.$Controller.height());

        // Show the scrollbar
        this.ShowScrollbar();
    }

    this.DragMove = function (dX, dY) {
        // Determine the scroll amount
        var ScrollY = this.GetScrollAmountY(dY);

        // Save the current delta
        this.ScrollDeltaY = dY - this.ScrollLastDeltaY;
        this.ScrollLastDeltaY = dY;

        // Track momentum
        this.TrackMomentum();

        // Scroll to the point we're now at, instantly (0 ms)
        this.ContainerStyle.webkitTransitionDuration = '0ms';
        this.ContainerStyle.webkitTransform = 'translate3d(0px, ' + ScrollY + 'px, 0px)';

        // Scroll the scrollbar
        this.ScrollbarStyle.webkitTransform = 'translate3d(0px, ' + this.CalculateScrollbarPos(ScrollY) + 'px, 0px)';
    }

    this.DragEnd = function (dX, dY) {
        this.ScrollPos = this.GetScrollAmountY(dY);

        // Determine wether we're limited
        var ScrollY = this.ScrollPos;
        var ScrollTotalTime = 0;

        var Momentum = this.GetMomentum();
        if ((Momentum != 0) && (ScrollY <= 0) && (ScrollY >= this.ScrollLimit)) {
            var AccelerationY = 216; //67;
            var VelocityY = 0; //133;

            // Hack-style. Assume constant acceleration
            var MomentumNorm = (Momentum < 0 ? -Momentum : Momentum);
            var ScrollTime = MomentumNorm * (500 + MomentumNorm * 10);
            var ScrollLength = MomentumNorm * (MomentumNorm * AccelerationY + VelocityY) * (Momentum < 0 ? -1 : 1);

            ScrollTotalTime += ScrollTime;

            // If we go over the boundries
            var ScrollEnd = ScrollY + ScrollLength;
            var TransitionFunction = 'cubic-bezier(0.0, 0.0, 0.5, 0.9)';
            if ((ScrollEnd > 0) || (ScrollEnd < this.ScrollLimit)) {
                // Determine by how much we've bounched over the limit
                var ScrollOverscroll = ((ScrollEnd > 0) ? ScrollEnd : ScrollEnd - this.ScrollLimit);
                var ScrollNormalscroll = ScrollLength - ScrollOverscroll;

                // Momentum of 10 gives the biggest bounce
                var ScrollOverbounce = Section.Height / 20 * (Momentum > 20 ? 20 : Momentum);
                ScrollEnd = (ScrollEnd > 0 ? ScrollOverbounce : this.ScrollLimit + ScrollOverbounce);

                ScrollTotalTime -= ScrollTime;
                ScrollTime *= (ScrollNormalscroll + ScrollOverbounce) / ScrollLength;
                ScrollTotalTime += ScrollTime;

                _self.ContainerStyle.webkitTransitionDuration = '0ms';

                this.ScrollBounceBack = function () {
                    _self.ContainerStyle.webkitTransitionDuration = '400ms';
                    _self.ContainerStyle.webkitTransform = 'translate3d(0px, ' + (ScrollEnd > 0 ? 0 : _self.ScrollLimit) + 'px, 0)';

                    _self.ScrollbarStyle.webkitTransitionDuration = '400ms';
                    _self.ScrollbarStyle.webkitTransform = 'translate3d(0px, ' + (ScrollEnd > 0 ? 0 : _self.ScrollbarSpan - _self.ScrollbarHeight) + 'px, 0px)';
                };
                $Container[0].addEventListener('webkitTransitionEnd', this.ScrollBounceBack, false);

                var TransitionFunction = 'cubic-bezier(0.7, 0.0, 0.99, 0.9)';

                ScrollTotalTime += 400;
            }

            // Assign the transition
            this.ContainerStyle.webkitTransitionDuration = ScrollTime + 'ms';
            this.ContainerStyle.webkitTransform = 'translate3d(0px, ' + (ScrollEnd) + 'px, 0px)';
            this.ScrollbarStyle.webkitTransitionDuration = ScrollTime + 'ms';
            this.ScrollbarStyle.webkitTransform = 'translate3d(0px, ' + this.CalculateScrollbarPos(ScrollEnd) + 'px, 0px)';
        }
        else {
            if (this.ScrollPos > 0) ScrollY = 0;
            if (this.ScrollPos < this.ScrollLimit) ScrollY = this.ScrollLimit;

            if (this.ScrollHeight <= Section.$Controller.height()) ScrollY = 0;

            if (ScrollY != this.ScrollPos) {
                // Scroll to the limit
                this.ContainerStyle.webkitTransitionDuration = '400ms';
                this.ContainerStyle.webkitTransform = 'translate3d(0px, ' + ScrollY + 'px, 0px)';

                // Scroll the scrollbar
                if ((this.ScrollPos > 0) || (this.ScrollPos < this.ScrollLimit)) {
                    this.ScrollbarPosition = 0;

                    this.ScrollbarStyle.webkitTransitionDuration = '400ms';
                    this.ScrollbarStyle.webkitTransform = 'translate3d(0px, ' + (this.ScrollPos > 0 ? 0 : this.ScrollbarSpan - this.ScrollbarHeight) + 'px, 0px)';

                    this.ScrollTotalTime += 400;
                }

                this.ScrollPos = ScrollY;
            }
        }

        this.ScrollbarTimeout = setTimeout(function () {
            _self.HideScrollbar();
        }, ScrollTotalTime);
    }

    var Touch = new Chutney.Library.Touch($AContainer, {
        DragStart: function () { _self.DragStart(); },
        DragMove: function (dX, dY) { _self.DragMove(dX, dY); },
        DragEnd: function (dX, dY) { _self.DragEnd(dX, dY); }
    });
}