// hooks/useContentfulData.ts
import { useState, useEffect } from 'react';
import { createClient, EntryCollection, EntrySkeletonType } from 'contentful';
import { ContentItem } from '@/types/PortfolioContentFulTypes';

// Helper function to format URLs
const formatContentfulUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove any existing protocol
  const cleanUrl = url.replace(/^(https?:)?\/\//, '');
  
  // Add https protocol
  return `https://${cleanUrl}`;
};

interface PortfolioData {
  gallery: ContentItem[];
  initialPortfolio: {
    heroImage: ContentItem | null;
    backgroundVideo: ContentItem | null;
    services: {
      artistic: ContentItem[];
      social: ContentItem[];
      bodypaint: ContentItem[];
      editorial: ContentItem[];
    };
  };
  serviceCategories: {
    id: string;
    title: string;
    description: string;
    thumbnail: ContentItem | null;
  }[];
}

interface AssetFields {
  title?: string;
  description?: string;
  file?: {
    url: string;
    contentType: string;
    details: {
      size: number;
      duration?: number;
    };
  };
}

interface PortfolioFields {
  title?: string;
  technic?: string;
  images?: ContentfulAsset[];
  videos?: ContentfulAsset[];
}

interface ContentfulSpace {
  sys: {
    type: "Link";
    linkType: "Space";
    id: string;
  };
}

interface ContentfulEnvironment {
  sys: {
    type: "Link";
    linkType: "Environment";
    id: string;
  };
}

interface ContentfulContentType {
  sys: {
    type: "Link";
    linkType: "ContentType";
    id: string;
  };
}

interface ContentfulEntry extends EntrySkeletonType<PortfolioFields> {
  sys: {
    id: string;
    type: "Entry";
    createdAt: string;
    updatedAt: string;
    locale: string;
    space: ContentfulSpace;
    environment: ContentfulEnvironment;
    revision: number;
    contentType: ContentfulContentType;
  };
  metadata?: {
    tags: Array<{
      sys: {
        type: "Link";
        linkType: "Tag";
        id: string;
      };
    }>;
  };
}

interface ContentfulAsset extends EntrySkeletonType<AssetFields> {
  sys: {
    id: string;
    type: "Asset";
    createdAt: string;
    updatedAt: string;
    locale: string;
    space: ContentfulSpace;
    environment: ContentfulEnvironment;
    revision: number;
  };
  fields: AssetFields;
  metadata?: {
    tags: Array<{
      sys: {
        type: "Link";
        linkType: "Tag";
        id: string;
      };
    }>;
  };
}

