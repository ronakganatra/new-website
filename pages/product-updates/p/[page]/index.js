import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  seoMetaTagsFields,
  imageFields,
} from 'lib/datocms';
import Link from 'next/link';
import FormattedDate from 'components/FormattedDate';
import { CHANGELOG_POSTS_PER_PAGE } from 'lib/pages';
import Paginator from 'components/Paginator';
import { useRouter } from 'next/router';
import Head from 'components/Head';
import { renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import PostContent from 'components/PostContent';
import pageStyle from 'pages/docs/pageStyle.module.css';
import { clean } from 'utils/stega';
import { vercelStegaSplit } from '@vercel/stega';

import { range } from 'range';

import s from './style.module.css';

function invisibleStega(string) {
  const { cleaned, encoded } = vercelStegaSplit(string);

  return (
    <span data-vercel-edit-target>
      {cleaned}
      <span style={{ display: 'none' }}>{encoded}</span>
    </span>
  );
}

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      meta: _allChangelogEntriesMeta {
        count
      }
    }
  `,
  'page',
  ({ meta }) =>
    range(
      1,
      Math.min(5, Math.ceil(meta.count / parseFloat(CHANGELOG_POSTS_PER_PAGE))),
    ),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query($first: IntType!, $skip: IntType!) {
      changelog {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      posts: allChangelogEntries(
        first: $first
        skip: $skip
        orderBy: _firstPublishedAt_DESC
      ) {
        title
        slug
        content {
          value
          blocks {
            ... on InternalVideoRecord {
              id
              _modelApiKey
              autoplay
              thumbTimeSeconds
              video {
                title
                width
                height
                video {
                  duration
                  streamingUrl
                  thumbnailUrl
                }
              }
            }
            ... on ImageRecord {
              id
              _modelApiKey
              image {
                format
                width
                title
                alt
                responsiveImage(imgixParams: { w: 950, fit: max }) {
                  ...imageFields
                }
                zoomableResponsiveImage: responsiveImage(imgixParams: { w: 1500, fit: max }) {
                  ...imageFields
                }
                url
              }
            }
          }
        }
        _firstPublishedAt
        categories {
          name
          color {
            hex
          }
        }
      }

      meta: _allChangelogEntriesMeta {
        count
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
  {
    requiredKeys: ['changelog', 'posts'],
    paramsToVars: ({ page }) => ({
      first: CHANGELOG_POSTS_PER_PAGE,
      skip: CHANGELOG_POSTS_PER_PAGE * parseInt(page),
    }),
  },
);

export default function Changelog({ preview, subscription }) {
  const router = useRouter();

  const {
    data: { posts, changelog, meta },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(changelog.seo)}</Head>

      <Hero
        title={
          <>
            <Highlight>Product Updates</Highlight>
          </>
        }
        subtitle={
          <>DatoCMS changelog for new features and general improvements</>
        }
      />
      <Wrapper>
        <div>
          {posts &&
            posts.map((post) => (
              <div key={post.slug} className={s.post}>
                <div className={s.categories}>
                  {post.categories.map((cat) => (
                    <span
                      key={cat.name}
                      className={clean(s.category)}
                      style={{ backgroundColor: cat.color.hex }}
                    >
                      {invisibleStega(cat.name)}
                    </span>
                  ))}
                </div>

                <h6 className={s.title}>
                  <Link key={post.slug} href={`/product-updates/${post.slug}`}>
                    <a>{post.title}</a>
                  </Link>
                </h6>

                <div className={s.info}>
                  <FormattedDate date={post._firstPublishedAt} />
                </div>

                <div className={s.body}>
                  <PostContent
                    content={post && post.content}
                    style={pageStyle}
                  />
                </div>
              </div>
            ))}
        </div>

        <Paginator
          perPage={CHANGELOG_POSTS_PER_PAGE}
          currentPage={router.query ? parseInt(router.query.page) : 0}
          totalEntries={meta.count}
          href={(index) =>
            index === 0 ? '/product-updates' : `/product-updates/p/${index}`
          }
        />
      </Wrapper>
    </Layout>
  );
}
