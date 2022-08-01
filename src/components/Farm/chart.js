import { formatHour, formatTime, formatDate } from '../../lib/util'
export const showLine = function (
  symbol,
  xaxis,
  yaxis,
  echarts,
  colorBottom,
  type,
  isGreen
) {
  return {
    textStyle: {
      fontFamily: "'DINPro-Medium', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif"
    },
    dataZoom: [
      {
        type: 'inside',
      },
      {
        type: 'inside',
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.8)',
      axisPointer: {
        type: 'cross',
        label: {
          show: false
        },
        lineStyle: {
          color: [isGreen ? '#56BC88' : '#EC6A5C']
        },
        crossStyle: {
          color: isGreen ? '#56BC88' : '#EC6A5C'
        }
      },
      extraCssText: 'z-index: 2',
      // formatter: function (params) {
      //   let time = `<span>${params[0].axisValue}</span>`
      //   let price = `<p style="font-size: 14px;">
      //         <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background:${isGreen ? '#56BC88' : '#EC6A5C'}"></span> 
      //         Price: <span style="color: #000;font-size: 12px;">${params[0].data}</span>
      //       </p>`
      //   let tipbox = `<div style="font-size: 12px;">${time}${price}</div>`
      //   return tipbox
      // },
      position: function (pos, params, el, elRect, size) {
        const obj = {}
        if (pos[0] < size.viewSize[0] / 2) {
          obj.left = pos[0]
        } else {
          obj.right = size.viewSize[0] - pos[0]
        }
        if (pos[1] < size.viewSize[1] / 2) {
          obj.top = pos[1]
        } else {
          obj.bottom = size.viewSize[1] - pos[1]
        }
        return obj
      }
    },
    grid: {
      top: 30,
      bottom: '0',
      left: '0',
      right: '0',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xaxis,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255, 255, 255, .6)',
          fontWeight: 'normal'
        }
      },
      axisLabel: {
        formatter: function (value) {
          return type * 1 === 1 ? formatHour(new Date(value.replace(/-/g, '/')).getTime() / 1000) : formatDate(new Date(value.replace(/-/g, '/')).getTime() / 1000)
        },
        padding: [0, 0, 0, 30],
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255, 255, 255, .6)',
          width: 1
        }
      }
    },
    yAxis: {
      show: true,
      type: 'value',
      position: 'right',
      scale: true,
      axisLabel: {
        // formatter: function(){
        //   return ''
        // }
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255, 255, 255, .6)'
        }
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#111111',
          width: 1
        }
      }
    },
    series: [{
      name: symbol,
      data: yaxis,
      type: 'line',
      symbol: "none",
      itemStyle: {
        normal: {
          // color: '#fff',
          lineStyle: {
            width: 2,
            color: isGreen ? '#56BC88' : '#EC6A5C'
          }
        },
        emphasis: {
          lineStyle: {
            width: 2,
          }
        }

      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0, color: isGreen ? '#56BC88' : '#EC6A5C',  // 0% 处的颜色
        }, {
          offset: 1, color: colorBottom // 100% 处的颜色
        }]
        ),
        opacity: 0.3
      }
    }]
  }
}

