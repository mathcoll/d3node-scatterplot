const D3Node = require('d3-node');

function scatter({
  data,
  selector: _selector = '#chart',
  container: _container = `
    <div id="container">
      <h2>Scatterplot Chart</h2>
      <div id="chart"></div>
    </div>
  `,
  style: _style = '',
  width: _width = 960,
  height: _height = 500,
  margin: _margin = { top: 20, right: 20, bottom: 60, left: 100 },
  lineWidth: _lineWidth = 5,
  lineColor: _lineColor = 'steelblue',
  lineColors: _lineColors = ['steelblue'],
  isCurve: _isCurve = true,
  tickSize: _tickSize = 5,
  tickPadding: _tickPadding = 5,
  barHoverColor: _barHoverColor = 'brown',
  labels: _labels = { xAxis: '', yAxis: '' },
} = {}) {
  const _svgStyles = `
    .dot { fill: ${_lineColor}; }
    .dot:hover { fill: ${_barHoverColor}; }
  `;
  
  const d3n = new D3Node({
    selector: _selector,
    svgStyles: _style,
    styles: _svgStyles + _style,
    container: _container,
  });

  const d3 = d3n.d3;

  const width = _width - _margin.left - _margin.right;
  const height = _height - _margin.top - _margin.bottom;

  const svg = d3n.createSVG(_width, _height)
        .append('g')
        .attr('transform', `translate(${_margin.left}, ${_margin.top})`);

  const g = svg.append('g');

  const { allKeys } = data;
  const xScale = d3.scaleLinear()
      .domain(allKeys ? d3.extent(allKeys) : d3.extent(data, d => d.key))
      .rangeRound([0, width]);
  const yScale = d3.scaleLinear()
      .domain(allKeys ? [d3.min(data, d => d3.min(d, v => v.value)), d3.max(data, d => d3.max(d, v => v.value))] : d3.extent(data, d => d.value))
      .rangeRound([height, 0]);
  const xAxis = d3.axisBottom(xScale)
        .tickSize(_tickSize)
        .tickPadding(_tickPadding);
  const yAxis = d3.axisLeft(yScale)
        .tickSize(_tickSize)
        .tickPadding(_tickPadding);

  g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  g.append('g').call(yAxis);

  g.append('g')
    .selectAll("dot")
    .data(allKeys ? data : data)
    .enter().append("circle")
      .attr("cx", function (d) { return xScale(d.key); } )
      .attr("cy", function (d) { return yScale(d.value); } )
      .attr("r", _lineWidth)
      .attr("class", "dot")
      .attr("fill", (d, i) => _lineColors.length ? _lineColors[i] : _lineColor);

  return d3n;
}

module.exports = scatter;
