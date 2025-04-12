// hooks/useContentfulData.ts
import { useState, useEffect } from 'react';
import { createClient, EntryCollection } from 'contentful';
import { ContentfulData, ParagraphContent } from '@/types/PortfolioContentFulTypes';

const useContentfulData = () => {
  const [data, setData] = useState<ContentfulData[]>([]);
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

        const contentfulData: ContentfulData[] = entries.items.map((entry) => ({
          metadata: {
            tags: entry.metadata?.tags?.map((tag: any) => tag.sys.id) || [],
          },
          sys: {
            space: entry.sys.space || { sys: { type: 'Link', linkType: 'Space', id: '' } },
            id: entry.sys.id || '',
            type: entry.sys.type || 'Entry',
            createdAt: entry.sys.createdAt || '',
            updatedAt: entry.sys.updatedAt || '',
            environment: entry.sys.environment || { sys: { id: '', type: 'Link', linkType: 'Environment' } },
            revision: entry.sys.revision || 0,
            contentType: entry.sys.contentType || { sys: { type: 'Link', linkType: 'ContentType', id: '' } },
            locale: entry.sys.locale || 'en-US',
          },
          fields: {
            title: (entry.fields.title as string) || '',
            images: (entry.fields.images as any[])?.map((img: any) => ({
              sys: {
                space: img.sys.space || { sys: { type: 'Link', linkType: 'Space', id: '' } },
                id: img.sys.id || '',
                type: img.sys.type || 'Asset',
                createdAt: img.sys.createdAt || '',
                updatedAt: img.sys.updatedAt || '',
                environment: img.sys.environment || { sys: { id: '', type: 'Link', linkType: 'Environment' } },
                revision: img.sys.revision || 0,
                locale: img.sys.locale || 'en-US',
              },
              fields: {
                title: img.fields.title || '',
                description: img.fields.description,
                file: {
                  url: img.fields.file?.url || '',
                  contentType: img.fields.file?.contentType || '',
                  details: img.fields.file?.details || { size: 0 },
                },
              },
              metadata: { tags: img.metadata?.tags || [] },
            })) || [],
            description: (entry.fields.description as { data: unknown; content: ParagraphContent[]; nodeType: 'document' }) || { data: {}, content: [], nodeType: 'document' },
            date: (entry.fields.date as string) || '',
            client: (entry.fields.client as string) || '',
            servicesProvided: (entry.fields.servicesProvided as string) || '',
            videos: (entry.fields.videos as any[])?.map((vid: any) => ({
              sys: {
                space: vid.sys.space || { sys: { type: 'Link', linkType: 'Space', id: '' } },
                id: vid.sys.id || '',
                type: vid.sys.type || 'Asset',
                createdAt: vid.sys.createdAt || '',
                updatedAt: vid.sys.updatedAt || '',
                environment: vid.sys.environment || { sys: { id: '', type: 'Link', linkType: 'Environment' } },
                revision: vid.sys.revision || 0,
                locale: vid.sys.locale || 'en-US',
              },
              fields: {
                title: vid.fields.title || '',
                description: vid.fields.description,
                file: {
                  url: vid.fields.file?.url || '',
                  contentType: vid.fields.file?.contentType || '',
                  details: vid.fields.file?.details || { size: 0 },
                },
              },
              metadata: { tags: vid.metadata?.tags || [] },
            })) || [],
            location: (entry.fields.location as string) || '',
            technic: (entry.fields.technic as string) || '',
          },
        }));

        setData(contentfulData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useContentfulData;