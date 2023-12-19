
## To set an open graph image:
- Add a file 'opengraph-image.png' to the same location where page.mdx can be found

## TO set a page title and description
export const metadata = {
  title: ...,
  description: ...,
  author: ...,
}

## To push changes to Prisma client to DB
npx prisma migrate dev --name <name of migration>