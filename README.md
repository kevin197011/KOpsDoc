# 运维规范文档

本项目使用 [Jekyll](https://jekyllrb.com/) 生成 GitHub Pages 网站，自动化展示 docs/ 目录下的 Markdown 运维规范文档。

## 本地预览

```bash
bundle install
bundle exec jekyll serve
```

访问 http://localhost:4000 查看网站。

## 目录结构
- `docs/`：所有运维规范 Markdown 文档，自动集成到网站内容中。
- `_posts/`：Jekyll 默认博客文章目录（可选）。
- `_config.yml`：Jekyll 配置文件。

## 发布到 GitHub Pages
1. 推送代码到 GitHub。
2. 在仓库设置中启用 GitHub Pages，选择 `main` 分支和根目录。
3. 访问生成的网址。
