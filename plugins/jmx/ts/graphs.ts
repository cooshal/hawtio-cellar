/// <reference path="../../includes.ts"/>
/**
 * @module Core
 */
declare var dagre: any;

module Core {

  export function d3ForceGraph(scope, nodes, links, canvasElement) {
    // lets remove the old graph first
    if (scope.graphForce) {
      scope.graphForce.stop();
    }
    if (!canvasElement) {
      canvasElement = $("#canvas")[0];
    }
    var canvasDiv = $(canvasElement);
    canvasDiv.children("svg").remove();

    if (nodes.length) {
      var width  = canvasDiv.parent().width();
      var height = canvasDiv.parent().height();

      if (height < 100) {
        //console.log("browse thinks the height is only " + height + " so calculating offset from doc height");
        var offset = canvasDiv.offset();
        height     = $(document).height() - 5;
        if (offset) {
          height -= offset['top'];
        }
      }
      //console.log("Using width " + width + " and height " + height);

      var svg = d3.select(canvasDiv[0]).append("svg")
        .attr("width", width)
        .attr("height", height);

      var force = d3.layout.force()
        //.gravity(.05)
        .distance(100)
        .charge(-120 * 10)
        .linkDistance(50)
        .size([width, height]);

      scope.graphForce = force;

      /*
       var force = d3.layout.force()
       .gravity(.05)
       .distance(100)
       .charge(-100)
       .size([width, height]);
       */

      // prepare the arrows
      svg.append("svg:defs").selectAll("marker")
        .data(["from"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

      force.nodes(nodes)
        .links(links)
        .start();

      var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

      // draw the arrow
      link.attr("class", "link from");

      // end marker
      link.attr("marker-end", "url(#from)");

      var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

      node.append("image")
        .attr("xlink:href", d => d.imageUrl)
        .attr("x", -15)
        .attr("y", -15)
        .attr("width", 30)
        .attr("height", 30);

      node.append("text")
        .attr("dx", 20)
        .attr("dy", ".35em")
        .text(d => d.label);

      force.on("tick", function () {
        link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
      });
    }
  }

  export function createGraphStates(nodes, links, transitions) {
    var stateKeys = {};
    nodes.forEach((node) => {
      var idx = node.id;
      if (idx === undefined) {
        console.log("No node found for node " + JSON.stringify(node));
      } else {
        if (node.edges === undefined) node.edges = [];
        if (!node.label) node.label = "node " + idx;
        stateKeys[idx] = node;
      }
    });
    var states = d3.values(stateKeys);
    links.forEach(d => {
      var source = stateKeys[d.source];
      var target = stateKeys[d.target];
      if (source === undefined || target === undefined) {
        console.log("Bad link!  " + source + " target " + target + " for " + d);
      } else {
        var edge = {source: source, target: target};
        transitions.push(edge);
        source.edges.push(edge);
        target.edges.push(edge);
        // TODO should we add the edge to the target?
      }
    });
    return states;
  }

  // TODO Export as a service
  export function dagreLayoutGraph(nodes, links, width, height, svgElement, allowDrag = false, onClick = null) {
    var nodePadding = 10;
    var transitions = [];
    var states      = Core.createGraphStates(nodes, links, transitions);

    // Translates all points in the edge using `dx` and `dy`.
    function translateEdge(e, dx, dy) {
      e.points.forEach(p => {
        p.x = Math.max(0, Math.min(svgBBox.width, p.x + dx));
        p.y = Math.max(0, Math.min(svgBBox.height, p.y + dy));
      });
    }

    // Now start laying things out
    var svg = svgElement ? d3.select(svgElement) : d3.select("svg");

    // lets remove all the old g elements
    if (svgElement) {
      $(svgElement).children("g").remove();
    }
    $(svg).children("g").remove();

    var svgGroup = svg.append("g").attr("transform", "translate(5, 5)");

    // `nodes` is center positioned for easy layout later
    var nodes = svgGroup
      .selectAll("g .node")
      .data(states)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("data-cid", d => d.cid)
      .attr("id", d => "node-" + d.label);

    // lets add a tooltip
    nodes.append("title").text(d => d.tooltip || "");

    var edges = svgGroup
      .selectAll("path .edge")
      .data(transitions)
      .enter()
      .append("path")
      .attr("class", "edge")
      .attr("marker-end", "url(#arrowhead)");

    // Append rectangles to the nodes. We do this before laying out the text
    // because we want the text above the rectangle.
    var rects = nodes.append("rect")
      // rounded corners
      .attr("rx", "4")
      .attr("ry", "4")
      // lets add shadow (do not add shadow as the filter does not work in firefox browser
      /*.attr("filter", "url(#drop-shadow)")*/
      .attr("class", d => d.type);

    var images = nodes.append("image")
      .attr("xlink:href", d => d.imageUrl)
      .attr("x", -12)
      .attr("y", -20)
      .attr("height", 24)
      .attr("width", 24);

    var counters = nodes
      .append("text")
      .attr("text-anchor", "end")
      .attr("class", "counter")
      .attr("x", 0)
      .attr("dy", 0)
      .text(_counterFunction);

    var inflights = nodes
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class", "inflight")
      .attr("x", 10)
      .attr("dy", -32)
      .text(_inflightFunction);

    // Append text
    var labels = nodes
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 0);

    labels
      .append("tspan")
      .attr("x", 0)
      .attr("dy", 28)
      .text(d => d.label);

    var labelPadding  = 12;
    var minLabelwidth = 80;

    labels.each(function (d) {
      var bbox = this.getBBox();
      d.bbox   = bbox;
      if (bbox.width < minLabelwidth) {
        bbox.width = minLabelwidth;
      }
      d.width  = bbox.width + 2 * nodePadding;
      d.height = bbox.height + 2 * nodePadding + labelPadding;
    });

    rects
      .attr("x", d => -(d.bbox.width / 2 + nodePadding))
      .attr("y", d => -(d.bbox.height / 2 + nodePadding + (labelPadding / 2)))
      .attr("width", d => d.width)
      .attr("height", d => d.height);

    if (onClick != null) {
      rects.on("click", onClick);
    }

    images.attr("x", d => -(d.bbox.width) / 2);

    labels
      .attr("x", d => -d.bbox.width / 2)
      .attr("y", d => -d.bbox.height / 2);

    counters.attr("x", d => d.bbox.width / 2);

    var g = new dagre.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(Function.prototype);

    states.forEach(node => g.setNode(node.id, node));
    transitions.forEach(edge => g.setEdge(edge.source.id, edge.target.id, edge));

    dagre.layout(g);

    nodes.attr("transform", d => 'translate(' + d.x + ',' + d.y + ')');

    const line = d3.svg.line()
      .x(d => d.x)
      .y(d => d.y)
      .interpolate("linear");

    edges
    // Set the id. of the SVG element to have access to it later
      .attr('id', e => e.id)
      .attr("d", e => line(e.points));

    // Resize the SVG element
    var svgNode = svg.node();
    if (svgNode) {
      var svgBBox = svgNode.getBBox();
      if (svgBBox) {
        svg.attr("width", svgBBox.width + 10);
        svg.attr("height", svgBBox.height + 10);
      }
    }

    // configure dragging if enabled
    if (allowDrag) {
      // Drag handlers
      var nodeDrag = d3.behavior.drag()
        // Set the right origin (based on the Dagre layout or the current position)
        .origin(d => d.pos ? {x: d.pos.x, y: d.pos.y} : {x: d.x, y: d.y})
        .on('drag', function (d, i) {
          var prevX = d.x,
              prevY = d.y;

          // The node must be inside the SVG area
          d.x = Math.max(d.width / 2, Math.min(svgBBox.width - d.width / 2, d3.event.x));
          d.y = Math.max(d.height / 2, Math.min(svgBBox.height - d.height / 2, d3.event.y));
          d3.select(this).attr('transform', 'translate(' + d.x + ',' + d.y + ')');

          var dx = d.x - prevX,
              dy = d.y - prevY;

          // Edges position (inside SVG area)
          d.edges.forEach(e => {
            translateEdge(e, dx, dy);
            d3.select('#' + e.id).attr('d', line(e));
          });
        });

      var edgeDrag = d3.behavior.drag()
        .on('drag', (d, i) => {
          translateEdge(d, d3.event.dx, d3.event.dy);
          d3.select(this).attr('d', line(d));
        });

      nodes.call(nodeDrag);
      edges.call(edgeDrag);
    }

    return states;
  }

  // TODO Export as a service
  export function dagreUpdateGraphData(data) {
    var svg = d3.select("svg");
    svg.selectAll("text.counter").text(_counterFunction);
    svg.selectAll("text.inflight").text(_inflightFunction);

    // add tooltip
    svg.selectAll("g .node title").text(d => d.tooltip || "");
    /*
     TODO can we reuse twitter bootstrap on an svg title?
     .each(function (d) {
     $(d).tooltip({
     'placement': "bottom"
     });
     });

     */
  }

  function _counterFunction(d) {
    return d.counter || "";
  }

  function _inflightFunction(d) {
    return d.inflight || "";
  }
}
