// Lunr.js 全站搜索（自动适配导航清单）
(function() {
  // 由 Jekyll 模板注入的导航清单（自动生成）
  var PAGE_LIST = [];
  if (window.DOCS_NAV_LIST) {
    PAGE_LIST = window.DOCS_NAV_LIST;
  } else {
    // 兜底：手动维护
    PAGE_LIST = [
      // '/1.1-基础设施命名规范.html', ...
    ];
  }
  var searchInput = document.getElementById('doc-search');
  var resultsBox = document.getElementById('search-results');
  var idx = null;
  var docs = [];
  function renderResults(results) {
    if (!results.length) {
      resultsBox.innerHTML = '<ul><li>无匹配结果</li></ul>';
      resultsBox.style.display = 'block';
      return;
    }
    var html = '<ul>' + results.map(function(r) {
      var d = docs.find(doc => doc.url === r.ref);
      return '<li><a href="' + d.url + '">' + d.title + '</a></li>';
    }).join('') + '</ul>';
    resultsBox.innerHTML = html;
    resultsBox.style.display = 'block';
  }
  function hideResults() {
    resultsBox.style.display = 'none';
  }
  function doSearch(q) {
    if (!idx || !q) {
      hideResults();
      return;
    }
    var results = idx.search(q);
    renderResults(results);
  }
  function fetchAndIndexAllPages() {
    var baseurl = window.BASEURL || '';
    Promise.all(PAGE_LIST.map(function(name) {
      var url = baseurl + '/' + encodeURIComponent(name) + '.html';
      return fetch(url)
        .then(function(res) { return res.text(); })
        .then(function(html) {
          var title = html.match(/<h1.*?>(.*?)<\/h1>/)?.[1] || name;
          var content = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
          return { title: title, url: url, content: content };
        })
        .catch(function() { return null; });
    })).then(function(results) {
      docs = results.filter(Boolean);
      idx = lunr(function () {
        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('content');
        docs.forEach(doc => this.add(doc));
      });
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      var q = e.target.value.trim();
      if (q.length > 0) {
        doSearch(q);
      } else {
        hideResults();
      }
    });
    document.addEventListener('click', function(e) {
      if (!resultsBox.contains(e.target) && e.target !== searchInput) {
        hideResults();
      }
    });
    fetchAndIndexAllPages();
  }
})();