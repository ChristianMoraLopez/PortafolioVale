// hooks/useContentfulData.ts
import { useState, useEffect } from 'react';
import { createClient, EntryCollection } from 'contentful';
import { ContentfulData, ParagraphContent, ContentItem } from '@/types/PortfolioContentFulTypes';

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

const useContentfulData = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
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
        const entries: EntryCollection<any> = await client.getEntries({
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
          const entryImages = initialPortfolioEntry.fields.images as any[] | undefined;
          const entryVideos = initialPortfolioEntry.fields.videos as any[] | undefined;
          console.log('Initial portfolio entry images:', entryImages?.map((img: any) => img.sys.id));
          console.log('Initial portfolio entry videos:', entryVideos?.map((vid: any) => vid.sys.id));
        }

        // Transform gallery entries
        const galleryData: ContentItem[] = galleryEntries.flatMap(entry => {
          const items: ContentItem[] = [];
          
          const entryImages = entry.fields.images as any[] | undefined;
          const entryVideos = entry.fields.videos as any[] | undefined;
          
          // Add images
          if (entryImages && entryImages.length > 0) {
            items.push(...entryImages.map(img => {
              const title = typeof img.fields.title === 'string' ? img.fields.title : '';
              const description = typeof img.fields.description === 'string' ? img.fields.description : '';
              const fileUrl = typeof img.fields.file?.url === 'string' 
                ? formatContentfulUrl(img.fields.file.url)
                : '';
              const contentType = typeof img.fields.file?.contentType === 'string' ? img.fields.file.contentType : '';
              const details = img.fields.file?.details as any;
              const size = typeof details?.size === 'number' ? details.size : 0;
              const duration = typeof details?.duration === 'number' ? details.duration : undefined;

              return {
                category: typeof entry.fields.title === 'string' ? entry.fields.title : '',
                type: 'image' as const,
                metadata: img.metadata,
                sys: {
                  ...img.sys,
                  locale: img.sys.locale || 'en-US'
                },
                fields: {
                  title,
                  description,
                  technic: typeof entry.fields.technic === 'string' ? entry.fields.technic : undefined,
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
          if (entryVideos && entryVideos.length > 0) {
            items.push(...entryVideos.map(vid => {
              const title = typeof vid.fields.title === 'string' ? vid.fields.title : '';
              const description = typeof vid.fields.description === 'string' ? vid.fields.description : '';
              const fileUrl = typeof vid.fields.file?.url === 'string' 
                ? formatContentfulUrl(vid.fields.file.url)
                : '';
              const contentType = typeof vid.fields.file?.contentType === 'string' ? vid.fields.file.contentType : '';
              const details = vid.fields.file?.details as any;
              const size = typeof details?.size === 'number' ? details.size : 0;
              const duration = typeof details?.duration === 'number' ? details.duration : undefined;

              return {
                category: typeof entry.fields.title === 'string' ? entry.fields.title : '',
                type: 'video' as const,
                metadata: vid.metadata,
                sys: {
                  ...vid.sys,
                  locale: vid.sys.locale || 'en-US'
                },
                fields: {
                  title,
                  description,
                  technic: typeof entry.fields.technic === 'string' ? entry.fields.technic : undefined,
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
        let initialPortfolioData = {
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
          const images = initialPortfolioEntry.fields.images as any[] | undefined;
          const videos = initialPortfolioEntry.fields.videos as any[] | undefined;
          
          if (images) {
            const heroImage = images.find((img) => img.sys.id === '7kxPnWB6qFXQSrg4CnLPhN');
            console.log('Hero image found:', heroImage ? 'Yes' : 'No');
            if (heroImage) {
              const heroImageUrl = typeof heroImage.fields.file?.url === 'string' 
                ? formatContentfulUrl(heroImage.fields.file.url)
                : '';

              initialPortfolioData.heroImage = {
                category: 'hero',
                type: 'image' as const,
                metadata: heroImage.metadata,
                sys: {
                  ...heroImage.sys,
                  locale: heroImage.sys.locale || 'en-US'
                },
                fields: {
                  title: typeof heroImage.fields.title === 'string' ? heroImage.fields.title : '',
                  description: typeof heroImage.fields.description === 'string' ? heroImage.fields.description : '',
                  technic: typeof initialPortfolioEntry.fields.technic === 'string' ? initialPortfolioEntry.fields.technic : undefined,
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
                  category: typeof initialPortfolioEntry.fields.title === 'string' ? initialPortfolioEntry.fields.title : '',
                  type: 'image' as const,
                  metadata: img.metadata,
                  sys: {
                    ...img.sys,
                    locale: img.sys.locale || 'en-US'
                  },
                  fields: {
                    title: typeof img.fields.title === 'string' ? img.fields.title : '',
                    description: typeof img.fields.description === 'string' ? img.fields.description : '',
                    technic: typeof initialPortfolioEntry.fields.technic === 'string' ? initialPortfolioEntry.fields.technic : undefined,
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

                // Asignar la imagen al servicio correspondiente basado en la categoría
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

            // Asignar las imágenes del carrusel a los servicios si no tienen imágenes
            galleryEntries.forEach(entry => {
              const entryImages = entry.fields.images as any[] | undefined;
              if (entryImages && entryImages.length > 0) {
                entryImages.forEach(img => {
                  const serviceItemUrl = typeof img.fields.file?.url === 'string' 
                    ? formatContentfulUrl(img.fields.file.url)
                    : '';

                  const serviceItem: ContentItem = {
                    category: typeof entry.fields.title === 'string' ? entry.fields.title : '',
                    type: 'image' as const,
                    metadata: img.metadata,
                    sys: {
                      ...img.sys,
                      locale: img.sys.locale || 'en-US'
                    },
                    fields: {
                      title: typeof img.fields.title === 'string' ? img.fields.title : '',
                      description: typeof img.fields.description === 'string' ? img.fields.description : '',
                      technic: typeof entry.fields.technic === 'string' ? entry.fields.technic : undefined,
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

                  // Asignar la imagen al servicio correspondiente basado en la categoría
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
            serviceCategories.forEach((category, index) => {
              if (!category.thumbnail) {
                // Buscar una imagen del servicio correspondiente
                const serviceImages = initialPortfolioData.services[category.id as keyof typeof initialPortfolioData.services];
                if (serviceImages && serviceImages.length > 0) {
                  category.thumbnail = serviceImages[0];
                } else if (galleryEntries.length > 0) {
                  // Si no hay imágenes específicas del servicio, usar la primera imagen del carrusel
                  const firstEntry = galleryEntries[0];
                  const firstEntryImages = firstEntry.fields.images as any[] | undefined;
                  if (firstEntryImages && firstEntryImages.length > 0) {
                    const firstImage = firstEntryImages[0];
                    const firstImageUrl = typeof firstImage.fields.file?.url === 'string' 
                      ? formatContentfulUrl(firstImage.fields.file.url)
                      : '';

                    const serviceItem: ContentItem = {
                      category: typeof firstEntry.fields.title === 'string' ? firstEntry.fields.title : '',
                      type: 'image' as const,
                      metadata: firstImage.metadata,
                      sys: {
                        ...firstImage.sys,
                        locale: firstImage.sys.locale || 'en-US'
                      },
                      fields: {
                        title: typeof firstImage.fields.title === 'string' ? firstImage.fields.title : '',
                        description: typeof firstImage.fields.description === 'string' ? firstImage.fields.description : '',
                        technic: typeof firstEntry.fields.technic === 'string' ? firstEntry.fields.technic : undefined,
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
          if (videos) {
            const backgroundVideo = videos.find((vid) => vid.sys.id === '2aGl1kgVmsLz5D4lk0MNJa');
            console.log('Background video found:', backgroundVideo ? 'Yes' : 'No');
            if (backgroundVideo) {
              const backgroundVideoUrl = typeof backgroundVideo.fields.file?.url === 'string' 
                ? formatContentfulUrl(backgroundVideo.fields.file.url)
                : '';

              initialPortfolioData.backgroundVideo = {
                category: 'background',
                type: 'video' as const,
                metadata: backgroundVideo.metadata,
                sys: {
                  ...backgroundVideo.sys,
                  locale: backgroundVideo.sys.locale || 'en-US'
                },
                fields: {
                  title: typeof backgroundVideo.fields.title === 'string' ? backgroundVideo.fields.title : '',
                  description: typeof backgroundVideo.fields.description === 'string' ? backgroundVideo.fields.description : '',
                  technic: typeof initialPortfolioEntry.fields.technic === 'string' ? initialPortfolioEntry.fields.technic : undefined,
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
          serviceCategories: serviceCategories
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