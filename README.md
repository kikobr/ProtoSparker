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
- Download protoSparker.coffee and place it into your project/modules folder.
- Import protoSparker module inside your project's file and instantiate it:

```coffeescript
figma = Framer.Importer.load("imported/Your project@1x")

{ProtoSparker} = require 'protoSparker'
protoSparker = new ProtoSparker
    # pass a layer as the first page
    firstPage: figma.pageLayer
```

That's it! Now go back to your design software, start changing layers names following the [naming usage](#namingConventions) and reimport them back to Framer.js.

---

# References
## Startup options
[Startup usage](#startup-usage) <br>
[firstPage](#firstPage) <br>
[textField](#textField) <br>
[selectField](#selectField) <br>

## Naming conventions
[Naming conventions](#naming-conventions) <br>

## Features
[goto](#gototargetlayer) <br>
[goback](#goback) <br>
[scroll](#scroll) <br>
[text-field](#text-field) <br>
[select-field](#select-field[option:value,option:value]) <br>
[overlay](#overlay:targetLayer) <br>
[element](#element:elementName[state:stateName]) <br>
[setElement](#setElement:targetElement[state:desiredState]) <br>

---

## Startup usage
Add properties to the object passed in the ProtoSparker instantiation
```coffeescript
protoSparker = new ProtoSparker
    # this is the object
    firstPage: layer # this is the option
```

### firstPage
This is the layer that shows up when the prototype boots. You can navigate between layers using the [goto](#goto) action. This is **required**

### textField
This option allows you to customize the HTML input created by [text-field](#textField).
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

### selectField ###
This option allows you to customize the HTML selects created by [select-field](#selectField).
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

---

## Naming conventions

ProtoSparker is based on layer names to automatically set up the expected behavior.

That means if you want a layer to scroll, you name it "scroll;". If you want it to be a select field, you name it "select_field;".

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

### scroll;
This makes the layer / group automatically scrollable. By default it's set to scroll vertically

##### scroll[horizontal];
You can pass the options **horizontal** or **vertical** to control the scroll behavior.

### text-field;
This will turn the layer into a \<input[type="text"]\> field. If you want to override the default css or apply a style for the placeholder, check [select-field styling ](#textFieldCSS).

### select-field[option:value,option:value];
This will turn the layer into a \<select\> field. If you want to override the default css or apply a style for the placeholder, check [select-field styling](#selectFieldCSS).

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
