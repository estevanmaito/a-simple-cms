#a simple cms

Please, don't use this in production. Yet.

##TODO

- Comment system
- Auto generate and update sitemap.xml
- Auto generate and update robots.txt

#Project structure

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
|   └── views/
|   │   ├── layouts/
|   │   └── partials/
└── uploads/
```