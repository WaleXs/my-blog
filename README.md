# 拾光 · 零依赖静态博客

一个能直接上线的个人博客：**纯 HTML + CSS + 一点原生 JS**，没有构建步骤、没有 npm 依赖。
改完文件传上去就是发布。

```
my-blog/
├── index.html              首页：个人简介 + 文章列表（你主要改这里）
├── about.html              关于页
├── 404.html                找不到页面时显示
├── robots.txt              给搜索引擎看的
├── posts/
│   ├── adding-images.html  示例文章：图片排版指南（含四种排版示范）
│   ├── hello-world.html    示例文章 1（随笔）
│   ├── static-blog.html    示例文章 2（技术，含目录结构/代码块排版示例）
│   └── reading-2026.html   示例文章 3（读书笔记）
└── assets/
    ├── style.css           全站样式，配色集中在文件顶部的 CSS 变量
    ├── app.js              深浅色切换 + 阅读进度条 + 图片点击放大
    ├── favicon.svg         浏览器标签页图标
    └── images/             所有插图都放这里
        └── example-*.jpg   5 张生成的示例图，可以删掉换成你自己的
```

---

## 一、先在本地看看

**最简单**：直接双击 `index.html`，用浏览器打开就能看。

**更接近线上**（推荐，能验证相对路径和字体加载）：

```powershell
cd my-blog
python -m http.server 8000
# 然后浏览器打开 http://localhost:8000
```

有 Node 环境的话 `npx serve` 效果一样。

---

## 二、把占位内容换成你自己的

全站只有 5 个地方需要改，都已经用 `✏️` 注释标出来了：

| 想改什么 | 打开哪个文件 | 找什么 |
| --- | --- | --- |
| 站名（左上角「拾光」） | 每个 HTML 文件的 `<a class="brand">` | 出现 5 处，全部替换 |
| 你的名字、一句话介绍 | `index.html` | 搜索「阿舟」「在这里记录」 |
| 邮箱、GitHub 等链接 | `index.html` 的 `<ul class="hero-links">` | `mailto:you@example.com` |
| 关于页的自我介绍 | `about.html` | 「✏️ 这一整页都是占位内容」那条注释下方 |
| 全站配色 | `assets/style.css` | 文件最顶部的 `:root { ... }` |
| 标签页标题、分享描述 | 各 HTML 的 `<title>` 和 `<meta name="description">` | — |

**换配色**只要改这几行，其他样式会自动跟着变：

```css
:root {
  --bg: #fbf9f5;      /* 背景 */
  --text: #1d1b18;    /* 正文 */
  --accent: #b0532c;  /* 主色（链接、标签、进度条） */
}
```

---

## 三、新增一篇文章

1. 复制 `posts/hello-world.html`，重命名成 `posts/你的文章名.html`（建议全小写、用连字符，别用中文和空格，比如 `my-first-trip.html`）。
2. 改里面的三处：`<title>`、`<h1>`、日期那一段 `<time datetime="2026-10-21">`（`datetime` 写标准格式，显示文字随手写）。
3. 把 `<div class="prose">` 里面的内容换成你的正文。往下的常用标签：

```html
<h2>二级标题</h2>
<h3>三级标题</h3>
<p>段落。</p>
<blockquote><p>引用的一段话。</p></blockquote>
<ul><li>无序列表</li></ul>
<ol><li>有序列表</li></ol>
<p><strong>加粗</strong>、<em>斜体</em>、<code>行内代码</code>、
   <a href="https://example.com">链接</a></p>
<pre><code>代码块</code></pre>
<hr />
<img src="../assets/图片.jpg" alt="图片说明" />
```

4. 回到 `index.html`，在 `<ul class="post-list">` 里**复制一整个 `<li class="post-item">`**，把日期、标题、摘要、标签、链接改掉。列表按时间倒序排，新文章放最上面。

> 一百篇以内这样手动维护完全够用。真到了量大的时候，再考虑引入 Hugo/Astro 这类静态站点生成器，届时这套 CSS 可以原样搬过去。

---

## 四、在文章里插图

图片统一放 `assets/images/`，正文里用**相对路径**引用：文章在 `posts/` 里，所以路径是 `../assets/images/你的图.jpg`。

完整的可运行示范见 [posts/adding-images.html](posts/adding-images.html)，下面是四种排版的代码。

### 1. 普通单图（跟正文同宽）

```html
<figure>
  <img src="../assets/images/我的图.jpg" width="1200" height="800" alt="一句话描述图片内容" />
  <figcaption>图注，可以省略</figcaption>
</figure>
```

### 2. 通栏大图（宽屏上突破正文宽度，手机上仍是满宽）

```html
<figure class="wide">
  <img src="../assets/images/风景.jpg" width="1600" height="900" alt="……" />
  <figcaption>通栏大图</figcaption>
</figure>
```

### 3. 并排组图（自动折行，图片裁成正方形）

```html
<figure class="gallery">
  <img src="../assets/images/a.jpg" width="900" height="900" alt="……" />
  <img src="../assets/images/b.jpg" width="900" height="900" alt="……" />
  <figcaption>左：…… 右：……</figcaption>
</figure>
```

### 4. 文章封面（放在 `<header>` 之后、`<div class="prose">` 之前，按 16:7 裁切）

```html
<figure class="cover">
  <img src="../assets/images/封面.jpg" width="1600" height="700" alt="……" />
</figure>
```

### 点击放大

**正文图片和封面图默认都能点开放大**，不必写任何额外代码：点图片 → 看大图，按 `Esc` 或点背景关闭。想「列表里放小图、点开看原图」，在 `<img>` 上加 `data-full` 指向大图即可：

