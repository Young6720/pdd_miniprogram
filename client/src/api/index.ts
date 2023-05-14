import {
  request,
  addInterceptor,
  interceptors,
  RequestTask,
} from "@tarojs/taro";
import { pddRequest } from "../utils/index";
import type { OrderData, OrderParams, CouponData } from "./types";

addInterceptor(interceptors.timeoutInterceptor);

const urlPrefix = process.env.URL_PREFIX;
// 获取拼单列表
export const getOrders = (
  query?: OrderParams,
  currentPage?: number
): RequestTask<OrderData[]> => {
  return request({
    url: `${process.env.URL_PREFIX}/orders/`,
    method: "GET",
    data: {
      goodsName: query?.searchKey || "",
      currentPage: currentPage || 0,
      listType: query?.listType,
    },
  });
};

// 创建新拼单
export const createNewGroup = (url: string, openId: string) => {
  console.log(urlPrefix);
  return request({
    url: `${urlPrefix}/orders/`,
    method: "POST",
    data: {
      url,
      openId,
    },
  });
};

// 获取用户ID
export const getOpenId = (
  code: string
): RequestTask<{ openid: string; session_key: string }> => {
  return request({
    url: `${urlPrefix}/user/login`,
    method: "GET",
    data: {
      code,
    },
  });
};

// 获取用户名下的拼单
export const getMyOrders = (
  openId: string
): RequestTask<{ success: boolean; message: string; data: OrderData[] }> => {
  return request({
    url: `${urlPrefix}/user/orders/${openId}`,
    method: "GET",
  });
};
console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

/**
 * @description 获取拼多多优惠商品信息
 * @see https://jinbao.pinduoduo.com/third-party/api-detail?apiName=pdd.ddk.goods.recommend.get
 * @param {number} currentPage - 从多少位置开始请求；默认值 ： 0 // 必须是limit的整数倍，limit默认是20
 */
export const getCouponGoods = async (
  currentPage: number
): Promise<CouponData[]> => {
  const res = await pddRequest({
    type: "pdd.ddk.goods.recommend.get",
    offset: currentPage * 20,
    channel_type: 6,
  });
  if (!res) return [];
  return res.data.goods_basic_detail_response.list;
};

/**
 * @description 搜索商品
 * @see https://jinbao.pinduoduo.com/third-party/api-detail?apiName=pdd.ddk.goods.search
 */

export const searchCouponGoods = async (
  currentPage: number,
  searchKey: string
): Promise<CouponData[]> => {
  const res = await pddRequest({
    type: "pdd.ddk.goods.search",
    keyword: searchKey,
    offset: currentPage * 20,
    pid: process.env.PID as string,
    sort_type: 2,
  }).catch();
  if (!res) return [];
  return res.data.goods_search_response.goods_list;
};
