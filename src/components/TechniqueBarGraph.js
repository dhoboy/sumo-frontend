import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import styles from "./styles/TechniqueBarGraph.module.css";

const TechniqueBarGraph = ({ data, yLabel = "Percentage" }) => {
  const graph = useRef(null);

  // My modified fork of Mike Bostock's BarChart
  // Copyright 2021 Observable, Inc.
  // Released under the ISC license.
  // https://observablehq.com/@d3/bar-chart
  function BarChart(
    data,
    {
      x = (d, i) => i, // given d in data, returns the (ordinal) x-value
      y = (d) => d, // given d in data, returns the (quantitative) y-value
      title, // given d in data, returns the title text
      marginTop = 40, // the top margin, in pixels
      marginRight = 0, // the right margin, in pixels
      marginBottom = 75, // the bottom margin, in pixels
      marginLeft = 40, // the left margin, in pixels
      width = 640, // the outer width of the chart, in pixels
      height = 400, // the outer height of the chart, in pixels
      xDomain, // an array of (ordinal) x-values
      xRange = [marginLeft, width - marginRight], // [left, right]
      yType = d3.scaleLinear, // y-scale type
      yDomain, // [ymin, ymax]
      yRange = [height - marginBottom, marginTop], // [bottom, top]
      xPadding = 0.1, // amount of x-range to reserve to separate bars
      yFormat, // a format specifier string for the y-axis
      yLabel, // a label for the y-axis
      color = "currentColor", // bar fill color
    } = {}
  ) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);

    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    xDomain = new d3.InternSet(xDomain);

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // bringing back my d3@v4 tooltip
    let tooltip;
    if (d3.select("body").select("#tooltip").node()) {
      tooltip = d3.select("body").select("#tooltip");
    } else {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", styles.tooltip)
        .style("position", "absolute")
        .style("z-index", "1000")
        .style("visibility", "hidden");
    }

    const techniqueCategoryScale = d3
      .scaleOrdinal()
      .domain(["force", "push", "dodge", "throw", "default", "uncategorized"])
      .range(["#e41a1c", "#33a02c", "#377eb8", "#984ea3", "#252525", "#ccc"]);

    // Compute titles.
    if (title === undefined) {
      const formatValue = yScale.tickFormat(100, yFormat);
      title = (i) => `${X[i]}\n${formatValue(Y[i])}`;
    } else {
      const O = d3.map(data, (d) => d);
      const T = title;
      title = (i) => T(O[i], i, data);
    }

    // draw svg
    const svg = d3
      .select(graph.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 95%; height: auto; height: intrinsic;");

    // draw y axis
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick").style("font-size", 14)) // bigger tick size font

      // these are the horizontal lines that run across the graph
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      )

      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", marginTop / 2)
          .attr("fill", "currentColor")
          .attr("font-size", 16)
          .attr("text-anchor", "start")
          .text(yLabel)
      );

    // draw bars
    const bar = svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("fill", (d) => techniqueCategoryScale(d.technique_category))
      .attr("x", (d) => xScale(d.technique))
      .attr("y", (d) => yScale(d.percent))
      .attr("height", (d) => yScale(0) - yScale(d.percent))
      .attr("width", xScale.bandwidth())
      .on("mouseover", (event, d) => {
        tooltip.html("");
        tooltip.append("h3").text(d.technique || "");
        tooltip.append("h5").text(d.technique_en || "");

        const count = d.count || "";
        const percent = d.percent || "";
        const category = d.technique_category || "uncategorized";

        // does need a class name?
        const body = tooltip.append("div").attr("class", styles.body);

        const category_capitalized = category
          .charAt(0)
          .toUpperCase()
          .concat(category.slice(1));

        body
          .append("p")
          .attr("class", styles[category.toLowerCase()])
          .text(`Category: ${category_capitalized}`);

        body.append("p").text(`Percentage: ${d3.format(".2%")(percent)}`);

        body.append("p").text(`Frequency: ${count}`);

        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", (event, d) => {
        let { pageX, pageY } = event;
        let left = pageX + 10;
        let top = pageY - 200;

        if (pageX >= 715) {
          left = pageX - 200;
        }

        return tooltip.style("top", `${top}px`).style("left", `${left}px`);
      })
      .on("mouseout", () => {
        return tooltip.style("visibility", "hidden");
      });

    if (title) bar.append("title").text(title);

    // draw x axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      .call((g) => g.selectAll(".tick").style("font-size", 14)) // bigger tick size font, and rotate the ticks
      .call((g) =>
        g
          .selectAll(".tick")
          .select("text")
          .attr("transform", "translate(-10,20),rotate(-25)")
      );
  }

  const drawGraph = useCallback(() => {
    // Good Ol' React/D3 integration drawing graphs too many times workaround
    // Only draw the graph if it isn't already drawn
    if (d3.select(graph.current).select("svg").empty()) {
      BarChart(data, {
        x: (d) => d.technique,
        y: (d) => d.percent, // sort by descending percent
        xDomain: d3.groupSort(
          data,
          ([d]) => -d.percent,
          (d) => d.technique
        ),
        yFormat: "%",
        yLabel,
        width: 800,
        height: 500,
      });
    }
  }, [data, yLabel]);

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

export default TechniqueBarGraph;