```html
<img src="../assets/images/小图.jpg" data-full="../assets/images/原图.jpg" width="800" height="600" alt="……" />
```

### 上传前的四件事

1. **文件名用英文小写加连字符**，如 `2026-sunset-lake.jpg`。中文名和空格在部分服务器上会 404。
2. **先压缩再上传**：宽度 1600px、单张 300KB 以内足够。用 [Squoosh](https://squoosh.app) 或 [TinyPNG](https://tinypng.com) 拖一下就行。
3. **`alt` 必写**：图片挂了时的替代文字，也是读屏软件唯一能读到的内容。
4. **`width` / `height` 填真实像素**：浏览器据此提前留出高度，图片加载时页面不会跳。

> `assets/images/` 里的 5 张 `example-*.jpg` 是我用代码生成的示意图，可以直接删掉换成你的照片。

---

## 五、发布到公网（三选一）

### 方案 A：Cloudflare Pages（推荐，免费、免备案、自动 HTTPS）

1. 注册 [GitHub](https://github.com) 账号，新建一个仓库（Public 或 Private 都行，名字比如 `my-blog`）。
2. 把 `my-blog` 文件夹里的**所有文件**传上去（网页上点 `Add file → Upload files` 拖进去即可，不用会 git 命令）。
3. 注册 [Cloudflare](https://dash.cloudflare.com/sign-up)（免费），进入 **Workers & Pages → Create → Pages → Connect to Git**，选刚才的仓库。
4. 构建设置里：
   - **Framework preset**：`None`
   - **Build command**：**留空**
   - **Build output directory**：`/`
5. 点 **Save and Deploy**。约一分钟，你会拿到一个网址：

```
https://my-blog-xxx.pages.dev
```

**这个网址已经是全网可访问的正式网站了**，自带全球 CDN 和 HTTPS 证书。以后每次在 GitHub 上改文件，它会自动重新部署。

### 方案 B：GitHub Pages（同样免费，不用第二个账号）

1. 仓库 Settings → Pages → Source 选 `Deploy from a branch`，分支 `main`、目录 `/ (root)`，保存。
2. 一两分钟后访问 `https://你的用户名.github.io/仓库名/`。

> ⚠️ 用这种方式，网址会带一层 `/仓库名/` 子路径。`404.html` 里用的是 `/assets/` 这种绝对路径，子路径下会失效；把 `404.html` 里的 `/assets/` 改成 `assets/` 即可。其余页面本来就是相对路径，不受影响。

### 方案 C：自己的服务器（要完全掌控时）

买一台 VPS（腾讯云/阿里云轻量、Vultr 等），装 Caddy，把文件丢进网站目录：

```bash
# Caddyfile，两行搞定自动 HTTPS
your-domain.com {
    root * /var/www/my-blog
    file_server
}
```

然后域名解析一条 A 记录指向服务器 IP，开放 80/443 端口即可。

> ⚠️ **如果服务器在中国大陆，必须先做 ICP 备案**（免费，需身份证 + 域名实名，约 1–3 周）。用方案 A/B 这类境外托管则无需备案。

---

## 六、绑定自己的域名（可选，但强烈建议）

域名的意义在于：`xxx.pages.dev` 是平台的，`yourname.com` 是你自己的，换托管商也不用换网址。

1. **买域名**：Namecheap、Cloudflare Registrar、阿里云、腾讯云都可以。`.com` 约 60–80 元/年，`.top`/`.xyz` 十几元/年。
2. **托管 DNS**：把域名的 NS 服务器改成 Cloudflare 免费提供的两条（在 Cloudflare 里 `Add a site` 会告诉你）。
3. **绑定**：回到 Cloudflare Pages 项目 → **Custom domains → Set up a custom domain**，输入 `yourname.com`，按提示点确认。
4. 等几分钟 DNS 生效，HTTPS 证书自动签发，搞定。

域名和托管是两件独立的事：域名是门牌号，托管是房子，可以分开选。

---

## 七、常见问题

**Q：写完放上去，别人打不开？**
先确认文件名大小写完全一致。静态托管区分大小写：`Posts/Hello.html` 和 `posts/hello.html` 是两个东西，本地 Windows 不报错，传上去就 404。

**Q：图片本地能看到，传上去是裂的？**
九成是两个原因：① `assets/images/` 没跟着一起传（很多人只传了 HTML）；② 路径层级不对——`posts/` 里的文章要用 `../assets/images/x.jpg`，根目录的页面才用 `assets/images/x.jpg`。另外文件名的大小写也要和引用完全一致。

**Q：想让搜索引擎收录？**
部署后去 [Google Search Console](https://search.google.com/search-console) 和[必应站长平台](https://www.bing.com/webmasters)提交网址。想更规范可以再加一个 `sitemap.xml`，然后在 `robots.txt` 里取消那行注释。

**Q：想要评论、访问统计？**
评论可以用 [Giscus](https://giscus.app)（基于 GitHub Discussions，免费，贴一段 script 就行）；统计用 [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)（免费、无 cookie、不拖慢页面）。

**Q：以后想换成带后台的博客（WordPress / Hexo / Astro）？**
可以。这套站点的价值是「先上线」。等真有内容要管理时再迁移，文章内容是纯文本，搬起来不难。

**Q：深色模式怎么实现的？**
`assets/app.js` 里点按钮会写 `localStorage`；没点过就跟随系统 `prefers-color-scheme`。读取主题的那段内联脚本放在 `<link rel="stylesheet">` **之前**，所以深色模式下不会闪白屏。

---

内容与配色都是占位的，随便改成你自己的。写完第一篇，就算开始了。
