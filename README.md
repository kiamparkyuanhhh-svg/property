# 我的房产网站 (Property Listing Website)

一个纯静态网站(HTML + CSS + JS,没有后端,不需要 npm/Node),
可以直接用 GitHub Pages 免费上线。

## 文件说明
```
agent-site/
├── index.html      ← 网页结构(照片墙、搜索、简介、联系表单)
├── style.css        ← 样式
├── script.js         ← 房源数据 + 搜索/分类逻辑 + WhatsApp 聊天
├── images/           ← 放你的房产照片和个人照片
└── README.md
```

## 第一步:在 VS Code 里打开并修改内容

1. 打开 VS Code → File → Open Folder → 选择 `agent-site` 文件夹
2. 打开 `script.js`,找到最上面的 `PROPERTIES` 这个列表,
   把里面的房源信息改成你自己的(标题、地区、价格、类型等)
3. 把你的房产照片放进 `images` 文件夹,文件名要跟 `script.js` 里
   `image: "images/listing-1.jpg"` 对应(在图片还没放进去之前,
   网页会自动显示一个占位图,不会报错)
4. 打开 `index.html`,把 `[Your Name]`、`REN 00000`、
   电话、邮箱这些换成你自己的资料(搜索 `edit-me` 这几处最容易找)
5. 打开 `script.js` 最上面的 `WHATSAPP_NUMBER`,
   改成你自己的号码(格式:国家代码+号码,不要加 + 号或空格,
   例如马来西亚号码 0123456789 → 写成 `"60123456789"`)
6. 想直接预览效果:在 VS Code 装 **Live Server** 这个扩展,
   在 `index.html` 上右键 → "Open with Live Server"

## 第二步:上传到 GitHub

1. 在 GitHub 网站上新建一个 repository,例如叫 `my-property-site`
   (public,不要勾选 "Add a README",因为我们已经有了)
2. 在 VS Code 里打开终端(Terminal → New Terminal),依次输入:
   ```bash
   git init
   git add .
   git commit -m "first version of my property site"
   git branch -M main
   git remote add origin https://github.com/你的用户名/my-property-site.git
   git push -u origin main
   ```
3. 之后每次修改完文件,只要重复:
   ```bash
   git add .
   git commit -m "update listings"
   git push
   ```

## 第三步:用 GitHub Pages 免费上线

1. 打开你的 GitHub repository → 点 **Settings**
2. 左边菜单点 **Pages**
3. 在 "Branch" 选 `main`,文件夹选 `/root`,点 **Save**
4. 等 1–2 分钟,页面会给你一个网址,大概长这样:
   `https://你的用户名.github.io/my-property-site/`
   这个就是你可以直接分享给客户的网站链接

## 关于 "Chat with Me" 功能

因为这是纯静态网站(没有服务器/数据库),没办法做像 Messenger
那种实时在线聊天。这里用的方法是:客户填表单后,
会直接打开 **WhatsApp**,并且自动带上他填的内容,
你在手机上就能直接看到并回复 —— 这也是马来西亚大部分
地产经纪最常用、客户最熟悉的沟通方式。

如果之后想要更进阶的功能(比如客户留言存进数据库、
后台管理房源不用改代码、真正的网页内嵌聊天窗口等),
这些都需要加一个后端/数据库,可以再跟我说,我帮你规划下一步。

## 想调整设计?
- 想换颜色:打开 `style.css` 最上面的 `:root { ... }`,
  改里面的色码(`--ink`、`--gold` 等)
- 想加新的房源分类(比如加 "Shop" 店铺):
  在 `index.html` 里 `categoryChips` 那一段加一个新的
  `<button class="chip" data-category="Shop">Shop</button>`,
  然后在 `script.js` 的房源数据里也用 `category: "Shop"`
