// * List
Chutney.Library.SectionList = function (ASelector, AOptions) {
    AOptions.navigation = ($(ASelector).attr('chutney:Carousel:Navigation') == 'true');

    var Section = new Chutney.Library.Section(ASelector, AOptions);
    Section.$Controller.addClass('list');

    // Identify objects
    Section.$Container = Section.$Controller.children('figure');
    Section.ContainerStyle = Section.$Container[0].style;

    Section.Scroller = new Chutney.Library.Scroller(Section, Section.$Container);

    return Section;
}