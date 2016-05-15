#A Simple CMS

Please, don't use this in production. Yet.

This project was born by the necessity of an internationalized Node.js CMS that was also easy for the final user (maybe you, or your clients?) to achieve great results in SEO.

It's easy to extend (you won't find yourself changing node-modules-files just to change a layout), easy to maintain, among other features that are still being developed.

##TODO

- Comment system
- Disqus integration
- Auto generate and update sitemap.xml
- Auto generate and update robots.txt
- Schema validation
- Admin front end validation
- Update active theme on change
- Open Graph and Twitter cards meta
- Social buttons
- Bing and Goole webmaster links
- Schema.org
- General site settings
- Auto generate sitemap
- Favicon
- Robots.txt
- Protect slugs
- Limite file uploads to images
- Tags page
- Google analytics

##Project structure

```
cms/
├── admin/
│   ├── app/
|   |   ├── config/
|   |   |   └── i18n/
│   |   ├── controllers/
|   |   ├── models/
│   |   ├── routes/
│   |   └── views/
|   |   |   ├── articles/
|   │   |   ├── layouts/
|   |   |   ├── partials/
|   │   |   ├── settings/
|   │   |   └── users/
│   ├── public/
│   |   ├── components/
│   |   ├── css/
│   |   ├── js/
│   |   └── plugins/
├── content/
|   ├── config/
|   ├── controllers/
|   ├── models/
|   ├── routes/
|   └── themes/
└── uploads/
```