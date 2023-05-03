/*
  - 根据expireTime，使用管道聚合删除然后移动订单到存放过期的集合中，可以5min定时运行一次
  - 如果订单信息不全，则直接删除 定时任务可以设置成1天执行一次
  - 逐个请求当前订单是否拼满，如果拼满则移动到存放到过期的集合中，定时10min进行一次。
  - 获取拼单信息，定时任务可以设置成30min执行一次
 */
import nodeSchedule from "node-schedule";
import {
  moveExpiredOrders,
  traverseOrders,
  deleteIncompleteOrders,
} from "./../db/traverseOrders.js";
import { uploadOrderData } from "./../upload/getDataFromOther.js";

// 每5min执行一次
nodeSchedule.scheduleJob("*/5 * * * *", () => {
  console.log("定时任务：移动过期订单");
  moveExpiredOrders();
});

// 每10min执行一次
nodeSchedule.scheduleJob("*/10 * * * *", () => {
  console.log("定时任务：更新订单信息");
  traverseOrders();
});

// 每30min执行一次
nodeSchedule.scheduleJob("*/30 * * * *", () => {
  console.log("定时任务：获取拼单信息");
  uploadOrderData();
});

// 每天执行一次
nodeSchedule.scheduleJob("0 0 * * *", () => {
  console.log("定时任务：删除不完整的订单");
  deleteIncompleteOrders();
});