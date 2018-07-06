/**
 * @fileOverview 通用工具
 * @author houquan | houquan@babytree-inc.com
 * @version 1.0.0 | 2018-05-03
 * @version 1.0.1 | 2018-05-22 | houquan     // 添加 qsToObj 方法
*/
import wepy from 'wepy'

// 播放时间格式化
const M = 60
function durationFormat (seconds) {
  seconds = Math.floor(seconds)
  const minites = Math.floor(seconds / M)
  seconds = seconds % M

  return `${minites}'${seconds}''`
}

/**
 * queryString 换换为 Object
 * @param {String} qs
 * @return {Object}
*/
function qsToObj (qs = '') {
  const pairs = qs.split('&')
  const ret = {}
  pairs.forEach(pair => {
    const [key, value] = pair.split('=')
    ret[key] = value
  })
  return ret
}

// 处理图片后缀
const imgSuffixHandler = (url = '') => {
  return url.replace(/(_mb\.img|\?imageView.+)/g, '_mb.jpg')
}

// 截断字符
function breakLineByWidth(text, fontSize, maxWidth) {
  let res = [], temp = [], w = 0
  let re = /^[\u4e00-\u9fa5]/
  let len = String(text).length

  for (var i = 0; i < len; i++) {
    if (text[i].trim()) {
      if (re.test(text[i])) {
        w += fontSize
      } else {
        w += fontSize / 2
      }
      if (Math.ceil(w) >= maxWidth) {
        res.push(temp.join(''))
        temp.length = 0
        w = 0
      } else if (i == len - 1) {
        temp.push(text[i])
        res.push(temp.join(''))
      }
      temp.push(text[i])
    }
  }
  return res
}
/**
 * canvas拼装成分享卡片
 * @param {*} imgbg  背景图片
 * @param {*} option 数组，支持图片和文字，及其
 * [{
 *  type:'image',
 *  imgurl:'that.data.headImg',
 *  x:x,
 *  y:y,
 *  w:w,
 *  h:h
 * },{
 *  type:'text',
 *  cont:'内容'，
 *  x:x,
 *  y:y,
 *  style:'#ffffff',
 *  size:30,
 *  vertical:'top',
 *  horizontal:'left',
 *  maxWidth:450
 * }]
 */
function drawCard(canvasId, cWidth, cHeight, option = []) {
  // console.log('option:', option)
  const ctx = wx.createCanvasContext(canvasId)

  /* 新的卡片样式start */
  // 绘制背景

  option.forEach(function(value, index) {
    let {x, y, w, h, s, b, size, maxWidth, weight = '', imgBL = false, srcW = 0, srcH = 0, line = 1} = value
    const scaleNum = 2
    x *= scaleNum
    y *= scaleNum
    w *= scaleNum
    h *= scaleNum
    size *= scaleNum
    maxWidth *= scaleNum

    switch (value.type) {
      case 'circleimage':
        //  绘制图片
        ctx.save()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, false)
        ctx.clip()
        ctx.drawImage(value.imgurl, x, y, w, h)
        ctx.restore()
        break

      case 'image':
        //  绘制图片
        if (imgBL && srcW && srcH) {
          ctx.drawImage(value.imgurl, 0, 0, srcW, srcH, x, y, w, h)
        } else {
          ctx.drawImage(value.imgurl, x, y, w, h)
        }
        break

      case 'text':
        //  绘制文字

        ctx.setFillStyle(value.style)
        ctx.setFontSize(size)
        ctx.setTextBaseline(value.vertical)
        ctx.setTextAlign(value.horizontal)
        if (weight == 'bold') {
          ctx.font = `${weight} ${size}px sans-serif`
        } else {
          ctx.font = `normal ${size}px sans-serif`
        }
        var texts = breakLineByWidth(value.cont, size, maxWidth)
        // 只写两行
        if (texts.length === 1) {
          ctx.fillText(texts[0], x, y)
        } else {
          texts.forEach(function(item, index) {
            if (index > line) {
              return
            }
            ctx.fillText(item, x, index * (size + 30) + y)
          })
        }

        break

      case 'rect':
        // 绘制中部白色区域
        ctx.setFillStyle(value.style)
        ctx.fillRect(x, y, w, h)

        break

      default:
        break
    }
  })
  ctx.draw()

  const promise = new Promise((resolve, reject) => {
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: cWidth,
        height: cHeight,
        destWidth: cWidth,
        destHeight: cHeight,
        canvasId: canvasId,
        success: function(res) {
          // console.log(res.tempFilePath)
        // 预览图片
          wx.previewImage({
            current: res.tempFilePath, // 当前显示图片的http链接
            urls: [res.tempFilePath], // 需要预览的图片http链接列表
            success: function(res) {}
          })
          resolve(res.tempFilePath)
        },
        complete: function complete(e) {
          // console.log(e)
        }
      })
    }, 500)
  })
  return promise
}

function gotoHome () {
  wepy.switchTab({
    url: '/pages/home/index'
  })
}
/**
 * 同步文章收藏状态辅助方法
 * 0 未收藏 1 收藏
 */
const COLLECT_DB = 'article_collect_db'
function selectCollectStatus() {
  return wepy.getStorageSync(COLLECT_DB) || []
}
function insertCollectStatus(id, type) {
  try {
    let collectData = selectCollectStatus()
    collectData.forEach((item, index) => {
      if (item.id === id) { collectData.splice(index, 1) }
    })
    collectData.push({id, type})
    wepy.setStorageSync(COLLECT_DB, collectData)
  } catch (error) {
    console.log('----同步收藏状态出错---' + error)
  }
}
function clearCollectStatus() {
  wepy.setStorageSync(COLLECT_DB, [])
}

function http2s (url) {
  return url.replace(/^(http)(:\/\/.*)/i, '$1s$2')
}

// 埋点上报方法
function send (data) {
  try {
    const app = getApp()
    app.stat.send(data)
  } catch (error) {
    console.log('[STAT ERROR]:', error)
  }
}

// 埋点上报方法
function flush (data) {
  try {
    const app = getApp()
    app.stat.flush(data)
  } catch (error) {
    console.log('[STAT ERROR]:', error)
  }
}

export {
  durationFormat,
  drawCard,
  qsToObj,
  gotoHome,
  send,
  flush,
  http2s,
  selectCollectStatus,
  insertCollectStatus,
  clearCollectStatus,
  imgSuffixHandler
}
