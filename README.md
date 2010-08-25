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

## Headers

Headers are always contained within a section, and can by default contain two different items: a title (`h1`) and buttons (`button`). An example of a header looks as follows:

    <section>
      <header>
        <h1>My title</h1>
        <button class="left">Text label</button>
        <button class="right"><img src="ButtonImage.png" .. /></button>
      </header>
      ..
    </section>

## The footer

An application can only contain one `footer`, which is a tab bar positioned at the bottom of the screen. A footer contains links (`a`), which can either have a CSS selector for a specific section set using `chutney:Target`, or any other events assigned.

The icon of the tab can be set using the `class` attribute. Currently only `performance`, `person` and `todo` are added as default, but more are to follow. Look in `Source/Resources/` for the examples to replicate.

A bubble mark can be added to a tab item using the `mark` tag.

An example of a footer looks as follows:

    <footer>
      <a class="performance" chutney:Target="#performance">Sales</a>
      <a class="person" chutney:Target="#clients">Clients<mark>5</mark></a>
      <a class="todo" onClick="alert('Pure JavaScript action with no section action!');">Todos</a>
    </footer>

# Building an application

To build an application, you simply need to set up the sections you need as documented above, and implement your own scripting for handling buttons etc. To instantiate an application, you must initialize an object of the type `Chutney`, which takes an object containing three parameters:

`iPhoneIcon` - the URL of your icon, which must be 72x72 pixels

`iPhoneIconGlass` - a boolean stating wether or not, iOS should add the glass effect to your icon by default. Defaults to true.

`iPhoneStartup` - the URL of your startup splash screen for when your application is loaded from the Home screen. Must be 320x460 pixels.

An application would then simply be structured as follows:

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>My application</title>
        <link href="Distribution/chutney-base.css" rel="stylesheet" />
        <script src="Distribution/chutney-1.0.0.0-min.js"></script>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
      </head>
      <body>
        <section ..>...</section>
        <footer>...</footer>
        <script>
    var Application = new Chutney({
      iPhoneIcon: 'YourAppIcon.png',
      iPhoneIconGlass: false,
      iPhoneStartup: 'YourStartupSplash.png'
    });
        </script>
      </body>
    </html>

Currently only two interactions with sections are necessary: `<Application object name>.ShowSection` and `<Application object name>.HideSection`. Both functions take three arguments:

1. Section selector - a CSS selector identifying your selector
2. Animation - using "null" will default to the _Slide_ animation
3. Animation options - options specifying animation behaviour. For _Slide_ only `Direction` is supported and can have the following values: `left`, `right`, `up` and `down`