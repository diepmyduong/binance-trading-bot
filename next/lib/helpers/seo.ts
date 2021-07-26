export default async function SEO(
  title: string,
  data: { description?: string; image?: string; keyword?: string; shopName?: string } = {}
) {
  return {
    titleTemplate: `%s | ${data.shopName}`,
    defaultTitle: `${data.shopName}`,
    title,
    description: data.description,
    image: data.image,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      site_name: "3mShop",
      title,
      description: data.description,
      images: [
        {
          url: data.image,
          alt: data.shopName,
        },
      ],
    },
    additionalMetaTags: [
      {
        property: "keywords",
        content: data.keyword,
      },
    ],
  };
}
