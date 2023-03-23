const fs = require('fs');
const path = require('path');

const urls = [
  { url: '/', changefreq: 'weekly', priority: 1 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  // Add more URLs as needed
];

const jsonData = fs.readFileSync(path.join(process.cwd(), 'public/data/categories.json'), 'utf-8')
const categories = JSON.parse(jsonData)
categories.forEach(category => {
  urls.push({url: `/${category.slug}`, changefreq: 'monthly', priority: 0.5})
  category.courses.forEach(course => {
    urls.push({url: `/${category.slug}/${course.slug}`, changefreq: 'monthly', priority: 0.4})
    course.lessons.forEach(lesson => {
      urls.push({url: `/${category.slug}/${course.slug}/${lesson.slug}`, changefreq: 'monthly', priority: 0.3, redirect: `/${category.slug}/${lesson.slug}`})
    })
  })
})

// categories.forEach(category => {
//   urls.push({url: `/${category.slug}`, changefreq: 'monthly', priority: 0.5})
//   category.courses.forEach(course => {
//     urls.push({url: `/${category.slug}/${course.slug}`, changefreq: 'monthly', priority: 0.4})
//     course.lessons.forEach(lesson => {
//       urls.push({url: `/${category.slug}/${course.slug}/${lesson.slug}`, changefreq: 'monthly', priority: 0.3})
//     })
//   })
// })


let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

`
// pages
urls.forEach(url => {
  const link = `https://www.homapilot.com${url.redirect || url.url}`
  xmlContent += `<url>\n`
  xmlContent += `<loc>${link}</loc>\n`
  xmlContent += url.redirect ? `<xhtml:link rel="canonical" href="https://www.homapilot.com${url.url}" />\n` : ''
  xmlContent += `</url>\n`
})

xmlContent += `</urlset>`
fs.writeFileSync('./public/sitemap.xml', xmlContent)