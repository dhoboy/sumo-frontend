import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";

const TechniqueCategoryPieGraph = ({ data }) => {
  const graph = useRef(null);

  // My modified fork of Mike Bostock's PieChart
  // Copyright 2021 Observable, Inc.
  // Released under the ISC license.
  // https://observablehq.com/@d3/pie-chart
  const PieChart = (
    data,
    {
      name = ([x]) => x, // given d in data, returns the (ordinal) label
      value = ([, y]) => y, // given d in data, returns the (quantitative) value
      title, // given d in data, returns the title text
      width = 640, // outer width, in pixels
      height = 400, // outer height, in pixels
      innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
      outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
      labelRadius = innerRadius * 0.2 + outerRadius * 0.6, // center radius of labels
      format = ",", // a format specifier for values (in the label)
      names, // array of names (the domain of the color scale)
      colors, // array of colors for names
      stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
      strokeWidth = 1, // width of stroke separating wedges
      strokeLinejoin = "round", // line join of stroke separating wedges
      padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
    } = {}
  ) => {
    // Compute values.
    const N = d3.map(data, name);
    const V = d3.map(data, value);
    const I = d3.range(N.length).filter((i) => !isNaN(V[i]));

    // Unique the names.
    if (names === undefined) names = N;
    names = new d3.InternSet(names);

    // Chose a default color scheme based on cardinality.
    if (colors === undefined) colors = d3.schemeSpectral[names.size];
    if (colors === undefined)
      colors = d3.quantize(
        (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
        names.size
      );

    // Construct scales.
    const color = d3.scaleOrdinal(names, colors);

    // Compute titles.
    if (title === undefined) {
      const formatValue = d3.format(format);
      title = (i) => `${N[i]}\n${formatValue(V[i])}`;
    } else {
      const O = d3.map(data, (d) => d);
      const T = title;
      title = (i) => T(O[i], i, data);
    }

    // Margin
    const margin = { top: 300, right: 20, bottom: 0, left: 20 };
    const adjustedWidth = width + margin.left + margin.right;
    const adjustedHeight = height + margin.top + margin.bottom;

    // Construct arcs.
    const arcs = d3
      .pie()
      .padAngle(padAngle)
      .sort(null)
      .value((i) => V[i])(I);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    // Find the small arcs
    const minArcSize = 0.45;
    const smallArcs = arcs.filter(
      (d) => d.endAngle - d.startAngle <= minArcSize
    );

    const svg = d3
      .select(graph.current)
      .append("svg")
      .attr("width", adjustedWidth)
      .attr("height", adjustedHeight - 100)
      .attr("viewBox", [
        -adjustedWidth / 2,
        -adjustedHeight / 2,
        adjustedWidth,
        adjustedHeight - 100,
      ])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Arcs
    svg
      .append("g")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linejoin", strokeLinejoin)
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d) => {
        return color(N[d.data]);
      })
      .attr("d", arc)
      .append("title")
      .text((d) => title(d.data));

    // Small Arc Labels
    const smallArcLabels = svg
      .append("g")
      .selectAll(".small-arc-label")
      .data(smallArcs)
      .join("g")
      .attr("class", "small-arc-label")
      .attr("font-family", "sans-serif")
      .attr("font-size", 15)
      .attr("text-anchor", "middle");

    // dot in the small arc centroid
    smallArcLabels
      .append("circle")
      .attr("x", (d) => {
        const centroid = arc.centroid(d);
        return centroid[0];
      })
      .attr("y", (d) => {
        const centroid = arc.centroid(d);
        return centroid[1];
      })
      .attr("r", 3)
      .attr("fill", "#999");

    // line from the dot to the label outside the graph
    smallArcLabels
      .append("path")
      .attr("d", (d) => {
        const centroidAngle = (d.startAngle + d.endAngle) / 2;
        const arc = d3.arc().innerRadius(0).outerRadius(150);

        return arc({
          startAngle: centroidAngle,
          endAngle: centroidAngle,
        });
      })
      .attr("stroke-width", 2)
      .attr("stroke", "#999");

    // the label outside the graph
    // these labels are drawn last, yet there are lines that overlap label text
    smallArcLabels
      .append("text")
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d);
        return `translate(${x * 2},${y * 2})`;
      })
      .selectAll("tspan")
      .data((d) => {
        return `${title(d.data)}`.split(/\n/);
      })
      .join("tspan")
      .attr("x", 0)
      .attr("y", (_, i) => `${i}em`)
      .attr("font-weight", (_, i) => (i ? null : "bold"))
      .attr("fill", "#ccc") // TODO: This needs to change based on light or dark color scheme
      .text((d) => {
        const formatted = d3.format(".2%")(d);
        if (formatted === "NaN%") return d;
        return formatted;
      });

    // stagger the lines so the small labels dont overlap
    smallArcLabels.attr("transform", (d, i) => {
      const [x, y] = arc.centroid(d);
      return `translate(${x * (0.5 * (i + 1))},${y * (0.5 * (i + 1))})`;
    });

    // Big Arc Labels
    svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 15)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .selectAll("tspan")
      .data((d) => {
        const lines = `${title(d.data)}`.split(/\n/);
        return d.endAngle - d.startAngle > minArcSize ? lines : "";
      })
      .join("tspan")
      .attr("x", 0)
      .attr("y", (_, i) => `${i}em`)
      .attr("font-weight", (_, i) => (i ? null : "bold"))
      .attr("fill", "#fff")
      .text((d) => {
        const formatted = d3.format(".2%")(d);
        if (formatted === "NaN%") return d;
        return formatted;
      });
  };

  const drawGraph = useCallback(() => {
    // Good Ol' React/D3 integration drawing graphs too many times workaround
    // Only draw the graph if it isn't already drawn
    if (d3.select(graph.current).select("svg").empty()) {
      PieChart(data, {
        name: (d) => {
          const tc = d.technique_category;
          return tc.charAt(0).toUpperCase().concat(tc.slice(1));
        },
        names: ["Force", "Push", "Dodge", "Throw", "Default"],
        colors: ["#e41a1c", "#33a02c", "#377eb8", "#984ea3", "#252525"],
        value: (d) => d.percent,
        width: 350,
        height: 350,
      });
    }
  }, [data]);

  // const removeGraph = () => {
  //   d3.select(graph.current).remove();
  // };

  // Draw graph when data is ready, tear down graph when unmounting
  useEffect(() => {
    if (data.length) {
      drawGraph();
    }
    // This isn't working... check out unmounting graph at some point
    // return () => {
    //   removeGraph();
    // };
  }, [data, drawGraph]);

  return <div ref={graph}></div>;
};

export default TechniqueCategoryPieGraph;
