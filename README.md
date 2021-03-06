# ProtoSparker
It's a framework to automatically bootstrap Framer.js prototypes.

### Coding only when necessary
Framer.js is an awesome tool for making high fidelity prototypes, but it can be overwhelming. Since everything in Framer.js must be coded, it becomes really painful to implement a lot of small and repetitive interactions: you spend a lot of time writing and getting lost in hundreds of lines of code.

That's why I wrote ProtoSparker, a Framer.js module that takes care of generating these common interactions automatically, so that you only have to code what **REALLY** needs coding.

### How does it work?
You just have to name your layers following some conventions (see references below) and instantiate ProtoSparker. It will handle everything else for you.

---

## Getting started
Open your layout inside Figma or Sketch and rename the layers you want to interact with using the References as a guideline. Try adding a scrollable layer by renaming a group layer to "scroll".

- Import this project inside Framer.js
- Download `dist/ProtoSparker.js` and place it into your project/modules folder.
- Import protoSparker module inside your project's file and instantiate it:

```coffeescript
figma = Framer.Importer.load("imported/Your project@1x")

require 'ProtoSparker'
protoSparker = new ProtoSparker
    # pass a layer as the first page
    firstPage: figma.pageLayer
```

That's it! Now go back to your design software, start changing layers names following the [naming usage](#naming-conventions) and reimport them back to Framer.js.

---

## Using the Importer *beta*
You can also import SVG files to work with Framer. This means you can use it outside a Mac, with the Framer open source engine. Bear in mind that this Importer is highly experimental, so don't expect perfect imports.

### Using it inside Framer Studio ###
Grab our *dist/ProtoSparker.js* and place it inside your project's modules folder. Then type:
```coffeescript
require 'ProtoSparker'
importer = new SvgImporter
    files: ['img/page1.svg', 'img/page2.svg']
protoSparker = new ProtoSparker
    firstPage: f('page1') # the name of the artboard or svg filename
```

### Using it with Framer.js (open source engine that runs on Windows, Linux and Mac) ###
First you'll have to download Framer.js library ([visit this page and download the latest framer.js, use the link on the left called 'framer.js'](http://builds.framerjs.com/?utm_source=GitHub%2C%20framerjs%2C%20readme&utm_medium=Github)). Then, you'll have to include this script alongside ProtoSparker (download it at *dist/ProtoSparker.js*) in an HTML file and serve it via a web server.

```html
<!DOCTYPE html>
<html>
    <head><meta charset="utf-8"></head>
    <body>
        <script src="js/framer.js"></script>
        <script src="js/ProtoSparker.js"></script>
        <script type="text/javascript">
            var importer = new SvgImporter({
                editableSvg: true,
                files: [ 'img/page1.svg', 'img/page2.svg' ]
            });
            var protoSparker = new ProtoSparker({
                firstPage: f('page1') // name of the artboard or svg filename
            });
        </script>
    </body>
</html>
```

### Serving the page ###
You have to serve this page with an HTTP server so that our script can request your svg files. If you are on Mac or Linux, open your terminal, navigate to the project folder and type `python -m SimpleHTTPServer 8000` or `python -m http.server 8000` - hit enter and visit http://localhost:8000 in your browser. If you are on Windows, you can download [MiniWeb](https://sourceforge.net/projects/miniweb/), drop you html files and images inside htdocs folder, run miniweb.exe and visit http://localhost:8000.


