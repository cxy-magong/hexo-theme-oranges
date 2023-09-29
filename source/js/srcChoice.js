// axios 需要在 header.js 中导入才能使用

// 定义 JSON 数据的 URL
const nat_url = "https://sv-v-cf.magong.site/dat/nat/sv-v.json";

host_ip6 = 'https://sv-v.magong.site'
host_ip4 = 'http://117.140.128.135:37862'
host_cf = 'https://sv-v-cf.magong.site/'


function getDomain(url){
  var url = new URL(url);
  var hostname = url.hostname; // 获取域名
  var port = url.port; // 获取端口
  if (port){
    domain = hostname + ':' + port
  }
  else{
    domain = hostname
  }
  return domain
}

async function canAccess(url) {
  try {
    // console.log('get:', url)
    const response = await axios.get(url);
    return response.status === 200; 
  } catch (error) {
    console.log('error:', error, '\turl:',url)
    return false;
  }
};


function fillSvg(icon, color) {
  var useElement = document.querySelector(`${icon}`);
  // console.log("useElement:" + useElement.nodeName)
  useElement.style.fill = color;
}

function toggleSvg(icon, display) {
  var useElement = document.querySelector(`${icon}`);
  if (display) {
    useElement.style.display = "block";
  } else {
    useElement.style.display = "none";
  }
}

function networkIcon(state){
  if (state == 'ipv6'){
    // 显示原本的图标颜色（淡蓝）
    fillSvg('#icon-network', '#21A3DD')
  }else if (state == 'ipv4'){
    fillSvg('#icon-network', '#C0A000');
  }else if (state == 'cf'){
    fillSvg('#icon-network', 'gray');
  }else{
    toggleSvg('#icon-network', false)
  }
}

function reloadAllVideos() {
  // 获取所有的video标签
  const videoElements = document.querySelectorAll('video');

  // 重新加载视频
  videoElements.forEach(video => {
    video.load();
  });
}

async function accessAll(urls){
  const accessibleURL = await Promise.all(urls.map(canAccess)).then(results => {
    // results = [bool,bool,...]
    // results[0] = false
    // results[1] = false
    console.log("results:", results)
    if (results[0]){
      console.log('ipv6 network')
      networkIcon('ipv6')
    }
    else if (results[1]){
      console.log('ipv4 network')
      replaceDomain(host_ip6, host_ip4)
      networkIcon('ipv4')
      reloadAllVideos()
    }
    else if (results[2]){
      console.log('cf network')
      replaceDomain(host_ip6, host_cf)
      networkIcon('cf')
      reloadAllVideos()
    }
    else{
      networkIcon('none')
    }
    return results
  });
  
  return accessibleURL;
}



function replaceDomain(target, new_domain) {
  console.log("target, new_domain:", target, new_domain)
  const elements = document.querySelectorAll(`[src*="${target}"], [href*="${target}"]`);
  elements.forEach(element => {
    var url = element.src || element.href;
    if (url) {
      var newUrl = url.replace(target, new_domain);
      if (element.src) {
        element.src = newUrl;
      } else if (element.href) {
        element.href = newUrl;
      }
    }
    
    // console.log(`${url} Switched to ${newUrl}`);
  })
  
}

/**
 * @description: 创建一个 fetch 函数
 * @param {*} timeout: 传入超时的时间
 * @return {*} 返回一个新的 fetch 函数
 * https://www.jianshu.com/p/85d0192ddaca
 */
function createFetch(timeout) {
  // 返回一个新的 fetch 函数
  return (resource, options) => {
    // console.log('url:', resource)
    // 定义一个终止器
    let controller = new AbortController();
    // options 配置默认值
    options = options || {};
    // 向原来的 fetch 配置中加入 signal
    options.signal = controller.signal;
    const fetchPromise = fetch(resource, options); // 发出请求并将 Promise 存储起来
    setTimeout(() => {
      // 在 Promise 成功后运行 abort
      fetchPromise
        .then(response => {
          // 请求成功，不执行 abort
          // console.log('请求成功',response);
        })
        .catch(error => {
          // 请求失败，执行 abort
          controller.abort();
          // console.log("超时了",error);
        });
    }, timeout);
    return fetchPromise; // 返回 fetch 的 Promise
  };
}

// 使用 createFetch 创建一个新的 fetch 函数，并发出请求
createFetch(3000)(nat_url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`请求失败，状态码: ${response.status}`);
    }
    return response.json(); // 返回 response.json() 的 Promise 对象
  }).then(sv_v_nat => {
    // 在这里处理请求成功的情况
    // console.log('80 port adress:',sv_v_nat['80']);
    host_ip4 = 'http://' + sv_v_nat['80']
    const urls = [
      host_ip6,
      host_ip4,
      host_cf,
    ];
    accessAll(urls).then(result => {
        // console.log("accessible URL:", result);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  })
  .catch(error => {
    // 在这里处理请求失败的情况
    console.error('请求失败');
  });

// function createFetch(timeout) {
//   // 返回一个新的 fetch 函数
//   return (resource, options) => {
//     console.log('url:', resource)
//     // 定义一个终止器
//     let controller = new AbortController();
//     // options 配置默认值
//     options = options || {};
//     // 向原来的 fetch 配置中加入 signal
//     options.signal = controller.signal;
//     setTimeout(() => {
//       // 当时间到达之后运行 abort
//       controller.abort();
//       console.log("超时了")
//     }, timeout);
//     return fetch(resource, options);
//   };
// }

