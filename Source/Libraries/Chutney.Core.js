(function (window) {
    // * Define iChutney libarary
    Chutney = function (AAppOptions) {
        var _self = this;

        // * Values for all registered components
        this.HasDefaultComponent = false;
        this.Components = new Array();

        // * Resize operators
        this.ResizeExt = function () { _self.Resize(); }
        this.Resize = function () {
            // * Get the overall sizing
            var WindowWidth = $(window).width(), WindowHeight = $(window).height();

            // * Resize the components that respond to it
            for (var ComponentI in this.Components) {
                var Component = this.Components[ComponentI];
                if (Component.Resize != undefined) Component.Resize(WindowWidth, WindowHeight, this.ResizeWidthSubtraction, this.ResizeHeightSubtraction);
            }
        }

        // * Setup necessary meta tags etc.
        var DefaultAppOptions =
        {
            iPhoneStartup: null,
            iPhoneIcon: null,
            iPhoneIconGlass: true
        };

        this.AppSettings = $.extend(DefaultAppOptions, AAppOptions);

        $('head').append('<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0;" />');
        $('head').append('<meta name="apple-mobile-web-app-capable" content="yes" />');
        $('head').append('<meta name="format-detection" content="telephone=no" />');

        if (this.AppSettings.iPhoneIcon != null) $('head').append('<link rel="apple-touch-icon' + (this.AppSettings.iPhoneIconGlass ? '' : '-precomposed') + '" href="' + this.AppSettings.iPhoneIcon + '" />');
        if (this.AppSettings.iPhoneStartup != null) $('head').append('<link rel="apple-touch-startup-image" href="' + this.AppSettings.iPhoneStartup + '" />');

        // * Resize values
        this.ResizeWidthSubtraction = 0;
        this.ResizeHeightSubtraction = 0;

        // * Setup callbacks to this
        window.onresize = this.ResizeExt;

        // * Setup basic settings
        this.DefaultAnimation = Chutney.Animations.Slide;
        this.DefaultAnimationOptions = {};

        // * Automate creation
        this.Automate();

        // * Do a fake resize to initialize everything
        this.Resize();
    }

    // * Component registration
    Chutney.Library = {};

    Chutney.prototype.Register = function (AController) {
        // Register the component
        this.Components[this.Components.length] = AController;

        // Check for sizing constraints
        if (AController.GetConstraints != undefined) {
            var Constraints = AController.GetConstraints();

            this.ResizeWidthSubtraction += Constraints.Width;
            this.ResizeHeightSubtraction += Constraints.Height;
        }
    }

    Chutney.prototype.Automate = function () {
        // First off, do the sections
        var $Sections = $('section');
        for (SectionI = 0; SectionI < $Sections.length; SectionI++) {
            var Section = $Sections[SectionI], $Section = $(Section), SectionObject = null;

            switch ($Section.attr('chutney:Section')) {
                case 'carousel':
                    SectionObject = new Chutney.Library.SectionCarousel(Section, {});
                    break;

                case 'list':
                    SectionObject = new Chutney.Library.SectionList(Section, {});
                    break;

                default:
                    if ($Section.attr('chutney:Scroll') == 'true') SectionObject = new Chutney.Library.SectionScroll(Section, {});
                    else SectionObject = new Chutney.Library.Section(Section, {});
                    break;
            }

            if (SectionObject != null) this.Register(SectionObject);
        }

        // First off, do the footer
        var $Footer = $('footer');
        if ($Footer.length > 0) {
            // Create the tab controller
            this.Tabs = new Chutney.Library.Footer($Footer);
            this.Register(this.Tabs);
            this.Tabs.Select(0);
        }
    }
})(window);
