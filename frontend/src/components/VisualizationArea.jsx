import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const VisualizationArea = ({ data, chartType, summary }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current)
      .attr('width', 600)
      .attr('height', 400);

    svg.selectAll('*').remove(); // Clear previous chart

    switch (chartType) {
      case 'bar':
        renderBarChart(svg, data, summary);
        break;
      case 'line':
        renderLineChart(svg, data, summary);
        break;
      case 'pie':
        renderPieChart(svg, data);
        break;
      case 'scatter':
        renderScatterPlot(svg, data);
        break;
      case 'heatmap':
        renderHeatmap(svg, data);
        break;
      default:
        break;
    }
  }, [data, chartType, summary]);

  // --- Chart Renderers ---
  const renderBarChart = (svg, data, summary) => {
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand().domain(data.map(d => d.Name)).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.Salary)]).nice().range([height, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.Name))
      .attr('y', d => y(0))
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', '#1f77b4')
      .transition().duration(800)
      .attr('y', d => y(d.Salary))
      .attr('height', d => height - y(d.Salary));

    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))
      .selectAll('text').attr('transform', 'rotate(-30)').style('text-anchor', 'end');
    g.append('g').call(d3.axisLeft(y));

    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')

    if (summary?.Salary?.mean !== undefined) {
      g.append('line')
        .attr('x1', 0).attr('x2', width)
        .attr('y1', y(summary.Salary.mean))
        .attr('y2', y(summary.Salary.mean))
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      g.append('text')
        .attr('x', width - 50)
        .attr('y', y(summary.Salary.mean) - 5)
        .attr('fill', 'red')
        .attr('font-size', '12px')
        .text(`Mean: ${summary.Salary.mean.toFixed(2)}`);
    }
  };

  const renderLineChart = (svg, data, summary) => {
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scalePoint().domain(data.map(d => d.Name)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.Salary)]).nice().range([height, 0]);

    const line = d3.line().x(d => x(d.Name)).y(d => y(d.Salary));
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('path').datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ff7300')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));

    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')

    if (summary?.Salary?.mean !== undefined) {
      g.append('line')
        .attr('x1', 0).attr('x2', width)
        .attr('y1', y(summary.Salary.mean))
        .attr('y2', y(summary.Salary.mean))
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      g.append('text')
        .attr('x', width - 50)
        .attr('y', y(summary.Salary.mean) - 5)
        .attr('fill', 'red')
        .attr('font-size', '12px')
        .text(`Mean: ${summary.Salary.mean.toFixed(2)}`);
    }
  };

  const renderPieChart = (svg, data) => {
    const width = 600, height = 400;
    const radius = Math.min(width, height) / 2 - 20;

    const pieData = data.map(d => ({ name: d.Name, value: d.Salary }));
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().outerRadius(radius).innerRadius(0);
    const labelArc = d3.arc().outerRadius(radius).innerRadius(radius - 60);

    svg.attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${width/2},${height/2})`);

    const arcs = g.selectAll('.arc').data(pie(pieData)).enter().append('g').attr('class', 'arc');

    arcs.append('path').attr('d', arc).attr('fill', d => color(d.data.name));
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('fill', 'white')
      .style('font-size', '12px')
      .text(d => d.data.name);

    svg.append('text')
      .attr('x', width/2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
  };

  const renderScatterPlot = (svg, data) => {
    if (!data[0].Age) return;
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.Salary)]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.Age)]).range([height, 0]);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('circle').data(data).enter()
      .append('circle')
      .attr('cx', d => x(d.Salary))
      .attr('cy', d => y(d.Age))
      .attr('r', 5)
      .attr('fill', '#ff6347')
      .attr('opacity', 0.8);

    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));

    svg.append('text')
      .attr('x', width/2 + margin.left)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
  };

  const renderHeatmap = (svg, data) => {
    const margin = { top: 50, right: 20, bottom: 50, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const departments = [...new Set(data.map(d => d.Department))];
    const names = data.map(d => d.Name);

    const x = d3.scaleBand().domain(names).range([0, width]).padding(0.05);
    const y = d3.scaleBand().domain(departments).range([0, height]).padding(0.05);
    const color = d3.scaleSequential(d3.interpolateOrRd).domain([0, d3.max(data, d => d.Salary)]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('rect').data(data).enter()
      .append('rect')
      .attr('x', d => x(d.Name))
      .attr('y', d => y(d.Department))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', d => color(d.Salary));

    g.append('g').call(d3.axisLeft(y));
    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    svg.append('text')
      .attr('x', width/2 + margin.left)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
  };

  return <div className="mt-4"><svg ref={svgRef}></svg></div>;
};

export default VisualizationArea;
