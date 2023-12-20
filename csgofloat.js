var dataList = [];

function fetchData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.swap.gg/v2/trade/prices/730', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var result = response.result;
      for (var i = 0; i < result.length; i++) {
        var item = result[i];
        var marketName = item.marketName;
        var userPrice = item.price.sides.user;
        var stockHave = item.stock.have;
        var stockMax = item.stock.max;
        dataList.push({
          marketName: marketName,
          userPrice: userPrice,
          stockHave: stockHave,
          stockMax: stockMax
        });
      }
      console.log(dataList);
      addTags();
    } else {
      console.log('Ошибка: ' + xhr.status);
    }
  };
  xhr.onerror = function() {
    console.log('Ошибка запроса');
  };
  xhr.send();
}

function addTags() {
  var matCardHeaders = document.querySelectorAll('.item-card');
  matCardHeaders.forEach(function(header) {
    var itemGrid = header.querySelector('.item-grid');
    if (itemGrid){
      var itemNameElement = header.querySelector('.item-name');
      var additionalTextElement = header.querySelector('[style="color: darkgray; font-size: 15px;"]');
      if (
        itemNameElement &&
        (itemNameElement.textContent.includes('2013') ||
          itemNameElement.textContent.includes('2014') ||
          itemNameElement.textContent.includes('2015') ||
          itemNameElement.textContent.includes('2016') ||
          itemNameElement.textContent.includes('2017') ||
          itemNameElement.textContent.includes('2018') ||
          itemNameElement.textContent.includes('2019') ||
          itemNameElement.textContent.includes('2020') ||
          itemNameElement.textContent.includes('2021') ||
          itemNameElement.textContent.includes('2022') ||
          itemNameElement.textContent.includes('2023'))
      ) {
        // console.log('Sticker | ' + itemNameElement.textContent.trim());
        var resStick = 'Sticker | ' + itemNameElement.textContent.trim();
        var matchingItem = null;
        dataList.forEach(function(stiker) {
          if (stiker.marketName === resStick) {
            matchingItem = stiker;
            return;
          }
        });
        var existingDiv = header.getElementsByClassName('price_swap_sticker');
        if (existingDiv.length === 0) {
          if (matchingItem) {
            var priceElement = header.querySelector('.price.ng-star-inserted');
            if (priceElement) {
              var priceText = priceElement.textContent.trim();
              var priceValue = parseFloat(priceText.substring(1));
            } else {
              console.log('Элемент с ценой не найден');
            }
            var newElement = document.createElement('div');
            newElement.className = 'price_swap_sticker';
            newElement.innerText =
              'P:' +
              matchingItem.userPrice / 100 +
              '$ H:' +
              matchingItem.stockHave +
              ' M:' +
              matchingItem.stockMax +
              ' ' +
              (((matchingItem.userPrice / 100) - priceValue) / priceValue * 100).toFixed(2) +
              '%';
            if ((((matchingItem.userPrice / 100) - priceValue) / priceValue * 100) > 90) {
              newElement.style.color = 'green';
            } else {
              newElement.style.color = 'red';
              }
              newElement.style.fontWeight = '700';
              newElement.style.fontSize = '25px';
              itemGrid.appendChild(newElement);
          }
        } else {
          console.log('Блок уже существует!');
        }
      } else {
        if (itemNameElement && additionalTextElement) {
          var itemName = itemNameElement.textContent.trim();
          var additionalText = additionalTextElement.textContent.trim();
          var validAdditionalText = additionalText.replace(/(Factory New|Battle-Scarred|Minimal Wear|Well-Worn|Field-Tested)/g, '($1)');
          validAdditionalText = validAdditionalText.replace(/\(Phase [1-4]\)|\(Ruby\)/g, '').trim();
          if (validAdditionalText.includes('StatTrak™')) {
            itemName = 'StatTrak™ ' + itemName;
            validAdditionalText = validAdditionalText.replace('StatTrak™', '').trim();
          }
          var result = itemName + ' ' + validAdditionalText;
          var matchingItem = null;
          dataList.forEach(function(item) {
            if (item.marketName === result) {
              matchingItem = item;
              return;
            }
          });
          var existingDiv = header.getElementsByClassName('price_swap');
          if (existingDiv.length === 0) {
            if (matchingItem) {
              var priceElement = header.querySelector('.price.ng-star-inserted');
              if (priceElement) {
                var priceText = priceElement.textContent.trim();
                var priceValue = parseFloat(priceText.substring(1).replace(",",""));
              } else {
                console.log('Элемент с ценой не найден');
              }
              var newElement = document.createElement('div');
              newElement.className = 'price_swap';
              newElement.innerText =
                'P:' +
                matchingItem.userPrice / 100 +
                '$ H:' +
                matchingItem.stockHave +
                ' M:' +
                matchingItem.stockMax +
                ' ' +
                (((matchingItem.userPrice / 100) - priceValue) / priceValue * 100).toFixed(2) +
                '%';
              if ((((matchingItem.userPrice / 100) - priceValue) / priceValue * 100) > 90) {
                newElement.style.color = 'green';
              } else {
                newElement.style.color = 'red';
              }
              newElement.style.fontWeight = '700';
              newElement.style.fontSize = '25px';
              itemGrid.appendChild(newElement);
            }
          }
        }
      }
  }});
}

var scrolling = false;

function handleScroll() {
  if (!scrolling) {
    scrolling = true;
    window.requestAnimationFrame(function() {
      setTimeout(function() {
        addTags();
        scrolling = false;
      }, 4000);
    });
  }
}

window.addEventListener('scroll', handleScroll);
fetchData();