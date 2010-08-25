// * Animations
Chutney.Animations = (function () { });

Chutney.Library.Animation = function (AOptions) {
    // Define basic parameters
    this.Duration = 250; // milliseconds
    this.Timing = 'ease-in-out'; // ie. easing
    this.Reverse = false;

    this.TargetStart = {};
    this.TargetEnd = {};

    // Copy all the values in the options
    if (AOptions != undefined) {
        for (Option in AOptions) {
            this[Option] = AOptions[Option];
        }
    }

    // Basic function for execution
    this.Execute = function ($ATarget, AOptions, $AOcclude) {
        // Build the options
        if ((AOptions != undefined) && (AOptions != null)) {
            var OldOptions = {};
            for (Option in AOptions) {
                OldOptions[Option] = this[Option];
                this[Option] = AOptions[Option];
            }
        }

        // Reference pointers
        var TargetStyle = $ATarget[0].style,
			    TargetAnimation = this;

        // Do the setup
        this.Setup($ATarget);

        // Apply the CSS to the target - zero the duration to get it done instantly
        TargetStyle.webkitTransitionDuration = '0ms';
        for (Styling in this.TargetStart) $ATarget.css(Styling, this.TargetStart[Styling]);

        // Zero the duration for the occluder if it's running
        if ($AOcclude != null) {
            $AOcclude.css('-webkit-transition-duration', '0ms');
        }


        // Get the highest z-index
        var IndexTarget = $ATarget.css('z-index');
        if (IndexTarget == 'auto') IndexTarget = 1;
        IndexMax = 0;

        $($ATarget[0].nodeName).each(function () {
            var IndexThis = $(this).css('z-index');
            if (IndexThis == 'auto') IndexThis = 1;

            if (IndexThis > IndexMax) { IndexMax = IndexThis; }
        });

        if (IndexMax >= IndexTarget) TargetStyle.zIndex = IndexMax + 1;

        // Setup the actual animation with a delay			
        setTimeout(function () {
            // Setup the timing of the animation
            TargetStyle.webkitTransitionDuration = TargetAnimation.Duration + 'ms';
            TargetStyle.webkitTransitionProperty = 'all';
            TargetStyle.webkitTransitionTimingFunction = TargetAnimation.Timing;

            // Apply the CSS to the target
            for (Styling in TargetAnimation.TargetEnd) TargetStyle[Styling] = TargetAnimation.TargetEnd[Styling];
        }, 5);

        // If we occlude, time the hiding
        if ($AOcclude != undefined) {
            setTimeout(function () {
                // Hide the occluder
                $AOcclude.hide();
            }, 50 + this.Duration);
        }

        // Reset the options
        if (AOptions != undefined) {
            for (Option in OldOptions) {
                this[Option] = OldOptions[Option];
            }
        }
    }
}

Chutney.Animations.Slide = new Chutney.Library.Animation({
    Duration: 250,
    Direction: 'left',
    Setup: function (ATarget) {
        StartX = ((this.Direction == 'left') || (this.Direction == 'right')) ? ATarget.outerWidth() : 0;
        StartY = ((this.Direction == 'up') || (this.Direction == 'down')) ? ATarget.outerHeight() : 0;
        EndX = 0;
        EndY = 0;

        if ((this.Direction == 'down') || (this.Direction == 'right')) {
            StartX *= -1;
            StartY *= -1;
        }

        if (this.Reverse) {
            EndX = StartX;
            EndY = StartY;

            StartX = 0;
            StartY = 0;
        }

        this.TargetStart =
			{
			    '-webkit-transform': 'translate3d(' + StartX + 'px, ' + StartY + 'px, 0)'
			}

        this.TargetEnd =
			{
			    '-webkit-transform': 'translate3d(' + EndX + 'px, ' + EndY + 'px, 0)'
			}
    }
});