const useContentfulData = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const initialPortfolioData: PortfolioData = {
      gallery: [],
      initialPortfolio: {
        heroImage: null,
        backgroundVideo: null,
        services: {
          artistic: [],
          social: [],
          bodypaint: [],
          editorial: []
        }
      },
      serviceCategories: []
    };
    return initialPortfolioData;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 'tq4ckeil24qo',
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || 'JgarPmDAluyFhx7O2dRCpSBXH2hUrda-X_Da1N-S8KY',
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
    });

    const fetchData = async () => {
      try {
        const entries: EntryCollection<ContentfulEntry> = await client.getEntries({
          content_type: 'portfolio',
          include: 2,
        });

        if (!entries.items.length) {
          throw new Error('No entries returned from Contentful');
        }

        console.log('All entries:', entries.items.map(e => ({ id: e.sys.id, title: e.fields.title })));

        // Filter out the initial portfolio entry
        const galleryEntries = entries.items.filter(entry => entry.sys.id !== '6quQLXK8Se7CxKz9JLJde5');
        const initialPortfolioEntry = entries.items.find(entry => entry.sys.id === '6quQLXK8Se7CxKz9JLJde5');

        console.log('Initial portfolio entry found:', initialPortfolioEntry ? 'Yes' : 'No');
        if (initialPortfolioEntry) {
          const images = (initialPortfolioEntry.fields.images || []) as ContentfulAsset[];
          const videos = (initialPortfolioEntry.fields.videos || []) as ContentfulAsset[];
          console.log('Initial portfolio entry images:', images.map(img => img.sys.id));
          console.log('Initial portfolio entry videos:', videos.map(vid => vid.sys.id));
        }

        // Transform gallery entries
        const galleryData: ContentItem[] = galleryEntries.flatMap(entry => {
          const items: ContentItem[] = [];
          
          // Add images
          if (entry.fields.images && Array.isArray(entry.fields.images) && entry.fields.images.length > 0) {
            items.push(...(entry.fields.images as ContentfulAsset[]).map(img => {
              const title = typeof img.fields.title === 'string' ? img.fields.title : '';
              const description = typeof img.fields.description === 'string' ? img.fields.description : '';
              const fileUrl = typeof img.fields.file?.url === 'string' 
                ? formatContentfulUrl(img.fields.file.url)
                : '';
              const contentType = typeof img.fields.file?.contentType === 'string' ? img.fields.file.contentType : '';
              const details = img.fields.file?.details;
              const size = typeof details?.size === 'number' ? details.size : 0;
              const duration = typeof details?.duration === 'number' ? details.duration : undefined;

              return {
                category: (entry.fields.title || '') as string,
                type: 'image' as const,
                metadata: {
                  tags: img.metadata?.tags?.map((tag: { sys: { id: string } }) => ({
                    sys: {
                      type: "Link" as const,
                      linkType: "Tag" as const,
                      id: tag.sys.id
                    }
                  })) || []
                },
                sys: {
                  ...img.sys,
                  type: "Asset" as const,
                  locale: img.sys.locale || 'en-US',
                  space: {
                    sys: {
                      type: "Link" as const,
                      linkType: "Space" as const,
                      id: img.sys.space.sys.id
                    }
                  },
                  environment: {
                    sys: {
                      type: "Link" as const,
                      linkType: "Environment" as const,
                      id: img.sys.environment.sys.id
                    }
                  }
                },
                fields: {
                  title,
                  description,
                  technic: typeof (entry.fields as { technic?: string }).technic === 'string' ? (entry.fields as { technic?: string }).technic : undefined,
                  file: {
                    url: fileUrl,
                    contentType,
                    details: {
                      size,
                      duration
                    }
                  }
                }
              };
            }));
          }
          
          // Add videos
          if (entry.fields.videos && Array.isArray(entry.fields.videos) && entry.fields.videos.length > 0) {
            items.push(...entry.fields.videos.map(vid => {
              const title = typeof vid.fields.title === 'string' ? vid.fields.title : '';
              const description = typeof vid.fields.description === 'string' ? vid.fields.description : '';
              const fileUrl = typeof vid.fields.file?.url === 'string' 
                ? formatContentfulUrl(vid.fields.file.url)
                : '';
              const contentType = typeof vid.fields.file?.contentType === 'string' ? vid.fields.file.contentType : '';
              const details = vid.fields.file?.details;
              const size = typeof details?.size === 'number' ? details.size : 0;
              const duration = typeof details?.duration === 'number' ? details.duration : undefined;

              return {
                category: (entry.fields.title || '') as string,
                type: 'video' as const,
                metadata: {
                  tags: vid.metadata?.tags?.map((tag: { sys: { id: string } }) => ({
                    sys: {
                      type: "Link" as const,
                      linkType: "Tag" as const,
                      id: tag.sys.id
                    }
                  })) || []
                },
                sys: {
                  ...vid.sys,
                  type: "Asset" as const,
                  locale: vid.sys.locale || 'en-US',
                  space: {
                    sys: {
                      type: "Link" as const,
                      linkType: "Space" as const,
                      id: vid.sys.space.sys.id
                    }
                  },
                  environment: {
                    sys: {
                      type: "Link" as const,
                      linkType: "Environment" as const,
                      id: vid.sys.environment.sys.id
                    }
                  }
                },
                fields: {
                  title,
                  description,
                  technic: typeof (entry.fields as { technic?: string }).technic === 'string' ? (entry.fields as { technic?: string }).technic : undefined,
                  file: {
                    url: fileUrl,
                    contentType,
                    details: {
                      size,
                      duration
                    }
                  }
                }
              };
            }));
          }
          
          return items;
        });

        // Transform initial portfolio entry
        const initialPortfolioData = {
          heroImage: null as ContentItem | null,
          backgroundVideo: null as ContentItem | null,
          services: {
            artistic: [] as ContentItem[],
            social: [] as ContentItem[],
            bodypaint: [] as ContentItem[],
            editorial: [] as ContentItem[]
          }
        };

        // Get service categories
        const serviceCategories = [
          {
            id: 'artistic',
            title: 'Maquillaje Artístico',
            description: 'Transformaciones creativas para eventos especiales y producciones',
            thumbnail: null as ContentItem | null
          },
          {
            id: 'social',
            title: 'Maquillaje Social',
            description: 'Belleza natural para ocasiones especiales',
            thumbnail: null as ContentItem | null
          },
          {
            id: 'bodypaint',
            title: 'Body Paint',
            description: 'Arte corporal para eventos y sesiones fotográficas',
            thumbnail: null as ContentItem | null
          },
          {
            id: 'editorial',
            title: 'Maquillaje Editorial',
            description: 'Estilos vanguardistas para moda y fotografía',
            thumbnail: null as ContentItem | null
          }
        ];

        if (initialPortfolioEntry) {
          // Get hero image
          const images = initialPortfolioEntry.fields.images;
          const videos = initialPortfolioEntry.fields.videos;
          
          if (images && Array.isArray(images) && images.length > 0) {
            const heroImage = images.find((img) => img.sys.id === '7kxPnWB6qFXQSrg4CnLPhN');
            console.log('Hero image found:', heroImage ? 'Yes' : 'No');
            if (heroImage) {
              const heroImageUrl = typeof heroImage.fields.file?.url === 'string' 
                ? formatContentfulUrl(heroImage.fields.file.url)
                : '';

              initialPortfolioData.heroImage = {
                category: 'hero',
                type: 'image' as const,
                metadata: {
                  tags: heroImage.metadata?.tags?.map((tag: { sys: { id: string } }) => ({
                    sys: {
                      type: "Link" as const,
                      linkType: "Tag" as const,
                      id: tag.sys.id
                    }
                  })) || []
                },
                sys: {
                  ...heroImage.sys,
                  type: "Asset" as const,
                  locale: heroImage.sys.locale || 'en-US',
                  space: {
                    sys: {
                      type: "Link" as const,
                      linkType: "Space" as const,
                      id: heroImage.sys.space.sys.id
                    }
                  },
                  environment: {
                    sys: {
                      type: "Link" as const,
                      linkType: "Environment" as const,
                      id: heroImage.sys.environment.sys.id
                    }
                  }
                },
                fields: {
                  title: typeof heroImage.fields.title === 'string' ? heroImage.fields.title : '',
                  description: typeof heroImage.fields.description === 'string' ? heroImage.fields.description : '',
                  technic: typeof (initialPortfolioEntry.fields as { technic?: string }).technic === 'string' ? (initialPortfolioEntry.fields as { technic?: string }).technic : undefined,
                  file: {
                    url: heroImageUrl,
                    contentType: typeof heroImage.fields.file?.contentType === 'string' ? heroImage.fields.file.contentType : '',
                    details: {
                      size: 0,
                      duration: undefined
                    }
                  }
                }
              };
            }

            // Get thumbnails for service categories
            images.forEach((img) => {
              if (img.sys.id !== '7kxPnWB6qFXQSrg4CnLPhN') { // Skip hero image
                const serviceItemUrl = typeof img.fields.file?.url === 'string' 
                  ? formatContentfulUrl(img.fields.file.url)
                  : '';

                const serviceItem: ContentItem = {
                  category: (initialPortfolioEntry.fields.title || '') as string,
                  type: 'image' as const,
                  metadata: {
                    tags: img.metadata?.tags?.map((tag: { sys: { id: string } }) => ({
                      sys: {
                        type: "Link" as const,
                        linkType: "Tag" as const,
                        id: tag.sys.id
                      }
                    })) || []
                  },
                  sys: {
                    ...img.sys,
                    type: "Asset" as const,
                    locale: img.sys.locale || 'en-US',
                    space: {
                      sys: {
                        type: "Link" as const,
                        linkType: "Space" as const,
                        id: img.sys.space.sys.id
                      }
                    },
                    environment: {
                      sys: {
                        type: "Link" as const,
                        linkType: "Environment" as const,
                        id: img.sys.environment.sys.id
                      }
                    }
                  },
                  fields: {
                    title: typeof img.fields.title === 'string' ? img.fields.title : '',
                    description: typeof img.fields.description === 'string' ? img.fields.description : '',
                    technic: typeof (initialPortfolioEntry.fields as { technic?: string }).technic === 'string' ? (initialPortfolioEntry.fields as { technic?: string }).technic : undefined,
                    file: {
                      url: serviceItemUrl,
                      contentType: typeof img.fields.file?.contentType === 'string' ? img.fields.file.contentType : '',
                      details: {
                        size: 0,
                        duration: undefined
                      }
                    }
                  }
                };

                // Categorize based on description or title
                const description = img.fields.description?.toString().toLowerCase() || '';
                const title = img.fields.title?.toString().toLowerCase() || '';

                if (description.includes('artístico') || title.includes('artístico') || 
                    description.includes('artistico') || title.includes('artistico')) {
                  initialPortfolioData.services.artistic.push(serviceItem);
                } else if (description.includes('social') || title.includes('social')) {
                  initialPortfolioData.services.social.push(serviceItem);
                } else if (description.includes('bodypaint') || title.includes('bodypaint') ||
                           description.includes('body paint') || title.includes('body paint') ||
                           description.includes('pintura corporal') || title.includes('pintura corporal')) {
                  initialPortfolioData.services.bodypaint.push(serviceItem);
                } else if (description.includes('editorial') || title.includes('editorial')) {
                  initialPortfolioData.services.editorial.push(serviceItem);
                }
              }
            });

            // Assign carousel images to services if they have no images
            galleryEntries.forEach(entry => {
              const entryImages = entry.fields.images;
              if (entryImages && Array.isArray(entryImages) && entryImages.length > 0) {
                entryImages.forEach(img => {
                  const serviceItemUrl = typeof img.fields.file?.url === 'string' 
                    ? formatContentfulUrl(img.fields.file.url)
                    : '';

                  const serviceItem: ContentItem = {
                    category: (entry.fields.title || '') as string,
                    type: 'image' as const,
                    metadata: {
                      tags: img.metadata?.tags?.map((tag: { sys: { id: string } }) => ({
                        sys: {
                          type: "Link" as const,
                          linkType: "Tag" as const,
                          id: tag.sys.id
                        }
                      })) || []
                    },
                    sys: {
                      ...img.sys,
                      type: "Asset" as const,
                      locale: img.sys.locale || 'en-US',
                      space: {
                        sys: {
                          type: "Link" as const,
                          linkType: "Space" as const,
                          id: img.sys.space.sys.id
                        }
                      },
                      environment: {
                        sys: {
                          type: "Link" as const,
                          linkType: "Environment" as const,
                          id: img.sys.environment.sys.id
                        }
                      }
                    },
                    fields: {
                      title: typeof img.fields.title === 'string' ? img.fields.title : '',
                      description: typeof img.fields.description === 'string' ? img.fields.description : '',
                      technic: typeof (entry.fields as { technic?: string }).technic === 'string' ? (entry.fields as { technic?: string }).technic : undefined,
                      file: {
                        url: serviceItemUrl,
                        contentType: typeof img.fields.file?.contentType === 'string' ? img.fields.file.contentType : '',
                        details: {
                          size: 0,
                          duration: undefined
                        }
                      }
                    }
                  };

                  // Categorize based on description or title
                  const description = img.fields.description?.toString().toLowerCase() || '';
                  const title = img.fields.title?.toString().toLowerCase() || '';

                  if (description.includes('artístico') || title.includes('artístico') || 
                      description.includes('artistico') || title.includes('artistico')) {
                    initialPortfolioData.services.artistic.push(serviceItem);
                  } else if (description.includes('social') || title.includes('social')) {
                    initialPortfolioData.services.social.push(serviceItem);
                  } else if (description.includes('bodypaint') || title.includes('bodypaint') ||
                             description.includes('body paint') || title.includes('body paint') ||
                             description.includes('pintura corporal') || title.includes('pintura corporal')) {
                    initialPortfolioData.services.bodypaint.push(serviceItem);
                  } else if (description.includes('editorial') || title.includes('editorial')) {
                    initialPortfolioData.services.editorial.push(serviceItem);
                  }
                });
              }
            });

            // Ensure each service has a thumbnail
            serviceCategories.forEach((category) => {
              if (!category.thumbnail) {
                // Look for an image from the corresponding service
                const serviceImages = initialPortfolioData.services[category.id as keyof typeof initialPortfolioData.services];
                if (serviceImages && Array.isArray(serviceImages) && serviceImages.length > 0) {
                  category.thumbnail = serviceImages[0];
                } else if (galleryEntries.length > 0) {
                  // If no service-specific images, use the first carousel image
                  const firstEntry = galleryEntries[0];
                  const firstEntryImages = firstEntry.fields.images;
                  if (firstEntryImages && Array.isArray(firstEntryImages) && firstEntryImages.length > 0) {
                    const firstImage = firstEntryImages[0];
                    const firstImageUrl = typeof firstImage.fields.file?.url === 'string' 
                      ? formatContentfulUrl(firstImage.fields.file.url)
                      : '';

                    const serviceItem: ContentItem = {
                      category: (initialPortfolioEntry.fields.title || '') as string,
                      type: 'image' as const,
                      metadata: {
                        tags: firstImage.metadata?.tags?.map((tag: { sys: { id: string } }) => ({
                          sys: {
                            type: "Link" as const,
                            linkType: "Tag" as const,
                            id: tag.sys.id
                          }
                        })) || []
                      },
                      sys: {
                        ...firstImage.sys,
                        type: "Asset" as const,
                        locale: firstImage.sys.locale || 'en-US',
                        space: {
                          sys: {
                            type: "Link" as const,
                            linkType: "Space" as const,
                            id: firstImage.sys.space.sys.id
                          }
                        },
                        environment: {
                          sys: {
                            type: "Link" as const,
                            linkType: "Environment" as const,
                            id: firstImage.sys.environment.sys.id
                          }
                        }
                      },
                      fields: {
                        title: typeof firstImage.fields.title === 'string' ? firstImage.fields.title : '',
                        description: typeof firstImage.fields.description === 'string' ? firstImage.fields.description : '',
                        technic: typeof (firstEntry.fields as { technic?: string }).technic === 'string' ? (firstEntry.fields as { technic?: string }).technic : undefined,
                        file: {
                          url: firstImageUrl,
                          contentType: typeof firstImage.fields.file?.contentType === 'string' ? firstImage.fields.file.contentType : '',
                          details: {
                            size: 0,
                            duration: undefined
                          }
                        }
                      }
                    };
                    category.thumbnail = serviceItem;
                  }
                }
              }
            });
          }

          // Get background video
          if (videos && Array.isArray(videos) && videos.length > 0) {
            const backgroundVideo = videos.find((vid) => vid.sys.id === '2aGl1kgVmsLz5D4lk0MNJa');
            console.log('Background video found:', backgroundVideo ? 'Yes' : 'No');
            if (backgroundVideo) {
              const backgroundVideoUrl = typeof backgroundVideo.fields.file?.url === 'string' 
                ? formatContentfulUrl(backgroundVideo.fields.file.url)
                : '';

              initialPortfolioData.backgroundVideo = {
                category: 'background',
                type: 'video' as const,
                metadata: {
                  tags: backgroundVideo.metadata?.tags?.map((tag: { sys: { id: string } }) => ({
                    sys: {
                      type: "Link" as const,
                      linkType: "Tag" as const,
                      id: tag.sys.id
                    }
                  })) || []
                },
                sys: {
                  ...backgroundVideo.sys,
                  type: "Asset" as const,
                  locale: backgroundVideo.sys.locale || 'en-US',
                  space: {
                    sys: {
                      type: "Link" as const,
                      linkType: "Space" as const,
                      id: backgroundVideo.sys.space.sys.id
                    }
                  },
                  environment: {
                    sys: {
                      type: "Link" as const,
                      linkType: "Environment" as const,
                      id: backgroundVideo.sys.environment.sys.id
                    }
                  }
                },
                fields: {
                  title: typeof backgroundVideo.fields.title === 'string' ? backgroundVideo.fields.title : '',
                  description: typeof backgroundVideo.fields.description === 'string' ? backgroundVideo.fields.description : '',
                  technic: typeof (initialPortfolioEntry.fields as { technic?: string }).technic === 'string' ? (initialPortfolioEntry.fields as { technic?: string }).technic : undefined,
                  file: {
                    url: backgroundVideoUrl,
                    contentType: typeof backgroundVideo.fields.file?.contentType === 'string' ? backgroundVideo.fields.file.contentType : '',
                    details: {
                      size: 0,
                      duration: undefined
                    }
                  }
                }
              };
            }
          }
        }

        setPortfolioData({
          gallery: galleryData,
          initialPortfolio: initialPortfolioData,
          serviceCategories
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { portfolioData, loading, error };
};

export default useContentfulData;