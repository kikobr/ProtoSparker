(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var PS = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var getFillDefs, getMatrixTransform, getRootG, getStrokeDefs, getUseDefs, getViewBox;

	var getViewBox_1 = getViewBox = function(node) {
	  var svg, viewBox;
	  svg = node.closest('svg');
	  viewBox = svg.getAttribute('viewBox');
	  if (!viewBox) {
	    return [0, 0, 0, 0];
	  }
	  viewBox = viewBox.split(" ").map(function(item) {
	    return parseFloat(item);
	  });
	  return viewBox;
	};

	var getRootG_1 = getRootG = function(node) {
	  var child, i, len, ref, rootG, svg;
	  rootG = null;
	  svg = node.closest('svg');
	  ref = svg.children;
	  for (i = 0, len = ref.length; i < len; i++) {
	    child = ref[i];
	    if (!rootG && child.nodeName === 'g') {
	      rootG = child;
	    }
	  }
	  return rootG;
	};

	var getUseDefs_1 = getUseDefs = function(node) {
	  var defs, fillDefs, i, len, link, linked, linkedSelector, strokeDefs, svg;
	  // if node.nodeName != 'use' then return false
	  svg = node.closest("svg");
	  defs = [];
	  linkedSelector = node.getAttribute("xlink:href");
	  if (linkedSelector && !linkedSelector.match('data:') && !linkedSelector.match('/')) {
	    linked = svg.querySelectorAll(linkedSelector);
	    for (i = 0, len = linked.length; i < len; i++) {
	      link = linked[i];
	      defs.push(link.cloneNode());
	    }
	  }
	  fillDefs = getFillDefs(node);
	  if (fillDefs) {
	    defs = defs.concat(fillDefs); // comes cloned
	  }
	  strokeDefs = getStrokeDefs(node);
	  if (strokeDefs) {
	    defs = defs.concat(strokeDefs); // comes cloned
	  }
	  return defs;
	};

	var getFillDefs_1 = getFillDefs = function(node) {
	  var defs, fill, fillUrl, i, len, svg, use, useDefs, uses;
	  defs = [];
	  if (node.hasAttribute("fill") && node.getAttribute("fill").match("url")) {
	    svg = node.closest("svg");
	    fillUrl = node.getAttribute('fill').replace(/(^url\()(.+)(\)$)/, '$2');
	    fill = svg.querySelector(fillUrl);
	    defs.push(fill.cloneNode(true));
	    // get uses if this fill contains them
	    if (fill.querySelector('use')) {
	      uses = fill.querySelectorAll('use');
	      for (i = 0, len = uses.length; i < len; i++) {
	        use = uses[i];
	        useDefs = getUseDefs(use);
	        if (useDefs) {
	          defs = defs.concat(useDefs); // comes cloned
	        }
	      }
	    }
	  }
	  return defs;
	};

	var getStrokeDefs_1 = getStrokeDefs = function(node) {
	  var defs, i, len, stroke, strokeUrl, svg, use, useDefs, uses;
	  defs = [];
	  if (node.hasAttribute("stroke") && node.getAttribute("stroke").match("url")) {
	    svg = node.closest("svg");
	    strokeUrl = node.getAttribute('stroke').replace(/(^url\()(.+)(\)$)/, '$2');
	    stroke = svg.querySelector(strokeUrl);
	    defs.push(stroke.cloneNode(true));
	    // get uses if this fill contains them
	    if (stroke.querySelector('use')) {
	      uses = stroke.querySelectorAll('use');
	      for (i = 0, len = uses.length; i < len; i++) {
	        use = uses[i];
	        useDefs = getUseDefs(use);
	        if (useDefs) {
	          defs = defs.concat(useDefs); // comes cloned
	        }
	      }
	    }
	  }
	  return defs;
	};

	var getMatrixTransform_1 = getMatrixTransform = function(node, log = false) {
	  var matrixArray, nodeT, qrDecompose, rootBBox, rootBounds, rootG, rootT, rotate, transform, translate, viewBox;
	  viewBox = getViewBox(node);
	  rootG = getRootG(node);
	  rootBounds = rootG.getBoundingClientRect();
	  rootBBox = rootG.getBBox();
	  rootT = rootG.getAttribute('transform') ? rootG.getAttribute('transform').match(/translate\(([^)]+)\)/) : false;
	  if (rootT) {
	    rootT = rootT[1].split(" ").map(function(t) {
	      return parseFloat(t);
	    });
	  }
	  if (node.hasAttribute('transform') && node.getAttribute('transform').match('matrix')) {
	    matrixArray = node.getAttribute('transform').replace(/(.*)matrix\((.*)\)(.*)/, '$2').replace(/\,\ /g, ' ').replace(/\,/g, ' ').split(' ').map(function(str) { // matrix(0, 0, 0, 0, 0, 0) // matrix(0,0,0,0,0,0) // matrix(0 0 0 0 0 0)
	      return parseFloat(str);
	    });
	    qrDecompose = function(a) {
	      var angle, denom, scaleX, scaleY, skewX;
	      angle = Math.atan2(a[1], a[0]);
	      denom = Math.pow(a[0], 2) + Math.pow(a[1], 2);
	      scaleX = Math.sqrt(denom);
	      scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX;
	      skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom);
	      return {
	        angle: angle / (Math.PI / 180), // this is rotation angle in degrees
	        scaleX: scaleX, // scaleX factor
	        scaleY: scaleY, // scaleY factor
	        skewX: skewX / (Math.PI / 180), // skewX angle degrees
	        skewY: 0, // skewY angle degrees
	        translateX: a[4],
	        translateY: a[5],
	        rootT: rootT,
	        rootBBox: rootBBox,
	        rootBounds: rootBounds
	      };
	    };
	    if (log) {
	      console.log('matrix', matrixArray);
	      console.log(node.getAttribute('transform'));
	    }
	    return qrDecompose(matrixArray);
	  } else if (node.hasAttribute('transform')) {
	    nodeT = node.getAttribute('transform');
	    transform = {
	      angle: 0,
	      scaleX: 1,
	      scaleY: 1,
	      translateX: 0,
	      translateY: 0
	    };
	    translate = nodeT.match(/translate\(([^)]+)\)/);
	    if (translate && translate.length) {
	      translate = translate[1].split(" ").map(function(t) {
	        return parseFloat(t);
	      });
	      transform.translateX = translate[0];
	      transform.translateY = translate[1];
	    }
	    rotate = nodeT.match(/rotate\(([^)]+)\)/);
	    if (rotate && rotate.length) {
	      rotate = rotate[1].split(" ").map(function(t) {
	        return parseFloat(t);
	      });
	      transform.angle = parseFloat(rotate[0]);
	    }
	    return transform;
	  } else {
	    return false;
	  }
	};

	var utils = {
		getViewBox: getViewBox_1,
		getRootG: getRootG_1,
		getUseDefs: getUseDefs_1,
		getFillDefs: getFillDefs_1,
		getStrokeDefs: getStrokeDefs_1,
		getMatrixTransform: getMatrixTransform_1
	};

	var getRootG$1, getViewBox$1;

	({getViewBox: getViewBox$1, getRootG: getRootG$1} = utils);

	var loadFile = function(file, index) {
	  var fileFullName, fileName, hasRootG, importNode, rootG, svg, viewBox, xhr;
	  // console.log("loading #{file}")
	  xhr = new XMLHttpRequest();
	  xhr.open("GET", file, false);
	  xhr.overrideMimeType("image/svg+xml");
	  xhr.send(null);
	  svg = xhr.responseXML.documentElement;
	  fileFullName = xhr.responseURL.split('/').filter(function(item) {
	    // gets the part of url that contains the svg file
	    if (item.match('.svg')) {
	      return true;
	    } else {
	      return false;
	    }
	  })[0];
	  fileName = fileFullName.replace('.svg', '');
	  // check if svg has a group wrapping everythin. if it doesnt, we'll use the svg as the "first layer"
	  hasRootG = document.querySelectorAll(`[data-import-id='${index}'] svg > g`).length === 1 ? true : false;
	  if (hasRootG) {
	    // gets root group and sets a name if it doesnt have one already
	    rootG = getRootG$1(svg);
	    if (rootG && !rootG.hasAttribute('data-name') && !rootG.hasAttribute('id')) {
	      rootG.setAttribute('data-name', fileName);
	    }
	  } else {
	    svg.setAttribute('data-name', fileName);
	  }
	  if (svg.getAttribute('viewBox')) {
	    viewBox = getViewBox$1.call(this, svg);
	    if (!svg.getAttribute('width')) {
	      svg.setAttribute('width', viewBox[2]);
	    }
	    if (!svg.getAttribute('height')) {
	      svg.setAttribute('height', viewBox[3]);
	    }
	  }
	  importNode = document.createElement('div');
	  importNode.setAttribute('data-import-id', index);
	  importNode.appendChild(svg);
	  /*
	      There's some bug when I import svgs. The first imported svg is fine,
	      but the other ones start getting the sizes and positions messed up.
	      Since I can't understand what is causing that, everytime I import svgs
	      I put them at the first child, so that they stay with the right sizes
	  */
	  return this.svgContainer.insertAdjacentElement('afterbegin', importNode);
	};

	var style = "html, body {\n    margin: 0;\n    padding: 0;\n}\nbody {\n    overflow-y: hidden; /* preventing chrome pull to refresh */\n}\n#ps-importer-container {\n    visibility: hidden;\n    display: block;\n    position: relative;\n    z-index: 999;\n}\n#ps-importer-container.hidden {\n    display: none;\n}\n#ps-importer-container [data-import-id] {\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 1;\n}\n#ps-importer-container [data-import-id].active {\n    z-index: 2;\n    position: relative;\n}\n/* fix for when framer layers are bigger than screen */\n.framerContext { overflow: hidden; }\n.framerLayer svg { pointer-events: none; }\n/* override framer empty svg width and height that may mess up actions layers */\n.framerLayer svg:not([width]) { width: auto; }\n.framerLayer svg:not([height]) { height: auto; }";

	var svgContainerStyle;

	svgContainerStyle = style;

	var setupContainer = function() {
	  var css, head, style$$1;
	  // create a container for the svgs
	  this.svgContainer = document.createElement('div');
	  this.svgContainer.id = 'ps-importer-container';
	  // if this div already exist, remove it to append the updated one
	  // Framer Studio sometimes reload the script but keep the html intact
	  if (document.querySelector('#ps-importer-container')) {
	    document.body.removeChild(document.querySelector('#ps-importer-container'));
	  }
	  document.body.insertAdjacentElement('afterbegin', this.svgContainer);
	  // create style and classes for the svgContainer
	  css = svgContainerStyle;
	  head = document.head || document.getElementsByTagName('head')[0];
	  style$$1 = document.createElement('style');
	  style$$1.setAttribute('data-ps-importer', '');
	  style$$1.type = 'text/css';
	  if (style$$1.styleSheet) {
	    style$$1.styleSheet.cssText = css;
	  } else {
	    style$$1.appendChild(document.createTextNode(css));
	  }
	  if (head.querySelector('[data-ps-importer]')) {
	    head.removeChild(head.querySelector('[data-ps-importer]'));
	  }
	  return head.appendChild(style$$1);
	};

	var getMatrixTransform$1, getUseDefs$1, getViewBox$2, traverse;

	({getViewBox: getViewBox$2, getUseDefs: getUseDefs$1, getMatrixTransform: getMatrixTransform$1} = utils);

	var traverse_1 = traverse = function(node, parent, parentLayer) {
	  var ancestor, ancestorT, child, childBBox, childBounds, childClone, childOriginalT, childTx, childTy, clipPath, clipPathBBox, clipPathBounds, clipPathInner, clipPathInnerBBox, clipSelector, computedStyle, createdLayer, currentStyle, def, defs, el, fill, fillSelector, filter, filterClone, filterSelector, g, i, id, importId, index, inner, isFirefox, j, k, l, layer, layerDefs, layerParams, layerSvg, len, len1, len10, len11, len12, len13, len2, len3, len4, len5, len6, len7, len8, len9, linked, linkedSelector, m, mask, maskClone, maskSelector, n, name, nodeBBox, nodeBounds, o, p, parentNodeBBox, path, q, qt, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, results, rotate, rotateX, rotateY, s, scaleX, scaleY, skipChildren, strokeWidth, style, svg, svgIds, svgStr, t, tX, tY, toX, toY, u, url, use, useBBox, useBounds, v, viewBox, w, x;
	  // ignoring
	  if (node.nodeName === 'mask' || node.nodeName === 'clipPath' || node.nodeName === 'use' && node.parentNode.children.length === 1) {
	    return false;
	  }
	  // setting active classes to hidden layers so that we can calculate getBoundingClientRect() correctly
	  if (node.parentNode && node.parentNode.nodeName === 'svg') {
	    importId = node.closest('[data-import-id]').getAttribute('data-import-id');
	    document.querySelectorAll("#ps-importer-container > [data-import-id]").forEach(function(el) {
	      if (el.getAttribute('data-import-id' === importId)) {
	        return el.classList.add('active');
	      } else {
	        return el.classList.remove('active');
	      }
	    });
	  }
	  // main variables
	  this.layerCount += 1;
	  viewBox = getViewBox$2(node);
	  createdLayer = null;
	  svg = node.closest('svg');
	  svgStr = '';
	  nodeBounds = node.getBoundingClientRect();
	  nodeBBox = node.getBBox ? node.getBBox() : {
	    x: 0,
	    y: 0
	  };
	  name = node.getAttribute('data-name') ? node.getAttribute('data-name') : node.id;
	  skipChildren = false;
	  computedStyle = getComputedStyle(node);
	  isFirefox = navigator.userAgent.indexOf("Firefox") > 0 ? true : false;
	  qt = getMatrixTransform$1(node);
	  // get default layer params
	  layerParams = {
	    name: name,
	    frame: {},
	    screenFrame: {},
	    style: {
	      'background-repeat': 'no-repeat',
	      'background-position': 'top left',
	      'background-size': 'auto'
	    },
	    clip: false,
	    backgroundColor: 'transparent',
	    x: nodeBounds.x || nodeBounds.left,
	    y: nodeBounds.y || nodeBounds.top,
	    originX: 0.5,
	    originY: 0.5,
	    width: nodeBBox.width || nodeBounds.width,
	    height: nodeBBox.height || nodeBounds.height
	  };
	  // calculates relative position from parent's absolute position
	  if (parentLayer) {
	    layerParams.x -= parentLayer.screenFrame.x;
	    layerParams.y -= parentLayer.screenFrame.y;
	  }
	  // this element will be used to store information that will be rendered inside layerParams.image
	  layerSvg = document.createElement('svg');
	  layerSvg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	  layerSvg.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
	  layerSvg.setAttribute('style', 'position: relative; display: block;');
	  layerDefs = document.createElement('defs');
	  layerSvg.appendChild(layerDefs);
	  /*
	   * Generating inner html and applying transforms so that the svg
	   * is rendered at 0,0 position of the layer
	   */
	  // groups that has only simple shapes may be rendered as just one framer layer.
	  // if node.nodeName == 'g' and node.querySelectorAll(':scope > circle').length == node.children.length then skipChildren = true
	  if (node.nodeName === 'g' && node.children.length === 1 && node.children[0].nodeName === 'use') {
	    use = node.children[0];
	    layerSvg.setAttribute('width', nodeBBox.width || nodeBounds.width);
	    layerSvg.setAttribute('height', nodeBBox.height || nodeBounds.height);
	    defs = getUseDefs$1(use);
	    if (defs) {
	      for (j = 0, len = defs.length; j < len; j++) {
	        def = defs[j];
	        layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def);
	      }
	    }
	    useBBox = use.getBBox();
	    useBounds = use.getBoundingClientRect();
	    tX = -useBBox.x;
	    tY = -useBBox.y;
	    toX = useBBox.width / 2;
	    toY = useBBox.height / 2;
	    [rotate, rotateX, rotateY] = [0, 0, 0];
	    [scaleX, scaleY] = [1, 1];
	    qt = getMatrixTransform$1(use);
	    if (qt) {
	      if (qt.angle) {
	        toX += (nodeBBox.x - qt.translateX) + (useBounds.width - useBBox.width);
	        toY += (nodeBBox.y - qt.translateY) + (useBounds.height - useBBox.height);
	        rotate = qt.angle;
	        rotateX = (useBBox.width / 2) + useBBox.x - toX;
	        rotateY = (useBBox.height / 2) + useBBox.y - toY;
	      }
	      tX += (nodeBBox.width - useBBox.width) / 2;
	      tY += (nodeBBox.height - useBBox.height) / 2;
	      scaleX = qt.scaleX;
	      scaleY = qt.scaleY;
	    }
	    inner = node.cloneNode(true);
	    // inner.children[0].setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}) scale(#{scaleX} #{scaleY})"
	    // inner.children[0].setAttributeNS("http://www.w3.org/2000/svg", "transform-origin", "#{toX + rotateX}px #{toY + rotateY}px")
	    currentStyle = inner.children[0].getAttribute('style') || '';
	    currentStyle = currentStyle.replace('transform', '_transform');
	    inner.children[0].removeAttribute('transform');
	    inner.children[0].removeAttribute('transform-origin');
	    inner.children[0].setAttribute('style', `${currentStyle}; transform-origin: ${toX + rotateX}px ${toY + rotateY}px; transform: translate(${tX}px, ${tY}px) rotate(${rotate}deg) scale(${scaleX}, ${scaleY});`);
	    // inner.children[0].setAttribute("transform-origin", "#{toX} #{toY}")
	    // inner.children[0].style['transformOrigin'] = "#{toX} #{toY}"
	    // inner.children[0].setAttributeNS("http://www.w3.org/2000/svg", "style", "transform-origin: \"#{toX} #{toY}\";")
	    layerSvg.insertAdjacentElement('afterbegin', inner);
	  }
	  if (node.nodeName === 'use') {
	    layerSvg.setAttribute('width', nodeBBox.width || nodeBounds.width);
	    layerSvg.setAttribute('height', nodeBBox.height || nodeBounds.height);
	    defs = getUseDefs$1(node);
	    if (defs) {
	      for (k = 0, len1 = defs.length; k < len1; k++) {
	        def = defs[k];
	        layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def);
	      }
	    }
	    tX = -nodeBBox.x;
	    tY = -nodeBBox.y;
	    toX = nodeBBox.width / 2;
	    toY = nodeBBox.height / 2;
	    [rotate, rotateX, rotateY] = [0, 0, 0];
	    [scaleX, scaleY] = [1, 1];
	    if (qt) {
	      if (qt.angle) {
	        toX += nodeBounds.width - nodeBBox.width;
	        toY += nodeBounds.height - nodeBBox.height;
	        rotate = qt.angle;
	        rotateX = (nodeBBox.width / 2) + nodeBBox.x - toX;
	        rotateY = (nodeBBox.height / 2) + nodeBBox.y - toY;
	      }
	      // compensate origin distortion when nodeBBox.width differs from nodeBounds.width (scale + translate together)
	      tX += (nodeBounds.width - nodeBBox.width) / 2;
	      tY += (nodeBounds.height - nodeBBox.height) / 2;
	      scaleX = qt.scaleX;
	      scaleY = qt.scaleY;
	    }
	    inner = node.cloneNode();
	    // inner.setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}, #{rotateX}, #{rotateY}) scale(#{scaleX} #{scaleY})"
	    // inner.setAttributeNS("http://www.w3.org/2000/svg", "transform-origin", "#{toX} #{toY}");
	    currentStyle = inner.getAttribute('style') || '';
	    currentStyle = currentStyle.replace('transform', '_transform');
	    inner.removeAttribute('transform');
	    inner.removeAttribute('transform-origin');
	    inner.setAttribute('style', `${currentStyle}; transform-origin: ${toX + rotateX}px ${toY + rotateY}px; transform: translate(${tX}px, ${tY}px) rotate(${rotate}deg) scale(${scaleX}, ${scaleY});`);
	    layerSvg.insertAdjacentElement('afterbegin', inner);
	  // else if node.nodeName == 'g'
	  //     # these groups do not render any svg
	  //     if qt and qt.angle
	  //         layerParams.rotation = qt.angle
	  } else if (node.nodeName !== 'g' || (node.nodeName === 'g' && skipChildren)) {
	    tX = -nodeBBox.x;
	    tY = -nodeBBox.y;
	    [rotate, rotateX, rotateY] = [0, 0, 0];
	    [scaleX, scaleY] = [1, 1];
	    toX = nodeBBox.width / 2;
	    toY = nodeBBox.height / 2;
	    layerSvg.setAttribute('width', nodeBBox.width || nodeBounds.width);
	    layerSvg.setAttribute('height', nodeBBox.height || nodeBounds.height);
	    defs = getUseDefs$1(node);
	    if (defs) {
	      for (l = 0, len2 = defs.length; l < len2; l++) {
	        def = defs[l];
	        layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def);
	      }
	    }
	    // check if theres a g ancestor applying a rotation
	    ancestorT = node.parentNode.closest('[transform]');
	    if (ancestorT) {
	      t = getMatrixTransform$1(ancestorT);
	      if (t.angle) {
	        rotate += t.angle;
	      }
	    }
	    if (qt) {
	      if (qt.angle) {
	        toX += nodeBounds.width - nodeBBox.width;
	        toY += nodeBounds.height - nodeBBox.height;
	        rotate += qt.angle;
	        rotateX += (nodeBBox.width / 2) + nodeBBox.x - toX;
	        rotateY += (nodeBBox.height / 2) + nodeBBox.y - toY;
	      }
	      scaleX = qt.scaleX;
	      scaleY = qt.scaleY;
	      // compensate origin distortion when nodeBBox.width differs from nodeBounds.width (scale + translate together)
	      tX += (nodeBounds.width - nodeBBox.width) / 2;
	      tY += (nodeBounds.height - nodeBBox.height) / 2;
	    }
	    inner = node.cloneNode(true);
	    // inner.setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}, #{rotateX}, #{rotateY}) scale(#{scaleX} #{scaleY})"
	    // inner.setAttributeNS("http://www.w3.org/2000/svg", "transform-origin", "#{toX} #{toY}");
	    currentStyle = inner.getAttribute('style') || '';
	    currentStyle = currentStyle.replace('transform', '_transform');
	    inner.removeAttribute('transform');
	    inner.removeAttribute('transform-origin');
	    inner.setAttribute('style', `${currentStyle}; transform-origin: ${toX + rotateX}px ${toY + rotateY}px; transform: translate(${tX}px, ${tY}px) rotate(${rotate}deg) scale(${scaleX}, ${scaleY});`);
	    layerSvg.insertAdjacentElement('afterbegin', inner);
	  }
	  /*
	   * Extra layer info
	   */
	  if (node.hasAttribute('fill') || (computedStyle.fill && computedStyle.fill !== 'none')) {
	    fill = node.getAttribute('fill') || computedStyle.fill;
	    if (fill.match('url')) {
	      // removes "" and ''
	      url = fill.replace('url("', 'url(').replace('url(\'', 'url(').replace(/\"\)$/, ')').replace(/\'\)$/, ')');
	      fillSelector = url.replace(/(^url\((.+)\)$)/, '$2');
	      // apply the id selector if the url() didn't contain it before
	      if (fillSelector.substring(0, 1) !== '#') {
	        fillSelector = `\#${fillSelector}`;
	      }
	      fill = svg.querySelector(fillSelector);
	      layerSvg.querySelector('defs').insertAdjacentElement('beforeend', fill.cloneNode(true));
	    }
	    if (node.nodeName !== 'mask' && node.nodeName !== 'clip-path' && computedStyle.fill && !node.hasAttribute('fill')) {
	      ref = layerSvg.children;
	      for (m = 0, len3 = ref.length; m < len3; m++) {
	        child = ref[m];
	        if (child.nodeName === node.nodeName) {
	          child.setAttribute('fill', computedStyle.fill);
	        }
	      }
	    }
	  } else {
	    ref1 = layerSvg.children;
	    // get node inside layerSvg and set a fill transparent
	    for (n = 0, len4 = ref1.length; n < len4; n++) {
	      child = ref1[n];
	      if (child.nodeName === node.nodeName) {
	        child.setAttribute('fill', 'transparent');
	      }
	    }
	  }
	  // some clip-paths are applied as classes
	  if (!isFirefox && (node.hasAttribute('clip-path') || (computedStyle.clipPath && computedStyle.clipPath !== 'none'))) {
	    url = node.getAttribute('clip-path') || computedStyle.clipPath;
	    // removes "" and ''
	    url = url.replace('url("', 'url(').replace('url(\'', 'url(').replace(/\"\)$/, ')').replace(/\'\)$/, ')');
	    clipSelector = url.replace(/(^url\((.+)\)$)/, '$2');
	    // apply the id selector if the url() didn't contain it before
	    if (clipSelector.substring(0, 1) !== '#') {
	      clipSelector = `\#${clipSelector}`;
	    }
	    clipPath = svg.querySelector(clipSelector);
	    clipPathInner = clipPath.querySelector(':scope > *'); // path or rect usually
	    clipPathInnerBBox = null;
	    clipPathBBox = clipPath.getBBox();
	    clipPathBounds = clipPath.getBoundingClientRect();
	    // if there's a path inside clipPath, consider that to calculate position,
	    // since in webkit there's some bugs with getBBox on hidden elements
	    if (clipPathInner) {
	      clipPathInnerBBox = clipPathInner.getBBox();
	      clipPathBBox = clipPathInnerBBox;
	      clipPathBounds = clipPathInner.getBoundingClientRect();
	    }
	    layerParams.width = clipPathBBox.width;
	    layerParams.height = clipPathBBox.height;
	    // bug? some layers come with a wrong getBoundingClientRect(), like x: -2000.
	    // trying to simplify with 0.
	    if (clipPathInner && clipPathInnerBBox && clipPathInnerBBox.x === 0 && clipPathInnerBBox.y === 0) {
	      layerParams.x = 0;
	      layerParams.y = 0;
	    } else {
	      layerParams.x = clipPathBounds.x || clipPathBounds.left;
	      layerParams.y = clipPathBounds.y || clipPathBounds.top;
	      if (parentLayer) {
	        layerParams.x -= parentLayer.screenFrame.x;
	        layerParams.y -= parentLayer.screenFrame.y;
	      }
	    }
	    if (qt) {
	      layerParams.x += qt.translateX;
	      layerParams.y += qt.translateY;
	    }
	    // layerParams.x = 0
	    // layerParams.y = 0
	    layerParams.clip = true;
	    if (clipPath.children.length === 1 && node.children.length === 1 && node.children[0].nodeName === 'path') {
	      path = node.children[0];
	      layerParams.backgroundColor = path.getAttribute('fill');
	    }
	  }
	  if (node.hasAttribute('opacity')) {
	    layerParams.opacity = parseFloat(node.getAttribute('opacity'));
	  }
	  if (node.hasAttribute('filter')) {
	    filterSelector = node.getAttribute('filter').replace(/(^url\()(.+)(\)$)/, '$2');
	    filter = svg.querySelector(filterSelector);
	    filterClone = filter.cloneNode(true);
	    layerSvg.querySelector('defs').insertAdjacentElement('beforeend', filterClone);
	    ref2 = layerSvg.children;
	    // since filter is not working yet, disable it
	    for (o = 0, len5 = ref2.length; o < len5; o++) {
	      child = ref2[o];
	      if (child.nodeName === node.nodeName) {
	        child.removeAttribute('filter');
	      }
	    }
	  }
	  if (!isFirefox && node.closest('[mask]')) {
	    ancestor = node.closest('[mask]');
	    maskSelector = ancestor.getAttribute('mask').replace(/(^url\()(.+)(\)$)/, '$2');
	    mask = svg.querySelector(maskSelector);
	    maskClone = mask.cloneNode(true);
	    useBBox = null;
	    if (node.nodeName === 'g' && node.children.length === 1 && node.children[0].nodeName === 'use') {
	      use = node.children[0];
	      useBBox = use.getBBox();
	    }
	    ref3 = mask.querySelectorAll('*');
	    for (index = p = 0, len6 = ref3.length; p < len6; index = ++p) {
	      child = ref3[index];
	      if (child.nodeName === 'use' || child.nodeName === 'rect' || child.nodeName === 'path') {
	        defs = getUseDefs$1(child);
	        for (q = 0, len7 = defs.length; q < len7; q++) {
	          def = defs[q];
	          layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def);
	        }
	        childBBox = child.getBBox();
	        childBounds = child.getBoundingClientRect();
	        childOriginalT = child.getAttribute('transform') && child.getAttribute('transform').match(/translate\(([^)]+)\)/);
	        linkedSelector = child.getAttribute("xlink:href");
	        linked = svg.querySelectorAll(linkedSelector)[0];
	        childTx = childBounds.x || childBounds.left;
	        childTy = childBounds.y || childBounds.top;
	        [rotate, rotateX, rotateY] = [0, 0, 0];
	        [scaleX, scaleY] = [1, 1];
	        toX = childBBox.width / 2;
	        toY = childBBox.height / 2;
	        if (parentLayer) {
	          childTx -= parentLayer.screenFrame.x;
	          childTy -= parentLayer.screenFrame.y;
	        }
	        if (node.nodeName === 'g' && node.parentNode && node.parentNode.nodeName === 'g') {
	          parentNodeBBox = node.parentNode.getBBox();
	          childTx += parentNodeBBox.x - nodeBBox.x - childBBox.x;
	          childTy += parentNodeBBox.y - nodeBBox.y - childBBox.y;
	        } else {
	          childTx = nodeBBox.x - childBBox.x;
	          childTy = nodeBBox.y - childBBox.y;
	        }
	        // apply transforms over the clone, not the original svg
	        childClone = maskClone.querySelectorAll('*')[index];
	        // childClone.setAttribute 'transform', "translate(#{childTx} #{childTy}) rotate(#{rotate}, #{rotateX}, #{rotateY}) scale(#{scaleX} #{scaleY})"
	        // childClone.setAttributeNS("http://www.w3.org/2000/svg", "transform-origin", "#{toX} #{toY}")
	        currentStyle = childClone.getAttribute('style') || '';
	        currentStyle = currentStyle.replace('transform', '_transform');
	        childClone.removeAttribute('transform');
	        childClone.removeAttribute('transform-origin');
	        childClone.setAttribute('style', `${currentStyle}; transform-origin: ${toX + rotateX}px ${toY + rotateY}px; transform: translate(${childTx}px, ${childTy}px) rotate(${rotate}deg) scale(${scaleX}, ${scaleY});`);
	      }
	    }
	    ref4 = layerSvg.children;
	    // apply mask attribute if node does not already have it
	    for (r = 0, len8 = ref4.length; r < len8; r++) {
	      child = ref4[r];
	      if (child.nodeName === node.nodeName) {
	        if (node.hasAttribute('transform')) {
	          // encapsulate with g if the layer has a transform, so that the mask isnt affected
	          g = document.createElement('g');
	          layerSvg.removeChild(child);
	          g.appendChild(child);
	          g.setAttribute('mask', `url(${maskSelector})`);
	          layerSvg.insertAdjacentElement('afterbegin', g);
	        } else if (!child.hasAttribute('mask')) {
	          child.setAttribute('mask', `url(${maskSelector})`);
	        }
	      }
	    }
	    // adds mask to layerSvg
	    layerSvg.insertAdjacentElement('afterbegin', maskClone);
	  }
	  // TODO: print only the css required for the node to render. maybe render svg
	  // style only one time, parse it and reuse it everytime to get the right string?
	  if (node.hasAttribute('class')) {
	    style = svg.querySelector('style');
	    if (style) {
	      layerSvg.querySelector('defs').insertAdjacentElement('afterbegin', style.cloneNode(true));
	    }
	  }
	  if (node.nodeName === 'line') {
	    strokeWidth = computedStyle['stroke-width'] ? parseFloat(computedStyle['stroke-width'].replace('px', '')) : 1;
	    layerSvg.setAttribute('height', strokeWidth);
	    layerParams.height += strokeWidth;
	  }
	  /*
	   * End of inner html
	   */
	  // applies svg to image data
	  layerParams.image = `data:image/svg+xml;charset=UTF-8,${encodeURI(layerSvg.outerHTML.replace(/\n|\t/g, ' ')).replace(/\"/g, "\\\"").replace(/\'/g, "\\'") // removes line breaks
}`;
	  layerParams.height = Math.ceil(layerParams.height);
	  layerParams.width = Math.ceil(layerParams.width);
	  if (node.nodeName === 'svg') {
	    layerParams.x = nodeBounds.x || nodeBounds.left;
	    layerParams.y = nodeBounds.y || nodeBounds.top;
	    layerParams.width = nodeBounds.width;
	    layerParams.height = nodeBounds.height;
	    layerParams.clip = true;
	  }
	  // editableSvg makes it possible to edit the svg slices via Framer svg api
	  if (this.editableSvg) {
	    /*
	        There's a bug when loading multiple SVG's whose defs contents are
	        repeated ids. xlink:href can't link to the right path.

	        The solution was to apply unique IDs to each new svg generated.
	    */
	    if (!layerSvg.hasAttribute('width')) {
	      layerSvg.setAttribute('width', 0);
	    }
	    if (!layerSvg.hasAttribute('height')) {
	      layerSvg.setAttribute('height', 0);
	    }
	    layerParams.image = '';
	    ref5 = layerSvg.children;
	    for (index = s = 0, len9 = ref5.length; s < len9; index = ++s) {
	      child = ref5[index];
	      // getting valid children (those that are not defs / style tags)
	      if (!child.nodeName.match(/defs/gi) && child.nodeName !== 'style') {
	        // Apply ids and 'name's so that framer can treat them as editable paths
	        if (child.id) {
	          child.setAttribute('name', child.id);
	        } else {
	          child.id = `layer_${this.layerCount}`;
	          child.setAttribute('name', `layer_${this.layerCount}`);
	        }
	        // Since framer forces an opacity:1 to path elements, we assure this
	        // opacity will be applied to the root svg
	        if (child.style.opacity) {
	          layerSvg.style.opacity = child.style.opacity;
	        } else if (child.nodeName === 'g' && child.children.length === 1 && child.children[0].style.opacity) {
	          layerSvg.style.opacity = child.children[0].style.opacity;
	        }
	      }
	    }
	    svgIds = [];
	    ref6 = layerSvg.querySelectorAll('[id]');
	    for (u = 0, len10 = ref6.length; u < len10; u++) {
	      def = ref6[u];
	      svgIds.push(def.id);
	    }
	    svgStr = layerSvg.outerHTML.replace(/\n|\t/g, ' ');
	    // replacing prior id references to the new unique ids.
	    // TODO: create a clean RegExp that accounts for '," and # at the same time
	    if (svgIds.length && this.layerCount) {
	      for (v = 0, len11 = svgIds.length; v < len11; v++) {
	        id = svgIds[v];
	        svgStr = svgStr.replace(new RegExp("&quot;", "g"), "").replace(new RegExp(`url\\(\#${id}\\)`, "g"), `url(#${id}_${this.layerCount})`).replace(new RegExp(`url\\(${id}\\)`, "g"), `url(${id}_${this.layerCount})`).replace(new RegExp(`id=\\"${id}\\"`, "g"), `id="${id}_${this.layerCount}"`).replace(new RegExp(`id=\\'${id}\'`, "g"), `id=\'${id}_${this.layerCount}\'`).replace(new RegExp(`xlink:href=\\"\#${id}\\"`, "g"), `xlink:href="#${id}_${this.layerCount}"`).replace(new RegExp(`xlink:href=\\'#${id}\\'`, "g"), `xlink:href=\'#${id}_${this.layerCount}\'`).replace(new RegExp(`xlink:href=\\"${id}\\"`, "g"), `xlink:href="${id}_${this.layerCount}"`).replace(new RegExp(`xlink:href=\\'${id}\\'`, "g"), `xlink:href=\'${id}_${this.layerCount}\'`);
	        this.layerCount += 1;
	      }
	    }
	    layerParams.svg = svgStr;
	    layer = new SVGLayer(layerParams);
	    if (parentLayer) {
	      layer.parent = parentLayer;
	    }
	    createdLayer = layer;
	    ref7 = layer.svg.querySelectorAll('[style]');
	    // framer svg setup sets opacity to 1, this overrides any class that is applied
	    for (w = 0, len12 = ref7.length; w < len12; w++) {
	      el = ref7[w];
	      el.style.opacity = null;
	    }
	  } else {
	    layer = new Layer(layerParams);
	    if (parentLayer) {
	      layer.parent = parentLayer;
	    }
	    createdLayer = layer;
	  }
	  // if name == 'path1' or name == 'path2' or name == 'path3' or name == 'path4'
	  //     layer.style['border'] = '1px solid green'
	  //     console.log layer.image
	  //     console.log node.outerHTML
	  //     console.log '___'

	  // continue traversing
	  if (!skipChildren) {
	    ref8 = node.children;
	    results = [];
	    for (i = x = 0, len13 = ref8.length; x < len13; i = ++x) {
	      child = ref8[i];
	      results.push(traverse.call(this, child, node, createdLayer != null ? createdLayer : {
	        createdLayer: null
	      }));
	    }
	    return results;
	  }
	};

	var loadFile$1, setupContainer$1, traverse$1;

	loadFile$1 = loadFile;

	setupContainer$1 = setupContainer;

	traverse$1 = traverse_1;

	var SvgImporter = (function() {
	  class SvgImporter {
	    constructor(options = {
	        files: [],
	        editableSvg: false
	      }) {
	      var file, i, index, len, ref;
	      this.options = options;
	      this.files = this.options.files;
	      this.editableSvg = this.options.editableSvg;
	      if (!this.files) {
	        return false;
	      }
	      this.loading = true;
	      this.setupContainer();
	      ref = this.files;
	      for (index = i = 0, len = ref.length; i < len; index = ++i) {
	        file = ref[index];
	        this.loadFile(file, index);
	      }
	      this.svgContainer.classList.add('hidden');
	    }

	    loadFile(file, index) {
	      var hasRootG, i, len, svgEl, svgTraverseEl;
	      loadFile$1.call(this, file, index);
	      svgTraverseEl = document.querySelectorAll(`[data-import-id='${index}'] svg > :not(defs):not(title):not(desc):not(style)`);
	      hasRootG = document.querySelectorAll(`[data-import-id='${index}'] svg > g`).length === 1 ? true : false;
	      // traversing
	      if (hasRootG) {
	        for (i = 0, len = svgTraverseEl.length; i < len; i++) {
	          svgEl = svgTraverseEl[i];
	          traverse$1.call(this, svgEl);
	        }
	      } else {
	        traverse$1.call(this, document.querySelector(`[data-import-id='${index}'] svg`));
	      }
	      if (index === this.files.length - 1) {
	        return this.loading = false;
	      }
	    }

	  }
	  SvgImporter.prototype.type = 'svg';

	  SvgImporter.prototype.loading = false;

	  SvgImporter.prototype.svgContainer = null;

	  SvgImporter.prototype.files = [];

	  SvgImporter.prototype.editableSvg = false;

	  SvgImporter.prototype.setupContainer = setupContainer$1;

	  SvgImporter.prototype.layerCount = 0;

	  return SvgImporter;

	}).call(commonjsGlobal);

	var svgImporter = {
		SvgImporter: SvgImporter
	};

	var timeDefault, timeFast;

	timeDefault = 0.5;

	timeFast = 0.2;

	var transitions = {
	  fade: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      },
	      layerB: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  },
	  slideUp: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeFast
	          }
	        },
	        hide: {
	          opacity: 0.5,
	          options: {
	            time: timeFast
	          }
	        }
	      },
	      layerB: {
	        show: {
	          y: 0,
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          y: 500,
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  },
	  slideDown: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeFast
	          }
	        },
	        hide: {
	          opacity: 0.5,
	          options: {
	            time: timeFast
	          }
	        }
	      },
	      layerB: {
	        show: {
	          y: 0,
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          y: -500,
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  },
	  slideLeft: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeFast
	          }
	        },
	        hide: {
	          opacity: 0.5,
	          options: {
	            time: timeFast
	          }
	        }
	      },
	      layerB: {
	        show: {
	          x: 0,
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          x: 500,
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  },
	  slideRight: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeFast
	          }
	        },
	        hide: {
	          opacity: 0.5,
	          options: {
	            time: timeFast
	          }
	        }
	      },
	      layerB: {
	        show: {
	          x: 0,
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          x: -500,
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  }
	};

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	var _listCacheClear = listCacheClear;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	var eq_1 = eq;

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq_1(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	var _assocIndexOf = assocIndexOf;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	var _listCacheDelete = listCacheDelete;

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	var _listCacheGet = listCacheGet;

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return _assocIndexOf(this.__data__, key) > -1;
	}

	var _listCacheHas = listCacheHas;

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	var _listCacheSet = listCacheSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = _listCacheClear;
	ListCache.prototype['delete'] = _listCacheDelete;
	ListCache.prototype.get = _listCacheGet;
	ListCache.prototype.has = _listCacheHas;
	ListCache.prototype.set = _listCacheSet;

	var _ListCache = ListCache;

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new _ListCache;
	  this.size = 0;
	}

	var _stackClear = stackClear;

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	var _stackDelete = stackDelete;

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	var _stackGet = stackGet;

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	var _stackHas = stackHas;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = _freeGlobal || freeSelf || Function('return this')();

	var _root = root;

	/** Built-in value references. */
	var Symbol = _root.Symbol;

	var _Symbol = Symbol;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$1.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString$1.call(value);
	}

	var _objectToString = objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag$1 && symToStringTag$1 in Object(value))
	    ? _getRawTag(value)
	    : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject_1(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = _baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1 = isFunction;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = _root['__core-js_shared__'];

	var _coreJsData = coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked;

	/** Used for built-in method references. */
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto$1 = Function.prototype,
	    objectProto$2 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject_1(value) || _isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(_toSource(value));
	}

	var _baseIsNative = baseIsNative;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = _getValue(object, key);
	  return _baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative;

	/* Built-in method references that are verified to be native. */
	var Map = _getNative(_root, 'Map');

	var _Map = Map;

	/* Built-in method references that are verified to be native. */
	var nativeCreate = _getNative(Object, 'create');

	var _nativeCreate = nativeCreate;

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
	  this.size = 0;
	}

	var _hashClear = hashClear;

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _hashDelete = hashDelete;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto$3 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (_nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
	}

	var _hashGet = hashGet;

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
	}

	var _hashHas = hashHas;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
	  return this;
	}

	var _hashSet = hashSet;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = _hashClear;
	Hash.prototype['delete'] = _hashDelete;
	Hash.prototype.get = _hashGet;
	Hash.prototype.has = _hashHas;
	Hash.prototype.set = _hashSet;

	var _Hash = Hash;

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new _Hash,
	    'map': new (_Map || _ListCache),
	    'string': new _Hash
	  };
	}

	var _mapCacheClear = mapCacheClear;

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	var _isKeyable = isKeyable;

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return _isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	var _getMapData = getMapData;

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = _getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _mapCacheDelete = mapCacheDelete;

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return _getMapData(this, key).get(key);
	}

	var _mapCacheGet = mapCacheGet;

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return _getMapData(this, key).has(key);
	}

	var _mapCacheHas = mapCacheHas;

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = _getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	var _mapCacheSet = mapCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = _mapCacheClear;
	MapCache.prototype['delete'] = _mapCacheDelete;
	MapCache.prototype.get = _mapCacheGet;
	MapCache.prototype.has = _mapCacheHas;
	MapCache.prototype.set = _mapCacheSet;

	var _MapCache = MapCache;

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof _ListCache) {
	    var pairs = data.__data__;
	    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new _MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	var _stackSet = stackSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new _ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = _stackClear;
	Stack.prototype['delete'] = _stackDelete;
	Stack.prototype.get = _stackGet;
	Stack.prototype.has = _stackHas;
	Stack.prototype.set = _stackSet;

	var _Stack = Stack;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED$2);
	  return this;
	}

	var _setCacheAdd = setCacheAdd;

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	var _setCacheHas = setCacheHas;

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;

	  this.__data__ = new _MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
	SetCache.prototype.has = _setCacheHas;

	var _SetCache = SetCache;

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	var _arraySome = arraySome;

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	var _cacheHas = cacheHas;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

	  stack.set(array, other);
	  stack.set(other, array);

	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!_arraySome(other, function(othValue, othIndex) {
	            if (!_cacheHas(seen, othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
	              return seen.push(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, bitmask, customizer, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  stack['delete'](other);
	  return result;
	}

	var _equalArrays = equalArrays;

	/** Built-in value references. */
	var Uint8Array = _root.Uint8Array;

	var _Uint8Array = Uint8Array;

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	var _mapToArray = mapToArray;

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	var _setToArray = setToArray;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$1 = 1,
	    COMPARE_UNORDERED_FLAG$1 = 2;

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]';

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = _Symbol ? _Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;

	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
	        return false;
	      }
	      return true;

	    case boolTag:
	    case dateTag:
	    case numberTag:
	      // Coerce booleans to `1` or `0` and dates to milliseconds.
	      // Invalid dates are coerced to `NaN`.
	      return eq_1(+object, +other);

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag:
	      var convert = _mapToArray;

	    case setTag:
	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
	      convert || (convert = _setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= COMPARE_UNORDERED_FLAG$1;

	      // Recursively compare objects (susceptible to call stack limits).
	      stack.set(object, other);
	      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
	      stack['delete'](object);
	      return result;

	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	var _equalByTag = equalByTag;

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	var _arrayPush = arrayPush;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	var isArray_1 = isArray;

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
	}

	var _baseGetAllKeys = baseGetAllKeys;

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}

	var _arrayFilter = arrayFilter;

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}

	var stubArray_1 = stubArray;

	/** Used for built-in method references. */
	var objectProto$5 = Object.prototype;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
	    return propertyIsEnumerable.call(object, symbol);
	  });
	};

	var _getSymbols = getSymbols;

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	var _baseTimes = baseTimes;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
	}

	var _baseIsArguments = baseIsArguments;

	/** Used for built-in method references. */
	var objectProto$6 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
	  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
	    !propertyIsEnumerable$1.call(value, 'callee');
	};

	var isArguments_1 = isArguments;

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	var stubFalse_1 = stubFalse;

	var isBuffer_1 = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse_1;

	module.exports = isBuffer;
	});

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	var _isIndex = isIndex;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER$1 = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
	}

	var isLength_1 = isLength;

	/** `Object#toString` result references. */
	var argsTag$1 = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag$1 = '[object Boolean]',
	    dateTag$1 = '[object Date]',
	    errorTag$1 = '[object Error]',
	    funcTag$1 = '[object Function]',
	    mapTag$1 = '[object Map]',
	    numberTag$1 = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag$1 = '[object RegExp]',
	    setTag$1 = '[object Set]',
	    stringTag$1 = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag$1 = '[object ArrayBuffer]',
	    dataViewTag$1 = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
	typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
	typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
	typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
	typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
	typedArrayTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike_1(value) &&
	    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
	}

	var _baseIsTypedArray = baseIsTypedArray;

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	var _baseUnary = baseUnary;

	var _nodeUtil = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && _freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
	});

	/* Node.js helper references. */
	var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

	var isTypedArray_1 = isTypedArray;

	/** Used for built-in method references. */
	var objectProto$7 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray_1(value),
	      isArg = !isArr && isArguments_1(value),
	      isBuff = !isArr && !isArg && isBuffer_1(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? _baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty$5.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           _isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _arrayLikeKeys = arrayLikeKeys;

	/** Used for built-in method references. */
	var objectProto$8 = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

	  return value === proto;
	}

	var _isPrototype = isPrototype;

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	var _overArg = overArg;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = _overArg(Object.keys, Object);

	var _nativeKeys = nativeKeys;

	/** Used for built-in method references. */
	var objectProto$9 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$6 = objectProto$9.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!_isPrototype(object)) {
	    return _nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeys = baseKeys;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength_1(value.length) && !isFunction_1(value);
	}

	var isArrayLike_1 = isArrayLike;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
	}

	var keys_1 = keys;

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return _baseGetAllKeys(object, keys_1, _getSymbols);
	}

	var _getAllKeys = getAllKeys;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$2 = 1;

	/** Used for built-in method references. */
	var objectProto$10 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$7 = objectProto$10.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
	      objProps = _getAllKeys(object),
	      objLength = objProps.length,
	      othProps = _getAllKeys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);
	  stack.set(other, object);

	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  stack['delete'](other);
	  return result;
	}

	var _equalObjects = equalObjects;

	/* Built-in method references that are verified to be native. */
	var DataView = _getNative(_root, 'DataView');

	var _DataView = DataView;

	/* Built-in method references that are verified to be native. */
	var Promise = _getNative(_root, 'Promise');

	var _Promise = Promise;

	/* Built-in method references that are verified to be native. */
	var Set = _getNative(_root, 'Set');

	var _Set = Set;

	/* Built-in method references that are verified to be native. */
	var WeakMap = _getNative(_root, 'WeakMap');

	var _WeakMap = WeakMap;

	/** `Object#toString` result references. */
	var mapTag$2 = '[object Map]',
	    objectTag$1 = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag$2 = '[object Set]',
	    weakMapTag$1 = '[object WeakMap]';

	var dataViewTag$2 = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = _toSource(_DataView),
	    mapCtorString = _toSource(_Map),
	    promiseCtorString = _toSource(_Promise),
	    setCtorString = _toSource(_Set),
	    weakMapCtorString = _toSource(_WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = _baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
	    (_Map && getTag(new _Map) != mapTag$2) ||
	    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
	    (_Set && getTag(new _Set) != setTag$2) ||
	    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
	  getTag = function(value) {
	    var result = _baseGetTag(value),
	        Ctor = result == objectTag$1 ? value.constructor : undefined,
	        ctorString = Ctor ? _toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag$2;
	        case mapCtorString: return mapTag$2;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag$2;
	        case weakMapCtorString: return weakMapTag$1;
	      }
	    }
	    return result;
	  };
	}

	var _getTag = getTag;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$3 = 1;

	/** `Object#toString` result references. */
	var argsTag$2 = '[object Arguments]',
	    arrayTag$1 = '[object Array]',
	    objectTag$2 = '[object Object]';

	/** Used for built-in method references. */
	var objectProto$11 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$8 = objectProto$11.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	  var objIsArr = isArray_1(object),
	      othIsArr = isArray_1(other),
	      objTag = objIsArr ? arrayTag$1 : _getTag(object),
	      othTag = othIsArr ? arrayTag$1 : _getTag(other);

	  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
	  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

	  var objIsObj = objTag == objectTag$2,
	      othIsObj = othTag == objectTag$2,
	      isSameTag = objTag == othTag;

	  if (isSameTag && isBuffer_1(object)) {
	    if (!isBuffer_1(other)) {
	      return false;
	    }
	    objIsArr = true;
	    objIsObj = false;
	  }
	  if (isSameTag && !objIsObj) {
	    stack || (stack = new _Stack);
	    return (objIsArr || isTypedArray_1(object))
	      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
	      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	  }
	  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
	    var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new _Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new _Stack);
	  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	}

	var _baseIsEqualDeep = baseIsEqualDeep;

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Unordered comparison
	 *  2 - Partial comparison
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, bitmask, customizer, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
	    return value !== value && other !== other;
	  }
	  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	}

	var _baseIsEqual = baseIsEqual;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$4 = 1,
	    COMPARE_UNORDERED_FLAG$2 = 2;

	/**
	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Object} source The object of property values to match.
	 * @param {Array} matchData The property names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, source, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = Object(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var stack = new _Stack;
	      if (customizer) {
	        var result = customizer(objValue, srcValue, key, object, source, stack);
	      }
	      if (!(result === undefined
	            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	var _baseIsMatch = baseIsMatch;

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject_1(value);
	}

	var _isStrictComparable = isStrictComparable;

	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = keys_1(object),
	      length = result.length;

	  while (length--) {
	    var key = result[length],
	        value = object[key];

	    result[length] = [key, value, _isStrictComparable(value)];
	  }
	  return result;
	}

	var _getMatchData = getMatchData;

	/**
	 * A specialized version of `matchesProperty` for source values suitable
	 * for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function matchesStrictComparable(key, srcValue) {
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    return object[key] === srcValue &&
	      (srcValue !== undefined || (key in Object(object)));
	  };
	}

	var _matchesStrictComparable = matchesStrictComparable;

	/**
	 * The base implementation of `_.matches` which doesn't clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatches(source) {
	  var matchData = _getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
	  }
	  return function(object) {
	    return object === source || _baseIsMatch(object, source, matchData);
	  };
	}

	var _baseMatches = baseMatches;

	/** `Object#toString` result references. */
	var symbolTag$1 = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
	}

	var isSymbol_1 = isSymbol;

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray_1(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol_1(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	var _isKey = isKey;

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || _MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize.Cache = _MapCache;

	var memoize_1 = memoize;

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize_1(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	var _memoizeCapped = memoizeCapped;

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = _memoizeCapped(function(string) {
	  var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	var _stringToPath = stringToPath;

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	var _arrayMap = arrayMap;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
	    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray_1(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return _arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol_1(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	var _baseToString = baseToString;

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : _baseToString(value);
	}

	var toString_1 = toString;

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value, object) {
	  if (isArray_1(value)) {
	    return value;
	  }
	  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
	}

	var _castPath = castPath;

	/** Used as references for various `Number` constants. */
	var INFINITY$1 = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol_1(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
	}

	var _toKey = toKey;

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = _castPath(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[_toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	var _baseGet = baseGet;

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : _baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	var get_1 = get;

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return object != null && key in Object(object);
	}

	var _baseHasIn = baseHasIn;

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = _castPath(path, object);

	  var index = -1,
	      length = path.length,
	      result = false;

	  while (++index < length) {
	    var key = _toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result || ++index != length) {
	    return result;
	  }
	  length = object == null ? 0 : object.length;
	  return !!length && isLength_1(length) && _isIndex(key, length) &&
	    (isArray_1(object) || isArguments_1(object));
	}

	var _hasPath = hasPath;

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && _hasPath(object, path, _baseHasIn);
	}

	var hasIn_1 = hasIn;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$5 = 1,
	    COMPARE_UNORDERED_FLAG$3 = 2;

	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  if (_isKey(path) && _isStrictComparable(srcValue)) {
	    return _matchesStrictComparable(_toKey(path), srcValue);
	  }
	  return function(object) {
	    var objValue = get_1(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn_1(object, path)
	      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
	  };
	}

	var _baseMatchesProperty = baseMatchesProperty;

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	var identity_1 = identity;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	var _baseProperty = baseProperty;

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return _baseGet(object, path);
	  };
	}

	var _basePropertyDeep = basePropertyDeep;

	/**
	 * Creates a function that returns the value at `path` of a given object.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': 2 } },
	 *   { 'a': { 'b': 1 } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b'));
	 * // => [2, 1]
	 *
	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
	 * // => [1, 2]
	 */
	function property(path) {
	  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
	}

	var property_1 = property;

	/**
	 * The base implementation of `_.iteratee`.
	 *
	 * @private
	 * @param {*} [value=_.identity] The value to convert to an iteratee.
	 * @returns {Function} Returns the iteratee.
	 */
	function baseIteratee(value) {
	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
	  if (typeof value == 'function') {
	    return value;
	  }
	  if (value == null) {
	    return identity_1;
	  }
	  if (typeof value == 'object') {
	    return isArray_1(value)
	      ? _baseMatchesProperty(value[0], value[1])
	      : _baseMatches(value);
	  }
	  return property_1(value);
	}

	var _baseIteratee = baseIteratee;

	/**
	 * Creates a `_.find` or `_.findLast` function.
	 *
	 * @private
	 * @param {Function} findIndexFunc The function to find the collection index.
	 * @returns {Function} Returns the new find function.
	 */
	function createFind(findIndexFunc) {
	  return function(collection, predicate, fromIndex) {
	    var iterable = Object(collection);
	    if (!isArrayLike_1(collection)) {
	      var iteratee = _baseIteratee(predicate, 3);
	      collection = keys_1(collection);
	      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
	    }
	    var index = findIndexFunc(collection, predicate, fromIndex);
	    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
	  };
	}

	var _createFind = createFind;

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	var _baseFindIndex = baseFindIndex;

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol_1(value)) {
	    return NAN;
	  }
	  if (isObject_1(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject_1(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	var toNumber_1 = toNumber;

	/** Used as references for various `Number` constants. */
	var INFINITY$2 = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308;

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber_1(value);
	  if (value === INFINITY$2 || value === -INFINITY$2) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	var toFinite_1 = toFinite;

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite_1(value),
	      remainder = result % 1;

	  return result === result ? (remainder ? result - remainder : result) : 0;
	}

	var toInteger_1 = toInteger;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * This method is like `_.find` except that it returns the index of the first
	 * element `predicate` returns truthy for instead of the element itself.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @returns {number} Returns the index of the found element, else `-1`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'active': false },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': true }
	 * ];
	 *
	 * _.findIndex(users, function(o) { return o.user == 'barney'; });
	 * // => 0
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.findIndex(users, { 'user': 'fred', 'active': false });
	 * // => 1
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.findIndex(users, ['active', false]);
	 * // => 0
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.findIndex(users, 'active');
	 * // => 2
	 */
	function findIndex(array, predicate, fromIndex) {
	  var length = array == null ? 0 : array.length;
	  if (!length) {
	    return -1;
	  }
	  var index = fromIndex == null ? 0 : toInteger_1(fromIndex);
	  if (index < 0) {
	    index = nativeMax(length + index, 0);
	  }
	  return _baseFindIndex(array, _baseIteratee(predicate, 3), index);
	}

	var findIndex_1 = findIndex;

	/**
	 * Iterates over elements of `collection`, returning the first element
	 * `predicate` returns truthy for. The predicate is invoked with three
	 * arguments: (value, index|key, collection).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to inspect.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'age': 36, 'active': true },
	 *   { 'user': 'fred',    'age': 40, 'active': false },
	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
	 * ];
	 *
	 * _.find(users, function(o) { return o.age < 40; });
	 * // => object for 'barney'
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.find(users, { 'age': 1, 'active': true });
	 * // => object for 'pebbles'
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.find(users, ['active', false]);
	 * // => object for 'fred'
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.find(users, 'active');
	 * // => object for 'barney'
	 */
	var find = _createFind(findIndex_1);

	var find_1 = find;

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}

	var _baseIsNaN = baseIsNaN;

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	var _strictIndexOf = strictIndexOf;

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? _strictIndexOf(array, value, fromIndex)
	    : _baseFindIndex(array, _baseIsNaN, fromIndex);
	}

	var _baseIndexOf = baseIndexOf;

	/** `Object#toString` result references. */
	var stringTag$2 = '[object String]';

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag$2);
	}

	var isString_1 = isString;

	/**
	 * The base implementation of `_.values` and `_.valuesIn` which creates an
	 * array of `object` property values corresponding to the property names
	 * of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the array of property values.
	 */
	function baseValues(object, props) {
	  return _arrayMap(props, function(key) {
	    return object[key];
	  });
	}

	var _baseValues = baseValues;

	/**
	 * Creates an array of the own enumerable string keyed property values of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property values.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.values(new Foo);
	 * // => [1, 2] (iteration order is not guaranteed)
	 *
	 * _.values('hi');
	 * // => ['h', 'i']
	 */
	function values(object) {
	  return object == null ? [] : _baseValues(object, keys_1(object));
	}

	var values_1 = values;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax$1 = Math.max;

	/**
	 * Checks if `value` is in `collection`. If `collection` is a string, it's
	 * checked for a substring of `value`, otherwise
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * is used for equality comparisons. If `fromIndex` is negative, it's used as
	 * the offset from the end of `collection`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
	 * @returns {boolean} Returns `true` if `value` is found, else `false`.
	 * @example
	 *
	 * _.includes([1, 2, 3], 1);
	 * // => true
	 *
	 * _.includes([1, 2, 3], 1, 2);
	 * // => false
	 *
	 * _.includes({ 'a': 1, 'b': 2 }, 1);
	 * // => true
	 *
	 * _.includes('abcd', 'bc');
	 * // => true
	 */
	function includes(collection, value, fromIndex, guard) {
	  collection = isArrayLike_1(collection) ? collection : values_1(collection);
	  fromIndex = (fromIndex && !guard) ? toInteger_1(fromIndex) : 0;

	  var length = collection.length;
	  if (fromIndex < 0) {
	    fromIndex = nativeMax$1(length + fromIndex, 0);
	  }
	  return isString_1(collection)
	    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
	    : (!!length && _baseIndexOf(collection, value, fromIndex) > -1);
	}

	var includes_1 = includes;

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	var _createBaseFor = createBaseFor;

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = _createBaseFor();

	var _baseFor = baseFor;

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && _baseFor(object, iteratee, keys_1);
	}

	var _baseForOwn = baseForOwn;

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike_1(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	var _createBaseEach = createBaseEach;

	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = _createBaseEach(_baseForOwn);

	var _baseEach = baseEach;

	/**
	 * The base implementation of `_.filter` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function baseFilter(collection, predicate) {
	  var result = [];
	  _baseEach(collection, function(value, index, collection) {
	    if (predicate(value, index, collection)) {
	      result.push(value);
	    }
	  });
	  return result;
	}

	var _baseFilter = baseFilter;

	/**
	 * Iterates over elements of `collection`, returning an array of all elements
	 * `predicate` returns truthy for. The predicate is invoked with three
	 * arguments: (value, index|key, collection).
	 *
	 * **Note:** Unlike `_.remove`, this method returns a new array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 * @see _.reject
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': true },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 *
	 * _.filter(users, function(o) { return !o.active; });
	 * // => objects for ['fred']
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.filter(users, { 'age': 36, 'active': true });
	 * // => objects for ['barney']
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.filter(users, ['active', false]);
	 * // => objects for ['fred']
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.filter(users, 'active');
	 * // => objects for ['barney']
	 */
	function filter(collection, predicate) {
	  var func = isArray_1(collection) ? _arrayFilter : _baseFilter;
	  return func(collection, _baseIteratee(predicate, 3));
	}

	var filter_1 = filter;

	// _ = require 'lodash' # too big
	var _findAll, _getHierarchy, _match, filter$1, find$1, includes$1;

	find$1 = find_1;

	includes$1 = includes_1;

	filter$1 = filter_1;

	// f, ff
	_getHierarchy = function(layer) {
	  var a, i, len, ref, string;
	  string = '';
	  ref = layer.ancestors();
	  for (i = 0, len = ref.length; i < len; i++) {
	    a = ref[i];
	    // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	    if (a._info && a._info.originalName) {
	      string = a._info.originalName + '>' + string;
	    } else {
	      string = a.name + '>' + string;
	    }
	  }
	  // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	  if (layer._info && layer._info.originalName) {
	    string = string + layer._info.originalName;
	  } else {
	    string = string + layer.name;
	  }
	  return string;
	};

	_match = function(hierarchy, string) {
	  var regExp, regexString;
	  // prepare regex tokens
	  string = string.replace(/\s*>\s*/g, '>'); // clean up spaces around arrows
	  string = string.split('*').join('[^>]*'); // asteriks as layer name wildcard
	  string = string.split(' ').join('(?:.*)>'); // space as structure wildcard
	  string = string.split(',').join('$|'); // allow multiple searches using comma
	  regexString = "(^|>)" + string + "$"; // always bottom layer, maybe part of hierarchy
	  regExp = new RegExp(regexString);
	  return hierarchy.match(regExp);
	};

	_findAll = function(selector, fromLayer) {
	  var layers, stringNeedsRegex;
	  layers = Framer.CurrentContext._layers;
	  if (selector != null) {
	    stringNeedsRegex = find$1(['*', ' ', '>', ','], function(c) {
	      return includes$1(selector, c);
	    });
	    if (!(stringNeedsRegex || fromLayer)) {
	      return layers = filter$1(layers, function(layer) {
	        // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	        if (layer._info && layer._info.originalName) {
	          if (layer._info.originalName === selector) {
	            return true;
	          }
	        } else {
	          if (layer.name === selector) {
	            return true;
	          }
	        }
	      });
	    } else {
	      return layers = filter$1(layers, function(layer) {
	        var hierarchy;
	        hierarchy = _getHierarchy(layer);
	        if (fromLayer != null) {
	          // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	          if (fromLayer._info && fromLayer._info.originalName) {
	            return _match(hierarchy, fromLayer._info.originalName + ' ' + selector);
	          } else {
	            return _match(hierarchy, fromLayer.name + ' ' + selector);
	          }
	        } else {
	          return _match(hierarchy, selector);
	        }
	      });
	    }
	  } else {
	    return layers;
	  }
	};

	var f = function(selector, fromLayer) {
	  return _findAll(selector, fromLayer)[0];
	};

	var ff = function(selector, fromLayer) {
	  return _findAll(selector, fromLayer);
	};

	var find_1$1 = {
		f: f,
		ff: ff
	};

	var defineProperty = (function() {
	  try {
	    var func = _getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	var _defineProperty = defineProperty;

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && _defineProperty) {
	    _defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	var _baseAssignValue = baseAssignValue;

	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq_1(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignMergeValue = assignMergeValue;

	var _cloneBuffer = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	module.exports = cloneBuffer;
	});

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
	  return result;
	}

	var _cloneArrayBuffer = cloneArrayBuffer;

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	var _cloneTypedArray = cloneTypedArray;

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	var _copyArray = copyArray;

	/** Built-in value references. */
	var objectCreate = Object.create;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject_1(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	var _baseCreate = baseCreate;

	/** Built-in value references. */
	var getPrototype = _overArg(Object.getPrototypeOf, Object);

	var _getPrototype = getPrototype;

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !_isPrototype(object))
	    ? _baseCreate(_getPrototype(object))
	    : {};
	}

	var _initCloneObject = initCloneObject;

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike_1(value) && isArrayLike_1(value);
	}

	var isArrayLikeObject_1 = isArrayLikeObject;

	/** `Object#toString` result references. */
	var objectTag$3 = '[object Object]';

	/** Used for built-in method references. */
	var funcProto$2 = Function.prototype,
	    objectProto$12 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$2 = funcProto$2.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$9 = objectProto$12.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString$2.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$3) {
	    return false;
	  }
	  var proto = _getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty$9.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString$2.call(Ctor) == objectCtorString;
	}

	var isPlainObject_1 = isPlainObject;

	/**
	 * Gets the value at `key`, unless `key` is "__proto__".
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function safeGet(object, key) {
	  return key == '__proto__'
	    ? undefined
	    : object[key];
	}

	var _safeGet = safeGet;

	/** Used for built-in method references. */
	var objectProto$13 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$10 = objectProto$13.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty$10.call(object, key) && eq_1(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignValue = assignValue;

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      _baseAssignValue(object, key, newValue);
	    } else {
	      _assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}

	var _copyObject = copyObject;

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _nativeKeysIn = nativeKeysIn;

	/** Used for built-in method references. */
	var objectProto$14 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$11 = objectProto$14.hasOwnProperty;

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject_1(object)) {
	    return _nativeKeysIn(object);
	  }
	  var isProto = _isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty$11.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeysIn = baseKeysIn;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
	}

	var keysIn_1 = keysIn;

	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return _copyObject(value, keysIn_1(value));
	}

	var toPlainObject_1 = toPlainObject;

	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = _safeGet(object, key),
	      srcValue = _safeGet(source, key),
	      stacked = stack.get(srcValue);

	  if (stacked) {
	    _assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;

	  var isCommon = newValue === undefined;

	  if (isCommon) {
	    var isArr = isArray_1(srcValue),
	        isBuff = !isArr && isBuffer_1(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray_1(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject_1(objValue)) {
	        newValue = _copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = _cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = _cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
	      newValue = objValue;
	      if (isArguments_1(objValue)) {
	        newValue = toPlainObject_1(objValue);
	      }
	      else if (!isObject_1(objValue) || (srcIndex && isFunction_1(objValue))) {
	        newValue = _initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  _assignMergeValue(object, key, newValue);
	}

	var _baseMergeDeep = baseMergeDeep;

	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  _baseFor(source, function(srcValue, key) {
	    if (isObject_1(srcValue)) {
	      stack || (stack = new _Stack);
	      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
	        : undefined;

	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      _assignMergeValue(object, key, newValue);
	    }
	  }, keysIn_1);
	}

	var _baseMerge = baseMerge;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	var _apply = apply;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax$2 = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax$2(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax$2(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return _apply(func, this, otherArgs);
	  };
	}

	var _overRest = overRest;

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	var constant_1 = constant;

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
	  return _defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant_1(string),
	    'writable': true
	  });
	};

	var _baseSetToString = baseSetToString;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	var _shortOut = shortOut;

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = _shortOut(_baseSetToString);

	var _setToString = setToString;

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return _setToString(_overRest(func, start, identity_1), func + '');
	}

	var _baseRest = baseRest;

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject_1(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike_1(object) && _isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq_1(object[index], value);
	  }
	  return false;
	}

	var _isIterateeCall = isIterateeCall;

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return _baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	var _createAssigner = createAssigner;

	/**
	 * This method is like `_.assign` except that it recursively merges own and
	 * inherited enumerable string keyed properties of source objects into the
	 * destination object. Source properties that resolve to `undefined` are
	 * skipped if a destination value exists. Array and plain object properties
	 * are merged recursively. Other objects and value types are overridden by
	 * assignment. Source objects are applied from left to right. Subsequent
	 * sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = {
	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
	 * };
	 *
	 * var other = {
	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
	 * };
	 *
	 * _.merge(object, other);
	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
	 */
	var merge = _createAssigner(function(object, source, srcIndex) {
	  _baseMerge(object, source, srcIndex);
	});

	var merge_1 = merge;

	/*
	= TODO LIST
	*/
	var f$1, ff$1, merge$1, parse, transitions$1;

	// TODO: add hide / show elements
	// TODO: setElement em mais de um elemento (setElement:el1;setElement:el2)
	// TODO: permitir adicionar classes personalizadas a alguns text-fields / select-fields
	// TODO: poder customizar transições
	// TODO: poder customizar eventos
	// TODO: push / pull layers
	// TODO: melhorar o @actions para não precisar de hardcoded das ações nos métodos
	// TODO QUESTION: condicionais para exibir ou não elemento?
	transitions$1 = transitions;

	transitions$1 = transitions;

	var f_1 = f$1 = find_1$1.f;

	var ff_1 = ff$1 = find_1$1.ff;

	merge$1 = merge_1;

	var parse_1 = parse = function(string) {
	  var actions, acts, regexAction, regexOption, regexOptions;
	  // if actions are divided with spaces, ignore spaces "action1:target; action2:target;"
	  string = string.replace(/;_/gi, ';');
	  regexAction = /^(.*?)(?::|$)(.*?)(\[.*|$)/;
	  regexAction = /^(.*?(?=:|\[|$))(?::?)(.*?(?=\[.*)|.*$)(\[.*)?/;
	  regexOptions = /\[(.*?)\]$/;
	  regexOption = /(.*?)(\:|$)(.*)/;
	  // action:target[option:value, option:value];action:target;action;
	  actions = [];
	  acts = string.split(';');
	  acts.filter(function(action) {
	    var matches, options, opts, target;
	    if (!action) {
	      return false;
	    }
	    matches = action.match(regexAction);
	    action = matches[1];
	    target = matches[2];
	    options = [];
	    if (matches[3]) {
	      opts = matches[3].match(regexOptions);
	      if (opts[1]) {
	        opts = opts[1].split(',');
	      }
	      opts.forEach(function(opt) {
	        var name, value;
	        matches = opt.match(regexOption);
	        name = matches[1];
	        value = matches[3];
	        return options.push({
	          name: name.trim(),
	          value: value.trim()
	        });
	      });
	    }
	    return actions.push({
	      action: action,
	      target: target,
	      options: options
	    });
	  });
	  return actions;
	};

	var ProtoSparker = (function() {
	  class ProtoSparker {
	    constructor(options1 = {}) {
	      var all, base, base1, base2, base3, bg, default_h, default_w, hRatio, hackedScreenHeight, ratio, screen_height, screen_width, vRatio;
	      this.options = options1;
	      // Opts
	      if ((base = this.options).firstPage == null) {
	        base.firstPage = null;
	      }
	      if (typeof this.options.firstPage === 'string') {
	        this.options.firstPage = f$1(this.options.firstPage);
	      }
	      if ((base1 = this.options).hints == null) {
	        base1.hints = false;
	      }
	      if (!this.options.hints) {
	        Framer.Extras.Hints.disable();
	      }
	      if ((base2 = this.options).textField == null) {
	        base2.textField = {};
	      }
	      this.options.textField = merge$1(this.defaultTextField, this.options.textField);
	      if ((base3 = this.options).selectField == null) {
	        base3.selectField = {};
	      }
	      this.options.selectField = merge$1(this.defaultSelectField, this.options.selectField);
	      this.actions = [
	        {
	          selector: "goback",
	          fn: this.goBack
	        },
	        {
	          selector: "goto:",
	          fn: this.goTo
	        },
	        {
	          selector: "overlay:",
	          fn: this.overlay
	        },
	        {
	          selector: "setElement:",
	          fn: this.setElement
	        }
	      ];
	      document.body.style.height = "auto";
	      // body.scrollTop = 0
	      default_w = this.options.firstPage.width;
	      default_h = this.options.firstPage.height;
	      if (Framer.Device && Framer.Device.screen) {
	        screen_width = Framer.Device.screen.width;
	        screen_height = Framer.Device.screen.height;
	      } else {
	        screen_width = window.innerWidth;
	        screen_height = window.innerHeight;
	      }
	      // Something is fucked up when running the prototype on framer.cloud on chrome.
	      // Prototype is seems to overflow window height.
	      // I tried to solve this but I couldn't. Good luck.
	      hackedScreenHeight = 0;
	      if (window.location.origin.match('framer.cloud') && Utils.isMobile()) {
	        hackedScreenHeight = 170;
	        screen_height -= hackedScreenHeight;
	      }
	      hRatio = screen_width / default_w;
	      vRatio = screen_height / default_h;
	      ratio = hRatio;
	      if (vRatio < hRatio) {
	        ratio = vRatio;
	      }
	      Framer.Defaults.Layer.force2d = true;
	      all = new Layer({
	        width: default_w, // <-- The width will be 750
	        height: default_h, // <-- The height will be 1334
	        scale: ratio, // <-- The ratio we got from the equation
	        originY: 0, // <-- This moves the origin of scale to top left
	        y: 0, // <-- Make this layer to the top
	        backgroundColor: "#000000"
	      });
	      bg = new Layer({
	        width: screen_width,
	        height: screen_height,
	        y: 0,
	        x: 0,
	        backgroundColor: "#000000"
	      });
	      bg.height += hackedScreenHeight;
	      all.parent = bg;
	      all.centerX();
	      // Set up FlowComponent
	      this.flow = new FlowComponent;
	      this.flow.width = this.options.firstPage.width;
	      this.flow.height = this.options.firstPage.height;
	      this.flow.parent = all;
	      this.flow.showNext(this.options.firstPage);
	      // Get all layers that have actions
	      this.actions.forEach((action) => {
	        var layers;
	        layers = ff$1(`*${action.selector}*`);
	        return this.actionLayers = this.actionLayers.concat(layers);
	      });
	      //  break into commands separated by ; and run them in order
	      this.actionLayers.forEach((layer) => {
	        var action, actions, destinationLayer, layerActionsArray, layerFns, layerName, overlayIndex;
	        layerFns = [];
	        layerActionsArray = [];
	        // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	        if (layer._info && layer._info.originalName) {
	          layerActionsArray = layer._info.originalName.split(';');
	        } else {
	          layerActionsArray = layer.name.split(';');
	        }
	        layerActionsArray.forEach((layerAction) => {
	          // check if this layerAction matches a registered actionLayers
	          return this.actions.forEach((action) => {
	            if (layerAction.match(action.selector)) {
	              return layerFns.push(action.fn);
	            }
	          });
	        });
	        layer.on('click', () => {
	          return layerFns.forEach((fn) => {
	            return fn.call(this, layer);
	          });
	        });
	        layerName = this.getLayerName(layer);
	        actions = parse(layerName);
	        overlayIndex = actions.findIndex(function(i) {
	          return i.action === "overlay";
	        });
	        if (overlayIndex >= 0) {
	          // hide overlay layers when prototype boots up
	          action = actions[overlayIndex];
	          destinationLayer = f$1(action.target);
	          if (!destinationLayer) {
	            return;
	          }
	          return destinationLayer.visible = false;
	        }
	      });
	      this.generateFields();
	      this.generateScrolls();
	      this.generateElements();
	    }

	    testParser() {
	      print(parse("action"));
	      print(parse("action[op1, op2:2]"));
	      print(parse("action:target"));
	      return print(parse("action:target[op1:1, op2:2, op3]"));
	    }

	    getLayerName(layer) {
	      var layerName, treatedLayerName;
	      try {
	        layerName = "";
	        // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	        if (layer._info && layer._info.originalName) {
	          layerName = layer._info.originalName;
	        } else {
	          layerName = layer.name;
	        }
	        // ignore suffix _123 on duplicates
	        treatedLayerName = layerName.replace(/_[0-9]+$/, '');
	        if (f$1(treatedLayerName)) {
	          layerName = treatedLayerName;
	        }
	        return layerName;
	      } catch (error) {
	        return false;
	      }
	    }

	    goBack(layer) {
	      return this.flow.showPrevious();
	    }

	    goTo(layer) {
	      var action, actions, destinationLayer, layerName, transition;
	      layerName = this.getLayerName(layer);
	      actions = parse(layerName).filter(function(action) {
	        return action.action === 'goto';
	      });
	      action = actions[0];
	      destinationLayer = f$1(action.target);
	      if (!destinationLayer) {
	        return;
	      }
	      destinationLayer.x = 0;
	      destinationLayer.y = 0;
	      transition = action.options.findIndex(function(i) {
	        return i.name === "transition";
	      });
	      if (transition < 0) {
	        transition = false;
	      }
	      if (typeof transition === 'number') { // this is the index
	        transition = transitions$1[action.options[transition].value];
	        return this.flow.transition(destinationLayer, transition);
	      } else {
	        return this.flow.showNext(destinationLayer);
	      }
	    }

	    overlay(layer) {
	      var action, actions, bottomIndex, centerIndex, destinationLayer, layerName, leftIndex, rightIndex, topIndex;
	      layerName = this.getLayerName(layer);
	      actions = parse(layerName).filter(function(action) {
	        return action.action === 'overlay';
	      });
	      action = actions[0];
	      destinationLayer = f$1(action.target);
	      if (!destinationLayer) {
	        return;
	      }
	      topIndex = action.options.findIndex(function(i) {
	        return i.name === "top";
	      });
	      rightIndex = action.options.findIndex(function(i) {
	        return i.name === "right";
	      });
	      bottomIndex = action.options.findIndex(function(i) {
	        return i.name === "bottom";
	      });
	      leftIndex = action.options.findIndex(function(i) {
	        return i.name === "left";
	      });
	      centerIndex = action.options.findIndex(function(i) {
	        return i.name === "center";
	      });
	      if (topIndex >= 0) {
	        return this.flow.showOverlayTop(destinationLayer);
	      } else if (rightIndex >= 0) {
	        return this.flow.showOverlayRight(destinationLayer);
	      } else if (bottomIndex >= 0) {
	        return this.flow.showOverlayBottom(destinationLayer);
	      } else if (leftIndex >= 0) {
	        return this.flow.showOverlayLeft(destinationLayer);
	      } else if (centerIndex >= 0) {
	        return this.flow.showOverlayCenter(destinationLayer);
	      } else {
	        return this.flow.showOverlayCenter(destinationLayer);
	      }
	    }

	    toggleElement(layer) {
	      var action, actions, currentIndex, defaultElement, elementLayers, elementName, layerName, nextElement;
	      layerName = this.getLayerName(layer);
	      actions = parse(layerName).filter(function(action) {
	        return action.action === 'element';
	      });
	      action = actions[0] || null;
	      if (!action || !action.options.length) {
	        return;
	      }
	      elementName = action.target;
	      currentIndex = null;
	      nextElement = null;
	      defaultElement = null;
	      elementLayers = ff$1(`*element:${elementName},*element:${elementName}*;,*element:${elementName}[*`);
	      elementLayers.forEach((element, index) => {
	        var stateIndex;
	        layerName = this.getLayerName(element);
	        actions = parse(layerName).filter(function(action) {
	          return action.action === 'element';
	        });
	        action = actions[0] || null;
	        if (action) {
	          // for safety, save default element
	          stateIndex = action.options.findIndex(function(i) {
	            return i.name === "state";
	          });
	          if (!action.options[stateIndex] || action.options[stateIndex] && action.options[stateIndex].value === "default") {
	            defaultElement = element;
	          }
	          // try grabbing the next state
	          if (element === layer) {
	            return currentIndex = index;
	          }
	        }
	      });
	      if (elementLayers[currentIndex + 1]) {
	        nextElement = elementLayers[currentIndex + 1];
	      } else if (elementLayers[currentIndex - 1]) {
	        nextElement = elementLayers[currentIndex - 1];
	      } else {
	        nextElement = defaultElement;
	      }
	      if (nextElement) {
	        layerName = this.getLayerName(nextElement);
	        actions = parse(layerName).filter(function(action) {
	          return action.action === 'element';
	        });
	        action = actions[0] || null;
	        return this.setElement(nextElement, {
	          action: "setElement",
	          target: action.target,
	          options: action.options
	        });
	      }
	    }

	    setElement(layer, action) {
	      var actions, defaultElement, elementName, hasMatch, layerName, state, stateIndex;
	      // print "start"
	      if (!action) {
	        layerName = this.getLayerName(layer);
	        actions = parse(layerName).filter(function(action) {
	          return action.action === 'setElement';
	        });
	        action = actions[0] || null;
	      }
	      if (!action || !action.options.length) {
	        return;
	      }
	      stateIndex = action.options.findIndex(function(i) {
	        return i.name === "state";
	      });
	      if (stateIndex < 0) {
	        action.options.push({
	          name: "state",
	          value: "default"
	        });
	        stateIndex = action.options.length - 1; // last one
	      }
	      
	      // Setting state
	      if (stateIndex >= 0) {
	        state = action.options[stateIndex].value;
	        elementName = action.target;
	        // gets all element states that match this state and turn them on
	        // elements that dont match this state are turned off
	        hasMatch = false;
	        defaultElement = null;
	        ff$1(`*element:${elementName}*`).forEach((element) => {
	          layerName = this.getLayerName(element);
	          actions = parse(layerName).filter(function(action) {
	            return action.action === 'element';
	          });
	          action = actions[0] || null;
	          if (!action) {
	            return null;
	          }
	          stateIndex = action.options.findIndex(function(i) {
	            return i.name === "state";
	          });
	          if (!action.options[stateIndex] || action.options[stateIndex] && action.options[stateIndex].value === "default") {
	            defaultElement = element;
	          }
	          if (stateIndex >= 0 && action.options[stateIndex].value === state) {
	            hasMatch = true;
	            return element.visible = true;
	          } else {
	            return element.visible = false;
	          }
	        });
	        // if no element was matched, fall back to default element
	        if (!hasMatch && defaultElement) {
	          return defaultElement.visible = true;
	        }
	      }
	    }

	    generateFields() {
	      var _class, _key, _value, css, fieldString, head, key, placeholderString, ref, ref1, ref2, ref3, ref4, ref5, style, value;
	      css = "";
	      ref = this.options.textField.styles;
	      // Generating Text Fields css for each styles
	      for (key in ref) {
	        value = ref[key];
	        _class = key;
	        if (_class === "default") {
	          _class = this.options.textField.defaultClass;
	        }
	        fieldString = "";
	        placeholderString = "";
	        ref1 = value.field;
	        for (_key in ref1) {
	          _value = ref1[_key];
	          fieldString += `${_key}:${_value};`;
	        }
	        ref2 = value.placeholder;
	        for (_key in ref2) {
	          _value = ref2[_key];
	          placeholderString += `${_key}:${_value};`;
	        }
	        // adding placeHolder style
	        css += `.${_class} 						   		{ ${fieldString} }.${_class}:focus						{ outline: none; }.${_class}::-webkit-input-placeholder 	{ ${placeholderString} }.${_class}::-moz-placeholder 			{ ${placeholderString} }.${_class}:-ms-input-placeholder 		{ ${placeholderString} }.${_class}::-ms-input-placeholder 		{ ${placeholderString} }.${_class}:placeholder-shown 			{ ${placeholderString} }`;
	      }
	      ref3 = this.options.selectField.styles;
	      // Generating Select Fields css for each styles
	      for (key in ref3) {
	        value = ref3[key];
	        // print key, value
	        _class = key;
	        if (_class === "default") {
	          _class = this.options.selectField.defaultClass;
	        }
	        fieldString = "";
	        placeholderString = "";
	        ref4 = value.field;
	        for (_key in ref4) {
	          _value = ref4[_key];
	          fieldString += `${_key}:${_value};`;
	        }
	        ref5 = value.placeholder;
	        for (_key in ref5) {
	          _value = ref5[_key];
	          placeholderString += `${_key}:${_value};`;
	        }
	        // adding placeHolder style
	        css += `.${_class} 						   		{ ${fieldString} }.${_class}:focus						{ outline: none; }.${_class}.empty						{ ${placeholderString} }`;
	      }
	      // Creating style element
	      head = document.head || document.getElementsByTagName('head')[0];
	      style = document.createElement('style');
	      style.type = 'text/css';
	      if (style.styleSheet) {
	        style.styleSheet.cssText = css;
	      } else {
	        style.appendChild(document.createTextNode(css));
	      }
	      head.appendChild(style);
	      // Generating text fields
	      ff$1('text-field*,text_field*').forEach((field) => {
	        return field.html = `<input placeholder="${this.options.textField.placeholderText}" class="${this.options.textField.defaultClass}" />`;
	      });
	      // Generating select boxes
	      return ff$1('select-field*,select_field*').forEach((field, index) => {
	        var action, actions, j, layerName, len, opt, optString, ref6;
	        optString = `<option selected disabled style="color: red">${this.options.selectField.placeholderText}</option>`;
	        layerName = this.getLayerName(field);
	        actions = parse(layerName).filter(function(action) {
	          // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	          if (field._info && field._info.originalName) {
	            return action.action === 'select-field';
	          } else {
	            return action.action === 'select_field';
	          }
	        });
	        action = actions[0] || null;
	        if (action) {
	          ref6 = action.options;
	          for (j = 0, len = ref6.length; j < len; j++) {
	            opt = ref6[j];
	            optString += `<option value="${opt.value}">${opt.name.replace(/\_/g, ' ').trim()}</option>`;
	          }
	        }
	        return field.html = `<select class="${this.options.selectField.defaultClass} empty" onChange="this.classList.remove('empty');">${optString}</select>`;
	      });
	    }

	    generateScrolls() {
	      return ff$1('scroll*').forEach((layer) => {
	        var action, actions, layerHeight, layerName, layerWidth, parent, scroll, x, y;
	        layerName = this.getLayerName(layer);
	        actions = parse(layerName).filter(function(action) {
	          return action.action === 'scroll';
	        });
	        action = actions[0];
	        parent = layer.parent;
	        x = layer.x;
	        y = layer.y;
	        layerHeight = layer.height;
	        layerWidth = layer.width;
	        scroll = ScrollComponent.wrap(layer);
	        scroll.parent = parent;
	        scroll.x = x;
	        scroll.y = y;
	        scroll.width = layerWidth;
	        scroll.height = layerHeight;
	        scroll.mouseWheelEnabled = true;
	        scroll.scrollVertical = false;
	        scroll.scrollHorizontal = false;
	        scroll.on(Events.Scroll, function(evt) {
	          if (!evt) {
	            return;
	          }
	          evt.preventDefault();
	          evt.stopPropagation();
	          return evt.stopImmediatePropagation();
	        });
	        if (action && action.options && action.options.length) {
	          if (action.options[0].name === 'horizontal') {
	            scroll.scrollHorizontal = true;
	          }
	          if (action.options[0].name === 'vertical') {
	            return scroll.scrollHorizontal = true;
	          }
	        } else {
	          // defaults to vertical scrolling
	          return scroll.scrollVertical = true;
	        }
	      });
	    }

	    generateElements() {
	      return ff$1('*element:*').forEach((element) => {
	        var action, defaultElement, elementName, layerName, toggleIndex;
	        layerName = this.getLayerName(element);
	        action = parse(layerName)[0] || null;
	        if (!action) {
	          return false;
	        }
	        // get default state for this element
	        elementName = action.target;
	        defaultElement = null;
	        // this distinguishes item-label and item-label-dark
	        ff$1(`*element:${elementName},*element:${elementName}*;,*element:${elementName}[*`).forEach((element) => {
	          var stateIndex;
	          layerName = this.getLayerName(element);
	          action = parse(layerName)[0] || null;
	          if (action) {
	            stateIndex = action.options.findIndex(function(i) {
	              return i.name === "state";
	            });
	            if (!action.options[stateIndex] || action.options[stateIndex] && action.options[stateIndex].value === "default") {
	              defaultElement = element;
	              return false;
	            }
	          }
	        });
	        toggleIndex = action.options.findIndex(function(i) {
	          return i.name === "toggle";
	        });
	        if (action.options[toggleIndex]) {
	          element.onClick(() => {
	            return this.toggleElement(element);
	          });
	        }
	        if (defaultElement && defaultElement !== element) {
	          element.parent = defaultElement.parent;
	          element.placeBehind(defaultElement);
	          element.x = defaultElement.x;
	          element.y = defaultElement.y;
	          element.opacity = 1;
	          return element.visible = false;
	        }
	      });
	    }

	  }
	  ProtoSparker.prototype.actions = [];

	  ProtoSparker.prototype.actionLayers = [];

	  ProtoSparker.prototype.defaultTextField = {
	    defaultClass: "ps-text-field",
	    placeholderText: "",
	    styles: {
	      default: {
	        field: {
	          "position": "absolute",
	          "top": 0,
	          "left": 0,
	          "right": 0,
	          "bottom": 0,
	          "box-sizing": "border-box",
	          "font-size": "14px",
	          "background": "transparent"
	        },
	        // "border": "1px solid red"
	        placeholder: {}
	      }
	    }
	  };

	  ProtoSparker.prototype.defaultSelectField = {
	    defaultClass: "ps-select-field",
	    placeholderText: "",
	    styles: {
	      default: {
	        field: {
	          "position": "absolute",
	          "top": 0,
	          "left": 0,
	          "right": 0,
	          "bottom": 0,
	          "box-sizing": "border-box",
	          "font-size": "14px",
	          "background": "transparent",
	          "-webkit-appearance": "none",
	          "-moz-appearance": "none",
	          "text-indent": "1px",
	          "text-overflow": "",
	          "border-radius": "0"
	        },
	        placeholder: {}
	      }
	    }
	  };

	  return ProtoSparker;

	}).call(commonjsGlobal);

	var core = {
		f: f_1,
		ff: ff_1,
		parse: parse_1,
		ProtoSparker: ProtoSparker
	};

	// require('coffee-script/register');
	var ProtoSparker$1, SvgImporter$1, f$2, ff$2;

	({SvgImporter: SvgImporter$1} = svgImporter);

	({ProtoSparker: ProtoSparker$1, f: f$2, ff: ff$2} = core);

	var ProtoSparker_2 = window.ProtoSparker = ProtoSparker$1;

	var SvgImporter_1 = window.SvgImporter = SvgImporter$1;

	var f_1$1 = window.f = f$2;

	var ff_1$1 = window.ff = ff$2;

	var ProtoSparker_1 = {
		ProtoSparker: ProtoSparker_2,
		SvgImporter: SvgImporter_1,
		f: f_1$1,
		ff: ff_1$1
	};

	exports.default = ProtoSparker_1;
	exports.ProtoSparker = ProtoSparker_2;
	exports.SvgImporter = SvgImporter_1;
	exports.f = f_1$1;
	exports.ff = ff_1$1;

	return exports;

}({}));
