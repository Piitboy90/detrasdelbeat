const APP_NAME = "BeatStory";
const DEFAULT_DESCRIPTION = "Comparte tu música y descubre las historias detrás de cada canción. Una comunidad para músicos y amantes de la música.";

export const getPageTitle = (pageName) => {
  return pageName ? `${pageName} | ${APP_NAME}` : `${APP_NAME} - Música Original y Historias Reales`;
};

export const getMetaDescription = (description) => {
  return description || DEFAULT_DESCRIPTION;
};

export const getOpenGraphTags = (post) => {
  if (!post) {
    return [
      { property: "og:title", content: `${APP_NAME} - Música Original y Historias Reales` },
      { property: "og:description", content: DEFAULT_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: window.location.href },
      { property: "og:image", content: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200" }, // Default generic music image
      { name: "twitter:card", content: "summary_large_image" },
    ];
  }

  const title = post.title || "Historia sin título";
  const description = post.story ? post.story.substring(0, 150) + "..." : DEFAULT_DESCRIPTION;
  const url = window.location.href;
  const image = post.profiles?.avatar_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200";

  return [
    { property: "og:title", content: `${title} | ${APP_NAME}` },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
};