### Prototype is taking too much time to load?
Try renaming some complex layer groups to "flatten;". See [Flatten Feature](#flatten)

#### What's not working yet ####
*Not running on Firefox*: Firefox has a [bug](https://bugzilla.mozilla.org/show_bug.cgi?id=612118) dealing with .getBBox().

*Drop shadows*: This is much harder than it seems.

---

# SvgImporter Reference
## Startup usage

```coffeescript
importer = new SvgImporter
    editableSvg: true,
    files: [ "img/page1.svg", "img/page2.svg" ]
```

### editableSvg (Boolean: false) ###
If you enable this, the SVG slices will be imported using Framer built in SVG API. This enables you to modify the SVG paths directly. By now it's toggled off for testing purposes, soon this will be enabled by default.

### files (Array) ###
Here you pass the files you want to import into Framer. If this SVG doesn't contain a root group with an "id" or "data-name" (like an artboard), SVGImporter will set its Framer root layer name as the SVG filename.

### log (Boolean:false)
Turn it on if you want to see how much time is taking to load each file.

---

# ProtoSparker Reference
## Startup options
[Startup usage](#startup-usage) <br>
[firstPage](#firstpage) <br>
[textField](#textfield) <br>
[selectField](#selectfield) <br>

## Naming
[Naming conventions](#naming-conventions) <br>

## Features
[goto](#gototargetlayer) <br>
[goback](#goback) <br>
[flatten](#flatten) <br>
[scroll](#scroll) <br>
[text-field](#text-field) <br>
[select-field](#select-fieldoptionvalueoptionvalue) <br>
[overlay](#overlaytargetlayer) <br>
[element](#elementelementnamestatestatename) <br>
[setElement](#setelementtargetelementstatedesiredstate) <br>

---

## Startup usage
```coffeescript
protoSparker = new ProtoSparker
    # this is the object
    firstPage: layer # this is the option
```

### firstPage (Layer)
This is the layer that shows up when the prototype boots. You can navigate between layers using the [goto](#goto) action. This is **required**

### textField (Object)
This option allows you to customize the HTML input created by [text-field](#textfield).
```coffeescript
protoSparker = new ProtoSparker
    textField:
        defaultClass: "ps-text-field" # this is set by default
        placeholderText: "" # text when input is empty
        styles:
            default:
                field:
                    # add any css property and value as strings
                    "color": "#121212"
                placeholder:
                    # add any css property and value as strings
                    "color": "#CBCACA"
```

### selectField (Object) ###
This option allows you to customize the HTML selects created by [select-field](#selectfield).
```coffeescript
protoSparker = new ProtoSparker
    selectField:
        defaultClass: "ps-select-field" # this is set by default
        placeholderText: "" # text when input is empty
        styles:
            default:
                field:
                    # add any css property and value as strings
                    "color": "#121212"
                placeholder:
                    # add any css property and value as strings
                    "color": "#CBCACA"
```

### hints (Boolean: false) ###
If set to true, shows outline hints to help user know where she can interact with.

---

## Naming conventions

ProtoSparker is based on layer names to automatically set up the expected behavior.

That means if you want a layer to scroll, you name it "scroll;". If you want it to be a select field, you name it "select-field;".

Every feature we have is based on the same layer naming convention:
```
"action:target[option:value,option:value];"
```
Actions define the wanted feature, target defines where it should be applied and options define additional settings we might want to apply. Some features require targets, some features don't. Some features allow options, other features don't.

You can also chain features after the semicolon:
```
"action;action:target;action:target[option:value];"
```

Just remember the convention to make sure the layer name is well formatted.

---

## Features ##

### goto:targetLayer; ###
When a layer with this name is clicked, the prototype will transition the current page to ***targetLayer***. E.g.: when a layer named "goto:page1;" is clicked, the prototype will set "page1" as the new page and transition into it.

##### goto:targetLayer[transition:fade];
You can pass a transition option and control the animation when transition happens. The values for the transition can be **fade**, **slideUp**, **slideDown**, **slideLeft**, **slideRight**.

### goback;
This layer name will make the prototype return to the last page it visited. It's really useful for back buttons.

### flatten;
When using SvgImporter, this will flatten a group into a single layer, improving dramatically the loading and render times. It's specially useful for illustration groups, because they usually have a lot of layer that slows down creation of framer layers.

### scroll;
This makes the layer / group automatically scrollable. By default it's set to scroll vertically

##### scroll[horizontal];
You can pass the options **horizontal** or **vertical** to control the scroll behavior.

### text-field;
This will turn the layer into a \<input[type="text"]\> field. If you want to override the default css or apply a style for the placeholder, check [select-field styling ](#textfield).

### select-field[option:value,option:value];
This will turn the layer into a \<select\> field. If you want to override the default css or apply a style for the placeholder, check [select-field styling](#selectfield).

The options will be rendered as \<option\> tags inside the \<select\>.

Eg.: a layer named "select-field[Apple,Microsoft,Amazon:cool];" will be rendered as:
```html
<select>
    <option>Apple</option>
    <option>Microsoft</option>
    <option value="cool">Amazon</option>
</select>
```

### overlay:targetLayer;
When a layer with this name is clicked, it will overlay "targetLayer" at the center of the prototype.

#### overlay:targetLayer[left];
You can explicitly pass a position for the overlay. The options can be "top", "right", "bottom", "left" or "center".
If you don't pass any option, it defaults to "center".

### element:elementName[state:stateName];
This allow us to create one element with multiple states, making it easy to alternate between them.

**You should always have a default state defined: "element:elName[state:default];" or  "element:elName;"**

When the prototype loads, protoSparker puts all states behind the default state with visible=false, so you start off seeing just the default one. E.g.: you could have a tabs component with two states, just name the layers accordingly:

```
default layer, name it          "element:tabs;"
active state layer, name it     "element:tabs[state:active];"
```

#### element:elementName[toggle];
You can add a "toggle" property to toggle between two states. It's really useful for controls with on/off states.
Both states must have this "toggle" option for it to work:
```
default state, name it          "element:switch[toggle]"
on state, name it               "element:switch[state:on,toggle]"
```

### setElement:targetElement[state:desiredState];
This allows you to switch an element's state. Using the last example, you could trigger a state change by creating a button layer:
```
set the button layer's name to  "setElement:tabs[state:active];"
```
