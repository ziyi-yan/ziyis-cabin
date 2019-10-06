import path from 'path'
import { CreatePagesArgs, CreateWebpackConfigArgs } from 'gatsby'

import { createAbout } from './create-about'
import { createIndexPages } from './create-index'
import { createPost } from './create-post'
import { createTagPages } from './create-tag'
import { generate } from './path'

export const createPages = async ({ actions, graphql }: CreatePagesArgs) => {
  const { createPage } = actions

  createPage({
    path: '/404',
    component: path.resolve('src/404/404.tsx'),
    context: null
  })

  const { errors, data } = await graphql<QueryRes>(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
        edges {
          node {
            excerpt(format: HTML)
            html
            id
            fileAbsolutePath
            frontmatter {
              date
              tags
              title
            }
          }
        }
      }
    }
  `)
  if (errors) {
    return Promise.reject(errors)
  }

  const mds = data!.allMarkdownRemark.edges.map(({ node }) => {
    node.path = generate(node.frontmatter.title, new Date(node.frontmatter.date))
    return node
  })

  const postPath = `${process.cwd()}/blog/posts`

  const posts: Post[] = []
  const pages: Record<string, Post> = {}

  for (const md of mds) {
    if (md.fileAbsolutePath.startsWith(postPath)) {
      posts.push(md)
    } else {
      const name = md.fileAbsolutePath.split('\\').pop()!.split('/').pop()!.split('.').shift()!
      pages[name] = md
    }
  }

  createAbout(createPage, pages)
  createTagPages(createPage, posts)
  createIndexPages(createPage, posts)
  createPost(createPage, posts)
  createPage({
    path: '/archive',
    component: path.resolve('src/archive.tsx'),
    context: { posts }
  })

  // Create pages for each markdown file.

  return posts
}

export const onCreateWebpackConfig = ({ plugins, actions }: CreateWebpackConfigArgs) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        'process.env': { __IS_WEBPACK__: JSON.stringify(true) }
      })
    ]
  })
}
