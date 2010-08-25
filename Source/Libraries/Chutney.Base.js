// * Base: section
Chutney.Library.Section = function (ASelector, AOptions) {
    // Reference the controller
    this.$Controller = $(ASelector);

    // Do the options stuff...
    this.Options = {
        title: '',
        mark: '',
        iconClass: '',
        fullscreen: (this.$Controller.attr('chutney:Fullscreen') == 'true'),
        animation: null,
        animationOptions: {}
    }

    $.extend(this.Options, AOptions);

    // Sizing
    this.Width = 0;
    this.Height = 0;
    this.HeaderHeight = 0;

    // * Function for showing/hiding this section
    this.Show = function ($AOcclude) {
        this.$Controller.show();

        (this.animation == null ? window.Chutney.DefaultAnimation : this.Options.animation).Execute(this.$Controller, (this.animation == null ? window.Chutney.DefaultAnimationOptions : this.Options.animationOptions), $AOcclude);
    }

    this.ShowForce = function () {
        this.$Controller.show();
    }

    this.Hide = function () {
        this.$Controller.hide();
    }

    this.Resize = function (AWindowWidth, AWindowHeight, AWidthSubtraction, AHeightSubtraction) {
        if (this.Options.fullscreen) {
            this.Width = AWindowWidth;
            this.Height = AWindowHeight;
        }
        else {
            this.Width = AWindowWidth - AWidthSubtraction;
            this.Height = AWindowHeight - AHeightSubtraction;
        }

        if (($Header = this.$Controller.children('header')).length > 0) {
            if (this.HeaderHeight == 0) this.HeaderHeight = Chutney.Helpers.ParseDimension($Header.css('height')) + Chutney.Helpers.ParseDimension($Header.css('border-top-width')) + Chutney.Helpers.ParseDimension($Header.css('border-top-width'));

            this.Height -= this.HeaderHeight;
            this.$Controller.css({ paddingTop: this.HeaderHeight });
        }

        this.$Controller.css({ width: this.Width, height: this.Height });
    }
}

// * Base: section with native scroll
Chutney.Library.SectionScroll = function (ASelector, AOptions) {
    var Section = new Chutney.Library.Section(ASelector, AOptions);

    // Identify objects
    Section.$Container = Section.$Controller.children('figure');
    Section.ContainerStyle = Section.$Container[0].style;

    Section.Scroller = new Chutney.Library.Scroller(Section, Section.$Container);

    return Section;
}

// * Navigation: tabs
Chutney.Library.Footer = function (ASelector) {
    // Do the options stuff...

    // Save the controller id and a reference
    this.$Controller = $(ASelector);

    // Determine various dimensions about the navigation
    this.DimMargins = null;
    this.DimItemMargin = null;

    // * Assign all the items
    this.Items = new Array();

    // References for functions
    var _$Controller = this.$Controller;

    // For the tabs that have a target, handle the clicks
    var _self = this;
    var $TargetItems = this.$Controller.children('a[\'chutney:Target\' != \'\']');
    for (TargetI = 0; TargetI < $TargetItems.length; TargetI++) {
        var TargetItem = $TargetItems[TargetI], $TargetItem = $(TargetItem);

        TargetItem.onclick = function () {
            _self.Select($(this).index());
        };
    }
}

Chutney.Library.Footer.prototype.Resize = function (AWindowWidth, AWindowHeight) {
    // Assuming full width for sizing
    if (this.DimItemMargin == null) this.DimItemMargin = Chutney.Helpers.ParseDimension(this.$Controller.children(':first').css('margin-right'));
    if (this.DimMargins == null) this.DimMargins = Chutney.Helpers.ParseDimension(this.$Controller.css('padding-left')) + Chutney.Helpers.ParseDimension(this.$Controller.css('padding-right'));

    var ItemCount = this.$Controller.children().length;
    var DimItemWidth = (AWindowWidth - this.DimMargins - this.DimItemMargin * (ItemCount - 1)) / ItemCount;

    // Apply the sizing
    this.$Controller.children().css('width', DimItemWidth);
}

Chutney.Library.Footer.prototype.GetConstraints = function () {
    // Constraints for basic layout
    return { Width: 0, Height: this.$Controller.height() };
}

Chutney.Library.Footer.prototype.Select = function (AIndex) {
    if (typeof (AIndex) != 'number') return false;
    if ((AIndex < 0) || (AIndex >= this.$Controller.children().length)) return false;

    var $ActiveItem = this.$Controller.children('.active'),
		    SelectItem = this.$Controller.children()[AIndex],
			$SelectItem = $(SelectItem);

    if ($SelectItem.index() == $ActiveItem.index()) return false;

    // Find active and selected sections
    var $ActiveSection = null,
			$SelectSection = $($SelectItem.attr('chutney:Target'));

    if ($ActiveItem.length > 0) {
        $ActiveSection = $($ActiveItem.attr('chutney:Target'));
        if ($ActiveSection.length == 0) $ActiveSection = null;
    }

    // Update items
    $ActiveItem.removeClass('active');
    $SelectItem.addClass('active');

    // Shift sections
    if ($ActiveSection != null) Chutney.Animations.Slide.Execute($SelectSection.show(), {}, $ActiveSection);
    else $SelectSection.show();
}