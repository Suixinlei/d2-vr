/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   笑斌 <xinlei.sxl@alibaba-inc.com>
 */
var Helper = {};

Helper.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

window.Helper = Helper;