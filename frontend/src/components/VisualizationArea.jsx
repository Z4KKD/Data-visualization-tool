import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const VisualizationArea = ({ data, chartType }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length > 0) {
      const svg = d3.select(svgRef.current)
        .attr('width', 600)
        .attr('height', 400);

      svg.selectAll('*').remove();

      if (chartType === 'bar') {
        renderBarChart(svg, data);
      } else if (chartType === 'pie') {
        renderPieChart(svg, data);
      } else if (chartType === 'line') {
        renderLineChart(svg, data);
      } else if (chartType === 'heatmap') {
        renderHeatmap(svg, data);
      }
    }
  }, [data, chartType]);

  const renderBarChart = (svg, data) => {
    const margin = { top: 40, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(data.map(d => d.Name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Salary)])
      .nice()
      .range([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.Name))
      .attr('y', d => y(d.Salary))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.Salary))
      .attr('fill', '#1f77b4');

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Salary by Name');
  };

  const renderPieChart = (svg, data) => {
    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 20;

    const pieData = data.map(d => ({ name: d.Name, value: d.Salary }));
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().outerRadius(radius).innerRadius(0);
    const labelArc = d3.arc().outerRadius(radius).innerRadius(radius - 60);

    svg.attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const arcData = pie(pieData);

    g.selectAll('.arc')
      .data(arcData)
      .enter().append('g')
      .attr('class', 'arc')
      .append('path')
      .attr('d', arc)
      .style('fill', d => color(d.data.name));

    g.selectAll('.arc')
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('fill', 'white')
      .text(d => d.data.name);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Department Salary Distribution');
  };

  const renderLineChart = (svg, data) => {
    const margin = { top: 40, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scalePoint()
      .domain(data.map(d => d.Name))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Salary)])
      .nice()
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.Name))
      .y(d => y(d.Salary));

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ff7300')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));

    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Salary Trend by Name');
  };

  const renderHeatmap = (svg, data) => {
    const margin = { top: 50, right: 20, bottom: 50, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const departments = [...new Set(data.map(d => d.Department))];
    const names = data.map(d => d.Name);

    const x = d3.scaleBand().domain(names).range([0, width]).padding(0.05);
    const y = d3.scaleBand().domain(departments).range([0, height]).padding(0.05);

    const color = d3.scaleSequential(d3.interpolateOrRd)
      .domain([0, d3.max(data, d => d.Salary)]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.Name))
      .attr('y', d => y(d.Department))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', d => color(d.Salary));

    g.append('g').call(d3.axisLeft(y));
    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Heatmap: Salary by Name and Department');
  };

  return (
    <div className="mt-4">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default VisualizationArea;
