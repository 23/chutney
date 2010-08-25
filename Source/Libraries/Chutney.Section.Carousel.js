// * Carousel
Chutney.Library.SectionCarousel = function (ASelector, AOptions) {
    if (AOptions.direction == undefined) AOptions.direction = 'horizontal';
    AOptions.navigation = ($(ASelector).attr('chutney:Carousel:Navigation') != 'false');

    var Section = new Chutney.Library.Section(ASelector, AOptions);
    Section.$Controller.addClass('carousel');

    // Get access to all the basic objects
    Section.$ArticlesGroup = Section.$Controller.children('figure');
    Section.$Articles = Section.$Controller.children('figure').children('article');

    // Setup the scrolling
    if (Section.Options.direction == 'horizontal') {
        Section.$ArticlesGroup.css({
            width: (100 * Section.$Articles.length) + '%'
        });

        // Navigation?
        if (Section.Options.navigation) {
            var Navigation = document.createElement('nav');
            Navigation.className = 'carousel';

            for (Article = 0; Article < Section.$Articles.length; Article++) {
                var NavigationElement = document.createElement('m');

                if (Article == 0) NavigationElement.className = 'active';

                Navigation.appendChild(NavigationElement);

            }

            Section.$Controller.append(Navigation);

            Section.$Navigation = $(Navigation);
        } else Section.$Navigation = null;
    }

    // Resizing
    Section._Resize = Section.Resize;
    Section.Resize = function (AWindowWidth, AWindowHeight, AWidthSubtraction, AHeightSubtraction) {
        this._Resize(AWindowWidth, AWindowHeight, AWidthSubtraction, AHeightSubtraction);

        this.$Articles.css({
            width: this.Width,
            height: this.Height
        });

        Section.$ArticlesGroup.css({
            '-webkit-transition-duration': '0ms',
            '-webkit-transform': 'translate3d(' + (-Section.CurrentArticle * Section.Width) + 'px, 0px, 0)'
        });
    }

    // 
    Section.CurrentArticle = 0;

    // Add a touch listener
    Section.DragStart = function () {
        // Save initial drag position
        Section.DragStartPos = Section.$ArticlesGroup.offset().left;
    }

    Section.DragMove = function (dX, dY) {
        Section.$ArticlesGroup.css({
            '-webkit-transition-duration': '0ms',
            '-webkit-transform': 'translate3d(' + (Section.DragStartPos + (((Section.CurrentArticle == 0) && (dX > 0)) || ((Section.CurrentArticle == Section.$Articles.length - 1) && (dX < 0)) ? dX / 2 : dX)) + 'px, 0px, 0)'
        });
    }

    Section.DragEnd = function (dX, dY) {
        var ScrollLimit = Section.Width * 0.05;

        if ((dX < -ScrollLimit) && (Section.CurrentArticle < Section.$Articles.length - 1)) Section.CurrentArticle++;
        else if ((dX > ScrollLimit) && (Section.CurrentArticle > 0)) Section.CurrentArticle--;

        if (Section.$Navigation != null) {
            Section.$Navigation.children().removeClass('active');
            $(Section.$Navigation.children()[Section.CurrentArticle]).addClass('active');
        }

        ScrollMovement = -Section.CurrentArticle * Section.Width;

        setTimeout(function () {
            Section.$ArticlesGroup.css({
                '-webkit-transition-duration': '250ms',
                '-webkit-transform': 'translate3d(' + ScrollMovement + 'px, 0px, 0)'
            });
        }, 5);
    }

    var Touch = new Chutney.Library.Touch(Section.$Controller, {
        DragStart: Section.DragStart,
        DragMove: Section.DragMove,
        DragEnd: Section.DragEnd
    });

    return Section;
}