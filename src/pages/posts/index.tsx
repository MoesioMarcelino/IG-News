import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};
interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | IgNews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.post}>
          {posts.map(({ slug, updatedAt, title, excerpt }) => (
            <Link href={`posts/${slug}`}>
              <a key={slug}>
                <time>{updatedAt}</time>
                <strong>{title}</strong>
                <p>{excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 15,
    }
  );

  const posts = response.results.map(
    ({ uid, data, last_publication_date }) => ({
      slug: uid,
      title: RichText.asText(data.title),
      excerpt:
        data.content.find((content) => content.type === 'paragraph')?.text ??
        '',
      updatedAt: new Date(last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    })
  );

  return {
    props: { posts },
  };
};
