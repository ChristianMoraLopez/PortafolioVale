// types/PortfolioContentFulTypes.ts
import { Asset as ContentfulAsset } from 'contentful';

// Define el tipo para TagLink
interface TagLink {
  sys: {
    type: 'Link';
    linkType: 'Tag';
    id: string;
  };
}

// Define AssetSys tipo
export interface AssetSys {
  space: {
    sys: {
      type: 'Link';
      linkType: 'Space';
      id: string;
    };
  };
  id: string;
  type: 'Asset';
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: {
      id: string;
      type: 'Link';
      linkType: 'Environment';
    };
  };
  revision: number;
  locale: string;
}

// Define el tipo para los campos combinados
export type CombinedFields = {
  title: string;
  description?: string;
  technic?: string;
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
      duration?: number;
    };
  };
};

// Define ContentItem interface
export interface ContentItem {
  category: string;
  type: 'image' | 'video';
  metadata: {
    tags: TagLink[];
  };
  sys: AssetSys;
  fields: CombinedFields;
}

// Extiende el tipo ContentfulAsset para incluir metadata
export interface ExtendedAsset extends ContentfulAsset {
  metadata: {
    tags: TagLink[];
  };
}

// Define VideoFields tipo
export type VideoFields = {
  title: string;
  description?: string;
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
      duration?: number;
    };
  };
};

// Define AssetFields tipo
export type AssetFields = {
  title: string;
  description?: string;
  technic?: string;
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
    };
  };
};

// Define ParagraphContent tipo
export type ParagraphContent = {
  data: {};
  content: Array<{
    data: {};
    marks: Array<{}>;
    value: string;
    nodeType: 'text';
  }>;
  nodeType: 'paragraph';
};

// Define ContentfulData tipo
export type ContentfulData = {
  metadata: {
    tags: string[];
  };
  sys: {
    space: {
      sys: {
        type: 'Link';
        linkType: 'Space';
        id: string;
      };
    };
    id: string;
    type: 'Entry';
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: 'Link';
        linkType: 'Environment';
      };
    };
    revision: number;
    contentType: {
      sys: {
        type: 'Link';
        linkType: 'ContentType';
        id: string;
      };
    };
    locale: string;
  };
  fields: {
    title: string;
    images: ExtendedAsset[];
    description: {
      data: unknown;
      content: ParagraphContent[];
      nodeType: 'document';
    };
    date: string;
    client: string;
    servicesProvided: string;
    videos: ExtendedAsset[];
    location: string;
    technic: string;
  };
};