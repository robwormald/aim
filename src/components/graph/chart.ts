const d3 = require('d3');
const fc = require('d3fc');

const dayInMs = 24 * 60 * 60 * 1000;

export default function() {

  const gridlines = fc.annotation.gridline()
    .yTicks(5);

  const candlestick = fc.series.candlestick()
    .key(function(d) { return d.date; });

  const multi = fc.series.multi()
    .series([gridlines, candlestick]);

  const xScale = fc.scale.dateTime();

  const chart = fc.chart.cartesian(xScale)
    .margin({ top: 10, right: 50, bottom: 20, left: 10 })
    .plotArea(multi)
    .xTicks(5)
    .yTicks(5)
    .xOuterTickSize(0)
    .yOuterTickSize(0);

  const priceExtent = fc.util.extent()
    .fields(['high', 'low']);

  return function(selection) {

    selection.each(function(data) {

      // configure x/y scale domains with dynamic data
      const latestTime = data[data.length - 1].date.getTime();
      chart.xDomain([
          new Date(latestTime - 38 * dayInMs),
          new Date(latestTime + 1 * dayInMs)
        ])
        .yDomain(priceExtent(data))
        .yNice();

      d3.select(this)
        // currently no transition because gridlines animate like ass (d3fc #752)
        // .transition()
        // .duration(500)
        .call(chart);

    });
  };
}
