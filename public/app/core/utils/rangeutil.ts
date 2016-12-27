///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import moment from 'moment';
import * as dateMath from './datemath';

var spans = {
  's': {display: 'секунда'},
  'm': {display: 'минута'},
  'h': {display: 'час'},
  'd': {display: 'день'},
  'w': {display: 'неделя'},
  'M': {display: 'месяц'},
  'y': {display: 'год'},
};

var rangeOptions = [
  { from: '2016-04-01T00:00:00',    to: '2016-06-30T23:59:59',    display: 'I период',    section: 0 },
  { from: '2016-07-01T00:00:00',    to: '2016-09-30T23:59:59',    display: 'II период',   section: 0 },
  { from: '2016-10-01T00:00:00',    to: '2016-12-31T23:59:59',    display: 'III период',  section: 0 },
  { from: '2017-01-01T00:00:00',    to: '2017-03-31T23:59:59',    display: 'IV период',   section: 0 },
  { from: '2017-04-01T00:00:00',    to: '2017-06-30T23:59:59',    display: 'V период',    section: 0 },
  { from: '2017-07-01T00:00:00',    to: '2017-09-30T23:59:59',    display: 'VI период',   section: 0 },
  { from: '2017-10-01T00:00:00',    to: '2017-12-31T23:59:59',    display: 'VII период',  section: 0 },
  { from: '2018-01-01T00:00:00',    to: '2018-03-31T23:59:59',    display: 'VIII период', section: 0 },
  { from: '2018-04-01T00:00:00',    to: '2018-06-30T23:59:59',    display: 'IX период',   section: 0 },


];

var absoluteFormat = 'MMM D, YYYY HH:mm:ss';

var rangeIndex = {};
_.each(rangeOptions, function (frame) {
  rangeIndex[frame.from + ' to ' + frame.to] = frame;
});

export  function getRelativeTimesList(timepickerSettings, currentDisplay) {
  var groups = _.groupBy(rangeOptions, (option: any) => {
    option.active = option.display === currentDisplay;
    return option.section;
  });

  // _.each(timepickerSettings.time_options, (duration: string) => {
  //   let info = describeTextRange(duration);
  //   if (info.section) {
  //     groups[info.section].push(info);
  //   }
  // });

  return groups;
}

function formatDate(date) {
  return date.format(absoluteFormat);
}

// handles expressions like
// 5m
// 5m to now/d
// now/d to now
// now/d
// if no to <expr> then to now is assumed
export function describeTextRange(expr: any) {
  let isLast = (expr.indexOf('+') !== 0);
  if (expr.indexOf('now') === -1) {
    expr = (isLast ? 'now-' : 'now') + expr;
  }

  let opt = rangeIndex[expr + ' to now'];
  if (opt) {
    return opt;
  }

  if (isLast) {
    opt = {from: expr, to: 'now'};
  } else {
    opt = {from: 'now', to: expr};
  }

  let parts = /^now([-+])(\d+)(\w)/.exec(expr);
  if (parts) {
    let unit = parts[3];
    let amount = parseInt(parts[2]);
    let span = spans[unit];
    if (span) {
      opt.display = isLast ? 'Last ' : 'Next ';
      opt.display += amount + ' ' + span.display;
      opt.section = span.section;
      if (amount > 1) {
        opt.display += 's';
      }
    }
  } else {
    opt.display = opt.from + ' to ' + opt.to;
    opt.invalid = true;
  }

  return opt;
}

export function describeTimeRange(range) {
  var option = rangeIndex[range.from.toString() + ' to ' + range.to.toString()];
  if (option) {
    return option.display;
  }

  if (moment.isMoment(range.from) && moment.isMoment(range.to)) {
    return formatDate(range.from) + ' to ' + formatDate(range.to);
  }

  if (moment.isMoment(range.from)) {
    var toMoment = dateMath.parse(range.to, true);
    return formatDate(range.from) + ' to ' + toMoment.fromNow();
  }

  if (moment.isMoment(range.to)) {
    var from = dateMath.parse(range.from, false);
    return from.fromNow() + ' to ' + formatDate(range.to);
  }

  if (range.to.toString() === 'now') {
    var res = describeTextRange(range.from);
    return res.display;
  }

  return range.from.toString() + ' to ' + range.to.toString();
}

