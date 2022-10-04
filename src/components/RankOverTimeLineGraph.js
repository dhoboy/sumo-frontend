import React, { useEffect, useCallback, useRef, useContext } from "react";
import * as d3 from "d3";
import { rankValueToName, rankValueToNameSmall } from "../utils";
import { WinSizeContext } from "../App";
import styles from "./styles/RankOverTimeLineGraph.module.css";

const RankOverTimeLineGraph = ({ data }) => {
  const graph = useRef(null);
  const { winWidth } = useContext(WinSizeContext);
  const smallScreen = winWidth <= 768;

  // My modified fork of Mike Bostock's LineChart
  // Copyright 2021 Observable, Inc.
  // Released under the ISC license.
  // https://observablehq.com/@d3/line-chart
  const LineChart = (
    data,
    {
      x = ([x]) => x, // given d in data, returns the (temporal) x-value
      y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
      defined, // for gaps in data
      curve = d3.curveLinear, // method of interpolation between points
      marginTop = 20, // top margin, in pixels
      marginRight = 10, // right margin, in pixels
      marginBottom = 30, // bottom margin, in pixels
      marginLeft = 100, // left margin, in pixels
      width = 640, // outer width, in pixels
      height = 400, // outer height, in pixels
      xType = d3.scaleUtc, // the x-scale type
      xDomain, // [xmin, xmax]
      xRange = [marginLeft, width - marginRight], // [left, right]
      yType = d3.scaleLinear, // the y-scale type
      yDomain, // [ymin, ymax]
      yRange = [height - marginBottom, marginTop], // [bottom, top]
      yFormat, // a format specifier string for the y-axis
      yLabel, // a label for the y-axis
      color = "currentColor", // stroke color of line
      strokeLinecap = "round", // stroke line cap of the line
      strokeLinejoin = "round", // stroke line join of the line
      strokeWidth = 1.5, // stroke width of line, in pixels
      strokeOpacity = 1, // stroke opacity of line
    } = {}
  ) => {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) {
      yDomain = [27, 1];
    }

    // Construct scales and axes.
    const xScale = d3.scaleUtc(xDomain, xRange);
    const yScale = yType(yDomain, yRange);

    const tournamentMonths = [1, 3, 5, 7, 9, 11];
    const highestRankAchieved = d3.min(data.map((d) => d.rank_value));

    const lowestSanyaku = 4; // Komusubi
    const lowestMaegashira = 22; // Maegashira #18

    // TODO: make these change based on light or dark color theme
    const sanyakuGoldLine = "#ffd700";
    const sanyakuGoldPoint = "#B59A00";
    const sanyakuGoldText = "#ffd700";
    // const sanyakuGoldText = "#695E1F";
    const maegashiraBlueLine = "#655CE0";
    const maegashiraBluePoint = "#5573E0";
    const maegashiraBlueText = "#655CE0";
    // const maegashiraBlueText = "#474561";

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width / 80)
      .tickFormat((d) => {
        const month = +d.getMonth() + 1;
        return tournamentMonths.includes(month)
          ? d3.timeFormat("%b %Y")(d)
          : "";
      })
      .tickSizeOuter(0);

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

    // Construct a line generator.
    const line = d3
      .line()
      .defined((i) => D[i])
      .curve(curve)
      .x((i) => xScale(X[i]))
      .y((i) => yScale(Y[i]));

    const svg = d3
      .select(graph.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // remove empty ticks, only want to show ticks of valid tournaments, not like october or february
    const xAxisG = svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    const xAxisTicks = xAxisG.selectAll(".tick");

    xAxisTicks.attr("font-size", smallScreen ? "17px" : "13px");

    const emptyTicks = xAxisTicks.filter((d) => {
      const month = +d.getMonth() + 1;
      return !tournamentMonths.includes(month);
    });

    emptyTicks.remove();

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(width / 80)
      .tickSizeOuter(0)
      .tickFormat((d) =>
        smallScreen ? rankValueToNameSmall[d] : rankValueToName[d]
      );

    // y axis
    const yAxisG = svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
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
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel)
      );

    const yAxisTicks = yAxisG.selectAll(".tick");
    yAxisTicks.attr("font-size", smallScreen ? "16px " : "12px");

    yAxisTicks.selectAll("text").attr("fill", (d) => {
      if (d <= lowestSanyaku) return sanyakuGoldText;
      if (d > lowestSanyaku && d <= lowestMaegashira) return maegashiraBlueText;
      return "#ccc";
    });

    const rankLines = svg.append("g");
    rankLines
      .append("line")
      .attr("x1", marginLeft - 6)
      .attr("x2", width - marginRight)
      .attr("y1", yScale(lowestSanyaku))
      .attr("y2", yScale(lowestSanyaku))
      .attr("stroke", sanyakuGoldLine)
      .attr("stroke-width", 2);

    rankLines
      .append("line")
      .attr("x1", marginLeft - 6)
      .attr("x2", width - marginRight)
      .attr("y1", yScale(lowestMaegashira))
      .attr("y2", yScale(lowestMaegashira))
      .attr("stroke", maegashiraBlueLine)
      .attr("stroke-width", 2);

    // line connecting the points
    svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-opacity", strokeOpacity)
      .attr("d", line(I));

    // Yokozuna stars
    const symbol = d3.symbol();
    symbol.type(d3.symbolStar);

    const stars = svg
      .selectAll(".star")
      .data(data.filter((d) => d.rank_value === 1))
      .join("g")
      .attr("class", "star");

    // big hover circles around the stars
    stars
      .append("circle")
      .attr("class", "big-points-make-hover-easy")
      .attr("cx", (d) =>
        xScale(new Date(+d.tournament.year, +d.tournament.month - 1))
      )
      .attr("cy", (d) => yScale(d.rank_value))
      .attr("fill-opacity", 0)
      .attr("r", 10)
      .on(
        "mouseover",
        smallScreen
          ? null
          : (event, d) => {
              const date = new Date(
                +d.tournament.year,
                +d.tournament.month - 1
              );

              tooltip.html("");
              tooltip.append("h4").text(d3.timeFormat("%B %Y")(date));

              tooltip.append("p").text(`${d.rank}`);

              return tooltip.style("visibility", "visible");
            }
      )
      .on(
        "mousemove",
        smallScreen
          ? null
          : (event, d) => {
              let { pageX, pageY } = event;
              let left = pageX + 10;
              let top = pageY - 50;

              if (pageX >= 715) {
                left = pageX - 200;
              }

              return tooltip
                .style("top", `${top}px`)
                .style("left", `${left}px`);
            }
      )
      .on(
        "mouseout",
        smallScreen
          ? null
          : () => {
              return tooltip.style("visibility", "hidden");
            }
      );

    stars
      .append("path")
      .attr("d", symbol.size(50))
      .attr("fill", sanyakuGoldPoint)
      .attr("transform", (d) => {
        return `translate(${xScale(
          new Date(+d.tournament.year, +d.tournament.month - 1)
        )},${yScale(d.rank_value)})`;
      })
      .on(
        "mouseover",
        smallScreen
          ? null
          : (event, d) => {
              const date = new Date(
                +d.tournament.year,
                +d.tournament.month - 1
              );

              tooltip.html("");
              tooltip.append("h4").text(d3.timeFormat("%B %Y")(date));

              tooltip.append("p").text(`${d.rank}`);

              return tooltip.style("visibility", "visible");
            }
      )
      .on(
        "mousemove",
        smallScreen
          ? null
          : (event, d) => {
              let { pageX, pageY } = event;
              let left = pageX + 10;
              let top = pageY - 50;

              if (pageX >= 715) {
                left = pageX - 200;
              }

              return tooltip
                .style("top", `${top}px`)
                .style("left", `${left}px`);
            }
      )
      .on(
        "mouseout",
        smallScreen
          ? null
          : () => {
              return tooltip.style("visibility", "hidden");
            }
      );

    // All other ranks drawn with points
    const points = svg
      .selectAll(".point")
      .data(data.filter((d) => d.rank_value > 1)) // yokozuna is drawn with stars
      // .data(data)
      .join("g")
      .attr("class", "point");

    // Big points to make the hover easy
    points
      .append("circle")
      .attr("class", "big-points-make-hover-easy")
      .attr("cx", (d) =>
        xScale(new Date(+d.tournament.year, +d.tournament.month - 1))
      )
      .attr("cy", (d) => yScale(d.rank_value))
      .attr("fill-opacity", 0)
      .attr("r", 10)
      .on(
        "mouseover",
        smallScreen
          ? null
          : (event, d) => {
              const date = new Date(
                +d.tournament.year,
                +d.tournament.month - 1
              );

              tooltip.html("");
              tooltip.append("h4").text(d3.timeFormat("%B %Y")(date));

              tooltip.append("p").text(`${d.rank}`);

              return tooltip.style("visibility", "visible");
            }
      )
      .on(
        "mousemove",
        smallScreen
          ? null
          : (event, d) => {
              let { pageX, pageY } = event;
              let left = pageX + 10;
              let top = pageY - 50;

              if (pageX >= 715) {
                left = pageX - 200;
              }

              return tooltip
                .style("top", `${top}px`)
                .style("left", `${left}px`);
            }
      )
      .on(
        "mouseout",
        smallScreen
          ? null
          : () => {
              return tooltip.style("visibility", "hidden");
            }
      );

    // the points you see
    points
      .append("circle")
      .attr("cx", (d) =>
        xScale(new Date(+d.tournament.year, +d.tournament.month - 1))
      )
      .attr("cy", (d) => yScale(d.rank_value))
      .attr("fill", (d) => {
        if (d.rank_value <= lowestSanyaku) {
          return sanyakuGoldPoint;
        } else if (d.rank_value <= lowestMaegashira) {
          return maegashiraBluePoint;
        }
        return "#ccc";
      })
      .attr("r", (d) => {
        return 3;
        //return d.rank_value === highestRankAchieved ? 5 : 3;
      })
      .on(
        "mouseover",
        smallScreen
          ? null
          : (event, d) => {
              const date = new Date(
                +d.tournament.year,
                +d.tournament.month - 1
              );

              tooltip.html("");
              tooltip.append("h4").text(d3.timeFormat("%B %Y")(date));

              tooltip.append("p").text(`${d.rank}`);

              return tooltip.style("visibility", "visible");
            }
      )
      .on(
        "mousemove",
        smallScreen
          ? null
          : (event, d) => {
              let { pageX, pageY } = event;
              let left = pageX + 10;
              let top = pageY - 50;

              if (pageX >= 715) {
                left = pageX - 200;
              }

              return tooltip
                .style("top", `${top}px`)
                .style("left", `${left}px`);
            }
      )
      .on(
        "mouseout",
        smallScreen
          ? null
          : () => {
              return tooltip.style("visibility", "hidden");
            }
      );
  };

  const drawGraph = useCallback(() => {
    // Good Ol' React/D3 integration drawing graphs too many times workaround
    // Only draw the graph if it isn't already drawn
    if (d3.select(graph.current).select("svg").empty()) {
      LineChart(data, {
        x: (d) => new Date(+d.tournament.year, +d.tournament.month - 1),
        y: (d) => d.rank_value,
        width: 1000,
        height: 280,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Draw graph when data is ready, tear down graph when unmounting
  useEffect(() => {
    if (data.length) {
      drawGraph();
    }
  }, [data, drawGraph]);

  return <div ref={graph}></div>;
};

export default RankOverTimeLineGraph;
