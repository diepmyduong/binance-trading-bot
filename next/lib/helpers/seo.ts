export default async function SEO(
  title: string,
  data: { description?: string; image?: string; keyword?: string; shopName?: string } = {}
) {
  return {
    title,
    description: data.description,
    image: data.image,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      site_name: "3mShop",
      images: [
        {
          url: data.image,
        },
      ],
    },
    additionalMetaTags: [
      {
        property: "keywords",
        content: data.keyword,
      },
    ],
    titleTemplate: `%s | ${data.shopName}`,
    defaultTitle: `${data.shopName}`,
  };
}
