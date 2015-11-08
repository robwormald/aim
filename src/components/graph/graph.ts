var d3 = require('d3');
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

  constructor(private el:ElementRef) {

  }

  render(latestValue){
    // de-serialise the date into a real Date object
    latestValue.date = new Date(latestValue.date);

    // limit to latest 40 values
    this.values.push(latestValue);
    if (this.values.length > 40) {
      this.values.shift();
    }

    // associate data with selection and render chart
    d3.select(this.el.nativeElement)
      .datum(this.values)
      .call(this.chart);
  }

  onInit() {
    this.subscription = this.ticker.ticks.subscribe(tick => this.render(tick));
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
