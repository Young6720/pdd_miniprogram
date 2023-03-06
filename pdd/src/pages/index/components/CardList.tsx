import { useEffect, useState } from "react";
import { getSystemInfoSync, showLoading, hideLoading } from "@tarojs/taro";
import { ScrollView, type BaseEventOrig, type ScrollViewProps } from '@tarojs/components'
import { useOrderSearch } from "../hooks/useOrderSearch";

import Card from './Card'
import { type OrderParams } from "../../../api";
import styles from './styles.module.scss'

// 待优化，应该放在store里面
const phoneInfo = getSystemInfoSync()
const remWidth = phoneInfo.windowWidth / 20

// 这里用scroll实现无限加载，微信小程序不支持ObserverIntersection
// 每个盒子的高度是6rem小程序：1rem = 屏幕的宽度除以20
const CardList = ({ searchKey, listType }: Required<OrderParams>) => {
  const [pageNumber, setPageNumber] = useState(0);
  const { orders, loading, hasMore } = useOrderSearch(searchKey, listType, pageNumber)
  if (loading) {
    showLoading({ title: '加载中' })
  } else {
    hideLoading()
  }
  useEffect(() => {
    setPageNumber(0)
  }, [searchKey])

  function handleScroll(e: BaseEventOrig<ScrollViewProps.onScrollDetail>) {
    if (loading || !hasMore) return
    // list高度为100vh-5rem，所以滚动到底部时，scrollTop + (100vh-5rem) = scrollHeight - 6rem(一个card的高度)
    if (e.detail.scrollTop + (phoneInfo.windowHeight - 5 * remWidth) >= e.detail.scrollHeight - 6 * remWidth) {
      console.log('searching....,page+1')
      setPageNumber(pageNumber + 1)
    }
  }

  return (
    <ScrollView scrollY enableFlex scrollWithAnimation className={styles.list} onScroll={(e) => handleScroll(e)}>
      {orders.map((order) => <Card order={order} key={order.groupOrderId} />)}
    </ScrollView>
  )
}

export default CardList