export const showK = function (
  symbol,
  xaxis,
  yaxis,
  type
) {
  return {
    textStyle: {
      fontFamily: "'DINPro-Medium', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif"
    },
    dataZoom: [
      {
        type: 'inside',
      },
      {
        type: 'inside',
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.8)',
      axisPointer: {
        type: 'cross',
        label: {
          show: false
        },
        crossStyle: {
          color: '#56BC88'
        },
        lineStyle: {
          color: '#56BC88'
        }
      },
      extraCssText: 'z-index: 2',
      // formatter: function (params) {
      //   // let time = `<span>${params[0].axisValue}</span>`
      //   // let oc = `<div>
      //   // <span>O: </span><span style="color: ${params[0].data[2] >= params[0].data[1] ? '#56BC88':'#EC6A5C'}">${params[0].data[1]}</span>
      //   // <span style="margin-left: 20px"> C: </span><span style="color: ${params[0].data[2] >= params[0].data[1] ? '#56BC88':'#EC6A5C'}">${params[0].data[2]}</span>
      //   // </div>`
      //   // let hl = `<div>
      //   // <span>H: </span><span style="color: ${params[0].data[2] >= params[0].data[1] ? '#56BC88':'#EC6A5C'}">${params[0].data[4]}</span>
      //   // <span style="margin-left: 20px"> L: </span><span style="color: ${params[0].data[2] >= params[0].data[1] ? '#56BC88':'#EC6A5C'}">${params[0].data[3]}</span>
      //   // </div>`
      //   // let rate = `<div>
      //   // <span style="color: ${params[0].data[2] >= params[0].data[1] ? '#56BC88':'#EC6A5C'}">${params[0].data[2] >= params[0].data[1] ? '+':''}${(params[0].data[2] - params[0].data[1]).toFixed(4)}</span>
      //   // <span style="margin-left: 20px;color: ${params[0].data[2] >= params[0].data[1] ? '#56BC88':'#EC6A5C'}">${params[0].data[2] >= params[0].data[1] ? '+':''}${((params[0].data[2] - params[0].data[1])*100/params[0].data[1]).toFixed(4)}%</span>
      //   // </div>`


      //   let last_close = params[0].dataIndex === 0 ? yaxis[0][1] : yaxis[params[0].dataIndex - 1][1]
      //   let time = `<span>${params[0].axisValue}</span>`
      //   let oc = `<div>
      //         <span>O: </span><span style="color: ${params[0].data[1] > last_close ? '#56BC88' : (params[0].data[1] === last_close) ? '#999' : '#EC6A5C'}">${params[0].data[1]}</span>
      //         <span style="margin-left: 20px"> C: </span><span style="color: ${params[0].data[2] > last_close ? '#56BC88' : (params[0].data[2] === last_close) ? '#999' : '#EC6A5C'}">${params[0].data[2]}</span>
      //         </div>`
      //   let hl = `<div>
      //         <span>H: </span><span style="color: ${params[0].data[4] > last_close ? '#56BC88' : (params[0].data[4] === last_close) ? '#999' : '#EC6A5C'}">${params[0].data[4]}</span>
      //         <span style="margin-left: 20px"> L: </span><span style="color: ${params[0].data[3] > last_close ? '#56BC88' : (params[0].data[3] === last_close) ? '#999' : '#EC6A5C'}">${params[0].data[3]}</span>
      //         </div>`
      //   let rate = `<div>
      //         <span style="color: ${params[0].data[2] >= params[0].data[1] ? '#56BC88' : '#EC6A5C'}">${params[0].data[2] >= params[0].data[1] ? '+' : ''}${(params[0].data[2] - params[0].data[1]).toFixed(4)}</span>
      //         <span style="margin-left: 20px;color: ${params[0].data[2] >= params[0].data[1] ? '#56BC88' : '#EC6A5C'}">${params[0].data[2] >= params[0].data[1] ? '+' : ''}${((params[0].data[2] - params[0].data[1]) * 100 / params[0].data[1]).toFixed(4)}%</span>
      //         </div>`
      //   let tipbox = `<div style="font-size: 12px;">${time}${oc}${hl}${rate}</div>`
      //   return tipbox
      // },
      position: function (pos, params, el, elRect, size) {
        const obj = {}
        if (pos[0] < size.viewSize[0] / 2) {
          obj.left = pos[0]
        } else {
          obj.right = size.viewSize[0] - pos[0]
        }
        if (pos[1] < size.viewSize[1] / 2) {
          obj.top = pos[1]
        } else {
          obj.bottom = size.viewSize[1] - pos[1]
        }
        return obj
      }
    },
    grid: {
      top: '30',
      bottom: '0',
      left: '0',
      right: '10',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xaxis,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255, 255, 255, .6)'
        }
      },
      axisLabel: {
        formatter: function (value) {
          return (type * 1 === 5 || type * 1 === 6 || type * 1 === 7) ? formatHour(new Date(value.replace(/-/g, '/')).getTime() / 1000) : formatDate(new Date(value.replace(/-/g, '/')).getTime() / 1000)
        },
        padding: [0, 0, 0, 30]
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255, 255, 255, .6)',
          width: 1
        }
      }
    },
    yAxis: {
      show: true,
      type: 'value',
      position: 'right',
      scale: true,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255, 255, 255, .6)'
        }
      }
    },
    series: [{
      name: symbol,
      data: yaxis,
      type: 'candlestick',
      symbol: "none",
      itemStyle: {
        normal: {
          color: '#56BC88',
          color0: '#EC6A5C',
          borderColor: '#56BC88',
          borderColor0: '#EC6A5C',
        },
        emphasis: {
          lineStyle: {
            width: 2,
          }
        }
      }
    }]
  }
}


