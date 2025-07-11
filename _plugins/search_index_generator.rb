# frozen_string_literal: true

require 'json'
require 'fileutils'

module Jekyll
  class SearchIndexFile < StaticFile
    def write(dest)
      # Always copy the file
      super(dest)
      true
    end
  end

  class SearchIndexGenerator < Generator
    priority :lowest
    def generate(site)
      puts '[search_index_generator] Generating search-index.json (static file mode)...'
      docs = site.pages.select { |p| p.path.start_with?('docs/') && p.data['layout'] == 'doc' }
      index = docs.map do |page|
        {
          'title' => page.data['title'] || page.basename_without_ext,
          'url' => page.url,
          'content' => page.content.gsub(/<[^>]*>/, '').gsub(/\s+/, ' ')
        }
      end
      # Write to a temp file in .jekyll-cache
      cache_dir = File.join(site.source, '.jekyll-cache')
      FileUtils.mkdir_p(cache_dir)
      temp_path = File.join(cache_dir, 'search-index.json')
      File.open(temp_path, 'w') { |f| f.write({ docs: index }.to_json) }
      # Register as a static file for output
      site.static_files << SearchIndexFile.new(site, cache_dir, '/assets/json', 'search-index.json')
      puts "[search_index_generator] search-index.json registered as static file, docs count: #{index.size}"
    end
  end
end
