var d3 = require('d3');
var fc = require('d3fc');
import chart from './chart';
import {Component, View, Input, ElementRef} from 'angular2/angular2';
import {Ticker} from '../../services/TickerService';
import { Subscription } from '@reactivex/rxjs';

@Component({
  selector: 'stock-graph'
})
@View({
  template: ``
})
export class StockGraph {
  subscription: Subscription<any>;

  @Input('ticker') ticker:Ticker;
  values: any[] = [];
  chart: any = chart();

  render: () => void;

  constructor(private el:ElementRef) {
    // de-couple rendering from incomming messages to prevent
    // a flood of updates (e.g. when the window regains focus)
    this.render = fc.util.render(() => {
      // associate data with selection and render chart
      d3.select(this.el.nativeElement)
        .datum(this.values)
        .call(this.chart);
    });
  }

  onInit() {
    this.subscription = this.ticker.ticks.subscribe((latestValue: any) => {
      // de-serialise the date into a real Date object
      latestValue.date = new Date(latestValue.date);

      // limit to latest 40 values
      this.values.push(latestValue);
      if (this.values.length > 40) {
        this.values.shift();
      }

      this.render();
    });
  }

  onDestroy() {
    // This is to work around Angular's View Caching.
    // Actual solution to clearing custom DOM TBD
    this.el.nativeElement.innerHTML = '';
    const subscription = this.subscription;
    if(subscription) {
      subscription.unsubscribe();
    }
  }
}
