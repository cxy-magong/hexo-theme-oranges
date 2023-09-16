function testHostAvailability(host, callback) {
  fetch(host)
    .then(response => {
      if (response.status === 200) {
        callback(true); 
        console.log(`${host} is accessible`);
      } else {
        callback(false);
      }
    })
    .catch(error => {
      callback(false);
    });
}


function replaceToCf(elements) {
  elements.forEach(element => {
    var url = element.src || element.href;
    console.log(`Try to switch to CF: ${url}`)
    
    if (url.includes('sv-v.magong.site')) {
      var newUrl = url.replace('sv-v.magong.site', 'sv-v-cf.magong.site');
      
      if (element.src) {
        element.src = newUrl;
      } else if (element.href) {
        element.href = newUrl;
      }
      
      console.log(`Switched to ${newUrl}`);
    }
  });
}

// Usage

const host1 = 'https://sv-v.magong.site/';
const host2 = 'https://sv-v-cf.magong.site/';

function reloadAllVideos() {
  // 获取所有的video标签
  const videoElements = document.querySelectorAll('video');

  // 重新加载视频
  videoElements.forEach(video => {
    video.load();
  });
}
testHostAvailability(host1, isHost1Accessible => {
  if (isHost1Accessible) {
    console.log(`Host ${host1} is accessible`);
    
  } else {
    console.log(`${host1} not accessible, trying ${host2}`);
    
    testHostAvailability(host2, isHost2Accessible => {
      if (isHost2Accessible) {
        console.log(`${host2} is accessible`);
        
        // Get all elements with host1 URLs
        const elements = document.querySelectorAll('[src*="sv-v.magong.site"], [href*="sv-v.magong.site"]');
        
        replaceToCf(elements);
        reloadAllVideos()
        
      } else {
        console.log('Both hosts unavailable');
      }
    });
  }
});

function makeSvgGray(icon) {
  var useElement = document.querySelector(`use[xlink:href="${icon}"]`);
  var svgElement = useElement.parentNode;
  svgElement.setAttribute('filter', 'grayscale(100%)');
}



// 使用函数语法而不是箭头函数 
function changeColor() {
  // 在这里获取svgEl
  const svgEl = document.querySelector('.icon.svg-icon');

  svgEl.style.fill = '#00ff00';
}

// 选择一个确定会提前加载的父元素
const parentEl = document.getElementById('parent'); 

// 绑定到这个父元素的load事件上 
parentEl.addEventListener('load', changeColor);

window.onload = () => {

  
}
// window.addEventListener('error', function(event) {
//   if (event.target.src.includes('sv-v.magong.site')) {
//     replaceToCf(event.target);
//   }
// }, true);

// async function main() {
//     const hasIPv6 = await checkIPv6();
    
//     const elements = document.querySelectorAll('.ip6');
    
//     if (hasIPv6) {
//       elements.forEach(el => el.style.display = ''); 
//     } else {
//       elements.forEach(el => el.style.display = 'none');
//     }
//   }
  
// main();