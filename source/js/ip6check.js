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
    fillSvg('#icon-network', '#21A3DD')
  } else {
    console.log(`${host1} not accessible, trying ${host2}`);
    
    testHostAvailability(host2, isHost2Accessible => {
      if (isHost2Accessible) {
        console.log(`${host2} is accessible`);
        fillSvg('#icon-network', null)
        // Get all elements with host1 URLs
        const elements = document.querySelectorAll('[src*="sv-v.magong.site"], [href*="sv-v.magong.site"]');
        
        replaceToCf(elements);
        reloadAllVideos()
        
      } else {
        console.log('Both hosts unavailable');
        toggleSvg('#icon-network', false)
      }
    });
  }
});

function fillSvg(icon, color) {
  var useElement = document.querySelector(`${icon}`);
  console.log("useElement:" + useElement.nodeName)
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

function test(){
  var iconElement = document.querySelector('#icon-network');
  iconElement.addEventListener('mouseover', function() {
    fillSvg('#icon-network', null);
    console.log('mouse here')
  });
  iconElement.addEventListener('mouseout', function() {
    fillSvg('#icon-network', "green");
    console.log('mouse out')
  });
    fillSvg('#icon-network', null)
}

window.onload = () => {
  // test()
  // toggleSvg('#icon-network', true)
  // toggleSvg('#icon-network', false)
}
