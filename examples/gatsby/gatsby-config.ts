import type { GatsbyConfig } from 'gatsby';
import 'varlock/auto-load';

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Varlock Gatsby Example',
    siteUrl: 'https://www.yourdomain.tld',
  },
  graphqlTypegen: true,
};

export default config;
