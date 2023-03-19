// import Head from "next/head";
// import Layout, { siteTitle } from "../components/layout";
// import Image from "next/image";
// import { client } from "../lib/apollo";
// import { gql } from "@apollo/client";
// import { useEffect, useRef, useState } from "react";
// import MusicModule from "../components/MusicModule/MusicModule";

// // siteTitle

// // https://developers.wpengine.com/blog/crash-course-build-a-simple-headless-wordpress-app-with-next-js-wpgraphql

// export async function getStaticProps() {
//   // Paste your GraphQL query inside of a gql tagged template literal
//   const GET_POSTS = gql`
//     query AllPostsQuery {
//       posts(first: 40) {
//         nodes {
//           title
//           content
//           date
//           uri
//           featuredImage {
//             node {
//               mediaItemUrl
//               srcSet
//             }
//           }
//         }
//       }
//     }
//   `;
//   // Here we make a call with the client and pass in our query string to the
//   // configuration objects 'query' property
//   const response = await client.query({
//     query: GET_POSTS,
//   });
//   // Once we get the response back, we need to traverse it to pull out the
//   // data we want to pass into the HomePage
//   const posts = response?.data?.posts?.nodes;

//   return {
//     props: {
//       posts,
//     },
//   };
// }

// export default function Home({ posts }) {
//   console.table(posts);
//   return (
//     <Layout home>
//       <Head>
//         <title>{siteTitle}</title>
//       </Head>
//       <div className="hero-home">
//         <h1>DJ Mixes</h1>
//         {posts &&
//           posts.map((post, index) => {
//             const { title, featuredImage } = post;

//             if (index < 5) {
//               return (
//                 <div key={index}>
//                   <Image
//                     srcSet={featuredImage.node.srcSet}
//                     width={200}
//                     height={200}
//                     alt={title}
//                   />
//                   {title}
//                 </div>
//               );
//             }
//           })}
//       </div>
//     </Layout>
//   );
// }

// // Get the first 20 posts from WordPress, ordered by the date
// export async function getAllPostsFromWordPress(preview) {
//   const data = await fetchAPI(`
//     query AllPosts {
//       posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
//         edges {
//           node {
//             title
//             excerpt
//             slug
//             date
//           }
//         }
//       }
//     }
//   `);

//   return data.posts;
// }
