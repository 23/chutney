// * Generic helper functions
Chutney.Helpers = {};

Chutney.Helpers.ParseDimension = function (ADimension) {
    // Typecast to integer for math safety
    return parseInt(ADimension.replace('px', ''));
}

// * Non-generic helper functions
Chutney.prototype.ShowSection = function (ASelector, AAnimation, AAnimationOptions) {
    $Target = $(ASelector);

    $Target.show();

    (((AAnimation == undefined) || (AAnimation == null)) ? this.DefaultAnimation : AAnimation).Execute($Target, ((AAnimationOptions != undefined) && (AAnimationOptions != null) ? AAnimationOptions : this.DefaultAnimationOptions));
}

Chutney.prototype.HideSection = function (ASelector, AAnimation, AAnimationOptions) {
    var $Target = $(ASelector);
    var Target = $Target[0];

    var Options = ((AAnimationOptions != undefined) && (AAnimationOptions != null) ? AAnimationOptions : this.DefaultAnimationOptions);
    var DefaultOptions = { Reverse: true };
    $.extend(Options, DefaultOptions);

    var HideDone = function () {
        $Target.hide();

        Target.onWebkitTransitionEnd = function () { };
    }

    Target.onWebkitTransitionEnd = HideDone;

    (((AAnimation == undefined) || (AAnimation == null)) ? this.DefaultAnimation : AAnimation).Execute($Target, Options);
}