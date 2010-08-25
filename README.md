# Introduction

Chutney is an open framework for building mobile web applications using HTML5, CSS3 and JavaScript (jQuery). The framework is at its current state, version 1.0.0.0, very sparse but provides general behaviour for native looking web applications. Within the next few months, more and more features will be steadily rolled out.

Chutney is currently only targeted the iOS platform with focus on the iPhone, but native Android behaviour will be added shortly as well.

# The structure of Chutney

Chutney relies fully on HTML5 markup tags for its logical division of content. The following elements are important in this context:

`section` - A section marks a specific content section of the application, comparable to the native iPhone `Panel`
`figure` - A figure, for lack of better tags, is a scrolling content container, if the section is configured to utilize scrolling. Otherwise it is free to use
`header` - A header, which is contained inside a section, is a toolbar, to which buttons and a title can be added
`footer` - A footer, which contains tabs for navigation between primary sections

## Sections

A section can be configured with three extended attributes:

`chutney:Section` - the type of the section to be instantiated. Supported types are _empty_, `carousel` and `list`
`chutney:Fullscreen` - a boolean (true/false) stating whether or not the section should cover the entire screen. Defaults to false.
`chutney:Scroll` - a boolean (true/false) stating whether or not an empty section should have scrolling ability. Defaults to false.

### Carousel

When using the `carousel` type, the following parameter can furthermore be added:
`chutney:Carousel:Navigation` - a boolean (true(false) stating whether or not the carousel should show navigation dots at the bottom of the section. Defaults to false.

A carousel is structured as follows:

    <section chutney:Section="carousel" chutney:Carousel:Navigation="true">
      <figure>
        <article>First carousel item content here...</article>
        <article>Second carousel item content here...</article>
        <article>Third carousel item content here...</article>
        ..
        <article>nth carousel item content here...</article>
      </figure>
    </section>

### List

A list is structured as follows:

    <section chutney:Section="list">
      <figure>
        <figcaption>A caption for a subpart of a list</figcaption>
        <ul>
          <li>List item</li>
          <li>List item</li>
          <li>List item</li>
        </ul>
        <figcaption>A caption for yet another subpart of a list</figcaption>
        <ul>
          <li>List item</li>
          <li>List item</li>
          <li>List item</li>
        </ul>
      </figure>
    </section>

## Figures

A `figure` contained within a section that is either not a default type, or has scrolling enabled, will be the primary container for scrolling content.