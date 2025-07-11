// Lunr.js search integration for docs
(function() {
  var searchInput = document.getElementById('doc-search');
  var resultsBox = document.getElementById('search-results');
  var idx = null;
  var docs = [];
  // 只用全局 BASEURL 变量，由模板注入

  function renderResults(results) {
    if (!results.length) {
      resultsBox.innerHTML = '<ul><li>无匹配结果</li></ul>';
      resultsBox.style.display = 'block';
      return;
    }
    var html = '<ul>' + results.map(function(r) {
      var d = docs[r.ref];
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

  function init() {
    fetch(BASEURL + '/assets/json/search-index.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        docs = data.docs;
        idx = lunr(function () {
          this.ref('id');
          this.field('title', { boost: 10 });
          this.field('content');
          var that = this;
          docs.forEach(function (doc, i) {
            doc.id = i;
            that.add(doc);
          });
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
    init();
  }
})();