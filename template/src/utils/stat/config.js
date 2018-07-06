/**
 * @fileOverview 宝宝树小程序埋点 SDK 配置
 * @author houquan | houquan@babytree-inc.com
 * @verison 1.0.0 | 2018-05-30 | houquan   // 初始版本
*/
import config from 'config'
const { appId, appName, env, version } = config

// 详情页扫码
const detailStat = {
  pi: 'SHARE_CON_DETAILS_MA',
  be: 'bsjx_content_id={id}&bsjx_ma_source_id={s}',
  cr: 'bsjx_ma_source_id={s}'
}

// 搜索结果页进入详情页
const searchDetailStat = {
  pi: '',
  be: 'bsjx_content_id={id}&bsjx_con_detail_source_id={s}',
  cr: 'bsjx_con_detail_source_id={s}'
}

// 达人主页扫码
const personStat = {
  pi: 'SHARE_VIP_H_MA',
  be: 'bsjx_author_id={uid}&bsjx_ma_source_id={s}',
  cr: 'bsjx_ma_source_id={s}'
}

// 搜索结果达人主页
const searchPersonStat = {
  pi: 'VIP_H',
  be: 'bsjx_author_id={uid}&bsjx_vip_h_source_id={s}',
  cr: 'bsjx_vip_h_source_id={s}'
}

export default {
  env,
  app: {
    id: appId,
    name: appName,
    version
  },
  stat: {
    'pages/details/index': {
      default: {
        pi: 'CON_DETAILS',
        be: 'bsjx_content_id={id}'
      },
      '0': {
        pi: 'SHARE_CON_DETAILS',
        be: 'bsjx_content_id={id}'
      },
      '1': detailStat,
      '2': detailStat,
      '3': searchDetailStat
    },
    'pages/person-homepage/index': {
      default: {
        pi: 'VIP_H',
        be: 'bsjx_author_id={uid}'
      },
      '0': {
        pi: 'SHARE_VIP_H',
        be: 'bsjx_author_id={uid}'
      },
      '1': personStat,
      '2': personStat,
      '3': searchPersonStat
    },
    'pages/collect/index': {
      default: {
        pi: 'BSJX_MY_H'
      }
    }
  }
}
